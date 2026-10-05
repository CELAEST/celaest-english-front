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
      {/* Celebration Mark — clean ring, no box */}
      <div className="relative w-12 h-12 rounded-full border border-[#A27FF3]/40 bg-[#7048E8]/10 flex items-center justify-center text-white mb-5 shadow-[0_0_28px_rgba(112,72,232,0.35)]">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      {/* Title — naked typography */}
      <span className="text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
        {category} · DAILY SRS COMPLETE
      </span>
      <h2 className="mt-1.5 text-2xl sm:text-[32px] font-serif font-light text-white tracking-tight leading-none">
        Session Finished!
      </h2>

      {/* Stats — borderless, hairline divider only */}
      <div className="mt-5 flex items-center gap-5 sm:gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold text-white tabular-nums">{reviewedCount}</span>
          <span className="mt-0.5 text-[10px] font-mono text-[#8E90A6] uppercase tracking-[0.14em]">
            Cards Mastered
          </span>
        </div>
        <div className="w-px h-9 bg-gradient-to-b from-transparent via-white/[0.14] to-transparent" />
        <div className="flex flex-col items-center">
          <span className="text-xl font-semibold text-[#4ADE80] tabular-nums">+100%</span>
          <span className="mt-0.5 text-[10px] font-mono text-[#8E90A6] uppercase tracking-[0.14em]">
            Interval Boost
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs sm:text-sm text-[#8E90A6] font-light leading-relaxed max-w-md">
        Your spaced repetition intervals have been recalculated. These cards will return when
        optimal for long-term retention.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReturnToOverview && (
          <button
            type="button"
            onClick={onReturnToOverview}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6748e0] via-[#855fe6] to-[#A27FF3] text-white text-xs font-medium hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_25px_rgba(162,127,243,0.45)]"
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
