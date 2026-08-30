import React from "react";

export interface OnboardingFooterProps {
  onSkip?: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({ onSkip }) => {
  return (
    <footer className="relative z-30 w-full px-4 sm:px-8 pt-3 pb-6 sm:pb-8 flex items-center justify-center text-[10px] sm:text-[11px] text-[#B5B5D6] font-light shrink-0 bg-transparent animate-[fadeSlideUp_0.45s_ease-out_0.4s_both]">
      <button
        onClick={onSkip}
        aria-label="Toggle theme or options"
        className="absolute left-4 sm:left-8 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:scale-110 active:scale-90 transition-all duration-200 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </button>

      <div className="text-center tracking-wide">
        Press{" "}
        <kbd className="px-1.5 py-0.5 bg-[#161628] border border-[#353552] rounded text-[#E2E2F8] font-mono text-[9px] sm:text-[10px] font-medium shadow-sm">
          ESC
        </kbd>{" "}
        to skip onboarding
      </div>
    </footer>
  );
};
