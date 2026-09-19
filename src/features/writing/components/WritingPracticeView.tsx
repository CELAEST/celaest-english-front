import React, { useEffect, useState, useRef } from "react";
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
import { ENV } from "../../../shared/constants/env";

export interface WritingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
  roleName?: string;
  userLevel?: string;
  onSelectLevel?: (level: CefrLevelCode) => void;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = React.memo(
  function WritingPracticeView({
    onNavigateToMemory,
    roleName = "Professional",
    userLevel,
    onSelectLevel,
  }) {
    const { evaluateText, isEvaluating, submission: liveSubmission } = useWritingEvaluation();
    const initialStored = DynamicWritingTaskService.loadActiveSubmission();

    const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
    const [recoveryScenario, setRecoveryScenario] = useState<ErrorScenarioData>(
      ERROR_DATA["keys-exhausted-pool"] || Object.values(ERROR_DATA)[0],
    );
    const [recoveryCooldown, setRecoveryCooldown] = useState<number>(14);
    const [isGeneratingTask, setIsGeneratingTask] = useState<boolean>(false);

    const [activeCefrLevel, setActiveCefrLevel] = useState<string>(() => {
      if (userLevel) return normalizeCefr(userLevel);
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("celaest:writing:cefrLevel");
          if (saved) return normalizeCefr(saved);
        } catch {
          // ignore
        }
      }
      return "B1";
    });

    const roleNameRef = useRef(roleName);
    const isReplenishingRef = useRef<boolean>(false);
    useEffect(() => {
      roleNameRef.current = roleName;
    }, [roleName]);

    const [taskBatch, setTaskBatch] = useState<WritingTaskItem[]>(() =>
      AiWritingTaskGenerator.getCachedOrSeedBatch(roleName, activeCefrLevel),
    );
    const [taskIndex, setTaskIndex] = useState<number>(0);

    const [currentTask, setCurrentTask] = useState<WritingTaskItem>(() => {
      const active = DynamicWritingTaskService.getActiveTask(activeCefrLevel, roleName);
      return active || taskBatch[0];
    });

    const handleSelectLevel = React.useCallback(
      (newLevel: CefrLevelCode) => {
        const norm = normalizeCefr(newLevel);
        setActiveCefrLevel(norm);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("celaest:writing:cefrLevel", norm);
            localStorage.setItem("celaest:cefrLevel", norm);
          } catch {
            // ignore
          }
        }
        const curRole = roleNameRef.current || "Professional";
        const newBatch = AiWritingTaskGenerator.getCachedOrSeedBatch(curRole, norm);
        setTaskBatch(newBatch);
        setTaskIndex(0);
        const task = newBatch[0] || DynamicWritingTaskService.getActiveTask(norm, curRole);
        setCurrentTask(task);
        DynamicWritingTaskService.persistActiveTask(task);
        setEditorText(DynamicWritingTaskService.loadDraft(task.id));
        setPersistedSubmission(null);
        DynamicWritingTaskService.clearActiveSubmission();
        if (onSelectLevel) {
          onSelectLevel(norm as CefrLevelCode);
        }
      },
      [onSelectLevel],
    );

    // Synchronize ONLY when userLevel prop genuinely changes externally from parent (e.g. Settings)
    const prevUserLevelPropRef = useRef<string | undefined>(userLevel);
    useEffect(() => {
      if (userLevel && userLevel !== prevUserLevelPropRef.current) {
        prevUserLevelPropRef.current = userLevel;
        const norm = normalizeCefr(userLevel);
        handleSelectLevel(norm as CefrLevelCode);
      }
    }, [userLevel, handleSelectLevel]);

    useEffect(() => {
      const onLevelChanged = (e: Event) => {
        const customEvent = e as CustomEvent<string>;
        if (customEvent.detail) {
          handleSelectLevel(normalizeCefr(customEvent.detail) as CefrLevelCode);
        }
      };
      window.addEventListener("celaest:level-changed", onLevelChanged);
      return () => window.removeEventListener("celaest:level-changed", onLevelChanged);
    }, [handleSelectLevel]);

    // Restore the draft saved for the active task or submission content (survives page reloads)
    const [editorText, setEditorText] = useState<string>(() => {
      if (initialStored?.submission?.content) {
        return initialStored.submission.content;
      }
      return DynamicWritingTaskService.loadDraft(currentTask.id);
    });
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

  // Debounced draft persistence: never writes on every keystroke
  useEffect(() => {
    const timer = window.setTimeout(() => {
      DynamicWritingTaskService.saveDraft(currentTask.id, editorText);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [editorText, currentTask.id]);

  const wordCount = editorText.trim().split(/\s+/).filter(Boolean).length;
  const minWordsRequired = Math.min(8, currentTask.minWords || 8);

  const handleSubmit = async () => {
    if (isEvaluating) return;
    if (wordCount < minWordsRequired) return;

    // 0-Token Linguistic & Gibberish Shield Guard
    const validation = validateSpeechIntelligibility(editorText);
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

    try {
      let result: WritingSubmission;
      if (!isCore) {
        // BYOK direct execution using user's private key
        const systemPrompt =
          "You are an empathetic English writing mentor and executive coach. Always use direct 2nd person (tú) in Spanish. Respond ONLY with valid raw JSON.";
        const userPrompt = `Evaluate this ESL submission (${currentTask.category}) for a ${roleName}:
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
      setSavedErrorIds(new Set());
      DynamicWritingTaskService.saveActiveSubmission(result, true, []);
    } catch (err: any) {
      logger.warn("Writing evaluation failed", err);
      const { scenario, cooldownSeconds } = classifyAiError(err);
      setRecoveryScenario(scenario);
      setRecoveryCooldown(cooldownSeconds);
      setIsRecoveryModalOpen(true);
    }
  };

  // When clicking the X button in the modal: Keep the text, keep the task, just hide modal and allow reopening
  const handleCloseModal = () => {
    setShowResultModal(false);
    if (activeSubmission) {
      DynamicWritingTaskService.saveActiveSubmission(
        activeSubmission,
        false,
        Array.from(savedErrorIds),
      );
    }
  };

  // Advance to the next task in the pre-generated batch (0ms latency, zero token burn on click)
  const advanceToNextBatchTask = (toastTitle?: string) => {
    setShowResultModal(false);
    setPersistedSubmission(null);
    DynamicWritingTaskService.clearActiveSubmission();
    DynamicWritingTaskService.clearDraft(currentTask.id);
    setSavedErrorIds(new Set());

    if (!taskBatch || taskBatch.length === 0) {
      setEditorText("");
      return;
    }

    const nextIndex = (taskIndex + 1) % taskBatch.length;
    setTaskIndex(nextIndex);
    const nextTask = taskBatch[nextIndex];

    if (nextTask) {
      setCurrentTask(nextTask);
      DynamicWritingTaskService.persistActiveTask(nextTask);
      setEditorText(DynamicWritingTaskService.loadDraft(nextTask.id));
      if (toastTitle) {
        appToast.success(toastTitle, nextTask.title);
      }
    } else {
      setEditorText("");
    }

    // Trigger silent background replenishment ONLY after cycling through the entire batch (at the last task)
    const isAiBatch = taskBatch.some((t) => t.id.startsWith("ai-"));
    if (isAiBatch && nextIndex >= taskBatch.length - 1 && !isReplenishingRef.current) {
      isReplenishingRef.current = true;
      AiWritingTaskGenerator.generateBatchTasks({
        profession: roleName,
        cefrLevel: activeCefrLevel,
        forceFresh: true,
      })
        .then((freshBatch) => {
          if (freshBatch && freshBatch.length > 0) {
            setTaskBatch(freshBatch);
          }
        })
        .catch((err) => {
          logger.warn("[WritingPracticeView] Batch replenishment error:", err);
        })
        .finally(() => {
          isReplenishingRef.current = false;
        });
    }
  };

  // When clicking "Continue Practicing": Advance to the next task and clear the editor
  const handleContinuePracticing = () => {
    advanceToNextBatchTask();
  };

  const handleNewTask = async () => {
    if (isEvaluating || isGeneratingTask) return;

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
      const freshBatch = await AiWritingTaskGenerator.generateBatchTasks({
        profession: roleName,
        cefrLevel: activeCefrLevel,
        forceFresh: true,
        throwOnAuthError: true,
      });

      if (freshBatch && freshBatch.length > 0) {
        setTaskBatch(freshBatch);
        setTaskIndex(0);
        setCurrentTask(freshBatch[0]);
        DynamicWritingTaskService.persistActiveTask(freshBatch[0]);
        DynamicWritingTaskService.clearActiveSubmission();
        DynamicWritingTaskService.clearDraft(currentTask.id);
        setEditorText(DynamicWritingTaskService.loadDraft(freshBatch[0].id));
        setPersistedSubmission(null);
        setSavedErrorIds(new Set());
        appToast.success("Nueva tarea lista", freshBatch[0].title);
      } else {
        advanceToNextBatchTask("Nueva tarea lista");
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

  const handleOpenModal = () => {
    if (activeSubmission) {
      setShowResultModal(true);
      DynamicWritingTaskService.saveActiveSubmission(
        activeSubmission,
        true,
        Array.from(savedErrorIds),
      );
    }
  };

  const saveSpecificErrorToMemory = async (errorItem: WritingErrorItem): Promise<boolean> => {
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

      setSavedErrorIds((prev) => {
        const next = new Set([...prev, errorItem.id]);
        if (activeSubmission) {
          DynamicWritingTaskService.saveActiveSubmission(
            activeSubmission,
            showResultModal,
            Array.from(next),
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

    let savedCount = 0;
    for (let i = 0; i < errors.length; i++) {
      const id = getWritingErrorId(activeSubmission.id, i);
      if (!savedErrorIds.has(id)) {
        const success = await saveSpecificErrorToMemory({ ...errors[i], id });
        if (success) savedCount++;
      }
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
      <div className="flex-1 w-full max-w-[1550px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-3 sm:px-6 lg:px-8 py-1.5 sm:py-3 gap-2 sm:gap-5 lg:gap-6 z-10 overflow-hidden">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between h-full overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <React.Fragment key={currentTask.id}>
              <WritingTaskHeader
                category={`WRITING TASK · ${currentTask.category}`}
                title={currentTask.title}
                description={currentTask.description}
                currentLevel={activeCefrLevel}
                onSelectLevel={handleSelectLevel}
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
              {/* Level-based Scaffolding & Starter Recommendations (Ergonomic Touch Chips) */}
              {currentTask.starterPhrases && currentTask.starterPhrases.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 py-1 sm:py-1.5 px-0.5 sm:px-1 text-xs overflow-x-auto no-scrollbar shrink-0 w-full min-w-0 max-w-full">
                  <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-wider text-white/40 shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    Pistas ({activeCefrLevel}):
                  </span>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {currentTask.starterPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertPhrase(phrase)}
                        className="group inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap cursor-pointer px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] shrink-0 active:scale-95"
                        title="Haz clic para insertar esta frase"
                      >
                        <span className="font-sans">"{phrase}"</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </React.Fragment>
          </div>

          <WritingSubmitBar
            hasContent={wordCount >= minWordsRequired}
            wordCount={wordCount}
            minWords={minWordsRequired}
            isEvaluating={isEvaluating}
            hasAnalysis={Boolean(activeSubmission)}
            onSubmit={handleSubmit}
            onViewAnalysis={handleOpenModal}
          />
        </div>

        {/* Right Column: 4 Cards Stack (Balanced & strictly clamped so it's 100% visible inside viewport) */}
        <div className="hidden xl:flex w-[290px] xl:w-[320px] 2xl:w-[340px] flex-col space-y-3.5 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1">
          <WritingAIMentorCard
            userLevel={activeCefrLevel}
            statusText={
              isEvaluating
                ? "Analyzing your grammar, vocabulary, and register with AI..."
                : activeSubmission
                  ? `Evaluation complete! Analyzed ${activeSubmission.wordCount} words and saved ${activeSubmission.extractedCardsCount || 0} cards to Memory Bank.`
                  : activeCefrLevel.includes("A1") || activeCefrLevel.includes("A2")
                    ? `Nivel ${activeCefrLevel}: Mantén oraciones claras y directas. Usa las pistas recomendadas para empezar tu redacción con seguridad.`
                    : `Current task: ${currentTask.title.toLowerCase()}. ${currentTask.toneHint} tone. I'll review your writing when you submit.`
            }
            animated={isEvaluating}
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
