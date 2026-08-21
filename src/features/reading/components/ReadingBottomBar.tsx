import React from 'react';

export interface ReadingBottomBarProps {
  progressPercentage?: number;
  readTimeRemaining?: string;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export const ReadingBottomBar: React.FC<ReadingBottomBarProps> = ({
  progressPercentage = 25,
  readTimeRemaining = '2 min read',
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="w-full max-w-[620px] flex flex-col space-y-1.5 pt-3 sm:pt-4 select-none shrink-0 border-t border-[#111220]/80 mt-auto mb-1 mx-auto relative bg-[#000001] z-20 animate-[slideUp_0.45s_ease-out_0.2s_both]">
      {/* Main Progress Section (Labels + Progress Line) */}
      <div className="w-full flex flex-col space-y-1.5 px-0">
        {/* Top Labels: 2 min read (left) and 25% (right) */}
        <div className="w-full flex items-center justify-between text-xs font-light">
          <span className="text-[#8a8a9e]">{readTimeRemaining}</span>
          <span className="text-[#A27FF3] font-semibold">{progressPercentage}%</span>
        </div>

        {/* Horizontal Progress Line with Solid Purple Node Handle (NO WHITE BORDER) */}
        <div className="w-full h-[2.5px] bg-[#111220] rounded-full relative flex items-center">
          <div
            className="h-full bg-[#A27FF3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(162,127,243,0.8)]"
            style={{ width: `${progressPercentage}%` }}
          />
          {/* Solid Purple Node Handle with ZERO white border matching reference mockup */}
          <div
            className="w-3 h-3 rounded-full bg-[#A27FF3] shadow-[0_0_10px_rgba(162,127,243,0.9)] absolute -translate-x-1/2"
            style={{ left: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Centered Capsule Pill for Pagination Arrows <  > */}
      <div className="mx-auto pt-1 flex items-center justify-center relative w-full">
        <div className="w-36 sm:w-44 px-6 py-1.5 rounded-full bg-[#05060c] border border-[#111220] flex items-center justify-between shadow-xl">
          <button
            onClick={onPrevPage}
            className="text-[#8a8a9e] hover:text-[#f8f8f8] hover:-translate-x-0.5 transition-all duration-200 cursor-pointer p-1"
            title="Previous page"
            aria-label="Previous page"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]/60 animate-pulse" />

          <button
            onClick={onNextPage}
            disabled={!onNextPage}
            className={`transition-all duration-200 p-1 ${
              onNextPage
                ? "text-[#8a8a9e] hover:text-[#f8f8f8] hover:translate-x-0.5 cursor-pointer"
                : "text-[#8a8a9e]/30 cursor-not-allowed"
            }`}
            title="Next page"
            aria-label="Next page"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
