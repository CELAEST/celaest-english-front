import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

/**
 * Variant 3: Atelier Swiss / High-Fashion Editorial
 * Inspired by Stripe Press, Monocle, and Swiss Modernism:
 * Generous typography, dramatic scale contrast, illuminated platinum hairlines,
 * and high-contrast editorial monographs.
 */
export const AtelierEditorialVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* LEFT: Architectural Editorial Hero */}
      <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start p-6 sm:p-8 rounded-2xl bg-[#07060A]/90 backdrop-blur-2xl border border-white/[0.15] shadow-[0_30px_70px_rgba(0,0,0,0.85)] relative">
        {/* Editorial Folio Mark */}
        <div className="flex items-center gap-3">
          <span className="w-6 h-px bg-[#C4B5FD]" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#C4B5FD] uppercase font-semibold">
            CADENCE · {profile.profession.toUpperCase()}
          </span>
        </div>

        {/* Display Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-[38px] font-light text-white leading-[1.12] tracking-tight">
          Conversations that <br />
          <span className="font-serif italic font-normal text-[#E2E8F0]">
            define your authority.
          </span>
        </h1>

        {/* Masterclass Insight Quote Box */}
        <div className="w-full p-4 rounded-xl bg-white/[0.03] border-l-2 border-[#C4B5FD] border-y border-r border-white/[0.06] text-left">
          <p className="text-xs sm:text-[13px] text-[#CBD5E1] font-light italic leading-relaxed">
            “Executive presence in English is not measured by vocabulary density, but by the absence of hesitation when framing critical decisions.”
          </p>
          <p className="text-[10px] font-mono text-[#94A3B8] mt-2 uppercase tracking-wider">
            Target Focus: {profile.learningGoal}
          </p>
        </div>

        {/* Typographic Link CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group px-6 py-2.5 rounded-full bg-white text-black hover:bg-[#F8FAFC] font-semibold text-xs tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-3 shadow-lg hover:shadow-white/20 active:scale-95"
          >
            <span>Begin Dialogue</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: High-Contrast Monograph Slats */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[360px] xl:min-w-[380px] shrink-0">
        {/* Slat 1 */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group p-4 rounded-2xl bg-[#07060A]/90 hover:bg-[#120F1C] border border-white/[0.12] hover:border-white/30 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl font-light font-mono text-[#64748B] group-hover:text-white transition-colors">
              01
            </span>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#A78BFA] uppercase font-bold">
                LEXICAL ARCHIVE
              </span>
              <span className="text-sm font-semibold text-white truncate mt-0.5">
                “{profile.memoryWord}”
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {profile.cardsDue} retention targets due
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.04] text-[#C4B5FD] group-hover:scale-110 transition-transform shrink-0">
            <StudioMemoryIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Slat 2 */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group p-4 rounded-2xl bg-[#07060A]/90 hover:bg-[#120F1C] border border-white/[0.12] hover:border-white/30 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl font-light font-mono text-[#64748B] group-hover:text-white transition-colors">
              02
            </span>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
                EDITORIAL DOSSIER
              </span>
              <span className="text-sm font-semibold text-white truncate mt-0.5">
                {profile.readingArticle}
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {profile.readingTimeMin} min read · {profile.readingCefr}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.04] text-[#38BDF8] group-hover:scale-110 transition-transform shrink-0">
            <StudioReadingIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Slat 3 */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group p-4 rounded-2xl bg-[#07060A]/90 hover:bg-[#120F1C] border border-white/[0.12] hover:border-white/30 transition-all duration-300 backdrop-blur-2xl cursor-pointer flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-4 min-w-0">
            <span className="text-2xl font-light font-mono text-[#64748B] group-hover:text-white transition-colors">
              03
            </span>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[9.5px] font-mono tracking-widest text-[#FBBF24] uppercase font-bold">
                ORAL SIMULATION
              </span>
              <span className="text-sm font-semibold text-white truncate mt-0.5">
                {profile.interviewTitle}
              </span>
              <span className="text-[11px] text-[#94A3B8]">
                {profile.interviewRound} · {profile.audioKhz}
              </span>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/[0.04] text-[#FBBF24] group-hover:scale-110 transition-transform shrink-0">
            <StudioVoiceIcon className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
