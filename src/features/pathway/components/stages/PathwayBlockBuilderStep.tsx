import React from "react";
import { WordBlockChallenge } from "../../../../domain/entities/LearningPathway";
import { WordChipItem } from "../../hooks/usePathwayStageSession";

export interface PathwayBlockBuilderStepProps {
  challenge: WordBlockChallenge; availableChips: WordChipItem[]; placedChips: WordChipItem[];
  isBuildCorrect: boolean; hasBuildMistake: boolean; onTapAvailable: (id: string) => void;
  onRemovePlaced: (id: string) => void; onReset: () => void; onContinueToSpeak: () => void;
}

export const PathwayBlockBuilderStep: React.FC<PathwayBlockBuilderStepProps> = ({
  challenge, availableChips, placedChips, isBuildCorrect, hasBuildMistake, onTapAvailable, onRemovePlaced, onReset, onContinueToSpeak,
}) => (
  <div className="flex flex-col justify-center gap-2.5 sm:gap-3.5 lg:gap-4 w-full max-w-2xl my-auto animate-[fadeIn_0.35s_ease-out_both]">
    <div className="space-y-1">
      <span className="text-[9.5px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">Tu turno de construir</span>
      <h2 className="text-xl sm:text-2xl lg:text-[26px] font-light text-white tracking-[-0.02em] leading-snug">{challenge.promptSpanish}</h2>
    </div>

    {/* Magnetic Assembly Line */}
    <div
      data-testid="pathway-assembly-zone"
      className={`min-h-[46px] pb-2 border-b transition-colors flex flex-wrap items-center gap-2 ${
        isBuildCorrect ? "border-[#4ade80]" : hasBuildMistake ? "border-[#de5252]" : "border-white/20"
      }`}
    >
      {placedChips.length === 0 ? (
        <span className="text-xs sm:text-sm font-light text-white/30">Toca las palabras de abajo en orden...</span>
      ) : (
        placedChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onRemovePlaced(chip.id)}
            className={`px-3 py-1 rounded-full text-sm font-light transition-all cursor-pointer ${
              isBuildCorrect ? "text-[#4ade80] bg-[#4ade80]/10" : "text-white bg-white/[0.08] hover:bg-white/[0.15]"
            }`}
          >
            {chip.word}
          </button>
        ))
      )}
    </div>

    {/* Floating Word Tokens */}
    <div className="flex flex-wrap items-center gap-2">
      {availableChips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onTapAvailable(chip.id)}
          className="min-h-[34px] px-3.5 py-1 rounded-full bg-white/[0.04] hover:bg-[#A27FF3]/20 border border-white/10 hover:border-[#A27FF3]/50 text-xs sm:text-sm text-white/85 hover:text-white transition-all cursor-pointer"
        >
          {chip.word}
        </button>
      ))}
      {placedChips.length > 0 && !isBuildCorrect && (
        <button type="button" onClick={onReset} className="px-2.5 py-1 text-xs font-mono text-white/40 hover:text-white cursor-pointer">
          Reiniciar
        </button>
      )}
    </div>

    {hasBuildMistake && <p className="text-xs text-[#fca5a5] font-light">Pista del Profesor: {challenge.mistakeHintSpanish}</p>}

    {isBuildCorrect && (
      <div className="pt-1.5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
        <span className="text-xs sm:text-sm text-[#4ade80] font-light">✓ {challenge.successTipSpanish}</span>
        <button type="button" onClick={onContinueToSpeak} className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-white hover:text-[#4ade80] py-1 cursor-pointer">
          <span>Decírsela al Profesor</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    )}
  </div>
);
