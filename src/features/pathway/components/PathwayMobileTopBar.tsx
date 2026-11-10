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

const MOBILE_STEPS: Array<{ id: PathwayStepId; label: string; ariaLabel: string }> = [
  { id: "RULE", label: "Regla", ariaLabel: "1. Regla" },
  { id: "BUILD", label: "Práctica", ariaLabel: "2. Práctica" },
  { id: "SPEAK", label: "Habla", ariaLabel: "3. Habla" },
];

export const PathwayMobileTopBar: React.FC<PathwayMobileTopBarProps> = React.memo(
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onOpenCurriculum, onOpenGuide, onSelectLevel }) => {
    const baseCode = String(nodeIndex + 1).padStart(3, "0");

    return (
      <header className="w-full flex items-center justify-between pt-1.5 pb-0 px-2.5 sm:px-3 border-b border-white/[0.06] select-none shrink-0 z-20 bg-transparent">
        {/* Left: Base & Level (Zero-Box CELAEST Standard) */}
        <div className="flex items-center gap-1.5 pb-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenCurriculum}
            className="font-mono text-xs font-bold text-white hover:text-[#DDD6FE] transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Ver ruta de bases"
          >
            {baseCode}
          </button>
          {onSelectLevel ? (
            <div onClick={(e) => e.stopPropagation()}>
              <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenCurriculum}
              className="flex items-center gap-0.5 font-mono text-[10.5px] font-medium text-white/45 hover:text-white cursor-pointer"
            >
              <span>{currentLevel}</span>
              <ChevronDown size={10} className="text-white/40" />
            </button>
          )}
        </div>

        {/* Center: Linear Underline Steps (Option 2) */}
        <div
          className="flex items-center gap-3.5 sm:gap-5 shrink-0"
          role="tablist"
          aria-label="Momentos de la clase"
        >
          {MOBILE_STEPS.map((item) => {
            const active = activeStep === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-label={item.ariaLabel}
                aria-selected={active}
                onClick={() => onSelectStep(item.id)}
                className={`pb-1.5 text-[11.5px] whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                  active
                    ? "font-medium text-white border-[#A27FF3]"
                    : "font-normal text-white/40 border-transparent hover:text-white/70"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Guide Button (Zero-Box) */}
        <div className="flex items-center pb-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenGuide}
            className="group inline-flex items-center gap-1 text-xs text-white/65 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            title="Guía de Estudio"
          >
            <BookOpen size={11} className="text-[#A78BFA] group-hover:scale-110 transition-transform" />
            <span>Guía</span>
          </button>
        </div>
      </header>
    );
  },
);