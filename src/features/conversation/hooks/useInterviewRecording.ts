import { useRef, useCallback } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { AudioCaptureService, mergePhrasesCleanly } from "../services/audioCaptureService";
import { validateSpeechIntelligibility } from "../services/speechIntelligibilityGuard";
import { appToast } from "../../../design-system/components/Toast";
import { logger } from "../../../shared/utils/logger";
import { InterviewStatus } from "./useInterviewSpeechAudio";

/** Audio metadata captured during a recording segment */
export interface CapturedAudioMeta {
  audioBlob: Blob | null;
  audioUrl: string | null;
  durationSeconds: number;
  detectedLanguage?: string | undefined;
  avgLogprob?: number | undefined;
  noSpeechProb?: number | undefined;
}

const EMPTY_AUDIO_META: CapturedAudioMeta = {
  audioBlob: null,
  audioUrl: null,
  durationSeconds: 0,
};

export interface UseInterviewRecordingOptions {
  isActive: boolean;
  effectiveRoleName: string;
  activeCefrLevel: string;
  currentQuestionText: string;
  isMountedRef: React.MutableRefObject<boolean>;
  userTranscriptRef: React.MutableRefObject<string>;
  isAiSpeakingRef: React.MutableRefObject<boolean>;
  status: InterviewStatus;
  setStatus: React.Dispatch<React.SetStateAction<InterviewStatus>>;
  setSpeakingSeconds: React.Dispatch<React.SetStateAction<number>>;
  setUserTranscriptRaw: React.Dispatch<React.SetStateAction<string>>;
  setSpeechNotice: React.Dispatch<React.SetStateAction<string | null>>;
  setIsMicRecoveryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onTurnTranscribed?: ((text: string) => void) | undefined;
}

/**
 * Encapsulates MediaRecorder start/stop, Whisper transcription,
 * and speech intelligibility validation.
 */
