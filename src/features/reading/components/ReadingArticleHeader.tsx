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
  selectedVoice?: "en-US-AriaNeural" | "en-US-ChristopherNeural" | undefined;
  onSelectVoice?: ((voice: "en-US-AriaNeural" | "en-US-ChristopherNeural") => void) | undefined;
  onToggleVoice?: (() => void) | undefined;
  onToggleAudio?: (() => void) | undefined;
  onRestartAudio?: (() => void) | undefined;
  onCycleAudioRate?: (() => void) | undefined;
  fontSizeLabel?: string | undefined;
  onCycleFontSize?: (() => void) | undefined;
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
    selectedVoice = "en-US-AriaNeural",
    onSelectVoice,
    onToggleVoice,
    onToggleAudio,
    onRestartAudio,
    onCycleAudioRate,
    fontSizeLabel,
    onCycleFontSize,
  }) => {
    return (
      <div className="w-full flex flex-col items-start text-left space-y-1 sm:space-y-1.5 select-none pt-0.5 sm:pt-2 mb-1 sm:mb-2 shrink-0 transition-all">
        {/* Category, Level & Read Time + Audio Streaming Action */}
        <div className="w-full flex items-center justify-between min-h-[20px]">
          <span className="text-[9.5px] sm:text-[10.5px] font-semibold tracking-[0.18em] sm:tracking-[0.2em] text-[#8264C3] uppercase animate-[fadeSlideUp_0.45s_ease-out_both] block text-left leading-none truncate pr-2">
            {category} {cefrLevel ? `· ${cefrLevel}` : ""} · {readTime}
          </span>

          <div className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0">
            {onCycleFontSize && (
              <button
                type="button"
                onClick={onCycleFontSize}
                title={`Tamaño de texto: ${fontSizeLabel || "Estándar"}. Toca para cambiar`}
                aria-label={`Cambiar tamaño de texto. Actual: ${fontSizeLabel || "Estándar"}`}
                className="inline-flex items-center gap-1 text-[11px] font-sans text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none active:scale-95 select-none"
              >
                <span className="font-mono font-medium tracking-tighter text-[11.5px] sm:text-xs">aA</span>
                <span className="text-[10px] text-white/30 font-light hidden sm:inline">{fontSizeLabel}</span>
              </button>
            )}

            {onCycleFontSize && onToggleAudio && (
              <span className="text-white/20 text-[10px] select-none font-light leading-none">|</span>
            )}

            {onToggleAudio && (
              <ReadingAudioNarratorButton
                isPlaying={isPlayingAudio}
                isPaused={isPausedAudio}
                playbackRate={playbackRate}
                selectedVoice={selectedVoice}
                onSelectVoice={onSelectVoice}
                onToggleVoice={onToggleVoice}
                onTogglePlay={onToggleAudio}
                onRestart={onRestartAudio}
                onCycleRate={onCycleAudioRate ?? (() => {})}
              />
            )}
          </div>
        </div>

        {/* Article Main Title */}
        <h1 className="text-lg sm:text-2xl md:text-[26px] font-sans text-[#f8f8f8] font-normal sm:font-light tracking-tight leading-tight sm:leading-snug animate-[fadeSlideUp_0.5s_ease-out_0.08s_both] text-left">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-[13px] text-[#888999] font-light tracking-normal sm:tracking-wide pt-0 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both] text-left leading-snug sm:leading-relaxed max-w-xl line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>
    );
  },
);

ReadingArticleHeader.displayName = "ReadingArticleHeader";
