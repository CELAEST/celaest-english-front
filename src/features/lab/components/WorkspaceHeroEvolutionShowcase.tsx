import React, { useState, useMemo } from "react";

// =========================================================================
// BESPOKE STANDALONE SVG VECTOR MASTERPIECES (Zero Container, Pure Artwork)
// =========================================================================

export const StandaloneMemoryGlyph: React.FC<{ className?: string }> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Continuous multi-harmonic synaptic DNA waves */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M4 8C9 8 11 20 16 20C21 20 23 8 23 8"
      opacity={0.9}
    />
    <path
      className="icon-draw"
      pathLength={1}
      d="M4 20C9 20 11 8 16 8C21 8 23 20 23 20"
      opacity={0.5}
    />
    {/* Synaptic Molecular Bridge Rungs */}
    <line x1="7.5" y1="11.5" x2="7.5" y2="16.5" strokeDasharray="1.5 2" opacity={0.6} />
    <line x1="13.5" y1="8" x2="13.5" y2="20" strokeDasharray="1.5 2" opacity={0.8} />
    <line x1="19.5" y1="11.5" x2="19.5" y2="16.5" strokeDasharray="1.5 2" opacity={0.6} />
    {/* Brand Center Pulsating Pearl */}
    <circle className="icon-pearl" cx="13.5" cy="14" r="2.2" fill="currentColor" stroke="none" />
  </svg>
);

export const StandaloneReadingCodex: React.FC<{ className?: string }> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Isometric architectural codex spine and pages */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M3.5 7C7 5.2 10.5 5.2 14 7C17.5 5.2 21 5.2 24.5 7V21C21 19.2 17.5 19.2 14 21C10.5 19.2 7 19.2 3.5 21Z"
    />
    <path className="icon-draw" pathLength={1} d="M14 7V21" opacity={0.7} />
    {/* Clean horizontal paragraph engravings */}
    <line x1="6.5" y1="11" x2="10.5" y2="11" opacity={0.5} />
    <line x1="6.5" y1="14" x2="10.5" y2="14" opacity={0.5} />
    <line x1="6.5" y1="17" x2="9.5" y2="17" opacity={0.4} />
    <line x1="17.5" y1="11" x2="21.5" y2="11" opacity={0.5} />
    <line x1="17.5" y1="14" x2="21.5" y2="14" opacity={0.5} />
    <line x1="17.5" y1="17" x2="20.5" y2="17" opacity={0.4} />
    {/* Brand Radiant Bookmark Pearl */}
    <circle className="icon-pearl" cx="19" cy="8.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const StandaloneInterviewAperture: React.FC<{ className?: string }> = ({
  className = "w-7 h-7",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Studio Condenser Diaphragm Capsule */}
    <rect className="icon-draw" pathLength={1} x="10.5" y="3.5" width="7" height="12.5" rx="3.5" />
    <line x1="14" y1="7" x2="14" y2="10.5" opacity={0.5} />
    {/* Acoustic Suspension Cradle */}
    <path
      className="icon-draw"
      pathLength={1}
      d="M6.5 12C6.5 16.1421 9.85786 19.5 14 19.5C18.1421 19.5 21.5 16.1421 21.5 12"
      opacity={0.8}
    />
    <line x1="14" y1="19.5" x2="14" y2="24.5" />
    <line x1="9.5" y1="24.5" x2="18.5" y2="24.5" />
    {/* Dual Harmonic Pulsing Pearls */}
    <circle className="icon-pearl" cx="6.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    <circle className="icon-pearl" cx="21.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

