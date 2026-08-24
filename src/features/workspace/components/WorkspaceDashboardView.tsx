import React, { useState } from "react";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { WorkspaceHeroSection } from "./WorkspaceHeroSection";
import { WorkspaceOrbCallouts } from "./WorkspaceOrbCallouts";
import { WorkspacePromptBar } from "./WorkspacePromptBar";
import { InterviewPracticeView } from "../../conversation";
import { WritingPracticeView } from "../../writing";
import { ReadingPracticeView } from "../../reading";
import { MemoryView } from "../../memory";
import { SettingsView } from "../../settings";
import { LabView } from "../../lab";
import { useSettingsProfile } from "../../settings/hooks/useSettingsProfile";

export interface WorkspaceDashboardViewProps {
  userName?: string | undefined;
  userLevel?: string | undefined;
  defaultTab?: string | undefined;
  onNavigate?: ((route: string) => void) | undefined;
}

export const WorkspaceDashboardView: React.FC<WorkspaceDashboardViewProps> = ({
  userName = "Esteban",
  userLevel = "B1 Level",
  defaultTab = "workspace",
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const { displayName, currentLevel } = useSettingsProfile(userName);

  const activeUserName = displayName || userName;
  const activeUserLevel = currentLevel || userLevel;

  const handleSelectNav = (route: string) => {
    setActiveTab(route);
    if (onNavigate) onNavigate(route);
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#030208] text-slate-100 font-sans flex overflow-hidden select-none">
      {/* 🌟 1. Full Bleed Background Wallpaper ONLY for Workspace Dashboard */}
      {activeTab === "workspace" && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030208]">
          <img
            src="/assets/workspace_room_bg.png"
            alt="Lingua AI Room Background"
            className="w-full h-full object-cover object-[55%_88%] sm:object-[56%_92%] lg:object-[58%_97%] pointer-events-none select-none opacity-100 transition-all duration-300"
          />
          {/* Soft vignette gradients ensuring 100% text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/30 to-[#030208]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/35 via-transparent to-[#030208]/85 pointer-events-none" />
        </div>
      )}

      {/* 2. Left Sidebar Navigation (Always Visible) */}
      <WorkspaceSidebar
        userName={activeUserName}
        userLevel={activeUserLevel}
        activeItem={activeTab}
        onSelectNav={handleSelectNav}
      />

      {/* 3. Main Dynamic Content Canvas */}
      <main className="flex-1 flex flex-col justify-between h-full relative z-10 overflow-hidden bg-transparent">
        {/* Route Canvas 1: INTERVIEW PRACTICE */}
        {activeTab === "interview" && (
          <div key="interview" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <InterviewPracticeView
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Route Canvas 2: WRITING PRACTICE */}
        {activeTab === "writing" && (
          <div key="writing" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <WritingPracticeView
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Route Canvas 3: READING PRACTICE */}
        {activeTab === "reading" && (
          <div key="reading" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <ReadingPracticeView
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Route Canvas 4: MEMORY */}
        {activeTab === "memory" && (
          <div key="memory" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <MemoryView
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Route Canvas: LAB (Interactive UI & Icon Sandbox) */}
        {activeTab === "lab" && (
          <div key="lab" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <LabView
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Route Canvas 5: WORKSPACE DASHBOARD */}
        {activeTab === "workspace" && (
          <div key="workspace" className="flex flex-col justify-between h-full p-4 sm:p-6 lg:p-8 pt-2 sm:pt-4 animate-[fadeIn_0.4s_ease-out_both]">
            <div className="flex flex-col md:flex-row items-start justify-between w-full max-w-7xl mx-auto pt-0 sm:pt-1 gap-4 sm:gap-6 relative z-10">
              <WorkspaceHeroSection
                userName={userName}
                onContinueTopic={() => handleSelectNav("interview")}
              />
              <WorkspaceOrbCallouts onSelectNode={handleSelectNav} />
            </div>

            <div className="w-full pb-1 sm:pb-2 relative z-10">
              <WorkspacePromptBar
                onSubmitPrompt={() => handleSelectNav("interview")}
              />
            </div>
          </div>
        )}

        {/* Route Canvas 6: SETTINGS */}
        {activeTab === "settings" && (
          <div key="settings" className="w-full h-full animate-[fadeIn_0.4s_ease-out_both]">
            <SettingsView
              userName={userName}
              onBackToWorkspace={() => handleSelectNav("workspace")}
            />
          </div>
        )}

        {/* Fallback for other tabs */}
        {activeTab !== "workspace" && activeTab !== "interview" && activeTab !== "writing" && activeTab !== "reading" && activeTab !== "memory" && activeTab !== "settings" && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-[#04030A]">
            <h2 className="text-2xl font-serif text-white capitalize">{activeTab} View</h2>
            <p className="text-xs text-[#7B7B9A]">Navigating via Sidebar Sidenav...</p>
            <button
              onClick={() => handleSelectNav("interview")}
              className="px-4 py-2 rounded-full bg-[#18142D] border border-[#3A2A6B] text-xs text-[#A78BFA] hover:text-white transition-all cursor-pointer"
            >
              Back to Interview Practice
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
