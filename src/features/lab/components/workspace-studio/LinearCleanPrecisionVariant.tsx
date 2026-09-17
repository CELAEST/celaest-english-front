import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 3: Linear Clean Precision
 * Inspired by Linear.app's iconic desktop UI:
 * - Uncluttered, airy typography directly on space.
 * - Monospaced telemetry cues and fine hairline borders (border-white/[0.08]).
 * - Precision list rows with subtle hover states, zero heavy containers.
 */
export const LinearCleanPrecisionVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Linear Precision Hero */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Monospace Breadcrumb */}
        <div className="flex items-center gap-2 text-[10.5px] font-mono text-[#A78BFA] uppercase tracking-widest">
          <span>CELAEST</span>
          <span className="text-white/20">/</span>
          <span>{profile.profession}</span>
          <span className="text-white/20">/</span>
          <span className="text-white/60">{profile.cefrLevel}</span>
        </div>

        {/* Crisp Linear Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-white leading-[1.12] tracking-tight">
          Session 14. <br />
          <span className="font-light text-[#CBD5E1]">Ready to execute.</span>
        </h1>

        {/* Clear Subtext */}
        <p className="text-sm sm:text-[14px] text-[#94A3B8] font-light leading-[1.65] max-w-md">
          Focus: <span className="text-white font-medium">{profile.learningGoal}</span>.
          Spontaneous articulation with real-time feedback.
        </p>

        {/* Linear Action Button with Hotkey */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-[#F1F5F9] font-semibold text-xs tracking-wider uppercase flex items-center gap-3 transition-all duration-150 cursor-pointer shadow-md active:scale-95"
          >
            <span>Continue Session</span>
            <span className="px-1.5 py-0.5 rounded bg-black/10 text-black/70 text-[10px] font-mono font-bold">
              ↵ Enter
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Linear Precision Rows (Clean Hairline List, Zero Clutter) */}
      <div className="flex flex-col w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {/* Row 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group py-3.5 px-2 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="text-[#A78BFA] group-hover:scale-105 transition-transform shrink-0">
              <StudioMemoryIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#A78BFA] uppercase font-semibold">
                  MEMORY
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {profile.cardsDue} DUE
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all pl-2">
            →
          </span>
        </div>

        {/* Row 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group py-3.5 px-2 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="text-[#38BDF8] group-hover:scale-105 transition-transform shrink-0">
              <StudioReadingIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#38BDF8] uppercase font-semibold">
                  ARTICLE
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {profile.readingTimeMin} MIN
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate group-hover:text-[#BAE6FD] transition-colors">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all pl-2">
            →
          </span>
        </div>

        {/* Row 3: Interview */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group py-3.5 px-2 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="text-[#FBBF24] group-hover:scale-105 transition-transform shrink-0">
              <StudioVoiceIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider text-[#FBBF24] uppercase font-semibold">
                  SIMULATION
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  {profile.interviewRound}
                </span>
              </div>
              <span className="text-sm font-medium text-white truncate group-hover:text-[#FDE68A] transition-colors">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
