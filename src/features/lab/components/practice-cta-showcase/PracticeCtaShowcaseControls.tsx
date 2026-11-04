import React from "react";
import { PracticeCtaVariant } from "../../../pathway/components/professor-board/LessonBoardPracticeCta";
import { CTA_MODELS } from "./PracticeCtaShowcaseTypes";

interface Props {
  selected: PracticeCtaVariant;
  onSelect: (variant: PracticeCtaVariant) => void;
}

export const PracticeCtaShowcaseControls: React.FC<Props> = ({ selected, onSelect }) => (
  <div className="w-full flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
    {CTA_MODELS.map((m) => {
      const active = selected === m.id;
      return (
        <button
          key={m.id} type="button" onClick={() => onSelect(m.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
            active
              ? "bg-[#A27FF3]/25 border border-[#A27FF3]/70 text-[#DDD6FE] font-semibold shadow-sm"
              : "bg-white/[0.03] text-white/50 border border-white/5 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          {m.label}
        </button>
      );
    })}
  </div>
);

