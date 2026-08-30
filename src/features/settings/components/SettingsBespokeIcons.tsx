import React, { useId } from "react";

/**
 * Settings Bespoke Icons — hand-crafted glyph set.
 *
 * Craft rules (non-negotiable for family consistency):
 * - 24×24 grid, body strokes 1.5, accent strokes 1.8–2.2
 * - Round caps & joins everywhere
 * - Exactly ONE violet accent per glyph — the rest stays neutral
 * - Optical centering over mathematical centering
 */

type IconProps = {
  className?: string;
};

const ACCENT = "currentColor";

/*  LEARNING  */

/** Aspirational target with a dart landing dead-center. */
export const GoalTargetIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="11" cy="13" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="11" cy="13" r="3.8" stroke="currentColor" strokeWidth="1.5" opacity="0.55" />
    <path d="M11 13 18.6 5.4" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M18.6 5.4c.4-1.2 1.5-2.3 3.4-2.9-.3 1.9-1.2 3.2-2.5 3.8"
      stroke={ACCENT}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="11" cy="13" r="1.2" fill={ACCENT} />
  </svg>
);

/** Summit path with a planted flag — progress with destination. */
export const LevelSummitIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M3 19.5 9.4 8.2l4 6.2 2.9-3.6L21 19.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.4 8.2V4.6" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M9.4 4.6h3.4l-1.1 1.3 1.1 1.3H9.4"
      stroke={ACCENT}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Studio faders — the mixing desk of your learning. */
export const TuningFadersIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M7 4.5v15M12 4.5v15M17 4.5v15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M4.8 14.5h4.4" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M9.8 8.5h4.4" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M14.8 12h4.4" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

/** Stopwatch — daily focus, time on task. */
export const FocusChronoIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="13.2" r="7.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 13.2V9.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="m12 13.2 2.8 1.7" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    <path d="M10.2 3.4h3.6M12 3.4v2" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/*  PERSONAL  */

/** Presence bust with a live signal dot. */
export const ProfilePresenceIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.4 19.6c.9-3.9 3.4-5.9 6.6-5.9s5.7 2 6.6 5.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="18.2" cy="5.6" r="1.5" fill={ACCENT} />
  </svg>
);

/** Bell with an attention jewel. */
export const NotificationJewelIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M6.2 16.6v-5.4a5.8 5.8 0 0 1 11.6 0v5.4l1.4 2.2H4.8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3 21a2 2 0 0 0 3.4 0"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="17.6" cy="5" r="1.7" fill={ACCENT} stroke="#05060c" strokeWidth="1.4" />
  </svg>
);

/** Shield with keyhole — a vault, not just a checkmark. */
export const VaultShieldIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M12 3.2 19 5.8v5c0 4.6-2.9 7.8-7 9.9-4.1-2.1-7-5.3-7-9.9v-5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10.4" r="1.8" stroke={ACCENT} strokeWidth="1.7" />
    <path d="M12 12.2v3" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/** Info with an orbital swoosh — knowledge in motion. */
export const AboutOrbitIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="7.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="8.4" r="1.05" fill="currentColor" />
    <path d="M12 11.4v4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M17.2 4.6a9.6 9.6 0 0 1 2.9 3.3"
      stroke={ACCENT}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/*  PRIVACY & DATA ACTIONS  */

/** Download flow into a tray — export reads instantly at any size. */
export const ExportVaultIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path
      d="M5 16.6v1.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path d="M12 4.6v9.6" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" />
    <path
      d="m8.9 11.2 3.1 3.1 3.1-3.1"
      stroke={ACCENT}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Purge — refined wastebasket: the one universally legible metaphor for
 * "erase everything". Red accent (the set's single semantic exception for
 * destructive actions).
 */
export const PurgeVaultIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.9 6.9h14.2" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M9.6 6.9V5.5A1.6 1.6 0 0 1 11.2 3.9h1.6a1.6 1.6 0 0 1 1.6 1.6v1.4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m6.7 6.9.85 11.5a2 2 0 0 0 2 1.85h4.9a2 2 0 0 0 2-1.85L17.3 6.9"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2 10.6v5.4M13.8 10.6v5.4"
      stroke="#F87171"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/*  SIGNATURE MARKS  */

/** Mentor presence — gradient ring, capsule eyes, quiet intelligence. */
export const MentorPresenceMark: React.FC<IconProps> = ({ className }) => {
  const uid = useId();
  const ringId = `mentor-ring-${uid}`;
  const coreId = `mentor-core-${uid}`;
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={ringId} x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B9A0F5" />
          <stop offset="0.55" stopColor="#7048E8" />
          <stop offset="1" stopColor="#3B2A86" />
        </linearGradient>
        <radialGradient id={coreId} cx="0.5" cy="0.42" r="0.65">
          <stop stopColor="#241B52" />
          <stop offset="1" stopColor="#0B0819" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10.4" fill={`url(#${coreId})`} />
      <circle cx="12" cy="12" r="10.4" stroke={`url(#${ringId})`} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7.6" stroke="#A27FF3" strokeWidth="0.6" opacity="0.25" />
      <rect x="8.6" y="9.4" width="2.1" height="5.2" rx="1.05" fill="#D9CCFF" />
      <rect x="13.3" y="9.4" width="2.1" height="5.2" rx="1.05" fill="#D9CCFF" />
      <rect x="8.6" y="9.4" width="2.1" height="5.2" rx="1.05" fill="#A27FF3" opacity="0.55" />
      <rect x="13.3" y="9.4" width="2.1" height="5.2" rx="1.05" fill="#A27FF3" opacity="0.55" />
    </svg>
  );
};

/** Four-point sparkle with a violet core gradient. */
export const SparkleMark: React.FC<IconProps> = ({ className }) => {
  const uid = useId();
  const gradId = `sparkle-${uid}`;
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C7B2FA" />
          <stop offset="1" stopColor="#7048E8" />
        </linearGradient>
      </defs>
      <path
        d="M12 3c.9 5 2.1 7.2 9 9-6.9 1.8-8.1 4-9 9-.9-5-2.1-7.2-9-9 6.9-1.8 8.1-4 9-9Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
};
