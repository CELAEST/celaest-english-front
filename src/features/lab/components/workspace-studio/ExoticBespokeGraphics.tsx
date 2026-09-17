import React from "react";

/**
 * Animated multi-ring optical quantum gyroscope.
 */
export const ExoticGyroscopeGraphic: React.FC<{ className?: string }> = ({
  className = "w-14 h-14",
}) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Outer rotating dashed ring */}
    <svg
      className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]"
      viewBox="0 0 60 60"
      fill="none"
    >
      <circle
        cx="30"
        cy="30"
        r="27"
        stroke="#8B5CF6"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity="0.4"
      />
    </svg>

    {/* Counter-rotating segmented middle ring */}
    <svg
      className="absolute inset-1.5 w-[85%] h-[85%] animate-[spin_10s_linear_infinite_reverse]"
      viewBox="0 0 60 60"
      fill="none"
    >
      <circle
        cx="30"
        cy="30"
        r="23"
        stroke="#C4B5FD"
        strokeWidth="1.2"
        strokeDasharray="18 10 6 10"
        opacity="0.7"
      />
      <circle cx="30" cy="7" r="2" fill="#DDD6FE" />
      <circle cx="30" cy="53" r="2" fill="#A27FF3" />
    </svg>

    {/* Inner glowing pulse core */}
    <div className="relative w-4 h-4 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#DDD6FE] shadow-[0_0_15px_#A27FF3] flex items-center justify-center animate-pulse">
      <div className="w-1.5 h-1.5 rounded-full bg-white" />
    </div>
  </div>
);

/**
 * Animated soundwave spectrum bars for 48kHz audio.
 */
export const ExoticAudioSpectrumGraphic: React.FC<{ className?: string }> = ({
  className = "h-4",
}) => (
  <div className={`flex items-end gap-[3px] ${className}`}>
    {[
      "animate-[pulse_1.2s_ease-in-out_infinite]",
      "animate-[pulse_0.8s_ease-in-out_infinite_150ms]",
      "animate-[pulse_1.5s_ease-in-out_infinite_300ms]",
      "animate-[pulse_0.9s_ease-in-out_infinite_450ms]",
      "animate-[pulse_1.3s_ease-in-out_infinite_200ms]",
      "animate-[pulse_0.7s_ease-in-out_infinite_350ms]",
    ].map((anim, i) => (
      <span
        key={i}
        className={`w-[2.5px] rounded-full bg-gradient-to-t from-[#7C3AED] to-[#DDD6FE] ${anim}`}
        style={{ height: `${25 + (i * 17) % 75}%` }}
      />
    ))}
  </div>
);

/**
 * Geometric Diamond Glyph Rune.
 */
export const ExoticDiamondRuneIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="16 2 30 16 16 30 2 16" stroke="#8B5CF6" opacity="0.6" />
    <polygon points="16 7 25 16 16 25 7 16" stroke="#C4B5FD" />
    <circle cx="16" cy="16" r="2.5" fill="#DDD6FE" stroke="none" />
    <line x1="16" y1="2" x2="16" y2="7" stroke="#A27FF3" />
    <line x1="16" y1="25" x2="16" y2="30" stroke="#A27FF3" />
    <line x1="2" y1="16" x2="7" y2="16" stroke="#A27FF3" />
    <line x1="25" y1="16" x2="30" y2="16" stroke="#A27FF3" />
  </svg>
);

/**
 * Optical Target Reticle crosshair.
 */
export const ExoticReticleIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <circle cx="10" cy="10" r="7" stroke="#A27FF3" strokeDasharray="3 2" />
    <circle cx="10" cy="10" r="2" fill="#DDD6FE" />
    <line x1="10" y1="0" x2="10" y2="4" stroke="#DDD6FE" />
    <line x1="10" y1="16" x2="10" y2="20" stroke="#DDD6FE" />
    <line x1="0" y1="10" x2="4" y2="10" stroke="#DDD6FE" />
    <line x1="16" y1="10" x2="20" y2="10" stroke="#DDD6FE" />
  </svg>
);
