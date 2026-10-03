import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { InterviewQuestionItem } from "../services/interviewEngineService";
import { normalizeCefr, CefrLevelCode } from "../services/dynamicQuestionService";
import { AiInterviewQuestionGenerator } from "../services/aiInterviewQuestionGenerator";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { logger } from "../../../shared/utils/logger";

export interface UseInterviewQuestionManagerOptions {
  roleName?: string | undefined;
  initialLevel?: string | undefined;
  isActive: boolean;
  persistedQuestions?: InterviewQuestionItem[] | undefined;
  persistedRoleName?: string | undefined;
  persistedIndex?: number | undefined;
  persistedAskedQuestions?: string[] | undefined;
  onLevelOrRoleReset?: (() => void) | undefined;
  onAiInfrastructureError?: ((err: unknown) => void) | undefined;
}

export function useInterviewQuestionManager({
  roleName = "Professional",
  initialLevel,
  isActive,
  persistedQuestions,
  persistedRoleName,
  persistedIndex = 0,
  persistedAskedQuestions,
  onLevelOrRoleReset,
  onAiInfrastructureError,
}: UseInterviewQuestionManagerOptions) {
  const effectiveRoleName =
    roleName && roleName !== "Professional" ? roleName : "Professional";

  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;

  const [activeCefrLevel, setActiveCefrLevelState] = useState<string>(() => {
    if (initialLevel) return normalizeCefr(initialLevel);
    if (typeof window !== "undefined") {
      try {
        const userKey = currentUserId ? `celaest:user:${currentUserId}:cefrLevel` : null;
        const saved =
          (userKey ? localStorage.getItem(userKey) : null) ||
          localStorage.getItem("celaest:interview:cefrLevel") ||
          localStorage.getItem("celaest:cefrLevel");
        if (saved) return normalizeCefr(saved);
      } catch {
        // ignore
      }
    }
    return "B1";
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(persistedIndex);
  const [askedQuestions, setAskedQuestions] = useState<string[]>(() => persistedAskedQuestions || []);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);

  const professionMatchesPersisted =
    Boolean(persistedRoleName) &&
    persistedRoleName?.toLowerCase() === effectiveRoleName.toLowerCase();

  // Session-level questions tailored to exact (effectiveRoleName, activeCefrLevel)
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestionItem[]>(() => {
    const normActiveLevel = normalizeCefr(activeCefrLevel);
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

  const onAiInfrastructureErrorRef = useRef(onAiInfrastructureError);
  useEffect(() => {
    onAiInfrastructureErrorRef.current = onAiInfrastructureError;
  }, [onAiInfrastructureError]);

  const setActiveCefrLevel = useCallback(
    (level: string) => {
      const norm = normalizeCefr(level);
      if (norm === activeCefrLevel) return;
      setActiveCefrLevelState(norm);
      if (typeof window !== "undefined") {
        try {
          if (currentUserId) {
            localStorage.setItem(`celaest:user:${currentUserId}:cefrLevel`, norm);
          }
          localStorage.setItem("celaest:interview:cefrLevel", norm);
          localStorage.setItem("celaest:cefrLevel", norm);
        } catch {
          // ignore
        }
      }
      setSessionQuestions([]);
      setCurrentQuestionIndex(0);
      onLevelOrRoleResetRef.current?.();
    },
    [activeCefrLevel, currentUserId],
  );

  const prevPropInitialLevelRef = useRef<string | undefined>(initialLevel);
  useEffect(() => {
    if (!isActive || !initialLevel) return;
    if (prevPropInitialLevelRef.current !== initialLevel) {
      prevPropInitialLevelRef.current = initialLevel;
      const norm = normalizeCefr(initialLevel);
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
        const norm = normalizeCefr(customEvent.detail);
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

  // 1. Initial AI question generation when session pool is empty
  useEffect(() => {
    if (!isActive) return;
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
  }, [isActive, sessionQuestions.length, effectiveRoleName, activeCefrLevel, askedQuestions]);

  // 2. Background replenishment when approaching end of session pool
  useEffect(() => {
    if (!isActive) return;
    const remaining = sessionQuestions.length - currentQuestionIndex;

    if (
      sessionQuestions.length > 0 &&
      remaining <= 2 &&
      !isReplenishingRef.current &&
      !isGeneratingRef.current
    ) {
      isReplenishingRef.current = true;
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
              const existingTexts = new Set(prev.map((p) => p.question.toLowerCase().trim()));
              const deduplicated = freshQuestions.filter(
                (f) => !existingTexts.has(f.question.toLowerCase().trim()),
              );
              return deduplicated.length > 0 ? [...prev, ...deduplicated] : prev;
            });
          }
        })
        .catch((err) => {
          logger.warn("[useInterviewQuestionManager] Replenishment error:", err);
        })
        .finally(() => {
          isReplenishingRef.current = false;
        });
    }
  }, [isActive, sessionQuestions, currentQuestionIndex, effectiveRoleName, activeCefrLevel, askedQuestions]);

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
    isGeneratingQuestions,
    markUserAdvanced,
  };
}
