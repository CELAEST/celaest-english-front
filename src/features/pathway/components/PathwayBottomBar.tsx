import React from "react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";

export interface PathwayBottomBarProps {
  activeStep: PathwayStepId;
  nodeIndex: number;
  totalNodes: number;
  masteryIndex: number;
  onPrev?: (() => void) | undefined;
  onNext?: (() => void) | undefined;
  nextLabel?: string;
}

const STEP_ORDER: Record<PathwayStepId, number> = { RULE: 1, BUILD: 2, SPEAK: 3 };

export const PathwayBottomBar: React.FC<PathwayBottomBarProps> = React.memo(
  ({ activeStep, nodeIndex, totalNodes, masteryIndex, onPrev, onNext, nextLabel = "Siguiente paso" }) => {
    const stepNumber = STEP_ORDER[activeStep];
    const visualProgress = Math.min(100, Math.max(8, Math.round(((nodeIndex + stepNumber / 3) / Math.max(1, totalNodes)) * 100)));

    return (
      <nav aria-label="Navegación de la guía" className="w-full flex flex-col space-y-1.5 select-none shrink-0 mt-auto pt-3 pb-0 relative z-20">
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-light">
          <span className="text-white/75">
            Paso {stepNumber} de 3 · Base {nodeIndex + 1} de {totalNodes}
          </span>
          <span className="text-[#A27FF3] font-semibold tabular-nums">{Math.max(masteryIndex, visualProgress)}% recorrido</span>
        </div>
        <div role="progressbar" aria-valuenow={visualProgress} aria-valuemin={0} aria-valuemax={100} className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#A27FF3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(162,127,243,0.8)]" style={{ width: `${visualProgress}%` }} />
        </div>
        <div className="w-full flex items-center justify-between pt-1.5 px-0.5">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            className={`text-xs py-1 px-2 rounded-lg transition-all ${onPrev ? "text-white/70 hover:text-white hover:bg-white/[0.06] cursor-pointer" : "text-white/20 cursor-not-allowed"}`}
          >
            ← Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            className={`text-xs py-1 px-2.5 rounded-lg transition-all ${onNext ? "text-[#A27FF3] hover:text-white hover:bg-[#A27FF3]/15 font-medium cursor-pointer" : "text-white/20 cursor-not-allowed"}`}
          >
            {nextLabel} →
          </button>
        </div>
      </nav>
    );
  },
);
