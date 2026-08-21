import React from 'react';

export interface WritingHeaderProps {
  onBack?: (() => void) | undefined;
  onEndSession?: (() => void) | undefined;
}

export const WritingHeader: React.FC<WritingHeaderProps> = ({
  onBack,
  onEndSession,
}) => {
  return (
    <div className="w-full flex items-center justify-between px-6 sm:px-10 pt-4 sm:pt-5 z-20 relative select-none shrink-0 h-16 sm:h-20">
      {/* Left: Back Arrow Button */}
      <button
        onClick={onBack}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#05060c] border border-[#111220] flex items-center justify-center text-[#f8f8f8] hover:bg-[#111220] hover:border-[#231956] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg animate-[fadeSlideUp_0.45s_ease-out_both]"
      >
        <svg className="w-5 h-5 text-[#f8f8f8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Center Hero: Lowered slightly more for spacious top margin */}
      <div className="flex flex-col items-center justify-center relative mt-4 sm:mt-5 -mb-4 sm:-mb-6 pt-2 animate-[fadeSlideUp_0.5s_ease-out_0.1s_both]">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center transition-all duration-300 pointer-events-none">
          <img 
            src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png" 
            alt="Glowing Purple Orb" 
            className="w-full h-full object-contain scale-110"
          />
        </div>
        <span className="text-xs sm:text-sm text-[#f8f8f8] font-light tracking-wide -mt-2 sm:-mt-3 opacity-95 relative z-10">
          Writing with you
        </span>
      </div>

      {/* Right: End writing session Button */}
      <button
        onClick={onEndSession}
        className="flex items-center space-x-3 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-[#05060c] border border-[#111220] hover:bg-[#111220] hover:border-[#231956] hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer group shadow-lg animate-[fadeSlideUp_0.45s_ease-out_0.2s_both]"
      >
        <span className="text-xs sm:text-sm font-light text-[#f8f8f8] tracking-wide">End writing session</span>
        <svg className="w-4 h-3 sm:w-5 sm:h-3.5 text-[#de5252] group-hover:scale-110 transition-transform" viewBox="0 0 24 16" fill="currentColor">
          <path d="M12 2C8.2 2 4.7 3.4 2 5.8c-.5.4-.7 1.1-.4 1.7l1.2 2.1c.3.5.9.7 1.5.5l2.6-.9c.4-.1.7-.5.7-.9V6.1c1.3-.4 2.8-.6 4.4-.6s3.1.2 4.4.6v2.3c0 .4.3.8.7.9l2.6.9c.6.2 1.2 0 1.5-.5l1.2-2.1c.3-.6.1-1.3-.4-1.7C19.3 3.4 15.8 2 12 2z" />
        </svg>
      </button>
    </div>
  );
};
