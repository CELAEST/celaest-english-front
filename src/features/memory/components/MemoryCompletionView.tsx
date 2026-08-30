import React from "react";

export interface MemoryCompletionViewProps {
  reviewedCount: number;
  category?: string | undefined;
  onRestart?: (() => void) | undefined;
  onReturnToOverview?: (() => void) | undefined;
}

export const MemoryCompletionView: React.FC<MemoryCompletionViewProps> = ({
  reviewedCount,
  category = "VOCABULARY",
  onRestart,
  onReturnToOverview,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-auto animate-[fadeIn_0.4s_ease-out_both] select-none max-w-lg mx-auto">
      {/* Celebration Icon */}
      <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-[#7048E8] to-[#A27FF3] flex items-center justify-center text-white shadow-[0_0_36px_rgba(112,72,232,0.45)] mb-5">
        <svg
          className="w-9 h-9"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      {/* Title */}
      <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
        {category} · DAILY SRS COMPLETE
      </span>
      <h2 className="mt-1 text-2xl sm:text-3xl font-serif font-normal text-white tracking-wide">
        Session Finished!
      </h2>

      {/* Stat Badge */}
      <div className="mt-4 flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-white">{reviewedCount}</span>
          <span className="text-[10.5px] text-[#8E90A6] uppercase tracking-wider">
            Cards Mastered
          </span>
        </div>
        <div className="w-px h-8 bg-white/[0.08]" />
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-[#4ADE80]">+100%</span>
          <span className="text-[10.5px] text-[#8E90A6] uppercase tracking-wider">
            Interval Boost
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-[#8E90A6] font-light leading-relaxed">
        Your spaced repetition intervals have been recalculated. These cards will return when
        optimal for long-term retention.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReturnToOverview && (
          <button
            type="button"
            onClick={onReturnToOverview}
            className="px-5 py-2.5 rounded-full bg-[#7048E8] text-white text-xs font-medium hover:bg-[#8058F8] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(112,72,232,0.4)]"
          >
            Back to Memory Bank
          </button>
        )}

        {onRestart && (
          <button
            type="button"
            onClick={onRestart}
            className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white text-xs font-medium hover:bg-white/[0.1] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Practice Deck Again
          </button>
        )}
      </div>
    </div>
  );
};
