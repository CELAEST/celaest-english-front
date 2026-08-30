import React, { useMemo } from "react";
import { useMicVolume } from "../hooks/micVolumeStore";

export interface ConversationWaveformSpectrumProps {
  bars?: number;
  animated?: boolean;
  isListening?: boolean;
}

// Deterministic pseudo-random helper so render matches consistently
function seeded(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export const ConversationWaveformSpectrum: React.FC<ConversationWaveformSpectrumProps> = ({
  bars = 75,
  animated = true,
  isListening = true,
}) => {
  const micVolume = useMicVolume();
  const data = useMemo(() => {
    const center = (bars - 1) / 2;
    return Array.from({ length: bars }, (_, i) => {
      const dist = Math.abs(i - center) / center;
      const envelope = 0.32 + 0.68 * Math.pow(1 - dist, 0.85);
      const noise = 0.5 * seeded(i) + 0.3 * seeded(i * 3.1) + 0.2 * seeded(i * 7.7);
      const spike = seeded(i * 2.3) > 0.82 ? 0.4 : 0;
      const raw = envelope * (0.45 + 0.55 * noise) + spike;
      const h = Math.max(0.12, Math.min(1, raw));
      return { h, dist };
    });
  }, [bars]);

  // Amplify bars if live mic audio is detected
  const volumeMultiplier = 1 + micVolume * 2.5;

  return (
    <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto h-[clamp(30px,4.5vh,52px)] relative flex items-center justify-center select-none z-10 shrink-0">
      {/* Inline keyframe animation styles for wf-bar */}
      <style>{`
        @keyframes wfBarPulse {
          0%, 100% { transform: scaleY(0.45); }
          50% { transform: scaleY(1.25); }
        }
        .wf-bar-anim {
          animation: wfBarPulse ease-in-out infinite;
        }
      `}</style>

      {/* Faint horizontal baseline glow spanning full width */}
      <div
        className="absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(162,127,243,0.06) 12%, rgba(162,127,243,0.55) 50%, rgba(162,127,243,0.06) 88%, transparent 100%)",
          filter: "blur(0.5px)",
          opacity: isListening ? 1 : 0.3,
        }}
      />

      {/* Bars */}
      <div className="relative flex items-center justify-center gap-[2.5px] sm:gap-[3px] md:gap-[3.5px] lg:gap-[4px] w-full h-full">
        {data.map(({ h }, i) => {
          const dynamicHeight = Math.min(44, Math.max(3.5, h * 32 * volumeMultiplier));
          const px = `${dynamicHeight.toFixed(2)}px`;
          const baseOpacity = isListening ? 0.32 + h * 0.68 : 0.15 + h * 0.35;
          const opacity = Math.min(1, baseOpacity + micVolume * 0.4).toFixed(3);
          const glow = (2 + h * 6 + micVolume * 8).toFixed(2);
          const dur = (1.6 + seeded(i * 5) * 0.3).toFixed(3);
          const delay = (-(i / bars) * 1.6 - seeded(i) * 0.15).toFixed(3);

          return (
            <span
              key={i}
              className={animated && isListening ? "wf-bar-anim" : ""}
              style={{
                display: "block",
                flexShrink: 0,
                width: "2px",
                height: px,
                borderRadius: "2px",
                backgroundColor: `rgba(162,127,243,${opacity})`,
                boxShadow:
                  isListening || micVolume > 0.05 ? `0 0 ${glow}px rgba(162,127,243,0.7)` : "none",
                transformOrigin: "center",
                animationDuration: `${dur}s`,
                animationDelay: `${delay}s`,
                animationPlayState: isListening ? "running" : "paused",
                transition: "height 0.1s ease, background-color 0.2s ease",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
