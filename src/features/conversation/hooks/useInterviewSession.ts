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
  const [restored] = useState<PersistedInterviewState | null>(() => loadPersistedInterview(currentUserId));

  // ──────────────────────────────────────────────
  // 2. Question Progression Sub-Hook
  // ──────────────────────────────────────────────
  const evaluationRef = useRef<ReturnType<typeof useInterviewTurnEvaluation> | null>(null);

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
    initialLevel,
    isActive,
    persistedQuestions: restored?.sessionQuestions,
    persistedRoleName: restored?.roleName,
    persistedIndex: restored?.currentQuestionIndex ?? 0,
    persistedAskedQuestions: restored?.askedQuestions,
    onAiInfrastructureError: handleAiInfrastructureError,
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
  useInterviewCloudSync({
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
  });

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
  const lastSpokenQuestionRef = useRef<string>("");
  const { showAnalysisModal, turnFeedback } = evaluation;

  useEffect(() => {
    if (!isActive) {
      prevActiveRef.current = false;
      return;
    }

    const justActivated = !prevActiveRef.current && isActive;
    prevActiveRef.current = true;

    if (!questionText || showAnalysisModal || turnFeedback) return;
    if (questionText.startsWith("Generating") || questionText.startsWith("Preparing")) return;

    if (justActivated || lastSpokenQuestionRef.current !== questionText) {
      lastSpokenQuestionRef.current = questionText;
      void speakQuestion().catch(() => {});
    }
  }, [questionText, isActive, showAnalysisModal, turnFeedback, speakQuestion]);

  // ──────────────────────────────────────────────
  // 8. User actions
  // ──────────────────────────────────────────────
  const skipQuestion = useCallback(() => {
    if (evaluation.isBusy()) return;
    questions.markUserAdvanced();
    speech.stopSpeakingAndReset();
    speech.setUserTranscript("");
    speech.setSpeakingSeconds(0);
    evaluation.setTurnFeedback(null);
    evaluation.setShowAnalysisModal(false);
    lastSpokenQuestionRef.current = "";
    questions.setCurrentQuestionIndex((prev) => prev + 1);
  }, [questions, speech, evaluation]);

  const repeatQuestion = useCallback(
    (slow: boolean = false) => {
      if (evaluation.isBusy()) return;
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
      speech.stopSpeakingAndReset();
      speech.setUserTranscript("");
      evaluation.setTurnFeedback(null);
      questions.setActiveCefrLevel(level);
    },
    [questions, speech, evaluation],
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
