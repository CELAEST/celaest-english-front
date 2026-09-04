import React from "react";

export interface WorkspaceIconProps {
  className?: string;
}

/**
 * CELAEST Lingua Bespoke Vector Icon Suite (Swiss Precision HUD Standard)
 * Master engineered vector artwork with 1.5px primary stroke, optical balance,
 * SVG path length draw animations, and glowing lavender pearl accents (#C4B5FD).
 */

/**
 * 1. CognitiveMemoryBrainIcon:
 * Anatomical dual-hemisphere cerebral cortex with flowing synaptic gyri folds,
 * central fissure, micro-connection nodes, and radiant lavender pearl nucleus.
 */
export const CognitiveMemoryBrainIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Dual Cerebral Hemispheres Contour */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 5.5 C 11.2 3.2, 5.2 4.2, 4.8 9.6 C 4.4 13.8, 7.2 17.2, 10.5 17.8 C 11.6 20.2, 13 22.5, 14 22.5 C 15 22.5, 16.4 20.2, 17.5 17.8 C 20.8 17.2, 23.6 13.8, 23.2 9.6 C 22.8 4.2, 16.8 3.2, 14 5.5 Z"
    />
    {/* Internal Cerebral Gyri & Fissure */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 9.5 9.8 C 9.5 12.2, 11.4 13.8, 14 13.8 C 16.6 13.8, 18.5 12.2, 18.5 9.8"
      opacity={0.85}
    />
    <line x1="14" y1="5.5" x2="14" y2="22.5" className="icon-draw" pathLength={1} opacity={0.6} />
    {/* Synaptic Nodes */}
    <circle cx="8" cy="8.5" r="0.9" fill="#C4B5FD" stroke="none" />
    <circle cx="20" cy="8.5" r="0.9" fill="#C4B5FD" stroke="none" />
    {/* Radiant Lavender Pearl Nucleus */}
    <circle className="icon-pearl" cx="14" cy="13.8" r="1.6" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 2. PrecisionOpenBookIcon:
 * Architectural open folio codex with 3D perspective curvature,
 * clean vertical binding spine, delicate typography etchings, and radiant diamond pearl.
 */
export const PrecisionOpenBookIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Left Folio Wing */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 7 C 10.5 5.4, 6.5 5.4, 3.8 7.2 V 19.8 C 6.5 18.2, 10.5 18.2, 14 20 Z"
    />
    {/* Right Folio Wing */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 7 C 17.5 5.4, 21.5 5.4, 24.2 7.2 V 19.8 C 21.5 18.2, 17.5 18.2, 14 20 Z"
    />
    {/* Central Spine */}
    <line x1="14" y1="7" x2="14" y2="20" className="icon-draw" pathLength={1} opacity={0.8} />
    {/* Editorial Micro-Etchings */}
    <line x1="6.8" y1="10.8" x2="11.2" y2="10.8" className="icon-draw" pathLength={1} opacity={0.5} strokeWidth="1.2" />
    <line x1="6.8" y1="13.8" x2="11.2" y2="13.8" className="icon-draw" pathLength={1} opacity={0.5} strokeWidth="1.2" />
    <line x1="16.8" y1="10.8" x2="21.2" y2="10.8" className="icon-draw" pathLength={1} opacity={0.5} strokeWidth="1.2" />
    <line x1="16.8" y1="13.8" x2="21.2" y2="13.8" className="icon-draw" pathLength={1} opacity={0.5} strokeWidth="1.2" />
    {/* Center Radiant Diamond Pearl */}
    <path
      className="icon-pearl"
      d="M 14 12 L 15.5 14.2 L 14 16.4 L 12.5 14.2 Z"
      fill="#C4B5FD"
      stroke="none"
    />
  </svg>
);

/**
 * 3. StudioVoiceMicIcon:
 * Professional broadcast condenser microphone capsule with acoustic mesh grid,
 * U-suspension gimbal cradle, vertical stand, and luminous signal indicator beacon.
 */
export const StudioVoiceMicIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Condenser Capsule Dome */}
    <rect
      className="icon-draw"
      pathLength={1}
      x="10"
      y="4.5"
      width="8"
      height="12.5"
      rx="4"
    />
    {/* Acoustic Diaphragm Mesh Seam */}
    <line x1="10" y1="10" x2="18" y2="10" className="icon-draw" pathLength={1} opacity={0.7} />
    {/* U-Gimbal Suspension Cradle */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 6.8 12.5 C 6.8 17.5, 10.2 21.2, 14 21.2 C 17.8 21.2, 21.2 17.5, 21.2 12.5"
    />
    {/* Stand Stem & Base */}
    <line x1="14" y1="21.2" x2="14" y2="24.5" className="icon-draw" pathLength={1} />
    <line x1="10.5" y1="24.5" x2="17.5" y2="24.5" className="icon-draw" pathLength={1} />
    {/* Live Signal Beacon Pearl */}
    <circle className="icon-pearl" cx="14" cy="7.8" r="1.3" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 4. TechnicalWritingQuillIcon / LexicalPenIcon:
 * Drafting fountain pen with precision isometric nib, ink channel slit,
 * breather orifice node, and dynamic elevation angle.
 */
export const TechnicalWritingQuillIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Pen Body & Beveled Barrel */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14.5 3.5 L 24.5 13.5 L 12.5 24.5 L 3.5 24.5 L 3.5 15.5 Z"
    />
    {/* Nib Slit & Ink Resonator */}
    <line x1="3.5" y1="24.5" x2="10.5" y2="17.5" className="icon-draw" pathLength={1} opacity={0.8} />
    <line x1="13" y1="5" x2="23" y2="15" className="icon-draw" pathLength={1} opacity={0.4} />
    {/* Collar Ring */}
    <line x1="10.5" y1="17.5" x2="16.5" y2="11.5" className="icon-draw" pathLength={1} opacity={0.7} />
    {/* Breather Node Pearl */}
    <circle className="icon-pearl" cx="10.5" cy="17.5" r="1.3" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 5. QuantumNeuralGaugeIcon / TopicRadarIcon:
 * Polar coordinate convergence radar with 4 cardinal optical ticks,
 * segmented outer ring, and central focal nucleus.
 */
export const QuantumNeuralGaugeIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Concentric Polar Circles */}
    <circle cx="14" cy="14" r="9.5" className="icon-draw" pathLength={1} opacity={0.4} strokeDasharray="3 2" />
    <circle cx="14" cy="14" r="6" className="icon-draw" pathLength={1} />
    {/* 4 Cardinal Calibration Crosshairs */}
    <line x1="14" y1="2.5" x2="14" y2="5" className="icon-draw" pathLength={1} />
    <line x1="14" y1="23" x2="14" y2="25.5" className="icon-draw" pathLength={1} />
    <line x1="2.5" y1="14" x2="5" y2="14" className="icon-draw" pathLength={1} />
    <line x1="23" y1="14" x2="25.5" y2="14" className="icon-draw" pathLength={1} />
    {/* Focal Nucleus Pearl */}
    <circle className="icon-pearl" cx="14" cy="14" r="1.8" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 6. MasteryCefrPrismIcon:
 * Multi-faceted isometric diamond prism representing European CEFR language tiers.
 */
