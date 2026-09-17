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
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import { useCurrentUser } from "../../../shared/hooks/useCurrentUser";
import { CefrLevelCode, normalizeCefr } from "../../conversation/services/dynamicQuestionService";

export interface WorkspaceDashboardViewProps {
  userName?: string | undefined;
  userLevel?: string | undefined;
  defaultTab?: string | undefined;
  onNavigate?: ((route: string) => void) | undefined;
}

export const WorkspaceDashboardViewComponent: React.FC<WorkspaceDashboardViewProps> = ({
  userName = "",
  userLevel = "",
  defaultTab = "workspace",
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(() => new Set([defaultTab]));
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    setMountedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  React.useEffect(() => {
    if (videoRef.current) {
      if (activeTab === "workspace") {
        void videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeTab]);

  const { settings, updateProfileSettings } = useCurrentUser();
  // Single source of truth — no duplicate GET /user/profile
  const activeUserName = settings.name || userName || "";
  const activeUserLevel = settings.cefrLevel || userLevel || "B1";
  const userProfession = settings.profession || settings.learningGoal || "Professional";
  const profile = {
    learningGoal: settings.learningGoal,
    preferenceStyle: settings.preferenceStyle,
    dailyFocus: settings.dailyFocus,
    profession: userProfession,
  } as { learningGoal?: string; preferenceStyle?: string; dailyFocus?: string; profession?: string };

  const [memoryInitialCategory, setMemoryInitialCategory] = useState<string | undefined>();

  const handleSelectNav = React.useCallback(
    (route: string, categoryHint?: string) => {
      if (route === "lab" && !import.meta.env.DEV) {
        setActiveTab("workspace");
        return;
      }
      if (route === "memory" && categoryHint) {
        setMemoryInitialCategory(categoryHint);
      }
      setActiveTab(route);
      if (onNavigate) onNavigate(route);
    },
    [onNavigate],
  );

  const handleBackToWorkspace = React.useCallback(() => {
    handleSelectNav("workspace");
  }, [handleSelectNav]);

  const handleGlobalSelectLevel = React.useCallback(
    (newLevel: CefrLevelCode) => {
      const norm = normalizeCefr(newLevel);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("celaest:cefrLevel", norm);
          localStorage.setItem("celaest:writing:cefrLevel", norm);
          localStorage.setItem("celaest:interview:cefrLevel", norm);
        } catch {
          // ignore
        }
      }
      void updateProfileSettings({ cefrLevel: norm });
    },
    [updateProfileSettings],
  );

  return (
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#030208] text-slate-100 font-sans flex overflow-hidden select-none">
      {/* 1. Full Bleed Background Video with keep-alive visibility and power-saving pause */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030208] transition-opacity duration-300 ${
          activeTab === "workspace" ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          src="/assets/home.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/workspace_room_bg.png"
          className="w-full h-full object-cover object-[55%_88%] sm:object-[56%_92%] lg:object-[58%_97%] pointer-events-none select-none transition-all duration-300"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        />
        {/* Soft vignette gradients ensuring 100% text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/30 to-[#030208]/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/35 via-transparent to-[#030208]/85 pointer-events-none" />
      </div>

      {/* 2. Left Sidebar Navigation (Always Visible) */}
      <WorkspaceSidebar
        userName={activeUserName}
        userLevel={activeUserLevel}
        activeItem={activeTab}
        onSelectNav={handleSelectNav}
      />

      {/* 3. Main Dynamic Content Canvas — keep-alive lazy mounting: tabs only mount on first visit, then stay alive in DOM */}
      <main className="flex-1 flex flex-col justify-between h-full relative z-10 overflow-hidden bg-transparent">
        {mountedTabs.has("interview") && (
          <div
            key="interview"
            className={`w-full h-full ${activeTab === "interview" ? "block" : "hidden"}`}
            aria-hidden={activeTab !== "interview"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Interview se recuperó de un error. Limpia el caché local y reintenta.</p>
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem("celaest:interview-progress:v2");
                        localStorage.removeItem("celaest:interview:ai_questions:v2:" + activeUserLevel);
                      } catch {}
                      window.location.reload();
                    }}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Limpiar y recargar
                  </button>
                </div>
              }
            >
              <InterviewPracticeView
                roleName={userProfession}
                userLevel={activeUserLevel}
                onSelectLevel={handleGlobalSelectLevel}
                onBackToWorkspace={handleBackToWorkspace}
              />
            </ErrorBoundary>
          </div>
        )}

        {mountedTabs.has("writing") && (
          <div
            key="writing"
            className={`w-full h-full ${activeTab === "writing" ? "block animate-[fadeIn_0.4s_ease-out_both]" : "hidden"}`}
            aria-hidden={activeTab !== "writing"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Writing se recuperó de un error inesperado.</p>
                  <button
                    onClick={() => handleBackToWorkspace()}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Volver al Workspace
                  </button>
                </div>
              }
            >
              <WritingPracticeView
                roleName={userProfession}
                userLevel={activeUserLevel}
                onSelectLevel={handleGlobalSelectLevel}
                onBackToWorkspace={handleBackToWorkspace}
              />
            </ErrorBoundary>
          </div>
        )}

        {mountedTabs.has("reading") && (
          <div
            key="reading"
            className={`w-full h-full ${activeTab === "reading" ? "block animate-[fadeIn_0.4s_ease-out_both]" : "hidden"}`}
            aria-hidden={activeTab !== "reading"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Reading se recuperó de un error inesperado.</p>
                  <button
                    onClick={() => handleBackToWorkspace()}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Volver al Workspace
                  </button>
                </div>
              }
            >
              <ReadingPracticeView
                roleName={userProfession}
                onBackToWorkspace={handleBackToWorkspace}
              />
            </ErrorBoundary>
          </div>
        )}

        {mountedTabs.has("memory") && (
          <div
            key="memory"
            className={`w-full h-full ${activeTab === "memory" ? "block animate-[fadeIn_0.4s_ease-out_both]" : "hidden"}`}
            aria-hidden={activeTab !== "memory"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Memory Bank se recuperó de un error.</p>
                  <button
                    onClick={() => handleBackToWorkspace()}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Volver al Workspace
                  </button>
                </div>
              }
            >
              <MemoryView
                onBackToWorkspace={handleBackToWorkspace}
                onNavigate={handleSelectNav}
                initialCategory={memoryInitialCategory}
              />
            </ErrorBoundary>
          </div>
        )}

        {import.meta.env.DEV && mountedTabs.has("lab") && (
          <div
            key="lab"
            className={`w-full h-full ${activeTab === "lab" ? "block animate-[fadeIn_0.4s_ease-out_both]" : "hidden"}`}
            aria-hidden={activeTab !== "lab"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Lab se recuperó de un error inesperado.</p>
                  <button
                    onClick={() => handleBackToWorkspace()}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Volver al Workspace
                  </button>
                </div>
              }
            >
              <LabView onBackToWorkspace={handleBackToWorkspace} />
            </ErrorBoundary>
          </div>
        )}

        {mountedTabs.has("workspace") && (
          <div
            key="workspace"
            className={`flex-col justify-between h-full p-4 sm:p-6 lg:p-8 pt-2 sm:pt-4 ${
              activeTab === "workspace" ? "flex animate-[fadeIn_0.4s_ease-out_both]" : "hidden"
            }`}
            aria-hidden={activeTab !== "workspace"}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10 pt-1 sm:pt-3 gap-6 relative z-10">
              <WorkspaceHeroSection
                userName={activeUserName}
                learningGoal={profile?.learningGoal}
                profession={profile?.profession}
                dailyFocus={profile?.dailyFocus}
                onContinueTopic={() => handleSelectNav("interview")}
              />

              {/* Protected central clearance corridor for the glowing sphere */}
              <div
                className="hidden lg:block flex-1 min-w-[180px] xl:min-w-[260px] pointer-events-none"
                aria-hidden="true"
              />

              <WorkspaceOrbCallouts
                learningGoal={profile?.learningGoal}
                profession={profile?.profession}
                onSelectNode={handleSelectNav}
              />
            </div>

            <div className="w-full pb-1 sm:pb-2 relative z-10">
              <WorkspacePromptBar onSubmitPrompt={() => handleSelectNav("interview")} />
            </div>
          </div>
        )}

        {mountedTabs.has("settings") && (
          <div
            key="settings"
            className={`w-full h-full ${activeTab === "settings" ? "block animate-[fadeIn_0.4s_ease-out_both]" : "hidden"}`}
            aria-hidden={activeTab !== "settings"}
          >
            <ErrorBoundary
              fallback={
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-[#000001] p-8 text-center">
                  <p className="text-sm text-white/70">Settings se recuperó de un error.</p>
                  <button
                    onClick={() => handleBackToWorkspace()}
                    className="rounded-full bg-[#8B5CF6] px-5 py-2 text-sm text-white cursor-pointer"
                  >
                    Volver al Workspace
                  </button>
                </div>
              }
            >
              <SettingsView
                userName={activeUserName}
                onBackToWorkspace={() => handleSelectNav("workspace")}
              />
            </ErrorBoundary>
          </div>
        )}

        {/* Fallback for other tabs */}
        {activeTab !== "workspace" &&
          activeTab !== "interview" &&
          activeTab !== "writing" &&
          activeTab !== "reading" &&
          activeTab !== "memory" &&
          activeTab !== "lab" &&
          activeTab !== "settings" && (
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

export const WorkspaceDashboardView = React.memo(WorkspaceDashboardViewComponent);
