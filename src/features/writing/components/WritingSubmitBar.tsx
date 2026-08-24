import React from 'react';

export interface WritingSubmitBarProps {
  hasContent?: boolean;
  isEvaluating?: boolean;
  onSubmit?: () => void;
}

export const WritingSubmitBar: React.FC<WritingSubmitBarProps> = ({
  hasContent = false,
  isEvaluating = false,
  onSubmit,
}) => {
  const statusText = isEvaluating
    ? 'Evaluating with AI...'
    : hasContent
    ? 'Ready for feedback'
    : 'Start writing to get feedback';

  return (
    <div className="w-full flex items-center justify-between pt-4 sm:pt-6 select-none shrink-0 animate-[slideUp_0.45s_ease-out_0.25s_both]">
      {/* Left honest status */}
      <div className="flex items-center space-x-2 text-xs text-[#8a8a9e] font-light tracking-wide">
        <svg className="w-4 h-4 text-[#8a8a9e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <span aria-live="polite">{statusText}</span>
      </div>

      {/* Center/Right Submit Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isEvaluating || !hasContent}
        aria-label="Submit your text for AI feedback"
        className={`flex items-center space-x-2 px-8 py-3.5 rounded-full text-white text-sm font-medium tracking-wide transition-all cursor-pointer group ${
          isEvaluating
            ? 'bg-[#3b2d70] opacity-60 cursor-not-allowed shadow-none'
            : hasContent
            ? 'bg-gradient-to-r from-[#6748e0] via-[#855fe6] to-[#A27FF3] shadow-[0_0_25px_rgba(162,127,243,0.45)] hover:shadow-[0_0_35px_rgba(162,127,243,0.65)] hover:scale-105 active:scale-95'
            : 'bg-[#1a1830] opacity-50 cursor-not-allowed'
        }`}
      >
        <span>{isEvaluating ? 'Evaluating...' : 'Submit for feedback'}</span>
        <svg className={`w-4 h-4 text-white ${isEvaluating ? 'animate-spin' : 'group-hover:translate-x-1 transition-transform'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          {isEvaluating ? (
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
          ) : (
            <>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </>
          )}
        </svg>
      </button>

      {/* Spacer for symmetrical alignment */}
      <div className="w-20 hidden sm:block" />
    </div>
  );
};
