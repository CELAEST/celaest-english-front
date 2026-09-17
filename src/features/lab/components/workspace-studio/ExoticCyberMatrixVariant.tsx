import React from "react";
import { WorkspaceVariantProps } from "./types";
import {
  ExoticAudioSpectrumGraphic,
  ExoticDiamondRuneIcon,
  ExoticReticleIcon,
} from "./ExoticBespokeGraphics";

export const ExoticCyberMatrixVariant: React.FC<WorkspaceVariantProps> = ({
  profile,
  onSelectAction,
}) => {
  return (
    <div className="w-full flex flex-col lg:flex-row items-start justify-between gap-8 z-20">
      {/* LEFT: Cyber-Bioluminescent Matrix Deck */}
      <div className="relative p-6 rounded-2xl bg-[#060410]/70 border border-white/[0.08] backdrop-blur-2xl max-w-lg select-none text-left items-start shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Glowing cyber corner brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#A27FF3]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#A27FF3]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#A27FF3]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#A27FF3]" />

        {/* Matrix Telemetry Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[9.5px] font-mono tracking-[0.25em] text-[#C4B5FD] uppercase">
              SYS.STATUS // RECEPTOR LIVE
            </span>
          </div>
          <span className="text-[9.5px] font-mono text-white/40">
            LOC // {profile.cefrLevel}
          </span>
        </div>

        {/* Display Headline */}
        <div className="mt-4">
          <div className="text-[10px] font-mono text-[#A27FF3] tracking-widest uppercase mb-1">
            TARGET VECTOR: {profile.profession}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-light text-white leading-[1.12] tracking-tight">
            Precision Execution in <br />
            <span className="font-semibold text-[#DDD6FE]">Spoken Consensus.</span>
          </h1>
        </div>

        {/* Progress Matrix Line */}
        <div className="mt-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-white/40 uppercase">Cognitive Goal</span>
            <span className="text-xs text-white font-medium">{profile.learningGoal}</span>
          </div>
          <ExoticAudioSpectrumGraphic className="h-4" />
        </div>

        {/* Cyber Kinetic Button */}
        <div className="mt-5 pt-1">
          <button
            type="button"
            onClick={() => onSelectAction?.("interview")}
            className="group relative px-6 py-2.5 rounded-lg bg-[#A27FF3] hover:bg-white text-black font-mono font-bold text-xs tracking-widest transition-all duration-200 cursor-pointer flex items-center gap-2.5 shadow-[0_0_30px_rgba(162,127,243,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.6)]"
          >
            <span>ENGAGE SIMULATION</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Cyber Holographic Telemetry Nodes */}
      <div className="flex flex-col space-y-2.5 w-full sm:w-auto lg:min-w-[340px] xl:min-w-[360px] shrink-0">
        <div className="flex items-center justify-between px-1 text-[9.5px] font-mono uppercase tracking-[0.25em] text-white/40">
          <span>// QUANTUM NODES</span>
          <span>SYNC 100%</span>
        </div>

        {/* Node 1: Memory */}
        <div
          onClick={() => onSelectAction?.("memory")}
          className="group relative p-3 rounded-xl bg-[#060410]/70 hover:bg-[#0c0820]/90 border border-white/[0.08] hover:border-[#A27FF3] transition-all cursor-pointer backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(162,127,243,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <ExoticDiamondRuneIcon className="w-5 h-5 text-[#A27FF3]" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[9px] font-mono text-[#DDD6FE] tracking-wider uppercase">
                  NODE 01 // MEMORY RETENTION
                </span>
                <span className="text-xs text-white font-medium truncate mt-0.5">
                  “{profile.memoryWord}”
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {profile.cardsDue} DUE
              </span>
              <span className="text-[9px] font-mono text-white/40">
                {profile.retentionRate}% STBL
              </span>
            </div>
          </div>
        </div>

        {/* Node 2: Reading */}
        <div
          onClick={() => onSelectAction?.("reading")}
          className="group relative p-3 rounded-xl bg-[#060410]/70 hover:bg-[#0c0820]/90 border border-white/[0.08] hover:border-[#38BDF8] transition-all cursor-pointer backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <ExoticReticleIcon className="w-5 h-5 text-[#38BDF8]" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[9px] font-mono text-[#7DD3FC] tracking-wider uppercase">
                  NODE 02 // EXECUTIVE READING
                </span>
                <span className="text-xs text-white font-medium truncate mt-0.5">
                  {profile.readingArticle}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] font-mono text-[#7DD3FC] font-bold">
                {profile.readingCefr}
              </span>
              <span className="text-[9px] font-mono text-white/40">
                {profile.readingTimeMin}M // {profile.wordCount}W
              </span>
            </div>
          </div>
        </div>

        {/* Node 3: Interview */}
        <div
          onClick={() => onSelectAction?.("interview")}
          className="group relative p-3 rounded-xl bg-[#060410]/70 hover:bg-[#0c0820]/90 border border-white/[0.08] hover:border-[#10B981] transition-all cursor-pointer backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]" />
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[9px] font-mono text-emerald-300 tracking-wider uppercase">
                  NODE 03 // LIVE AUDIO ENGINE
                </span>
                <span className="text-xs text-white font-medium truncate mt-0.5">
                  {profile.interviewTitle}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                48kHz
              </span>
              <span className="text-[9px] font-mono text-white/40">
                WORKLET
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
