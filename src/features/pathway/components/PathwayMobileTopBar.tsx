import React from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
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
  ({ nodeIndex, currentLevel, activeStep, onSelectStep, onOpenCurriculum, onOpenGuide }) => {
    const baseCode = String(nodeIndex + 1).padStart(2, "0");
    const activeIdx = MOBILE_STEPS.findIndex((s) => s.id === activeStep);

    return (
      <header className="relative w-full h-10 flex items-center justify-between gap-1.5 px-2.5 rounded-xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] shrink-0 z-20 select-none">
        {/* Specular hairline */}
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#A27FF3]/40 to-transparent pointer-events-none" aria-hidden />

        {/* Left: Base & Level */}
        <button
          type="button" onClick={onOpenCurriculum}
          className="group inline-flex items-center gap-1.5 py-1 text-left cursor-pointer shrink-0 whitespace-nowrap"
          title="Ver ruta de bases"
        >
          <span className="font-mono text-[11px] font-bold text-[#DDD6FE]">
            0{baseCode}
          </span>
          <span className="font-mono text-[10px] font-medium text-white/40">
            {currentLevel}
          </span>
          <ChevronDown size={10} className="text-white/40 group-hover:text-white transition-colors" />
        </button>

        {/* Center: Linear Segmented Pill */}
        <div
          className="flex items-center gap-1 px-1 py-0.5 rounded-lg bg-black/40 border border-white/[0.06]"
          role="tablist" aria-label="Momentos de la clase"
        >
          {MOBILE_STEPS.map((item, idx) => {
            const active = activeStep === item.id;
            const isPast = idx < activeIdx;
            return (
              <button
                key={item.id} type="button" role="tab" aria-label={item.ariaLabel} aria-selected={active} onClick={() => onSelectStep(item.id)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#A27FF3]/25 text-white shadow-[0_0_10px_rgba(162,127,243,0.3)] border border-[#A27FF3]/40"
                    : isPast
                    ? "text-[#DDD6FE]/80"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${
                  active
                    ? "bg-[#A27FF3] shadow-[0_0_6px_#A27FF3]"
                    : isPast
                    ? "bg-[#10b981]"
                    : "bg-white/20"
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Guide Button */}
        <button
          type="button" onClick={onOpenGuide}
          className="group inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-xs text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          title="Guía de Estudio"
        >
          <BookOpen size={11} className="text-[#A78BFA] group-hover:scale-110 transition-transform" />
          <span>Guía</span>
        </button>
      </header>
    );
  },
);