import React from "react";

export interface MemoryActionButtonsProps {
  onStillNotClear?: () => void;
  onAlmost?: () => void;
  onGotIt?: () => void;
}

export const MemoryActionButtons: React.FC<MemoryActionButtonsProps> = ({
  onStillNotClear,
  onAlmost,
  onGotIt,
}) => {
  return (
    <div className="my-1 sm:my-2 flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 select-none shrink-0 w-full">
      {/* 1. Still Not Clear */}
      <button
        type="button"
        onClick={onStillNotClear}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.08] bg-[#070714]/80 backdrop-blur-xl px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-left transition-all duration-200 hover:bg-white/[0.05] hover:border-[#EF4444]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
      >
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-[#EF4444]/10 text-[#F87171] border border-[#EF4444]/20 group-hover:scale-105 transition-transform">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-medium text-white">Still not clear</span>
            <span className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-[#8E90A6] bg-white/[0.06] rounded border border-white/[0.08]">
              1
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8E90A6]">Review today</span>
        </div>
      </button>

      {/* 2. Almost */}
      <button
        type="button"
        onClick={onAlmost}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-white/[0.08] bg-[#070714]/80 backdrop-blur-xl px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-left transition-all duration-200 hover:bg-white/[0.05] hover:border-[#F59E0B]/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
      >
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#FBBF24] border border-[#F59E0B]/20 group-hover:scale-105 transition-transform">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-medium text-white">Almost</span>
            <span className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-[#8E90A6] bg-white/[0.06] rounded border border-white/[0.08]">
              2
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-[#8E90A6]">Review in 2 days</span>
        </div>
      </button>

      {/* 3. Got It! (Primary Action) */}
      <button
        type="button"
        onClick={onGotIt}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-r from-[#7048E8] to-[#8B5CF6] border border-[#A27FF3]/60 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 text-left text-white shadow-[0_0_24px_rgba(112,72,232,0.45)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer group"
      >
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 group-hover:scale-105 transition-transform">
          <svg
            className="h-4 w-4 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-semibold text-white">Got it!</span>
            <span className="hidden sm:inline-block px-1 py-0.2 text-[9px] font-mono text-white/80 bg-white/20 rounded border border-white/30">
              3
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-white/80">Mastered (+6 days)</span>
        </div>
      </button>
    </div>
  );
};
