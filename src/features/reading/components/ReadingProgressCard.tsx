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
        className="relative rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none transition-all duration-300"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative z-10 p-5 flex flex-col space-y-3.5 shrink-0">
          {/* Title */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Reading Progress
          </span>

          {/* Progress Ring and Stats */}
          <div className="flex items-center space-x-5">
            {/* Circular Progress Ring */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="3.5"
                  strokeDasharray="263.8"
                  strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
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
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                  Est. finish
                </span>
                <span className="text-sm font-light text-white tabular-nums">
                  {estimatedMinutesLeft} min
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                  Words
                </span>
                <span className="text-sm font-light text-white tabular-nums">
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
