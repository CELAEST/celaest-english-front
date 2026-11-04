import React from "react";
import { Bot, Sparkles, Volume2 } from "lucide-react";

export interface ProfessorMobileMentorPillProps {
  isSpeakingAudio: boolean;
  isRecordingMic: boolean;
  isBuildCorrect: boolean;
  hasBuildMistake: boolean;
  onOpenLecture: () => void;
}

export const ProfessorMobileMentorPill: React.FC<ProfessorMobileMentorPillProps> = ({
  isSpeakingAudio, isRecordingMic, isBuildCorrect, hasBuildMistake, onOpenLecture,
}) => {
  const statusText = isRecordingMic
    ? "Escuchándote con atención..."
    : isSpeakingAudio
    ? "Profesor hablando..."
    : isBuildCorrect
    ? "¡Excelente estructura!"
    : hasBuildMistake
    ? "Pista: mira el orden de las fichas"
    : "Profesor Nova · Mentor Activo";

  return (
    <div className="w-full flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/[0.08] lg:hidden mb-1 select-none animate-[fadeIn_0.25s_ease-out_both]">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#050508] border border-cyan-400/30 shrink-0">
          <Bot size={13} className={hasBuildMistake ? "text-amber-400" : isBuildCorrect ? "text-emerald-400" : "text-[#22d3ee]"} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-white/90 truncate flex items-center gap-1.5">
            {isBuildCorrect ? <Sparkles size={11} className="text-emerald-400 shrink-0" /> : isSpeakingAudio ? <Volume2 size={11} className="text-cyan-400 shrink-0 animate-pulse" /> : null}
            <span className="truncate">{statusText}</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenLecture}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[10.5px] font-mono tracking-wider text-[#C4B2F7] hover:text-white shrink-0 cursor-pointer transition-colors"
      >
        <Bot size={12} />
        <span>Ver Profesor</span>
      </button>
    </div>
  );
};

