import React from "react";
import { SettingsListItem } from "./SettingsListItem";
import { SettingsSection } from "./SettingsSection";
import {
  ProfilePresenceIcon,
  NotificationJewelIcon,
  VaultShieldIcon,
  AboutOrbitIcon,
} from "./SettingsBespokeIcons";

export interface SettingsPersonalSectionProps {
  userName?: string | undefined;
  notificationPref?: string | undefined;
  onItemClick?: (item: string) => void;
}

export const SettingsPersonalSection: React.FC<SettingsPersonalSectionProps> = ({
  userName,
  notificationPref,
  onItemClick,
}) => {
  return (
    <SettingsSection label="PERSONAL">
      <div className="divide-y divide-white/[0.06]">
        <SettingsListItem
          icon={<ProfilePresenceIcon className="w-6 h-6" />}
          title="Profile"
          subtitle="Manage your personal information and profile."
          value={userName ?? "—"}
          onClick={() => onItemClick?.("profile")}
        />
        <SettingsListItem
          icon={<NotificationJewelIcon className="w-6 h-6" />}
          title="Notifications"
          subtitle="Choose what you want to be notified about."
          value={notificationPref ?? "Smart"}
          onClick={() => onItemClick?.("notifications")}
        />
        <SettingsListItem
          icon={<VaultShieldIcon className="w-6 h-6" />}
          title="Privacy & Data"
          subtitle="Control your data and privacy preferences."
          value="View"
          onClick={() => onItemClick?.("privacy")}
        />
        <SettingsListItem
          icon={<AboutOrbitIcon className="w-6 h-6" />}
          title="About Lingua"
          subtitle="Version, terms and more information."
          value="v1.0.0"
          onClick={() => onItemClick?.("about")}
        />
      </div>
    </SettingsSection>
  );
};
