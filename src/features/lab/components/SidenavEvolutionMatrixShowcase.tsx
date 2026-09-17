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

export type SidenavArchetypeId =
  | "dock_kinetic"
  | "dual_rail"
  | "orbit_pebbles"
  | "studio_cockpit"
  | "swiss_editorial"
  | "bento_modular";

interface ArchetypeMeta {
  id: SidenavArchetypeId;
  index: string;
  name: string;
  subtitle: string;
  silhouette: string;
  inspiration: string;
  description: string;
  accent: string;
  highlights: string[];
}

const ARCHETYPES: ArchetypeMeta[] = [
  {
    id: "dock_kinetic",
    index: "01",
    name: "The Floating Kinetic Dock",
    subtitle: "macOS Fluid Island · Magnificación Magnética",
    silhouette: "Cápsula Flotante con Física de Resortes",
    inspiration: "macOS Dock + Apple Dynamic Island + Raycast",
    description:
      "Una sola píldora de vidrio flotante que reacciona magnéticamente a la posición del cursor. Los iconos crecen con fluidez de 1.0x a 1.25x al pasar sobre ellos, con un fondo de luz líquida que se desliza suavemente detrás del elemento activo.",
    accent: "#38BDF8",
    highlights: [
      "Física de magnificación de iconos en hover (escala fluida)",
      "Cápsula de luz líquida que se desliza suavemente con resorte",
      "Isotipo ave en cápsula de cristal con halo respirable",
      "Perfil flotante con micro-menú contextual emergente",
    ],
  },
  {
    id: "dual_rail",
    index: "02",
    name: "The Linear Dual-Rail Split",
    subtitle: "Riel Doble · Drawer Deslizante de Inteligencia",
    silhouette: "Riel Estrecho (48px) + Panel Contextual (180px)",
    inspiration: "Linear App + Superhuman + Vercel Dashboard",
    description:
      "Arquitectura de riel dividido: una barra ultra-compacta de iconos con atajos rápidos y un cajón de cristal líquido que se desliza lateralmente para revelar detalles de nivel, sub-páginas y telemetría de aprendizaje.",
    accent: "#A27FF3",
    highlights: [
      "Separación estricta en 3 clusters: Core, Memoria y Sistema",
      "Láser de luz horizontal conectando la barra al espacio de trabajo",
      "Atajos grabados (⌘1–⌘5) en tipografía monospace ejecutiva",
      "Micro-cockpit inferior con medidor numérico de tiempo diario",
    ],
  },
  {
    id: "orbit_pebbles",
    index: "03",
    name: "The Radial Orbit Hub",
    subtitle: "Módulos Disconexos Flotantes · Cero Caja Continua",
    silhouette: "Islas Circulares Separadas en el Vacío",
    inspiration: "Cosmos Design + Apple Vision Pro Spatial",
    description:
      "Erradica por completo el concepto de 'caja vertical'. Cada herramienta es una piedra de cristal pulido ('pebble') flotando libremente en el vacío oscuro con su propia gravedad. Al pasar el cursor, un hilo de luz invisible las conecta.",
    accent: "#C084FC",
    highlights: [
      "Cero barra vertical: módulos circulares flotando independientemente",
      "Conexión de luz invisible que se ilumina con la estela del cursor",
      "Emblema superior dentro de una esfera de cristal líquido",
      "Avatar flotante con anillo orbital de frecuencia de audio",
    ],
  },
  {
    id: "studio_cockpit",
    index: "04",
    name: "The Studio Cockpit HUD",
    subtitle: "Hardware de Audio Táctil · Braun & Teenage Engineering",
    silhouette: "Consola de Hardware Industrial Oscuro",
    inspiration: "Teenage Engineering OP-1 + Braun Dieter Rams + SSL Studio",
    description:
      "Inspirado en consolas de hardware musical de alta fidelidad: interruptores táctiles con retroiluminación ámbar/esmeralda, medidor de volumen VU en tiempo real para el micrófono y selector de nivel como potenciómetro analógico.",
    accent: "#F59E0B",
    highlights: [
      "Medidor VU de decibeles de voz en tiempo real en la cabecera",
      "Botones táctiles con click mecánico y luz LED posterior",
      "Indicadores de estado hardware: 'LIVE', '48kHz', 'SYNC'",
      "Fader vertical de nivel CEFR integrado junto al avatar",
    ],
  },
  {
    id: "swiss_editorial",
    index: "05",
    name: "The Swiss Typographic Column",
    subtitle: "Editorial Suizo · Tipografía Numérica Pura",
    silhouette: "Columna Editorial con Retícula Arquitectónica",
    inspiration: "Massimo Vignelli + Josef Müller-Brockmann + Monocle Magazine",
    description:
      "Una obra maestra de diseño editorial suizo: prescinde de los iconos genéricos y utiliza índices numéricos matemáticos (01 / INTERVIEW, 02 / READING, 03 / WRITING). Una cruz de mira óptica (+) se alinea con precisión milimétrica al ítem activo.",
    accent: "#FFFFFF",
    highlights: [
      "Navegación tipográfica pura con índices numéricos suizos",
      "Mira óptica arquitectónica (+) que sigue al elemento activo",
      "Bisel de línea de corte de 0.5px inspirado en plano técnico",
      "Firma ejecutiva en Title Case con espaciado óptico milimétrico",
    ],
  },
  {
    id: "bento_modular",
    index: "06",
    name: "The Bento Morphing Island",
    subtitle: "3 Cardlets Modulares Independientes",
    silhouette: "Stack de 3 Módulos Bento Flotantes",
    inspiration: "Apple iOS Bento + Arc Browser Split + Vercel Cards",
    description:
      "En lugar de un monolito único, el Sidenav se divide en 3 bloques modulares ('cardlets') independientes: 1) Cardlet de Marca y Racha Diaria, 2) Cardlet de Navegación Core, y 3) Cardlet de Identidad Ejecutiva con recomendación de IA.",
    accent: "#34D399",
    highlights: [
      "3 bloques bento desacoplados con física de elevación independiente",
      "Bloque superior con contador de racha de días (🔥 4 días)",
      "Bloque central de navegación con pastilla deslizante",
      "Bloque inferior con tarjeta inteligente: 'Siguiente: 10 min Speaking'",
    ],
  },
];

