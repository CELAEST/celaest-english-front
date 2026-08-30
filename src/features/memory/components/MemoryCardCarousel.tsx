import React from "react";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { MemoryFlashcard } from "./MemoryFlashcard";

export interface MemoryCardCarouselProps {
  cards: MemoryCard[];
  activeIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onBookmark?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
}

export const MemoryCardCarousel: React.FC<MemoryCardCarouselProps> = React.memo(
  ({ cards, activeIndex, isFlipped, onFlip, onPrev, onNext, onBookmark, onDelete }) => {
  const total = cards.length;
  if (total === 0) return null;

  const current = cards[activeIndex] || cards[0];
  const prevCard = cards[(activeIndex - 1 + total) % total];
  const nextCard = cards[(activeIndex + 1) % total];

  const getPeekLabels = (card?: MemoryCard) => {
    const cat = (card?.category || "").toUpperCase().trim();
    if (cat === "READING") {
      return { top: "TERM", bottom: "CONTEXT" };
    }
    if (cat === "WRITING") {
      return { top: "YOU WROTE", bottom: "REFINED" };
    }
    return { top: "YOU SAID", bottom: "BETTER WAY" };
  };

  const prevLabels = getPeekLabels(prevCard);
  const nextLabels = getPeekLabels(nextCard);

  return (
    <div className="relative w-full select-none flex flex-col items-center justify-center my-auto px-2">
      {/* ── Main Deck Carousel Row with Prominent Center Card & Side Peek Cards ── */}
      <div className="relative w-full flex items-center justify-center gap-3 lg:gap-6 2xl:gap-8">
        {/* Left Navigation Arrow */}
        {total > 1 && (
          <button
            type="button"
            aria-label="Previous card"
            onClick={onPrev}
            className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#070714]/85 text-white backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#7048E8]/20 hover:border-[#A27FF3]/60 hover:shadow-[0_0_20px_rgba(162,127,243,0.4)] cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* ── Left Peek Card (Physical Depth Experience) ── */}
        {total > 1 && (
          <div
            onClick={onPrev}
            className="hidden xl:flex w-[200px] 2xl:w-[230px] h-[370px] sm:h-[410px] lg:h-[440px] max-h-[calc(100dvh-230px)] shrink-0 opacity-20 hover:opacity-45 transition-all duration-300 scale-90 -translate-x-2 cursor-pointer pointer-events-auto rounded-[28px] p-5 2xl:p-6 bg-[#070714]/65 border border-white/[0.06] backdrop-blur-md flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#8E90A6] uppercase tracking-wider">
                PREVIOUS
              </span>
              <span className="text-[9.5px] font-mono text-[#8E90A6]">
                {((activeIndex - 1 + total) % total) + 1} / {total}
              </span>
            </div>

            <div className="my-auto space-y-3">
              <div>
                <span className="text-[9px] text-[#d8667a] font-semibold uppercase tracking-wider">
                  {prevLabels.top}
                </span>
                <p className="mt-1 text-xs text-white/70 line-clamp-3 font-medium leading-relaxed">
                  {prevCard?.errorWord || prevCard?.userSaid}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <span className="text-[9px] text-[#55c9a4] font-semibold uppercase tracking-wider">
                  {prevLabels.bottom}
                </span>
                <p className="mt-1 text-xs text-white/70 line-clamp-3 font-medium leading-relaxed">
                  {prevCard?.betterWay || prevCard?.userSaid}
                </p>
              </div>
            </div>

            <span className="text-[9.5px] text-[#8E90A6] text-center">Click to view</span>
          </div>
        )}

        {/* ── Active Center Master Flashcard (Grand, Responsive & Centered) ── */}
        <div className="flex-1 max-w-[640px] lg:max-w-[690px] z-10">
          <MemoryFlashcard
            key={current.id}
            card={current}
            cardIndex={activeIndex + 1}
            totalCards={total}
            isFlipped={isFlipped}
            onFlip={onFlip}
            onBookmark={onBookmark}
            onDelete={onDelete}
          />
        </div>

        {/* ── Right Peek Card (Physical Depth Experience) ── */}
        {total > 1 && (
          <div
            onClick={onNext}
            className="hidden xl:flex w-[200px] 2xl:w-[230px] h-[370px] sm:h-[410px] lg:h-[440px] max-h-[calc(100dvh-230px)] shrink-0 opacity-20 hover:opacity-45 transition-all duration-300 scale-90 translate-x-2 cursor-pointer pointer-events-auto rounded-[28px] p-5 2xl:p-6 bg-[#070714]/65 border border-white/[0.06] backdrop-blur-md flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-mono text-[#8E90A6] uppercase tracking-wider">
                NEXT CARD
              </span>
              <span className="text-[9.5px] font-mono text-[#8E90A6]">
                {((activeIndex + 1) % total) + 1} / {total}
              </span>
            </div>

            <div className="my-auto space-y-3">
              <div>
                <span className="text-[9px] text-[#d8667a] font-semibold uppercase tracking-wider">
                  {nextLabels.top}
                </span>
                <p className="mt-1 text-xs text-white/70 line-clamp-3 font-medium leading-relaxed">
                  {nextCard?.errorWord || nextCard?.userSaid}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <span className="text-[9px] text-[#55c9a4] font-semibold uppercase tracking-wider">
                  {nextLabels.bottom}
                </span>
                <p className="mt-1 text-xs text-white/70 line-clamp-3 font-medium leading-relaxed">
                  {nextCard?.betterWay || nextCard?.userSaid}
                </p>
              </div>
            </div>

            <span className="text-[9.5px] text-[#8E90A6] text-center">Click to view</span>
          </div>
        )}

        {/* Right Navigation Arrow */}
        {total > 1 && (
          <button
            type="button"
            aria-label="Next card"
            onClick={onNext}
            className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#070714]/85 text-white backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-[#7048E8]/20 hover:border-[#A27FF3]/60 hover:shadow-[0_0_20px_rgba(162,127,243,0.4)] cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});
