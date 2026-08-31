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
    <div className="relative p-5 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-between select-none min-h-[140px] overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Left Column: Metrics & Bars */}
      <div className="flex-1 space-y-4 pr-5 z-10">
        {/* Top: Label */}
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Progress This Week</span>
        </div>

        {/* Speaking Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-white/50">Speaking</span>
            <span className="text-[#34D399]">{speakingChange}</span>
          </div>
          <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-white/60 rounded-full transition-all duration-700"
              style={{ width: `${speakingProgress}%` }}
            />
          </div>
        </div>

        {/* Vocabulary Progress Bar */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-white/50">Vocabulary</span>
          <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full bg-white/40 rounded-full transition-all duration-700"
              style={{ width: `${vocabularyProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Circular Progress Ring */}
      <div className="relative w-20 h-20 flex items-center justify-center shrink-0 z-10">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-white/[0.04]"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-white/70"
            strokeDasharray={`${overallPercentage}, 100`}
            strokeWidth="2.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute text-sm font-light text-white tabular-nums">{overallPercentage}%</span>
      </div>
    </div>
  );
};
