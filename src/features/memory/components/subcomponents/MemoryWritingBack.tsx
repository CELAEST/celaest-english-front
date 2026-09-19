import React from "react";
import { MemoryCard } from "../../../../domain/entities/MemoryCard";
import {
  sanitizeQuotes,
  getDynamicBackTranslationClass,
  getDynamicExplanationClass,
} from "./typographyHelpers";

interface MemoryWritingBackProps {
  card: MemoryCard;
}

export const MemoryWritingBack: React.FC<MemoryWritingBackProps> = ({ card }) => {
  const cleanTranslation = sanitizeQuotes(card.translationSpanish);
  const cleanExplanation = sanitizeQuotes(card.grammarExplanation);

  const isLongExplanation = cleanExplanation.length > 120;
  const translationClass = getDynamicBackTranslationClass(cleanTranslation, isLongExplanation);
  const explanationClass = getDynamicExplanationClass(cleanExplanation);

  const totalLength = cleanTranslation.length + cleanExplanation.length;
  const isLongContent = isLongExplanation || totalLength > 160;
  const isShortContent = totalLength < 80;

  const spacingClass = isLongContent
    ? "space-y-2 sm:space-y-2.5"
    : isShortContent
    ? "space-y-5 sm:space-y-6"
    : "space-y-3 sm:space-y-4";

  return (
    <div
      className={`flex flex-col justify-center ${spacingClass} my-auto py-1 sm:py-2 z-10 select-none`}
    >
      {/* 1. Specific Editorial Adjustment */}
      {(card.errorWord || card.correctWord) && (
        <div className="space-y-1 pl-3 sm:pl-3.5 border-l-2 border-white/20">
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
      {cleanTranslation && (
        <div className="space-y-1 pl-3 sm:pl-3.5 border-l-2 border-[#A27FF3]">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-[#A27FF3]">
            Traducción & Sentido Conceptual
          </span>
          <p className={`${translationClass} text-white/95 leading-snug`}>
            “{cleanTranslation}”
          </p>
        </div>
      )}

      {/* Subtle Divider Line */}
      {cleanTranslation && cleanExplanation && (
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      )}

      {/* 3. Style and Grammar Rule */}
      {cleanExplanation && (
        <div className="space-y-1 pl-3 sm:pl-3.5 border-l-2 border-white/20">
          <span className="block text-[10px] font-mono uppercase tracking-widest text-white/40">
            Regla de Concisión & Verbos de Poder
          </span>
          <p className={`${explanationClass} leading-relaxed`}>
            {cleanExplanation}
          </p>
        </div>
      )}
    </div>
  );
};
