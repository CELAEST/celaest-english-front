import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface MemoryMobileSwipeHintProps {
  activeIndex: number;
  totalCards: number;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  onSelectIndex?: ((index: number) => void) | undefined;
}

const MAX_VISIBLE_DOTS = 7;

interface DotItem {
  idx: number;
  isCurrent: boolean;
  isEdge: boolean;
}

function getPaginationDots(total: number, active: number): DotItem[] {
  if (total <= MAX_VISIBLE_DOTS) {
    return Array.from({ length: total }, (_, idx) => ({
      idx,
      isCurrent: idx === active,
      isEdge: false,
    }));
  }

  const half = Math.floor(MAX_VISIBLE_DOTS / 2);
  let start = active - half;
  let end = active + half;

  if (start < 0) {
    start = 0;
    end = MAX_VISIBLE_DOTS - 1;
  } else if (end >= total) {
    end = total - 1;
    start = total - MAX_VISIBLE_DOTS;
  }

  const items: DotItem[] = [];
  for (let i = start; i <= end; i++) {
    const isFirst = i === start && start > 0;
    const isLast = i === end && end < total - 1;
    items.push({
      idx: i,
      isCurrent: i === active,
      isEdge: isFirst || isLast,
    });
  }

  return items;
}

/**
 * CELAEST Mobile Card Pagination Indicator
 * Free-floating, borderless dots with tactile chevron controls for seamless card passing.
 */
export const MemoryMobileSwipeHint: React.FC<MemoryMobileSwipeHintProps> = React.memo(
  ({ activeIndex, totalCards, onPrev, onNext, onSelectIndex }) => {
    if (totalCards <= 1) return null;

    const dots = getPaginationDots(totalCards, activeIndex);

    return (
      <div className="sm:hidden flex items-center justify-center w-full pt-5 pb-2.5 select-none z-20 gap-2.5">
        {onPrev && (
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous card"
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 active:text-white active:bg-white/[0.1] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}

        <div
          className="flex items-center gap-1.5"
          role="tablist"
          aria-label="Card pagination"
        >
          {dots.map(({ idx, isCurrent, isEdge }) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectIndex?.(idx)}
              aria-label={`Go to card ${idx + 1}`}
              className="relative flex items-center justify-center focus:outline-none cursor-pointer p-0.5"
            >
              <motion.div
                layout
                animate={{
                  width: isCurrent ? 20 : isEdge ? 3.5 : 5,
                  height: 4,
                  opacity: isCurrent ? 0.95 : isEdge ? 0.2 : 0.4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
                className={`rounded-full ${
                  isCurrent ? "bg-white" : "bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next card"
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 active:text-white active:bg-white/[0.1] transition-all cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  },
);
