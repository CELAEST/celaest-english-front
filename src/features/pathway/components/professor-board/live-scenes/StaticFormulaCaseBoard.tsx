import React, { useEffect, useState } from "react";
import { PathwayLessonPayload, resolveFormulaCases } from "../../../../../domain/entities/LearningPathway";
import { FormulaCaseTabs } from "./FormulaCaseTabs";

export interface StaticFormulaCaseBoardProps {
  lesson: PathwayLessonPayload;
  size?: "compact" | "regular";
  showExplanation?: boolean;
}

const ACCENT_LINE = {
  violet: "border-[#A78BFA]/70", emerald: "border-[#4ADE80]/70", sky: "border-[#38BDF8]/70",
} as const;

export const StaticFormulaCaseBoard: React.FC<StaticFormulaCaseBoardProps> = ({
  lesson, size = "regular", showExplanation = false,
}) => {
  const cases = resolveFormulaCases(lesson);
  const [caseIdx, setCaseIdx] = useState(0);
  const safeIdx = Math.min(caseIdx, cases.length - 1);
  const activeCase = cases[safeIdx]!;
  const isCompact = size === "compact";

  useEffect(() => { setCaseIdx(0); }, [lesson]);

  return (
    <div className="space-y-2 py-0.5 select-none">
      <FormulaCaseTabs cases={cases} activeIndex={safeIdx} onSelect={setCaseIdx} />
      <div className={`flex flex-wrap items-end ${isCompact ? "gap-2.5 sm:gap-4" : "gap-3 sm:gap-4"}`}>
        {activeCase.segments.map((seg, idx) => (
          <React.Fragment key={`${safeIdx}-${seg.label}-${idx}`}>
            {idx > 0 && <span className={`text-white/25 font-light pb-0.5 ${isCompact ? "text-xs sm:text-base" : "text-base sm:text-lg"}`}>+</span>}
            <div className={`border-b-2 ${isCompact ? "pb-0.5" : "pb-1"} ${ACCENT_LINE[seg.tone]}`}>
              <span className={`font-mono uppercase text-white/45 block ${isCompact ? "text-[8px] tracking-[0.16em]" : "text-[9px] tracking-[0.18em]"}`}>{seg.label}</span>
              <span className={`font-normal text-white ${isCompact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}>{seg.token}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      {showExplanation && cases.length > 1 && (
        <p className={`text-white/70 font-light leading-relaxed ${isCompact ? "text-[11px]" : "text-xs sm:text-[13px]"}`}>
          {activeCase.explanationSpanish}
        </p>
      )}
    </div>
  );
};
