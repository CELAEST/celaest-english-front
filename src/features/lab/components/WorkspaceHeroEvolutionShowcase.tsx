import React, { useState } from "react";

// =========================================================================
// BESPOKE VECTOR ICONS WITH CELAEST BRAND SELF-DRAWING & PEARL PULSE
// =========================================================================

export const CognitiveMemoryBrainIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path
      className="icon-draw"
      pathLength={1}
      d="M12 12 L6.2 7.6 M12 12 l5.8 -4.4 M12 12 l-5.8 4.4 M12 12 l5.8 4.4"
    />
    <circle cx="5.2" cy="7" r="1.7" />
    <circle cx="18.8" cy="7" r="1.7" />
    <circle cx="5.2" cy="17" r="1.7" />
    <circle cx="18.8" cy="17" r="1.7" />
    <circle className="icon-pearl" cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const PrecisionOpenBookIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
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
      d="M3 6.2 C6 4.6 9 4.6 12 6.2 C15 4.6 18 4.6 21 6.2 V17.8 C18 16.2 15 16.2 12 17.8 C9 16.2 6 16.2 3 17.8 Z"
    />
    <path className="icon-draw" pathLength={1} d="M12 6.4 V17.6" />
    <circle className="icon-pearl" cx="16.6" cy="9.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const StudioVoiceMicIcon: React.FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <rect className="icon-draw" pathLength={1} x="9.4" y="3" width="5.2" height="10" rx="2.6" />
    <path className="icon-draw" pathLength={1} d="M6 11 a6 6 0 0 0 12 0 M12 17 v3.4" />
    <circle className="icon-pearl" cx="5.2" cy="7.4" r="1.05" fill="currentColor" stroke="none" />
    <circle className="icon-pearl" cx="18.8" cy="7.4" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);

// =========================================================================
// WORKSPACE HERO MASTER SHOWCASE (Zero-Box, Pure Luxury, Ultra-Clean)
// =========================================================================

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<"master" | "luminescent" | "split-rail">("master");
  const [hoveredCallout, setHoveredCallout] = useState<string | null>(null);

  const callouts = [
    {
      id: "memory",
      tag: "LAST MEMORY",
      title: "“Daily conversation review”",
      meta: "Ready for practice",
      telemetry: "14 Cards · 88% Retention",
      Icon: CognitiveMemoryBrainIcon,
    },
    {
      id: "reading",
      tag: "NEXT READING",
      title: "Mastering Modern Leadership and Alignment",
      meta: "3 min read · Today",
      telemetry: "480 Words · CEFR C1",
      Icon: PrecisionOpenBookIcon,
    },
    {
      id: "interview",
      tag: "UPCOMING INTERVIEW",
      title: "Tech Career & AI Simulation",
      meta: "Live AI Simulation",
      telemetry: "48kHz Live Audio · Adaptive",
      Icon: StudioVoiceMicIcon,
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Minimalistic Variant Selector (Zero loud buttons) */}
      <div className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#04040A] border border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1">
            Variant:
          </span>
          {[
            { id: "master", label: "1. Master Clean (Zero-Box Luxury)" },
            { id: "luminescent", label: "2. Luminescent Atmosphere" },
            { id: "split-rail", label: "3. Minimalist Split-Rail" },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVariant(v.id as "master" | "luminescent" | "split-rail")}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeVariant === v.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-white/30 hidden sm:inline">
          CELAEST Zero-Box Standard
        </span>
      </div>

      {/* 2. Hero Stage (Exact full-bleed room scene with video 3D orb) */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.95)] min-h-[500px] p-6 sm:p-10 lg:p-14 flex flex-col justify-between select-none">
        {/* Full-Bleed Room Wallpaper Background (3D Orb lives naturally in video) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <img
            src="/assets/workspace_room_bg.png"
            alt="Room Background with integrated 3D Orb"
            className="w-full h-full object-cover object-[58%_97%] opacity-95 transition-all duration-300"
          />
          {/* Soft Vignettes for Pure Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/40 to-[#030208]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/30 via-transparent to-[#030208]/90 pointer-events-none" />
        </div>

        {/* Optional Luminescent Ambient Light Behind Orb */}
        {activeVariant === "luminescent" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(162,127,243,0.15)_0%,transparent_70%)] blur-3xl" />
          </div>
        )}

        {/* Main Stage: Left Editorial Column + Right Floating Callouts */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial High-Fashion AI Briefing                          */}
          {/* ========================================================================= */}
          <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start pt-1">
            {/* Greeting Line with Fine Gradient Hairline */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
              <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                Good Afternoon, Esteban Perez
              </span>
            </div>

            {/* Display Headline — Fraunces variable serif, editorial weight contrast */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-normal text-white leading-[1.08] tracking-tight">
              I’ve been thinking <br />
              about our last <br />
              <span className="font-display-accent italic text-[#DDD6FE] drop-shadow-[0_0_30px_rgba(162,127,243,0.3)]">
                conversation.
              </span>
            </h1>

            {/* Context Subtitle */}
            <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-[1.7] font-sans pt-1 max-w-md">
              Your customized session for{" "}
              <span className="text-[#C4B5FD] font-medium">Conversation First</span> is centered on{" "}
              <span className="text-[#C4B5FD] font-medium">Tech Career & AI</span>. <br className="hidden sm:inline" />
              Shall we continue from where we left off?
            </p>

            {/* Ethereal Lingua AI Signature Pill with Pulsating Orb */}
            <div className="pt-2">
              <button
                type="button"
                className="group/link text-xs sm:text-sm font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.2] backdrop-blur-md"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_12px_rgba(136,104,248,0.8)] animate-pulse" />
                <span className="group-hover/link:translate-x-0.5 transition-transform duration-300">
                  Lingua AI Engine
                </span>
                <span className="text-white/30 group-hover/link:text-white transition-colors text-xs">→</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3 Clean Floating Callout Nodes (100% Zero-Box)              */}
          {/* ========================================================================= */}
          <div
            className={`flex flex-col select-none pt-2 sm:pt-4 ${
              activeVariant === "split-rail"
                ? "divide-y divide-white/[0.06] w-full sm:w-auto lg:min-w-[320px]"
                : "gap-6 sm:gap-7 w-full sm:w-auto lg:min-w-[320px]"
            }`}
          >
            {callouts.map((item) => {
              const isHovered = hoveredCallout === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCallout(item.id)}
                  onMouseLeave={() => setHoveredCallout(null)}
                  className={`group flex items-center gap-4 cursor-pointer transition-all duration-300 ${
                    activeVariant === "split-rail" ? "py-4 hover:-translate-x-1.5" : "hover:-translate-x-2"
                  }`}
                >
                  {/* Frosted Glass Squircle Badge with Brand self-drawing SVGs & pulsing pearl */}
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center justify-center text-[#C4B5FD] group-hover:text-white group-hover:border-[#A27FF3]/60 group-hover:bg-[#121228]/80 group-hover:shadow-[0_0_24px_rgba(112,72,232,0.35)] transition-all duration-300 shrink-0">
                    <item.Icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Clean High-Contrast Typography Stack */}
                  <div className="flex flex-col max-w-[220px] sm:max-w-[260px] text-left">
                    <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                      {item.tag}
                    </span>
                    <span className="text-[14px] sm:text-[14.5px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                      {isHovered ? item.telemetry : item.meta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
