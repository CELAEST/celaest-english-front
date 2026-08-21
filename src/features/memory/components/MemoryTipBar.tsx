import React from 'react';

export interface MemoryTipBarProps {
  tip?: string;
  subtitle?: string;
  onShowTips?: () => void;
}

export const MemoryTipBar: React.FC<MemoryTipBarProps> = ({
  tip = 'Consistency is the key.',
  subtitle = 'The more you review, the more you remember.',
  onShowTips,
}) => {
  return (
    <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-3 sm:gap-4 rounded-2xl border border-[#111220] bg-white/[0.02] px-4 sm:px-6 py-2.5 sm:py-3 select-none shrink-0 w-full mb-[6px]">
      {/* Lightbulb Icon */}
      <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/[0.05] text-[#A27FF3] shrink-0">
        <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      </span>

      {/* Tip Content */}
      <div className="min-w-0">
        <p className="text-xs sm:text-[15px] font-semibold text-white">{tip}</p>
        <p className="text-[11px] sm:text-sm text-[#999a9b] font-light">{subtitle}</p>
      </div>

      {/* Show tips link */}
      <button
        onClick={onShowTips}
        className="ml-auto flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A27FF3] transition-colors hover:text-[#bd9ad4] cursor-pointer"
      >
        Show tips
        <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};
