import React from "react";

export interface OnboardingWelcomeStepProps {
  onBegin: () => void;
  onOpenLogin?: () => void;
}

export const OnboardingWelcomeStep: React.FC<OnboardingWelcomeStepProps> = ({ onBegin, onOpenLogin }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center mx-auto">
      {/* High-Definition Hero Background Graphic Asset */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-contain bg-no-repeat pointer-events-none z-0 opacity-95 blend-graphic-edges"
        style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
      />

      {/* Micro End-Edge Softener */}
      <div className="absolute bottom-[5%] sm:bottom-[6%] left-1/2 -translate-x-1/2 w-full max-w-md h-4 sm:h-5 bg-[#080816]/90 blur-md pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-6 sm:h-8 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

      {/* Locked Foreground UI Elements Overlay */}
      <div className="absolute top-[48%] sm:top-[47%] lg:top-[46%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-center w-full max-w-xl mx-auto px-4">
        {/* Category Branding & Equidistant Glowing Violet Dot */}
        <div className="flex flex-col items-center animate-[fadeSlideUp_0.45s_ease-out_both]">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
            L I N G U A
          </span>
          <div className="py-2 sm:py-2.5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] animate-pulse" />
          </div>
        </div>

        {/* Title & 3-line Description */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-[46px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.5s_ease-out_0.08s_both]">
            Your AI Language Mentor
          </h1>

          <div className="space-y-1.5 text-xs sm:text-sm text-[#999a9b] font-light max-w-md mx-auto leading-relaxed pt-5 sm:pt-6 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both]">
            <p>I don&apos;t teach everyone the same way.</p>
            <p>I&apos;ll first learn how you learn.</p>
            <p>Then I&apos;ll build a language journey that is unique to you.</p>
          </div>
        </div>

        {/* Glowing CTA Button */}
        <div className="pt-5 sm:pt-6 flex flex-col items-center space-y-3 animate-[fadeSlideUp_0.45s_ease-out_0.24s_both]">
          <button
            onClick={onBegin}
            className="group relative inline-flex items-center justify-center px-14 sm:px-20 md:px-22 py-2.5 sm:py-3.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(99,102,241,0.55)] hover:shadow-[0_0_35px_rgba(124,58,237,0.8)] hover:scale-[1.04] active:scale-[0.97] cursor-pointer pointer-events-auto"
          >
            <span>Begin</span>
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>

          {onOpenLogin && (
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-[11px] sm:text-xs text-[#71719A] hover:text-[#C4B5FD] transition-colors cursor-pointer"
            >
              Already have an account? <span className="text-[#A27FF3] font-medium underline underline-offset-2">Sign In</span>
            </button>
          )}
        </div>

        {/* Security Sub-badge */}
        <div className="flex items-center justify-center space-x-1.5 text-[10px] sm:text-[11px] text-[#71719A] font-light pt-4 sm:pt-5 animate-[fadeSlideUp_0.45s_ease-out_0.32s_both]">
          <svg
            className="w-3.5 h-3.5 text-[#71719A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>100% Local • Your data never leaves your device</span>
        </div>
      </div>
    </div>
  );
};
