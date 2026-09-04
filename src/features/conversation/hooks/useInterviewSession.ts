import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import {
  FlagshipVoiceId,
} from "../../reading/services/readingAudioPrefetcher";
import { MENTOR_VOICE_STORAGE_KEY } from "../../reading/hooks/useReadingAudioNarrator";
import { InterviewQuestionItem, SpecificErrorItem } from "../services/interviewEngineService";
import { DynamicQuestionService, classifyProfession, normalizeCefr } from "../services/dynamicQuestionService";
import { AiInterviewQuestionGenerator } from "../services/aiInterviewQuestionGenerator";
import { CoreAiEvaluatorService } from "../services/coreAiEvaluatorService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { AudioCaptureService } from "../services/audioCaptureService";
import { validateSpeechIntelligibility } from "../services/speechIntelligibilityGuard";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { apiInterviewRepository } from "../../../infrastructure/repositories/ApiInterviewRepository";
import { logger } from "../../../shared/utils/logger";
import {
  loadPersistedInterview,
  savePersistedInterview,
  PersistedInterviewState,
} from "../services/interviewPersistence";
import { setMicVolume } from "./micVolumeStore";
import { appToast } from "../../../design-system/components/Toast";
import {
  AiApiErrorType,
  ErrorScenarioData,
  ERROR_DATA,
} from "../../lab/components/AiEngineErrorsLuxuryStudio";
import { providerKeyVault } from "../../settings/services/providerKeyVault";

let interviewHydratedOnce = false;
let interviewLastHydratedAt = 0;

export function __resetInterviewHydrationForTest(): void {
  interviewHydratedOnce = false;
  interviewLastHydratedAt = 0;
}

export type InterviewStatus = "IDLE" | "AI_SPEAKING" | "RECORDING" | "THINKING" | "PAUSED";

export type ProcessingStage = "IDLE" | "TRANSCRIBING" | "ANALYZING" | "PREPARING";

