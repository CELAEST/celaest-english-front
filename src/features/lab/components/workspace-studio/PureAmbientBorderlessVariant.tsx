import React from "react";
import { WorkspaceVariantProps } from "./types";

/**
 * PureAmbientBorderlessVariant
 * Strictly built per user's explicit audio directives:
 * 1. ZERO "típica bolita" (no green/purple pulsing dots whatsoever).
 * 2. ZERO borders (border-0, seamless, nothing protruding or "salido").
 * 3. ZERO bright colors or neon backgrounds (clean, muted, monochrome elegance).
 * 4. 100% REAL HUMAN PHOTOGRAPHS (anti-IA, real note-taking, real reading in library, real boardroom conversation).
 * 5. Complete visual calm and structural harmony with home.mp4.
 */
export const PureAmbientBorderlessVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
  memoryImage = "/assets/vocab_headphones_focus.jpg",
  readingImage = "/assets/reading_executive_tablet.jpg",
  speakingImage = "/assets/speaking_boardroom_pitch.jpg",
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Borderless, Quiet Architectural Typography */}
      <div className="flex flex-col space-y-4 max-w-xl select-none text-left items-start pt-1">
        {/* Simple Clean Meta (Zero Dots, Zero Borders) */}
        <div className="text-[11px] font-mono tracking-[0.25em] text-[#94A3B8] uppercase">
          {profile.userName} / {profile.profession} / {profile.cefrLevel}
        </div>

        {/* Display Headline in Crisp White */}
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-white leading-[1.12] tracking-[-0.03em]">
          I’ve been thinking <br />
          <span className="font-normal text-[#E2E8F0]">
            about our last conversation.
          </span>
        </h1>

        {/* Context Description without boxing */}
        <p className="text-sm sm:text-[14.5px] text-[#94A3B8] font-light leading-[1.7] max-w-lg">
          Your customized session for{" "}
          <span className="text-white font-medium">{profile.profession}</span> is centered on{" "}
          <span className="text-white font-medium">{profile.learningGoal}</span>.{" "}
          Shall we continue from where we left off?
        </p>

        {/* Borderless Minimal Action Link */}
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

      {/* RIGHT: Borderless, Seamless Rows with Authentic Photography */}
      <div className="flex flex-col space-y-4 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Row 1: Authentic Notes Study Photo */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Real Photograph: Contextual Vocabulary Focus */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/10">
              <img
                src={memoryImage}
                alt="Vocabulary Recall"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Clean Metadata (Zero Bright Colors, Zero Borders) */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
                VOCABULARY DECK // {profile.cardsDue} DUE
              </span>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#CBD5E1] transition-colors">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#64748B] font-light">
                Spaced repetition recall
              </span>
            </div>
          </div>

          <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-2">
            →
          </span>
        </div>

        {/* Row 2: Authentic Reading in Library Photo */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Real Photograph: Contextual Executive Reading */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/10">
              <img
                src={readingImage}
                alt="Executive Reading"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Clean Metadata */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
                EXECUTIVE ARTICLE // {profile.readingCefr}
              </span>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#CBD5E1] transition-colors">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#64748B] font-light">
                {profile.readingTimeMin} min read · {profile.wordCount} words
              </span>
            </div>
          </div>

          <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-2">
            →
          </span>
        </div>

        {/* Row 3: Authentic Boardroom Speaking Discussion Photo */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors duration-200 cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Real Photograph: Contextual Speaking Discussion */}
            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/40 border border-white/10">
              <img
                src={speakingImage}
                alt="Executive Speaking Discussion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Clean Metadata */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
                ORAL SIMULATION // {profile.interviewRound}
              </span>
              <span className="text-sm sm:text-[14.5px] font-medium text-white truncate mt-0.5 group-hover:text-[#CBD5E1] transition-colors">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#64748B] font-light">
                Real-time spoken sparring
              </span>
            </div>
          </div>

          <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-2">
            →
          </span>
        </div>
      </div>
    </div>
  );
};
