import React from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";

export interface PathwayMobileTopBarProps {
  nodeIndex: number; currentLevel: string; activeStep: PathwayStepId;
  onSelectStep: (step: PathwayStepId) => void; onOpenCurriculum: () => void;
  onOpenGuide: () => void; onSelectLevel?: ((level: CefrLevelCode) => void) | undefined;
}

const MOBILE_STEPS: Array<{ id: PathwayStepId; label: string }> = [
  { id: "RULE", label: "1. Regla" },
  { id: "BUILD", label: "2. Construir" },
  { id: "SPEAK", label: "3. Habla" },
];

export const PathwayMobileTopBar: React.FC<PathwayMobileTopBarProps> = React.memo(
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onOpenCurriculum, onOpenGuide, onSelectLevel }) => {
    const baseCode = String(nodeIndex + 1).padStart(2, "0");

    return (
      <header className="relative w-full h-9 flex items-center justify-between gap-1.5 sm:gap-3 pb-1.5 border-b border-white/[0.06] shrink-0 z-20 select-none">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
          <button type="button" onClick={onOpenCurriculum} className="group inline-flex items-center gap-1 cursor-pointer whitespace-nowrap" title="Ver ruta de bases">
            <span className="text-[10.5px] sm:text-xs font-mono font-bold tracking-wider text-[#A27FF3] group-hover:text-[#DDD6FE] transition-colors">BASE {baseCode}</span>
            <ChevronDown size={11} className="text-[#A27FF3]/65 group-hover:text-white transition-colors" />
          </button>
          {onSelectLevel && <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0 whitespace-nowrap" role="tablist" aria-label="Momentos de la clase">
          {MOBILE_STEPS.map((item) => {
            const selected = activeStep === item.id;
            return (
              <button
                key={item.id} type="button" role="tab" aria-selected={selected} onClick={() => onSelectStep(item.id)}
                className={`whitespace-nowrap text-[10px] sm:text-xs font-mono tracking-wide pb-0.5 border-b-2 transition-colors cursor-pointer ${
                  selected ? "text-white border-[#A27FF3] font-medium" : "text-white/35 border-transparent hover:text-white/70"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button type="button" onClick={onOpenGuide} className="group inline-flex items-center gap-1 text-[10.5px] sm:text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap" title="Guía de Estudio (14 Bloques y Fonética)">
          <BookOpen size={11} className="text-[#A78BFA] group-hover:scale-110 transition-transform" />
          <span>Guía</span>
        </button>
      </header>
    );
  },
);
