import React from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { KnowledgeTab } from "./knowledge/KnowledgeTabSelector";

export interface PathwayLessonHeaderProps {
  nodeIndex: number; totalNodes: number; masteredCount: number; currentLevel: string; roleName?: string; activeStep: PathwayStepId;
  onSelectStep: (step: PathwayStepId) => void; onSelectLevel?: ((level: CefrLevelCode) => void) | undefined; onOpenCurriculum: () => void;
  onOpenTutor?: ((ask?: boolean) => void) | undefined; onOpenAnatomy?: (() => void) | undefined; onOpenKnowledge?: ((tab: KnowledgeTab) => void) | undefined; nodeTitle?: string;
}

const STEPS: Array<{ id: PathwayStepId; label: string; ariaLabel: string }> = [
  { id: "RULE", label: "Regla", ariaLabel: "1. La Regla" }, { id: "BUILD", label: "Práctica", ariaLabel: "2. Práctica" }, { id: "SPEAK", label: "Habla", ariaLabel: "3. Habla" },
];

export const PathwayLessonHeader: React.FC<PathwayLessonHeaderProps> = React.memo(
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onSelectLevel, onOpenCurriculum, onOpenAnatomy, onOpenKnowledge }) => {
    const handleGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));
    const hasGuide = Boolean(onOpenAnatomy || onOpenKnowledge);
    const baseCode = String(nodeIndex + 1).padStart(3, "0");

    return (
      <header className="w-full flex items-center justify-between pt-1.5 pb-0 px-3 sm:px-4 border-b border-white/[0.06] select-none shrink-0 z-20 bg-transparent">
        {/* 1. Left Cluster: 008 ⌄ · A1 ⌄ (Both with chevron, centered, exact same color) */}
        <div className="flex items-center gap-2 pb-2 shrink-0">
          <button type="button" onClick={onOpenCurriculum} className="group inline-flex items-center gap-1 font-mono text-xs font-semibold tracking-wide text-white/90 hover:text-white transition-all cursor-pointer" title="Cambiar base activa (Abrir Mapa Curricular)">
            <span>{baseCode}</span>
            <ChevronDown size={11} className="text-white/50 group-hover:text-white transition-colors" />
          </button>
          <span className="text-white/20 text-xs font-mono">•</span>
          {onSelectLevel ? (
            <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center">
              <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
            </div>
          ) : (
            <button type="button" onClick={onOpenCurriculum} className="group inline-flex items-center gap-1 font-mono text-xs font-semibold tracking-wide text-white/90 hover:text-white transition-all cursor-pointer" title="Cambiar nivel CEFR">
              <span>{currentLevel}</span>
              <ChevronDown size={11} className="text-white/50 group-hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* 2. Center Cluster: Linear Underline Steps (Zero Boxes Puro) */}
        <div className="flex items-center gap-5 sm:gap-8 shrink-0" role="tablist" aria-label="Momentos de la clase">
          {STEPS.map((step) => {
            const active = activeStep === step.id;
            return (
              <button
                key={step.id} type="button" role="tab" aria-label={step.ariaLabel} aria-selected={active} onClick={() => onSelectStep(step.id)}
                className={`pb-2 text-xs transition-all duration-150 cursor-pointer whitespace-nowrap border-b-2 ${
                  active ? "font-medium text-white border-[#A27FF3]" : "font-normal text-white/40 border-transparent hover:text-white/75"
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>

        {/* 3. Right Cluster: Study Guide (Zero-Box, Borderless) */}
        <div className="flex items-center pb-2 shrink-0">
          {hasGuide && (
            <button type="button" onClick={handleGuide} className="group flex items-center gap-1.5 text-xs text-white/65 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap" title="Guía de Estudio (Estructura & Fonética)">
              <BookOpen size={12} className="text-[#A78BFA] group-hover:scale-105 transition-transform shrink-0" />
              <span>Guía</span>
            </button>
          )}
        </div>
      </header>
    );
  },
);