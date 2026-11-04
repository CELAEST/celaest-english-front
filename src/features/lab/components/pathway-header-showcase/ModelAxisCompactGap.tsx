import React from "react";
import { MessageSquareQuote, ChevronDown } from "lucide-react";
import { MockPathwayHeaderProps } from "./PathwayHeaderShowcaseTypes";
import { PathwayHeaderMockClassroom } from "./PathwayHeaderMockClassroom";
import { ChibiMicroCapsule } from "./ChibiMicroCapsule";

export const ModelAxisCompactGap: React.FC<MockPathwayHeaderProps> = ({
  nodeIndex, activeStep, onSelectStep, onOpenCurriculum, onOpenTutor,
}) => (
  <div className="w-full h-full flex flex-col justify-between select-none">
    {/* Ultra-Compact Unified Rhythm Header (4px Gap) */}
    <header className="w-full flex flex-col gap-1 pt-0.5 pb-2 px-1 border-b border-white/[0.06] shrink-0">
      <div className="relative w-full h-6 flex items-center justify-between">
        <button
          type="button" onClick={onOpenCurriculum}
          className="group flex items-center gap-1.5 cursor-pointer text-left shrink-0 z-10"
        >
          <span className="text-xs font-mono font-bold tracking-wider text-[#A27FF3] group-hover:text-[#DDD6FE] transition-colors">
            BASE 0{nodeIndex + 1}
          </span>
          <ChevronDown size={11} className="text-[#A27FF3]/60 group-hover:text-white transition-colors" />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <ChibiMicroCapsule onClick={onOpenTutor} />
        </div>

        <button
          type="button" onClick={onOpenTutor}
          className="group flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 z-10"
        >
          <MessageSquareQuote size={13} className="text-[#A27FF3] group-hover:scale-110 transition-transform" />
          <span className="tracking-wide">Preguntar</span>
        </button>
      </div>

      <div className="relative w-full h-5 flex items-center justify-between pt-0.5" role="tablist">
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

