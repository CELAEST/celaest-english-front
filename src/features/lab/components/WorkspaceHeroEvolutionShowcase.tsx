import React, { useState } from "react";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export const WorkspaceHeroEvolutionShowcase: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState<"obsidian" | "architectural" | "atmospheric">(
    "obsidian",
  );
  const [backlightIntensity, setBacklightIntensity] = useState<number>(60);
  const [activeCalloutId, setActiveCalloutId] = useState<string>("memory");

  const callouts = [
    {
      id: "memory",
      tag: "LAST MEMORY",
      title: "“Daily conversation review”",
      meta: "Ready for practice",
      Icon: CognitiveMemoryBrainIcon,
      badgeColor: "#C4B5FD",
    },
    {
      id: "reading",
      tag: "NEXT READING",
      title: "Mastering Modern Leadership and Alignment",
      meta: "3 min read · Today",
      Icon: PrecisionOpenBookIcon,
      badgeColor: "#A27FF3",
    },
    {
      id: "interview",
      tag: "UPCOMING INTERVIEW",
      title: "Tech Career & AI Simulation",
      meta: "Live AI Simulation",
      Icon: StudioVoiceMicIcon,
      badgeColor: "#7048E8",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6 select-none">
      {/* Control Bar: Variant Switcher & Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#04040A] border border-white/[0.07] shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono uppercase tracking-widest text-white/40 mr-2">
            Design Variant:
          </span>
          {(
            [
              { id: "obsidian", label: "Obsidian Pure Glass" },
              { id: "architectural", label: "Architectural Clean" },
              { id: "atmospheric", label: "Atmospheric Backlight" },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVariant(v.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeVariant === v.id
                  ? "bg-white/[0.12] text-white border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                  : "bg-white/[0.02] text-white/50 border border-white/[0.05] hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Atmosphere Intensity Control */}
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-mono text-white/40 uppercase">Orb Backlight:</span>
          <input
            type="range"
            min="0"
            max="100"
            value={backlightIntensity}
            onChange={(e) => setBacklightIntensity(Number(e.target.value))}
            className="w-24 accent-[#A27FF3] cursor-pointer h-1.5 bg-white/10 rounded-lg"
          />
          <span className="text-xs font-mono text-white/70 tabular-nums w-8">
            {backlightIntensity}%
          </span>
        </div>
      </div>

      {/* Hero Workspace Arena Container */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-[#030208] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.95)] min-h-[480px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
        {/* Full Bleed Room Wallpaper Background (Matches Production standard) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <img
            src="/assets/workspace_room_bg.png"
            alt="Room Background"
            className="w-full h-full object-cover object-[58%_97%] opacity-90 transition-all duration-300"
          />
          {/* Soft Vignette Gradients for 100% Typography Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030208]/95 via-[#030208]/50 to-[#030208]/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030208]/40 via-transparent to-[#030208]/90 pointer-events-none" />
        </div>

        {/* Center Orb Hero with Atmospheric Dynamic Backlight */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {/* Atmospheric Soft Light Behind the Orb */}
          <div
            className="w-80 h-80 sm:w-96 sm:h-96 rounded-full transition-all duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle, rgba(112, 72, 232, ${backlightIntensity / 400}) 0%, rgba(162, 127, 243, ${backlightIntensity / 900}) 45%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />

          {/* Central Glowing Orb Centerpiece (Clean transparent rendering, zero drop-shadows on image) */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center transition-all duration-300">
            <img
              src="/assets/ChatGPT Image Aug 2, 2026, 05_08_26 PM.png"
              alt="Orb"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
        </div>

        {/* Main Content Layout: Left Editorial Column + Right Callout Column */}
        <div className="relative z-20 w-full flex flex-col lg:flex-row items-start justify-between gap-8 h-full">
          {/* Left Column: Editorial Greeting, Headline, and Personalized Context */}
          <div className="flex flex-col space-y-4 max-w-lg select-none text-left items-start">
            {/* Category Tag with dynamic time greeting */}
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-gradient-to-r from-[#9375E6] to-transparent" />
              <span className="text-[10.5px] font-sans font-medium tracking-[0.22em] text-[#A99BC9] uppercase">
                GOOD AFTERNOON, ESTEBAN PEREZ
              </span>
            </div>

            {/* Main Headline — Fraunces display, elegant editorial typography */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[50px] font-normal text-white leading-[1.12] tracking-tight">
              I’ve been thinking <br />
              about our last <br />
              <span className="font-display-accent italic text-[#DDD6FE]">conversation.</span>
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-xs sm:text-sm text-[#9E9EBD] font-light leading-relaxed font-sans pt-1 max-w-md">
              Your customized session for{" "}
              <span className="text-[#C4B5FD] font-medium">Conversation First</span> is centered on{" "}
              <span className="text-[#C4B5FD] font-medium">Tech Career & AI</span>. <br />
              Shall we continue from where we left off?
            </p>

            {/* Signature Pill */}
            <div className="pt-2">
              <button
                type="button"
                className="text-xs font-medium text-[#B197FF] hover:text-white transition-colors cursor-pointer flex items-center gap-2 group/link"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_38%_32%,#C4B5FD,#7048E8_65%)] shadow-[0_0_10px_rgba(136,104,248,0.7)]" />
                <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                  Lingua AI
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: 3 Clean High-Contrast Callout Nodes */}
          <div className="flex flex-col space-y-4 sm:space-y-5 select-none w-full sm:w-auto lg:min-w-[280px]">
            {callouts.map((item) => {
              const isSelected = activeCalloutId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveCalloutId(item.id)}
                  className={`flex items-center gap-4 group cursor-pointer transition-all duration-300 p-2.5 rounded-2xl ${
                    activeVariant === "obsidian"
                      ? isSelected
                        ? "bg-white/[0.06] border border-white/[0.15] translate-x-[-4px]"
                        : "hover:bg-white/[0.03] border border-transparent hover:border-white/[0.08]"
                      : activeVariant === "architectural"
                        ? isSelected
                          ? "bg-[#04040A] border border-[#A27FF3]/40 translate-x-[-4px] shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
                          : "bg-[#04040A]/60 border border-white/[0.05] hover:border-white/[0.12]"
                        : isSelected
                          ? "bg-white/[0.05] border border-[#A27FF3]/30 backdrop-blur-md translate-x-[-4px]"
                          : "hover:bg-white/[0.03] border border-white/[0.04]"
                  }`}
                >
                  {/* Squircle Frosted Glass Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                      isSelected
                        ? "bg-white/[0.1] text-white border border-white/20 shadow-[0_0_15px_rgba(162,127,243,0.3)]"
                        : "bg-white/[0.03] border border-white/[0.07] text-[#C4B5FD] group-hover:text-white group-hover:bg-white/[0.06] group-hover:border-white/[0.14]"
                    }`}
                  >
                    <item.Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Clean Typography */}
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                      {item.tag}
                    </span>
                    <span className="text-[13.5px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#8e90a5] font-light mt-0.5">
                      {item.meta}
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
