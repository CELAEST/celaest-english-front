import React from "react";
import { MessageSquareQuote, ChevronDown } from "lucide-react";
import { MockPathwayHeaderProps } from "./PathwayHeaderShowcaseTypes";
import { PathwayHeaderMockClassroom } from "./PathwayHeaderMockClassroom";
import { ChibiMicroCapsule } from "./ChibiMicroCapsule";

export const ModelAxisPillsAligned: React.FC<MockPathwayHeaderProps> = ({
  nodeIndex, activeStep, onSelectStep, onOpenCurriculum, onOpenTutor,
}) => (
  <div className="w-full h-full flex flex-col justify-between select-none">
    {/* 2. Symmetrical 3-Column with Enterprise Pills (Synthesis 1 + 4 + 7) */}
    <header className="w-full flex flex-col gap-2 pt-1 pb-2.5 px-1 border-b border-white/[0.06] shrink-0">
      <div className="relative w-full h-7 flex items-center justify-between">
        <button
          type="button" onClick={onOpenCurriculum}
          className="group h-7 px-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 z-10"
        >
          <span className="text-[11px] font-mono font-bold tracking-wider text-[#A27FF3] group-hover:text-[#DDD6FE]">
            BASE 0{nodeIndex + 1}
          </span>
          <ChevronDown size={11} className="text-white/40 group-hover:text-white" />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <ChibiMicroCapsule onClick={onOpenTutor} eyeColor="cyan" />
        </div>

        <button
          type="button" onClick={onOpenTutor}
          className="group h-7 px-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 z-10 text-[11px] font-mono text-white/80 hover:text-white"
        >
          <MessageSquareQuote size={12} className="text-[#A27FF3]" />
          <span>Tutor</span>
        </button>
      </div>

      <div className="relative w-full h-6 flex items-center justify-between" role="tablist">
        <button
          type="button" role="tab" aria-selected={activeStep === "RULE"} onClick={() => onSelectStep("RULE")}
          className={`text-left text-xs font-mono tracking-wide transition-all cursor-pointer z-10 pb-0.5 border-b-2 ${
            activeStep === "RULE" ? "text-white border-[#A27FF3] font-medium" : "text-white/35 border-transparent hover:text-white/70"
          }`}
        >
          1. Regla
        </button>

        <button
          type="button" role="tab" aria-selected={activeStep === "BUILD"} onClick={() => onSelectStep("BUILD")}
          className={`absolute left-1/2 -translate-x-1/2 text-center text-xs font-mono tracking-wide transition-all cursor-pointer z-10 pb-0.5 border-b-2 ${
            activeStep === "BUILD" ? "text-white border-[#A27FF3] font-medium" : "text-white/35 border-transparent hover:text-white/70"
          }`}
        >
          2. Práctica
        </button>

        <button
          type="button" role="tab" aria-selected={activeStep === "SPEAK"} onClick={() => onSelectStep("SPEAK")}
          className={`text-right text-xs font-mono tracking-wide transition-all cursor-pointer z-10 pb-0.5 border-b-2 ${
            activeStep === "SPEAK" ? "text-white border-[#A27FF3] font-medium" : "text-white/35 border-transparent hover:text-white/70"
          }`}
        >
          3. Habla
        </button>
      </div>
    </header>

    <PathwayHeaderMockClassroom activeStep={activeStep} />

    <footer className="w-full pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40 shrink-0">
      <span>Paso 2 de 3 · Base 6 de 32</span>
      <span className="text-[#A27FF3]">18% recorrido</span>
    </footer>
  </div>
);

