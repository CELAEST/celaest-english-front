import React from "react";
import { GoogleAuthGlyph } from "../../onboarding/components/OnboardingAuthIcons";

export interface AuthErrorCardProps {
  errorDetails: {
    title: string;
    description: string;
  };
  isRetryingGoogle?: boolean;
  onRetryGoogle: () => void;
  onContinueEmail: () => void;
  className?: string;
}

export const AuthErrorCard: React.FC<AuthErrorCardProps> = ({
  errorDetails,
  isRetryingGoogle = false,
  onRetryGoogle,
  onContinueEmail,
  className = "",
}) => {
  return (
    <div
      className={`relative z-20 w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-3.5 select-none animate-[fadeSlideUp_0.4s_ease-out_both] ${className}`}
    >
      {/* Category Branding & Pulsing Rose Status Dot */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
          L I N G U A
        </span>
        <div className="py-2 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" />
        </div>
      </div>

      {/* Subtle Floating Error Icon Badge */}
      <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Clean Floating Typography */}
      <div className="space-y-1.5 px-2">
        <h2 className="text-lg sm:text-xl font-light tracking-tight text-white">
          {errorDetails.title}
        </h2>
        <p className="text-xs sm:text-[13px] text-[#9999b8] font-light leading-relaxed max-w-xs mx-auto">
          {errorDetails.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-2 pt-2">
        <button
          type="button"
          disabled={isRetryingGoogle}
          onClick={onRetryGoogle}
          className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-6 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white text-xs font-medium shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          {isRetryingGoogle ? (
            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <GoogleAuthGlyph className="w-3.5 h-3.5" />
          )}
          <span>{isRetryingGoogle ? "Connecting..." : "Try Again with Google"}</span>
        </button>

        <button
          type="button"
          onClick={onContinueEmail}
          className="w-full py-1.5 text-xs text-[#9d9db9] hover:text-white transition-colors cursor-pointer font-light"
        >
          Sign In with Email
        </button>
      </div>
    </div>
  );
};
