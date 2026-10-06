import React, { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { WritingTaskHeader } from "./WritingTaskHeader";
import { WritingEditor } from "./WritingEditor";
import { WritingSubmitBar } from "./WritingSubmitBar";
import { WritingAIMentorCard } from "./WritingAIMentorCard";
import { WritingProgressCard } from "./WritingProgressCard";
import { WritingFocusCard } from "./WritingFocusCard";
import { WritingToolsCard } from "./WritingToolsCard";
import { WritingAnalysisModal, WritingErrorItem, getWritingErrorId } from "./WritingAnalysisModal";
import { useWritingEvaluation } from "../hooks/useWritingEvaluation";
import { DynamicWritingTaskService, WritingTaskItem } from "../services/dynamicWritingTaskService";
import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { apiMemoryRepository } from "../../../infrastructure/repositories/ApiMemoryRepository";
import { apiWritingRepository } from "../../../infrastructure/repositories/ApiWritingRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { validateSpeechIntelligibility } from "../../conversation/services/speechIntelligibilityGuard";
import { appToast } from "../../../design-system/components/Toast";
import { logger } from "../../../shared/utils/logger";
import { AiInfrastructureRecoveryModal } from "../../lab/components/AiInfrastructureRecoveryModal";
import { ERROR_DATA, ErrorScenarioData } from "../../../shared/constants/errorScenarios";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { directClientAiService, extractFirstJsonObject } from "../../settings/services/directClientAiService";
import { AiWritingTaskGenerator } from "../services/aiWritingTaskGenerator";
import { normalizeCefr, CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import {
  getUserCefrLevel,
  setUserCefrLevel,
  normalizeCefrLevel,
} from "../../../shared/services/levelStore";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ENV } from "../../../shared/constants/env";

export interface WritingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
  roleName?: string;
  userLevel?: string;
  onSelectLevel?: (level: CefrLevelCode) => void;
  isActive?: boolean;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = React.memo(
  function WritingPracticeView({
    onNavigateToMemory,
    roleName = "Professional",
    userLevel,
    onSelectLevel,
    isActive = true,
  }) {
    const queryClient = useQueryClient();
    const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
    const { evaluateText, isEvaluating, submission: liveSubmission } = useWritingEvaluation();
    const initialStored = DynamicWritingTaskService.loadActiveSubmission(currentUserId);

    const [isLocalEvaluating, setIsLocalEvaluating] = useState<boolean>(false);
    const isEvaluatingActive = isEvaluating || isLocalEvaluating;

    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
    const [recoveryScenario, setRecoveryScenario] = useState<ErrorScenarioData>(
      ERROR_DATA["keys-exhausted-pool"] || Object.values(ERROR_DATA)[0],
    );
    const [recoveryCooldown, setRecoveryCooldown] = useState<number>(14);
    const [isGeneratingTask, setIsGeneratingTask] = useState<boolean>(false);
    const [areHintsRevealed, setAreHintsRevealed] = useState<boolean>(false);

    const [activeCefrLevel, setActiveCefrLevel] = useState<string>(() => {
      if (userLevel) return normalizeCefrLevel(userLevel);
      const cached = getUserCefrLevel(currentUserId || "");
      return cached || "B1";
    });
    const activeCefrLevelRef = useRef<string>(activeCefrLevel);
    useEffect(() => {
      activeCefrLevelRef.current = activeCefrLevel;
    }, [activeCefrLevel]);

    const roleNameRef = useRef(roleName);
    const isReplenishingRef = useRef<boolean>(false);
    const nextBatchCacheRef = useRef<WritingTaskItem[] | null>(null);
    const seenPromptsRef = useRef<string[]>([]);
    useEffect(() => {
      roleNameRef.current = roleName;
    }, [roleName]);

    // Load seen task prompts from session storage to prevent repetition across batches
    useEffect(() => {
      if (typeof window !== "undefined") {
        try {
          const raw = sessionStorage.getItem("celaest:writing:seenPrompts");
          if (raw) {
            seenPromptsRef.current = JSON.parse(raw);
          }
        } catch {
          // ignore
        }
      }
    }, []);

    const [taskBatch, setTaskBatch] = useState<WritingTaskItem[]>(() =>
      AiWritingTaskGenerator.getCachedOrSeedBatch(roleName, activeCefrLevel),
    );
    const [taskIndex, setTaskIndex] = useState<number>(() => {
      if (typeof window !== "undefined") {
        const userKey = currentUserId && currentUserId !== "anon"
          ? `celaest:user:${currentUserId}:writing:taskIndex`
          : null;
        const stored = (userKey && localStorage.getItem(userKey)) || sessionStorage.getItem("celaest:writing:taskIndex");
        if (stored !== null && stored !== undefined) return Number(stored) || 0;
      }
      return 0;
    });

    const [currentTask, setCurrentTask] = useState<WritingTaskItem>(() => {
      const active = DynamicWritingTaskService.getActiveTask(activeCefrLevel, roleName, currentUserId);
      const activeDraft = DynamicWritingTaskService.loadDraft(active.id, currentUserId);
      // If user was actively typing a draft on this task, preserve it!
      if (activeDraft && activeDraft.trim().length > 0) {
        return active;
      }
      // If user had no draft in progress, synchronize with the current rotated task in the batch
      if (taskBatch && taskBatch.length > 0) {
        const userKey = currentUserId && currentUserId !== "anon"
          ? `celaest:user:${currentUserId}:writing:taskIndex`
          : null;
        const stored = typeof window !== "undefined"
          ? (userKey && localStorage.getItem(userKey)) || sessionStorage.getItem("celaest:writing:taskIndex")
          : null;
        const storedIdx = Number(stored || 0);
        if (storedIdx >= 0 && storedIdx < taskBatch.length && taskBatch[storedIdx]) {
          return taskBatch[storedIdx];
        }
        return taskBatch[0];
      }
      return active;
    });

    // Restore the draft saved for the active task or submission content (survives page reloads)
    const [editorText, setEditorText] = useState<string>(() => {
      if (initialStored?.submission?.content) {
        return initialStored.submission.content;
      }
      return DynamicWritingTaskService.loadDraft(currentTask.id, currentUserId);
    });

    const saveCloudProgress = React.useCallback(
      (override?: {
        batch?: WritingTaskItem[];
        index?: number;
        task?: WritingTaskItem;
        draft?: string;
      }) => {
        if (!currentUserId || currentUserId === "anon") return;
        const b = override?.batch ?? taskBatch;
        const idx = override?.index ?? taskIndex;
        const t = override?.task ?? currentTask;
        const d = override?.draft ?? editorText;

        const avoid = Array.from(new Set([...seenPromptsRef.current, t?.description].filter(Boolean) as string[]));

        void apiWritingRepository.saveProgress({
          cefrLevel: activeCefrLevel,
          roleName: roleNameRef.current || "Professional",
          taskIndex: idx,
          taskBatch: b,
          activeTask: t,
          editorDraft: d,
          seenPrompts: avoid,
        });
      },
      [currentUserId, activeCefrLevel, taskBatch, taskIndex, currentTask, editorText],
    );

    // Hydrate writing progress & batch from cloud database (Cross-device PC <-> Mobile sync)
    useEffect(() => {
      if (!currentUserId || currentUserId === "anon") return;

      let isMounted = true;
      apiWritingRepository
        .getProgress(activeCefrLevel)
        .then((progress) => {
          if (!isMounted || !progress) return;

          // Restore seen prompts from server so anti-repetition is persistent across sessions and devices
          if (Array.isArray(progress.seenPrompts) && progress.seenPrompts.length > 0) {
            const merged = Array.from(new Set([...seenPromptsRef.current, ...progress.seenPrompts]));
            seenPromptsRef.current = merged;
            try {
              sessionStorage.setItem("celaest:writing:seenPrompts", JSON.stringify(merged.slice(-40)));
            } catch {
              // ignore
            }
          }

          // Restore task batch if valid
          const serverBatch = progress.taskBatch as WritingTaskItem[] | undefined;
          if (Array.isArray(serverBatch) && serverBatch.length > 0) {
            setTaskBatch(serverBatch);
            const sIdx =
              typeof progress.taskIndex === "number" &&
              progress.taskIndex >= 0 &&
              progress.taskIndex < serverBatch.length
                ? progress.taskIndex
                : 0;
            setTaskIndex(sIdx);
            const serverTask = (progress.activeTask as WritingTaskItem) || serverBatch[sIdx];
            if (serverTask && serverTask.title) {
              setCurrentTask(serverTask);
              DynamicWritingTaskService.persistActiveTask(serverTask, currentUserId);
            }
          }

          // Restore editor draft if user has not already typed something
          if (progress.editorDraft && typeof progress.editorDraft === "string" && progress.editorDraft.trim()) {
            setEditorText((prev) => {
              if (!prev || !prev.trim()) {
                return progress.editorDraft;
              }
              return prev;
            });
          }
        })
        .catch((err) => {
          logger.warn("[WritingPracticeView] Failed to hydrate writing progress from cloud:", err);
        });

      return () => {
        isMounted = false;
      };
    }, [currentUserId, activeCefrLevel]);

    // Cross-device sync when user returns to this tab
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible" && currentUserId && currentUserId !== "anon") {
          apiWritingRepository
            .getProgress(activeCefrLevel)
            .then((progress) => {
              if (!progress) return;
              if (Array.isArray(progress.seenPrompts) && progress.seenPrompts.length > 0) {
                seenPromptsRef.current = Array.from(new Set([...seenPromptsRef.current, ...progress.seenPrompts]));
              }
              const serverBatch = progress.taskBatch as WritingTaskItem[] | undefined;
              if (Array.isArray(serverBatch) && serverBatch.length > 0) {
                setTaskBatch(serverBatch);
                if (typeof progress.taskIndex === "number") {
                  setTaskIndex(progress.taskIndex);
                  const t = (progress.activeTask as WritingTaskItem) || serverBatch[progress.taskIndex];
                  if (t) setCurrentTask(t);
                }
              }
            })
            .catch(() => {});
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [currentUserId, activeCefrLevel]);

    // Track seen task descriptions so subsequent batches never repeat past questions
    useEffect(() => {
      if (currentTask?.description) {
        if (!seenPromptsRef.current.includes(currentTask.description)) {
          seenPromptsRef.current.push(currentTask.description);
          if (typeof window !== "undefined") {
            try {
              sessionStorage.setItem("celaest:writing:seenPrompts", JSON.stringify(seenPromptsRef.current.slice(-40)));
            } catch {
              // ignore
            }
          }
        }
      }
    }, [currentTask]);

    useEffect(() => {
      setAreHintsRevealed(false);
    }, [currentTask?.id]);

    const handleSelectLevel = React.useCallback(
      (newLevel: CefrLevelCode, source: "internal" | "external" = "internal") => {
        const norm = normalizeCefrLevel(newLevel);
        if (norm === activeCefrLevelRef.current) return;
        activeCefrLevelRef.current = norm;
        prevUserLevelPropRef.current = norm;
        setActiveCefrLevel(norm);
        if (typeof window !== "undefined") {
          localStorage.setItem("celaest:writing:cefrLevel", norm);
        }
        if (source === "internal") {
          setUserCefrLevel(currentUserId || "", norm);
        }
        const curRole = roleNameRef.current || "Professional";
        const newBatch = AiWritingTaskGenerator.getCachedOrSeedBatch(curRole, norm);
        setTaskBatch(newBatch);
        setTaskIndex(0);
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("celaest:writing:taskIndex");
        }
        const task = newBatch[0] || DynamicWritingTaskService.getActiveTask(norm, curRole, currentUserId);
        setCurrentTask(task);
        DynamicWritingTaskService.persistActiveTask(task, currentUserId);
        setEditorText(DynamicWritingTaskService.loadDraft(task.id, currentUserId));
        setPersistedSubmission(null);
        DynamicWritingTaskService.clearActiveSubmission(currentUserId);
        saveCloudProgress({ batch: newBatch, index: 0, task, draft: "" });
        if (source === "internal" && onSelectLevel) {
          onSelectLevel(norm as CefrLevelCode);
        }

        // Background AI replenishment for selected level so future tasks are dynamically tailored
        if (!isReplenishingRef.current) {
          isReplenishingRef.current = true;
          AiWritingTaskGenerator.generateBatchTasks({
            profession: curRole,
            cefrLevel: norm,
            forceFresh: false,
          })
            .then((freshBatch) => {
              if (freshBatch && freshBatch.length > 0) {
                setTaskBatch(freshBatch);
                saveCloudProgress({ batch: freshBatch });
              }
            })
            .catch((err) => {
              logger.warn("[WritingPracticeView] Batch replenishment error on level change:", err);
            })
            .finally(() => {
              isReplenishingRef.current = false;
            });
        }
      },
      [onSelectLevel, currentUserId, saveCloudProgress],
    );

    // Synchronize ONLY when userLevel prop genuinely changes externally from parent (e.g. Settings)
    const prevUserLevelPropRef = useRef<string | undefined>(userLevel ? normalizeCefr(userLevel) : undefined);
    useEffect(() => {
      if (userLevel) {
        const norm = normalizeCefr(userLevel);
        if (norm !== prevUserLevelPropRef.current && norm !== activeCefrLevelRef.current) {
          prevUserLevelPropRef.current = norm;
          handleSelectLevel(norm as CefrLevelCode, "external");
        }
      }
    }, [userLevel, handleSelectLevel]);

    useEffect(() => {
      const onLevelChanged = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          const norm = normalizeCefr(customEvent.detail) as CefrLevelCode;
          if (norm !== activeCefrLevelRef.current) {
            handleSelectLevel(norm, "external");
          }
        }
      };
      window.addEventListener("celaest:level-changed", onLevelChanged);
      return () => window.removeEventListener("celaest:level-changed", onLevelChanged);
    }, [handleSelectLevel]);

  const [persistedSubmission, setPersistedSubmission] = useState<WritingSubmission | null>(
    () => initialStored?.submission ?? null,
  );
  const [showResultModal, setShowResultModal] = useState<boolean>(
    () => initialStored?.modalOpen ?? false,
  );
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(
    () => new Set(initialStored?.savedErrorIds ?? []),
  );

  const activeSubmission = liveSubmission || persistedSubmission;

  // Debounced draft persistence: never writes on every keystroke, saves locally and syncs to cloud
  useEffect(() => {
    const timer = window.setTimeout(() => {
      DynamicWritingTaskService.saveDraft(currentTask.id, editorText, currentUserId);
      saveCloudProgress({ draft: editorText });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [editorText, currentTask.id, currentUserId, saveCloudProgress]);

  const wordCount = editorText.trim().split(/\s+/).filter(Boolean).length;
  const minWordsRequired = Math.min(8, currentTask.minWords || 8);

  const handleSubmit = async () => {
    if (isEvaluatingActive) return;
    if (wordCount < minWordsRequired) return;

    // Immediately dismiss mobile soft keyboard to prevent viewport distortion
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // 0-Token Linguistic & Gibberish Shield Guard
    const validation = validateSpeechIntelligibility(editorText, 0, undefined, {
      targetLevel: activeCefrLevel,
    });
    if (!validation.isValid) {
      if (validation.reason === "SPANISH_DETECTED") {
        appToast.spanishDetected(validation.message);
      } else if (validation.reason === "NONSENSE_OR_GIBBERISH") {
        appToast.gibberishDetected(validation.message);
      } else {
        appToast.warning("Revisión de texto", validation.message);
      }
      return;
    }

    // Idempotency guard: If the exact same text was already evaluated, reopen modal in 0ms without hitting network
    if (activeSubmission && activeSubmission.content.trim() === editorText.trim()) {
      setShowResultModal(true);
      return;
    }

    const isCore = await providerKeyVault.isCentralCoreEnabled();
    const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
    const hasKey = await providerKeyVault.hasKey(activeProvider);

    // If CELAEST-CORE is disabled and no private API key is configured, immediately trigger recovery modal
    if (!isCore && !hasKey) {
      setRecoveryScenario(ERROR_DATA["keys-exhausted-pool"]);
      setRecoveryCooldown(0);
      setIsRecoveryModalOpen(true);
      return;
    }

    setIsLocalEvaluating(true);
    try {
      let result: WritingSubmission;
      if (!isCore) {
        // BYOK direct execution using user's private key
        const systemPrompt =
          "You are an empathetic English writing mentor and executive coach. Always use direct 2nd person (tú) in Spanish. Respond ONLY with valid raw JSON.";
        const a1Guidance = activeCefrLevel.startsWith("A1")
          ? "CRITICAL PEDAGOGICAL MANDATE (CEFR A1 - Absolute Beginner): The candidate is writing 1 to 3 short elementary sentences (8-25 words) in Present Simple. Do NOT penalize brevity, elementary vocabulary, or lack of complex structures. Reward correct basic grammar (subject-verb agreement, to be) with 90-98%.\n"
          : "";
        const userPrompt = `${a1Guidance}Evaluate this ESL submission (${currentTask.category}) for a ${roleName}:
Title: ${currentTask.title}
Content: "${editorText}"
Target CEFR Level: ${activeCefrLevel}

Return raw JSON with exact keys:
"scoreClarity": integer (0 to 100),
"scoreGrammar": integer (0 to 100),
"evaluatedLevel": string ("A1", "A2", "B1", "B2", "C1"),
"summary": string (1 concise sentence in Spanish highlighting communicative strengths or diagnosing issues),
"improvements": array of 2 short bullet strings in Spanish,
"extractedErrors": array of MAXIMUM 5 most critical error objects with keys:
  "userSaid": string (short clause containing error),
  "errorWord": string (exact word or phrase with error),
  "correctWord": string (corrected word or phrase),
  "betterWay": string (natural native corrected sentence),
  "translationSpanish": string (direct Spanish translation of chunk only, 1-3 words),
  "grammarExplanation": string (1 concise sentence in Spanish explaining the rule, max 15 words),
  "cefrLevel": string ("A1", "A2", "B1", "B2", "C1")

Extract all real grammar errors. If there are no real grammar errors, "extractedErrors" MUST be an empty array []. Return ONLY raw valid JSON. CRITICAL: Output exactly ONE valid JSON object matching this schema. Do not output multiple JSON blocks, markdown backticks, or trailing commentary.`;

        const rawJson = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt,
          providerId: activeProvider,
          maxTokens: 4096,
        });

        const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
        let parsed: any;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          const salvaged = extractFirstJsonObject(cleaned);
          if (salvaged) {
            parsed = JSON.parse(salvaged);
          } else {
            throw new Error("El modelo devolvió un formato JSON no estructurado.");
          }
        }

        const rawErrors = Array.isArray(parsed.extractedErrors) ? parsed.extractedErrors : [];
        const formattedErrors: WritingErrorItem[] = rawErrors.map((e: any, idx: number) => ({
          id: `byok-err-${idx}-${Date.now()}`,
          userSaid: String(e.userSaid || ""),
          errorWord: String(e.errorWord || ""),
          correctWord: String(e.correctWord || ""),
          betterWay: String(e.betterWay || ""),
          translationSpanish: String(e.translationSpanish || ""),
          grammarExplanation: String(e.grammarExplanation || ""),
          cefrLevel: String(e.cefrLevel || activeCefrLevel),
        }));

        result = {
          id: `sub-byok-${Date.now()}`,
          taskCategory: currentTask.category,
          title: currentTask.title,
          content: editorText,
          wordCount,
          scoreClarity: parsed.scoreClarity || 88,
          scoreGrammar: parsed.scoreGrammar || 90,
          evaluatedLevel: parsed.evaluatedLevel || activeCefrLevel,
          extractedCardsCount: formattedErrors.length,
          feedback: {
            summary: parsed.summary || "Evaluación completada con tu clave privada.",
            improvements: parsed.improvements || [],
            extractedErrors: formattedErrors,
          },
          createdAt: new Date().toISOString(),
        };
      } else {
        result = await evaluateText({
          taskCategory: currentTask.category,
          title: currentTask.title,
          content: editorText,
          taskDescription: currentTask.description,
          roleName: roleName,
          targetLevel: activeCefrLevel,
        });
      }

      setPersistedSubmission(result);
      setShowResultModal(true);
      const initialSaved = new Set<string>();
      const feedbackCards = (result.feedback as any)?.createdCardIDs;
      if (Array.isArray(feedbackCards) && feedbackCards.length > 0) {
        const errs = result.feedback?.extractedErrors || [];
        errs.forEach((_, idx) => initialSaved.add(getWritingErrorId(result.id, idx)));
      }
      setSavedErrorIds(initialSaved);
      DynamicWritingTaskService.saveActiveSubmission(result, true, Array.from(initialSaved));
    } catch (err: any) {
      logger.warn("Writing evaluation failed", err);
      const { scenario, cooldownSeconds } = classifyAiError(err);
      setRecoveryScenario(scenario);
      setRecoveryCooldown(cooldownSeconds);
      setIsRecoveryModalOpen(true);
    } finally {
      setIsLocalEvaluating(false);
    }
  };

  const lastClosedModalTimeRef = useRef<number>(0);

  // When clicking the X button in the modal: Keep the text, keep the task, just hide modal and allow reopening
  const handleCloseModal = () => {
    lastClosedModalTimeRef.current = Date.now();
    setShowResultModal(false);
    if (activeSubmission) {
      DynamicWritingTaskService.saveActiveSubmission(
        activeSubmission,
        false,
        Array.from(savedErrorIds),
      );
    }
  };

  // Advance to next task in the batch; on the 6th question, generate the next batch, replace the old one, and reset to 1
  const advanceOrFetchNextBatch = async (toastTitle?: string) => {
    setShowResultModal(false);
    setPersistedSubmission(null);
    DynamicWritingTaskService.clearActiveSubmission(currentUserId);
    DynamicWritingTaskService.clearDraft(currentTask.id, currentUserId);
    setSavedErrorIds(new Set());

    if (!taskBatch || taskBatch.length === 0) {
      setEditorText("");
      return;
    }

    // 1. Advance within current batch (tasks 1 to 5 of 6) with 0ms latency and 0 tokens
    if (taskIndex < taskBatch.length - 1) {
      const nextIndex = taskIndex + 1;
      setTaskIndex(nextIndex);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("celaest:writing:taskIndex", String(nextIndex));
        if (currentUserId && currentUserId !== "anon") {
          localStorage.setItem(`celaest:user:${currentUserId}:writing:taskIndex`, String(nextIndex));
        }
      }
      const nextTask = taskBatch[nextIndex];
      if (nextTask) {
        setCurrentTask(nextTask);
        DynamicWritingTaskService.persistActiveTask(nextTask, currentUserId);
        const nextDraft = DynamicWritingTaskService.loadDraft(nextTask.id, currentUserId);
        setEditorText(nextDraft);
        saveCloudProgress({ index: nextIndex, task: nextTask, draft: nextDraft });
        if (toastTitle) {
          appToast.success(toastTitle, nextTask.title);
        }
      } else {
        setEditorText("");
      }

      // Silent background prefetch of next batch when reaching task 5 of 6 (index 4)
      if (nextIndex >= taskBatch.length - 2 && !nextBatchCacheRef.current && !isReplenishingRef.current) {
        isReplenishingRef.current = true;
        const avoid = Array.from(new Set([...seenPromptsRef.current, ...taskBatch.map((t) => t.description)]));
        AiWritingTaskGenerator.generateBatchTasks({
          profession: roleName,
          cefrLevel: activeCefrLevel,
          count: 6,
          forceFresh: true,
          avoidTasks: avoid,
        })
          .then((fresh) => {
            if (fresh && fresh.length > 0) {
              nextBatchCacheRef.current = fresh;
            }
          })
          .catch((err) => {
            logger.warn("[WritingPracticeView] Next batch prefetch failed:", err);
          })
          .finally(() => {
            isReplenishingRef.current = false;
          });
      }
      return;
    }

    // 2. We reached the end of the batch (task 6)!
    // If the next batch was already prefetched, swap it in immediately (deleting old batch and storing new)
    if (nextBatchCacheRef.current && nextBatchCacheRef.current.length > 0) {
      const freshBatch = nextBatchCacheRef.current;
      nextBatchCacheRef.current = null;
      setTaskBatch(freshBatch);
      setTaskIndex(0);
      setCurrentTask(freshBatch[0]);
      DynamicWritingTaskService.persistActiveTask(freshBatch[0], currentUserId);
      const firstDraft = DynamicWritingTaskService.loadDraft(freshBatch[0].id, currentUserId);
      setEditorText(firstDraft);
      saveCloudProgress({ batch: freshBatch, index: 0, task: freshBatch[0], draft: firstDraft });
      if (typeof window !== "undefined") {
        sessionStorage.setItem("celaest:writing:taskIndex", "0");
        if (currentUserId && currentUserId !== "anon") {
          localStorage.setItem(`celaest:user:${currentUserId}:writing:taskIndex`, "0");
        }
      }
      appToast.success("Nuevo lote de tareas listo", freshBatch[0].title);
      return;
    }

    // 3. Otherwise, fetch the next fresh batch now
    try {
      const isCore = await providerKeyVault.isCentralCoreEnabled();
      const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
      const hasKey = await providerKeyVault.hasKey(activeProvider);

      if (!isCore && !hasKey) {
        setRecoveryScenario(ERROR_DATA["keys-exhausted-pool"]);
        setRecoveryCooldown(0);
        setIsRecoveryModalOpen(true);
        return;
      }

      setIsGeneratingTask(true);
      const avoid = Array.from(new Set([...seenPromptsRef.current, ...taskBatch.map((t) => t.description)]));
      const freshBatch = await AiWritingTaskGenerator.generateBatchTasks({
        profession: roleName,
        cefrLevel: activeCefrLevel,
        count: 6,
        forceFresh: true,
        avoidTasks: avoid,
        throwOnAuthError: true,
      });

      if (freshBatch && freshBatch.length > 0) {
        setTaskBatch(freshBatch);
        setTaskIndex(0);
        setCurrentTask(freshBatch[0]);
        DynamicWritingTaskService.persistActiveTask(freshBatch[0], currentUserId);
        const firstDraft = DynamicWritingTaskService.loadDraft(freshBatch[0].id, currentUserId);
        setEditorText(firstDraft);
        saveCloudProgress({ batch: freshBatch, index: 0, task: freshBatch[0], draft: firstDraft });
        if (typeof window !== "undefined") {
          sessionStorage.setItem("celaest:writing:taskIndex", "0");
          if (currentUserId && currentUserId !== "anon") {
            localStorage.setItem(`celaest:user:${currentUserId}:writing:taskIndex`, "0");
          }
        }
        appToast.success("Nuevo lote de tareas listo", freshBatch[0].title);
      }
    } catch (err: any) {
      const { scenario, cooldownSeconds } = classifyAiError(err);
      setRecoveryScenario(scenario);
      setRecoveryCooldown(cooldownSeconds);
      setIsRecoveryModalOpen(true);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  // When clicking "Continue Practicing": Advance to next task (or next batch if on the 6th)
  const handleContinuePracticing = async () => {
    await advanceOrFetchNextBatch();
  };

  const handleNewTask = async () => {
    if (isEvaluatingActive || isGeneratingTask) return;
    await advanceOrFetchNextBatch("Nueva tarea lista");
  };

  const handleOpenModal = () => {
    if (Date.now() - lastClosedModalTimeRef.current < 400) {
      return;
    }
    if (activeSubmission) {
      setShowResultModal(true);
      DynamicWritingTaskService.saveActiveSubmission(
        activeSubmission,
        true,
        Array.from(savedErrorIds),
        currentUserId,
      );
    }
  };

  const saveSpecificErrorToMemory = async (
    errorItem: WritingErrorItem,
    skipInvalidate = false,
  ): Promise<boolean> => {
    try {
      await apiMemoryRepository.createCard({
        category: "WRITING",
        userSaid: errorItem.userSaid,
        betterWay: errorItem.betterWay,
        translationSpanish: errorItem.translationSpanish,
        errorWord: errorItem.errorWord,
        correctWord: errorItem.correctWord,
        grammarExplanation: errorItem.grammarExplanation,
        cefrLevel: errorItem.cefrLevel || "B2",
      });

      if (!skipInvalidate) {
        // Zero-Reload Reactivity: Invalidate Memory Vault cache across all categories
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memory.all });
      }

      setSavedErrorIds((prev) => {
        const next = new Set([...prev, errorItem.id]);
        if (activeSubmission) {
          DynamicWritingTaskService.saveActiveSubmission(
            activeSubmission,
            showResultModal,
            Array.from(next),
            currentUserId,
          );
        }
        return next;
      });
      return true;
    } catch (err) {
      logger.warn("Failed to add writing correction to Memory Bank", err);
      return false;
    }
  };

  const saveAllErrorsToMemory = async (): Promise<number> => {
    if (!activeSubmission) return 0;
    const errors = activeSubmission.feedback?.extractedErrors || [];
    if (errors.length === 0) return 0;

    const candidates = errors
      .map((err, i) => ({ ...err, id: getWritingErrorId(activeSubmission.id, i) }))
      .filter((err) => !savedErrorIds.has(err.id));

    if (candidates.length === 0) return 0;

    const results = await Promise.allSettled(
      candidates.map((item) => saveSpecificErrorToMemory(item, true)),
    );

    const savedCount = results.filter(
      (res) => res.status === "fulfilled" && res.value === true,
    ).length;

    if (savedCount > 0) {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.memory.all });
    }

    return savedCount;
  };

  const handleInsertPhrase = (phrase: string) => {
    setEditorText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return phrase;
      return `${trimmed} ${phrase}`;
    });
    appToast.info("Asistente de escritura", `Frase insertada: "${phrase.trim()}"`);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] bg-[#000001] text-white flex flex-col justify-between select-none z-10 overflow-hidden animate-[fadeIn_0.5s_ease-out_both]">
      {/* Main Workspace Content Canvas */}
      <div className="flex-1 w-full max-w-[1550px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3 gap-2 sm:gap-5 lg:gap-6 z-10 overflow-y-auto lg:overflow-hidden no-scrollbar">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-start min-h-0 h-full overflow-y-auto lg:overflow-hidden no-scrollbar pb-3 lg:pb-0">
          <div className="flex flex-col flex-1 min-h-0 overflow-visible lg:overflow-hidden">
            <React.Fragment key={currentTask.id}>
              <WritingTaskHeader
                category={`WRITING TASK · ${currentTask.category}`}
                title={currentTask.title}
                description={currentTask.description}
                spanishDescription={currentTask.spanishDescription}
                currentLevel={activeCefrLevel}
                isActive={isActive}
              />
              <WritingEditor
                key={currentTask.id}
                initialContent={editorText}
                onChangeContent={setEditorText}
                minWords={currentTask.minWords}
                maxWords={currentTask.maxWords}
                onNewTask={handleNewTask}
                isGeneratingTask={isGeneratingTask}
              />
            </React.Fragment>
          </div>

          {/* Sticky footer: pills + submit, no choque */}
          <div className="sticky bottom-0 z-20 shrink-0 bg-[#04040A]/90 backdrop-blur-md pt-1 pb-0 mt-3 -mx-1 px-1">
              {/* Level-based Scaffolding & Starter Recommendations (Ergonomic Touch Chips) */}
              <div className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-0.5 sm:px-1 text-xs shrink-0 w-full min-w-0 max-w-full">
                {/* Modern Borderless Glassmorphic Pistas Badge with Integrated Level Selector */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.06] transition-colors shrink-0 select-none">
                  {/* Interactive Clue Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setAreHintsRevealed((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 cursor-pointer text-white/95 hover:text-white transition-all active:scale-95 group/clue"
                    title={areHintsRevealed ? "Ocultar pistas" : "Haz clic para ver las pistas"}
                  >
                    {areHintsRevealed ? (
                      <svg className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-[#A78BFA]/80 group-hover/clue:text-[#A78BFA] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                    <span className="text-[11px] sm:text-xs font-sans font-semibold tracking-wide text-white/95">
                      Pistas
                    </span>
                  </button>
                  <span className="h-3 w-px bg-white/20 mx-0.5 shrink-0" />
                  <LevelSelectorPill
                    currentLevel={activeCefrLevel}
                    onSelectLevel={handleSelectLevel}
                    direction="up"
                    align="left"
                    className="shrink-0"
                  />
                </div>

                {/* Starter Phrases Chips with Clean Defocused Text (Zero Layout Shift) */}
                {currentTask.starterPhrases && currentTask.starterPhrases.length > 0 && (
                  <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar min-w-0 flex-1 py-0.5">
                    {currentTask.starterPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!areHintsRevealed) {
                            setAreHintsRevealed(true);
                          } else {
                            handleInsertPhrase(phrase);
                          }
                        }}
                        className="group inline-flex items-center gap-1 text-xs text-white/75 hover:text-white transition-all whitespace-nowrap cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] shrink-0 active:scale-95"
                        title={!areHintsRevealed ? "Toca para revelar pistas" : "Haz clic para insertar esta frase"}
                      >
                        <span
                          className={`font-sans font-medium text-white/85 group-hover:text-white transition-all duration-300 ${
                            !areHintsRevealed
                              ? "filter blur-[7px] select-none opacity-40 pointer-events-none"
                              : "filter-none opacity-100"
                          }`}
                        >
                          "{phrase}"
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

          <WritingSubmitBar
            hasContent={wordCount >= minWordsRequired}
            wordCount={wordCount}
            minWords={minWordsRequired}
            isEvaluating={isEvaluatingActive}
            hasAnalysis={Boolean(activeSubmission)}
            onSubmit={handleSubmit}
            onViewAnalysis={handleOpenModal}
          />
          </div>
        </div>

        {/* Right Column: 4 Cards Stack (Balanced & strictly clamped so it's 100% visible inside viewport) */}
        <div className="hidden xl:flex w-[290px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3.5 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1">
          <WritingAIMentorCard
            userLevel={activeCefrLevel}
            statusText={
              isEvaluatingActive
                ? "Analyzing your grammar, vocabulary, and register with AI..."
                : activeSubmission
                  ? `Evaluation complete! Analyzed ${activeSubmission.wordCount} words and saved ${activeSubmission.extractedCardsCount || 0} cards to Memory Bank.`
                  : activeCefrLevel.includes("A1") || activeCefrLevel.includes("A2")
                    ? `Nivel ${activeCefrLevel}: Mantén oraciones claras y directas. Usa las pistas recomendadas para empezar tu redacción con seguridad.`
                    : `Current task: ${currentTask.title.toLowerCase()}. ${currentTask.toneHint} tone. I'll review your writing when you submit.`
            }
            animated={isEvaluatingActive}
          />
          <WritingProgressCard
            progressPercentage={Math.min(100, Math.round((wordCount / currentTask.maxWords) * 100))}
            wordCount={wordCount}
            maxWords={currentTask.maxWords}
          />
          <WritingFocusCard focusTarget={currentTask.toneHint} />
          <WritingToolsCard
            onInsertPhrase={handleInsertPhrase}
            userLevel={activeCefrLevel}
            starterPhrases={currentTask.starterPhrases}
          />
        </div>
      </div>

      {/* AI Writing Analysis Modal (Interview design language) */}
      {showResultModal && activeSubmission && (
        <WritingAnalysisModal
          submission={activeSubmission}
          savedErrorIds={savedErrorIds}
          onClose={handleCloseModal}
          onContinuePracticing={handleContinuePracticing}
          onSaveSpecificError={saveSpecificErrorToMemory}
          onSaveAllErrors={saveAllErrorsToMemory}
          onNavigateToMemory={() => {
            handleCloseModal();
            if (onNavigateToMemory) onNavigateToMemory();
          }}
        />
      )}

      {/* Luxury AI Infrastructure Recovery Modal */}
      <AiInfrastructureRecoveryModal
        isOpen={isRecoveryModalOpen}
        scenario={recoveryScenario}
        cooldown={recoveryCooldown}
        contextType="writing"
        bufferDetail={{ wordCount }}
        onClose={() => setIsRecoveryModalOpen(false)}
        onImmediateResume={() => {
          setIsRecoveryModalOpen(false);
          try {
            void fetch(`${ENV.coreAiUrl}/ai/keys/reset`, { method: "POST" }).catch(() => {});
          } catch {
            // ignore
          }
          setTimeout(() => {
            void handleSubmit();
          }, 350);
        }}
      />
    </div>
  );
});
