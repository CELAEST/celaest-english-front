import React from "react";
import { ArrowRight } from "lucide-react";
import { WritingSubmission } from "../../../domain/entities/WritingSubmission";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import {
  WritingErrorItem,
  getWritingErrorId,
  getTierLabel,
  WritingMasterScorecard,
  WritingExecutiveSummary,
  WritingOriginalText,
  WritingErrorCarousel,
} from "./analysis";

export type { WritingErrorItem };
export { getWritingErrorId };

export interface WritingAnalysisModalProps {
  submission: WritingSubmission;
  savedErrorIds: Set<string>;
  onClose: () => void;
  onContinuePracticing?: () => void;
  onSaveSpecificError: (errorItem: WritingErrorItem) => Promise<boolean>;
  onSaveAllErrors: () => Promise<number>;
  onNavigateToMemory?: () => void;
}

function getFallbackStrengths(submission: WritingSubmission): string[] {
  const items: string[] = [];
  if ((submission.scoreClarity || 0) >= 75) {
    items.push("Clear, easy-to-follow writing style.");
  }
  if ((submission.scoreGrammar || 0) >= 75) {
    items.push("Strong grammar control throughout the text.");
  }
  if (items.length === 0) {
    items.push("You completed the task and communicated your core message.");
  }
  return items;
}

function getFallbackIssues(errors: WritingErrorItem[]): string[] {
  if (errors.length === 0) {
    return ["No critical issues detected in this submission."];
  }
  return errors.slice(0, 2).map((e) => `Recurring issue with "${e.errorWord || e.correctWord}".`);
}

export const WritingAnalysisModal: React.FC<WritingAnalysisModalProps> = ({
  submission,
  savedErrorIds,
  onClose,
  onContinuePracticing,
  onSaveSpecificError,
  onSaveAllErrors,
  onNavigateToMemory,
}) => {
  const feedbackData = submission.feedback;
  const errors: WritingErrorItem[] = (feedbackData.extractedErrors || []).map((e, i) => ({
    ...e,
    id: getWritingErrorId(submission.id, i),
  }));

  const rawStrengths = feedbackData.strengths || [];
  const rawIssues = feedbackData.issues || [];
  const rawImprovements = feedbackData.improvements || [];

  const strengths: string[] =
    rawStrengths.length > 0 ? rawStrengths : getFallbackStrengths(submission);
  const issues: string[] = rawIssues.length > 0 ? rawIssues : getFallbackIssues(errors);
  const improvements: string[] =
    rawImprovements.length > 0
      ? rawImprovements
      : ["Review the correction cards below and practice the suggested structures."];

  const overallScore = Math.round(
    ((submission.scoreClarity || 0) + (submission.scoreGrammar || 0)) / 2,
  );

  return (
    <AppModal
      size="lg"
      title="AI Writing Analysis Complete"
      subtitle={`${submission.wordCount} words evaluated · CEFR Level ${submission.evaluatedLevel || "B1"}`}
      ariaLabel="AI Writing Analysis Complete"
      onClose={onClose}
      icon={
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L17.5 8.5L12 22L6.5 8.5L12 2Z"
            stroke="url(#wrt_hdr_grad)"
            strokeWidth="1.75"
            fill="url(#wrt_hdr_fill)"
            fillOpacity="0.2"
          />
          <circle cx="12" cy="10" r="2" stroke="#A27FF3" strokeWidth="1.5" />
          <path d="M12 12.5V17.5" stroke="#9d7cf0" strokeWidth="1.25" strokeLinecap="round" />
          <defs>
            <linearGradient id="wrt_hdr_grad" x1="6.5" y1="2" x2="17.5" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#674ee6" />
            </linearGradient>
            <linearGradient id="wrt_hdr_fill" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#3b1d7d" />
            </linearGradient>
          </defs>
        </svg>
      }
      bodyClassName="px-3 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3 lg:px-7 lg:pt-6 lg:pb-3"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#8a8a9e] hidden sm:block">
            Revisa los detalles de tu análisis o continúa practicando.
          </p>
          <button
            type="button"
            onClick={onContinuePracticing || onClose}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7048E8] to-[#A27FF3] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#7048E8]/30 transition-opacity hover:opacity-90 cursor-pointer shrink-0"
          >
            <span>Continue Practicing</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-3.5 sm:space-y-5 animate-[fadeSlideUp_0.35s_ease-out_both]">
        <WritingMasterScorecard
          overallScore={overallScore}
          scoreClarity={submission.scoreClarity || 0}
          scoreGrammar={submission.scoreGrammar || 0}
          getTierLabel={getTierLabel}
        />

        <WritingExecutiveSummary
          summary={feedbackData.summary}
          strengths={strengths}
          issues={issues}
          improvements={improvements}
        />

        <WritingOriginalText
          content={submission.content}
          errorCount={errors.length}
          onNavigateToMemory={onNavigateToMemory}
        />

        <WritingErrorCarousel
          errors={errors}
          savedErrorIds={savedErrorIds}
          wordCount={submission.wordCount}
          onSaveSpecificError={onSaveSpecificError}
          onSaveAllErrors={onSaveAllErrors}
          onNavigateToMemory={onNavigateToMemory}
        />
      </div>
    </AppModal>
  );
};
