import React from "react";

export interface WorkspaceIconProps {
  className?: string;
}

/**
 * Lingua bespoke icon system.
 * Style rule: 1.5px stroke, round caps, one filled "pearl" dot per icon —
 * the recurring brand mark (the orb). Paths with className="icon-draw"
 * draw themselves on group hover; pearls pulse (see index.css).
 */

/** CognitiveMemoryBrainIcon: memory as a neural graph — nodes linked to a core pearl. */
export const CognitiveMemoryBrainIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path
      className="icon-draw"
      pathLength={1}
      d="M12 12 L6.2 7.6 M12 12 l5.8 -4.4 M12 12 l-5.8 4.4 M12 12 l5.8 4.4"
    />
    <circle cx="5.2" cy="7" r="1.7" />
    <circle cx="18.8" cy="7" r="1.7" />
    <circle cx="5.2" cy="17" r="1.7" />
    <circle cx="18.8" cy="17" r="1.7" />
    <circle className="icon-pearl" cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

/** PrecisionOpenBookIcon: open codex with a luminous pearl on the page. */
export const PrecisionOpenBookIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      className="icon-draw"
      pathLength={1}
      d="M3 6.2 C6 4.6 9 4.6 12 6.2 C15 4.6 18 4.6 21 6.2 V17.8 C18 16.2 15 16.2 12 17.8 C9 16.2 6 16.2 3 17.8 Z"
    />
    <path className="icon-draw" pathLength={1} d="M12 6.4 V17.6" />
    <circle className="icon-pearl" cx="16.6" cy="9.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/** StudioVoiceMicIcon: condenser mic flanked by two signal pearls. */
export const StudioVoiceMicIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <rect className="icon-draw" pathLength={1} x="9.4" y="3" width="5.2" height="10" rx="2.6" />
    <path className="icon-draw" pathLength={1} d="M6 11 a6 6 0 0 0 12 0 M12 17 v3.4" />
    <circle className="icon-pearl" cx="5.2" cy="7.4" r="1.05" fill="currentColor" stroke="none" />
    <circle className="icon-pearl" cx="18.8" cy="7.4" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);
