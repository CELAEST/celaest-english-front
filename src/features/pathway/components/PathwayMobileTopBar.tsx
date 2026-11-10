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
      <header className="w-full flex items-center justify-center pt-1.5 pb-1 px-2 select-none shrink-0 z-20 bg-transparent">
        <div className="inline-flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1 rounded-full bg-[#0A0A12]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          {/* Left: 008 A1 ⌄ */}
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={onOpenCurriculum} className="font-mono text-[11px] font-bold text-white/95 hover:text-white transition-colors cursor-pointer" title="Ver ruta de bases">
              {baseCode}
            </button>
            {onSelectLevel ? (
              <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center">
                <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
              </div>
            ) : (
              <button type="button" onClick={onOpenCurriculum} className="group inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-white/90 hover:text-white cursor-pointer">
                <span>{currentLevel}</span>
                <ChevronDown size={10} className="text-white/50 group-hover:text-white transition-colors" />
              </button>
            )}
          </div>
          <span className="w-px h-3 bg-white/10 shrink-0" aria-hidden />

          {/* Center: Moments */}
          <div className="flex items-center gap-1 shrink-0" role="tablist" aria-label="Momentos de la clase">
            {MOBILE_STEPS.map((item) => {
              const active = activeStep === item.id;
              return (
                <button
                  key={item.id} type="button" role="tab" aria-label={item.ariaLabel} aria-selected={active}
                  onClick={() => onSelectStep(item.id)}
                  className={`inline-flex items-center gap-1 text-[11px] transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "px-2 py-0.5 rounded-full bg-[#A27FF3]/20 border border-[#A27FF3]/35 text-white font-medium"
                      : "px-1.5 py-0.5 text-white/45 hover:text-white/70 font-normal"
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${active ? "bg-[#A27FF3] shadow-[0_0_4px_#A27FF3]" : "bg-white/20"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <span className="w-px h-3 bg-white/10 shrink-0" aria-hidden />

          {/* Right: Guide */}
          <div className="flex items-center shrink-0">
            <button type="button" onClick={onOpenGuide} className="group inline-flex items-center gap-1 text-[11px] text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap" title="Guía de Estudio">
              <BookOpen size={11} className="text-[#A78BFA] group-hover:scale-110 transition-transform" />
              <span>Guía</span>
            </button>
          </div>
        </div>
      </header>
    );
  },
);