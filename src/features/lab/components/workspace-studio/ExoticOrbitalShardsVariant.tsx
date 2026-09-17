import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  ExoticGyroscopeGraphic,
  ExoticAudioSpectrumGraphic,
  ExoticDiamondRuneIcon,
  ExoticReticleIcon,
} from "./ExoticBespokeGraphics";
import {
  StudioMemoryIcon,
  StudioReadingIcon,
  StudioVoiceIcon,
} from "./StudioBespokeIcons";

export const ExoticOrbitalShardsVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Holographic Command Shard */}
      <div className="relative group p-6 rounded-[28px] rounded-tr-[10px] bg-gradient-to-br from-[#0c081e]/60 via-[#070414]/70 to-[#03010a]/80 border-l-2 border-l-[#A27FF3] border-t border-t-white/15 border-r border-r-white/5 border-b border-b-[#7C3AED]/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] shadow-[0_0_30px_rgba(139,92,246,0.15)] max-w-lg select-none text-left items-start transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.25)]">
        {/* Holographic Header Bar */}
        <div className="flex items-center justify-between w-full mb-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-[#A27FF3]/30">
            <ExoticReticleIcon className="w-3.5 h-3.5 text-[#DDD6FE]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#DDD6FE] uppercase">
              ORBITAL COGNITION · {profile.cefrLevel}
            </span>
          </div>
          <ExoticAudioSpectrumGraphic className="h-3.5" />
        </div>

        {/* Display Headline with Gyroscope Integration */}
        <div className="flex items-start gap-4 mt-2">
          <ExoticGyroscopeGraphic className="w-12 h-12 shrink-0 mt-1" />
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-light text-white leading-[1.15] tracking-tight">
              Sovereign Fluency in <br />
              <span className="font-semibold bg-gradient-to-r from-white via-[#DDD6FE] to-[#A27FF3] bg-clip-text text-transparent">
                High-Stakes Dialogue.
              </span>
            </h1>
          </div>
        </div>

        {/* Dynamic Context with Laser Hairline */}
        <div className="relative pl-3 mt-3.5 border-l border-[#A27FF3]/40">
          <p className="text-xs sm:text-[13px] text-[#A3A5BA] font-light leading-[1.6]">
            Targeting executive cadence for{" "}
            <span className="text-white font-medium">{profile.profession}</span> on{" "}
            <span className="text-[#C4B5FD] font-medium">{profile.learningGoal}</span>.
          </p>
        </div>

        {/* Hyper-Futuristic Trigger Button */}
        <div className="mt-5 pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED]/40 via-[#8B5CF6]/50 to-[#6D28D9]/40 hover:from-[#7C3AED]/70 hover:to-[#6D28D9]/70 border border-[#C4B5FD]/40 hover:border-white transition-all duration-300 shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:scale-[1.02] cursor-pointer flex items-center gap-3"
          >
            <ExoticDiamondRuneIcon className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-xs font-mono font-bold tracking-[0.16em] text-white">
              INITIALIZE SYNAPSE
            </span>
            <span className="text-[#DDD6FE] group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <span className="text-[10.5px] font-mono text-white/40">
            48kHz Neural Worklet
          </span>
        </div>
      </div>

      {/* RIGHT: Floating Orbital Crystalline Shards */}
      <div className="flex flex-col space-y-3 w-full sm:w-auto lg:min-w-[350px] xl:min-w-[370px] shrink-0">
        <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">
          <span>Neural Trajectory</span>
          <span className="text-white/30">HUD // 03</span>
        </div>

        {/* Shard 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group relative p-3.5 rounded-2xl bg-gradient-to-r from-[#090616]/70 via-[#100b26]/50 to-[#070414]/60 hover:from-[#130d30]/80 hover:to-[#170f38]/70 border-r-2 border-r-[#A27FF3] border-t border-t-white/15 border-b border-b-white/5 border-l border-l-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(162,127,243,0.25)] hover:translate-x-[-4px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#7C3AED]/20 to-transparent border border-[#8B5CF6]/30 text-[#DDD6FE] group-hover:scale-110 transition-transform">
                <StudioMemoryIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#C4B5FD] uppercase">
                    LEXICAL MEMORY
                  </span>
                  <span className="text-[9px] font-mono px-1.5 rounded bg-white/[0.08] text-white/70">
                    {profile.cardsDue} DUE
                  </span>
                </div>
                <span className="text-sm text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                  “{profile.memoryWord}”
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.retentionRate}% stability · Spaced repetition
                </span>
              </div>
            </div>
            <span className="text-[#C4B5FD]/40 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pr-1">
              ⬡
            </span>
          </div>
        </div>

        {/* Shard 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group relative p-3.5 rounded-2xl bg-gradient-to-r from-[#090616]/70 via-[#100b26]/50 to-[#070414]/60 hover:from-[#130d30]/80 hover:to-[#170f38]/70 border-r-2 border-r-[#38BDF8] border-t border-t-white/15 border-b border-b-white/5 border-l border-l-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:translate-x-[-4px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-transparent border border-[#38BDF8]/30 text-[#7DD3FC] group-hover:scale-110 transition-transform">
                <StudioReadingIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#7DD3FC] uppercase">
                    SYNTACTIC CODEX
                  </span>
                  <span className="text-[9px] font-mono px-1.5 rounded bg-white/[0.08] text-white/70">
                    {profile.readingCefr}
                  </span>
                </div>
                <span className="text-sm text-white font-medium mt-0.5 tracking-wide group-hover:text-[#7DD3FC] transition-colors truncate">
                  {profile.readingArticle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.readingTimeMin} min sprint · {profile.wordCount} words
                </span>
              </div>
            </div>
            <span className="text-[#38BDF8]/40 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pr-1">
              ⬡
            </span>
          </div>
        </div>

        {/* Shard 3: Interview */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group relative p-3.5 rounded-2xl bg-gradient-to-r from-[#090616]/70 via-[#100b26]/50 to-[#070414]/60 hover:from-[#130d30]/80 hover:to-[#170f38]/70 border-r-2 border-r-[#10B981] border-t border-t-white/15 border-b border-b-white/5 border-l border-l-white/5 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:translate-x-[-4px]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-transparent border border-[#10B981]/30 text-[#6EE7B7] group-hover:scale-110 transition-transform">
                <StudioVoiceIcon className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#6EE7B7] uppercase">
                    SPOKEN NEXUS
                  </span>
                  <span className="text-[9px] font-mono px-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    48kHz
                  </span>
                </div>
                <span className="text-sm text-white font-medium mt-0.5 tracking-wide group-hover:text-[#6EE7B7] transition-colors truncate">
                  {profile.interviewTitle}
                </span>
                <span className="text-[11px] text-[#8e90a5] font-light">
                  {profile.interviewRound} · Real-time AI Dialogue
                </span>
              </div>
            </div>
            <span className="text-[#10B981]/40 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pr-1">
              ⬡
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
