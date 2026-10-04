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
import { SaveProgressPayload } from "../../../domain/repositories/IInterviewRepository";
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
  onHydrationComplete?: (hasQuestions: boolean, level: string) => void;
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
  onHydrationComplete,
}: UseInterviewCloudSyncOptions) {
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const restoredRef = useRef<PersistedInterviewState | null>(
    restoredState !== undefined
      ? restoredState
      : loadPersistedInterview(currentUserId, activeCefrLevel),
  );

  const onHydrationCompleteRef = useRef(onHydrationComplete);
  useEffect(() => {
    onHydrationCompleteRef.current = onHydrationComplete;
  }, [onHydrationComplete]);

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
      if (typeof p.speechRate === "number" && p.speechRate !== speechRate) {
        setSpeechRate(p.speechRate);
      }
      if (typeof p.cefrLevel === "string" && p.cefrLevel) {
        const norm = p.cefrLevel.toUpperCase().trim();
        if (norm !== activeCefrLevel) {
          setActiveCefrLevel(norm);
        }
      }
      if (typeof p.currentQuestionIndex === "number" && p.currentQuestionIndex !== currentQuestionIndex) {
        setCurrentQuestionIndex(p.currentQuestionIndex);
      }
      if (Array.isArray(p.sessionQuestions) && p.sessionQuestions.length > 0) {
        setSessionQuestions((prev) => {
          if (
            prev.length === p.sessionQuestions!.length &&
            prev.every((q, idx) => q.question === p.sessionQuestions![idx]?.question)
          ) {
            return prev;
          }
          return p.sessionQuestions!;
        });
      }
      if (Array.isArray(p.askedQuestions)) {
        setAskedQuestions((prev) => {
          if (
            prev.length === p.askedQuestions!.length &&
            prev.every((q, idx) => q === p.askedQuestions![idx])
          ) {
            return prev;
          }
          return p.askedQuestions!;
        });
      }
      if (typeof p.userTranscript === "string" && p.userTranscript !== userTranscript) {
        setUserTranscript(p.userTranscript);
        userTranscriptRef.current = p.userTranscript;
      }
      if (Array.isArray(p.savedErrorIds)) {
        const isSame =
          p.savedErrorIds.length === savedErrorIds.size &&
          p.savedErrorIds.every((id) => savedErrorIds.has(id));
        if (!isSame) {
          setSavedErrorIds(new Set(p.savedErrorIds));
        }
      }

      const fb = p.latestTurn?.feedback as any;
      const hasValidFeedback =
        fb &&
        typeof fb === "object" &&
        typeof fb.overallScore === "number" &&
        !isNaN(fb.overallScore) &&
        fb.overallScore > 0;

      if (hasValidFeedback) {
        setTurnFeedback(fb as unknown as ComprehensiveTurnFeedback);
        if (typeof p.showAnalysisModal === "boolean") setShowAnalysisModal(p.showAnalysisModal);
      } else {
        // Blindaje contra modal fantasma con NaN: si la BD no tiene feedback numérico real, jamás abrir el modal
        setTurnFeedback(null);
        setShowAnalysisModal(false);
      }

      // Persist the verified authoritative snapshot to localStorage so next mount is 100% synchronous
      const targetLevel = (p.cefrLevel || activeCefrLevel).toUpperCase().trim();
      const effectiveQuestions =
        Array.isArray(p.sessionQuestions) && p.sessionQuestions.length > 0
          ? p.sessionQuestions
          : sessionQuestions.length > 0
            ? sessionQuestions
            : undefined;
      const effectiveAsked =
        Array.isArray(p.askedQuestions) && p.askedQuestions.length > 0
          ? p.askedQuestions
          : askedQuestions.length > 0
            ? askedQuestions
            : undefined;

      const snapshot: PersistedInterviewState = {
        version: 2,
        roleName: p.roleName || effectiveRoleName,
        cefrLevel: targetLevel,
        speechRate: typeof p.speechRate === "number" ? p.speechRate : speechRate,
        currentQuestionIndex:
          typeof p.currentQuestionIndex === "number" ? p.currentQuestionIndex : currentQuestionIndex,
        userTranscript: typeof p.userTranscript === "string" ? p.userTranscript : userTranscript,
        turnFeedback: hasValidFeedback ? (fb as unknown as ComprehensiveTurnFeedback) : null,
        showAnalysisModal: hasValidFeedback && typeof p.showAnalysisModal === "boolean" ? p.showAnalysisModal : false,
        savedErrorIds: Array.isArray(p.savedErrorIds) ? p.savedErrorIds : Array.from(savedErrorIds),
        sessionQuestions: effectiveQuestions,
        askedQuestions: effectiveAsked,
        updatedAt: Date.now(),
      };
      savePersistedInterview(snapshot, currentUserId);
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
      activeCefrLevel,
      sessionQuestions,
      askedQuestions,
      effectiveRoleName,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      savedErrorIds,
      currentUserId,
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

  // Server-Wins Hydration from backend on mount and level change
  const didHydrateRef = useRef(false);
  const syncFromBackend = useCallback(
    (targetLevel?: string, force: boolean = false) => {
      const levelToFetch = (targetLevel || activeCefrLevel).toUpperCase().trim();
      const hydrateKey = `${currentUserId ?? "__anon__"}:${levelToFetch}`;
      const lastHydrated = hydrationLog.get(hydrateKey) ?? 0;
      if (!force && lastHydrated > 0 && Date.now() - lastHydrated < 2 * 1000) return;
      hydrationLog.set(hydrateKey, Date.now());

      apiInterviewRepository
        .getProgress(levelToFetch)
        .then((dto) => {
          if (!dto) {
            onHydrationCompleteRef.current?.(false, levelToFetch);
            return;
          }

          const backendTime = dto.updatedAt ? new Date(dto.updatedAt).getTime() : 0;
          const localState = loadPersistedInterview(currentUserId, levelToFetch);
          const localTime = localState?.updatedAt ?? restoredRef.current?.updatedAt ?? 0;

          const hasLocalQuestions =
            Array.isArray(localState?.sessionQuestions) && localState.sessionQuestions.length > 0;
          const backendHasQuestions =
            Array.isArray(dto.sessionQuestions) && dto.sessionQuestions.length > 0;

          // If local state is strictly newer than backend, keep the local snapshot UNLESS local has no questions and backend does
          if (
            !force &&
            Number.isFinite(backendTime) &&
            Number.isFinite(localTime) &&
            localTime > 0 &&
            backendTime <= localTime &&
            (!backendHasQuestions || hasLocalQuestions)
          ) {
            onHydrationCompleteRef.current?.(hasLocalQuestions, levelToFetch);
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
          const adoptedLevel = dto.cefrLevel || levelToFetch;
          const adoptedRate = dto.speechRate ?? speechRate;
          const adoptedSavedErrIds = dto.savedErrorIds || [];

          lastSavedSnapshotRef.current = JSON.stringify({
            version: 2,
            roleName: adoptedRole,
            cefrLevel: adoptedLevel,
            speechRate: adoptedRate,
            currentQuestionIndex: sanitizedIndex,
            turnFeedback: sanitizedTurn?.feedback
              ? (sanitizedTurn.feedback as any).overallScore
              : null,
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

          const hasQuestions =
            Array.isArray(dto.sessionQuestions) && dto.sessionQuestions.length > 0;
          onHydrationCompleteRef.current?.(hasQuestions, levelToFetch);
        })
        .catch((err) => {
          logger.warn("[useInterviewCloudSync] Initial hydration offline or failed:", err);
          onHydrationCompleteRef.current?.(false, levelToFetch);
        });
    },
    [currentUserId, applyProgress, effectiveRoleName, activeCefrLevel, speechRate],
  );

  useEffect(() => {
    if (didHydrateRef.current) return;
    didHydrateRef.current = true;
    syncFromBackend(activeCefrLevel);
  }, [syncFromBackend, activeCefrLevel]);

  // When active level changes, sync that specific level from backend
  const prevActiveLevelRef = useRef<string>(activeCefrLevel);
  useEffect(() => {
    if (prevActiveLevelRef.current !== activeCefrLevel) {
      prevActiveLevelRef.current = activeCefrLevel;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      syncFromBackend(activeCefrLevel, true);
    }
  }, [activeCefrLevel, syncFromBackend]);

  // Cross-device sync: When tab becomes visible or window gains focus, check backend for updates
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncFromBackend(activeCefrLevel, true);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onVisibilityChange);
    };
  }, [syncFromBackend, activeCefrLevel]);

  // Immediate save bypasses debounce for critical lifecycle actions (questions generated, turn advance)
  const saveProgressNow = useCallback(
    (customPayload?: Partial<SaveProgressPayload>) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }

      const role = customPayload?.roleName ?? effectiveRoleName;
      const level = customPayload?.cefrLevel ?? activeCefrLevel;
      const rate = customPayload?.speechRate ?? speechRate;
      const index = customPayload?.currentQuestionIndex ?? currentQuestionIndex;
      const transcript = customPayload?.userTranscript ?? userTranscript;
      const errIds = customPayload?.savedErrorIds ?? Array.from(savedErrorIds);
      const modal = customPayload?.showAnalysisModal ?? showAnalysisModal;
      const questions = customPayload?.sessionQuestions ?? (sessionQuestions.length > 0 ? sessionQuestions : undefined);
      const asked = customPayload?.askedQuestions ?? (askedQuestions.length > 0 ? askedQuestions : undefined);
      const latestTurn = customPayload?.latestTurn ?? {
        question: currentQuestionText,
        transcript: userTranscript,
        feedback: turnFeedback ?? {},
      };

      const payload: SaveProgressPayload = {
        roleName: role,
        cefrLevel: level,
        speechRate: rate,
        currentQuestionIndex: index,
        userTranscript: transcript,
        savedErrorIds: errIds,
        showAnalysisModal: modal,
        sessionQuestions: questions,
        askedQuestions: asked,
        latestTurn,
        replaceQuestions: Boolean(questions && questions.length > 0),
      };

      const snapshot: PersistedInterviewState = {
        version: 2,
        roleName: role,
        cefrLevel: level,
        speechRate: rate,
        currentQuestionIndex: index,
        userTranscript: transcript,
        turnFeedback,
        showAnalysisModal: modal,
        savedErrorIds: errIds,
        sessionQuestions: questions,
        askedQuestions: asked,
        updatedAt: Date.now(),
      };
      savePersistedInterview(snapshot, currentUserId);

      return apiInterviewRepository
        .saveProgress(payload)
        .then((canonical) => {
          if (canonical?.sessionQuestions && canonical.sessionQuestions.length > 0 && sessionQuestions.length === 0) {
            applyProgress({
              roleName: canonical.roleName,
              cefrLevel: canonical.cefrLevel,
              sessionQuestions: canonical.sessionQuestions,
              currentQuestionIndex: canonical.currentQuestionIndex,
              askedQuestions: canonical.askedQuestions,
            });
          }
        })
        .catch((err) => {
          logger.warn("[useInterviewCloudSync] Immediate save error:", err);
        });
    },
    [
      effectiveRoleName,
      activeCefrLevel,
      speechRate,
      currentQuestionIndex,
      userTranscript,
      savedErrorIds,
      showAnalysisModal,
      sessionQuestions,
      askedQuestions,
      currentQuestionText,
      turnFeedback,
      currentUserId,
    ],
  );

  return {
    restoredRef,
    syncFromBackend,
    saveProgressNow,
  };
}
