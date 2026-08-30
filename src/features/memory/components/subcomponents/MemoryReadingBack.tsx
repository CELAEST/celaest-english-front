import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";

interface MemoryReadingBackProps {
  card: MemoryCard;
}

export const MemoryReadingBack: React.FC<MemoryReadingBackProps> = ({ card }) => {
  return (
    <div className="flex flex-col justify-center gap-3.5 sm:gap-4 lg:gap-5 my-auto py-1 z-10 overflow-hidden">
      {/* 1. Spanish Definition & Meaning */}
      <div className="space-y-1">
        <span className="block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A27FF3]">
          DEFINICIÓN Y SIGNIFICADO
        </span>
        <p className="text-lg sm:text-xl font-medium text-white/95 leading-snug sm:leading-relaxed pl-3 border-l-2 border-[#A27FF3]/60 line-clamp-3">
          {card.translationSpanish || "Definición en español"}
        </p>
      </div>

      {/* Subtle Divider Line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* 2. Usage / Grammatical Context */}
      <div className="space-y-1">
        <span className="block text-[9.5px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-[#55c9a4]">
          USO Y CATEGORÍA GRAMATICAL
        </span>
        <p className="text-xs sm:text-[13.5px] font-normal text-[#CBD5E1] leading-relaxed pl-3 border-l-2 border-[#55c9a4]/40 line-clamp-4">
          {card.grammarExplanation || "Término extraído de lecturas avanzadas en inglés."}
        </p>
      </div>
    </div>
  );
};