const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D =
  "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const SidenavEvolutionMatrixShowcase: React.FC = () => {
  const [selectedId, setSelectedId] = useState<SidenavArchetypeId>("dock_kinetic");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("interview");
  const [userName, setUserName] = useState("Esteban Perez");
  const [userLevel, setUserLevel] = useState("A1 Elementary");
  const [notification, setNotification] = useState<string | null>(null);
  const [kineticTrigger, setKineticTrigger] = useState(0);

  const activeArchetype: ArchetypeMeta = useMemo(
    () => ARCHETYPES.find((a) => a.id === selectedId) || ARCHETYPES[0],
    [selectedId],
  );

  const handleApplyToLiveSidebar = (archetype: ArchetypeMeta) => {
    setSelectedId(archetype.id);
    if (typeof window !== "undefined") {
      let mappedVariant = "atelier_minimalist";
      if (archetype.id === "dock_kinetic") mappedVariant = "atelier_minimalist";
      if (archetype.id === "dual_rail") mappedVariant = "precision_chrono";
      if (archetype.id === "orbit_pebbles") mappedVariant = "specular_glass";
      if (archetype.id === "studio_cockpit") mappedVariant = "acoustic_resonance";
      if (archetype.id === "swiss_editorial") mappedVariant = "atelier_minimalist";
      if (archetype.id === "bento_modular") mappedVariant = "precision_chrono";

      localStorage.setItem("celaest_sidenav_variant", mappedVariant);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: mappedVariant }));
      setNotification(`¡Paradigma "${archetype.name}" activado en el Sidenav real!`);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const navItems = [
    { id: "workspace", num: "01", label: "Workspace", shortcut: "⌘1", icon: <GridIcon /> },
    { id: "memory", num: "02", label: "Memory Vault", shortcut: "⌘2", icon: <CognitiveMemoryBrainIcon className="w-4 h-4" />, hasDot: true },
    { id: "interview", num: "03", label: "Interview", shortcut: "⌘3", icon: <StudioVoiceMicIcon className="w-4 h-4" /> },
    { id: "reading", num: "04", label: "Reading", shortcut: "⌘4", icon: <PrecisionOpenBookIcon className="w-4 h-4" /> },
    { id: "writing", num: "05", label: "Writing Studio", shortcut: "⌘5", icon: <TechnicalWritingQuillIcon className="w-4 h-4" /> },
    { id: "lab", num: "06", label: "Design Lab", shortcut: "⌘L", icon: <QuantumNeuralGaugeIcon className="w-4 h-4" /> },
  ];

  return (
    <section className="relative p-6 sm:p-10 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-10 select-none overflow-hidden">
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

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6 z-10">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Innovation Matrix
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-white/60 border border-white/[0.08]">
              6 Radically Different Paradigms
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Sidenav Architectural Paradigms & Creative Explorations
          </h2>
          <p className="text-xs sm:text-sm font-light text-white/40 max-w-3xl leading-relaxed">
            Seis conceptos estructuralmente distintos para explorar, comparar y extraer ideas: desde la fluidez
            magnética del Dock de macOS y rieles divididos tipo Linear, hasta consolas de hardware musical táctil,
            diseño editorial suizo con retículas matemáticas y bloques bento desacoplados.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setKineticTrigger((p) => p + 1)}
            className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Replay Kinetic Typography"
            aria-label="Replay kinetic typography"
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
            {isExpanded ? "Vista: Expandida" : "Vista: Compacta"}
          </button>
        </div>
      </div>

      {/* 6 Radical Paradigms Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 z-10">
        {ARCHETYPES.map((archetype) => {
          const isSelected = selectedId === archetype.id;
          return (
            <button
              key={archetype.id}
              type="button"
              onClick={() => setSelectedId(archetype.id)}
              className={`flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? "bg-[#080914] border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] scale-[1.01]"
                  : "bg-white/[0.015] border border-white/[0.05] hover:border-white/12 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                  Concept {archetype.index}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                )}
              </div>

              <h4 className={`text-xs font-medium tracking-wide w-full leading-snug ${
                isSelected ? "text-white" : "text-white/70 group-hover:text-white"
              }`}>
                {archetype.name}
              </h4>

              <span className="text-[10px] font-mono text-white/30 mt-1 line-clamp-1">
                {archetype.silhouette}
              </span>

              <div className="mt-3 pt-2.5 border-t border-white/[0.04] w-full flex items-center justify-between text-[10px]">
                <span className="font-mono text-white/30">{archetype.inspiration.split(" ")[0]}</span>
                <span className={`font-mono transition-colors ${isSelected ? "text-emerald-400" : "text-white/40"}`}>
                  {isSelected ? "Activo" : "Explorar →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Render the Selected Radical Archetype at 1:1 Scale */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">
        {/* Left: Rendered Sidenav Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative overflow-hidden min-h-[580px] justify-center items-center">
          {/* Top Label */}
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between pb-3 border-b border-white/[0.05] z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
              Archetype {activeArchetype.index}: {activeArchetype.name}
            </span>
            <span className="text-[10px] font-mono text-white/30">
              {activeArchetype.silhouette}
            </span>
          </div>

          {/* ========================================================================= */}
          {/* ARCHETYPE 1: THE MACOS KINETIC DOCK */}
          {/* ========================================================================= */}
          {selectedId === "dock_kinetic" && (
            <div className="my-auto py-8">
              <aside
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
                className={`flex flex-col justify-between bg-[#04040A]/95 border border-white/[0.09] rounded-[36px] py-4 px-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-3xl transition-all duration-300 ease-out select-none h-[470px] relative ${
                  isExpanded ? "w-60 px-4" : "w-16"
                }`}
              >
                {/* Top Logo Capsule */}
                <div className="w-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white flex items-center justify-center shrink-0 shadow-inner p-2 cursor-pointer hover:scale-105 transition-transform">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <span className="ml-3 text-[13px] font-light text-white tracking-[0.24em] uppercase font-sans whitespace-nowrap">
                      CELAEST
                    </span>
                  )}
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent my-1" />

                {/* Fluid Spring Items */}
                <nav className="flex flex-col w-full space-y-2">
                  {navItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`relative flex items-center w-full py-2.5 rounded-2xl transition-all duration-200 cursor-pointer group/dock ${
                          isExpanded ? "px-3 justify-start" : "justify-center"
                        } ${
                          isActive
                            ? "bg-white/[0.08] text-white border border-white/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] scale-[1.02]"
                            : "text-white/45 hover:text-white hover:bg-white/[0.03] hover:scale-105"
                        }`}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 shrink-0 transition-transform ${
                          isActive ? "text-white" : "text-inherit"
                        }`}>
                          {item.icon}
                        </div>
                        {isExpanded && (
                          <span className={`ml-3 text-xs font-light tracking-wide truncate ${isActive ? "text-white" : "text-white/60"}`}>
                            {item.label}
                          </span>
                        )}
                        {item.hasDot && (
                          <div className={`w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_6px_#A27FF3] ${isExpanded ? "ml-auto" : "absolute top-2 right-2"}`} />
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent my-1" />

                {/* Profile Floating Pill */}
                <div className="flex items-center w-full py-1.5 px-2 cursor-pointer hover:bg-white/[0.03] rounded-2xl transition-colors">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/15">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col ml-3 text-left overflow-hidden">
                      <KineticLuxuryText
                        text={userName}
                        trigger={isExpanded || kineticTrigger}
                        className="text-xs font-light text-white truncate"
                      />
                      <span className="text-[10px] font-mono text-emerald-400 mt-0.5">{userLevel}</span>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 2: THE LINEAR DUAL-RAIL SPLIT */}
          {/* ========================================================================= */}
          {selectedId === "dual_rail" && (
            <div className="my-auto py-8 flex items-stretch gap-2">
              {/* Primary 48px Narrow Rail */}
              <div className="w-14 bg-[#04040A] border border-white/[0.08] rounded-2xl py-3 px-1.5 flex flex-col justify-between items-center shadow-2xl">
                <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white p-1.5">
                  <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                    <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                  </svg>
                </div>

                <div className="flex flex-col space-y-2 w-full items-center">
                  {navItems.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        activeNav === item.id
                          ? "bg-white/10 text-white border border-white/15 shadow-md"
                          : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                      }`}
                    >
                      {item.icon}
                    </button>
                  ))}
                </div>

                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20">
                  <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Contextual Sliding Flyout Drawer (Reveals Sub-Intelligence) */}
              <div className="w-56 bg-[#060710]/95 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-2xl backdrop-blur-2xl">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Core Modules</span>
                    <span className="text-[9px] font-mono text-white/30">⌘K Jump</span>
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center justify-between w-full py-1.5 px-2.5 rounded-lg text-left transition-all ${
                          activeNav === item.id ? "bg-white/[0.08] text-white font-medium" : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-xs font-light">{item.label}</span>
                        <span className="text-[9px] font-mono text-white/30">{item.shortcut}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bottom Telemetry HUD */}
                <div className="pt-3 border-t border-white/[0.06] flex flex-col space-y-1">
                  <span className="text-[9px] font-mono text-white/30 uppercase">Today's Focus</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-light">18 / 20 min</span>
                    <span className="text-emerald-400 font-mono text-[10px]">90%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-[90%] h-full bg-emerald-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 3: THE RADIAL ORBIT HUB (PEBBLES IN VACUUM) */}
          {/* ========================================================================= */}
          {selectedId === "orbit_pebbles" && (
            <div className="my-auto py-8 flex flex-col items-center space-y-3">
              {/* Pebble 1: Logo Pebble */}
              <div className="w-12 h-12 rounded-full bg-[#04040A] border border-white/[0.09] flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-6 h-6">
                  <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                    <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                  </svg>
                </div>
              </div>

              {/* Pebble Cluster: Floating Nav Disconnected Bubbles */}
              <div className="flex flex-col space-y-2 py-2">
                {navItems.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer relative group/orb ${
                        isActive
                          ? "bg-white/15 text-white border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-110"
                          : "bg-[#04040A] text-white/40 border border-white/[0.06] hover:text-white hover:scale-105"
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                      {item.hasDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] absolute top-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Pebble 3: Avatar Floating Orb */}
              <div className="relative w-12 h-12 rounded-full bg-[#04040A] border border-white/[0.1] p-1 flex items-center justify-center shadow-xl hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black" />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 4: THE STUDIO COCKPIT HUD (BRAUN / TEENAGE ENGINEERING) */}
          {/* ========================================================================= */}
          {selectedId === "studio_cockpit" && (
            <div className="my-auto py-8">
              <aside className="w-64 bg-[#08090E] border border-white/[0.1] rounded-2xl p-4 flex flex-col justify-between shadow-2xl h-[480px]">
                {/* Top VU Meter & Hardware Header */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                      <span className="text-[11px] font-mono font-semibold tracking-wider text-white">CELAEST-01</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/40">48kHz / RAW</span>
                  </div>

                  {/* Hardware Graphic Equalizer VU Meter */}
                  <div className="w-full p-2 rounded-lg bg-black/60 border border-white/[0.04] flex items-center justify-between">
                    <span className="text-[8.5px] font-mono text-white/30">MIC LEVEL</span>
                    <div className="flex items-center gap-1">
                      {[6, 12, 18, 24, 14, 8, 4].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-amber-400/80 rounded-sm"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tactile Hardware Track Buttons */}
                  <nav className="flex flex-col space-y-1.5 pt-1">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-2 px-3 rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-white/[0.08] border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                              : "bg-black/30 border-white/[0.04] text-white/40 hover:text-white hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {item.icon}
                            <span className="text-xs font-mono">{item.label}</span>
                          </div>
                          <span className={`text-[9px] font-mono px-1 rounded ${isActive ? "bg-amber-500/20 text-amber-300" : "text-white/20"}`}>
                            {isActive ? "ACTIVE" : "STANDBY"}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Bottom Hardware Strip */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md overflow-hidden ring-1 ring-white/20">
                      <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-mono text-white leading-none">{userName}</span>
                      <span className="text-[9px] font-mono text-amber-400 mt-1">VOL: 85% · {userLevel}</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 5: THE SWISS TYPOGRAPHIC COLUMN */}
          {/* ========================================================================= */}
          {selectedId === "swiss_editorial" && (
            <div className="my-auto py-8">
              <aside className="w-60 bg-[#030306] border border-white/[0.07] rounded-none p-5 flex flex-col justify-between h-[480px] text-left relative font-sans">
                {/* Precision Architectural Header */}
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1 border-b border-white/[0.08] pb-3">
                    <span className="text-[9px] font-mono tracking-[0.3em] text-white/30 uppercase">
                      ARCHITECTURAL GRID / 01
                    </span>
                    <h1 className="text-base font-light tracking-[0.2em] text-white uppercase">
                      CELAEST
                    </h1>
                  </div>

                  {/* Numeral Typographic Index (Zero Icons) */}
                  <nav className="flex flex-col space-y-2.5 pt-2">
                    {navItems.map((item) => {
                      const isActive = activeNav === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveNav(item.id)}
                          className={`flex items-center justify-between w-full py-1 text-left transition-all cursor-pointer ${
                            isActive ? "text-white" : "text-white/35 hover:text-white/70"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-white/30">{item.num}</span>
                            <span className={`text-xs tracking-wider uppercase font-light ${isActive ? "underline decoration-white/40 underline-offset-4 font-normal" : ""}`}>
                              {item.label}
                            </span>
                          </div>
                          {isActive && <span className="text-xs font-mono text-white/50">+</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Swiss Editorial Footer */}
                <div className="pt-4 border-t border-white/[0.08] flex flex-col space-y-1">
                  <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
                    USER IDENTIFIER
                  </span>
                  <span className="text-xs font-light text-white tracking-wide">{userName}</span>
                  <span className="text-[10px] font-mono text-white/40">{userLevel} / VERIFIED</span>
                </div>
              </aside>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ARCHETYPE 6: THE BENTO MORPHING ISLAND */}
          {/* ========================================================================= */}
          {selectedId === "bento_modular" && (
            <div className="my-auto py-8 flex flex-col space-y-3 w-60">
              {/* Cardlet 1: Brand & Streak Momentum */}
              <div className="p-3.5 rounded-2xl bg-[#060710] border border-white/[0.08] flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] flex items-center justify-center text-white p-1">
                    <svg viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`} fill="none" className="w-full h-full text-white">
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white tracking-wider">CELAEST</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  🔥 4 Días
                </span>
              </div>

              {/* Cardlet 2: Core Navigation Pill Stack */}
              <div className="p-2.5 rounded-2xl bg-[#04040A] border border-white/[0.07] flex flex-col space-y-1 shadow-xl">
                {navItems.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNav(item.id)}
                      className={`flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-white/10 text-white font-medium border border-white/15 shadow-md"
                          : "text-white/45 hover:text-white hover:bg-white/[0.025]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span className="text-xs font-light">{item.label}</span>
                      </div>
                      {item.hasDot && <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Cardlet 3: Executive Profile with AI Recommendation */}
              <div className="p-3 rounded-2xl bg-[#060710] border border-white/[0.08] flex flex-col space-y-2 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                    <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-xs font-light text-white truncate">{userName}</span>
                    <span className="text-[10px] font-mono text-emerald-400">{userLevel}</span>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-white/50 flex items-center justify-between">
                  <span>Siguiente: 10m Interview</span>
                  <span className="text-emerald-400 font-mono">→</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Architecture Analysis & One-Click Live Activation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#020205] border border-white/[0.06] rounded-3xl relative">
          <div className="flex flex-col space-y-5">
            {/* Header */}
            <div className="flex flex-col space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                Paradigma {activeArchetype.index} de 06
              </span>
              <h3 className="text-xl font-light text-white tracking-tight">
                {activeArchetype.name}
              </h3>
              <p className="text-xs font-light text-white/40 leading-relaxed">
                {activeArchetype.description}
              </p>
            </div>

            {/* Inspiration & Silhouette */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Silueta:</span>
                <span className="text-white/70">{activeArchetype.silhouette}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40 uppercase">Referentes:</span>
                <span className="text-white/70">{activeArchetype.inspiration}</span>
              </div>
            </div>

            {/* Innovation Highlights */}
            <div className="flex flex-col space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Innovaciones Clave de este Paradigma:
              </span>
              {activeArchetype.highlights.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-1 h-1 rounded-full bg-white/50 mt-1.5 shrink-0" />
                  <span className="text-white/70 font-light leading-relaxed">{h}</span>
                </div>
              ))}
            </div>

            {/* Live Name Input */}
            <div className="flex flex-col space-y-2 p-3 rounded-2xl bg-black/40 border border-white/[0.05]">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                Personalizar Nombre
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

          {/* Master Live Activation Button */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleApplyToLiveSidebar(activeArchetype)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-medium text-xs tracking-wide hover:bg-white/90 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
            >
              <span>Activar Paradigma "{activeArchetype.name}" en Sidenav Real</span>
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

      {/* Side-by-Side Architectural Gallery (All 6 Paradigms Together) */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-white/[0.06] z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Galería Comparativa de Paradigmas (6 Diseños Radically Different)
          </span>
          <span className="text-[10px] font-mono text-white/30">Clic para cambiar de concepto</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {ARCHETYPES.map((a) => {
            const isSelected = selectedId === a.id;
            return (
              <div
                key={a.id}
                onClick={() => handleApplyToLiveSidebar(a)}
                className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "bg-[#060712] border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
                    : "bg-white/[0.015] border border-white/[0.05] hover:border-white/12 hover:bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-white/40">{a.index}</span>
                  {isSelected ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                      Activo
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-white/30 group-hover/card:text-white/60">
                      Ver
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-white line-clamp-1">{a.name}</span>
                <span className="text-[9px] font-mono text-white/30 line-clamp-1 mt-0.5">{a.silhouette}</span>

                <div className="mt-2.5 pt-1.5 border-t border-white/[0.03] text-[9.5px] font-mono text-white/30 truncate">
                  {a.inspiration.split("+")[0].trim()}
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
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
