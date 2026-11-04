import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";

export interface LiveBoardExamplesSceneProps {
  lesson: PathwayLessonPayload; activeExampleIndex: number; isSpeakingEnglish: boolean;
  speakingSampleText: string | null; subtitleSpanish?: string | undefined; onPlaySample: (text: string) => void;
}

export const LiveBoardExamplesScene: React.FC<LiveBoardExamplesSceneProps> = ({
  lesson, activeExampleIndex, isSpeakingEnglish, speakingSampleText, subtitleSpanish, onPlaySample,
}) => {
  const examples = lesson.examples.slice(0, 2);
  const currentIdx = Math.min(activeExampleIndex, Math.max(0, examples.length - 1));
  const [karaokeWordIdx, setKaraokeWordIdx] = useState(-1);
  const activeSentence = speakingSampleText || examples[currentIdx]?.english || "";
  const isAudioRunning = isSpeakingEnglish || Boolean(speakingSampleText);

  useEffect(() => {
    if (!isAudioRunning || !activeSentence) { setKaraokeWordIdx(-1); return; }
    const words = activeSentence.split(/\s+/).filter(Boolean);
    setKaraokeWordIdx(0);
    const interval = setInterval(() => {
      setKaraokeWordIdx((prev) => (prev + 1 < words.length ? prev + 1 : prev));
    }, 330);
    return () => clearInterval(interval);
  }, [isAudioRunning, activeSentence]);

  return (
    <div className="flex flex-col gap-1.5 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-examples-scene">
      {examples.map((ex, idx) => {
        const isFocused = speakingSampleText ? speakingSampleText === ex.english : idx === currentIdx;
        const words = ex.english.split(/\s+/).filter(Boolean);
        return (
          <button
            key={ex.english}
            type="button"
            onClick={() => onPlaySample(ex.english)}
            className={`group w-full text-left flex items-baseline justify-between gap-2.5 py-1 transition-opacity cursor-pointer ${
              isFocused ? "opacity-100" : "opacity-55 hover:opacity-90"
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm sm:text-[15px] font-normal leading-snug flex flex-wrap gap-x-1">
                {words.map((w, wIdx) => {
                  const prefix = wIdx === 0 ? "“" : "";
                  const suffix = wIdx === words.length - 1 ? "”" : "";
                  return (
                    <span
                      key={`${w}-${wIdx}`}
                      className={`transition-colors duration-150 ${
                        isFocused && isAudioRunning && wIdx === karaokeWordIdx
                          ? "text-[#22D3EE] font-medium"
                          : isFocused && isAudioRunning && wIdx < karaokeWordIdx
                            ? "text-white"
                            : "text-white/90"
                      }`}
                    >
                      {`${prefix}${w}${suffix}`}
                    </span>
                  );
                })}
              </p>
              <p className="text-[11px] text-white/50 font-light leading-snug mt-0.5">
                {ex.spanish} · <span className="font-mono text-[#C4B2F7]/90">[{ex.pronunciationHint}]</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#A27FF3] shrink-0">
              <Volume2 size={11} className={isFocused && isAudioRunning ? "animate-pulse text-[#22D3EE]" : ""} />
              <span>{isFocused && isAudioRunning ? "Oído" : "Oír"}</span>
            </span>
          </button>
        );
      })}
      {!isSpeakingEnglish && subtitleSpanish && (
        <p className="text-[11px] text-white/70 font-light leading-relaxed pt-0.5">{subtitleSpanish}</p>
      )}
    </div>
  );
};
