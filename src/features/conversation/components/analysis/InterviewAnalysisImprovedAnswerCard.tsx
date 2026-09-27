import React from "react";
import { Sparkles, Volume2, Copy } from "lucide-react";

export interface InterviewAnalysisImprovedAnswerCardProps {
  improvedFullAnswer: string;
  isPlayingModelAudio: boolean;
  onPlayModelAnswer: () => void;
}

const InterviewAnalysisImprovedAnswerCardInner: React.FC<InterviewAnalysisImprovedAnswerCardProps> = ({
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
          <span>{isPlayingModelAudio ? "Pausar audio" : "Escuchar audio"}</span>
        </button>
      </div>

      {/* Quote */}
      <div className="flex items-start gap-3 sm:gap-4 pl-1 sm:pl-5 pr-2 sm:pr-28 mb-4 sm:mb-6">
        <svg className="w-[20px] sm:w-[25px] h-[16px] sm:h-[20px] shrink-0 mt-0.5 text-[#674ee6]" viewBox="0 0 25 20" fill="currentColor">
          <path d="M7.5 0C3.36 0 0 3.36 0 7.5C0 11.64 3.36 15 7.5 15C8.16 15 8.8 14.91 9.4 14.75C8.44 17.72 5.56 19.86 2.14 20H4.29C8.95 20 12.86 16.09 12.86 11.43V7.5C12.86 3.36 9.5 0 7.5 0ZM19.64 0C15.5 0 12.14 3.36 12.14 7.5C12.14 11.64 15.5 15 19.64 15C20.3 15 20.94 14.91 21.54 14.75C20.58 17.72 17.7 19.86 14.28 20H16.43C21.09 20 25 16.09 25 11.43V7.5C25 3.36 21.64 0 19.64 0Z" />
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

export const InterviewAnalysisImprovedAnswerCard = React.memo(InterviewAnalysisImprovedAnswerCardInner);
