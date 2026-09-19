import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import {
  sanitizeQuotes,
  getDynamicDefinitionClass,
  getDynamicExplanationClass,
} from "./typographyHelpers";

interface MemoryReadingBackProps {
  card: MemoryCard;
}

export const MemoryReadingBack: React.FC<MemoryReadingBackProps> = ({ card }) => {
  const cleanTranslation = sanitizeQuotes(card.translationSpanish);
  const cleanExplanation = sanitizeQuotes(card.grammarExplanation);

  const definitionClass = getDynamicDefinitionClass(cleanTranslation);
  const explanationClass = getDynamicExplanationClass(cleanExplanation);

  const isShortContent = cleanTranslation.length + cleanExplanation.length < 90;

  return (
    <div
      className={`flex flex-col justify-center ${
        isShortContent ? "space-y-6 sm:space-y-8" : "space-y-5 sm:space-y-6"
      } my-auto py-2 z-10 select-none`}
    >
      {/* 1. Spanish Definition & Meaning */}
      {cleanTranslation && (
        <div className="space-y-2 pl-3.5 border-l-2 border-[#A27FF3]">
          <span className="block text-[10.5px] sm:text-[11px] font-mono uppercase tracking-widest text-[#A27FF3] font-medium">
            Definición & Significado
          </span>
          <p className={`${definitionClass} text-white/95 leading-snug`}>
            “{cleanTranslation}”
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      {cleanTranslation && cleanExplanation && (
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      )}

      {/* 2. Usage / Grammatical Context */}
      {cleanExplanation && (
        <div className="space-y-1.5 pl-3.5 border-l-2 border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Categoría & Contexto de Uso
          </span>
          <p className={`${explanationClass} leading-relaxed`}>
            {cleanExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
