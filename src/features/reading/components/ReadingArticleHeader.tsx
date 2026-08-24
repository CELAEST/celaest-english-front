import React from "react";

export interface ReadingArticleHeaderProps {
  category?: string;
  readTime?: string;
  title?: string;
  subtitle?: string;
}

export const ReadingArticleHeader: React.FC<ReadingArticleHeaderProps> = React.memo(({
  category = "BUSINESS",
  readTime = "8 MIN READ",
  title = "The Art of Clear Communication",
  subtitle = "Building clarity in a complex world.",
}) => {
  return (
    <div className="w-full max-w-[620px] flex flex-col items-start text-left space-y-1.5 select-none pt-1 sm:pt-2 mb-1.5 sm:mb-2 shrink-0 transition-all">
      {/* Category & Read Time */}
      <span className="text-[10px] font-semibold tracking-[0.22em] text-[#8e65c5] uppercase animate-[fadeSlideUp_0.45s_ease-out_both] block text-left">
        {category} · {readTime}
      </span>

      {/* Article Main Title */}
      <h1 className="text-xl sm:text-2xl md:text-[26px] font-sans text-[#f8f8f8] font-light tracking-tight leading-snug animate-[fadeSlideUp_0.5s_ease-out_0.08s_both] text-left">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs sm:text-[13px] text-[#888999] font-light tracking-wide pt-0 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both] text-left leading-relaxed max-w-xl line-clamp-2">
          {subtitle}
        </p>
      )}
    </div>
  );
});

ReadingArticleHeader.displayName = "ReadingArticleHeader";
