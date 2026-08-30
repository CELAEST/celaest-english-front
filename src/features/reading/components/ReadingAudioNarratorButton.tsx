import React from "react";

export interface ReadingAudioNarratorButtonProps {
  isPlaying: boolean;
  isPaused: boolean;
  playbackRate: number;
  onTogglePlay: () => void;
  onCycleRate: () => void;
}

export const ReadingAudioNarratorButton: React.FC<ReadingAudioNarratorButtonProps> = React.memo(
  ({ isPlaying, isPaused, playbackRate, onTogglePlay, onCycleRate }) => {
    return (
      <div className="inline-flex items-center gap-1.5 select-none shrink-0 leading-none">
        {/* Borderless, container-free pure typography & icon button with exact optical alignment */}
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
            <div className="flex items-center gap-[2.5px] h-3.5 shrink-0" aria-hidden="true">
              <span className="w-[2px] h-2.5 bg-[#C4B5FD] rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-[2px] h-3.5 bg-[#C4B5FD] rounded-full animate-[pulse_0.8s_ease-in-out_0.2s_infinite]" />
              <span className="w-[2px] h-2 bg-[#C4B5FD] rounded-full animate-[pulse_0.7s_ease-in-out_0.1s_infinite]" />
            </div>
          ) : isPlaying && isPaused ? (
            /* Optically Centered Pause Glyph */
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
            /* Optically Centered Speaker Icon (Linear / Apple SF Standard) */
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
                ? "text-[#C4B5FD] font-semibold drop-shadow-[0_0_8px_rgba(196,181,253,0.4)]"
                : "text-[#A27FF3] group-hover:text-white font-medium group-hover:drop-shadow-[0_0_8px_rgba(162,127,243,0.5)]"
            }`}
          >
            {isPlaying ? (isPaused ? "Resume" : "Pause") : "Listen"}
          </span>
        </button>

        {/* Speed Toggle Badge (Optically Centered & Luminous) */}
        {isPlaying && (
          <button
            type="button"
            onClick={onCycleRate}
            aria-label={`Playback speed: ${playbackRate}x. Click to change.`}
            title="Click to cycle speed"
            className="text-[10.5px] font-mono font-medium text-[#A27FF3] hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ml-1 active:scale-95"
          >
            ({playbackRate.toFixed(1)}x)
          </button>
        )}
      </div>
    );
  },
);

ReadingAudioNarratorButton.displayName = "ReadingAudioNarratorButton";
