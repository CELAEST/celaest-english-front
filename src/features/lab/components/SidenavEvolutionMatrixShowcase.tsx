import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KineticLuxuryText } from "../../workspace/components/KineticLuxuryText";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
  TechnicalWritingQuillIcon,
  QuantumNeuralGaugeIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export type CleanSidenavSuiteId =
  | "suite_1_obsidian"
  | "suite_2_monolith"
  | "suite_3_acoustic"
  | "suite_4_specular"
  | "suite_5_sovereign";

interface SidenavSuiteMeta {
  id: CleanSidenavSuiteId;
  tier: number;
  title: string;
  category: string;
  philosophy: string;
  whatItAdds: string;
  craftDetails: string[];
}

const CLEAN_SUITES: SidenavSuiteMeta[] = [
  {
    id: "suite_1_obsidian",
    tier: 1,
    title: "Obsidian Pure",
    category: "Baseline Clean Architectural Glass",
    philosophy:
      "La pureza de la arquitectura CELAEST en su estado más esencial: superficie obsidiana #04040A, borde sub-píxel blanco de 0.07, cero marcos de colores y tipografía ligera.",
    whatItAdds:
      "Línea base ultra-limpia: erradica todas las barras toscas, marcos coloreados y distracciones visuales.",
    craftDetails: [
      "Superficie #04040A con borde blanco al 7% (border-white/[0.07])",
      "Top specular hairline con gradiente horizontal tenue",
      "Isotipo ave CELAEST en micro-squircle pulido",
      "Retrato ejecutivo puro con halo de 0.5px",
    ],
  },
  {
    id: "suite_2_monolith",
    tier: 2,
    title: "Bespoke Monolith",
    category: "Spatial Rhythm & Keyboard Precision",
    philosophy:
      "Sobre el Nivel 1, introduce ritmo espacial y densidad ejecutiva con atajos grabados en micro-fuente monospace y separadores de luz.",
    whatItAdds:
      "+ Atajos grabados en micro-fuente (⌘1-⌘5), cápsula activa con carril interior de 2px y micro-divisor gradiente.",
    craftDetails: [
      "Atajos grabados en tipografía monospace al 25% de opacidad",
      "Carril luminoso interior integrado de 2px en el elemento activo",
      "Separación sutil entre herramientas core y configuración",
      "Transición magnética suave al pasar el cursor",
    ],
  },
  {
    id: "suite_3_acoustic",
    tier: 3,
    title: "Acoustic Minimal",
    category: "Voice-AI Waveform Telemetry",
    philosophy:
      "Sobre el Nivel 2, añade la discreta telemetría de voz de CELAEST: 3 micro-filamentos acústicos flotando libremente junto al avatar que respiran en silencio.",
    whatItAdds:
      "+ 3 micro-filamentos acústicos flotantes de 1.5px junto al avatar y micro-glow sutil en la herramienta activa.",
    craftDetails: [
      "3 filamentos acústicos flotantes sin caja contenedora",
      "Micro-glow amatista sutil (#A27FF3/20) en el trazo del icono activo",
      "Decodificación cinética whisper-quiet de caracteres en el nombre",
      "Indicador de estado en micro-fuente monospace verde esmeralda",
    ],
  },
  {
    id: "suite_4_specular",
    tier: 4,
    title: "Atelier Specular",
    category: "Tactile Glass & Momentum Progress",
    philosophy:
      "Sobre el Nivel 3, añade profundidad táctil multicapa con un medidor de momentum de aprendizaje sutil de 1px en la base del perfil y aristas especulares superior e inferior.",
    whatItAdds:
      "+ Medidor lineal de momentum de aprendizaje de 1px y doble arista especular con luz rasante.",
    craftDetails: [
      "Micro-barra de progreso de momentum diario de 1px integrada en el pie",
      "Aristas especulares superior e inferior que capturan luz tenue",
      "Vidrio esmerilado multicapa (backdrop-blur-3xl)",
      "Espaciado óptico expandido en la tipografía de cabecera",
    ],
  },
  {
    id: "suite_5_sovereign",
    tier: 5,
    title: "The Sovereign Standard",
    category: "CELAEST Apex Enterprise Architecture",
    philosophy:
      "La culminación definitiva de la arquitectura CELAEST: síntesis perfecta de vidrio obsidiana, filamentos acústicos, medidor de momentum, atajos grabados y decodificación cinética suave.",
    whatItAdds:
      "+ Síntesis arquitectónica total: la máxima expresión del diseño ultra-premium sin una sola gota de artificio.",
    craftDetails: [
      "Fusión total de las técnicas 1 a 4 en equilibrio óptico perfecto",
      "Geometría de squircle optimizada para pantallas Retina y 4K",
      "Tipografía suiza de peso pluma con legibilidad absoluta",
      "Sincronización instantánea con el Sidenav real de la app",
    ],
  },
];

