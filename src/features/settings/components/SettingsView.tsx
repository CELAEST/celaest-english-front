import React from "react";
import { SettingsLearningSection } from "./SettingsLearningSection";
import { SettingsPersonalSection } from "./SettingsPersonalSection";
import { SettingsAIMentorCard } from "./SettingsAIMentorCard";
import { SettingsLearningSummaryCard } from "./SettingsLearningSummaryCard";
import { SettingsQuickActionsCard } from "./SettingsQuickActionsCard";
import { SettingsFooterMessage } from "./SettingsFooterMessage";
import { useSettingsProfile } from "../hooks/useSettingsProfile";

export interface SettingsViewProps {
  userName?: string;
  onBackToWorkspace?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName = "Esteban",
  onBackToWorkspace,
}) => {
  const { displayName, streakDays, currentFocus, currentLevel } = useSettingsProfile(userName);
  return (
    <div className="relative w-full h-full min-h-0 bg-[#000001] text-white flex flex-col select-none overflow-hidden p-4 sm:p-6 lg:px-10 pt-4 sm:pt-6 pb-4">
      {/* ─── Header: Title + Orb + Back Button (Fixed Top Section) ─── */}
      <div className="relative flex items-center justify-between mb-4 sm:mb-6 pt-2 sm:pt-4 shrink-0 z-20">
        <div className="flex flex-col z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-sans font-medium text-white leading-tight tracking-tight flex items-center gap-2">
            Settings
            <span className="text-[#A27FF3] text-lg sm:text-xl align-top">✦</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-[15px] text-[#999a9b] font-light mt-1">
            Adapt Lingua to you. Your goals, your way.
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

        {/* Back Button (Far Right) */}
        <button
          type="button"
          onClick={onBackToWorkspace}
          className="flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full border border-[#111220] bg-[#05060c] text-xs sm:text-sm text-[#999a9b] hover:text-[#f8f8f8] hover:border-[#A27FF3]/40 transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-xl group shrink-0 z-10"
        >
          <span className="font-light">Back to Workspace</span>
          <svg
            className="w-4 h-4 text-[#999a9b] group-hover:text-[#A27FF3] group-hover:translate-x-0.5 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {/* ─── Two-Column Content Canvas: Page NEVER scrolls, columns scroll independently ─── */}
      <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8 xl:gap-10 overflow-hidden">

        {/* LEFT COLUMN: Settings Lists (Scrolls internally if height constrained, no scrollbar) */}
        <div className="flex-1 h-full max-h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-6 sm:gap-8 pr-1 py-1">
          <SettingsLearningSection />
          <SettingsPersonalSection userName={displayName} />
        </div>

        {/* RIGHT COLUMN: Sidebar Cards Stack (Scrolls internally if height constrained, no scrollbar) */}
        <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 h-full max-h-full overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-4 sm:gap-5 pr-1 py-1">
          <SettingsAIMentorCard />
          <SettingsLearningSummaryCard
            streakDays={streakDays}
            currentFocus={currentFocus}
            currentLevel={currentLevel}
          />
          <SettingsQuickActionsCard />
          <SettingsFooterMessage />
        </div>

      </div>
    </div>
  );
};
