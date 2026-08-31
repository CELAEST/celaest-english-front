import React from "react";

export interface ReadingAIMentorCardProps {
  statusText?: string;
  isActive?: boolean;
}

const WAVEFORM_BARS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.sin(i * 0.45) * 0.4 + 0.6;
  return {
    height: Math.max(3, h * 16),
    alpha: 0.2 + h * 0.35,
    duration: 1.5 + (i % 4) * 0.3,
  };
});

export const ReadingAIMentorCard: React.FC<ReadingAIMentorCardProps> = React.memo(
  ({
    statusText = "You're reading comfortably. I'll jump in if you need help.",
    isActive = true,
  }) => {
    return (
      <div
        aria-label="AI Mentor status"
        className="relative rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none transition-all duration-300"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <div className="relative z-10 p-5 flex flex-col space-y-3 shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">AI Mentor</span>
            </div>
            {isActive && (
              <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">
                Active
              </span>
            )}
          </div>

          {/* Status Text */}
          <p className="text-[11px] font-mono text-white/30 leading-relaxed">{statusText}</p>

          {/* Minimal Waveform */}
          <div
            aria-hidden="true"
            className="w-full h-6 flex items-end justify-center gap-[2px] pt-1"
          >
            {WAVEFORM_BARS.map((bar, i) => (
              <span
                key={i}
                className="animate-pulse block rounded-full"
                style={{
                  width: "1.5px",
                  height: `${bar.height}px`,
                  backgroundColor: `rgba(255,255,255,${bar.alpha})`,
                  animationDuration: `${bar.duration}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
);

ReadingAIMentorCard.displayName = "ReadingAIMentorCard";
