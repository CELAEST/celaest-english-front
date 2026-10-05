import { useState, useEffect, useRef, useCallback } from "react";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { useInterviewQuestionManager } from "./useInterviewQuestionManager";
import {
  useInterviewSpeechAudio,
  InterviewStatus,
  ProcessingStage,
} from "./useInterviewSpeechAudio";
import { useInterviewTurnEvaluation } from "./useInterviewTurnEvaluation";
import {
  useInterviewCloudSync,
  __resetInterviewHydrationForTest,
} from "./useInterviewCloudSync";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import {
  loadPersistedInterview,
  PersistedInterviewState,
} from "../services/interviewPersistence";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";
import { normalizeCefrLevel } from "../../../shared/services/levelStore";

export { __resetInterviewHydrationForTest };
export type { InterviewStatus, ProcessingStage };

/** Maximum questions the system can serve per infinite session */
const OVERALL_QUESTION_CAP = 50;

export const useInterviewSession = (
  roleName: string = "Professional",
  initialLevel?: string,
  isActive: boolean = true,
) => {
  // ──────────────────────────────────────────────
  // 1. Restore persisted state (read once on mount)
  // ──────────────────────────────────────────────
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const normInitialLevel = initialLevel ? normalizeCefrLevel(initialLevel) : undefined;
  const [restored] = useState<PersistedInterviewState | null>(() =>
    loadPersistedInterview(currentUserId, normInitialLevel),
  );
  const [hasCloudHydrated, setHasCloudHydrated] = useState<boolean>(() => {
    return Boolean(restored?.sessionQuestions && restored.sessionQuestions.length > 0);
  });

  const handleHydrationComplete = useCallback((_hasQuestions: boolean, _level: string) => {
    setHasCloudHydrated(true);
  }, []);

  const handleLevelOrRoleReset = useCallback(() => {
    const uid = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
    const local = loadPersistedInterview(uid, normInitialLevel);
    setHasCloudHydrated(Boolean(local?.sessionQuestions && local.sessionQuestions.length > 0));
  }, [normInitialLevel]);

  // ──────────────────────────────────────────────
  // 2. Question Progression Sub-Hook
  // ──────────────────────────────────────────────
  const evaluationRef = useRef<ReturnType<typeof useInterviewTurnEvaluation> | null>(null);
  const cloudSyncRef = useRef<ReturnType<typeof useInterviewCloudSync> | null>(null);
  const speechRef = useRef<ReturnType<typeof useInterviewSpeechAudio> | null>(null);
  const speakTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastSpokenQuestionRef = useRef<string>("");

  const handleLevelWillChange = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (speakTimeoutRef.current) {
      clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }
    SpeechSynthesisService.stop();
    speechRef.current?.stopSpeakingAndReset();
    lastSpokenQuestionRef.current = "";
  }, []);

  const handleAiInfrastructureError = useCallback((err: unknown) => {
    const { scenario, cooldownSeconds } = classifyAiError(err);
    if (evaluationRef.current) {
      evaluationRef.current.setInfrastructureErrorScenario(scenario);
      evaluationRef.current.setRecoveryCooldown(cooldownSeconds);
      evaluationRef.current.setIsRecoveryModalOpen(true);
    }
  }, []);

  const questions = useInterviewQuestionManager({
    roleName,
    initialLevel: normInitialLevel,
    isActive,
    hasHydrated: hasCloudHydrated,
    persistedQuestions: restored?.sessionQuestions,
    persistedRoleName: restored?.roleName,
    persistedIndex: restored?.currentQuestionIndex ?? 0,
    persistedAskedQuestions: restored?.askedQuestions,
    onLevelOrRoleReset: handleLevelOrRoleReset,
    onLevelWillChange: handleLevelWillChange,
    onAiInfrastructureError: handleAiInfrastructureError,
    onQuestionsGenerated: (fresh, lvl, targetIndex) => {
      cloudSyncRef.current?.saveProgressNow({
        sessionQuestions: fresh,
        cefrLevel: lvl,
        currentQuestionIndex: targetIndex ?? 0,
      });
    },
  });

  // ──────────────────────────────────────────────
  // 3. Audio & Speech Sub-Hook
  // ──────────────────────────────────────────────
  const speech = useInterviewSpeechAudio({
    isActive,
    effectiveRoleName: questions.effectiveRoleName,
    activeCefrLevel: questions.activeCefrLevel,
    currentQuestion: questions.currentQuestion,
    currentQuestionRef: questions.currentQuestionRef,
    initialUserTranscript: restored?.userTranscript ?? "",
    initialSpeechRate: restored?.speechRate ?? 0.95,
  });

  speechRef.current = speech;

  // ──────────────────────────────────────────────
  // 4. Turn Evaluation Sub-Hook
  // ──────────────────────────────────────────────
  const evaluation = useInterviewTurnEvaluation({
    effectiveRoleName: questions.effectiveRoleName,
    activeCefrLevel: questions.activeCefrLevel,
    currentQuestion: questions.currentQuestion,
    initialFeedback: restored?.turnFeedback ?? null,
    initialSavedErrorIds: restored?.savedErrorIds ?? [],
    initialShowModal: restored?.showAnalysisModal ?? false,
    status: speech.status,
    setStatus: speech.setStatus,
    speakingSeconds: speech.speakingSeconds,
    setSpeakingSeconds: speech.setSpeakingSeconds,
    userTranscript: speech.userTranscript,
    userTranscriptRef: speech.userTranscriptRef,
    setUserTranscript: speech.setUserTranscript,
    lastCapturedAudioRef: speech.lastCapturedAudioRef,
    setSpeechNotice: speech.setSpeechNotice,
    isMountedRef: speech.isMountedRef,
  });

  evaluationRef.current = evaluation;

  const resumeFromRecoveryModal = useCallback(() => {
    evaluation.setIsRecoveryModalOpen(false);
    if (questions.sessionQuestions.length === 0 || questions.currentQuestionIndex >= questions.sessionQuestions.length) {
      questions.retryGeneration();
    }
    evaluation.resumeFromRecoveryModal();
  }, [evaluation, questions]);

  // ──────────────────────────────────────────────
  // 5. Cloud Synchronization Sub-Hook
  // ──────────────────────────────────────────────
  const cloudSync = useInterviewCloudSync({
    effectiveRoleName: questions.effectiveRoleName,
    activeCefrLevel: questions.activeCefrLevel,
    setActiveCefrLevel: questions.setActiveCefrLevel,
    speechRate: speech.speechRate,
    setSpeechRate: speech.setSpeechRate,
    currentQuestionIndex: questions.currentQuestionIndex,
    setCurrentQuestionIndex: questions.setCurrentQuestionIndex,
    userTranscript: speech.userTranscript,
    setUserTranscript: speech.setUserTranscript,
    userTranscriptRef: speech.userTranscriptRef,
    turnFeedback: evaluation.turnFeedback,
    setTurnFeedback: evaluation.setTurnFeedback,
    showAnalysisModal: evaluation.showAnalysisModal,
    setShowAnalysisModal: evaluation.setShowAnalysisModal,
    savedErrorIds: evaluation.savedErrorIds,
    setSavedErrorIds: evaluation.setSavedErrorIds,
    sessionQuestions: questions.sessionQuestions,
    setSessionQuestions: questions.setSessionQuestions,
    askedQuestions: questions.askedQuestions,
    setAskedQuestions: questions.setAskedQuestions,
    currentQuestionText: questions.currentQuestion?.question,
    restoredState: restored,
    onHydrationComplete: handleHydrationComplete,
  });

  cloudSyncRef.current = cloudSync;

  // ──────────────────────────────────────────────
  // 6. Proactive question TTS prefetch
  // ──────────────────────────────────────────────
  const { selectedVoice, speakQuestion } = speech;
  const { currentQuestionIndex } = questions;
  const questionText = questions.currentQuestion?.question;

  useEffect(() => {
    if (!isActive || !questionText) return;
    if (questionText.startsWith("Generating") || questionText.startsWith("Preparing")) return;
    SpeechSynthesisService.prefetch(questionText, selectedVoice);

    const nextQ = questions.sessionQuestions[currentQuestionIndex + 1];
    if (nextQ?.question) {
      SpeechSynthesisService.prefetch(nextQ.question, selectedVoice);
    }
  }, [isActive, questionText, currentQuestionIndex, questions.sessionQuestions, selectedVoice]);

  // ──────────────────────────────────────────────
  // 7. Auto-speak question on activation / change
  // ──────────────────────────────────────────────
  const prevActiveRef = useRef<boolean>(false);
  const { showAnalysisModal, turnFeedback } = evaluation;

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive || !hasCloudHydrated) {
      if (!isActive) {
        prevActiveRef.current = false;
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      }
      return;
    }

    const justActivated = !prevActiveRef.current && isActive;
    prevActiveRef.current = true;

    if (!questionText || showAnalysisModal || turnFeedback) return;
    if (questionText.startsWith("Generating") || questionText.startsWith("Preparing")) return;
    if (questions.isGeneratingQuestions || questions.sessionQuestions.length === 0) return;

    if (justActivated || lastSpokenQuestionRef.current !== questionText) {
      lastSpokenQuestionRef.current = questionText;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        speakTimeoutRef.current = setTimeout(() => {
          void speakQuestion().catch(() => {});
        }, 120);
      });
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (speakTimeoutRef.current) {
        clearTimeout(speakTimeoutRef.current);
        speakTimeoutRef.current = null;
      }
    };
  }, [
    questionText,
    isActive,
    hasCloudHydrated,
    showAnalysisModal,
    turnFeedback,
    speakQuestion,
    questions.isGeneratingQuestions,
    questions.sessionQuestions.length,
  ]);

  // ──────────────────────────────────────────────
  // 8. User actions
  // ──────────────────────────────────────────────
  const skipQuestion = useCallback(() => {
    if (evaluation.isBusy()) return;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    questions.markUserAdvanced();
    speech.stopSpeakingAndReset();
    speech.setUserTranscript("");
    speech.setSpeakingSeconds(0);
    evaluation.setTurnFeedback(null);
    evaluation.setShowAnalysisModal(false);
    lastSpokenQuestionRef.current = "";

    const nextIndex = questions.currentQuestionIndex + 1;
    if (questions.sessionQuestions.length > 0 && nextIndex >= questions.sessionQuestions.length) {
      questions.generateNextRound();
      return;
    }

    questions.setCurrentQuestionIndex(nextIndex);

    const currentQText = questions.currentQuestion?.question;
    const updatedAsked =
      currentQText &&
      !currentQText.startsWith("Generating") &&
      !currentQText.startsWith("Preparing")
        ? Array.from(new Set([...questions.askedQuestions, currentQText]))
        : questions.askedQuestions;

    cloudSyncRef.current?.saveProgressNow({
      currentQuestionIndex: nextIndex,
      userTranscript: "",
      showAnalysisModal: false,
      askedQuestions: updatedAsked,
      latestTurn: {},
    });
  }, [questions, speech, evaluation]);

  const closeAnalysisModal = useCallback(() => {
    evaluation.setShowAnalysisModal(false);
    cloudSyncRef.current?.saveProgressNow({
      showAnalysisModal: false,
      latestTurn: {
        question: questions.currentQuestion?.question ?? "",
        transcript: speech.userTranscriptRef.current || speech.userTranscript || evaluation.turnFeedback?.userSpokenText || "",
        feedback: (evaluation.turnFeedback ?? {}) as unknown as Record<string, unknown>,
      },
    });
  }, [evaluation, speech, questions]);

  const repeatQuestion = useCallback(
    (slow: boolean = false) => {
      if (evaluation.isBusy()) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
      const targetRate = slow ? Math.max(0.7, speech.speechRate - 0.2) : speech.speechRate;
      lastSpokenQuestionRef.current = "";
      void speech.speakQuestion(targetRate).catch(() => {});
    },
    [speech, evaluation],
  );

  const clearSpeechNotice = useCallback(() => {
    speech.setSpeechNotice(null);
  }, [speech]);

  const setActiveCefrLevel = useCallback(
    (level: string) => {
      handleLevelWillChange();
      speech.setUserTranscript("");
      evaluation.setTurnFeedback(null);
      evaluation.setShowAnalysisModal(false);
      questions.setActiveCefrLevel(level);
    },
    [questions, handleLevelWillChange, speech, evaluation],
  );

  // ──────────────────────────────────────────────
  // 9. Stable public API (return contract)
  // ──────────────────────────────────────────────
  return {
    // Status flags
    status: speech.status,
    processingStage: evaluation.processingStage,
    isListening: speech.status === "RECORDING",
    isAiSpeaking: speech.status === "AI_SPEAKING",
    isThinking: speech.status === "THINKING",
    isPaused: speech.status === "PAUSED",
    hasCloudHydrated,
    isGeneratingQuestions: questions.isGeneratingQuestions,
    sessionQuestions: questions.sessionQuestions,

    // Session context
    roleName: questions.effectiveRoleName,
    currentRound: questions.currentRound,
    questionInRound: questions.questionInRound,
    totalQuestionsInRound: questions.totalQuestionsInRound,
    currentQuestionIndex: questions.questionInRound,
    overallQuestionIndex: questions.currentQuestionIndex + 1,
    currentQuestion: questions.currentQuestion,
    totalQuestions: questions.totalQuestionsInRound,
    overallTotalQuestions: OVERALL_QUESTION_CAP,
    /** @deprecated Placeholder — real timer to be implemented with backend sync */
    remainingSeconds: 60,
    speakingSeconds: speech.speakingSeconds,

    // Audio settings
    speechRate: speech.speechRate,
    setSpeechRate: speech.setSpeechRate,
    selectedVoice: speech.selectedVoice,
    setSelectedVoice: speech.setSelectedVoice,

    // Transcript
    userTranscript: speech.userTranscript,
    setUserTranscript: speech.setUserTranscript,

    // Evaluation & feedback
    turnFeedback: evaluation.turnFeedback,
    savedErrorIds: evaluation.savedErrorIds,
    showAnalysisModal: evaluation.showAnalysisModal,
    setShowAnalysisModal: evaluation.setShowAnalysisModal,

    // Mic recovery
    isMicRecoveryModalOpen: speech.isMicRecoveryModalOpen,
    setIsMicRecoveryModalOpen: speech.setIsMicRecoveryModalOpen,
    resumeFromMicRecovery: speech.resumeFromMicRecovery,

    // AI infrastructure recovery
    isRecoveryModalOpen: evaluation.isRecoveryModalOpen,
    setIsRecoveryModalOpen: evaluation.setIsRecoveryModalOpen,
    infrastructureErrorScenario: evaluation.infrastructureErrorScenario,
    recoveryCooldown: evaluation.recoveryCooldown,
    resumeFromRecoveryModal,

    // Speech notice
    speechNotice: speech.speechNotice,
    clearSpeechNotice,

    // User actions
    repeatQuestion,
    skipQuestion,
    closeAnalysisModal,
    pauseInterview: speech.pauseInterview,
    resumeInterview: speech.resumeInterview,
    toggleListening: speech.toggleRecording,
    stopRecording: speech.stopRecording,
    finishTurnManual: evaluation.submitCurrentTurn,
    submitCurrentTurn: evaluation.submitCurrentTurn,
    submitCustomAnswer: evaluation.submitCurrentTurn,
    clearTranscript: speech.clearTranscript,
    /** @deprecated Noop — feature not yet implemented */
    takeTime: () => {},

    // Memory bank
    saveSpecificErrorToMemory: evaluation.saveSpecificErrorToMemory,
    saveAllErrorsToMemory: evaluation.saveAllErrorsToMemory,

    // CEFR level
    activeCefrLevel: questions.activeCefrLevel,
    setActiveCefrLevel,
  };
};
