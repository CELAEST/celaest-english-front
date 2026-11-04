import React from "react";
import { MessageSquareQuote, ChevronDown } from "lucide-react";
import { MockPathwayHeaderProps } from "./PathwayHeaderShowcaseTypes";
import { PathwayHeaderMockClassroom } from "./PathwayHeaderMockClassroom";
import { ChibiMicroCapsule } from "./ChibiMicroCapsule";

export const ModelAxisSingleRow: React.FC<MockPathwayHeaderProps> = ({
  nodeIndex, activeStep, onSelectStep, onOpenCurriculum, onOpenTutor,
}) => (
  <div className="w-full h-full flex flex-col justify-between select-none">
    {/* Zero Vertical Gap: Everything Unified in a Single 36px Row */}
    <header className="relative w-full h-9 flex items-center justify-between px-1 border-b border-white/[0.06] shrink-0">
      <button
        type="button" onClick={onOpenCurriculum}
        className="group flex items-center gap-1.5 cursor-pointer text-left shrink-0 z-10"
      >
        <span className="text-xs font-mono font-bold tracking-wider text-[#A27FF3] group-hover:text-[#DDD6FE] transition-colors">
          BASE 0{nodeIndex + 1}
        </span>
        <ChevronDown size={11} className="text-[#A27FF3]/60 group-hover:text-white transition-colors" />
      </button>

      {/* Symmetrical Center Cluster: Step 1 · Micro-Capsule (Step 2) · Step 3 */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 z-10" role="tablist">
        <button
          type="button" role="tab" aria-selected={activeStep === "RULE"} onClick={() => onSelectStep("RULE")}
          className={`text-xs font-mono transition-all cursor-pointer ${
            activeStep === "RULE" ? "text-white font-medium border-b border-[#A27FF3]" : "text-white/35 hover:text-white/70"
          }`}
        >
          Regla
        </button>

        <ChibiMicroCapsule onClick={onOpenTutor} />

        <button
          type="button" role="tab" aria-selected={activeStep === "SPEAK"} onClick={() => onSelectStep("SPEAK")}
          className={`text-xs font-mono transition-all cursor-pointer ${
            activeStep === "SPEAK" ? "text-white font-medium border-b border-[#A27FF3]" : "text-white/35 hover:text-white/70"
          }`}
        >
          Habla
        </button>
      </div>

      <button
        type="button" onClick={onOpenTutor}
        className="group flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 z-10"
      >
        <MessageSquareQuote size={13} className="text-[#A27FF3] group-hover:scale-110 transition-transform" />
        <span className="tracking-wide">Preguntar</span>
      </button>
    </header>

    <PathwayHeaderMockClassroom activeStep={activeStep} />

    <footer className="w-full pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40 shrink-0">
      <span>Paso 2 de 3 · Base 6 de 32</span>
      <span className="text-[#A27FF3]">18% recorrido</span>
    </footer>
  </div>
);

