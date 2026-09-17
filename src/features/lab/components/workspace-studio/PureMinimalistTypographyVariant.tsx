import React from "react";
import { WorkspaceVariantProps } from "./types";

/**
 * PureMinimalistTypographyVariant
 * Ultra-restrained typographic architecture:
 * - ZERO borders.
 * - ZERO colors.
 * - ZERO dots / bolitas.
 * - ZERO protruding boxes ("no se ve salido").
 * - Pure typographic hierarchy: crisp white #FFFFFF against the room's ambient dark background.
 */
export const PureMinimalistTypographyVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Naked Display Typography */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Neutral Monospace Track Tag */}
        <div className="text-[11px] font-mono tracking-[0.25em] text-[#94A3B8] uppercase">
          {profile.userName} / {profile.profession} / {profile.cefrLevel}
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          I’ve been thinking <br />
          <span className="font-normal text-[#E2E8F0]">
            about our last conversation.
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.7] max-w-lg">
          Your customized session for{" "}
          <span className="text-white font-medium">{profile.profession}</span> is centered on{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.{" "}
          Shall we continue from where we left off?
        </p>

        {/* Text Link Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group py-2 text-xs font-mono font-medium tracking-[0.2em] text-[#E2E8F0] hover:text-white transition-colors cursor-pointer flex items-center gap-3"
          >
            <span>CONTINUE SESSION</span>
            <span className="group-hover:translate-x-1.5 transition-transform text-sm text-white/50 group-hover:text-white">
              →
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT: Naked Minimalist Typographic Slices */}
      <div className="flex flex-col space-y-6 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0 pt-2">
        {/* Slice 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group cursor-pointer flex flex-col text-left space-y-1 hover:translate-x-1 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono tracking-widest text-[#94A3B8] uppercase">
              01 // ACTIVE MEMORY
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              {profile.cardsDue} DUE
            </span>
          </div>
          <span className="text-base font-medium text-white group-hover:text-[#CBD5E1] transition-colors">
            “{profile.memoryWord}”
          </span>
          <span className="text-xs text-[#64748B] font-light">
            Spaced repetition recall deck
          </span>
        </div>

        {/* Slice 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group cursor-pointer flex flex-col text-left space-y-1 hover:translate-x-1 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono tracking-widest text-[#94A3B8] uppercase">
              02 // EXECUTIVE READING
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              {profile.readingTimeMin} MIN
            </span>
          </div>
          <span className="text-base font-medium text-white group-hover:text-[#CBD5E1] transition-colors">
            {profile.readingArticle}
          </span>
          <span className="text-xs text-[#64748B] font-light">
            {profile.readingCefr} · {profile.wordCount} words
          </span>
        </div>

        {/* Slice 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group cursor-pointer flex flex-col text-left space-y-1 hover:translate-x-1 transition-transform"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono tracking-widest text-[#94A3B8] uppercase">
              03 // ORAL SIMULATION
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              LIVE AUDIO
            </span>
          </div>
          <span className="text-base font-medium text-white group-hover:text-[#CBD5E1] transition-colors">
            {profile.interviewTitle}
          </span>
          <span className="text-xs text-[#64748B] font-light">
            {profile.interviewRound} · Duplex conversation
          </span>
        </div>
      </div>
    </div>
  );
};
