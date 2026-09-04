import React from "react";

export interface ReadingAudioNarratorButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  playbackRate: number;
  selectedVoice?: "en-US-AriaNeural" | "en-US-ChristopherNeural" | undefined;
  onSelectVoice?: ((voice: "en-US-AriaNeural" | "en-US-ChristopherNeural") => void) | undefined;
  onToggleVoice?: (() => void) | undefined;
  onTogglePlay: () => void;
  onRestart?: (() => void) | undefined;
  onCycleRate: () => void;
}

export const ReadingAudioNarratorButton: React.FC<ReadingAudioNarratorButtonProps> = React.memo(
  ({
    isPlaying,
    isPaused,
    playbackRate,
    selectedVoice = "en-US-AriaNeural",
    onSelectVoice,
    onToggleVoice,
    onTogglePlay,
    onRestart,
    onCycleRate,
  }) => {
    const isAria = selectedVoice === "en-US-AriaNeural";

    const handleSelectAria = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectVoice) onSelectVoice("en-US-AriaNeural");
      else if (onToggleVoice && !isAria) onToggleVoice();
    };

    const handleSelectChris = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectVoice) onSelectVoice("en-US-ChristopherNeural");
      else if (onToggleVoice && isAria) onToggleVoice();
    };

    return (
      <div className="inline-flex items-center gap-2 select-none shrink-0 leading-none">
        {/* Dual Mentor Switcher (Pure Typography & Clean Micro Sparks) */}
        <div className="inline-flex items-center gap-1.5 leading-none">
          {/* Aria Spark */}
          <button
            type="button"
            onClick={handleSelectAria}
            title="Seleccionar a Aria (Mentor Femenino)"
            aria-label="Select Aria mentor voice"
            className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
              isAria
                ? "text-[#C4B5FD] font-semibold drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]"
                : "text-white/35 hover:text-white/70 font-normal"
            }`}
          >
            <svg
              width={9}
              height={9}
              viewBox="0 0 24 24"
              fill={isAria ? "#C4B5FD" : "currentColor"}
              className={`shrink-0 ${isAria ? "animate-pulse" : "opacity-30"}`}
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span>Aria</span>
          </button>

          <span className="text-white/20 text-[10px] select-none font-light leading-none">|</span>

          {/* Chris Spark */}
          <button
            type="button"
            onClick={handleSelectChris}
            title="Seleccionar a Christopher (Mentor Ejecutivo)"
            aria-label="Select Christopher mentor voice"
            className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
              !isAria
                ? "text-[#7DD3FC] font-semibold drop-shadow-[0_0_8px_rgba(125,211,252,0.5)]"
                : "text-white/35 hover:text-white/70 font-normal"
            }`}
          >
            <svg
              width={9}
              height={9}
              viewBox="0 0 24 24"
              fill={!isAria ? "#7DD3FC" : "currentColor"}
              className={`shrink-0 ${!isAria ? "animate-pulse" : "opacity-30"}`}
              aria-hidden="true"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span>Chris</span>
          </button>
        </div>

        <span className="text-white/20 text-xs select-none font-light leading-none">·</span>

        {/* Clean, Container-Free, High-Definition Listen Button */}
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={
            isPlaying
              ? isPaused
                ? "Resume audio narration"
                : "Pause audio narration"
              : "Listen to this page (Audio Narrator)"
          }
          className="inline-flex items-center gap-1.5 text-xs transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none active:opacity-75 group leading-none"
        >
          {isPlaying && !isPaused ? (
            /* Live Equalizer Wave Animation */
            <div className="flex items-center gap-[2px] h-3 shrink-0" aria-hidden="true">
              <span className="w-[2px] h-2 bg-[#C4B5FD] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-[2px] h-3 bg-[#C4B5FD] rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]" />
              <span className="w-[2px] h-1.5 bg-[#C4B5FD] rounded-full animate-[pulse_0.7s_ease-in-out_0.1s_infinite]" />
            </div>
          ) : isPlaying && isPaused ? (
            /* Pause Glyph */
            <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0" aria-hidden="true">
              <svg
                className="w-3 h-3 text-[#C4B5FD] group-hover:text-white transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5.5" y="4.5" width="4" height="15" rx="1.5" />
                <rect x="14.5" y="4.5" width="4" height="15" rx="1.5" />
              </svg>
            </div>
          ) : (
            /* Bespoke Speaker Vector Icon */
            <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0" aria-hidden="true">
              <svg
                className="w-3.5 h-3.5 text-[#A27FF3] group-hover:text-white transition-colors drop-shadow-[0_0_6px_rgba(162,127,243,0.4)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </div>
          )}

          <span
            className={`text-[11.5px] font-sans tracking-wide leading-none transition-colors ${
              isPlaying
                ? isPaused
                  ? "text-[#C4B5FD] font-semibold"
                  : "text-[#C4B5FD] font-semibold drop-shadow-[0_0_8px_rgba(196,181,253,0.4)]"
                : "text-[#A27FF3] group-hover:text-white font-medium group-hover:drop-shadow-[0_0_8px_rgba(162,127,243,0.5)]"
            }`}
          >
            {isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen"}
          </span>
        </button>

        {/* Restart Audio Button (Clean Micro ↺ Glyph) */}
        {isPlaying && onRestart && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            title="Reiniciar lectura desde el principio"
            aria-label="Restart audio narration from the beginning"
            className="text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ml-0.5 active:scale-90"
          >
            <svg
              className="w-3 h-3 text-[#A27FF3] hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Speed Toggle Badge (Pure Monospace, Zero Box) */}
        {isPlaying && (
          <button
            type="button"
            onClick={onCycleRate}
            aria-label={`Playback speed: ${playbackRate}x. Click to change.`}
            title="Click to cycle speed"
            className="text-[10px] font-mono font-medium text-[#A27FF3] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ml-0.5 active:scale-95"
          >
            ({playbackRate === 0.85 ? "0.85x" : `${playbackRate}x`})
          </button>
        )}
      </div>
    );
  },
);

ReadingAudioNarratorButton.displayName = "ReadingAudioNarratorButton";
