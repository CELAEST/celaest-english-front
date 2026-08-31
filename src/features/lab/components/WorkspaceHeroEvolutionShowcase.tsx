import React, { useState, useCallback, useRef } from "react";

/**
 * Bespoke Vector Icon Suite with CELAEST brand standard:
 * - 1.5px uniform stroke weight
 * - strokeLinecap="round"
 * - className="icon-draw" with pathLength={1} for self-drawing hover animation
 * - className="icon-pearl" for pulsating orb brand identity
 */

export const BespokeSynapseDnaIcon: React.FC<{ className?: string }> = ({
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
      d="M4 6C8 6 10 18 14 18C18 18 20 6 20 6"
    />
    <path
      className="icon-draw"
      pathLength={1}
      d="M4 18C8 18 10 6 14 6C18 6 20 18 20 18"
      opacity={0.6}
    />
    <line x1="7" y1="9.5" x2="7" y2="14.5" strokeDasharray="1 2" opacity={0.5} />
    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="1 2" opacity={0.7} />
    <line x1="17" y1="9.5" x2="17" y2="14.5" strokeDasharray="1 2" opacity={0.5} />
    <circle className="icon-pearl" cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);

export const BespokeArchitecturalBookIcon: React.FC<{ className?: string }> = ({
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
      d="M3 6C6 4.5 9 4.5 12 6C15 4.5 18 4.5 21 6V18C18 16.5 15 16.5 12 18C9 16.5 6 16.5 3 18Z"
    />
    <path className="icon-draw" pathLength={1} d="M12 6V18" opacity={0.6} />
    <line x1="6" y1="9.5" x2="9" y2="9.5" opacity={0.4} />
    <line x1="6" y1="12" x2="9" y2="12" opacity={0.4} />
    <line x1="15" y1="9.5" x2="18" y2="9.5" opacity={0.4} />
    <line x1="15" y1="12" x2="18" y2="12" opacity={0.4} />
    <circle className="icon-pearl" cx="16.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const BespokeAcousticStudioMicIcon: React.FC<{ className?: string }> = ({
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
    <rect className="icon-draw" pathLength={1} x="9" y="3" width="6" height="10.5" rx="3" />
    <path className="icon-draw" pathLength={1} d="M5.5 10.5C5.5 14.0899 8.41015 17 12 17C15.5899 17 18.5 14.0899 18.5 10.5" opacity={0.7} />
    <line x1="12" y1="17" x2="12" y2="21" />
    <line x1="8.5" y1="21" x2="15.5" y2="21" />
    <circle className="icon-pearl" cx="12" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

type MasterHeroStyle = "spatial-linear" | "specular-depth" | "pure-monochrome";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeStyle, setActiveStyle] = useState<MasterHeroStyle>("spatial-linear");
  const [activeTrack, setActiveTrack] = useState<"tech" | "executive" | "pitch">("tech");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // 3D Tilt Physics for Specular Depth mode
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      x: ((x - centerX) / centerX) * 3,
      y: ((y - centerY) / centerY) * -3,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.12,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  // Track Profiles
  const trackData = {
    tech: {
      headlineTarget: "Tech Career & AI",
      focusName: "Conversation First",
      memoryTitle: "“Distributed systems & latency review”",
      memoryMeta: "Ready for practice · 14 cards",
      memoryTelemetry: "88% Synaptic Stability • SM-2 Review",
      readingTitle: "Mastering Modern Leadership and Team Alignment",
      readingMeta: "3 min read · Technical C1",
      readingTelemetry: "480 Words • High Technical Register",
      interviewTitle: "Tech Career & AI Simulation",
      interviewMeta: "Live AI Simulation · Round 01",
      interviewTelemetry: "48kHz Live Audio • Adaptive Neutral Model",
    },
    executive: {
      headlineTarget: "Executive Leadership",
      focusName: "Boardroom Authority",
      memoryTitle: "“Diplomatic risk framing & concision”",
      memoryMeta: "Ready for practice · 22 cards",
      memoryTelemetry: "94% Retention • C2 Decisive Verbs",
      readingTitle: "The Decisive Executive: Leading Consensus",
      readingMeta: "4 min read · Executive C2",
      readingTelemetry: "620 Words • Strategic Framework",
      interviewTitle: "Boardroom Executive Simulation",
      interviewMeta: "Live AI Simulation · Round 02",
      interviewTelemetry: "Real-Time Tone Modulation • C2",
    },
    pitch: {
      headlineTarget: "Cross-Functional Pitch",
      focusName: "Persuasive Negotiation",
      memoryTitle: "“ROI framing & stakeholder alignment”",
      memoryMeta: "Ready for practice · 18 cards",
      memoryTelemetry: "91% Recall • Business Impact Metrics",
      readingTitle: "Framing Value Before Engineering Velocity",
      readingMeta: "2 min read · Strategic C1",
      readingTelemetry: "340 Words • Concessive Framing",
      interviewTitle: "Stakeholder Negotiation Simulation",
      interviewMeta: "Live AI Simulation · Round 01",
      interviewTelemetry: "Objection Handling Matrix",
    },
  };

  const currentTrack = trackData[activeTrack];

  const calloutItems = [
    {
      id: "memory",
      tag: "LAST MEMORY",
      title: currentTrack.memoryTitle,
      meta: currentTrack.memoryMeta,
      telemetry: currentTrack.memoryTelemetry,
      Icon: BespokeSynapseDnaIcon,
      actionText: "Review",
    },
    {
      id: "reading",
      tag: "NEXT READING",
      title: currentTrack.readingTitle,
      meta: currentTrack.readingMeta,
      telemetry: currentTrack.readingTelemetry,
      Icon: BespokeArchitecturalBookIcon,
      actionText: "Read",
    },
    {
      id: "interview",
      tag: "UPCOMING INTERVIEW",
      title: currentTrack.interviewTitle,
      meta: currentTrack.interviewMeta,
      telemetry: currentTrack.interviewTelemetry,
      Icon: BespokeAcousticStudioMicIcon,
      actionText: "Start",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Master Control Ribbon */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#04040A] border border-white/[0.07] shadow-2xl">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1">
            Design Variant:
          </span>
          {[
            { id: "spatial-linear", label: "1. Spatial Linear (Apple SF & CELAEST Standard)" },
            { id: "specular-depth", label: "2. Specular 3D Tilt Physics" },
            { id: "pure-monochrome", label: "3. Minimalist Monochromatic Rail" },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveStyle(v.id as MasterHeroStyle)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeStyle === v.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Live Learning Track Switcher */}
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

      {/* 2. Workspace Hero Master Banner (Exact Production Scene & Proportions) */}
      <div
        ref={heroCardRef}
        onMouseMove={activeStyle === "specular-depth" ? handleMouseMove : undefined}
        onMouseLeave={activeStyle === "specular-depth" ? handleMouseLeave : undefined}
        className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.95)] min-h-[490px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between select-none [perspective:1400px]"
      >
        {/* Full-Bleed Room Background with Integrated 3D Orb Scene */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <img
            src="/assets/workspace_room_bg.png"
            alt="Room Background with integrated 3D Orb"
            className="w-full h-full object-cover object-[58%_97%] opacity-95 transition-all duration-300"
          />
          {/* Subtle Vignette Gradients for Crisp 100% Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/40 to-[#030208]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/30 via-transparent to-[#030208]/90 pointer-events-none" />
        </div>

        {/* Dynamic Specular Sheen (Specular Depth mode only) */}
        {activeStyle === "specular-depth" && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(500px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,${tilt.glareOpacity}), transparent 70%)`,
            }}
          />
        )}

        {/* Main Stage Grid: Left Editorial Header + Right Bespoke Callouts */}
        <div
          className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          style={
            activeStyle === "specular-depth"
              ? {
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }
              : undefined
          }
        >
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial Typography & Persona Statement                   */}
          {/* ========================================================================= */}
          <div className="flex flex-col space-y-3 sm:space-y-4 max-w-lg select-none text-left items-start">
            {/* Top Persona Greeting Line */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
              <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                Good Afternoon, Esteban Perez
              </span>
            </div>

            {/* Main Editorial Headline (Fraunces Display & Weight Contrast Accent) */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-normal text-white leading-[1.1] tracking-tight">
              I’ve been thinking <br />
              about our last <br />
              <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
            </h1>

            {/* Personalized Context Subtext */}
            <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-0.5 max-w-md">
              Your customized session for{" "}
              <span className="text-[#C4B5FD] font-medium">{currentTrack.focusName}</span> is centered on{" "}
              <span className="text-[#C4B5FD] font-medium">{currentTrack.headlineTarget}</span>. <br className="hidden sm:inline" />
              Shall we continue from where we left off?
            </p>

            {/* Signature Pill */}
            <div className="pt-2">
              <button
                type="button"
                className="text-xs sm:text-sm font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/link"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_10px_rgba(136,104,248,0.7)]" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                  Lingua AI
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 3 High-End Bespoke Callout Masterpieces                     */}
          {/* ========================================================================= */}
          <div className="flex flex-col select-none w-full sm:w-auto lg:min-w-[340px] max-w-md space-y-4">
            {/* --------------------------------------------------------------------- */}
            {/* VARIANT 1 & 2: Spatial Linear Frosted Glass Squircles                */}
            {/* --------------------------------------------------------------------- */}
            {(activeStyle === "spatial-linear" || activeStyle === "specular-depth") && (
              <div className="flex flex-col space-y-3.5">
                {calloutItems.map((item) => {
                  const isHovered = hoveredNodeId === item.id;
                  return (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredNodeId(item.id)}
                      onMouseLeave={() => setHoveredNodeId(null)}
                      className="group flex flex-col p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.18] hover:bg-white/[0.06] backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer hover:translate-x-[-4px]"
                    >
                      <div className="flex items-center justify-between gap-3.5">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Prominent Squircle Frosted Glass Badge with Self-Drawing Icon & Pulse Pearl */}
                          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C4B5FD] group-hover:text-white group-hover:border-[#A27FF3]/60 group-hover:bg-[#121228]/80 group-hover:shadow-[0_0_20px_rgba(112,72,232,0.35)] transition-all duration-300 shrink-0">
                            <item.Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                          </div>

                          {/* High-Contrast Typography Hierarchy */}
                          <div className="flex flex-col text-left min-w-0">
                            <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                              {item.tag}
                            </span>
                            <span className="text-[14px] sm:text-[14.5px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                              {item.title}
                            </span>
                            <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                              {item.meta}
                            </span>
                          </div>
                        </div>

                        {/* Subtle Action Arrow Trigger */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/[0.08] transition-all shrink-0">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      {/* Interactive Telemetry Capsule on Hover */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isHovered ? "max-h-12 opacity-100 mt-2.5 pt-2 border-t border-white/[0.05]" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                          <span className="truncate">{item.telemetry}</span>
                          <span className="text-[#C4B5FD] font-medium shrink-0 ml-2">Launch {item.actionText} →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* VARIANT 3: Minimalist Monochromatic Rail (Pure Editorial)            */}
            {/* --------------------------------------------------------------------- */}
            {activeStyle === "pure-monochrome" && (
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {calloutItems.map((item) => (
                  <div
                    key={item.id}
                    className="group py-4 px-2 flex items-center justify-between transition-all duration-300 cursor-pointer hover:translate-x-[-4px]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Monochromatic Ring Node with Self-Drawing Icon */}
                      <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/70 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/[0.08] transition-all shrink-0">
                        <item.Icon className="w-5.5 h-5.5" />
                      </div>

                      <div className="flex flex-col text-left min-w-0">
                        <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                          {item.tag}
                        </span>
                        <span className="text-[14px] font-medium text-white/90 mt-0.5 tracking-wide group-hover:text-white transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-white/40 font-light mt-0.5 truncate">
                          {item.meta}
                        </span>
                      </div>
                    </div>

                    <div className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
