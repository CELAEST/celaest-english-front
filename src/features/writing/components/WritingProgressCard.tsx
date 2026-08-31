import React from "react";

export interface WritingProgressCardProps {
  progressPercentage?: number;
  wordCount?: number;
  maxWords?: number;
  timeSpentMinutes?: number;
}

export const WritingProgressCard: React.FC<WritingProgressCardProps> = ({
  progressPercentage = 0,
  wordCount = 0,
  maxWords = 220,
  timeSpentMinutes,
}) => {
  return (
    <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-4 shrink-0 overflow-hidden animate-[slideInRight_0.45s_ease-out_0.1s_both]">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Title */}
      <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 z-10">
        Writing Progress
      </span>

      {/* Progress Ring and Stats Grid */}
      <div className="flex items-center space-x-6 z-10">
        {/* Circular Progress Ring */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
            {/* Active Progress Stroke */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="4"
              strokeDasharray="263.8"
              strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute text-xl sm:text-2xl font-light text-white tracking-wide tabular-nums">
            {progressPercentage}%
          </span>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col space-y-3">
          {/* Words Stat */}
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Words</span>
            <span className="text-sm font-light text-white tabular-nums">
              {wordCount} / {maxWords}
            </span>
          </div>

          {/* Time Stat */}
          {typeof timeSpentMinutes === "number" && (
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">Time</span>
              <span className="text-sm font-light text-white tabular-nums">
                {timeSpentMinutes} min
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
