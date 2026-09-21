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
      <header className="w-full flex flex-col items-center justify-center pt-1 sm:pt-1.5 pb-0.5 z-10 relative select-none shrink-0 animate-[fadeIn_0.5s_ease-out_both]">
        {/* Video Orb — loop infinito, armónico y equilibrado en mobile (progresión lineal perfecta: 112px -> 128px sm) */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 flex items-center justify-center shrink-0 pointer-events-none transition-all duration-300 z-10 rounded-full overflow-hidden">
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
