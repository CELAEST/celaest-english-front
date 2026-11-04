import React from "react";
import { Volume2 } from "lucide-react";
import { PathwayLessonPayload } from "../../../../domain/entities/LearningPathway";
import { StaticFormulaCaseBoard } from "./live-scenes/StaticFormulaCaseBoard";

export interface LessonVisualExamplesProps {
  lesson: PathwayLessonPayload;
  speakingText: string | null;
  onPlayAudio: (text: string) => void;
}

export const LessonVisualExamples: React.FC<LessonVisualExamplesProps> = ({
  lesson, speakingText, onPlayAudio,
}) => (
    <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.25s_ease-out_both] select-none">
      <StaticFormulaCaseBoard lesson={lesson} size="compact" />

      <div className="flex items-center gap-2.5 text-[11px] sm:text-xs py-0.5 border-y border-white/[0.06]">
        <span className="text-white/45 line-through decoration-[#ef4444]/70 truncate">✗ {lesson.commonMistake.wrong}</span>
        <span className="text-white/25 font-mono text-[9px]">→</span>
        <span className="text-emerald-400 font-medium truncate">✓ {lesson.commonMistake.correct}</span>
      </div>

      <div className="space-y-1.5 pt-0.5">
        {lesson.examples.map((ex) => {
          const isPlaying = speakingText === ex.english;
          return (
            <button key={ex.english} type="button" onClick={() => onPlayAudio(ex.english)} className="group w-full text-left flex items-baseline justify-between gap-3 py-1 transition-colors cursor-pointer">
              <div className="min-w-0 flex-1">
                <span className={`text-xs sm:text-[13px] font-medium block truncate transition-colors ${isPlaying ? "text-[#C4B2F7]" : "text-white group-hover:text-[#DDD6FE]"}`}>“{ex.english}”</span>
                <span className="text-[10.5px] text-white/45 block font-light mt-0.5">{ex.spanish} · <span className="font-mono text-[#A78BFA]/75">{ex.pronunciationHint}</span></span>
              </div>
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider shrink-0 transition-colors ${isPlaying ? "text-[#C4B2F7]" : "text-white/40 group-hover:text-[#A78BFA]"}`}>
                <Volume2 size={11} className={isPlaying ? "animate-pulse" : ""} />
                <span>{isPlaying ? "Oyendo" : "Oír"}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
);
