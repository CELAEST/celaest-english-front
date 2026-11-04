import React from "react";
import { List, X } from "lucide-react";
import { ANATOMY_LEVELS, ENGLISH_ANATOMY_PILLARS, AnatomyPillar } from "../../data/englishAnatomyData";

export interface AnatomyProgressHeaderProps {
  activePillar: AnatomyPillar;
  isIndexOpen: boolean;
  onToggleIndex: () => void;
}

export const AnatomyProgressHeader: React.FC<AnatomyProgressHeaderProps> = ({
  activePillar, isIndexOpen, onToggleIndex,
}) => {
  const level = ANATOMY_LEVELS.find((l) => l.id === activePillar.levelId);
  const position = ENGLISH_ANATOMY_PILLARS.findIndex((p) => p.id === activePillar.id) + 1;
  const total = ENGLISH_ANATOMY_PILLARS.length;

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-mono tracking-[0.14em] uppercase text-white/50 truncate">
          Nivel {level?.id} de {ANATOMY_LEVELS.length} · {level?.title}
        </span>
        <button
          type="button"
          onClick={onToggleIndex}
          aria-expanded={isIndexOpen}
          className="flex items-center gap-1.5 shrink-0 min-h-[32px] text-xs font-mono text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          {isIndexOpen ? <X size={13} aria-hidden /> : <List size={13} aria-hidden />}
          <span>{isIndexOpen ? "Cerrar índice" : "Índice"}</span>
        </button>
      </div>

      {/* Segmented progress: one segment per block, wider gap between levels */}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={position}
        aria-label={`Bloque ${position} de ${total}`}
        className="flex items-center gap-[3px]"
      >
        {ENGLISH_ANATOMY_PILLARS.map((p, idx) => {
          const isLevelStart = idx > 0 && p.levelId !== ENGLISH_ANATOMY_PILLARS[idx - 1]!.levelId;
          return (
            <span
              key={p.id}
              aria-hidden
              className={`h-[3px] flex-1 rounded-full transition-colors ${isLevelStart ? "ml-1.5" : ""} ${
                idx < position ? "bg-[#A78BFA]" : "bg-white/10"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

