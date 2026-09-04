import React, { useState } from "react";
import { appToast } from "../../../design-system/components/Toast";

export const InterviewControlsShowcase: React.FC = () => {
  const [activeConcept, setActiveConcept] = useState<number>(13);
  const [filterCategory, setFilterCategory] = useState<string>("clean");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activePlaybackMode, setActivePlaybackMode] = useState<string>("repeat");

  const triggerAction = (actionName: string, _color?: string) => {
    appToast.info(`Control: ${actionName}`, "Simulación interactiva en Lab");
  };

  const allConcepts = [
    // Top Priority Master Clean Collection
    {
      id: 13,
      category: "clean",
      title: "13. Obsidian Monolith (Floating Laser Ray)",
      subtitle: "Máxima limpieza · Cero cajas anidadas, fila tipográfica pura con micro-indicador láser vertical",
      tag: "Master Clean ★",
      tagColor: "bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40",
    },
    {
      id: 14,
      category: "clean",
      title: "14. Cosmos Minimalist Glass Wireframe",
      subtitle: "Linear 2026 Standard · Líneas especulares de 0.5px, tipografía platino y micro-insignias translúcidas",
      tag: "Linear 2026",
      tagColor: "bg-[#38BDF8]/20 text-[#7DD3FC] border-[#38BDF8]/40",
    },
    {
      id: 15,
      category: "spatial",
      title: "15. Zenith Air Glass (VisionOS Featherweight)",
      subtitle: "Vidrio ingrávido ultraligero con iluminación espacial suave al tacto y geometría pura",
      tag: "VisionOS Air",
      tagColor: "bg-[#C084FC]/20 text-[#E9D5FF] border-[#C084FC]/40",
    },
    {
      id: 16,
      category: "clean",
      title: "16. Architectural Grid (Braun & Dieter Rams)",
      subtitle: "Simetría matemática, divisiones microscópicas de 1px y cero elementos decorativos innecesarios",
      tag: "Pure Minimal",
      tagColor: "bg-[#94A3B8]/20 text-[#E2E8F0] border-[#94A3B8]/40",
    },
    {
      id: 17,
      category: "clean",
      title: "17. Smoky Amethyst & Frosted Ice Accents",
      subtitle: "Acentos cromáticos apagados de alta costura (no saturados, tonos champagne, lavanda y menta salvia)",
      tag: "Haute Couture",
      tagColor: "bg-[#D4AF37]/20 text-[#FDE68A] border-[#D4AF37]/40",
    },
    {
      id: 18,
      category: "clean",
      title: "18. Pure Editorial Numbered Stream",
      subtitle: "Flujo editorial numerado [01]–[04] con alineación métrica perfecta y micro-aceleración suave",
      tag: "Editorial Pro",
      tagColor: "bg-[#10B981]/20 text-[#6EE7B7] border-[#10B981]/40",
    },
    {
      id: 1,
      category: "minimal",
      title: "1. Luminescent Kinetic Rails",
      subtitle: "Micro-carriles con cápsulas de icono vector y sutiles bordes reactivos",
      tag: "Kinetic Rails",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
    {
      id: 2,
      category: "tactical",
      title: "2. Orbital Glass Capsules",
      subtitle: "Cuadrícula táctica 2x3 con cápsulas biseladas de cristal obsidian",
      tag: "Capsule Grid",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
    {
      id: 3,
      category: "minimal",
      title: "3. Cyber-Kinetic Laser Typography",
      subtitle: "Cero cajas · Tipografía editorial pura con barras láser reactivas al hover",
      tag: "Anti-Box",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
    {
      id: 4,
      category: "tactical",
      title: "4. Prism Tactical Cockpit",
      subtitle: "Layout HUD con atajos de teclado sutiles [R], [S], [N] y auras cromáticas",
      tag: "Tactical HUD",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
    {
      id: 7,
      category: "spatial",
      title: "7. Holographic Glass Morph",
      subtitle: "Vidrio esmerilado con dispersión cromática sutil y orbes hápticos 3D",
      tag: "Spatial 3D",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
    {
      id: 12,
      category: "spatial",
      title: "12. Dynamic Island Micro-Cockpit",
      subtitle: "Isla flotante morphing con botones de acceso rápido y expansión háptica",
      tag: "Dynamic Island",
      tagColor: "bg-white/10 text-white/80 border-white/20",
    },
  ];

  const filteredConcepts =
    filterCategory === "all"
      ? allConcepts
      : allConcepts.filter((c) => c.category === filterCategory);

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: "clean", label: "✨ Master Clean (Ultra-Limpio)", count: "6" },
          { id: "all", label: "Todos los Diseños", count: "12" },
          { id: "spatial", label: "VisionOS Spatial", count: "3" },
          { id: "tactical", label: "Tactical Pro", count: "2" },
          { id: "minimal", label: "Anti-Box Minimal", count: "2" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setFilterCategory(tab.id);
              const firstInCat = allConcepts.find(
                (c) => tab.id === "all" || c.category === tab.id
              );
              if (firstInCat) setActiveConcept(firstInCat.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer flex items-center space-x-2 shrink-0 ${
              filterCategory === tab.id
                ? "bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-white shadow-[0_0_16px_rgba(139,92,246,0.25)]"
                : "bg-[#05040B] border border-white/[0.06] text-white/50 hover:text-white hover:border-white/15"
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid de Selección Rápida de Diseños */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {filteredConcepts.map((c) => (
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

      {/* Canvas Principal de Visualización & Interacción */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-[#020106] p-6 sm:p-10 overflow-hidden shadow-2xl">
        {/* Luces de aura ambiental sutil */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#7048E8]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Columna Izquierda: Información y Filosofía del Diseño */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-4">
            <div className="inline-flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C4B5FD] bg-[#7048E8]/20 px-2.5 py-1 rounded-full border border-[#7048E8]/30">
                Diseño #{activeConcept}
              </span>
              <span className="text-xs text-white/40">· Interactivo en Vivo</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              {allConcepts.find((c) => c.id === activeConcept)?.title}
            </h3>
            <p className="text-xs text-white/60 leading-relaxed">
              {allConcepts.find((c) => c.id === activeConcept)?.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-white/40">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                💎 Cero Cajas Pesadas
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                ✨ Tipografía Editorial Nítida
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                ⚡ Micro-Interacciones 60 FPS
              </span>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Renderizada en Tiempo Real */}
          <div className="w-full max-w-[340px] shrink-0">
            {/* CONCEPT 13: Obsidian Monolith (Floating Laser Ray) ★ MASTER CLEAN */}
            {activeConcept === 13 && (
              <div className="relative bg-[#030208] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-1 overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                <div className="flex items-center justify-between pb-2 text-white/40 z-10 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">CONTROLS</span>
                  <span className="text-[9px] font-mono text-white/25">ACTIONS</span>
                </div>

                {/* Repeat Question */}
                <button
                  onClick={() => triggerAction("Repeat Question", "violet")}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-1 h-3.5 rounded-full bg-[#8B5CF6]/50 group-hover:bg-[#C4B5FD] group-hover:h-4 transition-all duration-200" />
                    <span className="text-white/80 group-hover:text-white transition-colors">
                      <span className="font-medium text-white">Repeat</span> <span className="font-light text-white/50 group-hover:text-white/80">question</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/25 group-hover:text-white/60 transition-colors">⟲</span>
                </button>

                {/* Repeat Question Slower */}
                <button
                  onClick={() => triggerAction("Repeat Slower 0.7x", "cyan")}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-1 h-3.5 rounded-full bg-[#38BDF8]/50 group-hover:bg-[#7DD3FC] group-hover:h-4 transition-all duration-200" />
                    <span className="text-white/80 group-hover:text-white transition-colors">
                      <span className="font-medium text-white">Repeat</span> <span className="font-light text-white/50 group-hover:text-white/80">slower</span>
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono text-[#7DD3FC] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/20">0.7x</span>
                </button>

                {/* Take My Time */}
                <button
                  onClick={() => triggerAction("+15s Take My Time", "amber")}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-1 h-3.5 rounded-full bg-amber-500/50 group-hover:bg-amber-300 group-hover:h-4 transition-all duration-200" />
                    <span className="font-light text-white/70 group-hover:text-white transition-colors">Take my time</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">+15s</span>
                </button>

                {/* Next Question */}
                <button
                  onClick={() => triggerAction("Next Question", "emerald")}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-white/[0.03] transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-1 h-3.5 rounded-full bg-[#10B981]/50 group-hover:bg-[#6EE7B7] group-hover:h-4 transition-all duration-200" />
                    <span className="text-white/80 group-hover:text-white transition-colors">
                      <span className="font-medium text-white">Next</span> <span className="font-light text-white/50 group-hover:text-white/80">question</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/30 group-hover:text-[#6EE7B7] group-hover:translate-x-0.5 transition-all">→</span>
                </button>

                {/* Bottom Row */}
                <div className="pt-2 flex items-center justify-between border-t border-white/[0.04] px-1">
                  <button
                    onClick={() => {
                      setIsPaused(!isPaused);
                      triggerAction(isPaused ? "Resume" : "Pause", "slate");
                    }}
                    className="text-[11px] font-light text-white/45 hover:text-white transition-colors cursor-pointer py-1"
                  >
                    {isPaused ? "▶ Resume" : "⏸ Pause"}
                  </button>
                  <button
                    onClick={() => triggerAction("End Interview", "rose")}
                    className="text-[11px] font-light text-rose-400/80 hover:text-rose-300 transition-colors cursor-pointer py-1"
                  >
                    ⏻ End interview
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 14: Cosmos Minimalist Glass Wireframe (Linear 2026) */}
            {activeConcept === 14 && (
              <div className="relative bg-[#020206]/90 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-4 shadow-2xl flex flex-col space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/[0.05]">
                  <span className="text-[10px] font-mono text-white/40 tracking-[0.25em]">LINEAR PRO HUD</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                    <span className="text-[9px] font-mono text-white/40">READY</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => triggerAction("Repeat", "violet")}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                      <span className="font-normal text-white">Repeat</span> audio question
                    </span>
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-white">1.0x</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Slower", "cyan")}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                      <span className="font-normal text-white">Repeat</span> slower pace
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[#7DD3FC]">0.7x</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Time", "amber")}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                      Add thinking time
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-amber-300">+15s</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Next", "emerald")}
                    className="flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] text-xs transition-all text-left cursor-pointer group"
                  >
                    <span className="text-white/80 group-hover:text-white font-light tracking-wide">
                      Advance turn
                    </span>
                    <span className="text-[10px] font-mono text-[#6EE7B7] group-hover:translate-x-0.5 transition-transform">NEXT →</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 15: Zenith Air Glass (VisionOS Featherweight) */}
            {activeConcept === 15 && (
              <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col space-y-2">
                <div className="flex items-center justify-between pb-1 text-white/30 border-b border-white/[0.04]">
                  <span className="text-[10px] font-sans font-light tracking-widest uppercase">Actions</span>
                  <span className="text-[9px] font-mono">Air Glass</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => triggerAction("Repeat", "violet")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-[#C4B5FD] text-sm pb-1">⟲</div>
                    <div className="text-xs font-normal text-white">Repeat</div>
                    <div className="text-[10px] font-light text-white/40">Current audio</div>
                  </button>

                  <button
                    onClick={() => triggerAction("Slower", "cyan")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-[#7DD3FC] text-sm pb-1">🕒</div>
                    <div className="text-xs font-normal text-white">Slower</div>
                    <div className="text-[10px] font-light text-white/40">0.7x Clarity</div>
                  </button>

                  <button
                    onClick={() => triggerAction("+15s", "amber")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-amber-300 text-sm pb-1">⏱</div>
                    <div className="text-xs font-normal text-white">+15s Time</div>
                    <div className="text-[10px] font-light text-white/40">Think pause</div>
                  </button>

                  <button
                    onClick={() => triggerAction("Next", "emerald")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-[#6EE7B7] text-sm pb-1">→</div>
                    <div className="text-xs font-normal text-white">Next</div>
                    <div className="text-[10px] font-light text-white/40">Skip question</div>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 16: Architectural Grid (Braun & Dieter Rams) */}
            {activeConcept === 16 && (
              <div className="relative bg-[#000000] border border-white/[0.12] rounded-2xl p-3 flex flex-col font-sans">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40 pb-2 border-b border-white/[0.08]">
                  <span>CONTROLS / SYSTEM</span>
                  <span>REF 01</span>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  <button
                    onClick={() => triggerAction("Repeat", "white")}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-white/70 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="font-light tracking-wide">Repeat Question</span>
                    <span className="text-[10px] font-mono text-white/30">1.0X</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Slower", "white")}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-white/70 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="font-light tracking-wide">Repeat Slower</span>
                    <span className="text-[10px] font-mono text-white/70">0.7X</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Time", "white")}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-white/70 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="font-light tracking-wide">Take My Time</span>
                    <span className="text-[10px] font-mono text-white/50">+15S</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Next", "white")}
                    className="w-full py-2.5 px-2 flex items-center justify-between text-xs text-white/70 hover:text-white hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="font-light tracking-wide">Next Question</span>
                    <span className="text-[10px] font-mono text-white">NEXT ➔</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 17: Smoky Amethyst & Frosted Ice Accents */}
            {activeConcept === 17 && (
              <div className="relative bg-[#04030A] border border-white/[0.07] rounded-3xl p-4 shadow-2xl flex flex-col space-y-2">
                <div className="flex items-center space-x-1.5 pb-1 border-b border-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9381FF]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C4B5FD]/80">SESSION ACTIONS</span>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <button
                    onClick={() => triggerAction("Repeat Audio", "violet")}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#9381FF]/[0.05] hover:bg-[#9381FF]/[0.12] border border-[#9381FF]/20 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[#C4B5FD] text-xs">⟲</span>
                      <span className="text-xs font-normal text-white/90 group-hover:text-white">Repeat Question</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#C4B5FD]/60">Normal</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Repeat Slower", "cyan")}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#A5C4D4]/[0.05] hover:bg-[#A5C4D4]/[0.12] border border-[#A5C4D4]/20 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[#A5C4D4] text-xs">🕒</span>
                      <span className="text-xs font-normal text-white/90 group-hover:text-white">Repeat Slower</span>
                    </div>
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[#A5C4D4]/15 text-[#A5C4D4]">0.7x</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Next Question", "emerald")}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-[#A8DADC]/[0.05] hover:bg-[#A8DADC]/[0.12] border border-[#A8DADC]/20 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-[#A8DADC] text-xs">▶</span>
                      <span className="text-xs font-normal text-white/90 group-hover:text-white">Next Question</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A8DADC]">Forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 18: Pure Editorial Numbered Stream */}
            {activeConcept === 18 && (
              <div className="relative bg-transparent border-0 p-2 flex flex-col space-y-2 font-sans">
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.06] text-white/30">
                  <span className="text-[10px] font-mono uppercase tracking-widest">FLOW CONTROLS</span>
                  <span className="text-[9px] font-mono">STREAM</span>
                </div>

                <div className="flex flex-col space-y-2 text-xs">
                  <button
                    onClick={() => triggerAction("01 Repeat", "violet")}
                    className="flex items-center justify-between py-1.5 hover:text-white text-white/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-white/25 group-hover:text-[#C4B5FD] transition-colors">01</span>
                      <span className="font-light tracking-wide text-white/80 group-hover:text-white">Repeat question</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/30 group-hover:text-white">1.0x</span>
                  </button>

                  <button
                    onClick={() => triggerAction("02 Slower", "cyan")}
                    className="flex items-center justify-between py-1.5 hover:text-white text-white/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-white/25 group-hover:text-[#7DD3FC] transition-colors">02</span>
                      <span className="font-light tracking-wide text-white/80 group-hover:text-white">Repeat question slower</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#7DD3FC]">0.7x</span>
                  </button>

                  <button
                    onClick={() => triggerAction("03 Time", "amber")}
                    className="flex items-center justify-between py-1.5 hover:text-white text-white/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-white/25 group-hover:text-amber-300 transition-colors">03</span>
                      <span className="font-light tracking-wide text-white/80 group-hover:text-white">Take my time</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-300">+15s</span>
                  </button>

                  <button
                    onClick={() => triggerAction("04 Next", "emerald")}
                    className="flex items-center justify-between py-1.5 hover:text-white text-white/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-mono text-white/25 group-hover:text-[#6EE7B7] transition-colors">04</span>
                      <span className="font-light tracking-wide text-white/80 group-hover:text-white">Next question</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6EE7B7]">→</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 1: Luminescent Kinetic Rails */}
            {activeConcept === 1 && (
              <div className="relative bg-[#04040A] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 rounded-3xl p-4 shadow-2xl flex flex-col space-y-1.5 overflow-hidden">
                <div className="flex items-center justify-between pb-1.5 text-white/40 z-10 border-b border-white/[0.04]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Controls</span>
                  <span className="text-[9px] font-mono text-[#C4B5FD]/70 uppercase tracking-wider">Session Flow</span>
                </div>

                <button
                  onClick={() => triggerAction("Repeat Question", "violet")}
                  className="relative group flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/[0.015] hover:bg-[#8B5CF6]/[0.08] border border-transparent hover:border-[#8B5CF6]/25 transition-all text-left cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#C4B5FD]">
                      ⟲
                    </div>
                    <span className="text-white/80 group-hover:text-white">
                      <span className="font-medium text-[#C4B5FD]">Repeat</span> question
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-white/20">Normal</span>
                </button>

                <button
                  onClick={() => triggerAction("Repeat Slower 0.7x", "cyan")}
                  className="relative group flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/[0.015] hover:bg-[#38BDF8]/[0.08] border border-transparent hover:border-[#38BDF8]/25 transition-all text-left cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#7DD3FC]">
                      🕒
                    </div>
                    <span className="text-white/80 group-hover:text-white">
                      <span className="font-medium text-[#7DD3FC]">Repeat</span> slower
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#7DD3FC]">0.7x</span>
                </button>

                <button
                  onClick={() => triggerAction("Next Question", "emerald")}
                  className="relative group flex items-center justify-between px-3 py-2 rounded-xl text-xs bg-white/[0.015] hover:bg-[#10B981]/[0.08] border border-transparent hover:border-[#10B981]/25 transition-all text-left cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#6EE7B7]">
                      ⏭
                    </div>
                    <span className="text-white/80 group-hover:text-white">
                      <span className="font-medium text-[#6EE7B7]">Next</span> question
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6EE7B7]">→</span>
                </button>
              </div>
            )}

            {/* CONCEPT 2: Orbital Glass Capsules */}
            {activeConcept === 2 && (
              <div className="relative bg-[#05040C] border border-white/[0.08] rounded-3xl p-4 shadow-2xl flex flex-col space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerAction("Repeat", "violet")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-[#8B5CF6]/15 border border-white/[0.06] hover:border-[#8B5CF6]/40 transition-all flex flex-col space-y-1.5 text-left cursor-pointer"
                  >
                    <span className="text-xs font-medium text-white/90">Repeat</span>
                    <span className="text-[10px] font-light text-white/40">1.0x Normal</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Slower", "cyan")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-[#38BDF8]/15 border border-white/[0.06] hover:border-[#38BDF8]/40 transition-all flex flex-col space-y-1.5 text-left cursor-pointer"
                  >
                    <span className="text-xs font-medium text-[#7DD3FC]">Slower</span>
                    <span className="text-[10px] font-light text-white/40">0.7x Clarity</span>
                  </button>

                  <button
                    onClick={() => triggerAction("+15s", "amber")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 transition-all flex flex-col space-y-1.5 text-left cursor-pointer"
                  >
                    <span className="text-xs font-medium text-amber-300">Think Time</span>
                    <span className="text-[10px] font-light text-white/40">+15s Added</span>
                  </button>

                  <button
                    onClick={() => triggerAction("Next", "emerald")}
                    className="p-3 rounded-2xl bg-white/[0.02] hover:bg-[#10B981]/15 border border-white/[0.06] hover:border-[#10B981]/40 transition-all flex flex-col space-y-1.5 text-left cursor-pointer"
                  >
                    <span className="text-xs font-medium text-[#6EE7B7]">Forward</span>
                    <span className="text-[10px] font-light text-white/40">Next question</span>
                  </button>
                </div>
              </div>
            )}

            {/* CONCEPT 3: Cyber-Kinetic Laser Typography */}
            {activeConcept === 3 && (
              <div className="relative bg-transparent border-0 p-3 flex flex-col space-y-2">
                <button
                  onClick={() => triggerAction("Repeat", "violet")}
                  className="group flex items-center space-x-3 py-2 text-left cursor-pointer border-b border-white/[0.04] hover:border-[#A27FF3]/50 transition-all"
                >
                  <span className="text-sm font-sans font-light tracking-wide text-white/70 group-hover:text-white transition-colors flex-1">
                    <span className="font-medium text-[#C4B5FD]">Repeat</span> current question
                  </span>
                  <span className="text-[10px] font-mono text-white/30">⟲</span>
                </button>

                <button
                  onClick={() => triggerAction("Slower", "cyan")}
                  className="group flex items-center space-x-3 py-2 text-left cursor-pointer border-b border-white/[0.04] hover:border-[#38BDF8]/50 transition-all"
                >
                  <span className="text-sm font-sans font-light tracking-wide text-white/70 group-hover:text-white transition-colors flex-1">
                    <span className="font-medium text-[#7DD3FC]">Repeat</span> in slow pace
                  </span>
                  <span className="text-[10px] font-mono text-[#7DD3FC]">0.7x</span>
                </button>

                <button
                  onClick={() => triggerAction("Next", "emerald")}
                  className="group flex items-center space-x-3 py-2 text-left cursor-pointer border-b border-white/[0.04] hover:border-[#10B981]/50 transition-all"
                >
                  <span className="text-sm font-sans font-light tracking-wide text-white/70 group-hover:text-white transition-colors flex-1">
                    <span className="font-medium text-[#6EE7B7]">Skip to next</span> question
                  </span>
                  <span className="text-[10px] font-mono text-[#6EE7B7]">→</span>
                </button>
              </div>
            )}

            {/* CONCEPT 4: Prism Tactical Cockpit */}
            {activeConcept === 4 && (
              <div className="relative bg-[#060510] border border-white/[0.09] rounded-3xl p-4 shadow-2xl flex flex-col space-y-1.5">
                <button
                  onClick={() => triggerAction("Repeat (R)", "violet")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Repeat Audio</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">R</kbd>
                </button>

                <button
                  onClick={() => triggerAction("Slower (S)", "cyan")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Slower (0.7x)</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">S</kbd>
                </button>

                <button
                  onClick={() => triggerAction("Next (N)", "emerald")}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] text-left cursor-pointer group"
                >
                  <span className="text-xs font-light text-white/80 group-hover:text-white">Next Turn</span>
                  <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/60">N</kbd>
                </button>
              </div>
            )}

            {/* CONCEPT 7: Holographic Glass Morph */}
            {activeConcept === 7 && (
              <div className="relative bg-[#0b0914]/80 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-4 shadow-2xl flex flex-col space-y-2">
                <button
                  onClick={() => triggerAction("Repeat Audio (Spatial)", "violet")}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#A855F7]/15 border border-white/[0.08] transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-medium text-white">Repeat Question</span>
                  <span className="text-[10px] font-mono text-[#C084FC]">1.0x</span>
                </button>

                <button
                  onClick={() => triggerAction("Slow Audio (Spatial)", "cyan")}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#06B6D4]/15 border border-white/[0.08] transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-medium text-white">Repeat Slower</span>
                  <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#67E8F9]">0.7x</span>
                </button>

                <button
                  onClick={() => triggerAction("Advance (Spatial)", "emerald")}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#10B981]/15 border border-white/[0.08] transition-all text-left cursor-pointer group"
                >
                  <span className="text-xs font-medium text-white">Next Question</span>
                  <span className="text-[10px] font-mono text-[#6EE7B7]">Skip →</span>
                </button>
              </div>
            )}

            {/* CONCEPT 12: Dynamic Island Micro-Cockpit */}
            {activeConcept === 12 && (
              <div className="relative bg-[#000002] border border-white/[0.12] rounded-full p-2 shadow-2xl flex items-center justify-between space-x-1 max-w-[320px] mx-auto">
                <button
                  onClick={() => {
                    setActivePlaybackMode("repeat");
                    triggerAction("Island: Repeat", "violet");
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activePlaybackMode === "repeat"
                      ? "bg-[#8B5CF6] text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>⟲</span>
                  <span>Repeat</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlaybackMode("slower");
                    triggerAction("Island: Slower 0.7x", "cyan");
                  }}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activePlaybackMode === "slower"
                      ? "bg-[#06B6D4] text-white shadow-[0_0_16px_rgba(6,182,212,0.5)]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>0.7x</span>
                  <span>Slow</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlaybackMode("next");
                    triggerAction("Island: Next", "emerald");
                  }}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activePlaybackMode === "next"
                      ? "bg-[#10B981] text-white shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
