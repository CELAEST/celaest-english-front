import React, { useId } from "react";

export interface IconProps {
  className?: string;
}

/**
 * ReadingSuccessIcon: Clean, luxury modern success badge with organic emerald glow and single crisp geometric checkmark.
 */
export const ReadingSuccessIcon: React.FC<IconProps> = ({
  className = "w-13 h-13 sm:w-15 sm:h-15",
}) => {
  const baseId = useId();
  const softBaseId = `emeraldSoftBase-${baseId}`;
  const borderGradId = `emeraldBorderGrad-${baseId}`;

  return (
    <svg
      className={`shrink-0 transition-transform duration-300 ${className}`}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
    >
      {/* Ambient radial soft glow */}
      <circle
        cx="28"
        cy="28"
        r="24"
        fill={`url(#${softBaseId})`}
      />
      {/* Crisp Precision Boundary */}
      <circle
        cx="28"
        cy="28"
        r="23"
        stroke={`url(#${borderGradId})`}
        strokeWidth="1.75"
      />
      {/* Subtle Top Specular Arc */}
      <path
        d="M13 22C15.5 15.5 21 11.5 28 11.5C35 11.5 40.5 15.5 43 22"
        stroke="#A7F3D0"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />
      {/* Clean, thick geometric checkmark */}
      <path
        d="M19 28.5L25 34.5L37 21.5"
        stroke="#34D399"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <radialGradient
          id={softBaseId}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(28 28) rotate(90) scale(24)"
        >
          <stop stopColor="#064E3B" stopOpacity="0.5" />
          <stop offset="0.8" stopColor="#022c22" stopOpacity="0.2" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id={borderGradId}
          x1="28"
          y1="5"
          x2="28"
          y2="51"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34D399" stopOpacity="0.8" />
          <stop offset="0.6" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="1" stopColor="#059669" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * ComprehensionQuizIcon: Clean, razor-sharp assessment document & pen checklist badge.
 */
export const ComprehensionQuizIcon: React.FC<IconProps> = ({
  className = "w-4.5 h-4.5 sm:w-5 sm:h-5",
}) => (
  <svg
    className={`shrink-0 transition-transform duration-200 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="3" width="16" height="18" rx="2.5" stroke="#C4B5FD" strokeWidth="1.75" />
    <path d="M8 8H16" stroke="#FFFFFF" strokeWidth="1.75" />
    <path d="M8 12H13" stroke="#FFFFFF" strokeWidth="1.75" />
    <path d="M8 16H16" stroke="#A78BFA" strokeWidth="1.5" />
    <circle cx="16" cy="12" r="1.25" fill="#34D399" stroke="none" />
  </svg>
);

/**
 * NextReadingArrowIcon: Bold directional glide arrow with nucleus tail.
 */
export const NextReadingArrowIcon: React.FC<IconProps> = ({
  className = "w-7 h-7 sm:w-8 sm:h-8",
}) => (
  <svg
    className={`shrink-0 transform group-hover:translate-x-1 transition-transform duration-200 ${className}`}
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
  >
    <line
      x1="7"
      y1="16"
      x2="24"
      y2="16"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <polyline
      points="17 9 24.5 16 17 23"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="16" r="1.8" fill="#A78BFA" />
  </svg>
);

/**
 * ChronometerIcon: Large, high-contrast precision stopwatch dial.
 */
export const ChronometerIcon: React.FC<IconProps> = ({
  className = "w-6 h-6 sm:w-7 sm:h-7",
}) => (
  <svg
    className={`shrink-0 text-[#A78BFA] ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Stopwatch crown */}
    <line x1="14" y1="2" x2="14" y2="4.5" strokeWidth="2" />
    <line x1="12" y1="2" x2="16" y2="2" strokeWidth="2" />
    {/* Main Dial */}
    <circle cx="14" cy="16" r="10" strokeWidth="1.8" />
    {/* Cardinal Ticks */}
    <line x1="14" y1="8" x2="14" y2="10" strokeWidth="1.8" />
    <line x1="22" y1="16" x2="20" y2="16" strokeWidth="1.8" />
    <line x1="14" y1="24" x2="14" y2="22" strokeWidth="1.8" />
    <line x1="6" y1="16" x2="8" y2="16" strokeWidth="1.8" />
    {/* Sweep Hand */}
    <line x1="14" y1="16" x2="19" y2="12" stroke="#DDD6FE" strokeWidth="2" />
    <circle cx="14" cy="16" r="2" fill="#FFFFFF" stroke="none" />
  </svg>
);

/**
 * LexiconWordCountIcon: Architectural book & text stack symbol.
 */
export const LexiconWordCountIcon: React.FC<IconProps> = ({
  className = "w-6 h-6 sm:w-7 sm:h-7",
}) => (
  <svg
    className={`shrink-0 text-[#A78BFA] ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Open Book spine & wings */}
    <path
      d="M4 6.5C7.5 5.5 11 6.5 14 8C17 6.5 20.5 5.5 24 6.5V22C20.5 21 17 22 14 23.5C11 22 7.5 21 4 22V6.5Z"
      strokeWidth="1.8"
    />
    <line x1="14" y1="8" x2="14" y2="23.5" strokeWidth="1.8" />
    {/* Text lines */}
    <line x1="7.5" y1="11" x2="11.5" y2="11.5" stroke="#DDD6FE" strokeWidth="1.6" />
    <line x1="7.5" y1="14.5" x2="11.5" y2="15" strokeWidth="1.4" strokeOpacity="0.8" />
    <line x1="16.5" y1="11.5" x2="20.5" y2="11" stroke="#DDD6FE" strokeWidth="1.6" />
    <line x1="16.5" y1="15" x2="20.5" y2="14.5" strokeWidth="1.4" strokeOpacity="0.8" />
  </svg>
);

/**
 * CefrGraduatedTierIcon: Ultra-crisp, high-definition language proficiency milestone icon.
 */
export const CefrGraduatedTierIcon: React.FC<IconProps> = ({
  className = "w-6 h-6 sm:w-7 sm:h-7",
}) => {
  const baseId = useId();
  const gradId = `cefrActiveGrad-${baseId}`;

  return (
    <svg
      className={`shrink-0 text-[#A78BFA] ${className}`}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      {/* Base alignment baseline */}
      <line
        x1="3"
        y1="23.5"
        x2="25"
        y2="23.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      {/* Tier 1 (A: Foundation) */}
      <rect
        x="4.5"
        y="16"
        width="4.5"
        height="6.5"
        rx="1.5"
        fill="#7048E8"
        fillOpacity="0.45"
        stroke="#A78BFA"
        strokeWidth="1.5"
      />
      {/* Tier 2 (B: Active Target - Highlighted) */}
      <rect
        x="11.75"
        y="10.5"
        width="4.5"
        height="12"
        rx="1.5"
        fill={`url(#${gradId})`}
        stroke="#DDD6FE"
        strokeWidth="1.75"
      />
      {/* Tier 3 (C: Advanced Mastery) */}
      <rect
        x="19"
        y="5"
        width="4.5"
        height="17.5"
        rx="1.5"
        fill="#7048E8"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />
      {/* Milestone Active Beacon Pin above Tier 2 */}
      <circle cx="14" cy="6" r="2" fill="#FFFFFF" />
      <defs>
        <linearGradient
          id={gradId}
          x1="11.75"
          y1="10.5"
          x2="16.25"
          y2="22.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DDD6FE" />
          <stop offset="1" stopColor="#7048E8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * ReturnArrowIcon: Crisp leftward return chevron.
 */
export const ReturnArrowIcon: React.FC<IconProps> = ({
  className = "w-4 h-4",
}) => (
  <svg
    className={`shrink-0 transform group-hover:-translate-x-1 transition-transform duration-200 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

/* =========================================================================
   WORD LOOKUP MODAL BESPOKE HD ICONS
   ========================================================================= */

/**
 * VocabloTranslateIcon: Overlapping speech/translation bubbles for bilingual bridge.
 */
export const VocabloTranslateIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-[#C4B5FD]",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    {/* Left/Main Bubble */}
    <path
      d="M10 9V4C10 2.89543 9.10457 2 8 2H3C1.89543 2 1 2.89543 1 4V7C1 8.10457 1.89543 9 3 9H4V11L6.5 9H8"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right Accent Bubble */}
    <path
      d="M10.5 5.5H13C14.1046 5.5 15 6.39543 15 7.5V10.5C15 11.6046 14.1046 12.5 13 12.5H12V14L9.5 12.5H8C6.89543 12.5 6 11.6046 6 10.5V9.5"
      stroke="#A27FF3"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.85"
    />
  </svg>
);

/**
 * MemoryBankSaveIcon: Synaptic node + plus symbol for adding to memory.
 */
export const MemoryBankSaveIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-[#C4B5FD]",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    {/* Micro Synaptic Node */}
    <circle cx="6.5" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="6.5" cy="8" r="1.5" fill="currentColor" />
    {/* Plus trigger badge on right */}
    <path
      d="M12.5 5V11M9.5 8H15.5"
      stroke="#DDD6FE"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/* =========================================================================
   PREPARING VIEW BESPOKE HD TIMELINE ICONS
   ========================================================================= */

/**
 * StepCompletedCheckIcon: Crisp, thick geometric checkmark for completed steps.
 */
export const StepCompletedCheckIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-white",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3.5 8.5L6.5 11.5L12.5 4.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * StepTopicTargetIcon: Precision focal crosshair / topic selection beacon.
 */
export const StepTopicTargetIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-[#C4B5FD]",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
    <path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/**
 * StepPersonalizeDnaIcon: Clean diagonal micro double-helix for Step 2 timeline node.
 */
export const StepPersonalizeDnaIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-[#C4B5FD]",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <line x1="4" y1="10" x2="6" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="6" y1="8" x2="8" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="8" y1="6" x2="10" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="10" y1="4" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path
      d="M3 11 C 5 13, 6 11, 8 8 C 10 5, 11 3, 13 5"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M5 13 C 3 11, 5 10, 8 8 C 11 6, 10 5, 11 3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * StepFinalizeBookIcon: Clean micro architectural codex for Step 3 timeline node.
 */
export const StepFinalizeBookIcon: React.FC<IconProps> = ({
  className = "w-3.5 h-3.5 text-[#C4B5FD]",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 4.2C4.5 3.5 6.5 4.2 8 5.2C9.5 4.2 11.5 3.5 13.5 4.2V12.2C11.5 11.5 9.5 12.2 8 13.2C6.5 12.2 4.5 11.5 2.5 12.2Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="8" y1="5.2" x2="8" y2="13.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

/* =========================================================================
   ULTRA-LUXURY BESPOKE AI SYNTHESIS NEXUS HOLOGRAPHIC ICONS (CENTERPIECE)
   ========================================================================= */

/**
 * NexusTopicRadarIcon: Clean precision crosshair radar — minimal concentric rings + clean reticle lines + solid core.
 */
export const NexusTopicRadarIcon: React.FC<IconProps> = ({
  className = "w-11 h-11 sm:w-12 sm:h-12",
}) => {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {/* Outer Ring — thin, clean */}
      <circle
        cx="24" cy="24" r="18"
        stroke="#C4B5FD"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Inner Ring — medium, solid */}
      <circle
        cx="24" cy="24" r="11"
        stroke="#C4B5FD"
        strokeWidth="1.5"
      />

      {/* Crosshair Lines — clean, extend from ring edges outward */}
      <line x1="24" y1="4" x2="24" y2="13" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="35" x2="24" y2="44" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="24" x2="13" y2="24" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="35" y1="24" x2="44" y2="24" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" />

      {/* Core — clean solid white dot */}
      <circle cx="24" cy="24" r="3" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * NexusNeuralDnaIcon: Sleek 45-degree diagonal DNA helix representing linguistic synthesis.
 * Tilted orientation eliminates any vertical symmetry / anthropomorphic artifact.
 */
export const NexusNeuralDnaIcon: React.FC<IconProps> = ({
  className = "w-11 h-11 sm:w-12 sm:h-12",
}) => {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {/* 45° Diagonal Base Pair Rungs */}
      <line x1="11" y1="31" x2="17" y2="37" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
      <line x1="18" y1="24" x2="24" y2="30" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="24" y1="18" x2="30" y2="24" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
      <line x1="31" y1="11" x2="37" y2="17" stroke="#DDD6FE" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />

      {/* Strand A (Upper Wave) — continuous 45° flowing curve */}
      <path
        d="M8 32 C 14 38, 16 34, 24 24 C 32 14, 30 10, 36 16"
        stroke="#C4B5FD"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Strand B (Lower Wave) — continuous 45° flowing curve */}
      <path
        d="M12 40 C 18 34, 20 38, 24 24 C 28 10, 34 14, 40 8"
        stroke="#C4B5FD"
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Central Diamond Energy Photon */}
      <circle cx="24" cy="24" r="2" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * NexusLexiconCodexIcon: Architectural minimal open codex (Apple SF Symbols & Linear standard).
 * Features natural curved page wings, layered bottom depth, editorial paragraph etchings,
 * and a luxury hanging bookmark ribbon. Zero cartoon clunkiness.
 */
export const NexusLexiconCodexIcon: React.FC<IconProps> = ({
  className = "w-11 h-11 sm:w-12 sm:h-12",
}) => {
  return (
    <svg
      className={`shrink-0 ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {/* Bottom Layer Page Depth (Physical book volume feel) */}
      <path
        d="M7 36 V 38 C 15 36, 24 39, 24 39 C 24 39, 33 36, 41 38 V 36"
        stroke="#7048E8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.6"
      />

      {/* Main Left Page Wing */}
      <path
        d="M7 13.5 C 15 11.5, 24 14, 24 14 V 37 C 24 37, 15 34.5, 7 36 Z"
        stroke="#C4B5FD"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Right Page Wing */}
      <path
        d="M41 13.5 C 33 11.5, 24 14, 24 14 V 37 C 24 37, 33 34.5, 41 36 Z"
        stroke="#C4B5FD"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Luminous Book Spine */}
      <line x1="24" y1="14" x2="24" y2="37" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />

      {/* Luxury Hanging Bookmark Ribbon */}
      <path
        d="M22 14 V 23 L 24 21.2 L 26 23 V 14"
        fill="#7048E8"
        fillOpacity="0.8"
        stroke="#DDD6FE"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Page — Editorial Paragraph Etchings */}
      <line x1="12" y1="20" x2="19" y2="20.8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12" y1="25" x2="19" y2="25.8" stroke="#DDD6FE" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="12" y1="30" x2="16.5" y2="30.6" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />

      {/* Right Page — Editorial Paragraph Etchings */}
      <line x1="29" y1="20.8" x2="36" y2="20" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="29" y1="25.8" x2="36" y2="25" stroke="#DDD6FE" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8" />
      <line x1="29" y1="30.6" x2="33.5" y2="30" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
  );
};
