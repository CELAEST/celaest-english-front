import React from "react";

export interface WritingAIMentorCardProps {
  statusText?: string;
  isActive?: boolean;
  /** When false the waveform stays static (saves constant repaints) */
  animated?: boolean;
}

export const WritingAIMentorCard: React.FC<WritingAIMentorCardProps> = React.memo(
  ({
    statusText = "You're communicating clearly. I'll review your writing and help you make it even stronger.",
    isActive = true,
    animated = true,
  }) => {
    return (
      <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3 shrink-0 overflow-hidden animate-[slideInRight_0.45s_ease-out_both]">
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Header with Title and Clean Active Status */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            AI Mentor
          </span>
          {isActive && (
            <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">
              Active
            </span>
          )}
        </div>

        {/* Subtitle / Feedback Text */}
        <p className="text-[11px] font-mono text-white/30 leading-relaxed z-10">{statusText}</p>

        {/* Compact Waveform */}
        <div
          className="w-full h-8 flex items-center justify-center gap-[3px] pt-1 z-10"
          aria-hidden="true"
        >
          {Array.from({ length: 45 }).map((_, i) => {
            const h = Math.sin(i * 0.4) * 0.4 + 0.6;
            const px = `${Math.max(3, h * 20)}px`;
            return (
              <span
                key={i}
                className={animated ? "animate-pulse" : ""}
                style={{
                  display: "block",
                  width: "1.5px",
                  height: px,
                  borderRadius: "1px",
                  backgroundColor: animated ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                  animationDuration: `${1.4 + (i % 5) * 0.2}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  },
);

WritingAIMentorCard.displayName = "WritingAIMentorCard";
