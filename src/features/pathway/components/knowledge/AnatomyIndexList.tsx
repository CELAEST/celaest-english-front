import React from "react";
import { ANATOMY_LEVELS, ENGLISH_ANATOMY_PILLARS } from "../../data/englishAnatomyData";

export interface AnatomyIndexListProps {
  activePillarId: string;
  onSelectPillar: (pillarId: string) => void;
}

export const AnatomyIndexList: React.FC<AnatomyIndexListProps> = ({ activePillarId, onSelectPillar }) => (
  <nav aria-label="Índice de la guía" className="space-y-5 py-1 select-none animate-[fadeIn_0.2s_ease-out_both]">
    {ANATOMY_LEVELS.map((level) => (
      <div key={level.id} className="space-y-1">
        <h4 className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#A78BFA]">
          Nivel {level.id} · {level.title}
        </h4>
        <ul className="divide-y divide-white/[0.04]">
          {ENGLISH_ANATOMY_PILLARS.filter((p) => p.levelId === level.id).map((pillar) => {
            const isActive = pillar.id === activePillarId;
            return (
              <li key={pillar.id}>
                <button
                  type="button"
                  onClick={() => onSelectPillar(pillar.id)}
                  aria-current={isActive ? "step" : undefined}
                  className="w-full min-h-[44px] flex items-baseline gap-3 py-2 text-left cursor-pointer group"
                >
                  <span className="text-[11px] font-mono text-white/35 tabular-nums">{pillar.number}</span>
                  <span className="flex-1 min-w-0">
                    <span className={`block text-[13px] transition-colors ${isActive ? "text-white font-medium" : "text-white/70 group-hover:text-white"}`}>
                      {pillar.name}
                    </span>
                    <span className="block text-[11px] text-white/40 font-light truncate">{pillar.tagline}</span>
                  </span>
                  {isActive && <span className="text-[10px] font-mono text-[#A78BFA] shrink-0">Aquí estás</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);

