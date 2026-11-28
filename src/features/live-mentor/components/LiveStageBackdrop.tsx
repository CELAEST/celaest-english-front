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
  const lightOpacity =
    phase === "robot_speaking"
      ? 0.28 + activeEnergy * 0.25
      : phase === "user_listening"
        ? 0.24 + activeEnergy * 0.24
        : 0.14;

  const lightGradient =
    phase === "user_listening"
      ? "radial-gradient(ellipse at 50% 42%, rgba(56, 189, 248, 0.22) 0%, transparent 66%)"
      : "radial-gradient(ellipse at 50% 42%, rgba(167, 139, 250, 0.22) 0%, transparent 66%)";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050508]">
      <img
        src="/assets/live_stage_desktop.jpg"
        alt=""
        loading="eager"
        decoding="async"
        className="hidden sm:block w-full h-full object-cover object-center opacity-90"
      />
      <img
        src="/assets/live_stage_mobile.jpg"
        alt=""
        loading="eager"
        decoding="async"
        className="block sm:hidden w-full h-full object-cover object-center opacity-90"
      />

      <div
        className="absolute inset-0 sm:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 32%, rgba(5, 5, 8, 0.45) 78%, rgba(5, 5, 8, 0.85) 100%)",
        }}
      />
      <div
        className="hidden sm:block absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, transparent 38%, rgba(5, 5, 10, 0.25) 78%, rgba(5, 5, 10, 0.62) 100%)",
        }}
      />

      <div
        className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 w-[min(86vw,540px)] h-[min(86vw,540px)] rounded-full blur-3xl transition-opacity duration-300"
        style={{
          opacity: lightOpacity,
          background: lightGradient,
        }}
      />
    </div>
  );
};
