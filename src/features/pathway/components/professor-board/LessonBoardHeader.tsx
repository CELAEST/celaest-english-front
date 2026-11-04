import React from "react";
import type { ProfessorBoardMode } from "../../services/professorSpeech";

interface LessonBoardHeaderProps {
  eyebrow: string;
  headline: string;
  mode: ProfessorBoardMode;
  isMobileUnified?: boolean | undefined;
  hideTabs?: boolean | undefined;
  onModeChange: (mode: ProfessorBoardMode) => void;
}

const DESKTOP_TABS: { id: ProfessorBoardMode; label: string }[] = [
  { id: "lesson", label: "Clase" },
  { id: "examples", label: "Ejemplos" },
  { id: "software", label: "Guía" },
];

const MOBILE_TABS: { id: ProfessorBoardMode; label: string }[] = [
  { id: "lesson", label: "Reto" },
  { id: "examples", label: "Fórmula" },
];

export const LessonBoardHeader: React.FC<LessonBoardHeaderProps> = ({
  eyebrow, headline, mode, isMobileUnified = false, hideTabs = false, onModeChange,
}) => {
  const tabs = isMobileUnified ? MOBILE_TABS : DESKTOP_TABS;
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">{eyebrow}</div>
        <h3 className="mt-0.5 truncate text-[14.5px] sm:text-[15px] font-medium leading-snug tracking-tight text-white">{headline}</h3>
      </div>
      {!hideTabs && (
        <div className="flex shrink-0 items-center gap-3.5 pt-0.5" role="tablist" aria-label="Contenido del profesor">
          {tabs.map((tab) => {
            const active = tab.id === mode;
            return (
              <button
                key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => onModeChange(tab.id)}
                className={`text-[10px] font-mono uppercase tracking-[0.18em] pb-1 transition-colors duration-200 cursor-pointer border-b ${
                  active ? "text-white border-white/50" : "text-white/35 border-transparent hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
