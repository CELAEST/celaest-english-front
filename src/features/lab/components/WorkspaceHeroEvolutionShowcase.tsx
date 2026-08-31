import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  ArrowRight,
  Brain,
  Sliders,
} from "lucide-react";

// =========================================================================
// BESPOKE ULTRA-CLEAN SVG ICON MASTERPIECES (Apple SF / Linear Standard)
// =========================================================================

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
    {/* Continuous synaptic waves */}
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
  className = "w-3.5 h-3.5",
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path
      d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
      fill="currentColor"
      fillOpacity={0.25}
      strokeLinejoin="round"
    />
  </svg>
);

// =========================================================================
// MAIN WORKSPACE HERO EVOLUTION SHOWCASE
// =========================================================================

type ShowcaseEvolution = "spatial3d" | "monochromatic" | "acoustic" | "tactile";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeEvolution, setActiveEvolution] = useState<ShowcaseEvolution>("spatial3d");
  const [selectedCallout, setSelectedCallout] = useState<string>("memory");
  const [activeGoalMode, setActiveGoalMode] = useState<"tech" | "leadership" | "pitch">("tech");
  const [showTelemetryDrawer, setShowTelemetryDrawer] = useState<boolean>(true);

  // 3D Tilt Physics for the Right Callout Container (Exact Spatial 3D standard)
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      x: ((x - centerX) / centerX) * 4,
      y: ((y - centerY) / centerY) * -4,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      glareOpacity: 0.1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
  }, []);

  // Goal Mode Profiles
  const goalProfiles = {
    tech: {
      tag: "Tech Career & AI",
      focus: "Conversation First",
      topic: "Tech Career & AI Simulation",
      readingTitle: "Mastering Modern Leadership & Architecture",
      readingMeta: "3 min read · Technical C1",
      memoryTitle: "“Distributed systems & latency review”",
      memoryCount: 14,
      retention: "88%",
      difficulty: "C1 Advanced",
    },
    leadership: {
      tag: "Executive Leadership",
      focus: "Strategic Communication",
      topic: "Executive Boardroom Simulation",
      readingTitle: "The Decisive Executive: Leading Consensus",
      readingMeta: "4 min read · Executive C2",
      memoryTitle: "“Diplomatic risk framing vocabulary”",
      memoryCount: 22,
      retention: "94%",
      difficulty: "C2 Mastery",
    },
    pitch: {
      tag: "Cross-Functional Pitch",
      focus: "High-Stakes Persuasion",
      topic: "Investor & Stakeholder Pitch Simulation",
      readingTitle: "Framing ROI Before Engineering Velocity",
      readingMeta: "2 min read · Strategic C1",
      memoryTitle: "“Persuasive ROI metrics lexicon”",
      memoryCount: 18,
      retention: "91%",
      difficulty: "C1 Diplomatic",
    },
  };

  const currentGoal = goalProfiles[activeGoalMode];

  const callouts = useMemo(
    () => [
      {
        id: "memory",
        tag: "LAST MEMORY",
        title: currentGoal.memoryTitle,
        meta: `Ready for practice · ${currentGoal.memoryCount} cards`,
        Icon: MemorySynapticHelixIcon,
        detailLabel: "SM-2 Stability",
        detailValue: `${currentGoal.retention} Retention`,
        actionLabel: "Review Synapse",
        secondaryMeta: "Cadence: Optimal",
      },
      {
        id: "reading",
        tag: "NEXT READING",
        title: currentGoal.readingTitle,
        meta: currentGoal.readingMeta,
        Icon: ArchitecturalCodexIcon,
        detailLabel: "CEFR Complexity",
        detailValue: currentGoal.difficulty,
        actionLabel: "Resume Reading",
        secondaryMeta: "480 Words · 3 min",
      },
      {
        id: "interview",
        tag: "UPCOMING INTERVIEW",
        title: currentGoal.topic,
        meta: "Live AI Simulation · Round 01",
        Icon: StudioAcousticApertureIcon,
        detailLabel: "Acoustic Pipeline",
        detailValue: "48kHz Live Audio",
        actionLabel: "Start Interview",
        secondaryMeta: "Adaptive Neural Model",
      },
    ],
    [currentGoal],
  );

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* 1. Header Filter Ribbon (Spatial 3D Studio standard) */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#04040A] border border-white/[0.07] shadow-2xl">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 mr-1">
            Evolution:
          </span>
          {[
            { id: "spatial3d", label: "1. Spatial 3D Interactive (VisionOS)" },
            { id: "monochromatic", label: "2. Monochromatic Obsidian Rail" },
            { id: "acoustic", label: "3. Acoustic Horizon Studio" },
            { id: "tactile", label: "4. Tactile Glass Capsules" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveEvolution(t.id as ShowcaseEvolution)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                activeEvolution === t.id
                  ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.01]"
                  : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Telemetry Switch */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTelemetryDrawer((p) => !p)}
            className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              showTelemetryDrawer
                ? "bg-white/[0.08] border border-white/20 text-white"
                : "bg-white/[0.02] border border-white/[0.05] text-white/40"
            }`}
          >
            Telemetry Drawer: {showTelemetryDrawer ? "Expanded" : "Minimal"}
          </button>
        </div>
      </div>

      {/* 2. Full-Bleed Realistic Workspace Stage (Adapting the real Hero Section) */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_32px_90px_rgba(0,0,0,0.95)] min-h-[520px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between select-none [perspective:1400px]"
      >
        {/* Room Wallpaper Background with Integrated 3D Orb in Scene */}
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

        {/* Main Content Grid */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Editorial Typography & Dynamic Topic Horizon                */}
          {/* ========================================================================= */}
          <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start">
            {/* Top Persona Greeting */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
              <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                Good Afternoon, Esteban Perez
              </span>
            </div>

            {/* Main Editorial Headline (Fraunces Display & Weight-Contrast Accent) */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-normal text-white leading-[1.1] tracking-tight">
              I’ve been thinking <br />
              about our last <br />
              <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
            </h1>

            {/* Personalized Context Subtext */}
            <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-0.5 max-w-md">
              Your customized session for{" "}
              <span className="text-[#C4B5FD] font-medium">{currentGoal.focus}</span> is centered on{" "}
              <span className="text-[#C4B5FD] font-medium">{currentGoal.tag}</span>. <br />
              Shall we continue from where we left off?
            </p>

            {/* Interactive Goal Horizon Selector (Switching context recalibrates the entire workspace) */}
            <div className="pt-2 flex flex-col space-y-2 w-full">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Active Learning Track
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: "tech", label: "Tech Career & AI", badge: "C1" },
                  { id: "leadership", label: "Executive Leadership", badge: "C2" },
                  { id: "pitch", label: "Cross-Functional Pitch", badge: "C1" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveGoalMode(g.id as "tech" | "leadership" | "pitch")}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                      activeGoalMode === g.id
                        ? "bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                        : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{g.label}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded ${
                        activeGoalMode === g.id ? "bg-black/15 text-black" : "text-white/40"
                      }`}
                    >
                      {g.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Signature Pill with Subtle Ambient Sparkle */}
            <div className="pt-2">
              <button
                type="button"
                className="text-xs font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/link px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15]"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_10px_rgba(136,104,248,0.7)]" />
                <span className="group-hover/link:translate-x-0.5 transition-transform duration-300">
                  Lingua AI Engine
                </span>
                <QuantumSparkleIcon className="w-3.5 h-3.5 text-[#A27FF3] opacity-60 group-hover/link:opacity-100" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: 4 Masterpiece Spatial UI Evolutions                         */}
          {/* ========================================================================= */}
          <div className="flex flex-col select-none w-full sm:w-auto lg:min-w-[340px] max-w-md">
            {/* --------------------------------------------------------------------- */}
            {/* EVOLUTION 1: Spatial 3D Interactive (VisionOS Tilt Physics)           */}
            {/* --------------------------------------------------------------------- */}
            {activeEvolution === "spatial3d" && (
              <div
                className="flex flex-col space-y-4 transition-transform duration-300 ease-out [transform-style:preserve-3d]"
                style={{
                  transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                }}
              >
                {callouts.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group relative p-4 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-[#04040A]/90 border border-white/[0.2] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)] translate-x-[-4px]"
                          : "bg-[#04040A]/40 border border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Top Specular Hairline */}
                      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Frosted Glass Squircle Badge */}
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                              isSelected
                                ? "bg-gradient-to-b from-white/[0.15] to-white/[0.05] border border-white/30 text-white shadow-[0_0_20px_rgba(162,127,243,0.3)]"
                                : "bg-white/[0.03] border border-white/[0.07] text-[#C4B5FD] group-hover:text-white group-hover:bg-white/[0.06] group-hover:border-white/[0.14]"
                            }`}
                          >
                            <item.Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
                          </div>

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

                        <ArrowRight
                          className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                            isSelected
                              ? "text-white translate-x-0 opacity-100"
                              : "text-white/20 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </div>

                      {/* Interactive Telemetry Drawer (Spatial 3D Standard) */}
                      {showTelemetryDrawer && isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[10.5px] font-mono text-white/50 animate-[fadeIn_0.3s_ease-out]">
                          <span>
                            {item.detailLabel}: <strong className="text-white">{item.detailValue}</strong>
                          </span>
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/20 text-white transition-all cursor-pointer"
                          >
                            {item.actionLabel} →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* EVOLUTION 2: Monochromatic Obsidian Rail (Zero Box, Pure Typography)  */}
            {/* --------------------------------------------------------------------- */}
            {activeEvolution === "monochromatic" && (
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {callouts.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group py-4 px-2 flex flex-col transition-all duration-300 cursor-pointer ${
                        isSelected ? "translate-x-[-6px]" : "hover:translate-x-[-3px]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 min-w-0">
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
                            <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                              {item.tag}
                            </span>
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

                        <ArrowRight
                          className={`w-4 h-4 transition-all duration-300 shrink-0 ${
                            isSelected
                              ? "text-white translate-x-0 opacity-100"
                              : "text-white/20 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
                          }`}
                        />
                      </div>

                      {showTelemetryDrawer && isSelected && (
                        <div className="mt-2.5 pl-14 flex items-center justify-between text-[10px] font-mono text-white/40">
                          <span>{item.secondaryMeta}</span>
                          <span className="text-white font-medium">{item.actionLabel}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* EVOLUTION 3: Acoustic Horizon Studio (Live Waveforms & Telemetry)      */}
            {/* --------------------------------------------------------------------- */}
            {activeEvolution === "acoustic" && (
              <div className="flex flex-col space-y-3.5">
                {callouts.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`relative p-4 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-[#04040A]/90 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
                          : "bg-[#04040A]/40 border border-white/[0.06] hover:border-white/[0.14]"
                      }`}
                    >
                      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#C4B5FD] shrink-0">
                            <item.Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col text-left min-w-0">
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

                        {/* Live Acoustic Waveform Visualizer on Callout */}
                        <div className="flex items-end gap-[2px] h-5 pl-2 shrink-0">
                          {[40, 75, 100, 60, 85, 30].map((h, i) => (
                            <span
                              key={i}
                              className="w-[2px] rounded-full bg-white/40 group-hover:bg-[#A27FF3] transition-colors"
                              style={{
                                height: `${h}%`,
                                animationDuration: `${0.8 + i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {showTelemetryDrawer && isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-white/40">
                          <span>{item.detailLabel}: <strong className="text-white">{item.detailValue}</strong></span>
                          <span className="text-white hover:text-[#C4B5FD] transition-colors">Launch Practice →</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* EVOLUTION 4: Tactile Glass Capsules (Integrated Micro-Actions)        */}
            {/* --------------------------------------------------------------------- */}
            {activeEvolution === "tactile" && (
              <div className="flex flex-col space-y-3.5">
                {callouts.map((item) => {
                  const isSelected = selectedCallout === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCallout(item.id)}
                      className={`group p-3.5 rounded-3xl transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-[#04040A]/90 border border-white/[0.2] shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)] translate-y-[-2px]"
                          : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
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

                      <div className="shrink-0">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-full text-[11px] font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 bg-white/[0.05] border border-white/[0.1] text-white/80 hover:text-white hover:bg-white/[0.15]"
                        >
                          <span>{item.actionLabel.split(" ")[0]}</span>
                          <ArrowRight className="w-3 h-3" />
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

      {/* 3. Spatial Architectural Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-[#C4B5FD]">
            <Brain className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Dynamic Goal Horizon
            </span>
          </div>
          <p className="text-[11.5px] text-[#8a8a9e] leading-relaxed">
            Switching active career tracks (*Tech*, *Leadership*, *Pitch*) dynamically updates the
            headline emphasis, reading material, and upcoming live interview.
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
            Engineered vector paths: Synaptic DNA Helix for Memory, Architectural Open Codex for
            Reading, and Acoustic Aperture for Live Interview.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#04040A] border border-white/[0.06] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 text-white/70">
            <Sliders className="w-4 h-4" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              Spatial 3D Physics
            </span>
          </div>
          <p className="text-[11.5px] text-[#8a8a9e] leading-relaxed">
            Interactive cursor tilt with specular glare, expandable telemetry drawers, and zero
            box clutter — matching the Spatial 3D standard.
          </p>
        </div>
      </div>
    </div>
  );
};