const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D =
  "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const SidenavEvolutionMatrixShowcase: React.FC = () => {
  const [selectedSuite, setSelectedSuite] = useState<CleanSidenavSuiteId>("suite_3_acoustic");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("interview");
  const [userName, setUserName] = useState("Esteban Perez");
  const [userLevel, setUserLevel] = useState("A1 Elementary");
  const [kineticTrigger, setKineticTrigger] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const activeMeta = useMemo(
    () => CLEAN_SUITES.find((s) => s.id === selectedSuite) || CLEAN_SUITES[2],
    [selectedSuite],
  );

  const handleApplyToLiveApp = (suite: SidenavSuiteMeta) => {
    setSelectedSuite(suite.id);
    if (typeof window !== "undefined") {
      let mappedVariant = "atelier_minimalist";
      if (suite.id === "suite_1_obsidian") mappedVariant = "atelier_minimalist";
      if (suite.id === "suite_2_monolith") mappedVariant = "precision_chrono";
      if (suite.id === "suite_3_acoustic") mappedVariant = "acoustic_resonance";
      if (suite.id === "suite_4_specular") mappedVariant = "specular_glass";
      if (suite.id === "suite_5_sovereign") mappedVariant = "acoustic_resonance";

      localStorage.setItem("celaest_sidenav_variant", mappedVariant);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: mappedVariant }));
      setNotification(`¡Diseño "${suite.title}" aplicado al Sidenav en vivo!`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const navSampleItems = [
    { id: "workspace", label: "Workspace", shortcut: "⌘1", icon: <GridIcon /> },
    { id: "memory", label: "Memory", shortcut: "⌘2", icon: <CognitiveMemoryBrainIcon className="w-[18px] h-[18px]" />, hasDot: true },
    { id: "interview", label: "Interview", shortcut: "⌘3", icon: <StudioVoiceMicIcon className="w-[18px] h-[18px]" /> },
    { id: "reading", label: "Reading", shortcut: "⌘4", icon: <PrecisionOpenBookIcon className="w-[18px] h-[18px]" /> },
    { id: "writing", label: "Writing", shortcut: "⌘5", icon: <TechnicalWritingQuillIcon className="w-[18px] h-[18px]" /> },
    { id: "lab", label: "Design Lab", shortcut: "⌘L", icon: <QuantumNeuralGaugeIcon className="w-[18px] h-[18px]" /> },
  ];

  return (
    <section className="relative p-6 sm:p-10 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-8 select-none overflow-hidden">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Applied Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="w-full py-3 px-5 rounded-2xl bg-[#070913] border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.2)] relative z-30"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{notification}</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70">
              Live Sidenav Updated
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Title and Minimal CELAEST Taxonomy */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6 z-10">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Architecture Suite
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.08]">
              Clean Sidenav Standard
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Sidenav Architectural Evolution (5 Clean Suites)
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/40 max-w-3xl leading-relaxed">
            Diseñado bajo la misma filosofía que <code>TodaysFocusCard</code> y <code>ReadingAIMentorCard</code>:
            superficies obsidianas puras, micro-aristas especulares, tipografía suiza ligera y cero artificios.
            Cada nivel introduce un refinamiento visual y material sobre el anterior.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setKineticTrigger((p) => p + 1)}
            className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
            title="Replay Kinetic Typography"
            aria-label="Replay kinetic animation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              isExpanded
                ? "bg-white/[0.08] border-white/20 text-white"
                : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white"
            }`}
          >
            {isExpanded ? "Sidebar: Expandido" : "Sidebar: Colapsado"}
          </button>
        </div>
      </div>

      {/* 5-Level Selector Tabs (CELAEST Monolith Styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 z-10">
        {CLEAN_SUITES.map((suite) => {
          const isSelected = selectedSuite === suite.id;
          return (
            <button
              key={suite.id}
              type="button"
              onClick={() => setSelectedSuite(suite.id)}
              className={`flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? "bg-[#060712] border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] scale-[1.01]"
                  : "bg-white/[0.015] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                  Nivel 0{suite.tier}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                )}
              </div>

              <h4 className={`text-sm font-light tracking-wide w-full ${
                isSelected ? "text-white" : "text-white/70 group-hover:text-white"
              }`}>
                {suite.title}
              </h4>

              <p className="text-[11px] font-mono text-white/30 line-clamp-2 mt-1 leading-relaxed">
                {suite.category}
              </p>

              <div className="mt-3 pt-2.5 border-t border-white/[0.04] w-full flex items-center justify-between text-[10px]">
                <span className="font-mono text-white/30">CELAEST Std</span>
                <span className={`font-mono transition-colors ${isSelected ? "text-emerald-400" : "text-white/40"}`}>
                  {isSelected ? "Inspeccionando" : "Seleccionar →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workbench: Real Simulated Sidenav vs Craft Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">
        {/* Left: 1:1 Live Simulated Sidenav on Pure Obsidian Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative overflow-hidden min-h-[560px]">
          {/* Top Hairline Indicator */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Live Preview · {activeMeta.title} (Nivel {activeMeta.tier})
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {isExpanded ? "Ancho: 240px" : "Ancho: 64px"}
            </span>
          </div>

          {/* Sidenav Interactive Component */}
          <div className="my-auto flex items-center justify-start pl-4 sm:pl-8 py-4 z-10">
            <aside
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
              className={`flex flex-col justify-between bg-[#04040A] border border-white/[0.07] rounded-3xl py-4 px-2 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none h-[470px] relative ${
                isExpanded ? "w-60 px-3.5" : "w-16 px-2"
              }`}
            >
              {/* Top Specular Hairline */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Brand Header */}
              <div className="flex flex-col items-center w-full space-y-3">
                <div className="w-full flex items-center justify-center">
                  <div className="w-9 h-9 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white flex items-center justify-center shrink-0 shadow-inner p-2 cursor-pointer hover:border-white/20 transition-colors">
                    <svg
                      viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full text-white"
                    >
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <span className="ml-3 text-[12.5px] font-medium text-white tracking-[0.22em] uppercase font-sans whitespace-nowrap">
                      CELAEST
                    </span>
                  )}
                </div>

                {/* Sub-pixel Hairline Divider */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-0.5" />

                {/* Navigation Items */}
                <nav className="flex flex-col w-full space-y-1">
                  {navSampleItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`relative flex items-center w-full py-2 rounded-xl transition-all duration-200 cursor-pointer group/btn ${
                          isExpanded ? "px-3 justify-start" : "justify-center"
                        } ${
                          isActive
                            ? "bg-white/[0.06] text-white border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]"
                            : "text-white/45 hover:text-white hover:bg-white/[0.025] border border-transparent"
                        }`}
                      >
                        {/* Integrated 1.5px Accent Bar on Active */}
                        {isActive && (
                          <div className="absolute left-1.5 w-[2px] h-3.5 rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
                        )}

                        {/* Icon */}
                        <div className={`flex items-center justify-center w-5 h-5 shrink-0 transition-transform group-hover/btn:scale-105 ${
                          isActive ? "text-white" : "text-inherit"
                        }`}>
                          {item.icon}
                        </div>

                        {/* Label */}
                        {isExpanded && (
                          <span className={`ml-3 text-[13px] tracking-wide whitespace-nowrap transition-colors ${
                            isActive ? "text-white font-light" : "text-white/50 group-hover/btn:text-white font-light"
                          }`}>
                            {item.label}
                          </span>
                        )}

                        {/* Tier 2+ Keyboard Shortcut */}
                        {isExpanded && activeMeta.tier >= 2 && (
                          <span className="ml-auto text-[9.5px] font-mono text-white/20 group-hover/btn:text-white/40 transition-colors">
                            {item.shortcut}
                          </span>
                        )}

                        {/* Notification Dot (Memory) */}
                        {item.hasDot && (
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.6)] ${
                              isExpanded ? (activeMeta.tier >= 2 ? "mr-2" : "ml-auto") : "absolute top-2 right-2"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Section: Pure Floating Typography Profile */}
              <div className="flex flex-col items-center w-full space-y-1.5 mt-auto pt-2">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent my-0.5" />

                {/* Profile Floating Row (Zero Box Standard) */}
                <div
                  className={`relative w-full transition-all duration-200 cursor-pointer group/prof bg-transparent border-0 select-none ${
                    isExpanded ? "py-1.5 px-2 hover:bg-white/[0.03] rounded-2xl" : "flex justify-center py-1"
                  }`}
                >
                  <div className="flex items-center w-full">
                    {/* Portrait Avatar */}
                    <div className="relative flex items-center justify-center shrink-0">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                        <img
                          src="/assets/avatar_executive_luxury.jpg"
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Tier 3+ Whisper Acoustic Waveform Bars */}
                      {activeMeta.tier >= 3 && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-[2px] pointer-events-none">
                          <span className="w-[1.5px] h-2 bg-white/40 rounded-full animate-pulse" />
                          <span className="w-[1.5px] h-3.5 bg-white/70 rounded-full animate-[pulse_1s_infinite_0.2s]" />
                          <span className="w-[1.5px] h-1.5 bg-white/30 rounded-full animate-[pulse_0.8s_infinite_0.4s]" />
                        </div>
                      )}
                    </div>

                    {/* Expanded Profile Info */}
                    {isExpanded && (
                      <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left flex-1">
                        <KineticLuxuryText
                          text={userName}
                          trigger={isExpanded || kineticTrigger}
                          className="text-[13px] font-light text-white tracking-tight truncate leading-tight group-hover/prof:text-white/90"
                        />
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase truncate">
                            {userLevel}
                          </span>
                        </div>

                        {/* Tier 4+ Momentum Progress Bar (1px height) */}
                        {activeMeta.tier >= 4 && (
                          <div className="w-full h-[1.5px] bg-white/[0.08] rounded-full mt-1.5 overflow-hidden">
                            <div className="w-[65%] h-full bg-emerald-400/70 rounded-full" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Logout Action (Quiet, Clean) */}
                <div
                  className={`flex items-center w-full py-1 rounded-xl text-white/30 hover:text-rose-400 hover:bg-rose-500/[0.06] transition-all cursor-pointer group/logout ${
                    isExpanded ? "px-2.5 justify-start" : "justify-center"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {isExpanded && (
                    <span className="ml-2.5 text-[11px] font-light tracking-wide text-inherit">
                      Cerrar Sesión
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Right: Architecture & Craft Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative">
          <div className="flex flex-col space-y-5">
            {/* Header */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Memoria de Diseño · Nivel 0{activeMeta.tier}
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">
                {activeMeta.title}
              </h3>
              <p className="text-xs font-light text-white/40 leading-relaxed">
                {activeMeta.philosophy}
              </p>
            </div>

            {/* What it adds over previous tier */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                ¿Qué aporta sobre el nivel anterior?
              </span>
              <p className="text-xs font-light text-white/70 leading-relaxed">
                {activeMeta.whatItAdds}
              </p>
            </div>

            {/* Craftsmanship Highlights */}
            <div className="flex flex-col space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Detalles de Manufactura CELAEST:
              </span>
              {activeMeta.craftDetails.map((detail, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/60 font-light">{detail}</span>
                </div>
              ))}
            </div>

            {/* Test Name Input */}
            <div className="flex flex-col space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/[0.05]">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                Prueba en vivo con tu nombre
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
                <input
                  type="text"
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Master Application Button */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleApplyToLiveApp(activeMeta)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-medium text-xs tracking-wide hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <span>Activar Nivel {activeMeta.tier} ({activeMeta.title}) en Sidenav Real</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <span className="text-[10px] text-center text-white/30 font-mono">
              Aplica instantáneamente esta configuración al sidebar principal de la aplicación
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Gallery (5 Levels Rendered Cleanly) */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.06] z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Comparativa Rápida (5 Niveles)
          </span>
          <span className="text-[10px] font-mono text-white/30">Clic en cualquier tarjeta para audicionar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CLEAN_SUITES.map((s) => {
            const isSelected = selectedSuite === s.id;
            return (
              <div
                key={s.id}
                onClick={() => handleApplyToLiveApp(s)}
                className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "bg-[#060712] border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
                    : "bg-white/[0.015] border border-white/[0.05] hover:border-white/12 hover:bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-white/40">Nivel 0{s.tier}</span>
                  {isSelected ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      Activo
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-white/30 group-hover/card:text-white/60">
                      Elegir
                    </span>
                  )}
                </div>

                <div className="py-2 px-2 rounded-xl bg-black/40 border border-white/[0.03] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-white/10">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-xs font-light text-white truncate">{s.title}</span>
                    <span className="text-[9px] font-mono text-white/30 truncate">{s.category.split(" ")[0]}</span>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/[0.03] text-[9.5px] font-mono text-white/30 truncate">
                  {s.whatItAdds.split(":")[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const GridIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
