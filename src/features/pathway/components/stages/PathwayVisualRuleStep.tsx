import React from "react";
import { Volume2 } from "lucide-react";
import { PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { KnowledgeTab } from "../knowledge/KnowledgeTabSelector";
import { StaticFormulaCaseBoard } from "../professor-board/live-scenes/StaticFormulaCaseBoard";

export interface PathwayVisualRuleStepProps {
  title: string; focus: string; lesson: PathwayLessonPayload;
  speakingText: string | null; onPlayAudio: (text: string) => void; onContinueToBuild: () => void;
  onOpenAnatomy?: () => void; onOpenKnowledge?: (tab: KnowledgeTab) => void;
}

export const PathwayVisualRuleStep: React.FC<PathwayVisualRuleStepProps> = ({
  title, focus, lesson, speakingText, onPlayAudio, onContinueToBuild, onOpenAnatomy, onOpenKnowledge,
}) => {
  const handleOpenGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));

  return (
    <div className="flex flex-col justify-center gap-2 sm:gap-3 lg:gap-3.5 w-full max-w-2xl my-auto animate-[fadeIn_0.35s_ease-out_both]">
      <div className="space-y-0.5 sm:space-y-1">
        <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.22em] text-white/40">{focus}</span>
        <h1 className="text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-light text-white tracking-[-0.03em] leading-tight">{title}</h1>
        <p className="text-xs sm:text-[13px] text-[#94A3B8] font-light leading-relaxed">{lesson.ruleTaglineSpanish}</p>
      </div>

      <StaticFormulaCaseBoard lesson={lesson} showExplanation />

      {(onOpenAnatomy || onOpenKnowledge) && (
        <button type="button" onClick={handleOpenGuide} className="w-fit text-[11px] font-mono text-[#DDD6FE] hover:text-white underline decoration-[#A78BFA]/50 underline-offset-4 cursor-pointer flex items-center gap-1.5 select-none">
          <span>¿Cómo funciona la estructura en inglés? Guía de los 14 Bloques</span>
          <span className="text-[#A78BFA]">→</span>
        </button>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-[13px] py-1 border-y border-white/[0.06]">
        <span className="text-white/50 line-through decoration-[#de5252]/80">✗ {lesson.commonMistake.wrong}</span>
        <span className="text-white/25">→</span>
        <span className="text-[#4ade80] font-normal">✓ {lesson.commonMistake.correct}</span>
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        {lesson.examples.map((ex) => (
          <button key={ex.english} type="button" onClick={() => onPlayAudio(ex.english)} className="group w-full text-left flex items-baseline justify-between gap-3 py-1 transition-colors cursor-pointer">
            <div>
              <span className={`text-sm sm:text-base font-light transition-colors ${speakingText === ex.english ? "text-[#A27FF3]" : "text-white group-hover:text-[#DDD6FE]"}`}>“{ex.english}”</span>
              <span className="block text-[11px] sm:text-xs text-white/45 font-light mt-0.5">{ex.spanish} · <span className="font-mono text-[#A78BFA]/75">suena: {ex.pronunciationHint}</span></span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A27FF3] shrink-0">
              <Volume2 size={12} className={speakingText === ex.english ? "animate-pulse" : ""} />
              <span>{speakingText === ex.english ? "Oyendo" : "Oír"}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="pt-0.5">
        <button type="button" onClick={onContinueToBuild} className="group inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-[0.16em] uppercase text-white/90 hover:text-[#A27FF3] py-0.5 cursor-pointer">
          <span>Practicar con el Profesor</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};
