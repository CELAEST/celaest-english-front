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
      <div className="inline-flex items-center gap-1.5 leading-none select-none shrink-0">
        {/* Dual Mentor Switcher (Pure Typography & Clean Micro Dot matching Interview) */}
        {/* Aria */}
        <button
          type="button"
          onClick={handleSelectAria}
          title="Narrator: Aria (Femenino)"
          aria-label="Select Aria narrator voice"
          className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
            isAria
              ? "text-white font-semibold"
              : "text-white/40 hover:text-white/70 font-normal"
          }`}
        >
          {isAria && (
            <span className="w-1 h-1 rounded-full bg-white shrink-0" aria-hidden="true" />
          )}
          <span>Aria</span>
        </button>

        <span className="text-white/20 text-[10px] select-none font-light leading-none">|</span>

        {/* Chris */}
        <button
          type="button"
          onClick={handleSelectChris}
          title="Narrator: Christopher (Ejecutivo)"
          aria-label="Select Christopher narrator voice"
          className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
            !isAria
              ? "text-white font-semibold"
              : "text-white/40 hover:text-white/70 font-normal"
          }`}
        >
          {!isAria && (
            <span className="w-1 h-1 rounded-full bg-white shrink-0" aria-hidden="true" />
          )}
          <span>Chris</span>
        </button>

        <span className="text-white/20 text-xs select-none font-light leading-none">·</span>

        {/* Clean, High-Definition Listen Button (Matching Interview Standard) */}
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
          className={`inline-flex items-center gap-1 text-[11px] font-sans transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none active:scale-95 ml-0.5 group ${
            isPlaying
              ? "text-white font-semibold"
              : "text-white/40 hover:text-white font-normal"
          }`}
        >
          {isPlaying && !isPaused ? (
            /* Live Equalizer Wave Animation */
            <div className="flex items-center gap-[2px] h-3 shrink-0" aria-hidden="true">
              <span className="w-[2px] h-2 bg-white rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-[2px] h-3 bg-white rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]" />
              <span className="w-[2px] h-1.5 bg-white rounded-full animate-[pulse_0.7s_ease-in-out_0.1s_infinite]" />
            </div>
          ) : isPlaying && isPaused ? (
            /* Pause Glyph */
            <div
              className="w-3 h-3 flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <svg
                className="w-2.5 h-2.5 text-white transition-colors"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5.5" y="4.5" width="4" height="15" rx="1.5" />
                <rect x="14.5" y="4.5" width="4" height="15" rx="1.5" />
              </svg>
            </div>
          ) : (
            /* Bespoke Speaker Vector Icon */
            <svg
              className="w-3 h-3 text-white/60 group-hover:text-white transition-colors"
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
          )}

          <span>
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
              className="w-3 h-3 text-white/60 hover:text-white transition-colors"
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
            className="text-[10px] font-mono font-medium text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ml-0.5 active:scale-95"
          >
            ({playbackRate === 0.85 ? "0.85x" : `${playbackRate}x`})
          </button>
        )}
      </div>
    );
  },
);

ReadingAudioNarratorButton.displayName = "ReadingAudioNarratorButton";
