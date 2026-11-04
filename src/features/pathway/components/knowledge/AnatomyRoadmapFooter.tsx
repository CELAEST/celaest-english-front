import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ENGLISH_ANATOMY_PILLARS } from "../../data/englishAnatomyData";

export interface AnatomyRoadmapFooterProps {
  activePillarId: string;
  onNavigatePillar: (pillarId: string) => void;
}

export const AnatomyRoadmapFooter: React.FC<AnatomyRoadmapFooterProps> = ({
  activePillarId,
  onNavigatePillar,
}) => {
  const currentIndex = ENGLISH_ANATOMY_PILLARS.findIndex((p) => p.id === activePillarId);
  const prevPillar = currentIndex > 0 ? ENGLISH_ANATOMY_PILLARS[currentIndex - 1] : null;
  const nextPillar = currentIndex < ENGLISH_ANATOMY_PILLARS.length - 1 ? ENGLISH_ANATOMY_PILLARS[currentIndex + 1] : null;

  return (
    <footer className="pt-3 pb-1 border-t border-white/[0.08] flex items-center justify-between gap-4 select-none">
      {prevPillar ? (
        <button
          type="button"
          onClick={() => onNavigatePillar(prevPillar.id)}
          className="min-h-[44px] flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors cursor-pointer min-w-0"
        >
          <ArrowLeft size={13} aria-hidden className="shrink-0" />
          <span className="truncate">Anterior<span className="hidden sm:inline"> · {prevPillar.name}</span></span>
        </button>
      ) : <span />}

      {nextPillar ? (
        <button
          type="button"
          onClick={() => onNavigatePillar(nextPillar.id)}
          className="min-h-[44px] flex items-center gap-1.5 text-xs font-mono text-white hover:text-[#A78BFA] transition-colors cursor-pointer min-w-0"
        >
          <span className="truncate">Siguiente<span className="hidden sm:inline"> · {nextPillar.name}</span></span>
          <ArrowRight size={13} aria-hidden className="shrink-0" />
        </button>
      ) : (
        <span className="text-xs font-mono text-[#A78BFA]">Ruta completada ✓</span>
      )}
    </footer>
  );
};
