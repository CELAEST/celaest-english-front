import React from "react";

export interface MemoryHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: (() => void) | undefined;
}

export const MemoryHeader: React.FC<MemoryHeaderProps> = ({
  title = "Turn mistakes into mastery.",
  subtitle = "Review, understand and remember.",
}) => {
  return (
    <header className="relative w-full max-w-[min(100%,36rem)] select-none shrink-0 pr-24 sm:pr-0 pt-3.5 sm:pt-4 lg:pt-5 mb-2 sm:mb-3">
      <div className="relative z-10 flex flex-col space-y-1.5 sm:space-y-2">
        {/* Category Tag */}
        <span className="text-[10.5px] sm:text-[11px] font-sans font-bold tracking-[0.22em] text-[#8264C3] uppercase animate-[fadeSlideUp_0.45s_ease-out_both]">
          YOUR MEMORY
        </span>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[34px] font-sans text-[#f8f8f8] font-light tracking-wide leading-tight animate-[fadeSlideUp_0.5s_ease-out_0.08s_both]">
          {title.includes("mastery.") ? (
            <>
              {title.replace("mastery.", "")}
              <span className="text-[#A27FF3] font-light">mastery.</span>
            </>
          ) : (
            title
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[#999a9b] font-light tracking-wide pt-0.5 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both]">
          {subtitle}
        </p>
      </div>
    </header>
  );
};
