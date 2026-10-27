import { useRef, useCallback } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import {
  AudioCaptureService,
  isMobileDevice,
  mergePhrasesCleanly,
} from "../services/audioCaptureService";
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

    // Mobile Exclusive Speech Protocol (Incognito / Zero Local Audio Key):
    // When on Mobile without a local Edge audio key (Groq/OpenAI/Gemini) and native SpeechRecognition is supported,
    // DO NOT await getUserMedia() or open MediaRecorder:
    // 1. Preserves 100% synchronous user-tap gesture activation required by iOS Safari & Android Chrome Incognito.
    // 2. Prevents Android AudioFlinger / iOS AVAudioSession hardware mic locking so native SpeechRecognition streams live at 60fps.
    const useExclusiveMobileWebSpeech =
      isMobileDevice() &&
      typeof AudioCaptureService.isSpeechRecognitionSupported === "function" &&
      AudioCaptureService.isSpeechRecognitionSupported() &&
      (typeof AudioCaptureService.hasLocalAudioTranscriptionKeySync !== "function" ||
        !AudioCaptureService.hasLocalAudioTranscriptionKeySync());

    if (useExclusiveMobileWebSpeech) {
      if (typeof AudioCaptureService.releaseMicStream === "function") {
        AudioCaptureService.releaseMicStream();
      }
    } else {
      // Ensure hardware microphone stream is initialized across Desktop and Edge-AI Mobile sessions.
      const hasReadyMic =
        typeof AudioCaptureService.hasLiveMicStream === "function"
          ? AudioCaptureService.hasLiveMicStream()
          : AudioCaptureService.hasActiveMic();
      if (!hasReadyMic) {
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
          const hasReadyStream =
            typeof AudioCaptureService.hasLiveMicStream === "function"
              ? AudioCaptureService.hasLiveMicStream()
              : AudioCaptureService.hasActiveMic();
          if (hasReadyStream) return;
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
  // Stop recording cleanly (leaves text in textarea for review)
  // ────────────────────────────────────────
  const stopRecording = useCallback(async () => {
    if (status !== "RECORDING") return;
    setStatus("IDLE");

    try {
      const audioResult = await AudioCaptureService.stopAndGetAudio();
      lastCapturedAudioRef.current = audioResult;

      let currentLive = (userTranscriptRef.current || "").trim();
      if (audioResult.confirmedMobileTranscript !== undefined) {
        let baseMobile = audioResult.confirmedMobileTranscript.trim() || currentLive;
        if (audioResult.pendingTailBlob) {
          const tailRes = await AudioCaptureService.transcribeAudio(audioResult.pendingTailBlob, {
            roleName: effectiveRoleName,
            question: currentQuestionText,
          });
          if (tailRes?.text?.trim()) {
            baseMobile = baseMobile
              ? mergePhrasesCleanly(baseMobile, tailRes.text.trim())
              : tailRes.text.trim();
          }
        } else if (
          !baseMobile &&
          audioResult.hadVoicedSpeech &&
          audioResult.audioBlob &&
          audioResult.audioBlob.size > 800
        ) {
          const fallbackRes = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
            roleName: effectiveRoleName,
            question: currentQuestionText,
          });
          if (fallbackRes?.text?.trim()) {
            baseMobile = fallbackRes.text.trim();
          }
        }
        currentLive = baseMobile;
      } else if (
        // Safety net for brief (<1.8s) spoken phrases stopped before interim tick when Web Speech was deaf
        !currentLive &&
        audioResult.hadVoicedSpeech &&
        audioResult.audioBlob &&
        audioResult.audioBlob.size > 800
      ) {
        const fallbackRes = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
          roleName: effectiveRoleName,
          question: currentQuestionText,
        });
        if (fallbackRes?.text?.trim()) {
          currentLive = fallbackRes.text.trim();
        }
      }

      if (currentLive) {
        const validation = validateSpeechIntelligibility(
          currentLive,
          audioResult.durationSeconds,
          "en",
          { targetLevel: activeCefrLevel }
        );

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
        const merged = prefix ? mergePhrasesCleanly(prefix, currentLive) : currentLive;
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
      }
    } catch (err) {
      logger.warn("Failed to stop recording cleanly:", err);
    } finally {
      setStatus("IDLE");
    }
  }, [
    status,
    effectiveRoleName,
    currentQuestionText,
    activeCefrLevel,
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
