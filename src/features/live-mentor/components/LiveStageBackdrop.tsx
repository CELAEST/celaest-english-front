import React from "react";
import { LiveCallPhase } from "../types";

interface LiveStageBackdropProps {
  phase: LiveCallPhase;
  micLevel: number;
  speakerLevel: number;
}

export const LiveStageBackdrop: React.FC<LiveStageBackdropProps> = ({
  phase,
  micLevel,
  speakerLevel,
}) => {
  const activeEnergy =
    phase === "robot_speaking"
      ? speakerLevel
      : phase === "user_listening"
        ? micLevel
        : 0;
  const auraScale = 1 + Math.min(0.24, activeEnergy * 0.45);
  const auraOpacity =
    phase === "robot_speaking"
      ? 0.62 + activeEnergy * 0.35
      : phase === "user_listening"
        ? 0.5 + activeEnergy * 0.35
        : phase === "thinking" || phase === "connecting"
          ? 0.45
          : 0.34;

  const auraGradient =
    phase === "robot_speaking"
      ? "radial-gradient(circle, var(--accent-violet-glow) 0%, rgba(112, 72, 232, 0.14) 44%, transparent 72%)"
      : phase === "user_listening"
        ? "radial-gradient(circle, rgba(34, 211, 238, 0.28) 0%, var(--accent-violet-subtle) 46%, transparent 74%)"
        : "radial-gradient(circle, var(--accent-violet-subtle) 0%, transparent 70%)";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src="/assets/workspace_room_bg.webp"
        alt=""
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-center opacity-40 sm:opacity-45 scale-[1.03]"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 18%, rgba(3, 2, 10, 0.72) 72%, var(--bg-app) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(3, 2, 10, 0.58) 0%, transparent 28%, transparent 66%, var(--bg-app) 98%)",
        }}
      />

      <div
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[min(92vw,580px)] h-[min(92vw,580px)] rounded-full blur-3xl transition-transform duration-150"
        style={{
          transform: `scale(${auraScale})`,
          opacity: auraOpacity,
          background: auraGradient,
        }}
      />

      <div
        className="absolute left-1/2 bottom-[17%] sm:bottom-[15%] -translate-x-1/2 w-[min(76vw,440px)] h-12 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(162, 127, 243, 0.28) 0%, transparent 72%)",
        }}
      />
    </div>
  );
};
