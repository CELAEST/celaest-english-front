import React from "react";

export interface MemoryEmptyStateProps {
  category: string;
  hasOtherCards?: boolean | undefined;
  onSwitchCategory?: (() => void) | undefined;
  onStartPractice?: (() => void) | undefined;
}

export const MemoryEmptyState: React.FC<MemoryEmptyStateProps> = ({
  category,
  hasOtherCards = false,
  onSwitchCategory,
  onStartPractice,
}) => {
  const isCategoryCatchUp = hasOtherCards;

  return (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-12 my-auto animate-[fadeIn_0.4s_ease-out_both] select-none max-w-lg mx-auto">
      {/* Obsidian Frosted Core Icon with Specular Light */}
      <div className="relative w-16 h-16 rounded-2xl bg-[#080811] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center text-white/80 mb-6 group transition-all duration-300">
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <svg
          className="w-7 h-7 text-white/70 transform transition-transform duration-500 group-hover:scale-110"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
          />
        </svg>
      </div>

      {/* Heading with Elegant Serif & Clean Contrast */}
      <h3 className="text-2xl sm:text-3xl font-serif font-light text-white tracking-wide">
        {isCategoryCatchUp ? (
          <>
            All caught up in <span className="italic text-white/90">{category.toLowerCase()}</span>
          </>
        ) : (
          <>
            Your Personalized <span className="italic text-white/90">Memory Deck</span>
          </>
        )}
      </h3>

      {/* Welcoming Educational Description */}
      <p className="mt-3 text-xs sm:text-sm text-white/45 font-light leading-relaxed max-w-md">
        {isCategoryCatchUp
          ? "You have completed all scheduled reviews for this category. Continue practicing to encounter new vocabulary."
          : 'Words and expressions are never added automatically. Click "Add to Memory" during your interview, reading, or writing sessions to curate your custom Spaced Repetition deck.'}
      </p>

      {/* 3 Source Badges — 100% Dot-free, Monochrome with Crisp Micro-Icons */}
      {!isCategoryCatchUp && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 01-3-3V4.5a3 3 0 116 0v7.5a3 3 0 01-3 3z" />
            </svg>
            <span>Interview Voice Corrections</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span>Reading Vocabulary</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/60">
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            <span>Writing Refinements</span>
          </div>
        </div>
      )}

      {/* Action Buttons — Clean Luxury Primary & Ghost Action */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {isCategoryCatchUp && onSwitchCategory && (
          <button
            type="button"
            onClick={onSwitchCategory}
            className="px-6 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium active:scale-95 transition-all cursor-pointer border border-white/[0.08]"
          >
            Review other categories
          </button>
        )}

        {onStartPractice && (
          <button
            type="button"
            onClick={onStartPractice}
            className="px-7 py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.12)]"
          >
            Start Practice Session
          </button>
        )}
      </div>
    </div>
  );
};

