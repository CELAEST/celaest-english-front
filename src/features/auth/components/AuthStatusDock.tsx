import React from "react";
import { AuthOrbitalLoader } from "./AuthOrbitalLoader";
import { AuthStageIndex } from "./AuthProgressStage";

export interface AuthStatusDockProps {
  statusTitle?: string;
  statusMessage: string;
  stage?: AuthStageIndex;
  isSuccess?: boolean;
  className?: string;
}

export const AuthStatusDock: React.FC<AuthStatusDockProps> = ({
  statusTitle = "Authenticating with Google",
  statusMessage,
  isSuccess = false,
  className = "",
}) => {
  return (
    <div
      className={`relative z-20 flex flex-col items-center text-center space-y-3.5 select-none animate-[fadeSlideUp_0.4s_ease-out_both] ${className}`}
    >
      {/* Category Micro-Branding & Equidistant Glowing Violet Dot */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
          L I N G U A
        </span>
        <div className="py-2 flex items-center justify-center">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSuccess
                ? "bg-emerald-400 shadow-[0_0_12px_#34D399]"
                : "bg-[#8B5CF6] shadow-[0_0_12px_#8B5CF6]"
            } animate-pulse`}
          />
        </div>
      </div>

      {/* Pure Floating Kinetic Orbital Loader */}
      <div className="flex items-center justify-center my-0.5">
        <AuthOrbitalLoader size="md" />
      </div>

      {/* Clean Floating Typography */}
      <div className="space-y-1.5 max-w-md mx-auto px-4">
        <h2 className="text-lg sm:text-xl md:text-[22px] font-light text-white tracking-tight leading-snug">
          {statusTitle}
        </h2>
        <p className="text-xs sm:text-[13px] text-[#9999b8] font-light tracking-wide leading-relaxed animate-pulse">
          {statusMessage}
        </p>
      </div>
    </div>
  );
};
