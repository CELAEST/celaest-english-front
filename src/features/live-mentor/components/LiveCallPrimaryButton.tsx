import React from "react";
import { Mic, Square } from "lucide-react";
import { LiveCallPhase } from "../types";

interface LiveCallPrimaryButtonProps {
  phase: LiveCallPhase;
  micLevel: number;
  onStart: () => void;
  onStop: () => void;
}

export const LiveCallPrimaryButton: React.FC<LiveCallPrimaryButtonProps> = ({
  phase,
  micLevel,
  onStart,
  onStop,
}) => {
  const isActive = phase !== "idle" && phase !== "summarizing";
  const ringScale = phase === "user_listening" ? 1 + Math.min(0.28, micLevel * 1.35) : 1;

  return (
    <div className="relative z-20 flex items-center justify-center pb-6 sm:pb-8 select-none">
      <div className="relative flex items-center justify-center">
        {phase === "user_listening" && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full transition-transform duration-100"
            style={{
              transform: `scale(${ringScale})`,
              background: "var(--accent-violet-subtle)",
              border: "1px solid var(--glass-border-active)",
            }}
          />
        )}

        <button
          type="button"
          onClick={isActive ? onStop : onStart}
          className="relative h-12 px-7 rounded-full font-medium text-xs tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] cursor-pointer"
          style={
            isActive
              ? {
                  background: "var(--surface-2)",
                  border: "1px solid var(--glass-border-hover)",
                  color: "var(--text-primary)",
                }
              : {
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 30px var(--accent-violet-glow)",
                  color: "var(--text-primary)",
                }
          }
        >
          {isActive ? (
            <Square className="w-3.5 h-3.5 fill-current" style={{ color: "var(--status-danger)" }} />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
          <span>{isActive ? "Parar" : "Iniciar"}</span>
        </button>
      </div>
    </div>
  );
};
