import React from "react";
import { SettingsListItem } from "./SettingsListItem";

/* ─── SVG Icons ──────────────────────────────────────── */
const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const NotificationsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const PrivacyIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const AboutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

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
          icon={<ProfileIcon />}
          title="Profile"
          subtitle="Manage your personal information and profile."
          value={userName}
          onClick={() => onItemClick?.("profile")}
        />
        <SettingsListItem
          icon={<NotificationsIcon />}
          title="Notifications"
          subtitle="Choose what you want to be notified about."
          value="Smart"
          onClick={() => onItemClick?.("notifications")}
        />
        <SettingsListItem
          icon={<PrivacyIcon />}
          title="Privacy & Data"
          subtitle="Control your data and privacy preferences."
          value="View"
          onClick={() => onItemClick?.("privacy")}
        />
        <SettingsListItem
          icon={<AboutIcon />}
          title="About Lingua"
          subtitle="Version, terms and more information."
          value="v1.0.0"
          onClick={() => onItemClick?.("about")}
        />
      </div>
    </div>
  );
};
