import React from "react";

export interface MemoryEmptyStateProps {
  category: string;
  hasOtherCards?: boolean | undefined;
  onSwitchCategory?: (() => void) | undefined;
  onStartPractice?: (() => void) | undefined;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = ({
  category,
  hasOtherCards = true,
  onSwitchCategory,
  onStartPractice,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 my-auto animate-[fadeIn_0.4s_ease-out_both] select-none max-w-md mx-auto">
      {/* Clean Luminous Milestone Badge */}
      <div className="w-16 h-16 rounded-3xl bg-[#7048E8]/15 border border-[#7048E8]/30 flex items-center justify-center text-[#A27FF3] shadow-[0_0_30px_rgba(112,72,232,0.25)] mb-5">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Heading */}
      <h3 className="text-xl sm:text-2xl font-serif font-normal text-white tracking-wide">
        All caught up in <span className="italic text-[#C4B5FD]">{category.toLowerCase()}</span>!
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-[#8E90A6] font-light leading-relaxed">
        You have no cards due for spaced repetition right now. New review cards are automatically
        created from your conversations and readings.
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {hasOtherCards && onSwitchCategory && (
          <button
            type="button"
            onClick={onSwitchCategory}
            className="px-5 py-2.5 rounded-full bg-[#7048E8] text-white text-xs font-medium hover:bg-[#8058F8] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_0_20px_rgba(112,72,232,0.4)]"
          >
            Review other categories
          </button>
        )}

        {onStartPractice && (
          <button
            type="button"
            onClick={onStartPractice}
            className="px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-white text-xs font-medium hover:bg-white/[0.1] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Practice new session
          </button>
        )}
      </div>
    </div>
  );
};
