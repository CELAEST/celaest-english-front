import React from 'react';

export interface WritingAIMentorCardProps {
  statusText?: string;
  isActive?: boolean;
}

export const WritingAIMentorCard: React.FC<WritingAIMentorCardProps> = ({
  statusText = "You're communicating clearly. I'll review your writing and help you make it even stronger.",
  isActive = true,
}) => {
  return (
    <div className="bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-3 shrink-0 animate-[slideInRight_0.45s_ease-out_both]">
      {/* Header with Title and Clean Active Status */}
      <div className="flex items-center justify-between">
        <span className="text-[#f8f8f8] font-medium text-sm sm:text-base tracking-wide">AI Mentor</span>
        {isActive && (
          <span className="text-[11px] tracking-wider uppercase font-semibold text-[#4ade80] filter drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
            Active
          </span>
        )}
      </div>

      {/* Subtitle / Feedback Text */}
      <p className="text-xs sm:text-sm text-[#8a8a9e] font-light leading-relaxed">
        {statusText}
      </p>

      {/* Compact Purple Equalizer Waveform Animation */}
      <div className="w-full h-8 flex items-center justify-center gap-[3px] pt-1">
        {Array.from({ length: 45 }).map((_, i) => {
          const h = Math.sin(i * 0.4) * 0.4 + 0.6;
          const px = `${Math.max(3, h * 20)}px`;
          return (
            <span
              key={i}
              className="animate-pulse"
              style={{
                display: 'block',
                width: '1.5px',
                height: px,
                borderRadius: '1px',
                backgroundColor: 'rgba(162,127,243,0.7)',
                boxShadow: '0 0 6px rgba(162,127,243,0.5)',
                animationDuration: `${1.2 + (i % 5) * 0.2}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
