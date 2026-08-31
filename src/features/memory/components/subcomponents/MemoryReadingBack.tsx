import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

interface MemoryReadingBackProps {
  card: MemoryCard;
}

export const MemoryReadingBack: React.FC<MemoryReadingBackProps> = ({ card }) => {
  return (
    <div className="flex flex-col justify-center space-y-5 my-auto py-2 z-10 select-none">
      {/* 1. Spanish Definition & Meaning */}
      {card.translationSpanish && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
            Definición & Significado
          </span>
          <p className="text-base sm:text-lg font-normal text-white/90 leading-relaxed">
            "{card.translationSpanish}"
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* 2. Usage / Grammatical Context */}
      {card.grammarExplanation && (
        <div className="space-y-1.5 pl-3 border-l border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Categoría & Contexto de Uso
          </span>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {card.grammarExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
