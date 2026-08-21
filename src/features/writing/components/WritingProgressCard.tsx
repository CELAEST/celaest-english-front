import React from 'react';

export interface WritingProgressCardProps {
  progressPercentage?: number;
  wordCount?: number;
  maxWords?: number;
  timeSpentMinutes?: number;
}

export const WritingProgressCard: React.FC<WritingProgressCardProps> = ({
  progressPercentage = 65,
  wordCount = 142,
  maxWords = 220,
  timeSpentMinutes = 7,
}) => {
  return (
    <div className="bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-4 shrink-0 animate-[slideInRight_0.45s_ease-out_0.1s_both]">
      {/* Title */}
      <span className="text-[#f8f8f8] font-medium text-sm sm:text-base tracking-wide">Writing progress</span>

      {/* Progress Ring and Stats Grid */}
      <div className="flex items-center space-x-6">
        {/* Circular Progress Ring 65% */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 p-1" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#111220"
              strokeWidth="5"
            />
            {/* Active Progress Stroke in #A27FF3 */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#A27FF3"
              strokeWidth="5.5"
              strokeDasharray="263.8"
              strokeDashoffset={263.8 - (263.8 * progressPercentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute text-xl sm:text-2xl font-light text-[#f8f8f8] tracking-wide">
            {progressPercentage}%
          </span>
        </div>

        {/* Stats Column */}
        <div className="flex flex-col space-y-3">
          {/* Words Stat */}
          <div className="flex flex-col">
            <span className="text-xs text-[#8a8a9e] font-light">Words</span>
            <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
              {wordCount} / {maxWords}
            </span>
          </div>

          {/* Time Stat */}
          <div className="flex flex-col">
            <span className="text-xs text-[#8a8a9e] font-light">Time</span>
            <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
              {timeSpentMinutes} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
