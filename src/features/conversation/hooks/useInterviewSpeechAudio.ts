import { useState, useEffect, useRef, useCallback } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { FlagshipVoiceId } from "../../reading/services/readingAudioPrefetcher";
import { MENTOR_VOICE_STORAGE_KEY } from "../../reading/hooks/useReadingAudioNarrator";
import { AudioCaptureService } from "../services/audioCaptureService";
import { setMicVolume } from "./micVolumeStore";
import { InterviewQuestionItem } from "../services/interviewEngineService";
import { useInterviewRecording, CapturedAudioMeta } from "./useInterviewRecording";

export type InterviewStatus = "IDLE" | "AI_SPEAKING" | "RECORDING" | "THINKING" | "PAUSED";
export type ProcessingStage = "IDLE" | "TRANSCRIBING" | "ANALYZING" | "PREPARING";

export type { CapturedAudioMeta };

export interface UseInterviewSpeechAudioOptions {
  isActive: boolean;
  effectiveRoleName: string;
  activeCefrLevel: string;
  currentQuestion: InterviewQuestionItem;
  currentQuestionRef: React.MutableRefObject<InterviewQuestionItem>;
  initialUserTranscript?: string;
  initialSpeechRate?: number;
  onTurnTranscribed?: ((text: string) => void) | undefined;
}

