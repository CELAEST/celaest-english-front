import React from "react";
import { BridgeModuleTarget } from "../../../domain/entities/LearningPathway";
import { WorkspaceProfessorGuide } from "./WorkspaceProfessorGuide";

export interface WorkspaceHeroSectionProps {
  userName?: string | undefined;
  userLevel?: string | undefined;
  learningGoal?: string | undefined;
  profession?: string | undefined;
  dailyFocus?: string | undefined;
  isActive?: boolean | undefined;
  onContinueTopic?: (() => void) | undefined;
  onOpenPathway?: (() => void) | undefined;
  onNavigateModule?: ((target: BridgeModuleTarget) => void) | undefined;
}

export const WorkspaceHeroSection: React.FC<WorkspaceHeroSectionProps> = ({
  userName,
  userLevel = "A1",
  learningGoal,
  profession,
  dailyFocus: _dailyFocus,
  isActive = true,
  onContinueTopic,
  onOpenPathway,
  onNavigateModule,
}) => {
  const displayName = userName?.trim() ? userName : "Learner";
  const displayProfession = profession?.trim() ? profession : "Professional";
  const displayGoal = learningGoal?.trim() ? learningGoal : "Spoken Agility & Spontaneous Framing";

  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-3 sm:space-y-4 w-full max-w-none lg:max-w-[400px] xl:max-w-[450px] select-none pt-1 font-['Plus_Jakarta_Sans',sans-serif] z-10 shrink-0">
      <div className="text-[11px] font-mono tracking-[0.25em] text-[#94A3B8] uppercase">
        {displayName} / {displayProfession}
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-light text-white leading-[1.15] tracking-[-0.03em]">
        I’ve been thinking <br className="hidden sm:inline" />
        <span className="font-normal text-[#E2E8F0]"> about our last conversation.</span>
      </h1>
      <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.7] max-w-lg mx-auto lg:mx-0">
        Your customized session for <span className="text-white font-medium">{displayProfession}</span> is centered on{" "}
        <span className="text-white font-medium">{displayGoal}</span>. Shall we continue from where we left off?
      </p>
      <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-6 w-full">
        <button
          type="button"
          onClick={onContinueTopic}
          className="group min-h-[44px] py-2 text-xs font-mono font-medium tracking-[0.2em] text-[#E2E8F0] hover:text-white transition-colors cursor-pointer flex items-center gap-3"
        >
          <span>CONTINUE SESSION</span>
          <span className="group-hover:translate-x-1.5 transition-transform text-sm text-white/50 group-hover:text-white">→</span>
        </button>
      </div>
      {onOpenPathway && (
        <WorkspaceProfessorGuide
          userLevel={userLevel}
          profession={displayProfession}
          learningGoal={displayGoal}
          isActive={isActive}
          onOpenPathway={onOpenPathway}
          onNavigateModule={onNavigateModule}
        />
      )}
    </div>
  );
};
