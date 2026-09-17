import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 2: Apple Vision Spatial (visionOS Design Standard)
 * Official Apple visionOS Spatial Guidelines:
 * - Zero opaque blocking boxes (never isolate the user from the 3D room).
 * - System glass material: ultra-translucent frosted glass (bg-white/[0.04], backdrop-blur-2xl).
 * - Typography in crisp white (#FFFFFF) with high-contrast hierarchy.
 * - Floating Ornaments on the edge for persistent secondary navigation.
 */
export const AppleVisionSpatialVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Ethereal Spatial Hero (Floating Typography directly on 3D room) */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Apple Spatial Micro-Tag */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#E2E8F0] uppercase">
            {profile.profession.toUpperCase()} · {profile.cefrLevel}
          </span>
        </div>

        {/* Display Spatial Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extralight text-white leading-[1.1] tracking-[-0.03em]">
          I’ve synthesized <br />
          <span className="font-normal text-[#E9D5FF]">
            our previous dialogue.
          </span>
        </h1>

        {/* Subtle Spatial Description */}
        <p className="text-sm sm:text-[14px] text-[#94A3B8] font-light leading-[1.65] max-w-md">
          Ready to refine nuances in{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.
          Experience seamless real-time spoken sparring.
        </p>

        {/* Floating Spatial Action Pill */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-6 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.15] hover:border-white/30 text-white text-xs font-medium tracking-wider uppercase backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-white/10"
          >
            <span>Resume Session</span>
            <span className="text-[#C4B5FD] group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Floating Spatial Ornaments (visionOS Ornaments Pattern) */}
      <div className="flex flex-col space-y-2.5 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        {/* Ornament 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-[#C4B5FD] group-hover:scale-110 transition-transform shrink-0">
              <StudioMemoryIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#C4B5FD] uppercase">
                MEMORY · {profile.cardsDue} DUE
              </span>
              <span className="text-xs sm:text-[13px] font-medium text-white truncate">
                “{profile.memoryWord}”
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>

        {/* Ornament 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-[#38BDF8] group-hover:scale-110 transition-transform shrink-0">
              <StudioReadingIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#38BDF8] uppercase">
                ARTICLE · {profile.readingTimeMin} MIN
              </span>
              <span className="text-xs sm:text-[13px] font-medium text-white truncate">
                {profile.readingArticle}
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>

        {/* Ornament 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-2xl transition-all duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="text-[#FBBF24] group-hover:scale-110 transition-transform shrink-0">
              <StudioVoiceIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#FBBF24] uppercase">
                AUDIO · {profile.interviewRound}
              </span>
              <span className="text-xs sm:text-[13px] font-medium text-white truncate">
                {profile.interviewTitle}
              </span>
            </div>
          </div>
          <span className="text-white/20 group-hover:text-white transition-colors text-xs pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
