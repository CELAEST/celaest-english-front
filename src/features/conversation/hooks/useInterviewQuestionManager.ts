import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { InterviewQuestionItem } from "../services/interviewEngineService";
import { normalizeCefr, CefrLevelCode } from "../services/dynamicQuestionService";
import {
  getUserCefrLevel,
  setUserCefrLevel,
  normalizeCefrLevel,
} from "../../../shared/services/levelStore";
import { AiInterviewQuestionGenerator } from "../services/aiInterviewQuestionGenerator";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { loadPersistedInterview } from "../services/interviewPersistence";
import { logger } from "../../../shared/utils/logger";

export interface UseInterviewQuestionManagerOptions {
  roleName?: string | undefined;
  initialLevel?: string | undefined;
  isActive: boolean;
  hasHydrated?: boolean | undefined;
  persistedQuestions?: InterviewQuestionItem[] | undefined;
  persistedRoleName?: string | undefined;
  persistedIndex?: number | undefined;
  persistedAskedQuestions?: string[] | undefined;
  onLevelOrRoleReset?: (() => void) | undefined;
  onLevelWillChange?: (() => void) | undefined;
  onAiInfrastructureError?: ((err: unknown) => void) | undefined;
  onQuestionsGenerated?: ((questions: InterviewQuestionItem[], level: string, targetIndex?: number) => void) | undefined;
}

