import React from 'react';

export interface ReadingConfidenceCardProps {
  confidenceLevel?: string;
  confidenceDescription?: string;
}

export const ReadingConfidenceCard: React.FC<ReadingConfidenceCardProps> = ({
  confidenceLevel = 'High',
  confidenceDescription = "You're understanding complex ideas well.",
}) => {
  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent transition-all duration-300 hover:from-white/[0.12]">
      <div className="rounded-2xl bg-[#0a0b14] p-4 flex flex-col space-y-3 shrink-0">
        {/* Title */}
        <span className="text-[13px] font-medium text-white/90 tracking-wide">Your confidence</span>

        {/* Confidence Level */}
        <div className="flex items-center space-x-2.5">
          {/* Minimal Bar Chart */}
          <div className="flex items-end space-x-[3px] h-4">
            <div className="w-[3px] h-2 rounded-full bg-[#A27FF3]/60" />
            <div className="w-[3px] h-3 rounded-full bg-[#A27FF3]/80" />
            <div className="w-[3px] h-4 rounded-full bg-[#A27FF3]" />
          </div>
          <span className="text-lg font-medium text-white/90">{confidenceLevel}</span>
        </div>

        {/* Description */}
        <p className="text-[12px] text-white/40 font-light leading-[1.6]">
          {confidenceDescription}
        </p>
      </div>
    </div>
  );
};
