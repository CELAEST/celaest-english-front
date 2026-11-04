import React from "react";
import { MessageSquareQuote, ChevronDown, BookOpen } from "lucide-react";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
import { LevelSelectorPill } from "../../conversation/components/LevelSelectorPill";
import { CefrLevelCode } from "../../conversation/services/dynamicQuestionService";
import { ChibiMicroCapsule } from "./ChibiMicroCapsule";
import { KnowledgeTab } from "./knowledge/KnowledgeTabSelector";

export interface PathwayLessonHeaderProps {
  nodeIndex: number; totalNodes: number; masteredCount: number; currentLevel: string; roleName: string; activeStep: PathwayStepId;
  onSelectStep: (step: PathwayStepId) => void; onSelectLevel?: ((level: CefrLevelCode) => void) | undefined; onOpenCurriculum: () => void;
  onOpenTutor?: ((askQuestion?: boolean) => void) | undefined; onOpenAnatomy?: () => void; onOpenKnowledge?: ((tab: KnowledgeTab) => void) | undefined; nodeTitle?: string | undefined;
}

const STEPS: Array<{ id: PathwayStepId; label: string }> = [
  { id: "RULE", label: "1. La Regla" }, { id: "BUILD", label: "2. Practica" }, { id: "SPEAK", label: "3. Habla" },
];
export const PathwayLessonHeader: React.FC<PathwayLessonHeaderProps> = React.memo(
  ({ nodeIndex, totalNodes, masteredCount, currentLevel, roleName, activeStep, onSelectStep, onSelectLevel, onOpenCurriculum, onOpenTutor, onOpenAnatomy, onOpenKnowledge, nodeTitle }) => {
    const handleGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));
    const hasGuide = Boolean(onOpenAnatomy || onOpenKnowledge);

    return (
      <header className="relative w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 sm:gap-4 lg:gap-6 pt-1 pb-3 border-b border-white/[0.06] shrink-0 z-20 select-none">
        {/* Row 1: Context & Symmetrical Actions (Mobile: 3-Zone Balanced / Desktop: Left Cluster) */}
        <div className="relative w-full lg:w-auto h-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 z-10">
            <button type="button" onClick={onOpenCurriculum} className="group flex items-center gap-1.5 cursor-pointer text-left shrink-0">
              <span className="text-xs font-mono font-bold tracking-wider text-[#A27FF3] group-hover:text-[#DDD6FE] transition-colors">BASE 0{nodeIndex + 1}</span>
              <ChevronDown size={11} className="text-[#A27FF3]/60 group-hover:text-white transition-colors" />
            </button>
            {nodeTitle && <span className="hidden lg:inline text-xs font-light text-white/80 truncate max-w-[160px]">· {nodeTitle}</span>}
            {hasGuide && (
              <button type="button" onClick={handleGuide} className="group flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0" title="Guía de Estudio (Estructura & Fonética)">
                <span className="text-white/20 select-none">·</span>
                <BookOpen size={12} className="text-[#A78BFA] group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Guía</span>
              </button>
            )}
          </div>

          {onSelectLevel && <div className="hidden lg:flex"><LevelSelectorPill currentLevel={currentLevel} onSelectLevel={onSelectLevel} roleName={roleName} /></div>}

          <button type="button" onClick={onOpenCurriculum} className="hidden lg:flex group items-center gap-1.5 h-7 px-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-white/70 hover:text-white transition-all cursor-pointer shadow-sm">
            <span>Ruta ({masteredCount}/{totalNodes})</span>
            <ChevronDown size={11} className="text-white/35 group-hover:text-white" />
          </button>

          {/* Centered Micro-Capsule (Liam Visual Bridge - Mobile Landmark) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 lg:hidden">
            <ChibiMicroCapsule onClick={() => onOpenTutor?.(false)} eyeColor="cyan" />
          </div>

          {/* Right Mobile Action: Ask Liam */}
          {onOpenTutor && (
            <button type="button" onClick={() => onOpenTutor(true)} className="lg:hidden group flex items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 z-10" title="Preguntarle a Liam">
              <MessageSquareQuote size={13} className="text-[#A27FF3] group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">Preguntar</span>
            </button>
          )}
        </div>

        {/* Row 2: Steps Tabs (Mobile: 3-column / Desktop: Right-aligned with Preguntar) */}
        <div className="relative w-full lg:w-auto h-6 flex items-center justify-between lg:justify-end gap-0 lg:gap-6 pt-0.5 lg:pt-0" role="tablist" aria-label="Momentos de la clase">
          {STEPS.map((item, idx) => (
            <button key={item.id} type="button" role="tab" aria-selected={activeStep === item.id} onClick={() => onSelectStep(item.id)} className={`text-xs font-mono tracking-wide transition-all cursor-pointer z-10 pb-0.5 border-b-2 ${idx === 0 ? "text-left lg:text-center" : idx === 1 ? "absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-center" : "text-right lg:text-center"} ${activeStep === item.id ? "text-white border-[#A27FF3] font-medium" : "text-white/35 border-transparent hover:text-white/70"}`}>
              {item.label}
            </button>
          ))}
          {onOpenTutor && (
            <button type="button" onClick={() => onOpenTutor(true)} className="hidden lg:flex group items-center gap-1.5 text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 pl-2 border-l border-white/10" title="Preguntarle a Liam">
              <MessageSquareQuote size={13} className="text-[#A27FF3] group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">Preguntar</span>
            </button>
          )}
        </div>
      </header>
    );
  },
);
