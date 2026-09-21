import React from "react";
import { Sparkles, Volume2, Copy } from "lucide-react";

export interface InterviewAnalysisImprovedAnswerCardProps {
  improvedFullAnswer: string;
  isPlayingModelAudio: boolean;
  onPlayModelAnswer: () => void;
}

export const InterviewAnalysisImprovedAnswerCard: React.FC<InterviewAnalysisImprovedAnswerCardProps> = ({
  improvedFullAnswer,
  isPlayingModelAudio,
  onPlayModelAnswer,
}) => {
  return (
    <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-4 sm:p-6 lg:p-7 shadow-xl transition-all">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Sparkles className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-[#A27FF3] shrink-0" />
          <div className="flex items-center gap-2 sm:gap-2.5">
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-white tracking-tight">
              Respuesta mejorada
            </h3>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
              Modelo nativo
            </span>
          </div>
        </div>

        <button
          onClick={onPlayModelAnswer}
          className="flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-medium text-[#8f71ee] hover:text-[#c4b5fd] transition-colors cursor-pointer"
        >
          <Volume2 className={`h-4 w-4 ${isPlayingModelAudio ? "text-emerald-400 animate-pulse" : "text-[#8f71ee]"}`} />
          <span>{isPlayingModelAudio ? "Detener" : "Escuchar respuesta"}</span>
        </button>
      </div>

      {/* Quote */}
      <div className="flex items-start gap-3 sm:gap-4 pl-1 sm:pl-5 pr-2 sm:pr-28 mb-3 sm:mb-4">
        <svg className="w-[20px] sm:w-[25px] h-[16px] sm:h-[20px] shrink-0 mt-0.5 text-[#674ee6]" viewBox="0 0 28 22" fill="currentColor">
          <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
        </svg>
        <p className="text-[13.5px] sm:text-[14.5px] leading-[1.7] text-[#d4d4e0] font-normal">
          "{improvedFullAnswer}"
        </p>
      </div>

      {/* Bottom Row: Copy Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => {
            navigator.clipboard.writeText(improvedFullAnswer);
          }}
          title="Copiar respuesta"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#8a8a9e] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer shadow-sm"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
};
