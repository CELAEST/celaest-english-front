import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const ExoticArchitecturalBladeVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Monolithic Architectural Blade */}
      <div className="relative pl-6 border-l-2 border-l-[#A27FF3] max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Glow bead on top of the blade line */}
        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#DDD6FE] shadow-[0_0_12px_#DDD6FE]" />

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C4B5FD] uppercase">
            MONOLITH · {profile.profession}
          </span>
          <span className="text-[10px] font-mono text-white/30">|</span>
          <span className="text-[10px] font-mono text-emerald-400">{profile.cefrLevel}</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extralight text-white leading-[1.08] tracking-[-0.035em]">
          Conversations that <br />
          define your <span className="font-medium text-[#DDD6FE]">authority.</span>
        </h1>

        <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md mt-3">
          Curated speech architecture on{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.
        </p>

        {/* Clean Kinetic Action */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-5 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white text-white hover:text-black border border-white/20 transition-all duration-300 backdrop-blur-md flex items-center gap-3 cursor-pointer text-xs font-mono font-medium shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            <span>START EXECUTIVE SPRINT</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Blade Slats Floating in Void */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        <div className="flex items-center justify-between px-1 text-[9.5px] font-mono uppercase tracking-[0.25em] text-white/30">
          <span>// CURATED PILLARS</span>
          <span className="text-[#A27FF3]">● ACTIVE</span>
        </div>

        {/* Blade 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group relative p-3.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border-l-2 border-l-[#A27FF3] border-t border-t-white/[0.06] border-r border-r-white/[0.04] border-b border-b-white/[0.04] backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center justify-between hover:translate-x-[-3px]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioMemoryIcon className="w-5 h-5 text-[#A27FF3] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">
                MEMORY PILLAR · {profile.cardsDue} DUE
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#DDD6FE] pl-2">{profile.retentionRate}%</span>
        </div>

        {/* Blade 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group relative p-3.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border-l-2 border-l-[#38BDF8] border-t border-t-white/[0.06] border-r border-r-white/[0.04] border-b border-b-white/[0.04] backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center justify-between hover:translate-x-[-3px]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioReadingIcon className="w-5 h-5 text-[#38BDF8] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">
                READING PILLAR · {profile.readingCefr}
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#7DD3FC] transition-colors">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-white/50 pl-2">{profile.readingTimeMin}m</span>
        </div>

        {/* Blade 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group relative p-3.5 rounded-xl bg-black/40 hover:bg-white/[0.05] border-l-2 border-l-[#10B981] border-t border-t-white/[0.06] border-r border-r-white/[0.04] border-b border-b-white/[0.04] backdrop-blur-xl transition-all duration-300 cursor-pointer flex items-center justify-between hover:translate-x-[-3px]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <StudioVoiceIcon className="w-5 h-5 text-[#10B981] shrink-0" />
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">
                SPOKEN PILLAR · {profile.audioKhz}
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#6EE7B7] transition-colors">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 pl-2">Live</span>
        </div>
      </div>
    </div>
  );
};
