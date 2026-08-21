import React from "react";
import { SettingsListItem } from "./SettingsListItem";

/* ─── SVG Icons ──────────────────────────────────────── */
const GoalsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
  </svg>
);

const LevelIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="3" height="6" rx="1" fill="currentColor" opacity="0.5" />
    <rect x="8" y="10" width="3" height="10" rx="1" fill="currentColor" opacity="0.7" />
    <rect x="13" y="6" width="3" height="14" rx="1" fill="currentColor" opacity="0.9" />
    <rect x="18" y="2" width="3" height="18" rx="1" fill="currentColor" />
  </svg>
);

const PreferencesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
  </svg>
);

const DailyFocusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export interface SettingsLearningSectionProps {
  onItemClick?: (item: string) => void;
}

export const SettingsLearningSection: React.FC<SettingsLearningSectionProps> = ({
  onItemClick,
}) => {
  return (
    <div className="flex flex-col">
      {/* Section Label */}
      <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#A27FF3]/80 mb-2 sm:mb-3 px-1">
        LEARNING
      </span>

      {/* Card Container */}
      <div className="rounded-3xl border border-[#111220] bg-[#05060c] shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-[#111220]/70">
        <SettingsListItem
          icon={<GoalsIcon />}
          title="Learning Goals"
          subtitle="Define what you want to achieve with Lingua."
          value="Business Communication"
          onClick={() => onItemClick?.("learning-goals")}
        />
        <SettingsListItem
          icon={<LevelIcon />}
          title="Current Level"
          subtitle="Your proficiency level and learning path."
          value="B1 — Intermediate"
          onClick={() => onItemClick?.("current-level")}
        />
        <SettingsListItem
          icon={<PreferencesIcon />}
          title="Preferences"
          subtitle="Customize how Lingua teaches and communicates."
          value="Balanced"
          onClick={() => onItemClick?.("preferences")}
        />
        <SettingsListItem
          icon={<DailyFocusIcon />}
          title="Daily Focus"
          subtitle="What Lingua helps you improve every day."
          value="Clarity & Vocabulary"
          onClick={() => onItemClick?.("daily-focus")}
        />
      </div>
    </div>
  );
};
