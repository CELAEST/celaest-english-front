import React from "react";
import { ReadingAudioNarratorButton } from "./ReadingAudioNarratorButton";

export interface ReadingArticleHeaderProps {
  category?: string | undefined;
  cefrLevel?: string | undefined;
  readTime?: string | undefined;
  title?: string | undefined;
  subtitle?: string | undefined;
  isPlayingAudio?: boolean | undefined;
  isPausedAudio?: boolean | undefined;
  playbackRate?: number | undefined;
  onToggleAudio?: (() => void) | undefined;
  onCycleAudioRate?: (() => void) | undefined;
}

export const ReadingArticleHeader: React.FC<ReadingArticleHeaderProps> = React.memo(
  ({
    category = "BUSINESS",
    cefrLevel,
    readTime = "8 MIN READ",
    title = "The Art of Clear Communication",
    subtitle = "Building clarity in a complex world.",
    isPlayingAudio = false,
    isPausedAudio = false,
    playbackRate = 1.0,
    onToggleAudio,
    onCycleAudioRate,
  }) => {
    return (
      <div className="w-full max-w-[620px] flex flex-col items-start text-left space-y-1.5 select-none pt-1 sm:pt-2 mb-1.5 sm:mb-2 shrink-0 transition-all">
        {/* Category, Level & Read Time + Audio Streaming Action (Centerline Aligned) */}
        <div className="w-full flex items-center justify-between min-h-[20px]">
          <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.2em] text-[#A27FF3]/90 uppercase animate-[fadeSlideUp_0.45s_ease-out_both] block text-left leading-none">
            {category} {cefrLevel ? `· ${cefrLevel}` : ""} · {readTime}
          </span>

          {onToggleAudio && (
            <ReadingAudioNarratorButton
              isPlaying={isPlayingAudio}
              isPaused={isPausedAudio}
              playbackRate={playbackRate}
              onTogglePlay={onToggleAudio}
              onCycleRate={onCycleAudioRate ?? (() => {})}
            />
          )}
        </div>

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
  },
);

ReadingArticleHeader.displayName = "ReadingArticleHeader";
