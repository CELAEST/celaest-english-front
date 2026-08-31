import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

interface MemoryWritingBackProps {
  card: MemoryCard;
}

export const MemoryWritingBack: React.FC<MemoryWritingBackProps> = ({ card }) => {
  return (
    <div className="flex flex-col justify-center space-y-5 my-auto py-2 z-10 select-none">
      {/* 1. Specific Editorial Adjustment */}
      {(card.errorWord || card.correctWord) && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Ajuste Editorial & Registro
          </span>
          <div className="flex items-center gap-2 text-sm sm:text-base font-mono">
            {card.errorWord && (
              <span className="line-through text-[#F59E0B] opacity-80">
                {card.errorWord}
              </span>
            )}
            {card.errorWord && card.correctWord && (
              <span className="text-white/30">→</span>
            )}
            {card.correctWord && (
              <span className="font-semibold text-[#34D399]">
                {card.correctWord}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 2. Translation and Meaning */}
      {card.translationSpanish && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
            Traducción & Sentido Conceptual
          </span>
          <p className="text-sm sm:text-base font-normal text-white/90 leading-relaxed">
            "{card.translationSpanish}"
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* 3. Style and Grammar Rule */}
      {card.grammarExplanation && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Regla de Concisión & Verbos de Poder
          </span>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {card.grammarExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
