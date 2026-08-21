import React from 'react';

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
    <div className="my-[4px] flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 select-none shrink-0 w-full">
      {/* Still Not Clear */}
      <button
        onClick={onStillNotClear}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-[#231956] bg-white/[0.02] px-4 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-3.5 text-left transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02] active:scale-[0.98] cursor-pointer animate-[slideUp_0.5s_ease-out_both]"
        style={{ animationDelay: '100ms' }}
      >
        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[#A27FF3]">
          <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </span>
        <span className="flex flex-col">
          <span className="text-xs sm:text-[15px] font-semibold leading-tight text-white">Still not clear</span>
          <span className="text-[10px] sm:text-xs text-[#999a9b]">Review again</span>
        </span>
      </button>

      {/* Almost */}
      <button
        onClick={onAlmost}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-[#231956] bg-white/[0.02] px-4 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-3.5 text-left transition-all duration-300 hover:bg-white/[0.05] hover:scale-[1.02] active:scale-[0.98] cursor-pointer animate-[slideUp_0.5s_ease-out_both]"
        style={{ animationDelay: '200ms' }}
      >
        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[#A27FF3]">
          <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="M2 18h20" />
            <path d="M2 6h20" />
          </svg>
        </span>
        <span className="flex flex-col">
          <span className="text-xs sm:text-[15px] font-semibold leading-tight text-white">Almost</span>
          <span className="text-[10px] sm:text-xs text-[#999a9b]">Review later</span>
        </span>
      </button>

      {/* Got It! (Primary Gradient Button matching source code) */}
      <button
        onClick={onGotIt}
        className="flex items-center gap-2 sm:gap-3 rounded-2xl bg-gradient-to-r from-[#7048E8] to-[#9066FF] px-4 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-3.5 text-left text-white shadow-[0_0_40px_-10px_rgba(112,72,232,0.9)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer animate-[slideUp_0.5s_ease-out_both]"
        style={{ animationDelay: '300ms' }}
      >
        <span className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          <svg className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <span className="flex flex-col">
          <span className="text-xs sm:text-[15px] font-semibold leading-tight text-white">Got it!</span>
          <span className="text-[10px] sm:text-xs text-white/70">Mark as learned</span>
        </span>
      </button>
    </div>
  );
};
