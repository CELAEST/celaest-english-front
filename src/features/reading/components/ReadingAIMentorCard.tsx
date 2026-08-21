import React from 'react';

export interface ReadingAIMentorCardProps {
  statusText?: string;
  isActive?: boolean;
}

export const ReadingAIMentorCard: React.FC<ReadingAIMentorCardProps> = ({
  statusText = "You're reading comfortably. I'll jump in if you need help.",
  isActive = true,
}) => {
  return (
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.08] to-transparent transition-all duration-300 hover:from-white/[0.12]">
      <div className="rounded-2xl bg-[#0a0b14] p-4 flex flex-col space-y-3 shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.6)]" />
            <span className="text-[13px] font-medium text-white/90 tracking-wide">AI Mentor</span>
          </div>
          {isActive && (
            <span className="text-[10px] tracking-wider uppercase font-medium text-emerald-400/80">
              Active
            </span>
          )}
        </div>

        {/* Status Text */}
        <p className="text-[12px] text-white/40 font-light leading-[1.6]">
          {statusText}
        </p>

        {/* Minimal Waveform */}
        <div className="w-full h-6 flex items-end justify-center gap-[2px] pt-1">
          {Array.from({ length: 32 }).map((_, i) => {
            const h = Math.sin(i * 0.45) * 0.4 + 0.6;
            return (
              <span
                key={i}
                className="animate-pulse block rounded-full"
                style={{
                  width: '1.5px',
                  height: `${Math.max(3, h * 16)}px`,
                  backgroundColor: `rgba(162,127,243,${0.3 + h * 0.4})`,
                  animationDuration: `${1.5 + (i % 4) * 0.3}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
