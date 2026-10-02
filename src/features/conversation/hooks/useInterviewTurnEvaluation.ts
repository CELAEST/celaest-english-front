import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CoreAiEvaluatorService } from "../services/coreAiEvaluatorService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { SpecificErrorItem, InterviewQuestionItem } from "../services/interviewEngineService";
import { AudioCaptureService } from "../services/audioCaptureService";
import { validateSpeechIntelligibility } from "../services/speechIntelligibilityGuard";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { appToast } from "../../../design-system/components/Toast";
import { logger } from "../../../shared/utils/logger";
import { ERROR_DATA, ErrorScenarioData } from "../../../shared/constants/errorScenarios";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";
import { ENV } from "../../../shared/constants/env";
import { InterviewStatus, ProcessingStage } from "./useInterviewSpeechAudio";
import type { CapturedAudioMeta } from "./useInterviewRecording";

export interface UseInterviewTurnEvaluationOptions {
  effectiveRoleName: string;
  activeCefrLevel: string;
  currentQuestion: InterviewQuestionItem;
  initialFeedback?: ComprehensiveTurnFeedback | null;
  initialSavedErrorIds?: string[];
  initialShowModal?: boolean;
  status: InterviewStatus;
  setStatus: React.Dispatch<React.SetStateAction<InterviewStatus>>;
  speakingSeconds: number;
  setSpeakingSeconds: React.Dispatch<React.SetStateAction<number>>;
  userTranscript: string;
  userTranscriptRef: React.MutableRefObject<string>;
  setUserTranscript: (value: string | ((prev: string) => string)) => void;
  lastCapturedAudioRef: React.MutableRefObject<CapturedAudioMeta>;
  setSpeechNotice: React.Dispatch<React.SetStateAction<string | null>>;
  isMountedRef: React.MutableRefObject<boolean>;
}

