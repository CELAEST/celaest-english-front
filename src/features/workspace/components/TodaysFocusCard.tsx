import React from "react";

export interface TodaysFocusCardProps {
  title?: string | undefined;
  duration?: string | undefined;
  onStartFocus?: (() => void) | undefined;
}

export const TodaysFocusCard: React.FC<TodaysFocusCardProps> = ({
  title = "Business Meeting",
  duration = "25 min",
  onStartFocus,
}) => {
  return (
    <div className="relative p-5 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between select-none min-h-[140px] overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Top: Label + Arrow inline */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 text-[#A27FF3]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Today's Focus</span>
        </div>

        {/* Circular Arrow Button */}
        <button
          onClick={onStartFocus}
          className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
          aria-label="Start Focus"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="text-xl font-light text-white pt-3 z-10">{title}</h3>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/30 pt-2 z-10">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{duration}</span>
      </div>
    </div>
  );
};
