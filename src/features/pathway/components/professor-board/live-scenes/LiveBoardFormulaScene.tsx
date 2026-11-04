import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { PathwayLessonPayload, resolveFormulaCases } from "../../../../../domain/entities/LearningPathway";
import { FormulaCaseTabs } from "./FormulaCaseTabs";

export interface LiveBoardFormulaSceneProps {
  lesson: PathwayLessonPayload;
  activeCaseIndex: number;
  subtitleSpanish?: string | undefined;
  isDictating: boolean;
  onSelectCase: (index: number) => void;
  onPlaySample?: ((text: string) => void) | undefined;
}

const TONE_BAR = {
  violet: "bg-[#A78BFA] shadow-[0_0_12px_rgba(167,139,250,0.55)]",
  emerald: "bg-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.55)]",
  sky: "bg-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.55)]",
} as const;

const TONE_LABEL = {
  violet: "text-[#C4B2F7]", emerald: "text-[#86EFAC]", sky: "text-[#7DD3FC]",
} as const;

export const LiveBoardFormulaScene: React.FC<LiveBoardFormulaSceneProps> = ({
  lesson, activeCaseIndex, subtitleSpanish, isDictating, onSelectCase, onPlaySample,
}) => {
  const cases = resolveFormulaCases(lesson);
  const safeIdx = Math.min(activeCaseIndex, Math.max(0, cases.length - 1));
  const activeCase = cases[safeIdx]!;
  const count = activeCase.segments.length;
  const [revealedCount, setRevealedCount] = useState(1);

  useEffect(() => {
    setRevealedCount(1);
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    for (let i = 2; i <= count; i++) {
      timers.push(setTimeout(() => setRevealedCount(i), (i - 1) * 780));
    }
    return () => timers.forEach(clearTimeout);
  }, [lesson, safeIdx, count]);

  return (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none" data-testid="live-formula-scene">
      <FormulaCaseTabs cases={cases} activeIndex={safeIdx} onSelect={onSelectCase} />

      <div className="flex flex-wrap items-end gap-2 sm:gap-3.5 py-0.5">
        {activeCase.segments.map((seg, idx) => {
          const isVisible = idx < revealedCount;
          const isLatest = isDictating && idx === revealedCount - 1;
          return (
            <React.Fragment key={`${safeIdx}-${seg.label}-${idx}`}>
              {idx > 0 && <span className={`text-white/25 font-light text-sm pb-1 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-15"}`}>+</span>}
              <div className={`relative pb-1.5 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-15 translate-y-1"}`}>
                <span className={`text-[8.5px] font-mono uppercase tracking-[0.18em] block ${isVisible ? TONE_LABEL[seg.tone] : "text-white/30"}`}>{seg.label}</span>
                <span className={`text-sm sm:text-[15px] font-medium tracking-tight block mt-0.5 ${isLatest ? "text-white" : "text-white/95"}`}>{seg.token}</span>
                <span className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full origin-left transition-transform duration-500 ${TONE_BAR[seg.tone]} ${isVisible ? "scale-x-100" : "scale-x-0"}`} />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <p className="text-[11.5px] sm:text-xs text-white/75 font-light leading-relaxed">
        {activeCase.explanationSpanish || subtitleSpanish || lesson.ruleTaglineSpanish}
      </p>

      {activeCase.exampleEnglish && onPlaySample && (
        <button type="button" onClick={() => onPlaySample(activeCase.exampleEnglish!)} className="w-fit inline-flex items-center gap-1.5 text-[11px] font-mono text-[#C4B2F7] hover:text-white transition-colors cursor-pointer">
          <Volume2 size={11} className="text-[#A27FF3] shrink-0" />
          <span>“{activeCase.exampleEnglish}”</span>
        </button>
      )}
    </div>
  );
};
