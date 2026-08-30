import React, { useId } from "react";

export interface ReadingProgressCardProps {
  progressPercentage?: number;
  estimatedMinutesLeft?: number;
  readWords?: number;
  totalWords?: number;
}

export const ReadingProgressCard: React.FC<ReadingProgressCardProps> = React.memo(
  ({ progressPercentage = 25, estimatedMinutesLeft = 4, readWords = 620, totalWords = 2450 }) => {
    const baseId = useId();
    const gradientId = `progressGradientCard-${baseId}`;

    return (
      <div
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        className="relative rounded-[24px] bg-[#0c0c1c]/65 backdrop-blur-2xl border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(162,127,243,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden select-none transition-all duration-300 hover:border-white/[0.08]"
      >
        {/* Ambient subtle glow lights */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#A27FF3] opacity-[0.12] blur-[36px]" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#bd9ad4] opacity-[0.08] blur-[28px]" />
        </div>

        <div className="relative z-10 p-5 flex flex-col space-y-3.5 shrink-0">
          {/* Title */}
          <span className="text-[13px] font-semibold text-white tracking-tight">
            Reading progress
          </span>

          {/* Progress Ring and Stats */}
          <div className="flex items-center space-x-5">
            {/* Circular Progress Ring */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="4.5"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C4B5FD" />
                    <stop offset="100%" stopColor="#7048E8" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-lg font-light text-white tracking-tight tabular-nums">
                {progressPercentage}%
              </span>
            </div>

            {/* Stats */}
            <div className="flex flex-col space-y-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#7e8096] font-medium">
                  Est. finish
                </span>
                <span className="text-sm font-medium text-white/90 tabular-nums">
                  {estimatedMinutesLeft} min
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#7e8096] font-medium">
                  Words
                </span>
                <span className="text-sm font-medium text-white/90 tabular-nums">
                  {readWords.toLocaleString()} / {totalWords.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ReadingProgressCard.displayName = "ReadingProgressCard";
