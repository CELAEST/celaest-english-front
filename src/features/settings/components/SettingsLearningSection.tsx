import React from "react";
import { SettingsListItem } from "./SettingsListItem";
import {
  GoalTargetIcon,
  LevelSummitIcon,
  TuningFadersIcon,
  FocusChronoIcon,
} from "./SettingsBespokeIcons";

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
          icon={<GoalTargetIcon className="w-5 h-5" />}
          title="Learning Goals"
          subtitle="Define what you want to achieve with Lingua."
          value="Business Communication"
          onClick={() => onItemClick?.("learning-goals")}
        />
        <SettingsListItem
          icon={<LevelSummitIcon className="w-5 h-5" />}
          title="Current Level"
          subtitle="Your proficiency level and learning path."
          value="B1 — Intermediate"
          onClick={() => onItemClick?.("current-level")}
        />
        <SettingsListItem
          icon={<TuningFadersIcon className="w-5 h-5" />}
          title="Preferences"
          subtitle="Customize how Lingua teaches and communicates."
          value="Balanced"
          onClick={() => onItemClick?.("preferences")}
        />
        <SettingsListItem
          icon={<FocusChronoIcon className="w-5 h-5" />}
          title="Daily Focus"
          subtitle="What Lingua helps you improve every day."
          value="Clarity & Vocabulary"
          onClick={() => onItemClick?.("daily-focus")}
        />
      </div>
    </div>
  );
};

