import React from "react";

type IconProps = { className?: string };

/* Skill: 24x24, stroke 1.75, round caps/joins, safe padding ~2px, violet cosmic palette */

// ── CEFR Levels — staircase progression ──
export const LevelA1Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 16.5 h6 V19 H4 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="12.5" r="1.4" stroke="#A27FF3" strokeWidth="1.75" />
  </svg>
);
export const LevelA2Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 16.5 h10 V19 H4 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 16.5 V11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.9" />
    <path d="M7 9.5 h0" stroke="#A27FF3" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const LevelB1Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 16.5 h4 V19 H4 Z M10 13 h4 V19 H10 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const LevelB2Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3.5 16.5 h3.5 V19 H3.5 Z M8.5 12.5 h3.5 V19 H8.5 Z M14 9 h3.5 V19 H14 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.7 7.2 V4.6 H18.5 L17.4 5.9 L18.5 7.2 H15.7 Z" stroke="#A27FF3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const LevelC1Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 16.5 h3 V19 H3 Z M7.5 12 h3 V19 H7.5 Z M12 8.5 h3 V19 H12 Z M16.5 5 h3 V19 H16.5 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
    <path d="M17.8 3.5 L19.2 4.8 L17.8 6.1" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const LevelC2Icon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 16.5 h2.6 V19 H3 Z M7.2 12 h2.6 V19 H7.2 Z M11.4 8.5 h2.6 V19 H11.4 Z M15.6 5 h2.6 V19 H15.6 Z M19.8 3.5 h0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19.8 3.8 l0.9 0.9 l-0.9 0.9 l-0.9 -0.9 Z" stroke="#A27FF3" strokeWidth="1.4" strokeLinejoin="round" fill="#A27FF3" fillOpacity="0.9" />
    <path d="M19.8 2.6 V3.3" stroke="#A27FF3" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// ── Goals ──
export const GoalBusinessIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.5 8.2 H19.5 V18.2 H4.5 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M4.5 8.2 L12 13 L19.5 8.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 5.8 H15 V8.2 H9 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12 11.2 V14" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
export const GoalCareerIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4 16.5 L8.5 12 L12 14.2 L19.5 6.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 6.5 H19.5 V11.5" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="19.5" cy="6.5" r="1.4" fill="#A27FF3" />
  </svg>
);
export const GoalConversationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.5 7.2 H17.2 V13.8 H8.2 L4.5 17.2 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M7.2 10 H14.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.9" />
    <path d="M7.2 12.2 H11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.55" />
    <circle cx="18.2" cy="6.2" r="1.2" fill="#A27FF3" />
  </svg>
);
export const GoalTravelIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3.5 12.2 L19.2 4.5 L14.5 12.2 L19.2 19.8 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.5 12.2 H9.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.5" />
    <path d="M14.5 12.2 C14.5 12.2 15.8 13.5 14.5 14.8" stroke="#A27FF3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const GoalAcademicIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 5.2 L3.5 9.2 L12 13.2 L20.5 9.2 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M7 11.5 V15.2 C7 15.2 9.5 17.2 12 17.2 C14.5 17.2 17 15.2 17 15.2 V11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.5 9.2 V15.2" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="20.5" cy="16.2" r="1" fill="#A27FF3" />
  </svg>
);

// ── Preferences ──
export const PrefBalancedIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 4.2 V19.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M12 4.2 L5.5 9.2 L8.5 14.2 L12 9.2 L15.5 14.2 L18.5 9.2 Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7.2" r="1.2" fill="#A27FF3" />
  </svg>
);
export const PrefConversationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="9.2" y="4.5" width="5.6" height="9.2" rx="2.8" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 14.2 C8 16.5 9.8 18.2 12 18.2 C14.2 18.2 16 16.5 16 14.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M12 18.2 V19.5 H10.2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M11 7.5 V10.5" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="11" cy="7.5" r="0.9" fill="#A27FF3" />
  </svg>
);
export const PrefGrammarIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M7.2 8.2 L4.5 12 L7.2 15.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.8 8.2 L19.5 12 L16.8 15.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.2 6.2 L10.5 17.8" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
export const PrefVocabularyIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5.5 5.2 H12 V18.8 H5.5 C4.7 18.8 4 18.1 4 17.3 V6.7 C4 5.9 4.7 5.2 5.5 5.2 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12 5.2 H18.5 C19.3 5.2 20 5.9 20 6.7 V17.3 C20 18.1 19.3 18.8 18.5 18.8 H12 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M7.5 8.5 H10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.9" />
    <path d="M7.5 11.2 H10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.55" />
    <path d="M14 8.5 H16.5" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M14 11.2 H16.5" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" opacity="0.7" />
  </svg>
);
export const PrefPronunciationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.5 12 H6.2 L8 8.5 L10 15.5 L12 9.2 L14 14.2 L15.8 12 H19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="5.5" r="1" fill="#A27FF3" />
  </svg>
);

// ── Focus ──
export const FocusClarityIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3.5 L13.2 8.2 L18 9.2 L13.2 10.2 L12 15 L10.8 10.2 L6 9.2 L10.8 8.2 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="white" fillOpacity="0.07" />
    <circle cx="17.5" cy="5.5" r="0.9" fill="#A27FF3" />
    <circle cx="6.5" cy="14.5" r="0.7" fill="#A27FF3" opacity="0.7" />
  </svg>
);
export const FocusTechIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M9.2 9.2 H14.8 M9.2 12 H14.8 M9.2 14.8 H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    <circle cx="12" cy="12" r="1" fill="#A27FF3" />
  </svg>
);
export const FocusBusinessIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M4.5 18.5 H19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M6.2 18.5 V8.5 H11.2 V18.5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12.8 18.5 V11.2 H17.8 V18.5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M7.5 11.2 H9.2 M7.5 14.2 H9.2 M14.2 14.2 H16.2" stroke="#A27FF3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const FocusGrammarIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8.5 12.2 L10.8 14.5 L15.5 9.2" stroke="#A27FF3" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const FocusPronunciationIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M9.5 8.5 H14.5 V13.5 H9.5 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M11.2 13.5 V16.2 L9.5 17.5 H14.5 L12.8 16.2 V13.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 6.2 V8.5" stroke="#A27FF3" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="5.2" r="0.9" fill="#A27FF3" />
  </svg>
);
