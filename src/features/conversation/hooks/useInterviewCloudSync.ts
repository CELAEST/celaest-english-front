import { useEffect, useRef, useCallback } from "react";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiInterviewRepository } from "../../../infrastructure/repositories/ApiInterviewRepository";
import {
  loadPersistedInterview,
  savePersistedInterview,
  PersistedInterviewState,
} from "../services/interviewPersistence";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { InterviewQuestionItem } from "../services/interviewEngineService";

/** Per-user hydration tracking to prevent cross-user contamination in Strict Mode */
const hydrationLog = new Map<string, number>();

export function __resetInterviewHydrationForTest(): void {
  hydrationLog.clear();
}

export interface UseInterviewCloudSyncOptions {
  effectiveRoleName: string;
  speechRate: number;
  setSpeechRate: (r: number) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  userTranscript: string;
  setUserTranscript: (t: string) => void;
  userTranscriptRef: React.MutableRefObject<string>;
  turnFeedback: ComprehensiveTurnFeedback | null;
  setTurnFeedback: (fb: ComprehensiveTurnFeedback | null) => void;
  showAnalysisModal: boolean;
  setShowAnalysisModal: (show: boolean) => void;
  savedErrorIds: Set<string>;
  setSavedErrorIds: (ids: Set<string>) => void;
  sessionQuestions: InterviewQuestionItem[];
  currentQuestionText?: string;
  lastReplenishedIndexRef: React.MutableRefObject<number>;
  restoredState?: PersistedInterviewState | null;
}

export function useInterviewCloudSync({
  effectiveRoleName,
  speechRate,
  setSpeechRate,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  userTranscript,
  setUserTranscript,
  userTranscriptRef,
  turnFeedback,
  setTurnFeedback,
  showAnalysisModal,
  setShowAnalysisModal,
  savedErrorIds,
  setSavedErrorIds,
  sessionQuestions,
  currentQuestionText = "",
  lastReplenishedIndexRef,
  restoredState,
}: UseInterviewCloudSyncOptions) {
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const restoredRef = useRef<PersistedInterviewState | null>(
    restoredState !== undefined ? restoredState : loadPersistedInterview(currentUserId),
  );

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
      if (typeof p.currentQuestionIndex === "number") {
        setCurrentQuestionIndex(p.currentQuestionIndex);
        lastReplenishedIndexRef.current = p.currentQuestionIndex;
      }
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
    [
      setSpeechRate,
      setCurrentQuestionIndex,
      lastReplenishedIndexRef,
      setUserTranscript,
      userTranscriptRef,
      setSavedErrorIds,
      setShowAnalysisModal,
      setTurnFeedback,
    ],
  );

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

    if (lastSavedSnapshotRef.current === comparable) {
      return;
    }

    lastSavedSnapshotRef.current = comparable;

    const save = () => savePersistedInterview(snapshot, currentUserId);
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(save);
    } else {
      save();
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
            question: currentQuestionText,
            transcript: userTranscript,
            feedback: turnFeedback ?? {},
          },
        })
        .catch(() => {
          // Backend sync is best effort
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
    sessionQuestions,
    currentQuestionText,
    currentUserId,
  ]);

  // Hydrate from backend on mount
  const didHydrateRef = useRef(false);
  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;
    const hydrateKey = currentUserId ?? "__anon__";
    const lastHydrated = hydrationLog.get(hydrateKey) ?? 0;
    if (lastHydrated > 0 && Date.now() - lastHydrated < 5 * 1000) return;
    hydrationLog.set(hydrateKey, Date.now());
    let cancelled = false;

    apiInterviewRepository
      .getProgress()
      .then((dto) => {
        if (cancelled || !dto || !dto.updatedAt) return;
        const backendTime = new Date(dto.updatedAt).getTime();
        const localTime = restoredRef.current?.updatedAt ?? 0;
        if (!Number.isFinite(backendTime) || backendTime <= localTime) return;

        const sanitizedIndex = dto.currentQuestionIndex || 0;
        const sanitizedTurn = dto.latestTurn;

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
        // Offline or backend unavailable
      });

    return () => {
      cancelled = true;
    };
  }, [effectiveRoleName, applyProgress, currentUserId]);

  return {
    restoredRef,
  };
}
