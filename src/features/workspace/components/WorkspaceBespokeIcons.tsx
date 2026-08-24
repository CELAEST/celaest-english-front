import React from 'react';

export interface WorkspaceIconProps {
  className?: string;
}

/**
 * 1. CognitiveMemoryBrainIcon: Bespoke, luxury cognitive neural brain for "LAST MEMORY".
 * Features dual cerebral hemisphere contours with anatomical neural gyri folds,
 * central intelligence fissure, and synaptic micro-nodes.
 */
export const CognitiveMemoryBrainIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Left Cerebral Hemisphere Outer Arc */}
    <path d="M14 5 C 10.5 5, 7.5 6.8, 6.8 9.5 C 4 10.8, 3 14, 3.8 17 C 3.2 19.8, 5 22.5, 7.5 23.2 C 8.8 24.5, 11 24.5, 14 23.5" />

    {/* Right Cerebral Hemisphere Outer Arc */}
    <path d="M14 5 C 17.5 5, 20.5 6.8, 21.2 9.5 C 24 10.8, 25 14, 24.2 17 C 24.8 19.8, 23 22.5, 20.5 23.2 C 19.2 24.5, 17 24.5, 14 23.5" />

    {/* Central Luminous Fissure */}
    <line x1="14" y1="5" x2="14" y2="23.5" stroke="#FFFFFF" strokeWidth="1.6" />

    {/* Left Hemisphere Neural Fold Paths */}
    <path d="M7 13.5 C 9.5 13.5, 11 11.5, 14 11.5" strokeWidth="1.4" />
    <path d="M7 18 C 9.5 18, 11 17, 14 17" strokeWidth="1.4" strokeOpacity="0.85" />
    <circle cx="7" cy="13.5" r="1" fill="#FFFFFF" stroke="none" />

    {/* Right Hemisphere Neural Fold Paths */}
    <path d="M21 13.5 C 18.5 13.5, 17 11.5, 14 11.5" strokeWidth="1.4" />
    <path d="M21 18 C 18.5 18, 17 17, 14 17" strokeWidth="1.4" strokeOpacity="0.85" />
    <circle cx="21" cy="13.5" r="1" fill="#FFFFFF" stroke="none" />
  </svg>
);

/**
 * 2. PrecisionOpenBookIcon: Bespoke architectural open knowledge codex for "NEXT READING".
 * Features curved page wings, layered bottom depth, white luminous spine, and editorial text etchings.
 */
export const PrecisionOpenBookIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Bottom Layer Page Depth */}
    <path
      d="M4 21.5 V 22.5 C 8.5 21.2, 14 23, 14 23 C 14 23, 19.5 21.2, 24 22.5 V 21.5"
      strokeWidth="1.3"
      strokeOpacity="0.5"
    />

    {/* Left Page Wing */}
    <path d="M4 6.5 C 8.5 5.5, 14 7, 14 7 V 21.5 C 14 21.5, 8.5 20, 4 21 Z" />

    {/* Right Page Wing */}
    <path d="M24 6.5 C 19.5 5.5, 14 7, 14 7 V 21.5 C 14 21.5, 19.5 20, 24 21 Z" />

    {/* Central Luminous Book Spine */}
    <line x1="14" y1="7" x2="14" y2="21.5" stroke="#FFFFFF" strokeWidth="1.6" />

    {/* Left Page Text Lines */}
    <line x1="7.5" y1="11" x2="11" y2="11.5" strokeWidth="1.3" />
    <line x1="7.5" y1="14.5" x2="11" y2="15" strokeWidth="1.2" strokeOpacity="0.8" />
    <line x1="7.5" y1="17.5" x2="9.8" y2="17.8" strokeWidth="1.1" strokeOpacity="0.6" />

    {/* Right Page Text Lines */}
    <line x1="17" y1="11.5" x2="20.5" y2="11" strokeWidth="1.3" />
    <line x1="17" y1="15" x2="20.5" y2="14.5" strokeWidth="1.2" strokeOpacity="0.8" />
    <line x1="18.2" y1="17.8" x2="20.5" y2="17.5" strokeWidth="1.1" strokeOpacity="0.6" />
  </svg>
);

/**
 * 3. StudioVoiceMicIcon: Bespoke studio vocal condenser microphone for "UPCOMING INTERVIEW".
 * Features metallic capsule, acoustic soundwave pulses, suspension cradle, and stable stand.
 */
export const StudioVoiceMicIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Outer Acoustic Resonance Waves */}
    <path
      d="M3.5 10 C 2.5 12 2.5 14.5 3.5 16.5"
      strokeWidth="1.3"
      strokeOpacity="0.55"
      className="transition-all duration-300 group-hover:stroke-white group-hover:stroke-opacity-90"
    />
    <path
      d="M24.5 10 C 25.5 12 25.5 14.5 24.5 16.5"
      strokeWidth="1.3"
      strokeOpacity="0.55"
      className="transition-all duration-300 group-hover:stroke-white group-hover:stroke-opacity-90"
    />

    {/* Microphone Capsule */}
    <rect x="10.5" y="3.5" width="7" height="12" rx="3.5" />

    {/* Microphone Grill Line & Acoustic Diaphragm */}
    <line x1="10.5" y1="8" x2="17.5" y2="8" stroke="#FFFFFF" strokeWidth="1.3" />
    <circle cx="14" cy="8" r="1" fill="#FFFFFF" stroke="none" />

    {/* Acoustic Suspension Cradle */}
    <path d="M6.5 11.5 C 6.5 16 9.8 19 14 19 C 18.2 19 21.5 16 21.5 11.5" strokeWidth="1.6" />

    {/* Stand Stem */}
    <line x1="14" y1="19" x2="14" y2="23.5" strokeWidth="1.6" />

    {/* Stand Base */}
    <line x1="10" y1="23.5" x2="18" y2="23.5" stroke="#FFFFFF" strokeWidth="1.6" />
  </svg>
);
