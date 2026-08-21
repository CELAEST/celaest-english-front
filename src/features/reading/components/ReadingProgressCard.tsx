import React from 'react';

export interface ReadingProgressCardProps {
  progressPercentage?: number;
  estimatedMinutesLeft?: number;
  readWords?: number;
  totalWords?: number;
}

export const ReadingProgressCard: React.FC<ReadingProgressCardProps> = ({
  progressPercentage = 25,
  estimatedMinutesLeft = 4,
  readWords = 620,
  totalWords = 2450,
}) => {
  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent transition-all duration-300 hover:from-white/[0.12]">
      <div className="rounded-2xl bg-[#0a0b14] p-4 flex flex-col space-y-3.5 shrink-0">
        {/* Title */}
        <span className="text-[13px] font-medium text-white/90 tracking-wide">Reading progress</span>

        {/* Progress Ring and Stats */}
        <div className="flex items-center space-x-5">
          {/* Circular Progress Ring */}
          <div className="w-20 h-20 relative flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4.5"
                strokeDasharray="263.8"
                strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A27FF3" />
                  <stop offset="100%" stopColor="#7048E8" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-light text-white/90 tracking-wide tabular-nums">
              {progressPercentage}%
            </span>
          </div>

          {/* Stats */}
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/25 font-medium">Est. finish</span>
              <span className="text-sm font-medium text-white/80 tabular-nums">
                {estimatedMinutesLeft} min
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-white/25 font-medium">Words</span>
              <span className="text-sm font-medium text-white/80 tabular-nums">
                {readWords.toLocaleString()} / {totalWords.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
