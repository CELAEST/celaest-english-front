import React, { useState } from 'react';
import { WritingHeader } from './WritingHeader';
import { WritingTaskHeader } from './WritingTaskHeader';
import { WritingEditor } from './WritingEditor';
import { WritingSubmitBar } from './WritingSubmitBar';
import { WritingAIMentorCard } from './WritingAIMentorCard';
import { WritingProgressCard } from './WritingProgressCard';
import { WritingFocusCard } from './WritingFocusCard';
import { WritingToolsCard } from './WritingToolsCard';
import { WritingAnalysisModal } from './WritingAnalysisModal';
import { useWritingEvaluation } from '../hooks/useWritingEvaluation';

export interface WritingPracticeViewProps {
  onBackToWorkspace?: () => void;
  onNavigateToMemory?: () => void;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = ({
  onBackToWorkspace,
  onNavigateToMemory,
}) => {
  const { evaluateText, isEvaluating, submission } = useWritingEvaluation();
  const [editorText, setEditorText] = useState<string>(
    `Dear Mr. Thompson,\n\nI hope this email finds you well.\n\nI have receive your email yesterday regarding the project status. We will discuss about the marketing strategy and everyone are aligned on the next steps.\n\nI am looking forward to meet you next week.\n\nBest regards,\nEsteban`
  );
  const [showResultModal, setShowResultModal] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (isEvaluating) return;
    try {
      await evaluateText("EMAIL", "Project Update Email", editorText);
      setShowResultModal(true);
    } catch (err) {
      console.warn("Writing evaluation failed", err);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-[#000001] text-white flex flex-col justify-between select-none z-10 overflow-hidden animate-[fadeIn_0.5s_ease-out_both]">
      {/* Top Header Navigation */}
      <WritingHeader
        onBack={onBackToWorkspace}
        onEndSession={onBackToWorkspace}
      />

      {/* Main Workspace Content Canvas */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-6 sm:px-10 lg:px-14 py-3 sm:py-5 pt-3 sm:pt-4 gap-6 sm:gap-8 z-10 overflow-hidden">
        {/* Left Column: Task Header, Editor & Submit Bar */}
        <div className="flex-1 w-full flex flex-col justify-between h-full min-h-0 overflow-hidden">
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <WritingTaskHeader
              category="WRITING TASK"
              title="Write an email to a client"
              description="Use a professional tone and explain a project update."
              timeLimit="18 min"
            />
            <WritingEditor
              initialContent={editorText}
              onChangeContent={(text) => setEditorText(text)}
            />
          </div>

          <WritingSubmitBar
            autoSaved={!isEvaluating}
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
                ? `Evaluation complete! Analyzed ${submission.wordCount} words and saved ${submission.extractedCardsCount || 0} cards to Memory Bank.`
                : "You're communicating clearly. I'll review your writing and help you make it even stronger."
            }
          />
          <WritingProgressCard />
          <WritingFocusCard />
          <WritingToolsCard />
        </div>
      </div>

      {/* AI Writing Analysis Modal Adapted from downloaded design */}
      {showResultModal && submission && (
        <WritingAnalysisModal
          submission={submission}
          onClose={() => setShowResultModal(false)}
          onNavigateToMemory={() => {
            setShowResultModal(false);
            if (onNavigateToMemory) onNavigateToMemory();
          }}
        />
      )}
    </div>
  );
};
