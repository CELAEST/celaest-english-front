import React from "react";

export interface ReadingConfidenceCardProps {
  confidenceLevel?: string;
  confidenceDescription?: string;
}

export const ReadingConfidenceCard: React.FC<ReadingConfidenceCardProps> = React.memo(
  ({
    confidenceLevel = "High",
    confidenceDescription = "You're understanding complex ideas well.",
  }) => {
    return (
      <div
        aria-label="Your reading confidence"
        className="relative rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none transition-all duration-300"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="relative z-10 p-5 flex flex-col space-y-3 shrink-0">
          {/* Title */}
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Your Confidence
          </span>

          {/* Confidence Level */}
          <div className="flex items-center space-x-2.5">
            {/* Minimal Bar Chart */}
            <div aria-hidden="true" className="flex items-end space-x-[3px] h-4">
              <div className="w-[3px] h-2 rounded-full bg-white/30" />
              <div className="w-[3px] h-3 rounded-full bg-white/50" />
              <div className="w-[3px] h-4 rounded-full bg-white/70" />
            </div>
            <span className="text-base font-light text-white tracking-tight">
              {confidenceLevel}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] font-mono text-white/30 leading-relaxed">
            {confidenceDescription}
          </p>
        </div>
      </div>
    );
  },
);

ReadingConfidenceCard.displayName = "ReadingConfidenceCard";
