import React from 'react';

export interface ReadingHeaderProps {
  hideCenterOrb?: boolean;
}

export const ReadingHeader: React.FC<ReadingHeaderProps> = ({
  hideCenterOrb = false,
}) => {
  if (hideCenterOrb) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center pt-2 sm:pt-3 pb-1 z-10 relative select-none shrink-0 animate-[fadeIn_0.5s_ease-out_both]">
      {/* Cosmic Orb — Exact same dimensions as WritingHeader */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300">
        <img 
          src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png" 
          alt="Glowing Purple Orb" 
          className="w-full h-full object-contain pointer-events-none scale-110"
        />
      </div>
      <span className="text-xs sm:text-sm text-[#f8f8f8] font-light tracking-wide -mt-2 sm:-mt-3 opacity-95 relative z-10">
        Reading with you
      </span>
    </div>
  );
};
