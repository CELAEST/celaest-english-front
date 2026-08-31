import React from "react";

export interface DayBar {
  day: string;
  active: boolean;
}

const DEFAULT_DAYS: DayBar[] = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: true },
  { day: "T", active: true },
  { day: "F", active: true },
  { day: "S", active: false },
  { day: "S", active: false },
];

export interface InterviewStreakCardProps {
  streakDays?: number | undefined;
  days?: DayBar[] | undefined;
}

export const InterviewStreakCard: React.FC<InterviewStreakCardProps> = ({
  streakDays = 5,
  days = DEFAULT_DAYS,
}) => {
  return (
    <div className="relative p-5 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between select-none min-h-[140px] overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Top: Label */}
      <div className="flex items-center gap-2 z-10">
        <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
        </svg>
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Interview Streak</span>
      </div>

      {/* Big Number */}
      <div className="flex items-baseline gap-2 pt-2 z-10">
        <span className="text-3xl font-light text-white tabular-nums">{streakDays}</span>
        <span className="text-sm font-mono text-white/30">days</span>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="flex items-end justify-between gap-2.5 pt-3 z-10">
        {days.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-2 rounded-full transition-all duration-500 ${
                item.active
                  ? "h-7 bg-white/60"
                  : "h-5 bg-white/[0.04]"
              }`}
            />
            <span className="text-[10px] font-mono text-white/25">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
