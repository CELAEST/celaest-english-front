import React from "react";

export interface ReadingFocusCardProps {
  focusTarget?: string;
  focusDescription?: string;
}

export const ReadingFocusCard: React.FC<ReadingFocusCardProps> = React.memo(
  function ReadingFocusCard({
    focusTarget = "Phrasal verbs",
    focusDescription = "I'll highlight useful phrasal verbs as you read.",
  }) {
    return (
      <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3.5 shrink-0 overflow-hidden animate-[slideInRight_0.45s_ease-out_0.2s_both]">
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Title */}
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 z-10">Today's Focus</span>

        {/* Target Pill */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/60 text-xs font-mono w-fit transition-all duration-200 cursor-default hover:border-white/[0.15] z-10">
          <svg
            className="w-3.5 h-3.5 text-white/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="6" r="6" />
            <circle cx="12" cy="2" r="2" />
          </svg>
          <span>{focusTarget}</span>
        </div>

        {/* Description */}
        <p className="text-[11px] font-mono text-white/30 leading-relaxed z-10">{focusDescription}</p>
      </div>
    );
  },
);

ReadingFocusCard.displayName = "ReadingFocusCard";
