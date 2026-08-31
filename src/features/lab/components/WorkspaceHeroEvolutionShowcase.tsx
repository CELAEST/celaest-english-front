import React, { useState, useMemo } from "react";

// ==========================================
// BESPOKE ULTRA-CLEAN SVG ICON MASTERPIECES
// (Strict adherence to bespoke-icon-crafting standard)
// ==========================================

export const MemorySynapticHelixIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Elegant double-helix synapse waves */}
    <path d="M4 6C8 6 10 18 14 18C18 18 20 6 20 6" opacity={0.9} />
    <path d="M4 18C8 18 10 6 14 6C18 6 20 18 20 18" opacity={0.5} />
    {/* Luminous Synaptic Connectors */}
    <line x1="7" y1="9.5" x2="7" y2="14.5" strokeDasharray="1 2" opacity={0.6} />
    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="1 2" opacity={0.7} />
    <line x1="17" y1="9.5" x2="17" y2="14.5" strokeDasharray="1 2" opacity={0.6} />
    {/* Focal Synapse Nodes */}
    <circle cx="4" cy="6" r="1.3" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="20" cy="18" r="1.3" fill="currentColor" />
  </svg>
);

export const ArchitecturalCodexIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Isometric spine and dual open pages */}
    <path d="M12 5.5C9.5 4 4.5 4.5 2.5 5.5V18.5C4.5 17.5 9.5 17 12 18.5C14.5 17 19.5 17.5 21.5 18.5V5.5C19.5 4.5 14.5 4 12 5.5Z" />
    <path d="M12 5.5V18.5" opacity={0.6} />
    {/* Precision horizontal typography engraving lines */}
    <line x1="5.5" y1="9" x2="9.5" y2="9" opacity={0.5} />
    <line x1="5.5" y1="12" x2="9.5" y2="12" opacity={0.5} />
    <line x1="5.5" y1="15" x2="8" y2="15" opacity={0.4} />
    <line x1="14.5" y1="9" x2="18.5" y2="9" opacity={0.5} />
    <line x1="14.5" y1="12" x2="18.5" y2="12" opacity={0.5} />
    <line x1="14.5" y1="15" x2="17" y2="15" opacity={0.4} />
  </svg>
);

export const StudioAcousticApertureIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Precision Capsule Diaphragm */}
    <rect x="8.5" y="3" width="7" height="11" rx="3.5" />
    <line x1="12" y1="6" x2="12" y2="9" opacity={0.6} />
    {/* Acoustic Cradle Frame */}
    <path d="M5 10.5C5 14.366 8.134 17.5 12 17.5C15.866 17.5 19 14.366 19 10.5" opacity={0.8} />
    {/* Base Stand & Axis */}
    <line x1="12" y1="17.5" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

export const QuantumSparkleIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path
      d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
      fill="currentColor"
      fillOpacity={0.2}
      strokeLinejoin="round"
    />
  </svg>
);

export const TargetReticleIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="8.5" opacity={0.4} />
    <circle cx="12" cy="12" r="4.5" opacity={0.8} />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <line x1="12" y1="2" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="2" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="22" y2="12" />
  </svg>
);

