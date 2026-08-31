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
  currentLevel?: string | undefined;
  learningGoals?: string | undefined;
  dailyFocus?: string | undefined;
  preferenceStyle?: string | undefined;
  onOpenLevelModal?: () => void;
  onOpenGoalsModal?: () => void;
  onOpenPreferencesModal?: () => void;
  onOpenFocusModal?: () => void;
  onItemClick?: (item: string) => void;
}

export const SettingsLearningSection: React.FC<SettingsLearningSectionProps> = ({
  currentLevel,
  learningGoals,
  dailyFocus,
  preferenceStyle,
  onOpenLevelModal,
  onOpenGoalsModal,
  onOpenPreferencesModal,
  onOpenFocusModal,
  onItemClick,
}) => {
  return (
    <SettingsSection label="LEARNING">
      <div className="divide-y divide-white/[0.06]">
        <SettingsListItem
          icon={<GoalTargetIcon className="w-6 h-6" />}
          title="Learning Goals"
          subtitle="Define what you want to achieve with Lingua."
          value={learningGoals ?? "—"}
          onClick={() => (onOpenGoalsModal ? onOpenGoalsModal() : onItemClick?.("learning-goals"))}
        />
        <SettingsListItem
          icon={<LevelSummitIcon className="w-6 h-6" />}
          title="Current Level"
          subtitle="Your proficiency level and learning path."
          value={currentLevel ?? "—"}
          onClick={() => {
            if (onOpenLevelModal) onOpenLevelModal();
            else onItemClick?.("current-level");
          }}
        />
        <SettingsListItem
          icon={<TuningFadersIcon className="w-6 h-6" />}
          title="Preferences"
          subtitle="Customize how Lingua teaches and communicates."
          value={preferenceStyle ?? "—"}
          onClick={() => (onOpenPreferencesModal ? onOpenPreferencesModal() : onItemClick?.("preferences"))}
        />
        <SettingsListItem
          icon={<FocusChronoIcon className="w-6 h-6" />}
          title="Daily Focus"
          subtitle="What Lingua helps you improve every day."
          value={dailyFocus ?? "—"}
          onClick={() => (onOpenFocusModal ? onOpenFocusModal() : onItemClick?.("daily-focus"))}
        />
      </div>
    </SettingsSection>
  );
};
