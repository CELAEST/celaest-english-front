import React, { useEffect, useState } from "react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";

export interface LiveBoardTrapSceneProps {
  lesson: PathwayLessonPayload;
  subtitleSpanish?: string | undefined;
  onJumpToTrapCheck: () => void;
}

function highlightSubstring(sentence: string, token: string, activeClass: string): React.ReactNode {
  if (!token) return sentence;
  const idx = sentence.toLowerCase().indexOf(token.toLowerCase());
  if (idx < 0) return sentence;
  return (
    <>
      {sentence.slice(0, idx)}
      <span className={activeClass}>{sentence.slice(idx, idx + token.length)}</span>
      {sentence.slice(idx + token.length)}
    </>
  );
}

export const LiveBoardTrapScene: React.FC<LiveBoardTrapSceneProps> = ({
  lesson, subtitleSpanish, onJumpToTrapCheck,
}) => {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const { wrong, wrongToken, correct, correctToken, whySpanish } = lesson.commonMistake;

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [wrong, correct]);

  return (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-trap-scene">
      <div className="space-y-1.5 py-0.5">
        <div className="relative inline-flex items-center gap-2 max-w-full">
          <span className="text-[11px] font-mono text-[#fb7185] shrink-0">{phase >= 1 ? "✗" : "—"}</span>
          <span className={`relative text-sm sm:text-[15px] transition-colors duration-300 ${phase >= 1 ? "text-white/45" : "text-white/90"}`}>
            {highlightSubstring(wrong, wrongToken, "text-[#fb7185] font-medium")}
            <span
              className={`absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#ef4444] origin-left transition-transform duration-500 ${
                phase >= 1 ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        </div>

        <div className={`flex items-center gap-2 transition-all duration-500 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          <span className="text-[11px] font-mono text-[#4ade80] shrink-0">✓</span>
          <span className="text-sm sm:text-base font-medium text-white">
            {highlightSubstring(correct, correctToken, "text-[#4ade80] underline decoration-[#4ade80]/60 underline-offset-4")}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-[11.5px] sm:text-xs text-white/75 font-light leading-relaxed">
          {subtitleSpanish || whySpanish}
        </p>
        <button
          type="button"
          onClick={onJumpToTrapCheck}
          className="shrink-0 text-[10.5px] font-mono text-[#22D3EE] hover:text-white cursor-pointer whitespace-nowrap"
        >
          Probarme →
        </button>
      </div>
    </div>
  );
};