type MasterParadigm = "unboxed-kinetic" | "horizon-timeline" | "acoustic-studio" | "swiss-hud";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeParadigm, setActiveParadigm] = useState<MasterParadigm>("unboxed-kinetic");
  const [activeTrack, setActiveTrack] = useState<"tech" | "executive" | "pitch">("tech");
  const [isPlayingBriefing, setIsPlayingBriefing] = useState<boolean>(false);

  // Dynamic Career Track Profiles
  const tracks = {
    tech: {
      headline: "Tech Career & AI",
      focus: "Conversation First",
      subline: "Centered on distributed systems, AI-native leadership, and low-latency architectural consensus.",
      memoryTitle: "“Distributed systems & latency review”",
      memoryMeta: "Ready for practice · 14 cards",
      memoryStat: "88% Stability",
      readingTitle: "Mastering Modern Leadership & Alignment",
      readingMeta: "3 min read · Technical C1",
      readingStat: "480 Words",
      interviewTitle: "Tech Career & AI Simulation",
      interviewMeta: "Live AI Simulation · Round 01",
      interviewStat: "48kHz Live Audio",
    },
    executive: {
      headline: "Executive Leadership",
      focus: "Boardroom Authority",
      subline: "Centered on high-stakes alignment, decisive RFC vocabulary, and diplomatic risk framing.",
      memoryTitle: "“Diplomatic risk framing & concision”",
      memoryMeta: "Ready for practice · 22 cards",
      memoryStat: "94% Retention",
      readingTitle: "The Decisive Executive: Leading Consensus",
      readingMeta: "4 min read · Executive C2",
      readingStat: "620 Words",
      interviewTitle: "Boardroom Executive Simulation",
      interviewMeta: "Live AI Simulation · Round 02",
      interviewStat: "C2 Tone Modulator",
    },
    pitch: {
      headline: "Cross-Functional Pitch",
      focus: "Persuasive Negotiation",
      subline: "Centered on ROI framing before engineering velocity, objection handling, and stakeholder buy-in.",
      memoryTitle: "“Persuasive ROI metrics lexicon”",
      memoryMeta: "Ready for practice · 18 cards",
      memoryStat: "91% Recall",
      readingTitle: "Framing Value Before Engineering Velocity",
      readingMeta: "2 min read · Strategic C1",
      readingStat: "340 Words",
      interviewTitle: "Stakeholder Negotiation Simulation",
      interviewMeta: "Live AI Simulation · Round 01",
      interviewStat: "Objection Matrix",
    },
  };

  const currentTrack = tracks[activeTrack];

  const callouts = useMemo(
    () => [
      {
        id: "memory",
        tag: "LAST MEMORY",
        title: currentTrack.memoryTitle,
        meta: currentTrack.memoryMeta,
        stat: currentTrack.memoryStat,
        Icon: StandaloneMemoryGlyph,
        accentColor: "#C4B5FD",
      },
      {
        id: "reading",
        tag: "NEXT READING",
        title: currentTrack.readingTitle,
        meta: currentTrack.readingMeta,
        stat: currentTrack.readingStat,
        Icon: StandaloneReadingCodex,
        accentColor: "#A27FF3",
      },
      {
        id: "interview",
        tag: "UPCOMING INTERVIEW",
        title: currentTrack.interviewTitle,
        meta: currentTrack.interviewMeta,
        stat: currentTrack.interviewStat,
        Icon: StandaloneInterviewAperture,
        accentColor: "#7048E8",
      },
    ],
    [currentTrack],
  );

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Header Filter Ribbon: 4 Radical Design Paradigms */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] shadow-2xl">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1">
            Design Paradigm:
          </span>
          {[
            { id: "unboxed-kinetic", label: "1. Naked Kinetic Luxury" },
            { id: "horizon-timeline", label: "2. Spatial Horizon Timeline" },
            { id: "acoustic-studio", label: "3. Acoustic Synaptic Studio" },
            { id: "swiss-hud", label: "4. Swiss Precision HUD" },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveParadigm(p.id as MasterParadigm)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeParadigm === p.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Career Track Quick Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase text-white/30 mr-1">Track:</span>
          {(
            [
              { id: "tech", label: "Tech & AI" },
              { id: "executive", label: "Executive" },
              { id: "pitch", label: "Pitch" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTrack(t.id)}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                activeTrack === t.id
                  ? "bg-white/[0.12] text-white border border-white/20"
                  : "bg-white/[0.02] text-white/40 border border-white/[0.04] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Hero Stage Container */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.95)] min-h-[500px] p-6 sm:p-10 lg:p-14 flex flex-col justify-between select-none">
        {/* Full-Bleed Room Wallpaper Background (3D Orb lives naturally in video) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <img
            src="/assets/workspace_room_bg.png"
            alt="Room Background with integrated 3D Orb"
            className="w-full h-full object-cover object-[58%_97%] opacity-95 transition-all duration-300"
          />
          {/* Subtle Vignettes for Pure Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/40 to-[#030208]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/30 via-transparent to-[#030208]/90 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* PARADIGM 1: NAKED KINETIC LUXURY (Zero Containers, Standalone Vectors)    */}
        {/* ========================================================================= */}
        {activeParadigm === "unboxed-kinetic" && (
          <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
            {/* Left Editorial Column */}
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                  Good Afternoon, Esteban Perez
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-white leading-[1.08] tracking-tight">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-display-accent italic text-[#DDD6FE] drop-shadow-[0_0_30px_rgba(162,127,243,0.3)]">
                  conversation.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-[1.7] font-sans pt-1 max-w-md">
                Your customized session for{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.focus}</span> is centered on{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.headline}</span>. <br />
                {currentTrack.subline}
              </p>

              {/* Minimal Lingua AI Signature */}
              <div className="pt-2">
                <button
                  type="button"
                  className="group/link text-xs sm:text-sm font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.2]"
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_12px_rgba(136,104,248,0.8)] animate-pulse" />
                  <span className="group-hover/link:translate-x-0.5 transition-transform duration-300">
                    Lingua AI Engine
                  </span>
                  <span className="text-white/30 group-hover/link:text-white transition-colors text-xs">→</span>
                </button>
              </div>
            </div>

            {/* Right Callouts: Standalone Floating Vectors (ZERO BOX) */}
            <div className="flex flex-col select-none pt-2 sm:pt-4 gap-7 w-full sm:w-auto lg:min-w-[340px]">
              {callouts.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 cursor-pointer transition-all duration-300 hover:-translate-x-2"
                >
                  {/* Standalone Vector Glyph with Brand Pulse & Self-Drawing Stroke */}
                  <div className="text-[#C4B5FD] group-hover:text-white transition-all duration-300 shrink-0 pt-0.5 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(162,127,243,0.3)]">
                    <item.Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* Clean Typography */}
                  <div className="flex flex-col text-left max-w-[240px] sm:max-w-[280px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                        {item.tag}
                      </span>
                    </div>
                    <span className="text-[14.5px] sm:text-[15px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                      {item.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARADIGM 2: SPATIAL HORIZON TIMELINE (Linear Flow with Direct Metrics)     */}
        {/* ========================================================================= */}
        {activeParadigm === "horizon-timeline" && (
          <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
            {/* Left Column with Time-of-Day Stamp */}
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1">
              <div className="flex items-center gap-2.5 text-[11px] font-mono text-white/40">
                <span className="text-[#34D399]">●</span>
                <span className="tracking-widest uppercase">15:45 GMT-5 • Real-Time AI Synapse</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-white leading-[1.08] tracking-tight">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-[1.7] font-sans max-w-md">
                Your focus today is on{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.headline}</span>.{" "}
                Ready to review your recent cognitive memory cards or start your live simulation?
              </p>
            </div>

            {/* Right Column: Floating Timeline Rail with Direct Stat Meters */}
            <div className="flex flex-col select-none pt-2 sm:pt-4 divide-y divide-white/[0.06] w-full sm:w-auto lg:min-w-[340px]">
              {callouts.map((item) => (
                <div
                  key={item.id}
                  className="group py-4 px-1 flex items-center justify-between cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-[#C4B5FD] group-hover:text-white transition-colors shrink-0">
                      <item.Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono tracking-widest text-[#B197FF] uppercase">
                          {item.tag}
                        </span>
                        <span className="text-[9.5px] font-mono text-white/50">{item.stat}</span>
                      </div>
                      <span className="text-[14.5px] font-medium text-white tracking-wide truncate group-hover:text-[#DDD6FE] transition-colors">
                        {item.title}
                      </span>
                    </div>
                  </div>

                  <span className="text-white/20 group-hover:text-white transition-colors text-sm pl-2">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARADIGM 3: ACOUSTIC SYNAPTIC STUDIO (Voice & Spectrum Focused)            */}
        {/* ========================================================================= */}
        {activeParadigm === "acoustic-studio" && (
          <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
            {/* Left Column with Audio Briefing Trigger */}
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                  AI Vocal Briefing Ready
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-white leading-[1.08] tracking-tight">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
              </h1>

              {/* Interactive Audio Briefing Pill */}
              <div className="flex items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPlayingBriefing((p) => !p)}
                  className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.2] text-xs font-mono text-white transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isPlayingBriefing ? "bg-[#34D399] animate-ping" : "bg-[#A27FF3]"
                    }`}
                  />
                  <span>{isPlayingBriefing ? "Playing Audio Briefing..." : "Play 15s AI Briefing"}</span>
                </button>

                {/* Animated Audio Spectrum Bars */}
                <div className="flex items-end gap-[2px] h-5">
                  {[30, 65, 100, 45, 80, 50, 90, 40].map((h, i) => (
                    <span
                      key={i}
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isPlayingBriefing ? "bg-[#34D399] animate-pulse" : "bg-white/30"
                      }`}
                      style={{ height: `${isPlayingBriefing ? h : 25}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Acoustic Floating Nodes */}
            <div className="flex flex-col select-none pt-2 sm:pt-4 gap-6 w-full sm:w-auto lg:min-w-[340px]">
              {callouts.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
                >
                  <div className="text-[#C4B5FD] group-hover:text-white transition-colors shrink-0 pt-0.5">
                    <item.Icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col text-left max-w-[240px] sm:max-w-[280px]">
                    <span className="text-[10px] font-mono tracking-widest text-[#B197FF] uppercase">
                      {item.tag}
                    </span>
                    <span className="text-[14.5px] font-medium text-white mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                      {item.stat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PARADIGM 4: SWISS PRECISION HUD (Ultra-Minimal Monochromatic)              */}
        {/* ========================================================================= */}
        {activeParadigm === "swiss-hud" && (
          <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
            {/* Left Column: Monochromatic High-Contrast */}
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1">
              <div className="text-[10.5px] font-mono tracking-[0.25em] text-white/50 uppercase">
                ESTEBAN PEREZ // TRACK: {currentTrack.headline}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-white leading-[1.08] tracking-tight">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-display-accent italic text-white underline decoration-white/20 underline-offset-8">
                  conversation.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-white/60 font-light leading-[1.7] font-sans max-w-md">
                Session calibrated for {currentTrack.focus}. All neural metrics synced.
              </p>
            </div>

            {/* Right Column: Monochromatic HUD Glyph Rail */}
            <div className="flex flex-col select-none pt-2 sm:pt-4 gap-6 w-full sm:w-auto lg:min-w-[340px]">
              {callouts.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start gap-4 cursor-pointer transition-all duration-300 hover:translate-x-[-3px]"
                >
                  <div className="text-white/70 group-hover:text-white transition-colors shrink-0 pt-0.5">
                    <item.Icon className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col text-left max-w-[240px] sm:max-w-[280px]">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                      {item.tag}
                    </span>
                    <span className="text-[14.5px] font-medium text-white mt-0.5 tracking-wide truncate">
                      {item.title}
                    </span>
                    <span className="text-[11.5px] text-white/40 font-mono mt-0.5 truncate">
                      {item.meta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
