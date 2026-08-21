import React from 'react';

export interface DayBar {
  day: string;
  active: boolean;
}

const DEFAULT_DAYS: DayBar[] = [
  { day: 'M', active: true },
  { day: 'T', active: true },
  { day: 'W', active: true },
  { day: 'T', active: true },
  { day: 'F', active: true },
  { day: 'S', active: false },
  { day: 'S', active: false },
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
    <div className="p-5 rounded-2xl bg-[#0A0818]/90 border border-[#1C1738] hover:border-[#2D2455] backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between select-none min-h-[140px]">
      {/* Top: Icon + Label */}
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
        </svg>
        <span className="text-xs font-light text-[#9E9EB6]">Interview Streak</span>
      </div>

      {/* Big Number */}
      <div className="flex items-baseline gap-2 pt-2">
        <span className="text-3xl font-light text-white">{streakDays}</span>
        <span className="text-sm font-light text-[#7A7A9E]">days</span>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="flex items-end justify-between gap-2.5 pt-3">
        {days.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div
              className={`w-2.5 rounded-full transition-all ${
                item.active
                  ? 'h-7 bg-gradient-to-t from-[#6366F1] to-[#9F7AEA] shadow-[0_0_8px_rgba(159,122,234,0.5)]'
                  : 'h-5 bg-[#15122B]'
              }`}
            />
            <span className="text-[10px] font-light text-[#6A6A8C]">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
