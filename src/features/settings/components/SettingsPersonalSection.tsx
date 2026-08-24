import React from "react";
import { SettingsListItem } from "./SettingsListItem";
import {
  ProfilePresenceIcon,
  NotificationJewelIcon,
  VaultShieldIcon,
  AboutOrbitIcon,
} from "./SettingsBespokeIcons";

export interface SettingsPersonalSectionProps {
  userName?: string;
  onItemClick?: (item: string) => void;
}

export const SettingsPersonalSection: React.FC<SettingsPersonalSectionProps> = ({
  userName = "Esteban",
  onItemClick,
}) => {
  return (
    <div className="flex flex-col">
      {/* Section Label */}
      <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#A27FF3]/80 mb-2 sm:mb-3 px-1">
        PERSONAL
      </span>

      {/* Card Container */}
      <div className="rounded-3xl border border-[#111220] bg-[#05060c] shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-[#111220]/70">
        <SettingsListItem
          icon={<ProfilePresenceIcon className="w-5 h-5" />}
          title="Profile"
          subtitle="Manage your personal information and profile."
          value={userName}
          onClick={() => onItemClick?.("profile")}
        />
        <SettingsListItem
          icon={<NotificationJewelIcon className="w-5 h-5" />}
          title="Notifications"
          subtitle="Choose what you want to be notified about."
          value="Smart"
          onClick={() => onItemClick?.("notifications")}
        />
        <SettingsListItem
          icon={<VaultShieldIcon className="w-5 h-5" />}
          title="Privacy & Data"
          subtitle="Control your data and privacy preferences."
          value="View"
          onClick={() => onItemClick?.("privacy")}
        />
        <SettingsListItem
          icon={<AboutOrbitIcon className="w-5 h-5" />}
          title="About Lingua"
          subtitle="Version, terms and more information."
          value="v1.0.0"
          onClick={() => onItemClick?.("about")}
        />
      </div>
    </div>
  );
};

