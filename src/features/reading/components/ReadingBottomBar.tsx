import React from "react";

export interface ReadingBottomBarProps {
  progressPercentage?: number;
  readTimeRemaining?: string;
  currentPage?: number;
  totalPages?: number;
  onPrevPage?: (() => void) | (() => Promise<void>) | undefined;
  onNextPage?: (() => void) | (() => Promise<void>) | undefined;
}

export const ReadingBottomBar: React.FC<ReadingBottomBarProps> = React.memo(
  ({
    progressPercentage = 25,
    readTimeRemaining = "2 min read",
    currentPage = 1,
    totalPages = 1,
    onPrevPage,
    onNextPage,
  }) => {
    return (
      <nav
        aria-label="Reading navigation"
        className="w-full flex flex-col space-y-2 select-none shrink-0 mt-auto mb-3 sm:mb-4.5 pb-1 relative bg-transparent z-20 animate-[slideUp_0.45s_ease-out_0.2s_both]"
      >
        {/* Main Progress Section (Labels + Progress Line) */}
        <div className="w-full flex flex-col space-y-1.5 px-0">
          {/* Top Labels: readTime (left) and % (right) */}
          <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-light">
            <span className="text-white/80 font-normal">{readTimeRemaining}</span>
            <span className="text-[#A27FF3] font-semibold">{progressPercentage}%</span>
          </div>

          {/* Horizontal Progress Line with Solid Purple Node Handle */}
          <div
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading completion progress"
            className="w-full h-[2px] bg-white/10 rounded-full relative flex items-center"
          >
            <div
              className="h-full bg-[#A27FF3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(162,127,243,0.8)]"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Solid Purple Node Handle */}
            <div
              className="w-2 h-2 rounded-full bg-[#A27FF3] shadow-[0_0_10px_rgba(162,127,243,0.9)] absolute -translate-x-1/2"
              style={{ left: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Split High-End Navigation: Zero Container Box, Buttons on Left and Right */}
        <div className="w-full flex items-center justify-between pt-1.5 px-0.5">
          {/* Previous page button on the left */}
          <button
            type="button"
            onClick={onPrevPage}
            disabled={!onPrevPage}
            className={`group flex items-center space-x-1.5 text-xs transition-all duration-200 py-1 px-2 rounded-lg ${
              onPrevPage
                ? "text-white/70 hover:text-white cursor-pointer hover:bg-white/[0.06] active:scale-95"
                : "text-white/20 cursor-not-allowed"
            }`}
            title="Previous page"
            aria-label="Previous page"
          >
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="font-normal">Previous</span>
          </button>

          {/* Minimal Centered Page Indicator */}
          <div className="flex items-center text-xs font-mono tracking-widest select-none tabular-nums">
            <span aria-current="page" className="text-white font-semibold">
              {String(currentPage).padStart(2, "0")}
            </span>
            <span className="text-white/30 mx-1.5" aria-hidden="true">
              /
            </span>
            <span className="text-white/60 font-normal">{String(totalPages).padStart(2, "0")}</span>
          </div>

          {/* Next page button on the right */}
          <button
            type="button"
            onClick={onNextPage}
            disabled={!onNextPage}
            className={`group flex items-center space-x-1.5 text-xs transition-all duration-200 py-1 px-2.5 rounded-lg ${
              onNextPage
                ? "text-white/70 hover:text-white cursor-pointer hover:bg-white/[0.06] active:scale-95"
                : "text-white/20 cursor-not-allowed"
            }`}
            title="Next page"
            aria-label="Next page"
          >
            <span className="font-normal">Next</span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </nav>
    );
  },
);

ReadingBottomBar.displayName = "ReadingBottomBar";
