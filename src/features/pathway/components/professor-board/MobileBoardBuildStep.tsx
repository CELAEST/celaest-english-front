import React from "react";
import { WordBlockChallenge } from "../../../../domain/entities/LearningPathway";
import { WordChipItem } from "../../hooks/usePathwayStageSession";

export interface MobileBoardBuildStepProps {
  challenge: WordBlockChallenge;
  availableChips: WordChipItem[];
  placedChips: WordChipItem[];
  isBuildCorrect: boolean;
  hasBuildMistake: boolean;
  onTapAvailable: (id: string) => void;
  onRemovePlaced: (id: string) => void;
  onReset: () => void;
  onContinueToSpeak: () => void;
}

export const MobileBoardBuildStep: React.FC<MobileBoardBuildStepProps> = ({
  challenge,
  availableChips,
  placedChips,
  isBuildCorrect,
  hasBuildMistake,
  onTapAvailable,
  onRemovePlaced,
  onReset,
  onContinueToSpeak,
}) => (
  <div className="flex flex-col gap-2 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none">
    <p className="text-[13px] text-white/85 font-light leading-snug">{challenge.promptSpanish}</p>

    <div
      data-testid="pathway-assembly-zone"
      className={`min-h-[38px] pb-1.5 border-b transition-colors flex flex-wrap items-center gap-1.5 ${
        isBuildCorrect ? "border-[#4ade80]" : hasBuildMistake ? "border-[#de5252]" : "border-white/20"
      }`}
    >
      {placedChips.length === 0 ? (
        <span className="text-xs font-light text-white/35">Toca las palabras en orden natural...</span>
      ) : (
        placedChips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => onRemovePlaced(chip.id)}
            className={`px-2.5 py-1 rounded-full text-xs sm:text-[13px] font-normal transition-all cursor-pointer active:scale-95 ${
              isBuildCorrect ? "text-[#4ade80] bg-[#4ade80]/12" : "text-white bg-white/[0.09] hover:bg-white/[0.15]"
            }`}
          >
            {chip.word}
          </button>
        ))
      )}
    </div>

    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
      {availableChips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onTapAvailable(chip.id)}
          className="min-h-[32px] px-3 py-1 rounded-full bg-white/[0.05] hover:bg-[#A27FF3]/20 border border-white/12 hover:border-[#A27FF3]/50 text-xs sm:text-[13px] text-white/90 transition-all cursor-pointer active:scale-95"
        >
          {chip.word}
        </button>
      ))}
      {placedChips.length > 0 && !isBuildCorrect && (
        <button type="button" onClick={onReset} className="px-2 py-1 text-[11px] font-mono text-white/40 hover:text-white cursor-pointer">
          Reiniciar
        </button>
      )}
    </div>

    {hasBuildMistake && <p className="text-[11.5px] text-[#fca5a5] font-light leading-snug">Pista: {challenge.mistakeHintSpanish}</p>}

    {isBuildCorrect && (
      <div className="pt-1.5 flex items-center justify-between gap-2 border-t border-white/[0.06]">
        <span className="text-xs text-[#4ade80] font-light truncate">✓ {challenge.successTipSpanish}</span>
        <button type="button" onClick={onContinueToSpeak} className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-white hover:text-[#4ade80] cursor-pointer">
          <span>Decírsela al Profesor</span>
          <span>→</span>
        </button>
      </div>
    )}
  </div>
);

