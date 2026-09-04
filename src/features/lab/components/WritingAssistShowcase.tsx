import React, { useState } from "react";
import { appToast } from "../../../design-system/components/Toast";

export const WritingAssistShowcase: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<number>(1);

  const triggerTool = (toolName: string, detail: string) => {
    appToast.info(`Writing Tool: ${toolName}`, detail);
  };

  const concepts = [
    {
      id: 1,
      title: "1. Linear 2026 Minimalist Wireframe (Standard)",
      subtitle: "Micro-carriles de alambre con tipografía pura, micro-insignias monocromáticas y cero emojis",
      tag: "Linear Wireframe ★",
      tagColor: "bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40",
    },
    {
      id: 2,
      title: "2. Orbital Obsidian Dual-Pill Matrix",
      subtitle: "Cuadrícula táctica 2x2 con cápsulas biseladas de cristal obsidian y micro-iconos vectoriales de 1.5px",
      tag: "Obsidian 2x2",
      tagColor: "bg-[#38BDF8]/20 text-[#7DD3FC] border-[#38BDF8]/40",
    },
    {
      id: 3,
      title: "3. VisionOS Spatial Frosted Glass Studio",
      subtitle: "Vidrio esmerilado ingrávido con iluminación sutil al tacto y contraste tipográfico editorial",
      tag: "VisionOS Spatial",
      tagColor: "bg-[#C084FC]/20 text-[#E9D5FF] border-[#C084FC]/40",
    },
    {
      id: 4,
      title: "4. Cyber-Kinetic Laser Typography (Anti-Box)",
      subtitle: "Cero cajas · Tipografía pura con micro-indicadores láser verticales reactivos al hover",
      tag: "Laser Pure",
      tagColor: "bg-[#10B981]/20 text-[#6EE7B7] border-[#10B981]/40",
    },
    {
      id: 5,
      title: "5. Tactical Hotkey Precision HUD",
      subtitle: "Estética de ingeniería con atajos [P], [S], [C], [E] y métricas de vocabulario en tiempo real",
      tag: "Tactical HUD",
      tagColor: "bg-[#F59E0B]/20 text-[#FDE68A] border-[#F59E0B]/40",
    },
    {
      id: 6,
      title: "6. Master Luxury Consolidated Cockpit",
      subtitle: "Unificación armónica de herramientas, progreso circular y estado del Mentor IA en una sola tarjeta de élite",
      tag: "Master Cockpit",
      tagColor: "bg-[#EC4899]/20 text-[#F472B6] border-[#EC4899]/40",
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Concept Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {concepts.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveConcept(c.id)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
              activeConcept === c.id
                ? "bg-[#0d0c18] border-[#A27FF3]/60 shadow-[0_0_24px_rgba(162,127,243,0.25)] scale-[1.02]"
                : "bg-[#05040B] border-white/[0.06] hover:border-white/15 hover:bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-white">#{c.id}</span>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-md border ${c.tagColor}`}>
                {c.tag}
              </span>
            </div>
            <span className="text-xs font-medium text-white/90 line-clamp-1">
              {c.title.split(". ")[1] || c.title}
            </span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-[#020106] p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Background Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#7048E8]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column: Concept Philosophy & Architectural Notes */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <div className="inline-flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C4B5FD] bg-[#7048E8]/20 px-2.5 py-1 rounded-full border border-[#7048E8]/30">
                Diseño #{activeConcept}
              </span>
              <span className="text-xs text-white/40">· CELAEST Writing Card Standard</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              {concepts.find((c) => c.id === activeConcept)?.title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              {concepts.find((c) => c.id === activeConcept)?.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-white/40">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                💎 Vector SVGs Bespoke 1.5px
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                ✨ Tipografía Editorial Pura
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                ⚡ Cero Cajas Pesadas / Emojis
              </span>
            </div>
          </div>

          {/* Right Column: Actual Card Rendered at Exact Production Scale */}
          <div className="w-full max-w-[340px] shrink-0">
            {/* CONCEPT 1: Linear 2026 Minimalist Wireframe (Standard ★) */}
            {activeConcept === 1 && (
              <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-1 overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between pb-1.5 text-white/40 z-10 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Writing Tools</span>
                  <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">AI ASSIST</span>
                </div>

                {/* Polish Tone & Grammar */}
                <button
                  onClick={() => triggerTool("Polish Tone", "Refinando vocabulario a B2/C1")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group z-10"
                >
                  <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                    <span className="font-normal text-white">Polish</span> tone & grammar
                  </span>
                  <span className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#C4B5FD] group-hover:border-[#8B5CF6]/40 transition-colors">
                    B2/C1
                  </span>
                </button>

                {/* Simplify & Clarify */}
                <button
                  onClick={() => triggerTool("Simplify", "Maximizando concisión")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group z-10"
                >
                  <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                    <span className="font-normal text-white">Simplify</span> & clarify
                  </span>
                  <span className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-[#7DD3FC] group-hover:border-[#38BDF8]/40 transition-colors">
                    Direct
                  </span>
                </button>

                {/* Smart Discourse Connectors */}
                <button
                  onClick={() => triggerTool("Smart Connectors", "Sugerencias de conectores B2/C1")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group z-10"
                >
                  <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                    Discourse connectors
                  </span>
                  <span className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-amber-300 group-hover:border-amber-400/40 transition-colors">
                    +Flow
                  </span>
                </button>

                {/* Expand with Details */}
                <button
                  onClick={() => triggerTool("Expand", "Ampliando estructura")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group z-10"
                >
                  <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                    Expand reasoning
                  </span>
                  <span className="text-[10px] font-mono text-[#6EE7B7] group-hover:translate-x-0.5 transition-transform">
                    +STAR →
                  </span>
                </button>
              </div>
            )}

            {/* CONCEPT 2: Orbital Obsidian Dual-Pill Matrix */}
            {activeConcept === 2 && (
              <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-2xl flex flex-col space-y-3 overflow-hidden">
                <div className="flex items-center justify-between pb-1.5 text-white/40 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Writing Matrix</span>
                  <span className="text-[9px] font-mono text-white/25">ACTIONS</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerTool("Polish", "B2/C1 Enhance")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col space-y-1 text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <svg className="w-4 h-4 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l1.91 5.89H20l-4.85 3.53 1.85 5.88L12 14.77l-5 3.53 1.85-5.88L4 8.89h6.09z" />
                      </svg>
                      <span className="text-[9px] font-mono text-white/30">C1</span>
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-white">Polish Tone</span>
                    <span className="text-[10px] font-light text-white/40">Refine grammar</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Simplify", "Direct clarity")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col space-y-1 text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <svg className="w-4 h-4 text-[#7DD3FC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span className="text-[9px] font-mono text-white/30">Direct</span>
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-white">Simplify</span>
                    <span className="text-[10px] font-light text-white/40">Concise logic</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Connectors", "Discourse bank")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col space-y-1 text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <svg className="w-4 h-4 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span className="text-[9px] font-mono text-white/30">+Link</span>
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-white">Connectors</span>
                    <span className="text-[10px] font-light text-white/40">Smooth flow</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Expand", "Context depth")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 transition-all flex flex-col space-y-1 text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <svg className="w-4 h-4 text-[#6EE7B7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" />
                        <line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                      <span className="text-[9px] font-mono text-white/30">+STAR</span>
                    </div>
                    <span className="text-xs font-medium text-white/90 group-hover:text-white">Expand</span>
                    <span className="text-[10px] font-light text-white/40">Deep context</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 3: VisionOS Spatial Frosted Glass Studio */}
            {activeConcept === 3 && (
              <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-4 shadow-2xl flex flex-col space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                  <span className="text-[10px] font-sans font-light tracking-widest uppercase text-white/40">Studio</span>
                  <span className="text-[9px] font-mono text-white/20">Spatial Glass</span>
                </div>

                <div className="flex flex-col space-y-1.5 pt-1">
                  <button
                    onClick={() => triggerTool("Tone Calibration", "Formal C1")}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]" />
                      <span className="text-xs font-normal text-white">Elevate to Executive Register</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C4B5FD]">C1</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Sentence Synthesis", "Active verbs")}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                      <span className="text-xs font-normal text-white">Synthesize Active Verbs</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7DD3FC]">Active</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Discourse Cohesion", "Paragraph flow")}
                    className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      <span className="text-xs font-normal text-white">Enhance Paragraph Cohesion</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6EE7B7]">Flow</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 4: Cyber-Kinetic Laser Typography */}
            {activeConcept === 4 && (
              <div className="relative bg-transparent border-0 p-2 flex flex-col space-y-1.5 font-sans">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] text-white/30">
                  <span className="text-[10px] font-mono uppercase tracking-widest">WRITING TOOLS</span>
                  <span className="text-[9px] font-mono">LASER</span>
                </div>

                <div className="flex flex-col space-y-1 text-xs">
                  <button
                    onClick={() => triggerTool("Polish Tone", "Laser refine")}
                    className="group flex items-center justify-between py-2 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-1 h-3.5 rounded-full bg-[#8B5CF6]/50 group-hover:bg-[#C4B5FD] transition-all" />
                      <span className="text-white/80 group-hover:text-white font-light">
                        <span className="font-normal text-white">Polish</span> grammar & tone
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30">1.0x</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Simplify", "Laser simplify")}
                    className="group flex items-center justify-between py-2 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-1 h-3.5 rounded-full bg-[#38BDF8]/50 group-hover:bg-[#7DD3FC] transition-all" />
                      <span className="text-white/80 group-hover:text-white font-light">
                        <span className="font-normal text-white">Simplify</span> sentence structure
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7DD3FC]">Direct</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Connectors", "Laser connectors")}
                    className="group flex items-center justify-between py-2 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-1 h-3.5 rounded-full bg-amber-500/50 group-hover:bg-amber-300 transition-all" />
                      <span className="text-white/80 group-hover:text-white font-light">
                        Discourse connectors bank
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">+15s</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Expand", "Laser expand")}
                    className="group flex items-center justify-between py-2 px-2 hover:bg-white/[0.03] rounded-xl transition-all cursor-pointer text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-1 h-3.5 rounded-full bg-[#10B981]/50 group-hover:bg-[#6EE7B7] transition-all" />
                      <span className="text-white/80 group-hover:text-white font-light">
                        Expand with evidence
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6EE7B7]">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 5: Tactical Hotkey Precision HUD */}
            {activeConcept === 5 && (
              <div className="relative bg-[#060510] border border-white/[0.09] rounded-3xl p-4 shadow-2xl flex flex-col space-y-1.5">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Precision HUD</span>
                  <span className="text-[9px] font-mono text-amber-300">SHORTCUTS</span>
                </div>

                <button
                  onClick={() => triggerTool("Polish (P)", "Refine vocabulary")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Polish Register</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">P</kbd>
                </button>

                <button
                  onClick={() => triggerTool("Simplify (S)", "Clarity boost")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Simplify Syntax</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">S</kbd>
                </button>

                <button
                  onClick={() => triggerTool("Connectors (C)", "Transition flow")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Connectors Bank</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">C</kbd>
                </button>
              </div>
            )}

            {/* CONCEPT 6: Master Luxury Consolidated Cockpit */}
            {activeConcept === 6 && (
              <div className="relative bg-[#04040A] border border-white/[0.08] rounded-3xl p-5 shadow-2xl flex flex-col space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Cockpit Master</span>
                  <span className="text-[9px] font-mono text-emerald-400">ACTIVE</span>
                </div>

                {/* Integrated Progress & Metric Row */}
                <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-2xl p-3">
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-mono uppercase text-white/30">Target Goal</span>
                    <span className="text-xs font-light text-white">120 / 180 words</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-emerald-400">67% Ready</span>
                </div>

                {/* Wireframe Action List */}
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => triggerTool("Polish", "Auto B2/C1")}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white/[0.03] text-xs text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light">Polish tone</span>
                    <span className="text-[9.5px] font-mono text-[#C4B5FD]">B2/C1</span>
                  </button>

                  <button
                    onClick={() => triggerTool("Simplify", "Clarity")}
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-white/[0.03] text-xs text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light">Simplify logic</span>
                    <span className="text-[9.5px] font-mono text-[#7DD3FC]">Direct</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
