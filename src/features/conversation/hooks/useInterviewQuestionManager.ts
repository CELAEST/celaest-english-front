import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { InterviewQuestionItem } from "../services/interviewEngineService";
import { DynamicQuestionService, normalizeCefr } from "../services/dynamicQuestionService";
import { AiInterviewQuestionGenerator } from "../services/aiInterviewQuestionGenerator";
import { logger } from "../../../shared/utils/logger";

export interface UseInterviewQuestionManagerOptions {
  roleName?: string | undefined;
  initialLevel?: string | undefined;
  isActive: boolean;
  persistedQuestions?: InterviewQuestionItem[] | undefined;
  persistedRoleName?: string | undefined;
  persistedIndex?: number | undefined;
  onLevelOrRoleReset?: (() => void) | undefined;
}

export function useInterviewQuestionManager({
  roleName = "Professional",
  initialLevel,
  isActive,
  persistedQuestions,
  persistedRoleName,
  persistedIndex = 0,
  onLevelOrRoleReset,
}: UseInterviewQuestionManagerOptions) {
  const effectiveRoleName =
    roleName && roleName !== "Professional" ? roleName : "Professional";

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(persistedIndex);

  const professionMatchesPersisted =
    Boolean(persistedRoleName) &&
    persistedRoleName?.toLowerCase() === effectiveRoleName.toLowerCase();

  // Auto-invalidate stale AI question caches from localStorage when profession changes
  useEffect(() => {
    if (effectiveRoleName === "Professional" || professionMatchesPersisted) return;
    if (typeof window === "undefined") return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          key.startsWith("celaest:interview:ai_questions:v2:") &&
          !key.includes(effectiveRoleName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_"))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      if (keysToRemove.length > 0) {
        logger.info(
          `[useInterviewQuestionManager] Invalidated ${keysToRemove.length} stale AI question cache(s) for ${effectiveRoleName}`,
        );
      }
    } catch {
      // ignore storage errors
    }
  }, [effectiveRoleName, professionMatchesPersisted]);

  // Session-level pre-generated questions tailored to exact (effectiveRoleName, activeCefrLevel)
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
    return AiInterviewQuestionGenerator.getCachedOrSeedQuestions(effectiveRoleName, activeCefrLevel, 12);
  });

  const lastAppliedInitialLevelRef = useRef<string | undefined>(
    initialLevel ? normalizeCefr(initialLevel) : undefined,
  );

  const onLevelOrRoleResetRef = useRef(onLevelOrRoleReset);
  useEffect(() => {
    onLevelOrRoleResetRef.current = onLevelOrRoleReset;
  }, [onLevelOrRoleReset]);

  const setActiveCefrLevel = useCallback(
    (level: string) => {
      const norm = normalizeCefr(level);
      lastAppliedInitialLevelRef.current = norm;
      setActiveCefrLevelState(norm);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:interview:cefrLevel", norm);
          localStorage.setItem("celaest:cefrLevel", norm);
        } catch {
          // ignore
        }
      }
      const newQuestions = AiInterviewQuestionGenerator.getCachedOrSeedQuestions(
        effectiveRoleName,
        norm,
        12,
      );
      setSessionQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      onLevelOrRoleResetRef.current?.();
    },
    [effectiveRoleName],
  );

  useEffect(() => {
    if (!isActive || !initialLevel) return;
    const norm = normalizeCefr(initialLevel);
    if (lastAppliedInitialLevelRef.current !== norm) {
      lastAppliedInitialLevelRef.current = norm;
      setActiveCefrLevel(norm);
    }
  }, [isActive, initialLevel, setActiveCefrLevel]);

  useEffect(() => {
    const onLevelChanged = (e: Event) => {
      if (!isActive) return;
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setActiveCefrLevel(customEvent.detail);
      }
    };
    window.addEventListener("celaest:level-changed", onLevelChanged);
    return () => window.removeEventListener("celaest:level-changed", onLevelChanged);
  }, [isActive, setActiveCefrLevel]);

  const prevEffectiveRoleRef = useRef<string>(effectiveRoleName);
  useEffect(() => {
    if (!isActive) return;
    if (effectiveRoleName && effectiveRoleName !== prevEffectiveRoleRef.current) {
      prevEffectiveRoleRef.current = effectiveRoleName;
      if (currentQuestionIndex === 0) {
        const newQuestions = AiInterviewQuestionGenerator.getCachedOrSeedQuestions(
          effectiveRoleName,
          normalizeCefr(activeCefrLevel),
          12,
        );
        queueMicrotask(() => {
          setSessionQuestions(newQuestions);
        });
      }
    }
  }, [isActive, effectiveRoleName, activeCefrLevel, currentQuestionIndex]);

  const hasUserAdvancedInSessionRef = useRef<boolean>(false);
  const isReplenishingRef = useRef<boolean>(false);
  const lastReplenishedIndexRef = useRef<number>(persistedIndex);

  // Background question replenishment when approaching end of session pool
  useEffect(() => {
    if (!isActive || !hasUserAdvancedInSessionRef.current) return;
    const normLevel = normalizeCefr(activeCefrLevel);
    const remaining = sessionQuestions.length - currentQuestionIndex;

    if (
      sessionQuestions.length > 0 &&
      currentQuestionIndex > 0 &&
      remaining <= 3 &&
      lastReplenishedIndexRef.current !== currentQuestionIndex &&
      !isReplenishingRef.current
    ) {
      isReplenishingRef.current = true;
      lastReplenishedIndexRef.current = currentQuestionIndex;
      AiInterviewQuestionGenerator.generateSessionQuestions({
        profession: effectiveRoleName,
        cefrLevel: normLevel,
        count: 5,
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
  }, [isActive, sessionQuestions, currentQuestionIndex, effectiveRoleName, activeCefrLevel]);

  const currentQuestion = useMemo<InterviewQuestionItem>(() => {
    if (sessionQuestions.length > 0) {
      const q =
        currentQuestionIndex < sessionQuestions.length
          ? sessionQuestions[currentQuestionIndex]
          : sessionQuestions[currentQuestionIndex % sessionQuestions.length];
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

  const currentQuestionRef = useRef<InterviewQuestionItem>(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const currentRound = Math.floor(currentQuestionIndex / 5) + 1;
  const questionInRound = (currentQuestionIndex % 5) + 1;
  const totalQuestionsInRound = 5;

  const markUserAdvanced = useCallback(() => {
    hasUserAdvancedInSessionRef.current = true;
  }, []);

  return {
    effectiveRoleName,
    activeCefrLevel,
    setActiveCefrLevel,
    sessionQuestions,
    setSessionQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    currentQuestionRef,
    currentRound,
    questionInRound,
    totalQuestionsInRound,
    hasUserAdvancedInSessionRef,
    lastReplenishedIndexRef,
    markUserAdvanced,
  };
}
