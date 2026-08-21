import React from "react";

export interface ReadingArticleHeaderProps {
  category?: string;
  readTime?: string;
  title?: string;
  subtitle?: string;
}

export const ReadingArticleHeader: React.FC<ReadingArticleHeaderProps> = ({
  category = "BUSINESS",
  readTime = "8 MIN READ",
  title = "The Art of Clear Communication",
  subtitle = "Building clarity in a complex world.",
}) => {
  return (
    <div className="w-full max-w-[620px] flex flex-col items-start text-left space-y-1.5 sm:space-y-2 select-none pt-2 sm:pt-3 mb-2 sm:mb-3 shrink-0 transition-all">
      {/* Category & Read Time Subtitle */}
      <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-[#8e65c5] uppercase animate-[fadeSlideUp_0.45s_ease-out_both] block text-left">
        {category} · {readTime}
      </span>

      {/* Article Main Title */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-sans text-[#f8f8f8] font-light tracking-normal leading-snug animate-[fadeSlideUp_0.5s_ease-out_0.08s_both] text-left">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-[#999a9b] font-light tracking-wide pt-0.5 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both] text-left leading-relaxed max-w-xl">
        {subtitle}
      </p>
    </div>
  );
};
