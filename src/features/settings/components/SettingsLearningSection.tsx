import React from "react";
import { SettingsListItem } from "./SettingsListItem";
import { SettingsSection } from "./SettingsSection";
import {
  GoalTargetIcon,
  LevelSummitIcon,
  TuningFadersIcon,
  FocusChronoIcon,
} from "./SettingsBespokeIcons";

export interface SettingsLearningSectionProps {
  currentLevel?: string;
  learningGoals?: string;
  dailyFocus?: string;
  onOpenLevelModal?: () => void;
  onItemClick?: (item: string) => void;
}

export const SettingsLearningSection: React.FC<SettingsLearningSectionProps> = ({
  currentLevel = "B1 — Intermediate",
  learningGoals = "Business Communication",
  dailyFocus = "Clarity & Vocabulary",
  onOpenLevelModal,
  onItemClick,
}) => {
  return (
    <SettingsSection label="LEARNING">
      <div className="divide-y divide-white/[0.06]">
        <SettingsListItem
          icon={<GoalTargetIcon className="w-5 h-5" />}
          title="Learning Goals"
          subtitle="Define what you want to achieve with Lingua."
          value={learningGoals}
          onClick={() => onItemClick?.("learning-goals")}
        />
        <SettingsListItem
          icon={<LevelSummitIcon className="w-5 h-5" />}
          title="Current Level"
          subtitle="Your proficiency level and learning path."
          value={currentLevel}
          onClick={() => {
            if (onOpenLevelModal) onOpenLevelModal();
            else onItemClick?.("current-level");
          }}
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
          value={dailyFocus}
          onClick={() => onItemClick?.("daily-focus")}
        />
      </div>
    </SettingsSection>
  );
};
