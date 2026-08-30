import React from "react";

export interface WeeklyProgressCardProps {
  speakingProgress?: number | undefined;
  speakingChange?: string | undefined;
  vocabularyProgress?: number | undefined;
  overallPercentage?: number | undefined;
}

export const WeeklyProgressCard: React.FC<WeeklyProgressCardProps> = ({
  speakingProgress = 75,
  speakingChange = "+14%",
  vocabularyProgress = 65,
  overallPercentage = 82,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0A0818]/90 border border-[#1C1738] hover:border-[#2D2455] backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex items-center justify-between select-none min-h-[140px]">
      {/* Left Column: Metrics & Bars */}
      <div className="flex-1 space-y-4 pr-5">
        {/* Top: Icon + Label */}
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#8B5CF6]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
            />
          </svg>
          <span className="text-xs font-light text-[#9E9EB6]">Progress This Week</span>
        </div>

        {/* Speaking Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-light text-[#C8C8E0]">Speaking</span>
            <span className="font-medium text-[#10B981]">{speakingChange}</span>
          </div>
          <div className="h-1.5 w-full bg-[#15122B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#9F7AEA] rounded-full transition-all"
              style={{ width: `${speakingProgress}%` }}
            />
          </div>
        </div>

        {/* Vocabulary Progress Bar */}
        <div className="space-y-1.5">
          <span className="text-xs font-light text-[#C8C8E0]">Vocabulary</span>
          <div className="h-1.5 w-full bg-[#15122B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] rounded-full transition-all"
              style={{ width: `${vocabularyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Circular Progress Ring (82%) */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle track */}
          <path
            className="text-[#15122B]"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Foreground purple glowing progress ring */}
          <path
            className="text-[#8B5CF6]"
            strokeDasharray={`${overallPercentage}, 100`}
            strokeWidth="3"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            style={{ filter: "drop-shadow(0px 0px 6px rgba(139, 92, 246, 0.8))" }}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute text-sm font-normal text-white">{overallPercentage}%</span>
      </div>
    </div>
  );
};
