import React from "react";
import { SettingsLearningSection } from "./SettingsLearningSection";
import { SettingsPersonalSection } from "./SettingsPersonalSection";
import { SettingsAiProvidersSection } from "./SettingsAiProvidersSection";
import { SettingsAIMentorCard } from "./SettingsAIMentorCard";
import { SettingsQuickActionsCard } from "./SettingsQuickActionsCard";
import { SettingsFooterMessage } from "./SettingsFooterMessage";
import { useSettingsProfile } from "../hooks/useSettingsProfile";

export interface SettingsViewProps {
  userName?: string | undefined;
  onBackToWorkspace?: (() => void) | undefined;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName = "Esteban",
}) => {
  const { displayName } = useSettingsProfile(userName);
  return (
    <div className="relative w-full h-full min-h-0 bg-[#000001] text-white flex flex-col select-none overflow-hidden p-4 sm:p-6 lg:px-10 pt-4 sm:pt-6 pb-4">
      {/* ─── Header: Title + Orb + Back Button (Fixed Top Section) ─── */}
      <div className="relative flex items-center justify-between mb-4 sm:mb-6 pt-2 sm:pt-4 shrink-0 z-20">
        <div className="flex flex-col space-y-1.5 sm:space-y-2 z-10">
          {/* Category Tag */}
          <span className="text-[10.5px] sm:text-[11px] font-sans font-bold tracking-[0.22em] text-[#8264C3] uppercase animate-[fadeSlideUp_0.45s_ease-out_both]">
            YOUR SETTINGS
          </span>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[34px] font-sans text-[#f8f8f8] font-light tracking-wide leading-tight animate-[fadeSlideUp_0.5s_ease-out_0.08s_both]">
            Make Lingua{" "}
            <span className="text-[#A27FF3] font-light">yours.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#999a9b] font-light tracking-wide pt-0.5 animate-[fadeSlideUp_0.5s_ease-out_0.16s_both]">
            Your goals, your mentors, your way.
          </p>
        </div>

        {/* 3D Orb Hero (Positioned in Top Header section, clear of scroll canvas) */}
        <div className="absolute left-[62%] -translate-x-1/2 -top-6 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 pointer-events-none flex items-center justify-center z-0">
          <img
            src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
            alt="Glowing Orb"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* ─── Two-Column Content Canvas: Page NEVER scrolls, columns scroll independently ─── */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 xl:gap-10 overflow-hidden">

        {/* LEFT COLUMN: Settings Lists (Scrolls internally if height constrained, no scrollbar) */}
        <div className="flex-1 h-full max-h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-6 sm:gap-8 pr-1 py-1">
          <SettingsAiProvidersSection />
          <SettingsLearningSection />
          <SettingsPersonalSection userName={displayName} />
        </div>

        {/* RIGHT COLUMN: Sidebar Cards Stack (Scrolls internally if height constrained, no scrollbar) */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 h-full max-h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-4 sm:gap-5 pr-1 py-1">
          <SettingsAIMentorCard />
          <SettingsQuickActionsCard />
          <SettingsFooterMessage />
        </div>

      </div>
    </div>
  );
};
