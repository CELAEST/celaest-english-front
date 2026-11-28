import React from "react";
import { LiveBackdropId } from "../data/liveStageBackdrops";
import { LiveCallPhase } from "../types";

interface LiveStageBackdropProps {
  backdropId: LiveBackdropId;
  phase: LiveCallPhase;
  micLevel: number;
  speakerLevel: number;
}

const BACKDROP_STYLES: Partial<Record<LiveBackdropId, React.CSSProperties>> = {
  nordic_dawn: {
    background:
      "linear-gradient(180deg, #0b1024 0%, #172347 40%, #372d4d 64%, #111320 75%, #06070d 100%)",
  },
  cozy_loft: {
    background: "radial-gradient(circle at 50% 20%, #342a33 0%, #1a1720 46%, #0b0a0f 100%)",
  },
  celestial_sky: {
    backgroundImage: [
      "radial-gradient(1px 1px at 14% 22%, rgba(255,255,255,0.45), transparent)",
      "radial-gradient(1px 1px at 28% 12%, rgba(255,255,255,0.3), transparent)",
      "radial-gradient(1.5px 1.5px at 44% 18%, rgba(224,231,255,0.4), transparent)",
      "radial-gradient(1px 1px at 67% 14%, rgba(255,255,255,0.35), transparent)",
      "radial-gradient(1.5px 1.5px at 82% 26%, rgba(199,210,254,0.42), transparent)",
      "radial-gradient(1px 1px at 91% 19%, rgba(255,255,255,0.28), transparent)",
      "linear-gradient(180deg, #050713 0%, #0f1738 58%, #080b14 100%)",
    ].join(", "),
  },
  velvet_studio: {
    background:
      "radial-gradient(ellipse at 50% 6%, rgba(148,163,184,0.26) 0%, #1a1e29 38%, #090a0f 78%, #050508 100%)",
  },
  golden_hour: {
    background:
      "linear-gradient(180deg, #0d1630 0%, #1d2c52 34%, #5c3a44 58%, #8f533c 67%, #141118 78%, #07060a 100%)",
  },
};

export const LiveStageBackdrop: React.FC<LiveStageBackdropProps> = ({
  backdropId,
  phase,
  micLevel,
  speakerLevel,
}) => {
  const activeEnergy =
    phase === "robot_speaking" ? speakerLevel : phase === "user_listening" ? micLevel : 0;
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
    <div
      aria-hidden="true"
      data-backdrop={backdropId}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050508]"
      style={BACKDROP_STYLES[backdropId]}
    >
      {backdropId === "pavilion" && (
        <>
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
        </>
      )}

      {backdropId === "nordic_dawn" && (
        <>
          <div
            className="absolute inset-x-0 top-[52%] h-44 blur-3xl opacity-65"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(244, 162, 124, 0.34) 0%, rgba(139, 92, 246, 0.18) 45%, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-[28%] border-t border-white/[0.06]"
            style={{
              background: "linear-gradient(180deg, rgba(19, 21, 36, 0.52) 0%, #05060b 100%)",
            }}
          />
        </>
      )}

      {backdropId === "cozy_loft" && (
        <>
          <div
            className="hidden sm:block absolute -left-24 top-12 w-[420px] h-[420px] rounded-full blur-3xl opacity-45"
            style={{
              background: "radial-gradient(circle, rgba(251, 191, 36, 0.32) 0%, transparent 70%)",
            }}
          />
          <div
            className="hidden sm:block absolute -right-24 top-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(96, 165, 250, 0.24) 0%, transparent 70%)",
            }}
          />
        </>
      )}

      {backdropId === "celestial_sky" && (
        <div
          className="absolute inset-x-0 bottom-0 h-56 blur-3xl opacity-65"
          style={{
            background:
              "radial-gradient(ellipse at 50% 95%, rgba(99, 102, 241, 0.28) 0%, transparent 72%)",
          }}
        />
      )}

      {backdropId === "golden_hour" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 58%, rgba(251, 166, 98, 0.34) 0%, transparent 72%)",
          }}
        />
      )}

      <div
        className="absolute left-1/2 top-[43%] -translate-x-1/2 -translate-y-1/2 w-[min(86vw,540px)] h-[min(86vw,540px)] rounded-full blur-3xl transition-opacity duration-300"
        style={{ opacity: lightOpacity, background: lightGradient }}
      />
    </div>
  );
};
