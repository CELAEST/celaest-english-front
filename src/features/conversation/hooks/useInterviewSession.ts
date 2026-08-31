import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { InterviewQuestionItem, SpecificErrorItem } from "../services/interviewEngineService";
import { DynamicQuestionService } from "../services/dynamicQuestionService";
import { CoreAiEvaluatorService } from "../services/coreAiEvaluatorService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { AudioCaptureService } from "../services/audioCaptureService";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { apiInterviewRepository } from "../../../infrastructure/repositories/ApiInterviewRepository";
import { logger } from "../../../shared/utils/logger";
import {
  loadPersistedInterview,
  savePersistedInterview,
  PersistedInterviewState,
} from "../services/interviewPersistence";
import { setMicVolume } from "./micVolumeStore";

let interviewHydratedOnce = false;
let interviewLastHydratedAt = 0;

export function __resetInterviewHydrationForTest(): void {
  interviewHydratedOnce = false;
  interviewLastHydratedAt = 0;
}

export type InterviewStatus = "IDLE" | "AI_SPEAKING" | "RECORDING" | "THINKING" | "PAUSED";

export type ProcessingStage = "IDLE" | "TRANSCRIBING" | "ANALYZING" | "PREPARING";

export const useInterviewSession = (roleName: string = "Product Manager") => {
  // Restore the last interview turn from localStorage so a reload or an SPA
  // route change never loses the user's answer or the AI feedback.
  const restoredRef = useRef<PersistedInterviewState | null>(loadPersistedInterview());

  const [status, setStatus] = useState<InterviewStatus>("IDLE");
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("IDLE");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    restoredRef.current?.currentQuestionIndex ?? 0,
  );
  const [speechRate, setSpeechRate] = useState<number>(restoredRef.current?.speechRate ?? 0.95);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [userTranscript, setUserTranscript] = useState<string>(
    restoredRef.current?.userTranscript ?? "",
  );
  const [turnFeedback, setTurnFeedback] = useState<ComprehensiveTurnFeedback | null>(
    restoredRef.current?.turnFeedback ?? null,
  );
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(
    new Set(restoredRef.current?.savedErrorIds ?? []),
  );
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(
    restoredRef.current?.showAnalysisModal ?? false,
  );

  const animFrameRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isAiSpeakingRef = useRef<boolean>(false);
  const userTranscriptRef = useRef<string>("");
  // Throttle mic-volume state updates so the ~60fps rAF poll does not
  // re-render the entire conversation tree on every frame.
  const lastVolUpdateRef = useRef<number>(0);
  const lastVolRef = useRef<number>(0);
  const lastTranscriptUpdateRef = useRef<number>(0);

  // Dynamically generate question for the current question index (Continuous infinite rounds).
  // Memoized so the returned object reference is stable across renders that don't change the
  // question — this keeps every callback depending on it (processTurn, speakQuestion,
  // repeatQuestion, stopRecordingAndAnalyze, toggleListening) referentially stable, which in
  // turn makes the memoized ConversationRightPanel / SessionCardsSidenav actually effective.
  const currentQuestion = useMemo<InterviewQuestionItem>(
    () => DynamicQuestionService.getQuestionForIndex(currentQuestionIndex, roleName),
    [currentQuestionIndex, roleName],
  );

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
        lastVolRef.current = 0;
        lastVolUpdateRef.current = 0;
        return;
      }

    let isPolling = true;
    const pollVolume = () => {
      if (!isPolling || isAiSpeakingRef.current) return;
      const vol = AudioCaptureService.getMicVolume();
      const now = (typeof performance !== "undefined" ? performance.now() : Date.now());
      // Update at most ~12.5fps and only when the value meaningfully changes.
      if (now - lastVolUpdateRef.current > 80 || Math.abs(vol - lastVolRef.current) > 0.04) {
        lastVolUpdateRef.current = now;
        lastVolRef.current = vol;
        setMicVolume(vol);
      }
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
   * Processes user answer using the CELAEST-CORE IA-Mesh with graceful local fallback.
   * Guarantees the session never stays stuck in THINKING when evaluation fails.
   */
  const processTurn = useCallback(
    async (spokenText: string, audioUrl?: string | null, durationSeconds?: number) => {
      if (!isMountedRef.current) return;

      const activeQuestion = currentQuestionRef.current || currentQuestion;

      setStatus("THINKING");
      setProcessingStage("ANALYZING");
      AudioCaptureService.stop();

      try {
        // Real AI Feedback via CELAEST-CORE IA-Mesh with UniversalLinguisticParser fallback
        const feedback = await CoreAiEvaluatorService.evaluate(spokenText, activeQuestion);

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
      } catch (err) {
        logger.warn("Interview turn evaluation failed:", err);
      } finally {
        if (isMountedRef.current) {
          setProcessingStage("IDLE");
          setStatus("IDLE");
        }
      }
    },
    [currentQuestion],
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
        userTranscriptRef.current = liveTranscript;
        const now = Date.now();
        if (now - lastTranscriptUpdateRef.current > 180) {
          lastTranscriptUpdateRef.current = now;
          setUserTranscript(liveTranscript);
        }
      },
      onError: () => {
        // Soft error recovery
      },
    });
  }, []);

  /**
   * Stops Recording and submits the turn immediately for deep analysis with Whisper STT & audio capture.
   * Always resets the session state even if audio capture or transcription fails.
   */
  const stopRecordingAndAnalyze = useCallback(async () => {
    setStatus("THINKING");
    setProcessingStage("TRANSCRIBING");

    try {
      // 1. Capture audio recording blob & playback URL
      const { audioBlob, audioUrl, durationSeconds } = await AudioCaptureService.stopAndGetAudio();

      // 2. Transcribe via Whisper AI for maximum ESL acoustic accuracy.
      // NOTE: read the latest transcript from the ref, not from state, so this
      // callback stays referentially stable (userTranscript updates continuously
      // during recording and would otherwise invalidate it on every frame).
      let finalTranscript = userTranscriptRef.current;
      if (audioBlob) {
        try {
          const whisperTranscript = await AudioCaptureService.transcribeAudio(audioBlob);
          if (whisperTranscript && whisperTranscript.trim().length > 3) {
            finalTranscript = whisperTranscript.trim();
            setUserTranscript(finalTranscript);
            userTranscriptRef.current = finalTranscript;
          }
        } catch (err) {
          logger.warn("Whisper transcription fallback to web speech:", err);
        }
      }

      await processTurn(finalTranscript, audioUrl, durationSeconds);
    } catch (err) {
      logger.warn("Failed to finish interview turn:", err);
      if (isMountedRef.current) {
        setProcessingStage("IDLE");
        setStatus("IDLE");
      }
    }
  }, [processTurn]);

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

      // Fallback safety timer (reads the live ref, never a stale closure)
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && isAiSpeakingRef.current) {
          isAiSpeakingRef.current = false;
          setStatus("IDLE");
          setSpeakingSeconds(0);
        }
      }, 5000);

      await SpeechSynthesisService.speak(activeQuestion.question, {
        rate: rate ?? speechRate,
        onEnd: () => {
          if (safetyTimeoutRef.current) {
            clearTimeout(safetyTimeoutRef.current);
            safetyTimeoutRef.current = null;
          }
          if (!isMountedRef.current) return;

          isAiSpeakingRef.current = false;
          setStatus("IDLE");
          setSpeakingSeconds(0);
        },
      });
    },
    [currentQuestion, speechRate],
  );

  // Trigger initial question on question change.
  // Deferred via rAF so the status transition never happens synchronously
  // inside the effect (avoids cascading renders).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      void speakQuestion();
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally re-speak only when the question index advances
  }, [currentQuestionIndex]);

  /**
   * Action: Repeat the question (optional slowed down)
   */
  const repeatQuestion = useCallback(
    (slow: boolean = false) => {
      const targetRate = slow ? Math.max(0.7, speechRate - 0.2) : speechRate;
      speakQuestion(targetRate);
    },
    [speechRate, speakQuestion],
  );

  /**
   * Action: Skip to next question / next round (Continuous infinite questions)
   */
  const skipQuestion = useCallback(() => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
    setUserTranscript("");
    userTranscriptRef.current = "";
    setTurnFeedback(null); // Clear previous feedback
    setCurrentQuestionIndex((prev) => prev + 1); // Seamless continuous generation
  }, [setUserTranscript, setTurnFeedback, setCurrentQuestionIndex]);

  /**
   * Action: Pause interview
   */
  const pauseInterview = useCallback(() => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
    setStatus("PAUSED");
  }, []);

  /**
   * Action: Resume interview
   */
  const resumeInterview = useCallback(() => {
    isAiSpeakingRef.current = false;
    setStatus("IDLE");
  }, []);

  /**
   * Action: Test / Submit custom text directly
   */
  const submitCustomAnswer = useCallback(
    async (text: string) => {
      setUserTranscript(text);
      userTranscriptRef.current = text;
      await processTurn(text);
    },
    [processTurn, setUserTranscript],
  );

  /**
   * Action: Save an individual specific error to Memory Bank
   */
  const saveSpecificErrorToMemory = useCallback(
    async (errorItem: SpecificErrorItem): Promise<boolean> => {
      try {
        await apiMemoryRepository.createCard({
          category: "SPEAKING",
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
        logger.warn("Failed to add interview correction to Memory Bank", err);
        return false;
      }
    },
    [setSavedErrorIds],
  );

  /**
   * Action: Save ALL errors of the turn to Memory Bank in one click
   */
  const saveAllErrorsToMemory = useCallback(async (): Promise<number> => {
    if (!turnFeedback || turnFeedback.unclearOrErrorWords.length === 0) return 0;
    let savedCount = 0;

    for (const item of turnFeedback.unclearOrErrorWords) {
      if (!savedErrorIds.has(item.id)) {
        const success = await saveSpecificErrorToMemory(item);
        if (success) savedCount++;
      }
    }

    return savedCount;
  }, [turnFeedback, savedErrorIds, saveSpecificErrorToMemory]);

  /**
   * Applies a persisted progress payload (from localStorage or backend) back
   * into the live session state so the learner never loses their place.
   */
  const applyProgress = useCallback(
    (p: {
      roleName?: string;
      speechRate?: number;
      currentQuestionIndex?: number;
      userTranscript?: string;
      savedErrorIds?: string[];
      showAnalysisModal?: boolean;
      latestTurn?: Record<string, unknown> | null;
    }) => {
      if (typeof p.speechRate === "number") setSpeechRate(p.speechRate);
      if (typeof p.currentQuestionIndex === "number") setCurrentQuestionIndex(p.currentQuestionIndex);
      if (typeof p.userTranscript === "string") {
        setUserTranscript(p.userTranscript);
        userTranscriptRef.current = p.userTranscript;
      }
      if (Array.isArray(p.savedErrorIds)) setSavedErrorIds(new Set(p.savedErrorIds));
      if (typeof p.showAnalysisModal === "boolean") setShowAnalysisModal(p.showAnalysisModal);
      const fb = p.latestTurn?.feedback;
      if (fb && typeof fb === "object") {
        setTurnFeedback(fb as unknown as ComprehensiveTurnFeedback);
      }
    },
    [],
  );

  // Persist the current turn to localStorage (instant, survives reload/SPA
  // navigation) and mirror it to the backend (durable, cross-device). The
  // backend write is debounced so rapid transcript updates don't spam requests.
  const lastSavedSnapshotRef = useRef<string | null>(null);
  const isFirstPersistRef = useRef(true);

  useEffect(() => {
    const snapshot: PersistedInterviewState = {
      version: 1,
      roleName,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      turnFeedback,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
      updatedAt: Date.now(),
    };

    // Compare without updatedAt (which always changes) so we only persist when
    // something the user actually sees has changed.
    const comparable = JSON.stringify({
      version: 1,
      roleName,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      turnFeedback,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
    });

    // On first mount the state is just the restored snapshot already stored in
    // localStorage, so re-saving it is a wasted network round-trip. Skip it.
    if (isFirstPersistRef.current) {
      isFirstPersistRef.current = false;
      lastSavedSnapshotRef.current = comparable;
      return;
    }

    // No-op guard: never POST (or touch storage) when nothing really changed.
    if (lastSavedSnapshotRef.current === comparable) {
      return;
    }
    lastSavedSnapshotRef.current = comparable;

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(
        () => savePersistedInterview(snapshot),
      );
    } else {
      savePersistedInterview(snapshot);
    }

    const handle = setTimeout(() => {
      apiInterviewRepository
        .saveProgress({
          roleName,
          speechRate,
          currentQuestionIndex,
          userTranscript,
          savedErrorIds: Array.from(savedErrorIds),
          showAnalysisModal,
          latestTurn: {
            question: currentQuestion?.question ?? "",
            transcript: userTranscript,
            feedback: turnFeedback ?? {},
          },
        })
        .catch(() => {
          // Backend sync is best-effort; localStorage already holds the data.
        });
    }, 600);

    return () => clearTimeout(handle);
  }, [
    roleName,
    speechRate,
    currentQuestionIndex,
    userTranscript,
    turnFeedback,
    showAnalysisModal,
    savedErrorIds,
    currentQuestion,
  ]);

  // Hydrate from the backend on mount: if the cloud copy is newer than the
  // locally restored snapshot (e.g. progress made on another device), adopt it.
  // Module-level singleton guarantees a single GET per app lifetime (covers
  // StrictMode double-invoke *and* tab re-mount within stale window).
  const didHydrateRef = useRef(false);
  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;
    if (interviewHydratedOnce && Date.now() - interviewLastHydratedAt < 5 * 60 * 1000) return;
    interviewHydratedOnce = true;
    interviewLastHydratedAt = Date.now();
    let cancelled = false;
    apiInterviewRepository
      .getProgress()
      .then((dto) => {
        if (cancelled || !dto || !dto.updatedAt) return;
        const backendTime = new Date(dto.updatedAt).getTime();
        const localTime = restoredRef.current?.updatedAt ?? 0;
        if (!Number.isFinite(backendTime) || backendTime <= localTime) return;
        // Adopt the cloud copy, but flag this exact snapshot as already-saved so
        // the persist effect does NOT fire a redundant POST just for the restore.
        lastSavedSnapshotRef.current = JSON.stringify({
          version: 1,
          roleName: dto.roleName,
          speechRate: dto.speechRate,
          currentQuestionIndex: dto.currentQuestionIndex,
          userTranscript: dto.userTranscript,
          turnFeedback: dto.latestTurn?.feedback ?? null,
          showAnalysisModal: dto.showAnalysisModal,
          savedErrorIds: dto.savedErrorIds,
        });
        applyProgress({
          roleName: dto.roleName,
          speechRate: dto.speechRate,
          currentQuestionIndex: dto.currentQuestionIndex,
          userTranscript: dto.userTranscript,
          savedErrorIds: dto.savedErrorIds,
          showAnalysisModal: dto.showAnalysisModal,
          latestTurn: dto.latestTurn,
        });
      })
      .catch(() => {
        // Offline or backend unavailable: localStorage snapshot is already active.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

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
    showAnalysisModal,
    setShowAnalysisModal,
    repeatQuestion,
    skipQuestion,
    pauseInterview,
    resumeInterview,
    takeTime: useCallback(() => {}, []),
    toggleListening: toggleRecording,
    finishTurnManual: stopRecordingAndAnalyze,
    submitCustomAnswer,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
  };
};
