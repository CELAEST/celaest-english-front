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
      <header className="w-full flex items-center justify-center pt-2 pb-1.5 px-3 select-none shrink-0 z-20 bg-transparent">
        <div className="inline-flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 rounded-full bg-[#0A0A12]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {/* 1. Left Cluster: 008 A1 ⌄ (Unified style, exact match) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button type="button" onClick={onOpenCurriculum} className="font-mono text-xs font-bold tracking-tight text-white/95 hover:text-white transition-colors cursor-pointer" title="Cambiar base activa (Abrir Mapa Curricular)">
              {baseCode}
            </button>
            {onSelectLevel ? (
              <div onClick={(e) => e.stopPropagation()} className="inline-flex items-center">
                <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
              </div>
            ) : (
              <button type="button" onClick={onOpenCurriculum} className="group inline-flex items-center gap-1 font-mono text-xs font-semibold text-white/90 hover:text-white transition-colors cursor-pointer" title="Cambiar nivel CEFR">
                <span>{currentLevel}</span>
                <ChevronDown size={11} className="text-white/50 group-hover:text-white transition-colors" />
              </button>
            )}
          </div>
          <span className="w-px h-3.5 bg-white/10 shrink-0" aria-hidden />

          {/* 2. Center Cluster: 3 Moments with Glowing Dot Pill for Active */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" role="tablist" aria-label="Momentos de la clase">
            {STEPS.map((step) => {
              const active = activeStep === step.id;
              return (
                <button
                  key={step.id} type="button" role="tab" aria-label={step.ariaLabel} aria-selected={active}
                  onClick={() => onSelectStep(step.id)}
                  className={`inline-flex items-center gap-1.5 text-xs transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? "px-3 py-1 rounded-full bg-[#A27FF3]/20 border border-[#A27FF3]/35 text-white font-medium shadow-[0_0_12px_rgba(162,127,243,0.3)]"
                      : "px-2.5 py-1 text-white/45 hover:text-white/75 font-normal"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-all ${active ? "bg-[#A27FF3] shadow-[0_0_6px_#A27FF3]" : "bg-white/20"}`} />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
          <span className="w-px h-3.5 bg-white/10 shrink-0" aria-hidden />

          {/* 3. Right Cluster: Study Guide */}
          <div className="flex items-center shrink-0">
            {hasGuide && (
              <button type="button" onClick={handleGuide} className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white/75 hover:text-white border border-white/[0.08] hover:border-white/20 bg-white/[0.02] transition-colors cursor-pointer shrink-0 whitespace-nowrap" title="Guía de Estudio (Estructura & Fonética)">
                <BookOpen size={12} className="text-[#A78BFA] group-hover:scale-105 transition-transform shrink-0" />
                <span>Guía</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  },
);