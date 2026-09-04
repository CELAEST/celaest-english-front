import React, { useEffect, useState } from "react";
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
import {
  AiApiErrorType,
  ErrorScenarioData,
  ERROR_DATA,
} from "../../lab/components/AiEngineErrorsLuxuryStudio";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { AiWritingTaskGenerator } from "../services/aiWritingTaskGenerator";
import { normalizeCefr, CefrLevelCode } from "../../conversation/services/dynamicQuestionService";

export interface WritingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
  roleName?: string;
  userLevel?: string;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = ({
  onNavigateToMemory,
  roleName = "Professional",
  userLevel,
}) => {
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

  const [currentTask, setCurrentTask] = useState<WritingTaskItem>(() =>
    DynamicWritingTaskService.getActiveTask(activeCefrLevel, roleName),
  );

  const handleSelectLevel = React.useCallback(
    (newLevel: CefrLevelCode) => {
      const norm = normalizeCefr(newLevel);
      setActiveCefrLevel(norm);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:writing:cefrLevel", norm);
        } catch {
          // ignore
        }
      }
      const task = DynamicWritingTaskService.getActiveTask(norm, roleName);
      setCurrentTask(task);
      setEditorText(DynamicWritingTaskService.loadDraft(task.id));
      setPersistedSubmission(null);
      DynamicWritingTaskService.clearActiveSubmission();
    },
    [roleName],
  );

  useEffect(() => {
    if (userLevel && normalizeCefr(userLevel) !== normalizeCefr(activeCefrLevel)) {
      handleSelectLevel(normalizeCefr(userLevel) as CefrLevelCode);
    }
  }, [userLevel, activeCefrLevel, handleSelectLevel]);

  useEffect(() => {
    let isCancelled = false;
    // If active task is already an AI task matching level and role, don't overwrite on refresh
    if (currentTask && currentTask.id.startsWith("ai-") && currentTask.level === activeCefrLevel) {
      return;
    }

    AiWritingTaskGenerator.generateWritingTask({
      profession: roleName,
      cefrLevel: activeCefrLevel,
    })
      .then((aiTask) => {
        if (!isCancelled && aiTask) {
          setCurrentTask(aiTask);
          DynamicWritingTaskService.persistActiveTask(aiTask);
        }
      })
      .catch((err) => {
        logger.warn("[WritingPracticeView] AI task generation error:", err);
      });

    return () => {
      isCancelled = true;
    };
  }, [activeCefrLevel, roleName]);
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

Extract all real grammar errors. If there are no real grammar errors, "extractedErrors" MUST be an empty array []. Return ONLY raw valid JSON.`;

        const rawJson = await directClientAiService.chatCompletion({
          systemPrompt,
          userPrompt,
          providerId: activeProvider,
        });

        const cleaned = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        const wordCount = editorText.trim().split(/\s+/).length;
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
      const errMsg = err?.message || String(err);
      let errorType: AiApiErrorType = "rate-limit-429";
      if (errMsg.includes("401") || errMsg.includes("AUTH_DECLINED")) {
        errorType = "invalid-key-401";
      } else if (errMsg.includes("429") || errMsg.includes("RATE_LIMIT")) {
        errorType = "rate-limit-429";
      } else if (errMsg.includes("EXHAUSTED") || errMsg.includes("pool") || errMsg.includes("sin saldo")) {
        errorType = "keys-exhausted-pool";
      } else if (errMsg.includes("504") || errMsg.includes("timeout")) {
        errorType = "gateway-timeout-504";
      } else {
        errorType = "server-outage-503";
      }
      setRecoveryScenario(ERROR_DATA[errorType] || ERROR_DATA["rate-limit-429"]);
      setRecoveryCooldown(ERROR_DATA[errorType]?.cooldownDefault || 14);
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

  // When clicking "Continue Practicing": Advance to the next task and clear the editor
  const handleContinuePracticing = async () => {
    setShowResultModal(false);
    setPersistedSubmission(null);
    DynamicWritingTaskService.clearActiveSubmission();
    DynamicWritingTaskService.clearDraft();
    setEditorText("");
    setSavedErrorIds(new Set());

    try {
      const freshAiTask = await AiWritingTaskGenerator.generateWritingTask({
        profession: roleName,
        cefrLevel: activeCefrLevel,
        forceFresh: true,
      });
      setCurrentTask(freshAiTask);
      DynamicWritingTaskService.persistActiveTask(freshAiTask);
    } catch {
      const fallbackTask = DynamicWritingTaskService.completeTaskAndNext(
        currentTask.id,
        activeCefrLevel,
        roleName,
      );
      setCurrentTask(fallbackTask);
    }
  };

  const handleNewTask = async () => {
    if (isEvaluating || isGeneratingTask) return;
    setIsGeneratingTask(true);
    setShowResultModal(false);
    setPersistedSubmission(null);
    DynamicWritingTaskService.clearActiveSubmission();
    DynamicWritingTaskService.clearDraft();
    setEditorText("");
    setSavedErrorIds(new Set());

    try {
      const freshAiTask = await AiWritingTaskGenerator.generateWritingTask({
        profession: roleName,
        cefrLevel: activeCefrLevel,
        forceFresh: true,
      });
      setCurrentTask(freshAiTask);
      DynamicWritingTaskService.persistActiveTask(freshAiTask);
      appToast.success("Nueva tarea generada", freshAiTask.title);
    } catch {
      const fallbackTask = DynamicWritingTaskService.completeTaskAndNext(
        currentTask.id,
        activeCefrLevel,
        roleName,
      );
      setCurrentTask(fallbackTask);
      appToast.info("Nueva tarea lista", fallbackTask.title);
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
    <div className="relative w-full h-full min-h-screen bg-[#000001] text-white flex flex-col justify-between select-none z-10 overflow-hidden animate-[fadeIn_0.5s_ease-out_both]">
      {/* Main Workspace Content Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-6 sm:px-10 lg:px-14 py-3 sm:py-5 pt-3 sm:pt-4 gap-6 sm:gap-8 z-10 overflow-hidden">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 w-full flex flex-col justify-between h-full min-h-0 overflow-hidden">
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
              {/* Level-based Scaffolding & Starter Recommendations (Naked Typography) */}
              {currentTask.starterPhrases && currentTask.starterPhrases.length > 0 && (
                <div className="flex items-center gap-2 sm:gap-3 py-2 px-1 text-xs overflow-x-auto no-scrollbar shrink-0">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-white/40 shrink-0 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                    Pistas ({activeCefrLevel}):
                  </span>
                  <div className="flex items-center gap-3">
                    {currentTask.starterPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertPhrase(phrase)}
                        className="group inline-flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors whitespace-nowrap cursor-pointer hover:underline decoration-white/30 underline-offset-4"
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

        {/* Right Column: 4 Cards Stack (Hidden on smaller screens to keep editor 100% full-width & responsive) */}
        <div className="hidden xl:flex w-80 xl:w-96 flex-col space-y-4 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1">
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
          setTimeout(() => {
            void handleSubmit();
          }, 350);
        }}
      />
    </div>
  );
};
