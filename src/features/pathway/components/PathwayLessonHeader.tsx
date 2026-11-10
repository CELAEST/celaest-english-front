import React from "react";
import { ChevronDown, BookOpen } from "lucide-react";
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
  { id: "RULE", label: "Regla", ariaLabel: "1. La Regla" },
  { id: "BUILD", label: "Práctica", ariaLabel: "2. Práctica" },
  { id: "SPEAK", label: "Habla", ariaLabel: "3. Habla" },
];

export const PathwayLessonHeader: React.FC<PathwayLessonHeaderProps> = React.memo(
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onSelectLevel, onOpenCurriculum, onOpenAnatomy, onOpenKnowledge }) => {
    const handleGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));
    const hasGuide = Boolean(onOpenAnatomy || onOpenKnowledge);
    const baseCode = String(nodeIndex + 1).padStart(3, "0");
    const activeIdx = STEPS.findIndex((s) => s.id === activeStep);

    return (
      <header className="w-full flex items-center justify-center shrink-0 z-20 select-none py-1">
        <div className="inline-flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 rounded-2xl bg-[#0c0a16]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* 1. Left Cluster: Compact Unified Base & Level Badge (Exact Image 2/4 Spec) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenCurriculum}
              className="font-mono text-xs font-bold tracking-wider text-[#DDD6FE] hover:text-white transition-colors cursor-pointer"
              title="Base activa (Abrir Mapa Curricular)"
            >
              {baseCode}
            </button>
            {onSelectLevel ? (
              <div onClick={(e) => e.stopPropagation()}>
                <LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} />
              </div>
            ) : (
              <div className="flex items-center gap-0.5 font-mono text-[11px] font-semibold text-white/50">
                <span>{currentLevel}</span>
                <ChevronDown size={10} className="text-white/40" />
              </div>
            )}
          </div>

          {/* 2. Center Cluster: Hero Segmented Step Controller (Exact Image 2/4 Spec: • Regla • Práctica • Habla) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 shrink-0"
            role="tablist"
            aria-label="Momentos de la clase"
          >
            {STEPS.map((step, idx) => {
              const active = activeStep === step.id;
              const isPast = idx < activeIdx;
              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-label={step.ariaLabel}
                  aria-selected={active}
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                    active
                      ? "bg-[#A27FF3]/18 text-white shadow-[0_0_14px_rgba(162,127,243,0.22)] border border-[#A27FF3]/40"
                      : isPast
                      ? "text-[#DDD6FE]/80 hover:text-white"
                      : "text-white/45 hover:text-white/75"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                      active
                        ? "bg-[#A27FF3] shadow-[0_0_8px_#A27FF3]"
                        : isPast
                        ? "bg-[#10b981]"
                        : "bg-white/25"
                    }`}
                  />
                  <span className="whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Right Cluster: Study Guide Action (Exact Image 2/4 Spec) */}
          <div className="flex items-center shrink-0">
            {hasGuide && (
              <button
                type="button"
                onClick={handleGuide}
                className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/15 text-xs text-white/80 hover:text-white transition-all cursor-pointer shrink-0 whitespace-nowrap"
                title="Guía de Estudio (Estructura & Fonética)"
              >
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