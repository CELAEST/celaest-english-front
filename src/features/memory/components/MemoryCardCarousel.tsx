import React from "react";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { MemoryFlashcard } from "./MemoryFlashcard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MemoryCardCarouselProps {
  cards: MemoryCard[];
  activeIndex: number;
  isFlipped: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onBookmark?: (cardId: string) => void;
  onDelete?: (cardId: string) => void;
  onReviewScore?: (score: number) => void;
}

export const MemoryCardCarousel: React.FC<MemoryCardCarouselProps> = React.memo(
  ({
    cards,
    activeIndex,
    isFlipped,
    onFlip,
    onPrev,
    onNext,
    onBookmark,
    onDelete,
    onReviewScore,
  }) => {
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
        return { top: "DRAFT", bottom: "POLISHED" };
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
              className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#04040A] text-white/70 backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:text-white hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* ── Left Peek Card (Physical Depth Experience) ── */}
          {total > 1 && (
            <div
              onClick={onPrev}
              className="hidden xl:flex w-[200px] 2xl:w-[230px] h-[390px] sm:h-[430px] lg:h-[460px] max-h-[calc(100dvh-220px)] shrink-0 opacity-20 hover:opacity-45 transition-all duration-300 scale-90 -translate-x-2 cursor-pointer pointer-events-auto rounded-3xl p-6 bg-[#04040A] border border-white/[0.06] backdrop-blur-md flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="uppercase tracking-wider">PREVIOUS</span>
                <span>
                  {((activeIndex - 1 + total) % total) + 1} / {total}
                </span>
              </div>

              <div className="my-auto space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#F87171]/80 font-mono uppercase tracking-wider">
                    {prevLabels.top}
                  </span>
                  <p className="text-xs text-white/60 line-clamp-3 font-normal leading-relaxed pl-2 border-l border-[#F87171]/30">
                    {prevCard?.errorWord || prevCard?.userSaid}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#34D399]/80 font-mono uppercase tracking-wider">
                    {prevLabels.bottom}
                  </span>
                  <p className="text-xs text-white/60 line-clamp-3 font-normal leading-relaxed pl-2 border-l border-[#34D399]/30">
                    {prevCard?.betterWay || prevCard?.userSaid}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-white/30 text-center">Click to view</span>
            </div>
          )}

          {/* ── Active Center Master Flashcard ── */}
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
              onReviewScore={onReviewScore}
            />
          </div>

          {/* ── Right Peek Card (Physical Depth Experience) ── */}
          {total > 1 && (
            <div
              onClick={onNext}
              className="hidden xl:flex w-[200px] 2xl:w-[230px] h-[390px] sm:h-[430px] lg:h-[460px] max-h-[calc(100dvh-220px)] shrink-0 opacity-20 hover:opacity-45 transition-all duration-300 scale-90 translate-x-2 cursor-pointer pointer-events-auto rounded-3xl p-6 bg-[#04040A] border border-white/[0.06] backdrop-blur-md flex-col justify-between"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="uppercase tracking-wider">NEXT CARD</span>
                <span>
                  {((activeIndex + 1) % total) + 1} / {total}
                </span>
              </div>

              <div className="my-auto space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-[#F87171]/80 font-mono uppercase tracking-wider">
                    {nextLabels.top}
                  </span>
                  <p className="text-xs text-white/60 line-clamp-3 font-normal leading-relaxed pl-2 border-l border-[#F87171]/30">
                    {nextCard?.errorWord || nextCard?.userSaid}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-[#34D399]/80 font-mono uppercase tracking-wider">
                    {nextLabels.bottom}
                  </span>
                  <p className="text-xs text-white/60 line-clamp-3 font-normal leading-relaxed pl-2 border-l border-[#34D399]/30">
                    {nextCard?.betterWay || nextCard?.userSaid}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-white/30 text-center">Click to view</span>
            </div>
          )}

          {/* Right Navigation Arrow */}
          {total > 1 && (
            <button
              type="button"
              aria-label="Next card"
              onClick={onNext}
              className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#04040A] text-white/70 backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:text-white hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);
