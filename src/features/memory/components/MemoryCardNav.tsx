import React from 'react';

export interface MemoryCardNavProps {
  currentCard?: number;
  totalCards?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onShuffle?: () => void;
}

export const MemoryCardNav: React.FC<MemoryCardNavProps> = ({
  currentCard = 3,
  totalCards = 8,
  onPrev,
  onNext,
}) => {
  return (
    <div className="mt-3 sm:mt-4 lg:mt-2 flex items-center gap-3 sm:gap-4 select-none shrink-0 w-full max-w-md animate-[fadeSlideUp_0.4s_ease-out_both]">
      {/* Back Arrow */}
      <button
        onClick={onPrev}
        aria-label="Back to cards"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#231956] text-white hover:bg-white/[0.08] hover:border-[#A27FF3]/60 hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer shadow-md"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Card Counter */}
      <span className="text-xs sm:text-sm font-medium text-white/90 whitespace-nowrap shrink-0">
        Card {currentCard} of {totalCards}
      </span>

      {/* Segmented Progress Bar (Compact width) */}
      <div
        className="flex w-[120px] sm:w-[160px] shrink-0 items-center gap-1.5"
        role="progressbar"
        aria-valuenow={currentCard}
        aria-valuemax={totalCards}
      >
        {Array.from({ length: totalCards }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < currentCard ? 'bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.6)]' : 'bg-white/[0.08]'
            }`}
          />
        ))}
      </div>

      {/* Next Arrow */}
      <button
        onClick={onNext}
        aria-label="Next card"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#231956] text-white hover:bg-white/[0.08] hover:border-[#A27FF3]/60 hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer shadow-md"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};