export function useInterviewQuestionManager({
  roleName = "Professional",
  initialLevel,
  isActive,
  hasHydrated = true,
  persistedQuestions,
  persistedRoleName,
  persistedIndex = 0,
  persistedAskedQuestions,
  onLevelOrRoleReset,
  onLevelWillChange,
  onAiInfrastructureError,
  onQuestionsGenerated,
}: UseInterviewQuestionManagerOptions) {
  const effectiveRoleName =
    roleName && roleName !== "Professional" ? roleName : "Professional";

  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;

  const [activeCefrLevel, setActiveCefrLevelState] = useState<string>(() => {
    if (initialLevel) return normalizeCefrLevel(initialLevel);
    if (persistedQuestions && persistedQuestions.length > 0 && persistedQuestions[0].targetLevel) {
      return normalizeCefr(persistedQuestions[0].targetLevel);
    }
    const cached = getUserCefrLevel(currentUserId || "");
    return cached || "B1";
  });

  const professionMatchesPersisted =
    Boolean(persistedRoleName) &&
    persistedRoleName?.toLowerCase() === effectiveRoleName.toLowerCase();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    const normActiveLevel = normalizeCefr(activeCefrLevel);
    const localForLevel = loadPersistedInterview(currentUserId, normActiveLevel);
    if (typeof localForLevel?.currentQuestionIndex === "number") {
      return localForLevel.currentQuestionIndex;
    }
    return persistedIndex;
  });

  const [askedQuestions, setAskedQuestions] = useState<string[]>(() => {
    const normActiveLevel = normalizeCefr(activeCefrLevel);
    const localForLevel = loadPersistedInterview(currentUserId, normActiveLevel);
    if (Array.isArray(localForLevel?.askedQuestions)) {
      return localForLevel.askedQuestions;
    }
    return persistedAskedQuestions || [];
  });

  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);

  // Session-level questions tailored to exact (effectiveRoleName, activeCefrLevel)
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestionItem[]>(() => {
    const normActiveLevel = normalizeCefr(activeCefrLevel);
    const localForLevel = loadPersistedInterview(currentUserId, normActiveLevel);
    if (localForLevel?.sessionQuestions && localForLevel.sessionQuestions.length > 0) {
      return localForLevel.sessionQuestions;
    }

    const hasLevelMismatch = (questions: InterviewQuestionItem[]) => {
      return questions.some((q) => q.targetLevel && normalizeCefr(q.targetLevel) !== normActiveLevel);
    };

    if (
      professionMatchesPersisted &&
      persistedQuestions &&
      persistedQuestions.length > 0 &&
      !hasLevelMismatch(persistedQuestions)
    ) {
      return persistedQuestions;
    }
    return [];
  });

  const onLevelOrRoleResetRef = useRef(onLevelOrRoleReset);
  useEffect(() => {
    onLevelOrRoleResetRef.current = onLevelOrRoleReset;
  }, [onLevelOrRoleReset]);

  const onLevelWillChangeRef = useRef(onLevelWillChange);
  useEffect(() => {
    onLevelWillChangeRef.current = onLevelWillChange;
  }, [onLevelWillChange]);

  const onAiInfrastructureErrorRef = useRef(onAiInfrastructureError);
  useEffect(() => {
    onAiInfrastructureErrorRef.current = onAiInfrastructureError;
  }, [onAiInfrastructureError]);

  const onQuestionsGeneratedRef = useRef(onQuestionsGenerated);
  useEffect(() => {
    onQuestionsGeneratedRef.current = onQuestionsGenerated;
  }, [onQuestionsGenerated]);

  const setActiveCefrLevel = useCallback(
    (level: string) => {
      const norm = normalizeCefrLevel(level);
      if (norm === activeCefrLevel) return;
      onLevelWillChangeRef.current?.();
      setActiveCefrLevelState(norm);
      if (currentUserId) {
        setUserCefrLevel(currentUserId, norm);
      }

      // Restore locally persisted questions for the new level immediately
      const localForLevel = loadPersistedInterview(currentUserId, norm);
      if (localForLevel?.sessionQuestions && localForLevel.sessionQuestions.length > 0) {
        setSessionQuestions(localForLevel.sessionQuestions);
        setCurrentQuestionIndex(localForLevel.currentQuestionIndex ?? 0);
        setAskedQuestions(localForLevel.askedQuestions ?? []);
      } else {
        setSessionQuestions([]);
        setCurrentQuestionIndex(0);
        setAskedQuestions([]);
      }

      onLevelOrRoleResetRef.current?.();
    },
    [activeCefrLevel, currentUserId],
  );

  const prevPropInitialLevelRef = useRef<string | undefined>(initialLevel);
  useEffect(() => {
    if (!isActive || !initialLevel) return;
    if (prevPropInitialLevelRef.current !== initialLevel) {
      prevPropInitialLevelRef.current = initialLevel;
      const norm = normalizeCefrLevel(initialLevel);
      if (norm !== activeCefrLevel) {
        setActiveCefrLevel(norm);
      }
    }
  }, [isActive, initialLevel, setActiveCefrLevel, activeCefrLevel]);

  useEffect(() => {
    const onLevelChanged = (e: Event) => {
      if (!isActive) return;
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const norm = normalizeCefrLevel(customEvent.detail);
        if (norm !== activeCefrLevel) {
          setActiveCefrLevel(norm);
        }
      }
    };
    window.addEventListener("celaest:level-changed", onLevelChanged);
    return () => window.removeEventListener("celaest:level-changed", onLevelChanged);
  }, [isActive, setActiveCefrLevel, activeCefrLevel]);

  const isGeneratingRef = useRef<boolean>(false);
  const isReplenishingRef = useRef<boolean>(false);

  // 1. Initial AI question generation when session pool is empty (waits for cloud DB hydration)
  useEffect(() => {
    if (!isActive) return;
    if (!hasHydrated) return;
    if (sessionQuestions.length > 0 || isGeneratingRef.current) return;

    isGeneratingRef.current = true;
    setIsGeneratingQuestions(true);

    const normLevel = normalizeCefr(activeCefrLevel);

    AiInterviewQuestionGenerator.generateSessionQuestions({
      profession: effectiveRoleName,
      cefrLevel: normLevel,
      count: 5,
      avoidQuestions: askedQuestions,
      forceFresh: true,
    })
      .then((freshQuestions) => {
        if (freshQuestions && freshQuestions.length > 0) {
          setSessionQuestions(freshQuestions);
          setCurrentQuestionIndex((prevIdx) => {
            if (prevIdx >= freshQuestions.length) {
              return 0;
            }
            return prevIdx;
          });
          onQuestionsGeneratedRef.current?.(freshQuestions, normLevel);
        }
      })
      .catch((err) => {
        logger.error("[useInterviewQuestionManager] Initial AI question generation error:", err);
        onAiInfrastructureErrorRef.current?.(err);
      })
      .finally(() => {
        isGeneratingRef.current = false;
        setIsGeneratingQuestions(false);
      });
  }, [isActive, hasHydrated, sessionQuestions.length, effectiveRoleName, activeCefrLevel, askedQuestions]);

  // 2. Event-driven round completion: append next round when invoked by user or on exhausted pool hydration
  const generateNextRound = useCallback(() => {
    if (isGeneratingRef.current || isReplenishingRef.current) return;
    isReplenishingRef.current = true;
    setIsGeneratingQuestions(true);
    const normLevel = normalizeCefr(activeCefrLevel);
    const allCurrentQuestionTexts = [
      ...askedQuestions,
      ...sessionQuestions.map((q) => q.question),
    ];

    AiInterviewQuestionGenerator.generateSessionQuestions({
      profession: effectiveRoleName,
      cefrLevel: normLevel,
      count: 5,
      avoidQuestions: allCurrentQuestionTexts,
      forceFresh: true,
    })
      .then((freshQuestions) => {
        if (freshQuestions && freshQuestions.length > 0) {
          setSessionQuestions((prev) => {
            const nextIdx = prev.length;
            const existingTexts = new Set(prev.map((p) => p.question.toLowerCase().trim()));
            const deduplicated = freshQuestions.filter(
              (f) => !existingTexts.has(f.question.toLowerCase().trim()),
            );
            const combined = deduplicated.length > 0 ? [...prev, ...deduplicated] : [...prev, ...freshQuestions];
            setCurrentQuestionIndex(nextIdx);
            onQuestionsGeneratedRef.current?.(combined, normLevel, nextIdx);
            return combined;
          });
        }
      })
      .catch((err) => {
        logger.warn("[useInterviewQuestionManager] Round completion generation error:", err);
        onAiInfrastructureErrorRef.current?.(err);
      })
      .finally(() => {
        isReplenishingRef.current = false;
        setIsGeneratingQuestions(false);
      });
  }, [activeCefrLevel, askedQuestions, effectiveRoleName, sessionQuestions]);

  // If hydrated state has an exhausted pool (e.g. user finished round in earlier session), fetch next round once
  const didReplenishExhaustedRef = useRef(false);
  useEffect(() => {
    if (!isActive || !hasHydrated || didReplenishExhaustedRef.current) return;
    if (sessionQuestions.length > 0 && currentQuestionIndex >= sessionQuestions.length) {
      didReplenishExhaustedRef.current = true;
      generateNextRound();
    }
  }, [isActive, hasHydrated, sessionQuestions.length, currentQuestionIndex, generateNextRound]);

  // Anti-loop question calculation: never mod (% length), never wrap back to question 1!
  const currentQuestion = useMemo<InterviewQuestionItem>(() => {
    if (sessionQuestions.length > 0 && currentQuestionIndex < sessionQuestions.length) {
      const q = sessionQuestions[currentQuestionIndex];
      return {
        ...q,
        id: currentQuestionIndex + 1,
        round: Math.floor(currentQuestionIndex / 5) + 1,
      };
    }

    // Dynamic loading placeholder while next AI batch arrives
    return {
      id: currentQuestionIndex + 1,
      question: isGeneratingQuestions
        ? "Generating your next personalized interview question..."
        : `Preparing your next speaking challenge for ${effectiveRoleName}...`,
      category: "WARMUP",
      starHint: "AI calibrating to your exact career and CEFR level...",
      expectedKeywords: [],
      round: Math.floor(currentQuestionIndex / 5) + 1,
      targetLevel: activeCefrLevel as CefrLevelCode,
    };
  }, [sessionQuestions, currentQuestionIndex, isGeneratingQuestions, effectiveRoleName, activeCefrLevel]);

  const currentQuestionRef = useRef<InterviewQuestionItem>(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const currentRound = Math.floor(currentQuestionIndex / 5) + 1;
  const questionInRound = (currentQuestionIndex % 5) + 1;
  const totalQuestionsInRound = 5;

  const markUserAdvanced = useCallback(() => {
    if (currentQuestion?.question && !currentQuestion.question.startsWith("Generating") && !currentQuestion.question.startsWith("Preparing")) {
      setAskedQuestions((prev) => {
        if (!prev.includes(currentQuestion.question)) {
          return [...prev, currentQuestion.question];
        }
        return prev;
      });
    }
  }, [currentQuestion]);

  const retryGeneration = useCallback(() => {
    isGeneratingRef.current = false;
    isReplenishingRef.current = false;
    setIsGeneratingQuestions(true);
    const normLevel = normalizeCefr(activeCefrLevel);
    AiInterviewQuestionGenerator.generateSessionQuestions({
      profession: effectiveRoleName,
      cefrLevel: normLevel,
      count: 5,
      avoidQuestions: askedQuestions,
      forceFresh: true,
    })
      .then((freshQuestions) => {
        if (freshQuestions && freshQuestions.length > 0) {
          setSessionQuestions((prev) => {
            if (prev.length === 0) return freshQuestions;
            const existingTexts = new Set(prev.map((p) => p.question.toLowerCase().trim()));
            const deduplicated = freshQuestions.filter(
              (f) => !existingTexts.has(f.question.toLowerCase().trim()),
            );
            const combined = deduplicated.length > 0 ? [...prev, ...deduplicated] : prev;
            onQuestionsGeneratedRef.current?.(combined, normLevel);
            return combined;
          });
          setCurrentQuestionIndex((prevIdx) => {
            if (sessionQuestions.length === 0 && prevIdx >= freshQuestions.length) {
              return 0;
            }
            return prevIdx;
          });
        }
      })
      .catch((err) => {
        onAiInfrastructureErrorRef.current?.(err);
      })
      .finally(() => {
        setIsGeneratingQuestions(false);
      });
  }, [activeCefrLevel, effectiveRoleName, askedQuestions, sessionQuestions.length]);

  return {
    effectiveRoleName,
    activeCefrLevel,
    setActiveCefrLevel,
    sessionQuestions,
    setSessionQuestions,
    askedQuestions,
    setAskedQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    currentQuestionRef,
    currentRound,
    questionInRound,
    totalQuestionsInRound,
    isGeneratingQuestions: isGeneratingQuestions || (!hasHydrated && sessionQuestions.length === 0),
    markUserAdvanced,
    retryGeneration,
    generateNextRound,
  };
}
