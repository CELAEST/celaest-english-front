import React, { useState } from "react";
import { OptimizedVideo } from "../../../design-system/components/Media/OptimizedVideo";
import { OnboardingAuthDirectForm } from "./OnboardingAuthDirectForm";
import { GoogleAuthGlyph } from "./OnboardingAuthIcons";
import { AuthUser } from "../../../application/ports/IAuthService";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";

export interface OnboardingAuthStepProps {
  onSuccess: (user?: AuthUser, mode?: "login" | "register") => void;
  onBackToWelcome?: () => void;
}

const OnboardingAuthStepInner: React.FC<OnboardingAuthStepProps> = ({
  onSuccess,
  onBackToWelcome,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!onBackToWelcome) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBackToWelcome();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBackToWelcome]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      const { error } = await SupabaseAuthAdapter.getInstance().loginWithGoogle();
      if (error) {
        setGoogleError(error);
        setIsGoogleLoading(false);
      }
    } catch {
      setGoogleError("Unable to initialize Google Sign In. Please check your connection.");
      setIsGoogleLoading(false);
    }
  };

  const topOffset =
    mode === "register"
      ? "top-[43%] sm:top-[44%] lg:top-[44%]"
      : "top-[47%] sm:top-[48%] lg:top-[48%]";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center mx-auto select-none overflow-hidden bg-[#000003]">
      {onBackToWelcome && (
        <button
          type="button"
          onClick={onBackToWelcome}
          aria-label="Return to welcome screen"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-30 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs text-[#8e90a6] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#8B5CF6] outline-none"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>
      )}

      {/* High-Definition Hero Video Background — begin1 — fluido */}
      <OptimizedVideo
        src="/assets/begin1"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 opacity-95 mix-blend-screen"
      />
      <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#000003] to-transparent pointer-events-none z-10" />

      {/* 100% Centered Floating Content Overlay with Dynamic Top Offset */}
      <div
        className={`absolute ${topOffset} inset-x-0 mx-auto z-20 flex flex-col items-center text-center w-full max-w-xl px-4 transition-all duration-300`}
      >
        <div className="w-full max-w-[310px] sm:max-w-[350px] flex flex-col items-center text-center space-y-2 animate-[fadeSlideUp_0.4s_ease-out_both]">
          {/* Category Branding — Only in Login Mode */}
          {mode === "login" && (
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
                L I N G U A
              </span>
            </div>
          )}

          {/* Headline */}
          <div className="flex flex-col items-center space-y-0.5">
            <h1 className="text-xl sm:text-2xl md:text-[26px] font-light tracking-tight text-white leading-tight">
              {mode === "login" ? "Sign In to Your Mentor" : "Create Your Account"}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-[#999a9b] font-light max-w-xs leading-tight">
              {mode === "login"
                ? "Continue your personalized AI language journey."
                : "Set up your profile to start learning with Lingua."}
            </p>
          </div>

          {/* Google SSO Pill */}
          <button
            type="button"
            disabled={isGoogleLoading}
            aria-busy={isGoogleLoading}
            aria-label="Continue with Google"
            onClick={handleGoogleSignIn}
            className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[11px] sm:text-xs text-white transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#8B5CF6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000003] outline-none"
          >
            {isGoogleLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" aria-hidden="true" />
            ) : (
              <GoogleAuthGlyph className="w-3.5 h-3.5" />
            )}
            <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>

          {googleError && (
            <p role="alert" aria-live="assertive" className="text-[10px] text-red-400 font-light max-w-xs">{googleError}</p>
          )}

          {/* Divider */}
          <div className="w-full max-w-[220px] flex items-center justify-center space-x-2 py-0.5" role="separator" aria-label="Alternative login method">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[9px] uppercase tracking-wider text-[#71719A]">or with email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Direct Form */}
          <OnboardingAuthDirectForm mode={mode} onSuccess={(user, authMode) => onSuccess(user, authMode)} />

          {/* Bottom Switch Links */}
          <div className="flex flex-col items-center space-y-1 pt-0.5">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[11px] text-[#8e90a6] hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded outline-none"
              aria-label={mode === "login" ? "Don't have an account? Switch to sign up" : "Already have an account? Switch to sign in"}
            >
              {mode === "login" ? (
                <>Don&apos;t have an account? <span className="text-[#A27FF3] underline underline-offset-2">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-[#A27FF3] underline underline-offset-2">Sign In</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnboardingAuthStep = React.memo(OnboardingAuthStepInner);

