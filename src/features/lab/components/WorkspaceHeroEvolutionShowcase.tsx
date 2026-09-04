import React, { useState, useMemo } from "react";

// =========================================================================
// BESPOKE STANDALONE SVG VECTOR MASTERPIECES (LOCKED REFERENCE STANDARD)
// =========================================================================

/**
 * 1. SolarNeuralSynapseIcon (Top Icon in Reference):
 * Central circle with 8 optical radial rays and glowing lavender pearl nucleus.
 */
export const SolarNeuralSynapseIcon: React.FC<{ className?: string }> = ({
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
    <circle cx="14" cy="14" r="4.2" className="icon-draw" pathLength={1} />
    <line x1="14" y1="2.5" x2="14" y2="7" className="icon-draw" pathLength={1} />
    <line x1="14" y1="21" x2="14" y2="25.5" className="icon-draw" pathLength={1} />
    <line x1="2.5" y1="14" x2="7" y2="14" className="icon-draw" pathLength={1} />
    <line x1="21" y1="14" x2="25.5" y2="14" className="icon-draw" pathLength={1} />
    <line x1="5.8" y1="5.8" x2="9" y2="9" className="icon-draw" pathLength={1} />
    <line x1="22.2" y1="5.8" x2="19" y2="9" className="icon-draw" pathLength={1} />
    <line x1="5.8" y1="22.2" x2="9" y2="19" className="icon-draw" pathLength={1} />
    <line x1="22.2" y1="22.2" x2="19" y2="19" className="icon-draw" pathLength={1} />
    <circle className="icon-pearl" cx="14" cy="14" r="1.8" fill="#C4B5FD" stroke="none" />
  </svg>
);

/**
 * 2. ArchitecturalCodexSpineIcon (Middle Icon in Reference):
 * Open geometric book wings with clean vertical spine and radiant lavender diamond pearl on center axis.
 */
export const ArchitecturalCodexSpineIcon: React.FC<{ className?: string }> = ({
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
    <path
      className="icon-draw"
      pathLength={1}
      d="M4.5 7.5 C8 5.8 11.5 5.8 14 7.5 C16.5 5.8 20 5.8 23.5 7.5 V20.5 C20 18.8 16.5 18.8 14 20.5 C11.5 18.8 8 18.8 4.5 20.5 Z"
    />
    <line x1="14" y1="7.5" x2="14" y2="20.5" className="icon-draw" pathLength={1} opacity={0.8} />
    <path
      d="M14 11.5 L15.6 14 L14 16.5 L12.4 14 Z"
      fill="#C4B5FD"
      stroke="none"
      className="icon-pearl"
    />
  </svg>
);

/**
 * 3. AcousticOrbitalApertureIcon (Bottom Icon in Reference):
 * Concentric orbit rings with top vertical antenna/pin and glowing lavender pearl tip.
 */
export const AcousticOrbitalApertureIcon: React.FC<{ className?: string }> = ({
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
    <circle cx="14" cy="16" r="7.5" className="icon-draw" pathLength={1} />
    <circle cx="14" cy="16" r="3.2" className="icon-draw" pathLength={1} opacity={0.9} />
    <line x1="14" y1="8.5" x2="14" y2="3.5" className="icon-draw" pathLength={1} strokeWidth="1.4" />
    <circle className="icon-pearl" cx="14" cy="3.5" r="1.5" fill="#C4B5FD" stroke="none" />
  </svg>
);

type LeftFontFamily = "jakarta" | "sora" | "instrument" | "cormorant";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeFont, setActiveFont] = useState<LeftFontFamily>("jakarta");
  const [activeTrack, setActiveTrack] = useState<"tech" | "executive" | "pitch">("tech");

  // Dynamic Career Track Profiles
  const tracks = {
    tech: {
      headline: "Tech Career & AI",
      focus: "Conversation First",
      subline: "Focused on distributed systems, AI-native leadership, and low-latency architectural consensus.",
      actionPrompt: "Continue Session",
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
      subline: "Focused on high-stakes alignment, decisive RFC vocabulary, and diplomatic risk framing.",
      actionPrompt: "Continue Session",
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
      subline: "Focused on ROI framing before engineering velocity, objection handling, and stakeholder buy-in.",
      actionPrompt: "Continue Session",
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

  // Right-hand callouts (LOCKED & PRISTINE)
  const callouts = useMemo(
    () => [
      {
        id: "memory",
        tag: "LAST MEMORY",
        title: currentTrack.memoryTitle,
        meta: currentTrack.memoryMeta,
        stat: currentTrack.memoryStat,
        Icon: SolarNeuralSynapseIcon,
      },
      {
        id: "reading",
        tag: "NEXT READING",
        title: currentTrack.readingTitle,
        meta: currentTrack.readingMeta,
        stat: currentTrack.readingStat,
        Icon: ArchitecturalCodexSpineIcon,
      },
      {
        id: "interview",
        tag: "UPCOMING INTERVIEW",
        title: currentTrack.interviewTitle,
        meta: currentTrack.interviewMeta,
        stat: currentTrack.interviewStat,
        Icon: AcousticOrbitalApertureIcon,
      },
    ],
    [currentTrack],
  );

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Header Filter Ribbon */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] shadow-2xl">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1">
            Left Font:
          </span>
          {[
            { id: "jakarta", label: "1. Plus Jakarta Sans (Selected · Modern Tech Luxury)" },
            { id: "sora", label: "2. Sora (Neo-Geometric)" },
            { id: "instrument", label: "3. Instrument Serif" },
            { id: "cormorant", label: "4. Cormorant Garamond" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFont(f.id as LeftFontFamily)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeFont === f.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Luxury Standards Signature & Track Selector */}
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-white/40 tracking-wider flex items-center gap-1.5 hidden md:flex">
            <span className="text-[#A27FF3]">✦</span>
            <span>Minimalist Luxury Standard</span>
          </span>

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

        {/* Main Stage Grid: Ultra-Clean Sora Left Column + Locked Right-Side Swiss HUD */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: SORA FEATURED (100% Clean, Zero Box, Pure Luxury Match)     */}
          {/* ========================================================================= */}
          {activeFont === "sora" && (
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Sora',sans-serif]">
              {/* Category Line with Fine Hairline Gradient */}
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
                  Good Afternoon, Esteban Perez
                </span>
              </div>

              {/* Display Headline in Sora (Light & Clean Contrast) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-light text-white leading-[1.1] tracking-[-0.03em]">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-normal text-[#DDD6FE]">conversation.</span>
              </h1>

              {/* Context Subtext (Matching the Right Column's Color & Spacing Palette) */}
              <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md">
                Your customized session for{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.focus}</span> is centered on{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.headline}</span>. <br />
                Shall we continue from where we left off?
              </p>

              {/* Naked Typographic Action (Zero Container, Pure Crisp Link) */}
              <div className="pt-2">
                <button
                  type="button"
                  className="group text-[11.5px] font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <span>CONTINUE SESSION</span>
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* FONT 2: PLUS JAKARTA SANS */}
          {activeFont === "jakarta" && (
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Plus_Jakarta_Sans',sans-serif]">
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
                  Good Afternoon, Esteban Perez
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[48px] font-light text-white leading-[1.08] tracking-[-0.035em]">
                I’ve been thinking <br />
                about our last <br />
                <span className="font-normal text-[#DDD6FE]">conversation.</span>
              </h1>

              <p className="text-xs sm:text-[13.5px] text-[#8E90A5] font-light leading-[1.7] max-w-md">
                Your customized session for{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.focus}</span> is centered on{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.headline}</span>. <br />
                Shall we continue from where we left off?
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  className="group text-[11.5px] font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <span>CONTINUE SESSION</span>
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* FONT 3: INSTRUMENT SERIF */}
          {activeFont === "instrument" && (
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Instrument_Serif',serif]">
              <div className="flex items-center gap-3 font-sans">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
                  Good Afternoon, Esteban Perez
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-normal italic text-white leading-[0.98] tracking-[-0.015em]">
                I’ve been thinking <br />
                about our last <br />
                <span className="not-italic font-normal text-[#DDD6FE]">conversation.</span>
              </h1>

              <p className="text-xs sm:text-[14px] text-[#8E90A5] font-sans font-light leading-[1.65] max-w-md">
                Your customized session for{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.focus}</span> is centered on{" "}
                <span className="text-[#C4B5FD] font-medium">{currentTrack.headline}</span>. <br />
                Shall we continue from where we left off?
              </p>

              <div className="pt-2 font-sans">
                <button
                  type="button"
                  className="group text-[11.5px] font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <span>CONTINUE SESSION</span>
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* FONT 4: CORMORANT GARAMOND */}
          {activeFont === "cormorant" && (
            <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1 font-['Cormorant_Garamond',serif]">
              <div className="flex items-center gap-3 font-sans">
                <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
                <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.22em] text-[#B197FF] uppercase">
                  Good Afternoon, Esteban Perez
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[58px] font-light italic text-white leading-[1.02] tracking-[-0.01em]">
                I’ve been thinking <br />
                about our last <br />
                <span className="not-italic font-normal text-[#DDD6FE]">conversation.</span>
              </h1>

              <p className="text-xs sm:text-[14px] font-sans text-[#8E90A5] font-light leading-[1.7] max-w-md">
                Your customized session for{" "}
                <span className="text-white font-medium">{currentTrack.focus}</span> is ready on{" "}
                <span className="text-white font-medium">{currentTrack.headline}</span>.
              </p>

              <div className="pt-2 font-sans">
                <button
                  type="button"
                  className="group text-[11.5px] font-mono font-medium tracking-widest text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5"
                >
                  <span>CONTINUE SESSION</span>
                  <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all text-xs">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: LOCKED SWISS PRECISION HUD (Exact Reference Replica)        */}
          {/* ========================================================================= */}
          <div className="flex flex-col select-none pt-0 divide-y divide-white/[0.08] w-full sm:w-auto lg:min-w-[320px] xl:min-w-[340px] shrink-0">
            {callouts.map((item, index) => (
              <div
                key={item.id}
                className={`group px-1 flex items-center justify-between cursor-pointer transition-all duration-300 hover:translate-x-[-4px] ${
                  index === 0 ? "pt-0 pb-4 sm:pb-5" : "py-4 sm:py-5"
                }`}
              >
                <div className="flex items-center gap-5 min-w-0">
                  {/* Standalone Vector Artwork with Glowing Lavender Pearl Accent */}
                  <div className="text-white group-hover:text-[#DDD6FE] transition-all duration-300 shrink-0 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(162,127,243,0.3)]">
                    <item.Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* High-Contrast Typography Hierarchy */}
                  <div className="flex flex-col text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                        {item.tag}
                      </span>
                      <span className="text-[9.5px] font-mono text-white/40">{item.stat}</span>
                    </div>
                    <span className="text-[14.5px] sm:text-[15px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                      {item.meta}
                    </span>
                  </div>
                </div>

                <div className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 pl-3">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
