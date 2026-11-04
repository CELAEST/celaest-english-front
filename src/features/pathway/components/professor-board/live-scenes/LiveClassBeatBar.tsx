import React from "react";
import { LiveClassBeatId } from "../../../services/PathwayLectureEngine";

export interface LiveClassBeatBarProps {
  activeBeat: LiveClassBeatId;
  trapCheckPassed: boolean;
  isWaitingTrapCheck: boolean;
  onSelectBeat: (beat: LiveClassBeatId) => void;
}

const LIVE_BEATS: Array<{ id: LiveClassBeatId; label: string }> = [
  { id: "FORMULA", label: "1 Fórmula" },
  { id: "TRAP", label: "2 Trampa" },
  { id: "TRAP_CHECK", label: "3 Reto" },
  { id: "EXAMPLES", label: "4 Ejemplos" },
];

export const LiveClassBeatBar: React.FC<LiveClassBeatBarProps> = React.memo(
  ({ activeBeat, trapCheckPassed, isWaitingTrapCheck, onSelectBeat }) => {
    const normalizedActive = activeBeat === "ORIENTATION" ? "FORMULA" : activeBeat;

    return (
      <div
        className="flex items-center justify-between gap-1.5 border-b border-white/[0.06] pb-1.5 select-none"
        role="tablist"
        aria-label="Escenas de la pizarra viva"
      >
        {LIVE_BEATS.map((beat) => {
          const isSelected = normalizedActive === beat.id;
          const isCheck = beat.id === "TRAP_CHECK";
          const checkDone = isCheck && trapCheckPassed;
          const checkWaiting = isCheck && isWaitingTrapCheck && !trapCheckPassed;

          return (
            <button
              key={beat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectBeat(beat.id)}
              className={`relative flex-1 text-center py-0.5 text-[9.5px] sm:text-[10.5px] font-mono tracking-wide whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                checkDone
                  ? isSelected
                    ? "text-[#4ade80] border-[#4ade80] font-medium"
                    : "text-[#4ade80]/75 border-transparent hover:text-[#4ade80]"
                  : checkWaiting
                    ? "text-[#22D3EE] border-[#22D3EE] font-medium animate-pulse"
                    : isSelected
                      ? "text-white border-[#A27FF3] font-medium"
                      : "text-white/35 border-transparent hover:text-white/70"
              }`}
            >
              {checkDone ? "✓ Reto" : beat.label}
            </button>
          );
        })}
      </div>
    );
  },
);
