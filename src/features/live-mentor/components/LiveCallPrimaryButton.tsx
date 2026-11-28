import React from "react";
import { Mic, Square } from "lucide-react";
import { LiveCallPhase } from "../types";

interface LiveCallPrimaryButtonProps {
  phase: LiveCallPhase;
  micLevel: number;
  speakerLevel?: number;
  onStart: () => void;
  onStop: () => void;
}

export const LiveCallPrimaryButton: React.FC<LiveCallPrimaryButtonProps> = ({
  phase,
  micLevel,
  speakerLevel = 0,
  onStart,
  onStop,
}) => {
  const isActive = phase !== "idle" && phase !== "summarizing";
  const energy =
    phase === "robot_speaking"
      ? speakerLevel
      : phase === "user_listening"
        ? micLevel
        : 0;
  const barFactors = [0.68, 1.0, 0.76];

  return (
    <div className="relative z-20 flex items-center justify-center shrink-0 select-none">
      <button
        type="button"
        onClick={isActive ? onStop : onStart}
        className={`relative h-12 rounded-full font-medium text-[12px] tracking-[0.14em] uppercase inline-flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.97] cursor-pointer ${
          isActive
            ? "px-6 bg-white/[0.08] hover:bg-white/[0.13] backdrop-blur-2xl border border-white/[0.15] text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
            : "px-7 bg-[#F4F4F6] hover:bg-white text-[#0A0A0F] border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
        }`}
      >
        {isActive ? (
          <>
            <span className="flex items-center gap-[3px] h-4" aria-hidden="true">
              {barFactors.map((factor, idx) => {
                const heightPx = Math.max(4, Math.min(16, Math.round(5 + energy * 11 * factor)));
                return (
                  <span
                    key={idx}
                    className="w-[2.5px] rounded-full transition-all duration-75"
                    style={{
                      height: `${heightPx}px`,
                      background:
                        phase === "user_listening"
                          ? "var(--accent-cyan-500)"
                          : "var(--accent-violet-300)",
                    }}
                  />
                );
              })}
            </span>
            <span>Parar</span>
            <Square className="w-3 h-3 fill-current text-rose-400" />
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 stroke-[2.1]" />
            <span>Iniciar</span>
          </>
        )}
      </button>
    </div>
  );
};
