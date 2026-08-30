import React from "react";

export interface ReadingFocusCardProps {
  focusTarget?: string;
  focusDescription?: string;
}

export const ReadingFocusCard: React.FC<ReadingFocusCardProps> = React.memo(
  ({
    focusTarget = "Phrasal verbs",
    focusDescription = "I'll highlight useful phrasal verbs as you read.",
  }) => {
    return (
      <div
        aria-label="Today's focus"
        className="relative rounded-[24px] bg-[#0c0c1c]/65 backdrop-blur-2xl border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(162,127,243,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden select-none transition-all duration-300 hover:border-white/[0.08]"
      >
        {/* Ambient subtle glow lights */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#A27FF3] opacity-[0.12] blur-[36px]" />
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#bd9ad4] opacity-[0.08] blur-[28px]" />
        </div>

        <div className="relative z-10 p-5 flex flex-col space-y-3 shrink-0">
          {/* Title */}
          <span className="text-[13px] font-semibold text-white tracking-tight">Today's focus</span>

          {/* Target Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#A27FF3]/[0.12] border border-[#A27FF3]/[0.22] text-[#d4bffd] text-xs font-medium w-fit transition-all duration-200 cursor-default hover:bg-[#A27FF3]/[0.18]">
            <svg
              className="w-3.5 h-3.5 text-[#C4B5FD]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span>{focusTarget}</span>
          </div>

          {/* Description */}
          <p className="text-[12px] text-[#8e90a5] font-light leading-[1.6]">{focusDescription}</p>
        </div>
      </div>
    );
  },
);

ReadingFocusCard.displayName = "ReadingFocusCard";
