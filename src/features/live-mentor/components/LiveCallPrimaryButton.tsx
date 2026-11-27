import React from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { LiveCallPhase } from "../types";

interface LiveCallPrimaryButtonProps {
  phase: LiveCallPhase;
  micLevel: number;
  onStart: () => void;
  onStop: () => void;
}

function getPhaseHint(phase: LiveCallPhase): string {
  switch (phase) {
    case "connecting":
      return "Conectando con Liam...";
    case "robot_speaking":
      return "Liam hablando · escucha con calma";
    case "user_listening":
      return "Escuchándote · habla en inglés o español si te trabas";
    case "thinking":
      return "Liam pensando...";
    case "summarizing":
      return "Preparando tus mejoras clave...";
    default:
      return "Toca para conversar fluido · manos libres";
  }
}

export const LiveCallPrimaryButton: React.FC<LiveCallPrimaryButtonProps> = ({
  phase,
  micLevel,
  onStart,
  onStop,
}) => {
  const isActive = phase !== "idle" && phase !== "summarizing";
  const isBusy = phase === "summarizing";
  const ringScale = phase === "user_listening" ? 1 + Math.min(0.32, micLevel * 1.4) : 1;

  return (
    <div className="relative z-20 flex flex-col items-center gap-3 pb-7 sm:pb-10 select-none">
      <span
        className="text-xs font-mono tracking-wide text-center px-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {getPhaseHint(phase)}
      </span>

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
          disabled={isBusy}
          onClick={isActive ? onStop : onStart}
          className="relative h-14 px-8 rounded-full font-semibold text-sm tracking-wide inline-flex items-center justify-center gap-3 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
          style={
            isActive
              ? {
                  background: "var(--surface-2)",
                  border: "1px solid var(--glass-border-hover)",
                  color: "var(--text-primary)",
                }
              : {
                  background: "var(--gradient-primary)",
                  boxShadow: "0 0 36px var(--accent-violet-glow)",
                  color: "var(--text-primary)",
                }
          }
        >
          {isBusy ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isActive ? (
            <Square className="w-4 h-4 fill-current" style={{ color: "var(--status-danger)" }} />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span>{isBusy ? "Analizando..." : isActive ? "Parar" : "Iniciar"}</span>
        </button>
      </div>
    </div>
  );
};
