import React from "react";
import { VideoOrb } from "../../../design-system/components/Orb/VideoOrb";

export interface ReadingHeaderProps {
  hideCenterOrb?: boolean;
  isActive?: boolean;
}

export const ReadingHeader: React.FC<ReadingHeaderProps> = React.memo(
  ({ hideCenterOrb = false, isActive = true }) => {
    if (hideCenterOrb) return null;

    return (
      <header className="w-full flex flex-col items-center justify-center pt-0.5 sm:pt-1 pb-0 z-10 relative select-none shrink-0 animate-[fadeIn_0.5s_ease-out_both]">
        {/* Video Orb — loop infinito, armónico y equilibrado */}
        <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300 z-10 rounded-full overflow-hidden">
          <VideoOrb isActive={isActive} className="w-full h-full object-contain pointer-events-none" />
        </div>

        <span className="text-[10.5px] sm:text-xs text-[#f8f8f8] font-light tracking-widest mt-1 opacity-75 relative z-10 uppercase">
          Reading with you
        </span>
      </header>
    );
  },
);

ReadingHeader.displayName = "ReadingHeader";
