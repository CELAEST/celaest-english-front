import React from "react";

/* ─── SVG Icons ──────────────────────────────────────── */
const StreakFireIcon = () => (
  <svg className="w-5 h-5 text-[#A27FF3]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C10.5 6.5 7 8.5 7 13a5 5 0 0010 0c0-4.5-3.5-6.5-5-11z" opacity="0.9" />
    <path d="M12 10c-.8 2.5-2.5 3.5-2.5 6a2.5 2.5 0 005 0c0-2.5-1.7-3.5-2.5-6z" fill="#f8f8f8" opacity="0.7" />
  </svg>
);

const FocusGlobeIcon = () => (
  <svg className="w-5 h-5 text-[#A27FF3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

const LevelBarsIcon = () => (
  <svg className="w-5 h-5 text-[#A27FF3]" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="14" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
    <rect x="9" y="10" width="3" height="10" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="14" y="6" width="3" height="14" rx="1" fill="currentColor" opacity="0.9" />
    <rect x="19" y="2" width="3" height="18" rx="1" fill="currentColor" />
  </svg>
);

interface SummaryRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ icon, title, subtitle, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between py-3 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer group px-1 rounded-xl"
  >
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#A27FF3] shrink-0 group-hover:border-[#A27FF3]/30 transition-colors duration-300">
        {icon}
      </div>
      <div className="flex flex-col items-start min-w-0">
        <span className="text-[13px] sm:text-sm font-medium text-[#f8f8f8] leading-tight">{title}</span>
        <span className="text-[11px] sm:text-xs text-[#999a9b] font-light leading-tight mt-0.5">{subtitle}</span>
      </div>
    </div>
    <svg
      className="w-4 h-4 text-[#999a9b]/50 group-hover:text-[#A27FF3] transition-colors duration-300 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

export interface SettingsLearningSummaryCardProps {
  streakDays?: number;
  currentFocus?: string;
  currentLevel?: string;
}

export const SettingsLearningSummaryCard: React.FC<SettingsLearningSummaryCardProps> = ({
  streakDays = 12,
  currentFocus = "Business Communication",
  currentLevel = "B1 — Intermediate",
}) => {
  return (
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
        Learning summary
      </span>

      {/* Summary Rows */}
      <div className="mt-3 flex flex-col divide-y divide-[#111220]/70">
        <SummaryRow
          icon={<StreakFireIcon />}
          title={`${streakDays} day streak`}
          subtitle="Keep going! Consistency builds mastery."
        />
        <SummaryRow
          icon={<FocusGlobeIcon />}
          title={currentFocus}
          subtitle="Your current focus"
        />
        <SummaryRow
          icon={<LevelBarsIcon />}
          title={currentLevel}
          subtitle="Your current level"
        />
      </div>
    </div>
  );
};
