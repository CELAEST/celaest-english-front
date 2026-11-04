import React from "react";
import { MessageSquareQuote, ChevronDown } from "lucide-react";
import { MockPathwayHeaderProps } from "./PathwayHeaderShowcaseTypes";
import { PathwayHeaderMockClassroom } from "./PathwayHeaderMockClassroom";
import { ChibiMicroCapsule } from "./ChibiMicroCapsule";

export const ModelAxisPillSegmented: React.FC<MockPathwayHeaderProps> = ({
  nodeIndex, activeStep, onSelectStep, onOpenCurriculum, onOpenTutor,
}) => (
  <div className="w-full h-full flex flex-col justify-between select-none">
    {/* Clean Top Bar with Symmetrical Segmented Rail */}
    <header className="w-full flex flex-col gap-2 pt-1 pb-2.5 px-1 border-b border-white/[0.06] shrink-0">
      <div className="relative w-full h-7 flex items-center justify-between">
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

      {/* Symmetrical Segmented Rail: Equidistant 3-Pills */}
      <div className="w-full flex items-center justify-center pt-0.5" role="tablist">
        <div className="w-full flex items-center justify-between p-0.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
          {(["RULE", "BUILD", "SPEAK"] as const).map((s, idx) => {
            const active = activeStep === s;
            return (
              <button
                key={s} type="button" role="tab" aria-selected={active} onClick={() => onSelectStep(s)}
                className={`flex-1 py-1 text-center text-[11px] font-mono rounded-full transition-all cursor-pointer ${
                  active
                    ? "bg-white/10 text-white font-medium border border-white/15 shadow-sm"
                    : "text-white/40 hover:text-white/70 border border-transparent"
                }`}
              >
                {idx + 1}. {s === "RULE" ? "Regla" : s === "BUILD" ? "Práctica" : "Habla"}
              </button>
            );
          })}
        </div>
      </div>
    </header>

    <PathwayHeaderMockClassroom activeStep={activeStep} />

    <footer className="w-full pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-white/40 shrink-0">
      <span>Paso 2 de 3 · Base 6 de 32</span>
      <span className="text-[#A27FF3]">18% recorrido</span>
    </footer>
  </div>
);

