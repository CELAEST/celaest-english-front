import React from "react";
import { Volume2 } from "lucide-react";

export interface AnatomyUniversalFormulaProps {
  speakingText: string | null;
  onPlayAudio: (text: string) => void;
}

const FORMULA_PARTS = [
  { label: "01. QUIÉN", token: "I", role: "Sujeto", tone: "text-[#DDD6FE] border-[#A78BFA]" },
  { label: "02. ACCIÓN", token: "learn", role: "Verbo", tone: "text-[#BBF7D0] border-[#4ADE80]" },
  { label: "03. OBJETO", token: "English", role: "Sustantivo", tone: "text-[#BAE6FD] border-[#38BDF8]" },
  { label: "04. MODO/LUGAR", token: "step by step", role: "Adverbio", tone: "text-[#FDE68A] border-[#FBBF24]" },
];

export const AnatomyUniversalFormula: React.FC<AnatomyUniversalFormulaProps> = ({
  speakingText,
  onPlayAudio,
}) => {
  const fullSentence = "I learn English step by step.";
  const isSpeaking = speakingText === fullSentence;

  return (
    <div className="pt-3 pb-1 space-y-3 border-t border-white/[0.08] select-none">
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
          La Regla Sagrada del Inglés
        </span>
        <h4 className="text-sm sm:text-base font-normal text-white">
          La Fórmula Universal de la Oración (SVO)
        </h4>
        <p className="text-xs text-white/60 font-light">
          A diferencia del español, en inglés el orden no se puede alterar libremente:
        </p>
      </div>

      {/* Pure Floating Typography Formula */}
      <div className="flex flex-wrap items-end gap-3 sm:gap-5 py-1">
        {FORMULA_PARTS.map((part, idx) => (
          <React.Fragment key={part.label}>
            {idx > 0 && (
              <span className="text-white/25 text-base sm:text-lg pb-1 font-light">+</span>
            )}
            <div className={`border-b-2 pb-1 ${part.tone}`}>
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">
                {part.label} · {part.role}
              </span>
              <span className="text-sm sm:text-base font-medium text-white">{part.token}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPlayAudio(fullSentence)}
        className="w-full text-left flex items-center justify-between py-1.5 transition-colors cursor-pointer group"
      >
        <span
          className={`text-xs sm:text-[13px] font-light transition-colors ${
            isSpeaking ? "text-[#A78BFA]" : "text-white/75 group-hover:text-white"
          }`}
        >
          Ejemplo unificado: “{fullSentence}”
        </span>
        <span className="text-[11px] font-mono text-[#A78BFA] flex items-center gap-1">
          <Volume2 size={12} className={isSpeaking ? "animate-pulse" : ""} />
          <span>{isSpeaking ? "Escuchando" : "Oír"}</span>
        </span>
      </button>
    </div>
  );
};

