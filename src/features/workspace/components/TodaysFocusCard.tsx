import React from 'react';

export interface TodaysFocusCardProps {
  title?: string | undefined;
  duration?: string | undefined;
  onStartFocus?: (() => void) | undefined;
}

export const TodaysFocusCard: React.FC<TodaysFocusCardProps> = ({
  title = 'Business Meeting',
  duration = '25 min',
  onStartFocus,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0A0818]/90 border border-[#1C1738] hover:border-[#2D2455] backdrop-blur-md transition-all shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between select-none min-h-[140px]">
      {/* Top: Icon + Label + Arrow inline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Target/Focus Icon */}
          <svg className="w-4 h-4 text-[#9F7AEA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs font-light text-[#9E9EB6]">Today's Focus</span>
        </div>

        {/* Circular Arrow Button */}
        <button
          onClick={onStartFocus}
          className="w-9 h-9 rounded-full bg-[#141030] border border-[#332765] hover:border-[#6366F1] text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(112,72,232,0.25)] cursor-pointer active:scale-95"
          aria-label="Start Focus"
        >
          <svg className="w-4 h-4 text-[#A78BFA]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-xl font-normal text-white pt-3">{title}</h3>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-xs text-[#7A7A9E] font-light pt-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{duration}</span>
      </div>
    </div>
  );
};
