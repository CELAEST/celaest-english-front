import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const SpatialLuxuryVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Spatial Sculptural Hero */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Sora',sans-serif]">
        {/* Subtle Category Line */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-gradient-to-r from-[#C4B5FD] to-transparent" />
          <span className="text-[10px] font-mono font-medium tracking-[0.25em] text-[#C4B5FD] uppercase">
            {profile.profession} · {profile.cefrLevel}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.1] tracking-[-0.03em]">
          Conversations that <br />
          shape your <span className="font-normal text-[#DDD6FE]">trajectory.</span>
        </h1>

        <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md">
          Continuous spoken alignment for{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.
        </p>

        {/* Minimalist Link */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group text-xs font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
          >
            <span>CONTINUE SESSION</span>
            <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Floating Ethereal Tokens */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[350px] shrink-0">
        {/* Token 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3.5 rounded-2xl bg-[#05030d]/50 hover:bg-[#0c081e]/70 border border-white/[0.07] hover:border-[#A27FF3]/40 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/[0.03] text-[#DDD6FE] group-hover:scale-110 transition-transform">
              <StudioMemoryIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#A27FF3] uppercase">
                VOCABULARY DECK
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#8e90a5] font-light">
                {profile.cardsDue} cards due for retention
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs pl-2">
            →
          </span>
        </div>

        {/* Token 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3.5 rounded-2xl bg-[#05030d]/50 hover:bg-[#0c081e]/70 border border-white/[0.07] hover:border-[#A27FF3]/40 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/[0.03] text-[#DDD6FE] group-hover:scale-110 transition-transform">
              <StudioReadingIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#A27FF3] uppercase">
                EXECUTIVE ARTICLE
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#8e90a5] font-light">
                {profile.readingTimeMin} min read · {profile.readingCefr}
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs pl-2">
            →
          </span>
        </div>

        {/* Token 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3.5 rounded-2xl bg-[#05030d]/50 hover:bg-[#0c081e]/70 border border-white/[0.07] hover:border-[#A27FF3]/40 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2 rounded-xl bg-white/[0.03] text-[#DDD6FE] group-hover:scale-110 transition-transform">
              <StudioVoiceIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#A27FF3] uppercase">
                LIVE INTERVIEW
              </span>
              <span className="text-sm text-white font-medium truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#8e90a5] font-light">
                {profile.audioKhz} · High-stakes rehearsal
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 transition-all text-xs pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