export function useInterviewSpeechAudio({
  isActive,
  effectiveRoleName,
  activeCefrLevel,
  currentQuestion,
  currentQuestionRef,
  initialUserTranscript = "",
  initialSpeechRate = 0.95,
  onTurnTranscribed,
}: UseInterviewSpeechAudioOptions) {
  // ──────────────────────────────────────────
  // Core state
  // ──────────────────────────────────────────
  const [status, setStatus] = useState<InterviewStatus>("IDLE");
  const [speechRate, setSpeechRate] = useState<number>(initialSpeechRate);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [userTranscript, setUserTranscriptRaw] = useState<string>(initialUserTranscript);
  const [isMicRecoveryModalOpen, setIsMicRecoveryModalOpen] = useState<boolean>(false);

  const [selectedVoice, setSelectedVoiceState] = useState<FlagshipVoiceId>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(MENTOR_VOICE_STORAGE_KEY) as FlagshipVoiceId;
        if (stored === "en-US-AriaNeural" || stored === "en-US-ChristopherNeural") {
          return stored;
        }
      } catch {
        // ignore
      }
    }
    return "en-US-AriaNeural";
  });

  // ──────────────────────────────────────────
  // Refs
  // ──────────────────────────────────────────
  const selectedVoiceRef = useRef<FlagshipVoiceId>(selectedVoice);
  useEffect(() => {
    selectedVoiceRef.current = selectedVoice;
  }, [selectedVoice]);

  const isAiSpeakingRef = useRef<boolean>(false);
  const userTranscriptRef = useRef<string>(initialUserTranscript);
  const isMountedRef = useRef<boolean>(true);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastVolUpdateRef = useRef<number>(0);
  const lastVolRef = useRef<number>(0);
  const lastSpokenQuestionRef = useRef<string>("");
  const prevActiveRef = useRef<boolean>(false);

  // ──────────────────────────────────────────
  // Transcript setter that also resets audio meta
  // ──────────────────────────────────────────
  const recording = useInterviewRecording({
    isActive,
    effectiveRoleName,
    activeCefrLevel,
    currentQuestionText: currentQuestion.question,
    isMountedRef,
    userTranscriptRef,
    isAiSpeakingRef,
    status,
    setStatus,
    setSpeakingSeconds,
    setUserTranscriptRaw,
    setSpeechNotice,
    setIsMicRecoveryModalOpen,
    onTurnTranscribed,
  });

  const {
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
    lastCapturedAudioRef,
    resetCapturedAudio,
  } = recording;

  const setUserTranscript = useCallback((value: string | ((prev: string) => string)) => {
    resetCapturedAudio();
    setSpeechNotice(null);
    setUserTranscriptRaw((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      userTranscriptRef.current = next;
      return next;
    });
  }, [resetCapturedAudio]);

  const stopAiSpeaking = useCallback(() => {
    SpeechSynthesisService.stop();
    isAiSpeakingRef.current = false;
  }, []);

  const stopSpeakingAndReset = useCallback(() => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
  }, []);

  // ──────────────────────────────────────────
  // Lifecycle cleanup
  // ──────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      SpeechSynthesisService.cleanup();
      AudioCaptureService.cleanup();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  // ──────────────────────────────────────────
  // Mic volume polling (RECORDING only)
  // ──────────────────────────────────────────
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
      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
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

  // ──────────────────────────────────────────
  // Speaking timer (count-up while RECORDING)
  // ──────────────────────────────────────────
  useEffect(() => {
    if (status !== "RECORDING") return;
    const interval = setInterval(() => {
      setSpeakingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // ──────────────────────────────────────────
  // Stop hardware on view deactivation
  // ──────────────────────────────────────────
  useEffect(() => {
    if (!isActive) {
      SpeechSynthesisService.stop();
      AudioCaptureService.stop();
      AudioCaptureService.releaseMicStream();
      isAiSpeakingRef.current = false;
      queueMicrotask(() => {
        if (isMountedRef.current) {
          setStatus((prev) => (prev === "AI_SPEAKING" || prev === "RECORDING" ? "IDLE" : prev));
        }
      });
    }
  }, [isActive]);

  // ──────────────────────────────────────────
  // Tab background handling
  // ──────────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document === "undefined") return;
      if (document.visibilityState === "hidden") {
        if (status === "RECORDING") {
          void AudioCaptureService.stopAndGetAudio();
          setStatus("IDLE");
        } else if (isAiSpeakingRef.current) {
          SpeechSynthesisService.stop();
          isAiSpeakingRef.current = false;
          setStatus("IDLE");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status]);

  // ──────────────────────────────────────────
  // TTS: speak question aloud
  // ──────────────────────────────────────────
  const speakQuestion = useCallback(
    async (rate?: number) => {
      if (!isActive) return;
      SpeechSynthesisService.stop();
      AudioCaptureService.stop();

      const activeQuestion = currentQuestionRef.current || currentQuestion;
      isAiSpeakingRef.current = true;
      setStatus("AI_SPEAKING");

      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      const estimatedSec = Math.max(10, Math.ceil(activeQuestion.question.split(/\s+/).length / 1.8));
      safetyTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current && isAiSpeakingRef.current) {
          isAiSpeakingRef.current = false;
          setStatus("IDLE");
          setSpeakingSeconds(0);
        }
      }, (estimatedSec + 4) * 1000);

      await SpeechSynthesisService.speak(activeQuestion.question, {
        voice: selectedVoiceRef.current,
        rate: rate ?? speechRate,
        onStart: () => {
          if (!isMountedRef.current) return;
          isAiSpeakingRef.current = true;
          setStatus("AI_SPEAKING");
        },
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
        onError: () => {
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
    [isActive, currentQuestion, currentQuestionRef, speechRate],
  );

  // ──────────────────────────────────────────
  // Voice selection
  // ──────────────────────────────────────────
  const setSelectedVoice = useCallback(
    (voice: FlagshipVoiceId) => {
      setSelectedVoiceState(voice);
      selectedVoiceRef.current = voice;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(MENTOR_VOICE_STORAGE_KEY, voice);
          localStorage.setItem("celaest:interview:hasInteracted", "true");
        } catch {
          // ignore
        }
      }
      if (currentQuestionRef.current) {
        SpeechSynthesisService.prefetch(currentQuestionRef.current.question, voice);
      }
      lastSpokenQuestionRef.current = "";
      void speakQuestion();
    },
    [speakQuestion, currentQuestionRef],
  );

  // ──────────────────────────────────────────
  // Mic recovery
  // ──────────────────────────────────────────
  const resumeFromMicRecovery = useCallback(() => {
    setIsMicRecoveryModalOpen(false);
    void startRecording();
  }, [startRecording]);

  // ──────────────────────────────────────────
  // Pause / Resume
  // ──────────────────────────────────────────
  const pauseInterview = useCallback(() => {
    SpeechSynthesisService.stop();
    AudioCaptureService.stop();
    isAiSpeakingRef.current = false;
    setStatus("PAUSED");
  }, []);

  const resumeInterview = useCallback(() => {
    isAiSpeakingRef.current = false;
    setStatus("IDLE");
  }, []);

  return {
    status,
    setStatus,
    speakingSeconds,
    setSpeakingSeconds,
    speechRate,
    setSpeechRate,
    selectedVoice,
    setSelectedVoice,
    userTranscript,
    userTranscriptRef,
    setUserTranscript,
    lastCapturedAudioRef,
    speechNotice,
    setSpeechNotice,
    isMicRecoveryModalOpen,
    setIsMicRecoveryModalOpen,
    isAiSpeakingRef,
    isMountedRef,
    lastSpokenQuestionRef,
    prevActiveRef,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
    resumeFromMicRecovery,
    speakQuestion,
    pauseInterview,
    resumeInterview,
    stopSpeakingAndReset,
    stopAiSpeaking,
  };
}