export function useInterviewTurnEvaluation({
  effectiveRoleName,
  activeCefrLevel,
  currentQuestion,
  initialFeedback = null,
  initialSavedErrorIds = [],
  initialShowModal = false,
  status,
  setStatus,
  speakingSeconds,
  setSpeakingSeconds,
  userTranscript,
  userTranscriptRef,
  setUserTranscript,
  lastCapturedAudioRef,
  setSpeechNotice,
  isMountedRef,
}: UseInterviewTurnEvaluationOptions) {
  const queryClient = useQueryClient();
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("IDLE");
  const [turnFeedback, setTurnFeedback] = useState<ComprehensiveTurnFeedback | null>(initialFeedback);
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(new Set(initialSavedErrorIds));
  const [showAnalysisModal, setShowAnalysisModal] = useState<boolean>(initialShowModal);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [infrastructureErrorScenario, setInfrastructureErrorScenario] = useState<ErrorScenarioData>(
    ERROR_DATA["keys-exhausted-pool"] || Object.values(ERROR_DATA)[0],
  );
  const [recoveryCooldown, setRecoveryCooldown] = useState<number>(14);

  const isEvaluatingRef = useRef<boolean>(false);
  const savingItemIdsRef = useRef<Set<string>>(new Set());

  const processTurn = useCallback(
    async (answerText: string, audioUrl?: string | null, durationSeconds?: number) => {
      setStatus("THINKING");
      setProcessingStage("ANALYZING");

      try {
        const feedback = await CoreAiEvaluatorService.evaluate(
          answerText,
          currentQuestion,
          effectiveRoleName,
          activeCefrLevel,
        );

        if (!isMountedRef.current) return;
        if (feedback) {
          const feedbackTitleLower = (feedback.strategicFeedback?.title || "").toLowerCase();
          const isSpanish =
            feedback.overallScore === 0 &&
            (feedbackTitleLower.includes("respuesta en español") ||
              feedbackTitleLower === "respuesta en español" ||
              feedbackTitleLower.includes("non-english"));

          if (isSpanish) {
            setSpeakingSeconds(0);
            appToast.spanishDetected(
              feedback.strategicFeedback?.explanation ||
                "Detectamos que tu respuesta está formulada en español. Por favor responde en inglés para evaluar tu práctica.",
            );
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
      } catch (err: unknown) {
        logger.warn("Interview turn evaluation failed:", err);
        const { scenario, cooldownSeconds } = classifyAiError(err);
        setInfrastructureErrorScenario(scenario);
        setRecoveryCooldown(cooldownSeconds);
        setIsRecoveryModalOpen(true);
      } finally {
        isEvaluatingRef.current = false;
        if (isMountedRef.current) {
          setProcessingStage("IDLE");
          setStatus("IDLE");
        }
      }
    },
    [currentQuestion, effectiveRoleName, activeCefrLevel, isMountedRef, setStatus, setSpeakingSeconds],
  );

  const submitCurrentTurn = useCallback(
    async (customText?: string) => {
      if (isEvaluatingRef.current) return;
      isEvaluatingRef.current = true;

      try {
        let textToSubmit = (
          typeof customText === "string" ? customText : userTranscriptRef.current || userTranscript
        ).trim();
        let audioUrl = lastCapturedAudioRef.current.audioUrl;
        let durationSeconds = lastCapturedAudioRef.current.durationSeconds;
        let detectedLang: string | undefined = lastCapturedAudioRef.current.detectedLanguage;

        // If user clicks submit while recording, stop hardware and transcribe audio first
        if (status === "RECORDING") {
          const audioResult = await AudioCaptureService.stopAndGetAudio();
          lastCapturedAudioRef.current = audioResult;
          audioUrl = audioResult.audioUrl;
          durationSeconds = audioResult.durationSeconds || speakingSeconds;

          if (typeof customText !== "string") {
            const latestLive = (userTranscriptRef.current || userTranscript).trim();
            if (latestLive.length > textToSubmit.length) {
              textToSubmit = latestLive;
            }
          }

          // If audio was captured via MediaRecorder, transcribe via Whisper AI for verbatim ESL accuracy
          if (audioResult.audioBlob) {
            setStatus("THINKING");
            setProcessingStage("TRANSCRIBING");
            try {
              const whisperResult = await AudioCaptureService.transcribeAudio(audioResult.audioBlob, {
                roleName: effectiveRoleName,
                question: currentQuestion.question,
              });
              if (whisperResult && whisperResult.text.trim().length > 0) {
                textToSubmit = whisperResult.text.trim();
                detectedLang = whisperResult.language;
                lastCapturedAudioRef.current.detectedLanguage = detectedLang;
                lastCapturedAudioRef.current.avgLogprob = whisperResult.avgLogprob;
                lastCapturedAudioRef.current.noSpeechProb = whisperResult.noSpeechProb;
                setUserTranscript(textToSubmit);
                userTranscriptRef.current = textToSubmit;
              }
            } catch (err) {
              logger.warn("Whisper transcription fallback to web speech on submit:", err);
            }
          }
        } else if (!textToSubmit && lastCapturedAudioRef.current.audioBlob) {
          setStatus("THINKING");
          setProcessingStage("TRANSCRIBING");
          try {
            const whisperResult = await AudioCaptureService.transcribeAudio(
              lastCapturedAudioRef.current.audioBlob,
              {
                roleName: effectiveRoleName,
                question: currentQuestion.question,
              },
            );
            if (whisperResult && whisperResult.text.trim().length > 0) {
              textToSubmit = whisperResult.text.trim();
              detectedLang = whisperResult.language;
              lastCapturedAudioRef.current.detectedLanguage = detectedLang;
              lastCapturedAudioRef.current.avgLogprob = whisperResult.avgLogprob;
              lastCapturedAudioRef.current.noSpeechProb = whisperResult.noSpeechProb;
              setUserTranscript(textToSubmit);
              userTranscriptRef.current = textToSubmit;
            }
          } catch (err) {
            logger.warn("Whisper transcription fallback on submit:", err);
          }
        }

        const validation = validateSpeechIntelligibility(
          textToSubmit,
          durationSeconds,
          detectedLang,
          {
            avgLogprob: lastCapturedAudioRef.current.avgLogprob,
            noSpeechProb: lastCapturedAudioRef.current.noSpeechProb,
            targetLevel: activeCefrLevel,
          },
        );
        if (!validation.isValid) {
          logger.info("[useInterviewTurnEvaluation] Suppressed turn submission:", validation.reason);
          if (isMountedRef.current) {
            if (validation.message) {
              setSpeechNotice(validation.message);
              if (validation.reason === "SPANISH_DETECTED") {
                appToast.spanishDetected(validation.message);
              } else if (
                validation.reason === "WHISPER_HALLUCINATION" ||
                validation.reason === "SILENCE_OR_EMPTY" ||
                validation.reason === "REPETITIVE_NOISE"
              ) {
                appToast.ambientNoise(validation.message);
              } else {
                appToast.warning("Atención", validation.message);
              }
            }
            setStatus("IDLE");
            setProcessingStage("IDLE");
          }
          return;
        }

        setSpeechNotice(null);
        await processTurn(validation.cleanTranscript, audioUrl, durationSeconds);
      } catch (err) {
        logger.warn("[useInterviewTurnEvaluation] Error in submitCurrentTurn:", err);
        if (isMountedRef.current) {
          setStatus("IDLE");
          setProcessingStage("IDLE");
        }
      } finally {
        isEvaluatingRef.current = false;
      }
    },
    [
      status,
      userTranscript,
      userTranscriptRef,
      setUserTranscript,
      lastCapturedAudioRef,
      speakingSeconds,
      effectiveRoleName,
      currentQuestion,
      activeCefrLevel,
      setSpeechNotice,
      processTurn,
      setStatus,
      isMountedRef,
    ],
  );

  const saveSpecificErrorToMemory = useCallback(
    async (errorItem: SpecificErrorItem): Promise<boolean> => {
      if (savedErrorIds.has(errorItem.id) || savingItemIdsRef.current.has(errorItem.id)) {
        return true;
      }
      savingItemIdsRef.current.add(errorItem.id);
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

        // Zero-Reload Reactivity: Invalidate Memory Vault cache across all categories
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memory.all });

        setSavedErrorIds((prev) => new Set([...prev, errorItem.id]));
        return true;
      } catch (err) {
        logger.warn("Failed to add interview correction to Memory Bank", err);
        return false;
      } finally {
        savingItemIdsRef.current.delete(errorItem.id);
      }
    },
    [savedErrorIds, queryClient],
  );

  const saveAllErrorsToMemory = useCallback(async (): Promise<number> => {
    if (!turnFeedback || turnFeedback.unclearOrErrorWords.length === 0) return 0;
    let savedCount = 0;

    for (const item of turnFeedback.unclearOrErrorWords) {
      if (!savedErrorIds.has(item.id) && !savingItemIdsRef.current.has(item.id)) {
        const success = await saveSpecificErrorToMemory(item);
        if (success) savedCount++;
      }
    }

    return savedCount;
  }, [turnFeedback, savedErrorIds, saveSpecificErrorToMemory]);

  const resumeFromRecoveryModal = useCallback(() => {
    setIsRecoveryModalOpen(false);
    // Best-effort reset of exhausted key pool on the backend
    fetch(`${ENV.coreAiUrl}/ai/keys/reset`, { method: "POST" }).catch((err) => {
      logger.warn("[useInterviewTurnEvaluation] Key pool reset failed:", err);
    });
    setTimeout(() => {
      const text = userTranscriptRef.current || userTranscript;
      if (text && text.trim()) {
        void submitCurrentTurn(text);
      }
    }, 350);
  }, [submitCurrentTurn, userTranscript, userTranscriptRef]);

  const isBusy = useCallback(() => isEvaluatingRef.current, []);

  return {
    processingStage,
    setProcessingStage,
    turnFeedback,
    setTurnFeedback,
    savedErrorIds,
    setSavedErrorIds,
    showAnalysisModal,
    setShowAnalysisModal,
    isRecoveryModalOpen,
    setIsRecoveryModalOpen,
    infrastructureErrorScenario,
    recoveryCooldown,
    isEvaluatingRef,
    isBusy,
    submitCurrentTurn,
    saveSpecificErrorToMemory,
    saveAllErrorsToMemory,
    resumeFromRecoveryModal,
  };
}