export const MasteryCefrPrismIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Upper Table Facet */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 3.5 L 23 8.5 L 14 13.5 L 5 8.5 Z"
    />
    {/* Lower Pavilion Left Facet */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 5 8.5 L 14 24.5 L 14 13.5 Z"
      opacity={0.85}
    />
    {/* Lower Pavilion Right Facet */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 23 8.5 L 14 24.5 L 14 13.5 Z"
      opacity={0.85}
    />
    {/* Internal Apex Pearl */}
    <circle className="icon-pearl" cx="14" cy="13.5" r="1.6" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 7. CryptographicVaultShieldIcon:
 * Hexagonal security vault shield protecting personal linguistic memory.
 */
export const CryptographicVaultShieldIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Hexagonal Outer Contour */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 3.5 L 23 8.5 V 19.5 L 14 24.5 L 5 19.5 V 8.5 Z"
    />
    {/* Inner Keyhole Security Geometry */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M 14 9.5 C 12.3 9.5, 11 10.8, 11 12.5 C 11 13.8, 11.8 14.8, 13 15.2 V 18.5 H 15 V 15.2 C 16.2 14.8, 17 13.8, 17 12.5 C 17 10.8, 15.7 9.5, 14 9.5 Z"
      opacity={0.9}
    />
    {/* Vault Core Pearl */}
    <circle className="icon-pearl" cx="14" cy="12.5" r="1.3" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 8. SonicAcousticSpectrumIcon:
 * Logarithmic multi-harmonic audio frequency bars with rounded terminals.
 */
export const SonicAcousticSpectrumIcon: React.FC<WorkspaceIconProps> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="11" x2="5" y2="17" className="icon-draw" pathLength={1} opacity={0.6} />
    <line x1="9.5" y1="7.5" x2="9.5" y2="20.5" className="icon-draw" pathLength={1} opacity={0.8} />
    <line x1="14" y1="4" x2="14" y2="24" className="icon-draw" pathLength={1} />
    <line x1="18.5" y1="7.5" x2="18.5" y2="20.5" className="icon-draw" pathLength={1} opacity={0.8} />
    <line x1="23" y1="11" x2="23" y2="17" className="icon-draw" pathLength={1} opacity={0.6} />
    <circle className="icon-pearl" cx="14" cy="14" r="1.6" fill="#C4B5FD" stroke="none" />
  </svg>
);
