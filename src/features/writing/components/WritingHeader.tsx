import React from "react";

export const WritingHeader: React.FC = React.memo(function WritingHeader() {
  return (
    <div className="w-full flex items-center justify-center px-6 sm:px-10 pt-4 sm:pt-5 z-20 relative select-none shrink-0 h-16 sm:h-20">
      {/* Center Hero */}
      <div className="flex flex-col items-center justify-center relative mt-4 sm:mt-5 -mb-4 sm:-mb-6 pt-2 animate-[fadeSlideUp_0.5s_ease-out_0.1s_both]">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center transition-all duration-300 pointer-events-none">
          <img
            src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
            alt=""
            className="w-full h-full object-contain scale-110"
          />
        </div>
        <span className="text-xs sm:text-sm text-[#f8f8f8] font-light tracking-wide -mt-2 sm:-mt-3 opacity-95 relative z-10">
          Writing with you
        </span>
      </div>
    </div>
  );
});
