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
import { logger } from "../../../shared/utils/logger";

/** Per-user hydration tracking to prevent duplicate requests in Strict Mode */
const hydrationLog = new Map<string, number>();

export function __resetInterviewHydrationForTest(): void {
  hydrationLog.clear();
}

export interface UseInterviewCloudSyncOptions {
  effectiveRoleName: string;
  activeCefrLevel: string;
  setActiveCefrLevel: (lvl: string) => void;
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
  setSessionQuestions: React.Dispatch<React.SetStateAction<InterviewQuestionItem[]>>;
  askedQuestions: string[];
  setAskedQuestions: React.Dispatch<React.SetStateAction<string[]>>;
  currentQuestionText?: string;
  restoredState?: PersistedInterviewState | null;
}

export function useInterviewCloudSync({
  effectiveRoleName,
  activeCefrLevel,
  setActiveCefrLevel,
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
  setSessionQuestions,
  askedQuestions,
  setAskedQuestions,
  currentQuestionText = "",
  restoredState,
}: UseInterviewCloudSyncOptions) {
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const restoredRef = useRef<PersistedInterviewState | null>(
    restoredState !== undefined ? restoredState : loadPersistedInterview(currentUserId),
  );

  const applyProgress = useCallback(
    (p: {
      roleName?: string | undefined;
      cefrLevel?: string | undefined;
      speechRate?: number | undefined;
      currentQuestionIndex?: number | undefined;
      userTranscript?: string | undefined;
      savedErrorIds?: string[] | undefined;
      showAnalysisModal?: boolean | undefined;
      sessionQuestions?: InterviewQuestionItem[] | undefined;
      askedQuestions?: string[] | undefined;
      latestTurn?: Record<string, unknown> | null | undefined;
    }) => {
      if (typeof p.speechRate === "number") setSpeechRate(p.speechRate);
      if (typeof p.cefrLevel === "string" && p.cefrLevel) {
        setActiveCefrLevel(p.cefrLevel);
      }
      if (typeof p.currentQuestionIndex === "number") {
        setCurrentQuestionIndex(p.currentQuestionIndex);
      }
      if (Array.isArray(p.sessionQuestions) && p.sessionQuestions.length > 0) {
        setSessionQuestions(p.sessionQuestions);
      }
      if (Array.isArray(p.askedQuestions)) {
        setAskedQuestions(p.askedQuestions);
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
      setActiveCefrLevel,
      setCurrentQuestionIndex,
      setSessionQuestions,
      setAskedQuestions,
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

  // Event-driven persistence: save only on meaningful milestones
  // (index change, feedback received, modal toggled, level changed, questions updated)
  // NEVER on each spoken character of userTranscript!
  useEffect(() => {
    const snapshot: PersistedInterviewState = {
      version: 2,
      roleName: effectiveRoleName,
      cefrLevel: activeCefrLevel,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      turnFeedback,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
      sessionQuestions: sessionQuestions.length > 0 ? sessionQuestions : undefined,
      askedQuestions: askedQuestions.length > 0 ? askedQuestions : undefined,
      updatedAt: Date.now(),
    };

    const comparable = JSON.stringify({
      version: 2,
      roleName: effectiveRoleName,
      cefrLevel: activeCefrLevel,
      speechRate,
      currentQuestionIndex,
      turnFeedback: turnFeedback ? turnFeedback.overallScore : null,
      showAnalysisModal,
      savedErrorIds: Array.from(savedErrorIds),
      questionsCount: sessionQuestions.length,
      askedCount: askedQuestions.length,
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

    // Save offline localStorage copy
    const saveLocal = () => savePersistedInterview(snapshot, currentUserId);
    if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(saveLocal);
    } else {
      saveLocal();
    }

    // Debounce cloud sync to backend
    const debounceMs = 600;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      apiInterviewRepository
        .saveProgress({
          roleName: effectiveRoleName,
          cefrLevel: activeCefrLevel,
          speechRate,
          currentQuestionIndex,
          userTranscript,
          savedErrorIds: Array.from(savedErrorIds),
          showAnalysisModal,
          sessionQuestions: sessionQuestions.length > 0 ? sessionQuestions : undefined,
          askedQuestions: askedQuestions.length > 0 ? askedQuestions : undefined,
          latestTurn: {
            question: currentQuestionText,
            transcript: userTranscript,
            feedback: turnFeedback ?? {},
          },
        })
        .catch((err) => {
          logger.warn("[useInterviewCloudSync] SaveProgress error (best-effort):", err);
        });
    }, debounceMs);
  }, [
    effectiveRoleName,
    activeCefrLevel,
    speechRate,
    currentQuestionIndex,
    turnFeedback,
    showAnalysisModal,
    savedErrorIds,
    sessionQuestions,
    askedQuestions,
    currentQuestionText,
    userTranscript,
    currentUserId,
  ]);

  // Server-Wins Hydration from backend on mount
  const didHydrateRef = useRef(false);
  const syncFromBackend = useCallback(() => {
    const hydrateKey = currentUserId ?? "__anon__";
    const lastHydrated = hydrationLog.get(hydrateKey) ?? 0;
    if (lastHydrated > 0 && Date.now() - lastHydrated < 3 * 1000) return;
    hydrationLog.set(hydrateKey, Date.now());

    apiInterviewRepository
      .getProgress()
      .then((dto) => {
        if (!dto || !dto.updatedAt) return;
        const backendTime = new Date(dto.updatedAt).getTime();
        const localTime = restoredRef.current?.updatedAt ?? 0;
        if (Number.isFinite(backendTime) && Number.isFinite(localTime) && backendTime <= localTime) {
          return;
        }

        const sanitizedIndex = dto.currentQuestionIndex || 0;
        let sanitizedTurn: Record<string, unknown> | null = null;
        if (dto.latestTurn) {
          if (typeof dto.latestTurn === "string") {
            try {
              sanitizedTurn = JSON.parse(dto.latestTurn);
            } catch {
              sanitizedTurn = null;
            }
          } else if (typeof dto.latestTurn === "object") {
            sanitizedTurn = dto.latestTurn;
          }
        }

        // Cancel any pending save timeout to avoid overwriting or redundant POST
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }

        const adoptedRole = dto.roleName || effectiveRoleName;
        const adoptedLevel = dto.cefrLevel || activeCefrLevel;
        const adoptedRate = dto.speechRate ?? speechRate;
        const adoptedSavedErrIds = dto.savedErrorIds || [];

        lastSavedSnapshotRef.current = JSON.stringify({
          version: 2,
          roleName: adoptedRole,
          cefrLevel: adoptedLevel,
          speechRate: adoptedRate,
          currentQuestionIndex: sanitizedIndex,
          turnFeedback: sanitizedTurn?.feedback ? (sanitizedTurn.feedback as any).overallScore : null,
          showAnalysisModal: Boolean(dto.showAnalysisModal),
          savedErrorIds: Array.from(adoptedSavedErrIds),
          questionsCount: dto.sessionQuestions?.length ?? 0,
          askedCount: dto.askedQuestions?.length ?? 0,
        });

        applyProgress({
          roleName: adoptedRole,
          cefrLevel: adoptedLevel,
          speechRate: adoptedRate,
          currentQuestionIndex: sanitizedIndex,
          userTranscript: dto.userTranscript,
          savedErrorIds: adoptedSavedErrIds,
          showAnalysisModal: dto.showAnalysisModal,
          sessionQuestions: dto.sessionQuestions,
          askedQuestions: dto.askedQuestions,
          latestTurn: sanitizedTurn,
        });
      })
      .catch((err) => {
        logger.warn("[useInterviewCloudSync] Initial hydration offline or failed:", err);
      });
  }, [currentUserId, applyProgress, effectiveRoleName, activeCefrLevel]);

  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;
    syncFromBackend();
  }, [syncFromBackend]);

  // Cross-device sync: When tab becomes visible, check backend for updates made from other devices
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncFromBackend();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [syncFromBackend]);

  return {
    restoredRef,
    syncFromBackend,
  };
}
