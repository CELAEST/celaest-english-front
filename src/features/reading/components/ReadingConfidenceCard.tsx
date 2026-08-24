import React from 'react';

export interface ReadingConfidenceCardProps {
  confidenceLevel?: string;
  confidenceDescription?: string;
}

export const ReadingConfidenceCard: React.FC<ReadingConfidenceCardProps> = React.memo(({
  confidenceLevel = 'High',
  confidenceDescription = "You're understanding complex ideas well.",
}) => {
  return (
    <div
      aria-label="Your reading confidence"
      className="relative rounded-[24px] bg-[#0c0c1c]/65 backdrop-blur-2xl border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(162,127,243,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden select-none transition-all duration-300 hover:border-white/[0.08]"
    >
      {/* Ambient subtle glow lights */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#A27FF3] opacity-[0.12] blur-[36px]" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#bd9ad4] opacity-[0.08] blur-[28px]" />
      </div>

      <div className="relative z-10 p-5 flex flex-col space-y-3 shrink-0">
        {/* Title */}
        <span className="text-[13px] font-semibold text-white tracking-tight">Your confidence</span>

        {/* Confidence Level */}
        <div className="flex items-center space-x-2.5">
          {/* Minimal Bar Chart */}
          <div
            aria-hidden="true"
            className="flex items-end space-x-[3px] h-4"
          >
            <div className="w-[3px] h-2 rounded-full bg-[#A27FF3]/60" />
            <div className="w-[3px] h-3 rounded-full bg-[#A27FF3]/80" />
            <div className="w-[3px] h-4 rounded-full bg-[#A27FF3]" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">{confidenceLevel}</span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-[#8e90a5] font-light leading-[1.6]">
          {confidenceDescription}
        </p>
      </div>
    </div>
  );
});

ReadingConfidenceCard.displayName = "ReadingConfidenceCard";
