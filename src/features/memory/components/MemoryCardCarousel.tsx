import React from "react";
import { MemoryCard } from "../../../domain/entities/MemoryCard";
import { MemoryFlashcard } from "./MemoryFlashcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  direction?: number;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : dir < 0 ? -60 : 0,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : dir < 0 ? 60 : 0,
    opacity: 0,
    scale: 0.95,
  }),
};

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
    direction = 1,
  }) => {
    const total = cards.length;
    if (total === 0) return null;

    const current = cards[activeIndex] || cards[0];

    // Side peek cards are only shown when there are at least 3 distinct cards in the deck
    // to avoid duplicated cards when total is 2, and collapse to 1 card when small.
    const canShowSidePeeks = total >= 3;

    const prevIndex = (activeIndex - 1 + total) % total;
    const nextIndex = (activeIndex + 1) % total;
    const prevCard = cards[prevIndex];
    const nextCard = cards[nextIndex];

    const getPeekData = (card?: MemoryCard) => {
      if (!card) {
        return {
          category: "CARD",
          topLabel: "",
          topText: "",
          bottomLabel: "",
          bottomText: "",
        };
      }
      const cat = (card.category || "").toUpperCase().trim();
      const isReading = cat === "READING";
      const isWriting = cat === "WRITING";

      if (isReading) {
        const term = card.errorWord || card.betterWay || card.userSaid || "Vocabulary";
        let context = card.userSaid && card.userSaid !== term ? card.userSaid : "";
        if (!context && card.grammarExplanation && card.grammarExplanation !== term) {
          context = card.grammarExplanation;
        } else if (!context && card.translationSpanish) {
          context = card.translationSpanish;
        } else if (!context) {
          context = "Reading contextual entry";
        }
        context = context.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, "").trim();

        return {
          category: "READING",
          topLabel: "VOCABULARY",
          topText: term,
          bottomLabel: "CONTEXT",
          bottomText: context,
        };
      }

      if (isWriting) {
        return {
          category: "WRITING",
          topLabel: "DRAFT",
          topText: card.userSaid || "Initial draft",
          bottomLabel: "POLISHED",
          bottomText: card.betterWay || card.correctWord || "Polished expression",
        };
      }

      return {
        category: "SPEAKING",
        topLabel: "YOU SAID",
        topText: card.userSaid || card.errorWord || "Your phrase",
        bottomLabel: "BETTER WAY",
        bottomText: card.betterWay || card.correctWord || "Optimal phrasing",
      };
    };

    const prevData = getPeekData(prevCard);
    const nextData = getPeekData(nextCard);

    return (
      <div className="relative w-full select-none flex flex-col items-center justify-center my-auto px-2">
        {/* ── Main Deck Carousel Row ── */}
        <div className="relative w-full flex items-center justify-center gap-3 sm:gap-5 lg:gap-7 2xl:gap-8">
          {/* Left Navigation Arrow */}
          {total > 1 && (
            <button
              type="button"
              aria-label="Previous card"
              onClick={onPrev}
              className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/50 hover:text-white backdrop-blur-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* ── Left Peek Card (Clean 3D Spatial Deck - Only when total >= 3 and 2xl desktop) ── */}
          {canShowSidePeeks && (
            <div
              onClick={onPrev}
              role="button"
              tabIndex={0}
              aria-label="Previous card preview"
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPrev()}
              className="relative group hidden 2xl:flex shrink-0 cursor-pointer select-none transition-all duration-400 ease-out [perspective:1200px]"
            >
              {/* Clean Dark Glass Card Body */}
              <div className="relative w-[195px] 2xl:w-[225px] h-[370px] sm:h-[400px] lg:h-[430px] rounded-3xl p-6 bg-gradient-to-b from-[#0e0c1a]/85 via-[#070510]/90 to-[#020108]/95 border border-white/[0.08] group-hover:border-white/[0.18] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden transition-all duration-400 ease-out [transform:rotateY(10deg)_scale(0.88)] group-hover:[transform:rotateY(4deg)_scale(0.91)]">
                {/* Subtle Top Hairline */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                {/* Minimalist Top Bar */}
                <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-sans">
                  <span className="uppercase tracking-widest font-medium text-[10px] text-white/40 group-hover:text-white/70 transition-colors">
                    {prevData.category}
                  </span>
                  <span className="text-white/35 font-sans tracking-wider">
                    {prevIndex + 1} / {total}
                  </span>
                </div>

                {/* Text Snippets */}
                <div className="my-auto space-y-4 z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-rose-400/80">
                      {prevData.topLabel}
                    </span>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed pl-2.5 border-l border-rose-500/30">
                      {prevData.topText}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-emerald-400/80">
                      {prevData.bottomLabel}
                    </span>
                    <p className="text-xs text-white/60 line-clamp-3 leading-relaxed pl-2.5 border-l border-emerald-400/30">
                      {prevData.bottomText}
                    </p>
                  </div>
                </div>

                {/* Quiet Click Hint */}
                <div className="z-10 text-center">
                  <span className="text-[10px] font-sans tracking-wide text-white/25 group-hover:text-white/50 transition-colors">
                    Click to view
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Active Center Master Flashcard (Slides smoothly on next/prev) ── */}
          <div className="flex-1 max-w-[640px] lg:max-w-[690px] z-10 w-full overflow-visible">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 320, damping: 30 },
                  opacity: { duration: 0.22, ease: "easeOut" },
                  scale: { duration: 0.22, ease: "easeOut" },
                }}
                className="w-full"
              >
                <MemoryFlashcard
                  card={current}
                  cardIndex={activeIndex + 1}
                  totalCards={total}
                  isFlipped={isFlipped}
                  onFlip={onFlip}
                  onBookmark={onBookmark}
                  onDelete={onDelete}
                  onReviewScore={onReviewScore}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Peek Card (Clean 3D Spatial Deck - Only when total >= 3 and 2xl desktop) ── */}
          {canShowSidePeeks && (
            <div
              onClick={onNext}
              role="button"
              tabIndex={0}
              aria-label="Next card preview"
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onNext()}
              className="relative group hidden 2xl:flex shrink-0 cursor-pointer select-none transition-all duration-400 ease-out [perspective:1200px]"
            >
              {/* Clean Dark Glass Card Body */}
              <div className="relative w-[195px] 2xl:w-[225px] h-[370px] sm:h-[400px] lg:h-[430px] rounded-3xl p-6 bg-gradient-to-b from-[#0e0c1a]/85 via-[#070510]/90 to-[#020108]/95 border border-white/[0.08] group-hover:border-white/[0.18] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden transition-all duration-400 ease-out [transform:rotateY(-10deg)_scale(0.88)] group-hover:[transform:rotateY(-4deg)_scale(0.91)]">
                {/* Subtle Top Hairline */}
                <div className="absolute top-0 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

                {/* Minimalist Top Bar */}
                <div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-sans">
                  <span className="uppercase tracking-widest font-medium text-[10px] text-white/40 group-hover:text-white/70 transition-colors">
                    {nextData.category}
                  </span>
                  <span className="text-white/35 font-sans tracking-wider">
                    {nextIndex + 1} / {total}
                  </span>
                </div>

                {/* Text Snippets */}
                <div className="my-auto space-y-4 z-10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-rose-400/80">
                      {nextData.topLabel}
                    </span>
                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed pl-2.5 border-l border-rose-500/30">
                      {nextData.topText}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-emerald-400/80">
                      {nextData.bottomLabel}
                    </span>
                    <p className="text-xs text-white/60 line-clamp-3 leading-relaxed pl-2.5 border-l border-emerald-400/30">
                      {nextData.bottomText}
                    </p>
                  </div>
                </div>

                {/* Quiet Click Hint */}
                <div className="z-10 text-center">
                  <span className="text-[10px] font-sans tracking-wide text-white/25 group-hover:text-white/50 transition-colors">
                    Click to view
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Navigation Arrow */}
          {total > 1 && (
            <button
              type="button"
              aria-label="Next card"
              onClick={onNext}
              className="z-30 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] hover:border-white/[0.25] bg-white/[0.03] hover:bg-white/[0.08] active:bg-white/[0.12] text-white/50 hover:text-white backdrop-blur-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);
