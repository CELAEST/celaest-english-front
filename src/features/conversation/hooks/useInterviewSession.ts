import { useState, useEffect, useRef, useCallback } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import {
  InterviewQuestionItem,
  SpecificErrorItem,
} from "../services/interviewEngineService";
import { DynamicQuestionService } from "../services/dynamicQuestionService";
import { CoreAiEvaluatorService } from "../services/coreAiEvaluatorService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { AudioCaptureService } from "../services/audioCaptureService";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";

export type InterviewStatus =
  | "IDLE"
  | "AI_SPEAKING"
  | "RECORDING"
  | "THINKING"
  | "PAUSED";

export type ProcessingStage =
  | "IDLE"
  | "TRANSCRIBING"
  | "ANALYZING"
  | "PREPARING";

export const useInterviewSession = (roleName: string = "Product Manager") => {
  const [status, setStatus] = useState<InterviewStatus>("IDLE");
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("IDLE");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [speechRate, setSpeechRate] = useState<number>(0.95);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [turnFeedback, setTurnFeedback] = useState<ComprehensiveTurnFeedback | null>(null);
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(new Set());
  const [micVolume, setMicVolume] = useState<number>(0);
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(false);

  const animFrameRef = useRef<number | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isAiSpeakingRef = useRef<boolean>(false);
  const userTranscriptRef = useRef<string>("");

  // Dynamically generate question for the current question index (Continuous infinite rounds)
  const currentQuestion: InterviewQuestionItem =
    DynamicQuestionService.getQuestionForIndex(currentQuestionIndex, roleName);

  // Ref to always have the latest question in async callbacks and avoid stale closures
  const currentQuestionRef = useRef<InterviewQuestionItem>(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const currentRound = Math.floor(currentQuestionIndex / 5) + 1;
  const questionInRound = (currentQuestionIndex % 5) + 1;
  const totalQuestionsInRound = 5;

  // Request mic permission and setup cleanup on mount
  useEffect(() => {
    isMountedRef.current = true;

    AudioCaptureService.initMicrophone().then(() => {
      // mic initialized
    });

    return () => {
      isMountedRef.current = false;
      SpeechSynthesisService.stop();
      AudioCaptureService.cleanup();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Poll mic volume only while in RECORDING status
  useEffect(() => {
    if (status !== "RECORDING" || isAiSpeakingRef.current) {
      setMicVolume(0);
      return;
    }

    let isPolling = true;
    const pollVolume = () => {
      if (!isPolling || isAiSpeakingRef.current) return;
      const vol = AudioCaptureService.getMicVolume();
      setMicVolume(vol);
      animFrameRef.current = requestAnimationFrame(pollVolume);
    };

    pollVolume();

    return () => {
      isPolling = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status]);

  // Speaking timer count up (No cutoffs, allows unlimited speaking time)
  useEffect(() => {
    if (status !== "RECORDING") return;

    const interval = setInterval(() => {
      setSpeakingSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  /**
   * Processes user answer using the CELAEST-CORE IA-Mesh with graceful local fallback
   */
  const processTurn = useCallback(
    async (spokenText: string, audioUrl?: string | null, durationSeconds?: number) => {
      if (!isMountedRef.current) return;

      const activeQuestion = currentQuestionRef.current || currentQuestion;

      setStatus("THINKING");
      setProcessingStage("ANALYZING");
      AudioCaptureService.stop();

      // Real AI Feedback via CELAEST-CORE IA-Mesh (Gemini 2.5 Flash / Groq) with UniversalLinguisticParser fallback
      const feedback = await CoreAiEvaluatorService.evaluate(
        spokenText,
        activeQuestion
      );

      if (!isMountedRef.current) return;
      if (feedback) {
        setProcessingStage("PREPARING");
        if (audioUrl) {
          feedback.userAudioUrl = audioUrl;
        }
        if (durationSeconds) {
          feedback.recordingDurationSeconds = durationSeconds;
        }
        setTurnFeedback(feedback);
        setShowAnalysisModal(true);
      }
      setProcessingStage("IDLE");
      setStatus("IDLE");
    },
    [currentQuestion]
  );

  /**
   * Starts Speech Recognition without automatic cutoff (User controls start and stop)
   */
  const startRecording = useCallback(() => {
    if (typeof window === "undefined") return;
    if (isAiSpeakingRef.current) return;

    setUserTranscript("");
    userTranscriptRef.current = "";
    setSpeakingSeconds(0);
    setStatus("RECORDING");

    AudioCaptureService.startRecognition({
      lang: "en-US",
      onTranscript: (liveTranscript: string) => {
        if (!isMountedRef.current || isAiSpeakingRef.current) return;
        setUserTranscript(liveTranscript);
        userTranscriptRef.current = liveTranscript;
      },
      onError: () => {
        // Soft error recovery
      },
    });
  }, []);

  /**
   * Stops Recording and submits the turn immediately for deep analysis with Whisper STT & audio capture
   */
  const stopRecordingAndAnalyze = useCallback(async () => {
    setStatus("THINKING");
    setProcessingStage("TRANSCRIBING");

    // 1. Capture audio recording blob & playback URL
    const { audioBlob, audioUrl, durationSeconds } = await AudioCaptureService.stopAndGetAudio();

    // 2. Transcribe via Whisper AI for maximum ESL acoustic accuracy
    let finalTranscript = userTranscriptRef.current || userTranscript;
    if (audioBlob) {
      try {
        const whisperTranscript = await AudioCaptureService.transcribeAudio(audioBlob);
        if (whisperTranscript && whisperTranscript.trim().length > 3) {
          finalTranscript = whisperTranscript.trim();
          setUserTranscript(finalTranscript);
          userTranscriptRef.current = finalTranscript;
        }
      } catch (err) {
        console.warn("Whisper transcription fallback to web speech:", err);
      }
    }

    await processTurn(finalTranscript, audioUrl, durationSeconds);
  }, [processTurn, userTranscript]);

  /**
   * Toggle recording (Tap to talk, tap again to finish)
   */
  const toggleRecording = useCallback(() => {
    if (status === "RECORDING") {
      stopRecordingAndAnalyze();
    } else if (status === "IDLE" || status === "PAUSED") {
      startRecording();
    }
  }, [status, startRecording, stopRecordingAndAnalyze]);

  /**
   * Ask the current question using TTS with anti-audio-leak protection
   */
  const speakQuestion = useCallback(
    async (rate?: number) => {
      SpeechSynthesisService.stop();
      AudioCaptureService.stop();

      const activeQuestion = currentQuestionRef.current || currentQuestion;

      isAiSpeakingRef.current = true;
      setStatus("AI_SPEAKING");
      setUserTranscript("");
      userTranscriptRef.current = "";

      // Fallback safety timer
      const safetyTimeout = setTimeout(() => {
        if (isMountedRef.current && status === "AI_SPEAKING") {
          isAiSpeakingRef.current = false;
          setStatus("IDLE");
          setSpeakingSeconds(0);
        }
      }, 5000);

      await SpeechSynthesisService.speak(activeQuestion.question, {
        rate: rate ?? speechRate,
        onEnd: () => {
          clearTimeout(safetyTimeout);
          if (!isMountedRef.current) return;

          isAiSpeakingRef.current = false;
          setStatus("IDLE");
          setSpeakingSeconds(0);
        },
      });
    },
    [currentQuestion, speechRate, status]
  );

  // Trigger initial question on question change
  useEffect(() => {
    speakQuestion();
  }, [currentQuestionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Action: Repeat the question (optional slowed down)
   */
  const repeatQuestion = (slow: boolean = false) => {
    const targetRate = slow ? Math.max(0.7, speechRate - 0.2) : speechRate;
    speakQuestion(targetRate);
  };

  /**
   * Action: Skip to next question / next round (Continuous infinite questions)
   */
  const skipQuestion = () => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
    setUserTranscript("");
    userTranscriptRef.current = "";
    setTurnFeedback(null); // Clear previous feedback
    setCurrentQuestionIndex((prev) => prev + 1); // Seamless continuous generation
  };

  /**
   * Action: Pause interview
   */
  const pauseInterview = () => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
    setStatus("PAUSED");
  };

  /**
   * Action: Resume interview
   */
  const resumeInterview = () => {
    isAiSpeakingRef.current = false;
    setStatus("IDLE");
  };

  /**
   * Action: Test / Submit custom text directly
   */
  const submitCustomAnswer = async (text: string) => {
    setUserTranscript(text);
    userTranscriptRef.current = text;
    await processTurn(text);
  };

  /**
   * Action: Save an individual specific error to Memory Bank
   */
  const saveSpecificErrorToMemory = async (errorItem: SpecificErrorItem): Promise<boolean> => {
    try {
      await apiMemoryRepository.createCard({
        category: "INTERVIEW",
        userSaid: errorItem.userSaidContext,
        betterWay: errorItem.betterWay,
        translationSpanish: errorItem.translationSpanish,
        errorWord: errorItem.errorWord,
        correctWord: errorItem.correctWord,
        grammarExplanation: errorItem.explanation,
        cefrLevel: errorItem.cefrLevel || "B2",
      });

      setSavedErrorIds((prev) => new Set([...prev, errorItem.id]));
      return true;
    } catch (err) {
      console.warn("Failed to add interview correction to Memory Bank", err);
      return false;
    }
  };

  /**
   * Action: Save ALL errors of the turn to Memory Bank in one click
   */
  const saveAllErrorsToMemory = async (): Promise<number> => {
    if (!turnFeedback || turnFeedback.unclearOrErrorWords.length === 0) return 0;
    let savedCount = 0;

    for (const item of turnFeedback.unclearOrErrorWords) {
      if (!savedErrorIds.has(item.id)) {
        const success = await saveSpecificErrorToMemory(item);
        if (success) savedCount++;
      }
    }

    return savedCount;
  };

  return {
    status,
    processingStage,
    isListening: status === "RECORDING",
    isAiSpeaking: status === "AI_SPEAKING",
    isThinking: status === "THINKING",
    isPaused: status === "PAUSED",
    roleName,
    companyContext: "Scale-up SaaS & Enterprise Platforms",
    currentRound,
    questionInRound,
    totalQuestionsInRound,
    currentQuestionIndex: questionInRound,
    overallQuestionIndex: currentQuestionIndex + 1,
    currentQuestion,
    totalQuestions: totalQuestionsInRound,
    overallTotalQuestions: 50,
    remainingSeconds: 60,
    speakingSeconds,
    speechRate,
    setSpeechRate,
    userTranscript,
    setUserTranscript,
    turnFeedback,
    savedErrorIds,
    micVolume,
    showAnalysisModal,
    setShowAnalysisModal,
    repeatQuestion,
    skipQuestion,
    pauseInterview,
    resumeInterview,
    takeTime: () => {},
    toggleListening: toggleRecording,
    finishTurnManual: stopRecordingAndAnalyze,
    submitCustomAnswer,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
  };
};
