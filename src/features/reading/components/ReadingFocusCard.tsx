import React from 'react';

export interface ReadingFocusCardProps {
  focusTarget?: string;
  focusDescription?: string;
}

export const ReadingFocusCard: React.FC<ReadingFocusCardProps> = ({
  focusTarget = 'Phrasal verbs',
  focusDescription = "I'll highlight useful phrasal verbs as you read.",
}) => {
  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent transition-all duration-300 hover:from-white/[0.12]">
      <div className="rounded-2xl bg-[#0a0b14] p-4 flex flex-col space-y-3 shrink-0">
        {/* Title */}
        <span className="text-[13px] font-medium text-white/90 tracking-wide">Today's focus</span>

        {/* Target Pill */}
        <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#A27FF3]/[0.08] border border-[#A27FF3]/[0.15] text-[#c4b5fd] text-xs font-medium w-fit transition-all duration-200 cursor-default hover:bg-[#A27FF3]/[0.12] hover:border-[#A27FF3]/[0.25]">
          <svg className="w-3.5 h-3.5 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
          <span>{focusTarget}</span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-white/40 font-light leading-[1.6]">
          {focusDescription}
        </p>
      </div>
    </div>
  );
};
