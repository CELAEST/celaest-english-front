import React, { useEffect, useState } from "react";
import { PathwayLessonPayload } from "../../../../../domain/entities/LearningPathway";

export interface LiveBoardTrapSceneProps {
  lesson: PathwayLessonPayload;
  subtitleSpanish?: string | undefined;
  isDictating?: boolean | undefined;
  trapPhase?: 0 | 1 | 2 | undefined;
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
  lesson, subtitleSpanish, isDictating = false, trapPhase, onJumpToTrapCheck,
}) => {
  // Phase 0: Red alert error shown
  // Phase 1: Red strike crosses out error when teacher/model says mistake
  // Phase 2: Correct model slides up with emerald glow when teacher/model says correct phrase
  const [phase, setPhase] = useState<number>(!isDictating ? 2 : trapPhase !== undefined ? trapPhase : 0);
  const { wrong, wrongToken, correct, correctToken, whySpanish } = lesson.commonMistake;

  useEffect(() => {
    if (!isDictating) {
      setPhase(2);
      return;
    }

    if (trapPhase !== undefined) {
      setPhase(trapPhase);
      return;
    }

    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 7500);
    const t2 = setTimeout(() => setPhase(2), 11500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isDictating, trapPhase, wrong, correct]);

  return (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-trap-scene">
      <div className="space-y-1.5 py-0.5">
        {/* Error Sentence with Dynamic Strikethrough */}
        <div className="relative inline-flex items-center gap-2 max-w-full">
          <span className={`text-[11px] font-mono shrink-0 transition-colors duration-300 ${phase >= 1 ? "text-[#fb7185]/60" : "text-[#fb7185]"}`}>
            {phase >= 1 ? "✗" : "—"}
          </span>
          <span className={`relative text-sm sm:text-[15px] transition-colors duration-300 ${phase >= 1 ? "text-white/45" : "text-white/90"}`}>
            {highlightSubstring(wrong, wrongToken, "text-[#fb7185] font-medium")}
            <span
              className={`absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#ef4444] origin-left transition-transform duration-500 ease-out ${
                phase >= 1 ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </span>
        </div>

        {/* Correct Sentence with Emerald Glow */}
        <div className={`flex items-center gap-2 transition-all duration-500 ${phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          <span className="text-[11px] font-mono text-[#4ade80] shrink-0 font-bold">✓</span>
          <span className="text-sm sm:text-base font-medium text-white">
            {highlightSubstring(correct, correctToken, "text-[#4ade80] underline decoration-[#4ade80]/60 underline-offset-4")}
          </span>
        </div>
      </div>

      {/* Clean Premium Obsidian Footer: Pedagogical text + Minimal Probarme link */}
      <div className="flex items-end justify-between gap-2 pt-0.5">
        <p className="text-[11.5px] sm:text-xs text-white/75 font-light leading-relaxed">
          {subtitleSpanish || whySpanish}
        </p>
        <button
          type="button"
          onClick={onJumpToTrapCheck}
          className="shrink-0 text-[10.5px] font-mono text-[#22D3EE] hover:text-white cursor-pointer whitespace-nowrap transition-colors"
        >
          Probarme →
        </button>
      </div>
    </div>
  );
};
