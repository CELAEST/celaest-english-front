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
    const activeIdx = MOBILE_STEPS.findIndex((s) => s.id === activeStep);

    return (
      <header className="w-full flex items-center justify-center shrink-0 z-20 select-none py-1">
        <div className="inline-flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1 rounded-xl bg-[#0c0a16]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_6px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* Left: Base & Level (Exact Image 4 Spec) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCurriculum}
              className="font-mono text-xs font-bold text-[#DDD6FE] hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
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
                className="flex items-center gap-0.5 font-mono text-[10px] font-medium text-white/40 hover:text-white cursor-pointer"
              >
                <span>{currentLevel}</span>
                <ChevronDown size={10} className="text-white/40" />
              </button>
            )}
          </div>

          {/* Center: Linear Segmented Pill (Exact Image 4 Spec) */}
          <div
            className="flex items-center gap-1 shrink-0"
            role="tablist"
            aria-label="Momentos de la clase"
          >
            {MOBILE_STEPS.map((item, idx) => {
              const active = activeStep === item.id;
              const isPast = idx < activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-label={item.ariaLabel}
                  aria-selected={active}
                  onClick={() => onSelectStep(item.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#A27FF3]/20 text-white shadow-[0_0_10px_rgba(162,127,243,0.25)] border border-[#A27FF3]/40"
                      : isPast
                      ? "text-[#DDD6FE]/80"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      active
                        ? "bg-[#A27FF3] shadow-[0_0_6px_#A27FF3]"
                        : isPast
                        ? "bg-[#10b981]"
                        : "bg-white/20"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Guide Button (Exact Image 4 Spec) */}
          <button
            type="button"
            onClick={onOpenGuide}
            className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-xs text-white/75 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
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