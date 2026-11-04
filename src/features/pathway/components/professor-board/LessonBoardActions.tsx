import React from "react";
import { MessageSquareQuote, Pause, Play, Volume2 } from "lucide-react";

interface LessonBoardActionsProps {
  isDictating: boolean; isSpeakingAudio: boolean; canPlaySample: boolean;
  isAskingOpen?: boolean | undefined; onToggleLecture: () => void;
  onPlaySample: () => void; onToggleAsking?: (() => void) | undefined;
}

export const LessonBoardActions: React.FC<LessonBoardActionsProps> = ({
  isDictating, isSpeakingAudio, canPlaySample, isAskingOpen = false,
  onToggleLecture, onPlaySample, onToggleAsking,
}) => (
  <div className="flex items-center justify-between w-full pt-2 border-t border-white/[0.06] select-none">
    <button
      type="button"
      onClick={onToggleLecture}
      className={`group inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
        isDictating ? "text-[#22D3EE]" : "text-white/55 hover:text-white"
      }`}
      aria-label={isDictating ? "Pausar clase" : "Dictar clase"}
    >
      {isDictating ? (
        <Pause size={10} className="animate-pulse text-[#22D3EE]" />
      ) : (
        <Play size={10} className="text-white/40 group-hover:text-[#A27FF3] transition-colors" />
      )}
      <span>{isDictating ? "Pausa" : "Clase"}</span>
    </button>

    {onToggleAsking && (
      <button
        type="button"
        onClick={onToggleAsking}
        className={`group inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
          isAskingOpen ? "text-[#C4B2F7]" : "text-white/55 hover:text-white"
        }`}
      >
        <MessageSquareQuote size={11} className={isAskingOpen ? "text-[#A27FF3]" : "text-white/40 group-hover:text-[#A27FF3]"} />
        <span>{isAskingOpen ? "Cerrar" : "Preguntar"}</span>
      </button>
    )}

    {canPlaySample && (
      <button
        type="button"
        onClick={onPlaySample}
        className={`group inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase transition-colors cursor-pointer ${
          isSpeakingAudio ? "text-sky-400" : "text-white/55 hover:text-white"
        }`}
      >
        <Volume2 size={11} className={isSpeakingAudio ? "animate-pulse text-sky-400" : "text-white/40 group-hover:text-sky-400"} />
        <span>{isSpeakingAudio ? "Sonando" : "Ejemplo"}</span>
      </button>
    )}
  </div>
);
