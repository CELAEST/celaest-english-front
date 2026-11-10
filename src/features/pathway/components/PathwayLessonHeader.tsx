import React from "react";
import { ChevronDown, BookOpen, Sparkles } from "lucide-react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { KnowledgeTab } from "./knowledge/KnowledgeTabSelector";

export interface PathwayLessonHeaderProps {
  nodeIndex: number; totalNodes: number; masteredCount: number; currentLevel: string; roleName?: string | undefined; activeStep: PathwayStepId;
  onSelectStep: (step: PathwayStepId) => void; onSelectLevel?: ((level: CefrLevelCode) => void) | undefined; onOpenCurriculum: () => void;
  onOpenTutor?: ((askQuestion?: boolean) => void) | undefined; onOpenAnatomy?: (() => void) | undefined; onOpenKnowledge?: ((tab: KnowledgeTab) => void) | undefined; nodeTitle?: string | undefined;
}

const STEPS: Array<{ id: PathwayStepId; label: string; ariaLabel: string }> = [
  { id: "RULE", label: "1. Regla", ariaLabel: "1. La Regla" },
  { id: "BUILD", label: "2. Práctica", ariaLabel: "2. Práctica" },
  { id: "SPEAK", label: "3. Habla", ariaLabel: "3. Habla" },
];

export const PathwayLessonHeader: React.FC<PathwayLessonHeaderProps> = React.memo(
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onSelectLevel, onOpenCurriculum, onOpenTutor, onOpenAnatomy, onOpenKnowledge, nodeTitle }) => {
    const handleGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));
    const hasGuide = Boolean(onOpenAnatomy || onOpenKnowledge);
    const baseCode = String(nodeIndex + 1).padStart(2, "0");
    const activeIdx = STEPS.findIndex((s) => s.id === activeStep);

    return (
      <header className="relative w-full h-11 flex items-center justify-between gap-2 sm:gap-3 px-3 rounded-xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_rgba(0,0,0,0.6)] shrink-0 z-20 select-none">
        {/* Specular horizon hairline */}
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#A27FF3]/40 to-transparent pointer-events-none" aria-hidden />

        {/* 1. Left Cluster: Breadcrumb with Safe Truncation */}
        <div className="flex items-center gap-1.5 min-w-0 shrink">
          <button
            type="button" onClick={onOpenCurriculum}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-left transition-all cursor-pointer min-w-0"
            title="Ver todas las bases de la ruta"
          >
            <span className="font-mono text-[11px] font-bold tracking-wider text-[#A27FF3] shrink-0">
              BASE {baseCode}
            </span>
            <span className="text-white/25 text-xs shrink-0">/</span>
            <span className="text-xs font-medium text-white/85 group-hover:text-white transition-colors truncate max-w-[120px] sm:max-w-[180px] xl:max-w-[260px]">
              {nodeTitle ?? "Clase Activa"}
            </span>
            <ChevronDown size={11} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
          </button>
        </div>

        {/* 2. Center Cluster: Hero Segmented Step Controller (Guaranteed 1-Line, Zero Wrap) */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/[0.06] shadow-inner shrink-0"
          role="tablist" aria-label="Momentos de la clase"
        >
          {STEPS.map((step, idx) => {
            const active = activeStep === step.id;
            const isPast = idx < activeIdx;
            return (
              <button
                key={step.id}
                type="button" role="tab" aria-label={step.ariaLabel} aria-selected={active} onClick={() => onSelectStep(step.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                  active
                    ? "bg-[#A27FF3]/22 text-white shadow-[0_0_14px_rgba(162,127,243,0.25)] border border-[#A27FF3]/35"
                    : isPast
                    ? "text-[#DDD6FE]/80 hover:text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                  active
                    ? "bg-[#A27FF3] shadow-[0_0_8px_#A27FF3]"
                    : isPast
                    ? "bg-[#10b981]"
                    : "bg-white/20"
                }`} />
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. Right Cluster: Utilities (Level + Guía + Liam) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {onSelectLevel && (
            <div className="flex items-center pr-1 border-r border-white/[0.06] shrink-0">
              <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
            </div>
          )}

          {hasGuide && (
            <button
              type="button" onClick={handleGuide}
              className="group flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border border-white/[0.06] hover:bg-white/[0.05] text-xs text-white/60 hover:text-white transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Guía de Estudio (14 Bloques de Estructura & Fonética)"
            >
              <BookOpen size={12} className="text-[#A78BFA] group-hover:scale-110 transition-transform shrink-0" />
              <span>Guía</span>
              <span className="font-mono text-[9px] text-white/30 hidden xl:inline">G</span>
            </button>
          )}

          {onOpenTutor && (
            <button
              type="button" onClick={() => onOpenTutor(true)}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#A27FF3]/15 hover:bg-[#A27FF3]/25 border border-[#A27FF3]/35 hover:border-[#A27FF3]/60 text-xs font-semibold text-[#DDD6FE] hover:text-white shadow-[0_0_16px_rgba(162,127,243,0.12)] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              title="Preguntarle a Liam (⌘K)"
            >
              <Sparkles size={12} className="text-[#A27FF3] group-hover:scale-110 transition-transform shrink-0" />
              <span>Preguntar</span>
              <span className="font-mono text-[9px] bg-black/30 px-1 py-0.5 rounded text-white/40 hidden xl:inline">⌘K</span>
            </button>
          )}
        </div>
      </header>
    );
  },
);