export function useInterviewRecording({
  effectiveRoleName,
  activeCefrLevel,
  currentQuestionText,
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
}: UseInterviewRecordingOptions) {
  const textBeforeSegmentRef = useRef<string>("");
  const lastCapturedAudioRef = useRef<CapturedAudioMeta>({ ...EMPTY_AUDIO_META });

  /** Reset captured audio metadata (e.g. when user manually edits transcript) */
  const resetCapturedAudio = useCallback(() => {
    lastCapturedAudioRef.current = { ...EMPTY_AUDIO_META };
  }, []);

  // ────────────────────────────────────────
  // Start recording flow
  // ────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (isAiSpeakingRef.current) {
      SpeechSynthesisService.stop();
      isAiSpeakingRef.current = false;
    }
    try {
      if (typeof window !== "undefined") localStorage.setItem("celaest:interview:hasInteracted", "1");
    } catch {
      // ignore storage errors
    }

    // Ensure hardware microphone stream is initialized across all devices (Desktop, iOS Safari, Android Chrome).
    // Requesting getUserMedia on user tap guarantees proper browser origin permissions,
    // connects AudioContext for real-time waveform animation, and fuels MediaRecorder for Whisper AI.
    if (!AudioCaptureService.hasActiveMic()) {
      let granted = false;
      try {
        granted = await AudioCaptureService.initMicrophone();
      } catch {
        granted = false;
      }
      if (!granted) {
        if (isMountedRef.current) {
          setStatus("IDLE");
          setIsMicRecoveryModalOpen(true);
        }
        return;
      }
    }

    const existingText = userTranscriptRef.current.trim();
    textBeforeSegmentRef.current = existingText;
    setSpeechNotice(null);
    setStatus("RECORDING");

    AudioCaptureService.startRecognition({
      lang: "en-US",
      initialTranscript: existingText,
      roleName: effectiveRoleName,
      question: currentQuestionText,
      onTranscript: (liveTranscript: string) => {
        if (!isMountedRef.current) return;
        userTranscriptRef.current = liveTranscript;
        setUserTranscriptRaw(liveTranscript);
      },
      onSpanishDetected: (noticeMessage: string) => {
        if (!isMountedRef.current) return;
        setStatus("IDLE");
        requestAnimationFrame(() => {
          setSpeechNotice(noticeMessage);
          appToast.spanishDetected(noticeMessage);
        });
      },
      onError: (err: unknown) => {
        const errObj = err as { error?: string } | undefined;
        const errCode = errObj?.error || String(err);
        if (
          errCode === "not-allowed" ||
          errCode.includes("not-allowed") ||
          errCode.includes("NotAllowedError")
        ) {
          if (AudioCaptureService.hasActiveMic()) return;
          if (isMountedRef.current) {
            setStatus("IDLE");
            setIsMicRecoveryModalOpen(true);
          }
        }
      },
    });
  }, [
    effectiveRoleName,
    currentQuestionText,
    isMountedRef,
    userTranscriptRef,
    isAiSpeakingRef,
    setStatus,
    setSpeechNotice,
    setIsMicRecoveryModalOpen,
    setUserTranscriptRaw,
  ]);

  // ────────────────────────────────────────
  // Stop recording + Whisper transcription
  // ────────────────────────────────────────
  const stopRecording = useCallback(async () => {
    if (status !== "RECORDING") return;
    setStatus("IDLE");

    try {
      const audioResult = await AudioCaptureService.stopAndGetAudio();
      lastCapturedAudioRef.current = audioResult;

      const currentLive = (userTranscriptRef.current || "").trim();

      // 1. PRIMARY PATH: High-Accuracy Whisper AI Transcription
      // Always transcribe recorded audio with Whisper to guarantee veridico, high-fidelity text
      // with exact grammar, punctuation, and technical terms.
      let finalTranscript = "";
      let detectedLanguage = "en";
      let avgLogprob: number | undefined;
      let noSpeechProb: number | undefined;

      if (audioResult.audioBlob && audioResult.audioBlob.size > 100) {
        setStatus("THINKING");
        setSpeechNotice("Transcribing audio with AI...");
        try {
          const whisperResult = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
            roleName: effectiveRoleName,
            question: currentQuestionText,
          });

          if (whisperResult && whisperResult.text.trim().length > 0) {
            finalTranscript = whisperResult.text.trim();
            detectedLanguage = whisperResult.language || "en";
            avgLogprob = whisperResult.avgLogprob;
            noSpeechProb = whisperResult.noSpeechProb;
          }
        } catch (err) {
          logger.warn("Whisper transcription failed, falling back to live transcript:", err);
        } finally {
          setStatus("IDLE");
        }
      }

      // 2. FALLBACK PATH: If Whisper was unavailable or offline, use live speech transcript
      if (!finalTranscript && currentLive) {
        finalTranscript = currentLive;
      }

      if (!finalTranscript) {
        setSpeechNotice("No speech detected. Please speak clearly into your microphone.");
        return;
      }

      lastCapturedAudioRef.current.detectedLanguage = detectedLanguage;
      lastCapturedAudioRef.current.avgLogprob = avgLogprob;
      lastCapturedAudioRef.current.noSpeechProb = noSpeechProb;

      const validation = validateSpeechIntelligibility(
        finalTranscript,
        audioResult.durationSeconds,
        detectedLanguage,
        {
          avgLogprob,
          noSpeechProb,
          targetLevel: activeCefrLevel,
        }
      );

      if (
        validation.reason === "WHISPER_HALLUCINATION" ||
        validation.reason === "SILENCE_OR_EMPTY" ||
        validation.reason === "REPETITIVE_NOISE"
      ) {
        setSpeechNotice(validation.message || null);
        appToast.ambientNoise(validation.message);
        return;
      }
      if (validation.reason === "SPANISH_DETECTED") {
        setUserTranscriptRaw("");
        userTranscriptRef.current = "";
        textBeforeSegmentRef.current = "";
        setSpeakingSeconds(0);
        setSpeechNotice(validation.message || null);
        appToast.spanishDetected(validation.message);
        return;
      }

      const prefix = textBeforeSegmentRef.current.trim();
      const merged = prefix ? mergePhrasesCleanly(prefix, finalTranscript) : finalTranscript;
      setUserTranscriptRaw(merged);
      userTranscriptRef.current = merged;
      onTurnTranscribed?.(merged);

      if (validation.reason === "INSUFFICIENT_WORDS") {
        setSpeechNotice(validation.message || null);
      } else if (!validation.isValid && validation.message) {
        setSpeechNotice(validation.message);
      } else {
        setSpeechNotice(null);
      }
    } catch (err) {
      logger.warn("Failed to stop recording cleanly:", err);
      setStatus("IDLE");
    }
  }, [
    status,
    activeCefrLevel,
    effectiveRoleName,
    currentQuestionText,
    onTurnTranscribed,
    setStatus,
    setSpeakingSeconds,
    setSpeechNotice,
    setUserTranscriptRaw,
    userTranscriptRef,
    lastCapturedAudioRef,
    textBeforeSegmentRef,
  ]);

  // ────────────────────────────────────────
  // Toggle + Clear
  // ────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    if (status === "RECORDING") {
      void stopRecording();
    } else if (status === "AI_SPEAKING") {
      SpeechSynthesisService.stop();
      isAiSpeakingRef.current = false;
      startRecording();
    } else if (status === "IDLE" || status === "PAUSED") {
      startRecording();
    }
  }, [status, startRecording, stopRecording, isAiSpeakingRef]);

  const clearTranscript = useCallback(() => {
    setUserTranscriptRaw("");
    userTranscriptRef.current = "";
    textBeforeSegmentRef.current = "";
    setSpeakingSeconds(0);
    setSpeechNotice(null);
    lastCapturedAudioRef.current = { ...EMPTY_AUDIO_META };
  }, [userTranscriptRef, setSpeakingSeconds, setUserTranscriptRaw, setSpeechNotice]);

  return {
    lastCapturedAudioRef,
    textBeforeSegmentRef,
    resetCapturedAudio,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
  };
}
