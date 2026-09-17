import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const BentoGlassVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Bento Minimalist Hero */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* User Identity Chip */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <span className="text-[10px] font-mono font-medium tracking-[0.2em] text-[#C4B5FD] uppercase">
            {profile.userName} · {profile.profession}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          Master high-stakes <br />
          <span className="font-normal text-white">technical </span>
          <span className="font-normal text-[#DDD6FE]">consensus.</span>
        </h1>

        <p className="text-xs sm:text-[13px] text-[#8E90A5] font-light leading-[1.6] max-w-md">
          Focus: <span className="text-[#C4B5FD] font-medium">{profile.learningGoal}</span>.
          Your neural AI mentor is ready for today’s executive session.
        </p>

        {/* Quick Bento Action Pill */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-4 py-2 rounded-xl bg-[#6344E6]/20 hover:bg-[#6344E6]/30 border border-[#8B5CF6]/40 text-[#DDD6FE] hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-2.5 text-xs font-mono font-medium shadow-[0_0_20px_rgba(99,68,230,0.2)]"
          >
            <span>RESUME SIMULATION</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Bento Glass Modules */}
      <div className="grid grid-cols-1 gap-2.5 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[350px] shrink-0">
        {/* Module 1: Memory Bento */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 transition-all duration-200 backdrop-blur-md cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-white/[0.03] text-[#A27FF3] group-hover:scale-105 transition-transform shrink-0">
              <StudioMemoryIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                Active Deck · {profile.cardsDue} Due
              </span>
              <span className="text-xs text-white font-medium truncate group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-[#A27FF3] font-medium">
              {profile.retentionRate}%
            </span>
            <span className="text-white/20 group-hover:text-white text-xs">→</span>
          </div>
        </div>

        {/* Module 2: Reading Bento */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 transition-all duration-200 backdrop-blur-md cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-white/[0.03] text-[#A27FF3] group-hover:scale-105 transition-transform shrink-0">
              <StudioReadingIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                Curated Executive Reading · {profile.readingCefr}
              </span>
              <span className="text-xs text-white font-medium truncate group-hover:text-[#DDD6FE] transition-colors">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-white/50">
              {profile.readingTimeMin}m
            </span>
            <span className="text-white/20 group-hover:text-white text-xs">→</span>
          </div>
        </div>

        {/* Module 3: Interview Bento */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/20 transition-all duration-200 backdrop-blur-md cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-white/[0.03] text-[#A27FF3] group-hover:scale-105 transition-transform shrink-0">
              <StudioVoiceIcon className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                Spoken Simulation · {profile.audioKhz}
              </span>
              <span className="text-xs text-white font-medium truncate group-hover:text-[#DDD6FE] transition-colors">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-emerald-400">Live</span>
            <span className="text-white/20 group-hover:text-white text-xs">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};
