import React, { useEffect, useState } from 'react';
import { WritingHeader } from './WritingHeader';
import { WritingTaskHeader } from './WritingTaskHeader';
import { WritingEditor } from './WritingEditor';
import { WritingSubmitBar } from './WritingSubmitBar';
import { WritingAIMentorCard } from './WritingAIMentorCard';
import { WritingProgressCard } from './WritingProgressCard';
import { WritingFocusCard } from './WritingFocusCard';
import { WritingToolsCard } from './WritingToolsCard';
import { WritingAnalysisModal, WritingErrorItem, getWritingErrorId } from './WritingAnalysisModal';
import { useWritingEvaluation } from '../hooks/useWritingEvaluation';
import { DynamicWritingTaskService, WritingTaskItem } from '../services/dynamicWritingTaskService';
import { apiMemoryRepository } from '../../../infrastructure/repositories/ApiMemoryRepository';

export interface WritingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = ({
  onNavigateToMemory,
}) => {
  const { evaluateText, isEvaluating, submission } = useWritingEvaluation();
  const [currentTask, setCurrentTask] = useState<WritingTaskItem>(() =>
    DynamicWritingTaskService.getActiveTask()
  );
  // Restore the draft saved for the active task (survives page reloads)
  const [editorText, setEditorText] = useState<string>(() =>
    DynamicWritingTaskService.loadDraft(currentTask.id)
  );
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [savedErrorIds, setSavedErrorIds] = useState<Set<string>>(new Set());

  // Debounced draft persistence: never writes on every keystroke
  useEffect(() => {
    const timer = window.setTimeout(() => {
      DynamicWritingTaskService.saveDraft(currentTask.id, editorText);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [editorText, currentTask.id]);

  const wordCount = editorText.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (isEvaluating) return;
    if (editorText.trim().length === 0) return;
    try {
      await evaluateText({
        taskCategory: currentTask.category,
        title: currentTask.title,
        content: editorText,
        taskDescription: currentTask.description,
      });
      setShowResultModal(true);
      // Task answered: persist and serve a brand-new one for the next round
      DynamicWritingTaskService.clearDraft();
      setCurrentTask(DynamicWritingTaskService.completeTaskAndNext(currentTask.id));
      setEditorText('');
      setSavedErrorIds(new Set());
    } catch (err) {
      console.warn("Writing evaluation failed", err);
    }
  };

  const handleNewTask = () => {
    if (isEvaluating) return;
    DynamicWritingTaskService.clearDraft();
    setCurrentTask(DynamicWritingTaskService.completeTaskAndNext(currentTask.id));
    setEditorText('');
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

      setSavedErrorIds((prev) => new Set([...prev, errorItem.id]));
      return true;
    } catch (err) {
      console.warn("Failed to add writing correction to Memory Bank", err);
      return false;
    }
  };

  const saveAllErrorsToMemory = async (): Promise<number> => {
    if (!submission) return 0;
    const errors = submission.feedback?.extractedErrors || [];
    if (errors.length === 0) return 0;

    let savedCount = 0;
    for (let i = 0; i < errors.length; i++) {
      const id = getWritingErrorId(submission.id, i);
      if (!savedErrorIds.has(id)) {
        const success = await saveSpecificErrorToMemory({ ...errors[i], id });
        if (success) savedCount++;
      }
    }

    return savedCount;
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#000001] text-white flex flex-col justify-between select-none z-10 overflow-hidden animate-[fadeIn_0.5s_ease-out_both]">
      {/* Top Header Navigation */}
      <WritingHeader />

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
                timeLimit={currentTask.timeLimit}
              />
              <WritingEditor
                initialContent={editorText}
                onChangeContent={setEditorText}
                minWords={currentTask.minWords}
                maxWords={currentTask.maxWords}
                onNewTask={handleNewTask}
              />
            </React.Fragment>
          </div>

          <WritingSubmitBar
            hasContent={editorText.trim().length > 0}
            isEvaluating={isEvaluating}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Right Column: 4 Cards Stack (Hidden on smaller screens to keep editor 100% full-width & responsive) */}
        <div className="hidden xl:flex w-80 xl:w-96 flex-col space-y-4 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1">
          <WritingAIMentorCard
            statusText={
              isEvaluating
                ? "Analyzing your grammar, vocabulary, and register with AI..."
                : submission
                ? `Evaluation complete! Analyzed ${submission.wordCount} words and saved ${submission.extractedCardsCount || 0} cards to Memory Bank. New task: ${currentTask.title.toLowerCase()}.`
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
          <WritingToolsCard />
        </div>
      </div>

      {/* AI Writing Analysis Modal (Interview design language) */}
      {showResultModal && submission && (
        <WritingAnalysisModal
          submission={submission}
          savedErrorIds={savedErrorIds}
          onClose={() => setShowResultModal(false)}
          onSaveSpecificError={saveSpecificErrorToMemory}
          onSaveAllErrors={saveAllErrorsToMemory}
          onNavigateToMemory={() => {
            setShowResultModal(false);
            if (onNavigateToMemory) onNavigateToMemory();
          }}
        />
      )}
    </div>
  );
};
