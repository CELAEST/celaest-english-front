import React, { useState } from "react";
import { OnboardingAuthDirectForm } from "./OnboardingAuthDirectForm";
import { GoogleAuthGlyph } from "./OnboardingAuthIcons";
import { AuthUser } from "../../../application/ports/IAuthService";

export interface OnboardingAuthStepProps {
  onSuccess: (user?: AuthUser) => void;
  onBackToWelcome: () => void;
}

export const OnboardingAuthStep: React.FC<OnboardingAuthStepProps> = ({
  onSuccess,
  onBackToWelcome,
}) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const topOffset =
    mode === "register"
      ? "top-[41%] sm:top-[40%] lg:top-[40%]"
      : "top-[46%] sm:top-[45%] lg:top-[44%]";

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center mx-auto select-none overflow-hidden">
      {/* High-Definition Hero Background Graphic Asset */}
      <div
        className="absolute inset-0 w-full h-full bg-center bg-contain bg-no-repeat pointer-events-none z-0 opacity-95 blend-graphic-edges"
        style={{ backgroundImage: "url('/assets/pure_hero_orb_bg.png')" }}
      />
      <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#03030E] to-transparent pointer-events-none z-10" />

      {/* 100% Centered Floating Content Overlay with Dynamic Top Offset */}
      <div
        className={`absolute ${topOffset} inset-x-0 mx-auto z-20 flex flex-col items-center text-center w-full max-w-xl px-4 transition-all duration-300`}
      >
        <div className="w-full max-w-[310px] sm:max-w-[350px] flex flex-col items-center text-center space-y-2 animate-[fadeSlideUp_0.4s_ease-out_both]">
          {/* Category Branding & Equidistant Glowing Violet Dot */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
              L I N G U A
            </span>
            <div className="py-1 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] animate-pulse" />
            </div>
          </div>

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
            onClick={() => {
              // Standard OAuth entry point
              onSuccess({ id: `google-${Date.now()}`, email: "google.user@celaest.com", name: "Google User" });
            }}
            className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-[11px] sm:text-xs text-white transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <GoogleAuthGlyph className="w-3.5 h-3.5" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="w-full max-w-[220px] flex items-center justify-center space-x-2 py-0.5">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-[9px] uppercase tracking-wider text-[#71719A]">or with email</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Direct Form */}
          <OnboardingAuthDirectForm mode={mode} onSuccess={onSuccess} />

          {/* Bottom Switch Links */}
          <div className="flex flex-col items-center space-y-1 pt-0.5">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[11px] text-[#8e90a6] hover:text-white transition-colors cursor-pointer"
            >
              {mode === "login" ? (
                <>Don&apos;t have an account? <span className="text-[#A27FF3] underline underline-offset-2">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-[#A27FF3] underline underline-offset-2">Sign In</span></>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToWelcome}
              className="text-[10px] text-[#71719A] hover:text-[#C4B5FD] transition-colors cursor-pointer pt-0.5"
            >
              ← Back to Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
