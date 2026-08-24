import React from 'react';

export interface WritingFocusCardProps {
  focusTarget?: string;
  focusDescription?: string;
}

export const WritingFocusCard: React.FC<WritingFocusCardProps> = React.memo(function WritingFocusCard({
  focusTarget = 'Professional tone',
  focusDescription = 'Maintain a clear, polite and professional tone.',
}) {
  return (
    <div className="bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-3.5 shrink-0 animate-[slideInRight_0.45s_ease-out_0.2s_both]">
      {/* Title */}
      <span className="text-[#f8f8f8] font-medium text-sm sm:text-base tracking-wide">Focus</span>

      {/* Target Pill */}
      <div className="flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-[#181230] border border-[#3A2A6B] text-[#A27FF3] text-xs font-medium w-fit shadow-md hover:bg-[#1f1740] hover:scale-[1.02] transition-all duration-200 cursor-default">
        <svg className="w-4 h-4 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
        <span>{focusTarget}</span>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#8a8a9e] font-light leading-relaxed">
        {focusDescription}
      </p>
    </div>
  );
});
