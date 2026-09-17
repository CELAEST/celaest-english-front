import React from "react";
import { WorkspaceVariantProps } from "./types";

/**
 * CuratedCameoJewelsVariant
 * Circular luxury photographic cameos with ambient optical rim lights.
 * Completely ethereal, 100% harmonious with the lighting of home.mp4.
 */
export const CuratedCameoJewelsVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Atmospheric Master Typography */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Subtle Category Line with Fine Hairline */}
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-gradient-to-r from-[#A78BFA] to-transparent" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C4B5FD] uppercase font-semibold">
            {profile.profession.toUpperCase()} · {profile.cefrLevel}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extralight text-white leading-[1.12] tracking-[-0.03em]">
          Conversations that <br />
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3E8FF] to-[#DDD6FE]">
            shape your trajectory.
          </span>
        </h1>

        {/* Context Description */}
        <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.7] max-w-lg">
          Daily active cadence for{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.
          Spoken agility, precision phrasing, and immediate feedback.
        </p>

        {/* Naked Architectural Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-7 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/[0.14] hover:border-white/30 text-white text-xs font-semibold tracking-widest uppercase backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-white/10"
          >
            <span>Continue Session</span>
            <span className="text-[#C4B5FD] group-hover:translate-x-1 transition-transform text-sm font-bold">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Circular Photographic Cameo Strips */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Cameo 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Circular Cameo with Violet Rim Glow */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#A78BFA]/40 shadow-[0_0_12px_rgba(167,139,250,0.3)] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/lexicon_memory_art.jpg"
                alt="Memory Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#A78BFA] uppercase font-bold">
                LEXICON // {profile.cardsDue} DUE
              </span>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#DDD6FE] transition-colors">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>

        {/* Cameo 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Circular Cameo with Cyan Rim Glow */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#38BDF8]/40 shadow-[0_0_12px_rgba(56,189,248,0.3)] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/editorial_reading_art.jpg"
                alt="Reading Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                EDITORIAL // {profile.readingTimeMin} MIN
              </span>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#BAE6FD] transition-colors">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>

        {/* Cameo 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Circular Cameo with Amber Rim Glow */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#FBBF24]/40 shadow-[0_0_12px_rgba(251,191,36,0.3)] shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/assets/simulation_voice_art.jpg"
                alt="Voice Art"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#FBBF24] uppercase font-bold">
                VOICE // {profile.interviewRound}
              </span>
              <span className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-[#FDE68A] transition-colors">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