export const PlayArrowIcon: React.FC<{ className?: string }> = ({
  className = "w-3.5 h-3.5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

export const ArrowRightIcon: React.FC<{ className?: string }> = ({
  className = "w-3.5 h-3.5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ==========================================
// MAIN LAB EVOLUTION SHOWCASE COMPONENT
// ==========================================

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeDirection, setActiveDirection] = useState<
    "linear" | "minimalist" | "synapse" | "capsule"
  >("linear");
  const [selectedCallout, setSelectedCallout] = useState<string>("memory");
  const [activeMode, setActiveMode] = useState<string>("Tech Career & AI");
  const [showQuickAction, setShowQuickAction] = useState<boolean>(true);

  const calloutsData = useMemo(
    () => [
      {
        id: "memory",
        tag: "LAST MEMORY",
        title: "“Daily conversation review”",
        meta: "Ready for practice · 14 cards",
        Icon: MemorySynapticHelixIcon,
        accent: "#C4B5FD",
        progress: 88,
        actionLabel: "Review Flashcards",
      },
      {
        id: "reading",
        tag: "NEXT READING",
        title: "Mastering Modern Leadership",
        meta: "3 min read · Business C1",
        Icon: ArchitecturalCodexIcon,
        accent: "#A27FF3",
        progress: 45,
        actionLabel: "Resume Reading",
      },
      {
        id: "interview",
        tag: "UPCOMING INTERVIEW",
        title: `${activeMode} Simulation`,
        meta: "Live AI Simulation · Round 01",
        Icon: StudioAcousticApertureIcon,
        accent: "#7048E8",
        progress: 0,
        actionLabel: "Start Interview",
      },
    ],
    [activeMode],
  );

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Header Control Ribbon */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#04040A] border border-white/[0.07] shadow-2xl">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40 mr-2">
            Design Direction:
          </span>
          {(
            [
              { id: "linear", label: "1. Spatial Linear (Apple Standard)" },
              { id: "minimalist", label: "2. Pure Monochromatic Rail" },
              { id: "synapse", label: "3. Neural Horizon Mode" },
              { id: "capsule", label: "4. Tactile Glass Capsules" },
            ] as const
          ).map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveDirection(d.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeDirection === d.id
                  ? "bg-white/[0.12] text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.12)] scale-[1.02]"
                  : "bg-white/[0.02] text-white/50 border border-white/[0.05] hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Quick Features Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowQuickAction((prev) => !prev)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              showQuickAction
                ? "bg-[#7048E8]/20 border border-[#A27FF3]/40 text-[#C4B5FD]"
                : "bg-white/[0.03] border border-white/[0.06] text-white/40"
            }`}
          >
            CTA Actions: {showQuickAction ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* 2. Hero Interactive Canvas Arena */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.95)] min-h-[500px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between transition-all duration-500">
        {/* Full Bleed Room Wallpaper Background (Contains the realistic room + 3D Orb in video) */}
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

        {/* Main Content Grid: Left Editorial Header + Right Bespoke Callouts */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial Typography & Persona Statement                   */}
          {/* ========================================================================= */}
          <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start">
            {/* Top Persona Greeting & Status Pill */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
              <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                GOOD AFTERNOON, ESTEBAN PEREZ
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9.5px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NEURAL SYNAPSE ACTIVE
              </span>
            </div>

            {/* Main Editorial Headline (Fraunces Display & Weight Contrast Accent) */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[50px] font-normal text-white leading-[1.12] tracking-tight">
              I’ve been thinking <br />
              about our last <br />
              <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
            </h1>

            {/* Personalized Context Subtext */}
            <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-1 max-w-md">
              Your customized session for{" "}
              <span className="text-[#C4B5FD] font-medium">Conversation First</span> is centered on{" "}
              <span className="text-[#C4B5FD] font-medium">{activeMode}</span>. <br />
              Shall we continue from where we left off?
            </p>

            {/* Dynamic Horizon Topic Switcher (Direction 3 & interactive test) */}
            {activeDirection === "synapse" && (
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                {["Tech Career & AI", "Executive Leadership", "Cross-Functional Pitch"].map(
                  (mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setActiveMode(mode)}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                        activeMode === mode
                          ? "bg-[#7048E8]/30 border border-[#A27FF3] text-white shadow-[0_0_12px_rgba(162,127,243,0.35)]"
                          : "bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {mode}
                    </button>
                  ),
                )}
              </div>
            )}

            {/* Signature Pill with Ambient Sparkle */}
            <div className="pt-2">
              <button
                type="button"
                className="text-xs font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/link px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15]"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_10px_rgba(136,104,248,0.7)]" />
                <span className="group-hover/link:translate-x-0.5 transition-transform duration-300">
                  Lingua AI Assistant
                </span>
                <QuantumSparkleIcon className="w-3.5 h-3.5 text-[#A27FF3] opacity-60 group-hover/link:opacity-100" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 4 Diverse Masterpiece UX/UI Directions                      */}
          {/* ========================================================================= */}
          <div className="flex flex-col select-none w-full sm:w-auto lg:min-w-[320px] max-w-sm">
            {/* --------------------------------------------------------------------- */}
            {/* DIRECTION 1: Spatial Linear Glass (Apple SF Standard)                 */}
            {/* --------------------------------------------------------------------- */}
            {activeDirection === "linear" && (
              <div className="flex flex-col space-y-4">
                {calloutsData.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.07] border border-white/[0.18] shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] translate-x-[-4px]"
                          : "bg-[#04040A]/40 border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Squircle Frosted Badge with Specular Glow */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isSelected
                              ? "bg-gradient-to-b from-white/[0.15] to-white/[0.05] border border-white/30 text-white shadow-[0_0_20px_rgba(162,127,243,0.4)]"
                              : "bg-white/[0.03] border border-white/[0.07] text-[#C4B5FD] group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/[0.16]"
                          }`}
                        >
                          <item.Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        {/* High-Contrast Typography */}
                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                            {item.tag}
                          </span>
                          <span className="text-[14px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                            {item.title}
                          </span>
                          <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      {/* Right Indicator / Quick Trigger */}
                      {showQuickAction && isSelected && (
                        <div className="pl-2 shrink-0 animate-[fadeIn_0.3s_ease-out]">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full bg-[#7048E8]/40 border border-[#A27FF3]/60 flex items-center justify-center text-white hover:bg-[#7048E8] transition-all shadow-[0_0_12px_rgba(112,72,232,0.5)] cursor-pointer"
                            title={item.actionLabel}
                          >
                            <PlayArrowIcon className="w-3.5 h-3.5 translate-x-0.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* DIRECTION 2: Pure Monochromatic Rail (Zero Box, Pure Typography)      */}
            {/* --------------------------------------------------------------------- */}
            {activeDirection === "minimalist" && (
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {calloutsData.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group py-4 px-2 flex items-center justify-between transition-all duration-300 cursor-pointer ${
                        isSelected ? "translate-x-[-6px]" : "hover:translate-x-[-3px]"
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Monochromatic Ring Node */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isSelected
                              ? "bg-white text-black ring-4 ring-white/10"
                              : "bg-white/[0.04] border border-white/[0.1] text-white/70 group-hover:text-white group-hover:border-white/30"
                          }`}
                        >
                          <item.Icon className="w-5 h-5" />
                        </div>

                        <div className="flex flex-col text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                              {item.tag}
                            </span>
                            {item.progress > 0 && (
                              <span className="text-[9.5px] font-mono text-emerald-400 tabular-nums">
                                {item.progress}%
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[14px] font-medium mt-0.5 tracking-wide transition-colors truncate ${
                              isSelected ? "text-white" : "text-white/80 group-hover:text-white"
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="text-[11px] text-white/40 font-light mt-0.5 truncate">
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      <ArrowRightIcon
                        className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                          isSelected
                            ? "text-white translate-x-0 opacity-100"
                            : "text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* DIRECTION 3: Neural Synapse Horizon                                   */}
            {/* --------------------------------------------------------------------- */}
            {activeDirection === "synapse" && (
              <div className="flex flex-col space-y-3.5">
                {calloutsData.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-[#0A0818]/80 border border-[#A27FF3]/50 shadow-[0_8px_30px_rgba(112,72,232,0.25)]"
                          : "bg-[#04040A]/40 border border-white/[0.06] hover:border-white/[0.14]"
                      }`}
                    >
                      {/* Top Specular Hairline Glow */}
                      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C4B5FD] shrink-0">
                          <item.Icon className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col text-left flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-semibold tracking-widest text-[#B197FF]">
                            {item.tag}
                          </span>
                          <span className="text-[13.5px] text-white font-medium truncate mt-0.5">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#8e90a5] font-light truncate">
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      {/* Synapse Micro Progress Track */}
                      <div className="w-full h-1 bg-white/[0.04] rounded-full mt-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#7048E8] to-[#C4B5FD] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(15, item.progress)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* DIRECTION 4: Tactile Glass Capsules (Full Action Integration)         */}
            {/* --------------------------------------------------------------------- */}
            {activeDirection === "capsule" && (
              <div className="flex flex-col space-y-3.5">
                {calloutsData.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group p-3.5 rounded-3xl transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#090814]/90 border border-white/[0.2] shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)] translate-y-[-2px]"
                          : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Circular Action Node with Micro Progress Arc */}
                        <div className="relative w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-white/[0.03] border border-white/[0.08] text-[#DDD6FE] group-hover:scale-105 transition-transform">
                          <item.Icon className="w-5 h-5" />
                        </div>

                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-[9.5px] font-mono tracking-widest text-[#B197FF] uppercase">
                            {item.tag}
                          </span>
                          <span className="text-[13px] text-white font-medium tracking-wide truncate">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-[#8e90a5] font-light truncate">
                            {item.meta}
                          </span>
                        </div>
                      </div>

                      {/* Pill Action Button */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.1] text-white/80 hover:text-white hover:bg-[#7048E8]/40 hover:border-[#A27FF3]/60"
                        >
                          <span>{item.actionLabel.split(" ")[0]}</span>
                          <ArrowRightIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Engineering Comparison Card / Architectural Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-[#C4B5FD]">
            <TargetReticleIcon className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Zero Visual Clutter
            </span>
          </div>
          <p className="text-[11.5px] text-[#8a8a9e] leading-relaxed">
            Eliminated duplicate standalone sphere image overlay. The 3D orb now breathes seamlessly
            within the natural ambient room lighting of the video background.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-[#A27FF3]">
            <MemorySynapticHelixIcon className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Bespoke SVGs (Apple SF)
            </span>
          </div>
          <p className="text-[11.5px] text-[#8a8a9e] leading-relaxed">
            Custom engineered vector paths: Synaptic DNA Helix for Memory, Architectural Open Codex
            for Reading, and Acoustic Studio Aperture for Interview.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-[#7048E8]">
            <QuantumSparkleIcon className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Tactile Micro-Interactions
            </span>
          </div>
          <p className="text-[11.5px] text-[#8a8a9e] leading-relaxed">
            Quick-action action triggers, real-time topic horizon toggles, and high-contrast specular
            glass highlights without heavy opaque container boxes.
          </p>
        </div>
      </div>
    </div>
  );
};
