import React from 'react';

export interface ReadingHeaderProps {
  hideCenterOrb?: boolean;
}

export const ReadingHeader: React.FC<ReadingHeaderProps> = React.memo(({
  hideCenterOrb = false,
}) => {
  if (hideCenterOrb) return null;

  return (
    <header className="w-full flex flex-col items-center justify-center pt-1.5 pb-0.5 z-10 relative select-none shrink-0 animate-[fadeIn_0.5s_ease-out_both]">
      {/* Dynamic Adaptive Cosmic Orb — Clean native asset rendering, zero artificial drop-shadows */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300 z-10">
        <img
          src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
          alt="Glowing Purple Orb"
          aria-hidden="true"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>

      <span className="text-[11px] sm:text-xs text-[#f8f8f8] font-light tracking-widest mt-1 opacity-75 relative z-10 uppercase">
        Reading with you
      </span>
    </header>
  );
});

ReadingHeader.displayName = "ReadingHeader";
