import React from 'react';

export interface ReadingAIMentorCardProps {
  statusText?: string;
  isActive?: boolean;
}

const WAVEFORM_BARS = Array.from({ length: 32 }, (_, i) => {
  const h = Math.sin(i * 0.45) * 0.4 + 0.6;
  return {
    height: Math.max(3, h * 16),
    alpha: 0.35 + h * 0.45,
    duration: 1.5 + (i % 4) * 0.3,
  };
});

export const ReadingAIMentorCard: React.FC<ReadingAIMentorCardProps> = React.memo(({
  statusText = "You're reading comfortably. I'll jump in if you need help.",
  isActive = true,
}) => {
  return (
    <div
      aria-label="AI Mentor status"
      className="relative rounded-[24px] bg-[#0c0c1c]/65 backdrop-blur-2xl border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(162,127,243,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden select-none transition-all duration-300 hover:border-white/[0.08]"
    >
      {/* Ambient subtle glow lights */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-[#A27FF3] opacity-[0.12] blur-[36px]" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#bd9ad4] opacity-[0.08] blur-[28px]" />
      </div>

      <div className="relative z-10 p-5 flex flex-col space-y-3 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_8px_rgba(162,127,243,0.8)]" />
            <span className="text-[13px] font-semibold text-white tracking-tight">AI Mentor</span>
          </div>
          {isActive && (
            <span className="text-[10px] tracking-wider uppercase font-semibold text-emerald-400">
              Active
            </span>
          )}
        </div>

        {/* Status Text */}
        <p className="text-[12px] text-[#8e90a5] font-light leading-[1.6]">
          {statusText}
        </p>

        {/* Minimal Precomputed Waveform */}
        <div
          aria-hidden="true"
          className="w-full h-6 flex items-end justify-center gap-[2px] pt-1"
        >
          {WAVEFORM_BARS.map((bar, i) => (
            <span
              key={i}
              className="animate-pulse block rounded-full"
              style={{
                width: '1.5px',
                height: `${bar.height}px`,
                backgroundColor: `rgba(162,127,243,${bar.alpha})`,
                animationDuration: `${bar.duration}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

ReadingAIMentorCard.displayName = "ReadingAIMentorCard";