export const useInterviewSession = (
  roleName: string = "Professional",
  initialLevel?: string,
) => {
  // Restore the last interview turn from localStorage so a reload or an SPA
  // route change never loses the user's answer or the AI feedback.
  const restoredRef = useRef<PersistedInterviewState | null>(loadPersistedInterview());

  const [activeCefrLevel, setActiveCefrLevelState] = useState<string>(() => {
    if (initialLevel) return normalizeCefr(initialLevel);
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("celaest:interview:cefrLevel");
        if (saved) return normalizeCefr(saved);
      } catch {
        // ignore
      }
    }
    return "B1";
  });

  const [status, setStatus] = useState<InterviewStatus>("IDLE");
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("IDLE");
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    restoredRef.current?.currentQuestionIndex ?? 0,
  );
  const [speechRate, setSpeechRate] = useState<number>(restoredRef.current?.speechRate ?? 0.95);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [userTranscript, setUserTranscriptRaw] = useState<string>(
    restoredRef.current?.userTranscript ?? "",
  );

  const setUserTranscript = useCallback((value: string | ((prev: string) => string)) => {
    // When the user edits or pastes text directly into the transcript area,
    // detach old acoustic metadata so prior mic detection doesn't misclassify typed text!
    lastCapturedAudioRef.current = {
      audioBlob: null,
      audioUrl: null,
      durationSeconds: 0,
      detectedLanguage: undefined,
    };
    setSpeechNotice(null);
    setUserTranscriptRaw((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      userTranscriptRef.current = next;
      return next;
    });
  }, []);
  const [turnFeedback, setTurnFeedback] = useState<ComprehensiveTurnFeedback | null>(
    restoredRef.current?.turnFeedback ?? null,
  );
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(
    new Set(restoredRef.current?.savedErrorIds ?? []),
  );
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(
    restoredRef.current?.showAnalysisModal ?? false,
  );
  const [selectedVoice, setSelectedVoiceState] = useState<FlagshipVoiceId>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(MENTOR_VOICE_STORAGE_KEY) as FlagshipVoiceId;
        if (stored === "en-US-AriaNeural" || stored === "en-US-ChristopherNeural") {
          return stored;
        }
      } catch {
        // Fallback
      }
    }
    return "en-US-AriaNeural";
  });
  const [isMicRecoveryModalOpen, setIsMicRecoveryModalOpen] = useState<boolean>(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [infrastructureErrorScenario, setInfrastructureErrorScenario] = useState<ErrorScenarioData>(
    ERROR_DATA["keys-exhausted-pool"] || Object.values(ERROR_DATA)[0],
  );
  const [recoveryCooldown, setRecoveryCooldown] = useState<number>(14);

  const selectedVoiceRef = useRef<FlagshipVoiceId>(selectedVoice);
  selectedVoiceRef.current = selectedVoice;

  const animFrameRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isAiSpeakingRef = useRef<boolean>(false);
  const userTranscriptRef = useRef<string>("");
  const textBeforeSegmentRef = useRef<string>("");
  // Throttle mic-volume state updates so the ~60fps rAF poll does not
  // re-render the entire conversation tree on every frame.
  const lastVolUpdateRef = useRef<number>(0);
  const lastVolRef = useRef<number>(0);
  const lastTranscriptUpdateRef = useRef<number>(0);
  const lastCapturedAudioRef = useRef<{
    audioBlob: Blob | null;
    audioUrl: string | null;
    durationSeconds: number;
    detectedLanguage?: string | undefined;
  }>({ audioBlob: null, audioUrl: null, durationSeconds: 0 });

  // The prop `roleName` from WorkspaceDashboardView is the single source of truth.
  // Only fall back to persisted state if the prop genuinely hasn't loaded yet.
  const effectiveRoleName = (roleName && roleName !== "Professional")
    ? roleName
    : "Professional";

  // Detect profession mismatch between persisted state and current prop.
  // If there's a mismatch, the persisted session questions are stale and must be discarded.
  const professionMatchesPersisted =
    !!restoredRef.current?.roleName &&
    restoredRef.current.roleName.toLowerCase() === effectiveRoleName.toLowerCase();

  // Auto-invalidate stale AI question caches from localStorage when profession changes
  const cacheInvalidatedRef = useRef(false);
  if (!cacheInvalidatedRef.current && effectiveRoleName !== "Professional" && !professionMatchesPersisted) {
    cacheInvalidatedRef.current = true;
    if (typeof window !== "undefined") {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("celaest:interview:ai_questions:v2:") &&
              !key.includes(effectiveRoleName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_"))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        if (keysToRemove.length > 0) {
          logger.info(`[useInterviewSession] Invalidated ${keysToRemove.length} stale AI question cache(s) for profession change → ${effectiveRoleName}`);
        }
      } catch {
        // ignore storage errors
      }
    }
  }

  // Session-level pre-generated questions tailored to exact (effectiveRoleName, activeCefrLevel)
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestionItem[]>(() => {
    const expectedCat = classifyProfession(effectiveRoleName);
    const hasCategoryMismatch = (questions: InterviewQuestionItem[]) => {
      if (expectedCat === "HEALTHCARE") {
        return questions.some((q) => {
          const lower = (q.question || "").toLowerCase();
          return (
            lower.includes("client meeting") ||
            lower.includes("presentation for a client") ||
            lower.includes("pull request") ||
            lower.includes("standup") ||
            lower.includes("sprint")
          );
        });
      }
      return false;
    };

    const normActiveLevel = normalizeCefr(activeCefrLevel);
    const hasLevelMismatch = (questions: InterviewQuestionItem[]) => {
      return questions.some((q) => q.targetLevel && normalizeCefr(q.targetLevel) !== normActiveLevel);
    };

    // Only restore persisted session questions if they EXACTLY match current profession, domain, and level
    if (
      professionMatchesPersisted &&
      restoredRef.current?.sessionQuestions &&
      restoredRef.current.sessionQuestions.length > 0 &&
      !hasCategoryMismatch(restoredRef.current.sessionQuestions) &&
      !hasLevelMismatch(restoredRef.current.sessionQuestions)
    ) {
      return restoredRef.current.sessionQuestions;
    }
    // Instant procedural seed from the correct profession pool and level
    return AiInterviewQuestionGenerator.getCachedOrSeedQuestions(effectiveRoleName, activeCefrLevel, 12);
  });

  const setActiveCefrLevel = useCallback(
    (level: string) => {
      const norm = normalizeCefr(level);
      setActiveCefrLevelState(norm);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:interview:cefrLevel", norm);
        } catch {
          // ignore
        }
      }
      // Instant switch: load seed/cached questions matching this role and the new CEFR level
      const newQuestions = AiInterviewQuestionGenerator.getCachedOrSeedQuestions(
        effectiveRoleName,
        norm,
        12,
      );
      setSessionQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      setUserTranscriptRaw("");
      setTurnFeedback(null);
    },
    [effectiveRoleName],
  );

  // Synchronize when initialLevel changes from props (e.g. updated in Settings)
  useEffect(() => {
    if (initialLevel) {
      const norm = normalizeCefr(initialLevel);
      if (norm !== normalizeCefr(activeCefrLevel)) {
        setActiveCefrLevel(norm);
      }
    }
  }, [initialLevel, activeCefrLevel, setActiveCefrLevel]);

  const lastGeneratedKeyRef = useRef<string>("");

  // Background AI pre-generation of full 12-question tailored session block
  useEffect(() => {
    let isCancelled = false;

    const normLevel = normalizeCefr(activeCefrLevel);
    const expectedCat = classifyProfession(effectiveRoleName);
    const hasCategoryMismatch = sessionQuestions.some((q) => {
      if (expectedCat === "HEALTHCARE") {
        const lower = (q.question || "").toLowerCase();
        return (
          lower.includes("client meeting") ||
          lower.includes("presentation for a client") ||
          lower.includes("pull request") ||
          lower.includes("standup") ||
          lower.includes("sprint")
        );
      }
      return false;
    });

    const hasLevelMismatch = sessionQuestions.some((q) => {
      if (!q.targetLevel) return false;
      return normalizeCefr(q.targetLevel) !== normLevel;
    });

    const generationKey = `${effectiveRoleName}::${normLevel}`;
    if (
      !hasCategoryMismatch &&
      !hasLevelMismatch &&
      lastGeneratedKeyRef.current === generationKey
    ) {
      return;
    }

    lastGeneratedKeyRef.current = generationKey;

    AiInterviewQuestionGenerator.generateSessionQuestions({
      profession: effectiveRoleName,
      cefrLevel: normLevel,
      count: 12,
    })
      .then((aiQuestions) => {
        if (!isCancelled && aiQuestions && aiQuestions.length >= 5) {
          setSessionQuestions(aiQuestions);
        }
      })
      .catch((err) => {
        logger.warn("[useInterviewSession] Background AI questions error:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [effectiveRoleName, activeCefrLevel, sessionQuestions]);

  // Dynamically generate question for the current question index (Continuous infinite rounds).
  // Memoized so the returned object reference is stable across renders that don't change the
  // question — this keeps every callback depending on it referentially stable.
  const currentQuestion = useMemo<InterviewQuestionItem>(() => {
    if (sessionQuestions.length > 0) {
      const q = sessionQuestions[currentQuestionIndex % sessionQuestions.length];
      return {
        ...q,
        id: currentQuestionIndex + 1,
        round: Math.floor(currentQuestionIndex / 5) + 1,
      };
    }
    return DynamicQuestionService.getQuestionForIndex(
      currentQuestionIndex,
      effectiveRoleName,
      activeCefrLevel,
    );
  }, [sessionQuestions, currentQuestionIndex, effectiveRoleName, activeCefrLevel]);

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
        const isCore = await providerKeyVault.isCentralCoreEnabled();
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);

        if (!isCore && !hasKey) {
          setInfrastructureErrorScenario(ERROR_DATA["keys-exhausted-pool"]);
          setRecoveryCooldown(0);
          setIsRecoveryModalOpen(true);
          return;
        }

        // Real AI Feedback via CELAEST-CORE IA-Mesh with UniversalLinguisticParser fallback
        const feedback = await CoreAiEvaluatorService.evaluate(
          spokenText,
          activeQuestion,
          effectiveRoleName,
          activeCefrLevel,
        );

        if (!isMountedRef.current) return;
        if (feedback) {
          // If the AI evaluated it as 0 or flagged Spanish/invalid input, suppress modal and show alert
          const isSpanishOrZero =
            feedback.overallScore === 0 ||
            feedback.strategicFeedback?.title?.toLowerCase().includes("español") ||
            feedback.strategicFeedback?.title?.toLowerCase().includes("spanish") ||
            feedback.strategicFeedback?.title?.toLowerCase().includes("sin contenido") ||
            feedback.strategicFeedback?.title?.toLowerCase().includes("muy breve");

          if (isSpanishOrZero) {
            const isSpanish =
              feedback.overallScore === 0 ||
              feedback.strategicFeedback?.title?.toLowerCase().includes("español") ||
              feedback.strategicFeedback?.title?.toLowerCase().includes("spanish");

            if (isSpanish) {
              setUserTranscript("");
              userTranscriptRef.current = "";
              textBeforeSegmentRef.current = "";
              setSpeakingSeconds(0);
              appToast.spanishDetected(
                feedback.strategicFeedback?.explanation ||
                  "Detectamos que tu respuesta está formulada en español. Por favor responde en inglés para evaluar tu práctica.",
              );
            } else {
              appToast.warning(
                feedback.strategicFeedback?.title || "Atención",
                feedback.strategicFeedback?.explanation ||
                  "Por favor formula una respuesta estructurada en inglés.",
              );
            }
            return;
          }

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
      } catch (err: any) {
        logger.warn("Interview turn evaluation failed:", err);
        const errMsg = err?.message || String(err);
        let errorType: AiApiErrorType = "rate-limit-429";
        if (errMsg.includes("401") || errMsg.includes("AUTH_DECLINED")) {
          errorType = "invalid-key-401";
        } else if (errMsg.includes("429") || errMsg.includes("RATE_LIMIT")) {
          errorType = "rate-limit-429";
        } else if (errMsg.includes("EXHAUSTED") || errMsg.includes("pool") || errMsg.includes("sin saldo")) {
          errorType = "keys-exhausted-pool";
        } else if (errMsg.includes("504") || errMsg.includes("timeout")) {
          errorType = "gateway-timeout-504";
        } else {
          errorType = "server-outage-503";
        }
        setInfrastructureErrorScenario(ERROR_DATA[errorType] || ERROR_DATA["rate-limit-429"]);
        setRecoveryCooldown(ERROR_DATA[errorType]?.cooldownDefault || 14);
        setIsRecoveryModalOpen(true);
      } finally {
        if (isMountedRef.current) {
          setProcessingStage("IDLE");
          setStatus("IDLE");
        }
      }
    },
    [currentQuestion, setUserTranscript],
  );

  /**
   * Starts Speech Recognition (Microphone capture only).
   * Resumes and appends to any existing transcript without wiping it out.
   */
  const startRecording = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (isAiSpeakingRef.current) return;

    // Check if mic permission is granted, otherwise open luxury recovery modal
    if (!AudioCaptureService.hasActiveMic()) {
      const granted = await AudioCaptureService.initMicrophone();
      if (!granted) {
        if (isMountedRef.current) {
          setStatus("IDLE");
          setIsMicRecoveryModalOpen(true);
        }
        return;
      }
    }

    const existingText = (userTranscriptRef.current || userTranscript).trim();
    textBeforeSegmentRef.current = existingText;
    setSpeechNotice(null);
    setStatus("RECORDING");

    AudioCaptureService.startRecognition({
      lang: "en-US",
      initialTranscript: existingText,
      onTranscript: (liveTranscript: string) => {
        if (!isMountedRef.current || isAiSpeakingRef.current) return;
        userTranscriptRef.current = liveTranscript;
        const now = Date.now();
        if (now - lastTranscriptUpdateRef.current > 180) {
          lastTranscriptUpdateRef.current = now;
          setUserTranscript(liveTranscript);
        }
      },
      onSpanishDetected: (noticeMessage: string) => {
        if (!isMountedRef.current) return;
        void AudioCaptureService.stopAndGetAudio().then(() => {
          if (!isMountedRef.current) return;
          setStatus("IDLE");
          setProcessingStage("IDLE");
          setUserTranscript("");
          userTranscriptRef.current = "";
          textBeforeSegmentRef.current = "";
          setSpeakingSeconds(0);
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
          errCode.includes("NotAllowedError") ||
          errCode.includes("audio-capture")
        ) {
          if (isMountedRef.current) {
            setStatus("IDLE");
            setIsMicRecoveryModalOpen(true);
          }
        }
      },
    });
  }, [userTranscript, setUserTranscript]);

  const resumeFromMicRecovery = useCallback(() => {
    setIsMicRecoveryModalOpen(false);
    void startRecording();
  }, [startRecording]);

  /**
   * Stops Recording without submitting to the AI (Pauses mic).
   * Transcribes captured audio into the textarea for user review and leaves state in IDLE.
   */
  const stopRecording = useCallback(async () => {
    if (status !== "RECORDING") return;
    setStatus("IDLE");
    setProcessingStage("TRANSCRIBING");

    try {
      const audioResult = await AudioCaptureService.stopAndGetAudio();
      lastCapturedAudioRef.current = audioResult;

      if (audioResult.audioBlob) {
        try {
          const whisperResult = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
            roleName: effectiveRoleName,
            question: currentQuestion.question,
          });
          if (whisperResult && whisperResult.text.trim().length > 0) {
            const trimmed = whisperResult.text.trim();
            lastCapturedAudioRef.current.detectedLanguage = whisperResult.language;
            const validation = validateSpeechIntelligibility(
              trimmed,
              audioResult.durationSeconds,
              whisperResult.language,
            );
            // If Whisper hallucinated silence noise (e.g. "okay, thank you"), do not pollute input
            if (validation.reason === "WHISPER_HALLUCINATION" || validation.reason === "SILENCE_OR_EMPTY") {
              setSpeechNotice(validation.message || null);
              appToast.ambientNoise(validation.message);
              return;
            }
            if (validation.reason === "SPANISH_DETECTED") {
              setUserTranscript("");
              userTranscriptRef.current = "";
              textBeforeSegmentRef.current = "";
              setSpeakingSeconds(0);
              setSpeechNotice(validation.message || null);
              appToast.spanishDetected(validation.message);
              return;
            }

            // Seamless merge: if user had prior text, append new segment
            const prefix = textBeforeSegmentRef.current.trim();
            const segmentText = trimmed;
            const merged = prefix ? `${prefix} ${segmentText}` : segmentText;

            // WHISPER SOVEREIGNTY: Whisper output is the authoritative canonical transcript
            setUserTranscript(merged);
            userTranscriptRef.current = merged;

            if (!validation.isValid && validation.message) {
              setSpeechNotice(validation.message);
            } else {
              setSpeechNotice(null);
            }
          }
        } catch (err) {
          logger.warn("Whisper transcription fallback to web speech:", err);
        }
      }
    } catch (err) {
      logger.warn("Failed to stop recording cleanly:", err);
    } finally {
      if (isMountedRef.current) {
        setProcessingStage("IDLE");
        setStatus("IDLE");
      }
    }
  }, [status, setUserTranscript]);

  /**
   * Toggles Recording state (Microphone switch only)
   */
  const toggleRecording = useCallback(() => {
    if (status === "RECORDING") {
      void stopRecording();
    } else if (status === "IDLE" || status === "PAUSED") {
      startRecording();
    }
  }, [status, startRecording, stopRecording]);

  /**
   * Explicitly Submits the Turn for Deep AI Evaluation.
   * Triggered ONLY when the user clicks the Green Checkmark / OK Button, purple send arrow, or presses Enter.
   * Guards against Spanish leaks, silence hallucinations, and gibberish with 0 token waste.
   */
  const submitCurrentTurn = useCallback(
    async (customText?: string) => {
      let textToSubmit = (
        typeof customText === "string" ? customText : userTranscriptRef.current || userTranscript
      ).trim();
      let audioUrl = lastCapturedAudioRef.current.audioUrl;
      let durationSeconds = lastCapturedAudioRef.current.durationSeconds;
      let detectedLang: string | undefined = lastCapturedAudioRef.current.detectedLanguage;

      // If user clicks submit while microphone is still actively recording, stop and capture first
      if (status === "RECORDING") {
        setStatus("THINKING");
        setProcessingStage("TRANSCRIBING");
        const audioResult = await AudioCaptureService.stopAndGetAudio();
        lastCapturedAudioRef.current = audioResult;
        audioUrl = audioResult.audioUrl;
        durationSeconds = audioResult.durationSeconds;

        if (audioResult.audioBlob) {
          try {
            const whisperResult = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
              roleName: effectiveRoleName,
              question: currentQuestion.question,
            });
            if (whisperResult && whisperResult.text.trim().length > 0) {
              textToSubmit = whisperResult.text.trim();
              detectedLang = whisperResult.language;
              lastCapturedAudioRef.current.detectedLanguage = detectedLang;
              setUserTranscript(textToSubmit);
              userTranscriptRef.current = textToSubmit;
            }
          } catch (err) {
            logger.warn("Whisper transcription fallback to web speech on submit:", err);
          }
        }
      }

      // Pre-Flight Intelligibility & Token Shield Guard (0 Token Protection)
      const validation = validateSpeechIntelligibility(textToSubmit, durationSeconds, detectedLang);
      if (!validation.isValid) {
        logger.info("[useInterviewSession] Suppressed turn submission:", validation.reason);
        if (isMountedRef.current) {
          setSpeechNotice(validation.message || "Por favor responde en inglés para evaluar tu práctica.");
          setProcessingStage("IDLE");
          setStatus("IDLE");

          if (validation.reason === "SPANISH_DETECTED") {
            setUserTranscript("");
            userTranscriptRef.current = "";
            textBeforeSegmentRef.current = "";
            setSpeakingSeconds(0);
            appToast.spanishDetected(validation.message);
          } else if (validation.reason === "NONSENSE_OR_GIBBERISH") {
            appToast.gibberishDetected(validation.message);
          } else if (
            validation.reason === "WHISPER_HALLUCINATION" ||
            validation.reason === "SILENCE_OR_EMPTY"
          ) {
            appToast.ambientNoise(validation.message);
          } else {
            appToast.warning("Atención", validation.message);
          }
        }
        return;
      }

      setSpeechNotice(null);
      await processTurn(validation.cleanTranscript, audioUrl, durationSeconds);
    },
    [status, userTranscript, setUserTranscript, processTurn],
  );

  /**
   * Action: Clears the current transcript and resets speech notices
   */
  const clearTranscript = useCallback(() => {
    setUserTranscript("");
    userTranscriptRef.current = "";
    textBeforeSegmentRef.current = "";
    setSpeakingSeconds(0);
    setSpeechNotice(null);
    lastCapturedAudioRef.current = { audioBlob: null, audioUrl: null, durationSeconds: 0 };
  }, [setUserTranscript]);

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

      // Adaptive safety timeout based on text length (prevents cutting off longer questions)
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

  const setSelectedVoice = useCallback(
    (voice: FlagshipVoiceId) => {
      setSelectedVoiceState(voice);
      selectedVoiceRef.current = voice;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(MENTOR_VOICE_STORAGE_KEY, voice);
        } catch {
          // Safe storage write
        }
      }
      if (currentQuestionRef.current) {
        SpeechSynthesisService.prefetch(currentQuestionRef.current.question, voice);
      }
      // If AI is currently speaking, live-replay question with the new mentor voice!
      if (isAiSpeakingRef.current) {
        void speakQuestion();
      }
    },
    [speakQuestion],
  );

  // Proactively prefetch the current and upcoming questions in background
  useEffect(() => {
    if (currentQuestion?.question) {
      SpeechSynthesisService.prefetch(currentQuestion.question, selectedVoice);
      const nextQ = DynamicQuestionService.getQuestionForIndex(currentQuestionIndex + 1, effectiveRoleName, activeCefrLevel);
      if (nextQ?.question) {
        SpeechSynthesisService.prefetch(nextQ.question, selectedVoice);
      }
    }
  }, [currentQuestion, currentQuestionIndex, effectiveRoleName, activeCefrLevel, selectedVoice]);

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
    textBeforeSegmentRef.current = "";
    setSpeakingSeconds(0);
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
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const snapshot: PersistedInterviewState = {
      version: 2,
      roleName: effectiveRoleName,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      turnFeedback,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
      sessionQuestions: sessionQuestions.length > 0 ? sessionQuestions : undefined,
      updatedAt: Date.now(),
    };

    // Compare without updatedAt (which always changes) so we only persist when
    // something the user actually sees has changed.
    const comparable = JSON.stringify({
      version: 2,
      roleName: effectiveRoleName,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      turnFeedback,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
    });

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

    const debounceMs = 500;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      apiInterviewRepository
        .saveProgress({
          roleName: effectiveRoleName,
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
    }, debounceMs);
  }, [
    effectiveRoleName,
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

        // Domain sanity check: If cloud data has mismatched corporate questions for healthcare, sanitize it
        const expectedCat = classifyProfession(effectiveRoleName);
        const cloudQuestion = String((dto.latestTurn as any)?.question || "").toLowerCase();
        const hasDomainConflict =
          expectedCat === "HEALTHCARE" &&
          (cloudQuestion.includes("client meeting") ||
            cloudQuestion.includes("presentation for a client") ||
            cloudQuestion.includes("standup") ||
            cloudQuestion.includes("pull request"));

        const sanitizedIndex = hasDomainConflict ? 0 : dto.currentQuestionIndex;
        const sanitizedTurn = hasDomainConflict ? null : dto.latestTurn;

        // Adopt the cloud copy, but flag this exact snapshot as already-saved so
        // the persist effect does NOT fire a redundant POST just for the restore.
        lastSavedSnapshotRef.current = JSON.stringify({
          version: 2,
          roleName: dto.roleName || effectiveRoleName,
          speechRate: dto.speechRate,
          currentQuestionIndex: sanitizedIndex,
          userTranscript: dto.userTranscript,
          turnFeedback: sanitizedTurn?.feedback ?? null,
          showAnalysisModal: dto.showAnalysisModal,
          savedErrorIds: dto.savedErrorIds,
        });
        applyProgress({
          roleName: dto.roleName || effectiveRoleName,
          speechRate: dto.speechRate,
          currentQuestionIndex: sanitizedIndex,
          userTranscript: dto.userTranscript,
          savedErrorIds: dto.savedErrorIds,
          showAnalysisModal: dto.showAnalysisModal,
          latestTurn: sanitizedTurn,
        });
      })
      .catch(() => {
        // Offline or backend unavailable: localStorage snapshot is already active.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, [effectiveRoleName]);

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
    selectedVoice,
    setSelectedVoice,
    userTranscript,
    setUserTranscript,
    turnFeedback,
    savedErrorIds,
    showAnalysisModal,
    setShowAnalysisModal,
    isMicRecoveryModalOpen,
    setIsMicRecoveryModalOpen,
    resumeFromMicRecovery,
    isRecoveryModalOpen,
    setIsRecoveryModalOpen,
    infrastructureErrorScenario,
    recoveryCooldown,
    resumeFromRecoveryModal: useCallback(() => {
      setIsRecoveryModalOpen(false);
      setTimeout(() => {
        const textToSubmit = userTranscriptRef.current || userTranscript;
        if (textToSubmit && textToSubmit.trim()) {
          void submitCurrentTurn(textToSubmit);
        }
      }, 350);
    }, [submitCurrentTurn, userTranscript]),
    speechNotice,
    clearSpeechNotice: useCallback(() => setSpeechNotice(null), []),
    repeatQuestion,
    skipQuestion,
    pauseInterview,
    resumeInterview,
    takeTime: useCallback(() => {}, []),
    toggleListening: toggleRecording,
    stopRecording,
    finishTurnManual: submitCurrentTurn,
    submitCurrentTurn,
    submitCustomAnswer: submitCurrentTurn,
    clearTranscript,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
    activeCefrLevel,
    setActiveCefrLevel,
  };
};
