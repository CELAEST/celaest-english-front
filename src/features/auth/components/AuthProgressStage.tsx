import React from "react";

export type AuthStageIndex = 1 | 2 | 3;

export interface AuthProgressStageProps {
  currentStage: AuthStageIndex;
  className?: string;
}

const STAGES = [
  { step: 1, label: "Google Handshake" },
  { step: 2, label: "Token Exchange" },
  { step: 3, label: "Profile Matrix" },
] as const;

export const AuthProgressStage: React.FC<AuthProgressStageProps> = ({
  currentStage,
  className = "",
}) => {
  return (
    <div className={`w-full max-w-xs flex flex-col space-y-2 select-none ${className}`}>
      {/* 3-Bar Kinetic Progress Track */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {STAGES.map((s) => {
          const isDone = currentStage > s.step;
          const isActive = currentStage === s.step;

          return (
            <div
              key={s.step}
              className="h-1 rounded-full overflow-hidden bg-white/[0.06] relative"
            >
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isDone
                    ? "w-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"
                    : isActive
                      ? "w-full bg-gradient-to-r from-[#6366F1] to-[#A78BFA] animate-pulse shadow-[0_0_10px_#A78BFA]"
                      : "w-0"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Stage Micro-Labels */}
      <div className="flex items-center justify-between text-[10px] tracking-wider font-mono">
        {STAGES.map((s) => {
          const isActive = currentStage === s.step;
          const isDone = currentStage > s.step;

          return (
            <span
              key={s.step}
              className={`transition-colors duration-300 ${
                isActive
                  ? "text-[#C4B5FD] font-semibold drop-shadow-[0_0_6px_rgba(196,181,253,0.5)]"
                  : isDone
                    ? "text-[#8B5CF6]"
                    : "text-[#55556d]"
              }`}
            >
              0{s.step} {s.label.split(" ")[0]}
            </span>
          );
        })}
      </div>
    </div>
  );
};
