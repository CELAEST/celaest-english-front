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

export type SidenavEvolutionTierId =
  | "tier_1_cupertino"
  | "tier_2_linear"
  | "tier_3_raycast"
  | "tier_4_vision_spatial"
  | "tier_5_haute_chrono"
  | "tier_6_quantum_sovereign";

interface SidenavTierMeta {
  id: SidenavEvolutionTierId;
  level: number;
  title: string;
  codename: string;
  archetype: string;
  tagline: string;
  evolutionSummary: string;
  whatItAddsOverPrevious: string;
  accent: string;
  keyFeatures: string[];
}

const EVOLUTION_TIERS: SidenavTierMeta[] = [
  {
    id: "tier_1_cupertino",
    level: 1,
    title: "Cupertino Monolith",
    codename: "macOS Sequoia Frosted Glass",
    archetype: "Elegancia Silenciosa · Cero Distracción",
    tagline: "El punto de partida del lujo: vidrio esmerilado puro, tipografía flotante y cero cajas.",
    evolutionSummary:
      "Elimina todo contenedor tosco. Vidrio líquido de 30px blur con borde sub-píxel de 0.5px. Cápsula activa con resplandor sutil y retrato ejecutivo con halo especular.",
    whatItAddsOverPrevious: "Línea base: erradica los marcos toscos, bordes de colores y barras blancas desconectadas.",
    accent: "#E2E8F0",
    keyFeatures: [
      "Vidrio esmerilado líquido 30px blur",
      "Cápsula activa translúcida con brillo interior",
      "Retrato ejecutivo con halo de 0.5px",
      "Tipografía suiza en Title Case con decodificación cinética",
    ],
  },
  {
    id: "tier_2_linear",
    level: 2,
    title: "Linear Hyper-Density",
    codename: "Silicon Valley Power Tool",
    archetype: "Densidad de Ingeniería · Atajos de Teclado",
    tagline: "Mayor densidad de información, atajos de teclado sutiles y carril de luz continuo.",
    evolutionSummary:
      "Sobre el Nivel 1, introduce ritmo tipográfico de alta ingeniería, atajos ⌘1-⌘5 grabados en micro-fuente y carril de luz vertical continuo integrado en el elemento activo.",
    whatItAddsOverPrevious:
      "+ Atajos de teclado ⌘1-⌘5, carril de luz vertical láser, lanzador de búsqueda ⌘K y micro-divisor gradiente.",
    accent: "#94A3B8",
    keyFeatures: [
      "Atajos de teclado grabados (⌘1 - ⌘5)",
      "Carril de luz láser vertical integrado de 2.5px",
      "Micro-lanzador rápido de comandos ⌘K",
      "Divisores sub-píxel con degradado a transparente",
    ],
  },
  {
    id: "tier_3_raycast",
    level: 3,
    title: "Raycast Acoustic Instrument",
    codename: "Voice-AI Telemetry Console",
    archetype: "Telemetría Sensorial · Ondas de Audio Vivas",
    tagline: "Ondas acústicas vivas que bailan en tiempo real junto al avatar y navegación sensible a la voz.",
    evolutionSummary:
      "Sobre el Nivel 2, añade telemetría acústica en vivo: filamentos de audio que laten a 48kHz cuando interactúas con Speaking o Interview, aura de respiración neural y micro-LED óptico de estado.",
    whatItAddsOverPrevious:
      "+ Filamentos de audio ecualizador vivos, micro-LED óptico en íconos activos y aura de respiración sónica.",
    accent: "#A27FF3",
    keyFeatures: [
      "3 filamentos acústicos flotantes de 48kHz en el avatar",
      "Micro-LED óptico esmeralda de conexión IA viva",
      "Aura sónica de respiración orgánica en el logo",
      "Micro-indicador de voz activa 'Voice Engine 48kHz'",
    ],
  },
  {
    id: "tier_4_vision_spatial",
    level: 4,
    title: "Vision OS Spatial Caustic",
    codename: "Apple Vision Pro Glass & Light",
    archetype: "Refracción de Luz 3D · Cáusticas Giratorias",
    tagline: "Bordes cáusticos iridiscentes que curvan la luz y anillo celestial rotativo en torno al avatar.",
    evolutionSummary:
      "Sobre el Nivel 3, introduce física óptica de luz espacial: un anillo de cáusticas de vidrio rotativas de 10s rodea al avatar y el elemento activo proyecta una luz volumétrica.",
    whatItAddsOverPrevious:
      "+ Anillo cáustico de vidrio rotativo en 3D, micro-halo de dispersión cromática y respiración de tracking.",
    accent: "#38BDF8",
    keyFeatures: [
      "Anillo rotativo de luz especular y cáusticas de vidrio",
      "Luz volumétrica translúcida en la herramienta activa",
      "Respiración de espaciado óptico en el nombre del usuario",
      "Efecto de cristal polarizado multicapa",
    ],
  },
  {
    id: "tier_5_haute_chrono",
    level: 5,
    title: "Haute Horlogerie Chrono",
    codename: "Swiss Mechanical Complication",
    archetype: "Relojería Suiza de Alta Gama · Precisión Mecánica",
    tagline: "Complicación de cronógrafo de aprendizaje diario con arco radial de momentum y bisel de titanio.",
    evolutionSummary:
      "Sobre el Nivel 4, fusiona el cristal digital con la alta relojería suiza: integra un cronógrafo radial de 360° que mide el momentum del día (65% XP), bisel de titanio pulido y tipografía mecánica.",
    whatItAddsOverPrevious:
      "+ Complicación de cronógrafo radial matemático de progreso, bisel de titanio y dial de momentum XP.",
    accent: "#34D399",
    keyFeatures: [
      "Complicación de cronómetro radial SVG integrada en el avatar",
      "Medidor de momentum diario (65% XP completado)",
      "Acabado de titanio pulido y cristal zafiro antirreflejos",
      "Decodificación cinética con física de split-flap suizo",
    ],
  },
  {
    id: "tier_6_quantum_sovereign",
    level: 6,
    title: "The Quantum Sovereign",
    codename: "CELAEST Apex Masterpiece",
    archetype: "Física Cuántica · Gravedad IA · Obra Maestra Suprema",
    tagline: "El pináculo absoluto: constelación de partículas cuánticas en órbita, inteligencia predictiva y gravedad pura.",
    evolutionSummary:
      "La culminación de todas las evoluciones anteriores: partículas cuánticas orbitan el emblema y el perfil con física de gravedad magnética, filamentos acústicos, cronómetro radial y recomendación inteligente de próximo módulo.",
    whatItAddsOverPrevious:
      "+ Constelación de partículas cuánticas en órbita gravitatoria, recomendación predictiva y síntesis total.",
    accent: "#F43F5E",
    keyFeatures: [
      "3 micro-partículas cuánticas orbitando con gravedad magnética",
      "Recomendación predictiva de IA ('Siguiente: Interview Sparring')",
      "Fusión total: Filamentos acústicos + Cronógrafo + Vidrio cáustico",
      "Máximo nivel de lujo y refinamiento arquitectónico CELAEST",
    ],
  },
];

const CELAEST_LOGO_VIEWBOX = { width: 380, height: 503 };
const CELAEST_LOGO_PATH_D =
  "M374.479 1.73333C374.479 4.53333 362.346 27.7333 355.813 37.3333C340.079 60.8 316.213 85.6 292.746 103.067C272.879 117.867 264.879 122.8 227.413 142.933C209.813 152.4 192.746 161.867 189.413 164.267C170.213 177.2 157.279 190.533 149.813 205.333L146.079 212.667L144.479 201.867C142.079 185.333 135.946 168.4 129.013 158.4C125.813 154 125.813 153.333 128.879 153.333C133.679 153.333 145.279 146.267 151.013 139.867C156.746 133.6 162.479 121.467 162.479 116C162.479 113.867 161.679 114 155.813 118C146.079 124.533 136.879 127.333 125.146 127.2C116.879 127.2 113.013 126.267 102.479 122.133C73.4127 110.533 61.0127 110.533 44.346 122C37.946 126.4 36.6127 126.8 26.346 127.067C17.4127 127.333 13.546 128.133 7.54603 130.933C-0.853972 134.8 -2.32064 137.333 3.54603 137.333C14.8794 137.333 37.4127 150.133 46.746 161.867C53.8127 170.667 59.4127 182.533 61.8127 194.133C64.346 206.267 64.346 229.867 61.6794 251.333C58.746 274 58.746 305.067 61.6794 320.667C66.0794 344.533 75.146 366.667 88.746 386.933C95.546 396.933 111.013 414.267 117.146 418.667L120.879 421.333L117.413 411.6C114.479 403.467 113.946 399.333 113.546 384L113.146 366L117.013 380.667C126.746 418.133 140.213 440.4 163.279 456.8C171.013 462.4 184.346 469.067 191.813 471.333C194.746 472.133 194.479 471.6 189.679 466.533C179.413 455.733 168.879 436.667 162.613 417.6C156.213 398.267 156.613 397.333 165.146 412.667C176.879 433.6 186.613 446.8 201.146 461.333C228.479 488.8 255.546 500.8 293.146 502.133L311.146 502.8L300.346 496.933C271.813 481.333 243.946 457.867 223.946 432.667C211.279 416.8 211.679 415.6 225.279 428.8C243.946 446.8 255.946 454 272.746 457.067L279.813 458.267L271.679 449.733C267.279 444.933 262.479 438.533 260.879 435.467C258.613 430.667 257.146 429.467 251.279 427.467C235.146 421.867 216.479 407.6 204.346 391.6C193.546 377.333 182.479 351.2 182.479 340C182.479 336.8 183.279 336.267 195.413 332.933C225.146 324.533 252.746 308.533 274.879 286.667C281.946 279.6 287.813 273.2 287.813 272.4C287.813 271.467 284.879 271.867 279.946 273.333C270.213 276.4 254.213 278.667 243.413 278.533L235.146 278.4L245.813 274.8C262.213 269.067 284.746 258.533 295.146 251.867C312.879 240.4 327.679 224.267 336.346 207.067C341.546 196.533 341.013 195.2 333.279 200.667C319.413 210.667 292.746 220.533 273.279 223.067C268.213 223.733 269.546 222.667 284.613 215.333C337.679 189.333 366.213 156.933 371.146 116.933L372.079 109.2L357.679 123.733C341.146 140.267 323.946 152.267 302.479 162.533C282.346 172 280.213 172 293.813 162.667C335.679 133.867 364.746 98.4 375.279 63.3333C378.346 52.8 378.879 48.9333 379.013 32C379.146 12 377.946 -7.91252e-06 375.679 -7.91252e-06C375.013 -7.91252e-06 374.479 0.799992 374.479 1.73333Z";

export const SidenavEvolutionMatrixShowcase: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<SidenavEvolutionTierId>("tier_3_raycast");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState("interview");
  const [userName, setUserName] = useState("Esteban Perez");
  const [userLevel, setUserLevel] = useState("A1 Elementary");
  const [backdropTheme, setBackdropTheme] = useState<"workspace" | "studio" | "obsidian">("workspace");
  const [kineticTrigger, setKineticTrigger] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);

  const activeTierMeta = useMemo(
    () => EVOLUTION_TIERS.find((t) => t.id === selectedTier) || EVOLUTION_TIERS[2],
    [selectedTier],
  );

  const handleApplyToLiveApp = (tier: SidenavTierMeta) => {
    setSelectedTier(tier.id);
    if (typeof window !== "undefined") {
      let mappedVariantKey = "atelier_minimalist";
      if (tier.id === "tier_1_cupertino") mappedVariantKey = "atelier_minimalist";
      if (tier.id === "tier_2_linear") mappedVariantKey = "precision_chrono";
      if (tier.id === "tier_3_raycast") mappedVariantKey = "acoustic_resonance";
      if (tier.id === "tier_4_vision_spatial") mappedVariantKey = "specular_glass";
      if (tier.id === "tier_5_haute_chrono") mappedVariantKey = "precision_chrono";
      if (tier.id === "tier_6_quantum_sovereign") mappedVariantKey = "acoustic_resonance";

      localStorage.setItem("celaest_sidenav_variant", mappedVariantKey);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: mappedVariantKey }));
      setNotification(`¡Nivel ${tier.level} (${tier.title}) activado en el Sidenav real de toda la plataforma!`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const navSampleItems = [
    { id: "workspace", label: "Workspace", shortcut: "⌘1", icon: <GridIcon /> },
    { id: "memory", label: "Memory", shortcut: "⌘2", icon: <CognitiveMemoryBrainIcon className="w-[18px] h-[18px]" />, hasDot: true },
    { id: "interview", label: "Interview", shortcut: "⌘3", icon: <StudioVoiceMicIcon className="w-[18px] h-[18px]" />, hasTelemetry: true },
    { id: "reading", label: "Reading", shortcut: "⌘4", icon: <PrecisionOpenBookIcon className="w-[18px] h-[18px]" /> },
    { id: "writing", label: "Writing", shortcut: "⌘5", icon: <TechnicalWritingQuillIcon className="w-[18px] h-[18px]" /> },
    { id: "lab", label: "Design Lab", shortcut: "⌘L", icon: <QuantumNeuralGaugeIcon className="w-[18px] h-[18px]" /> },
  ];

  return (
    <section className="w-full flex flex-col rounded-[32px] bg-[#020206] border border-white/[0.08] p-6 sm:p-10 space-y-10 shadow-[0_30px_100px_rgba(0,0,0,0.98)] select-none relative overflow-hidden">
      {/* Dynamic Ambient Backlight */}
      <div
        className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[180px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: activeTierMeta.accent }}
      />

      {/* Applied Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#090b16] border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-30"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{notification}</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400/80">
              Sincronizado al Sidenav en Vivo
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6 relative z-10">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#A27FF3] shadow-[0_0_15px_#A27FF3] animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Sidenav Architectural Evolution (6 Progressive Tiers)
            </h2>
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 font-mono">
              Tier 1 → Tier 6 Evolution
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl font-light leading-relaxed">
            Cada nivel supera y añade una dimensión visual, material y cinemática sobre el anterior:
            desde la pureza monolítica de Cupertino hasta la física de reloj de alta gama suizo y partículas cuánticas.
            <strong> Interactúa con ellos en vivo y activa cualquiera en el sidebar real de la plataforma.</strong>
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setKineticTrigger((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-200 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <svg className="w-3.5 h-3.5 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Replay Cinética</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              isExpanded
                ? "bg-[#A27FF3]/20 border-[#A27FF3]/60 text-white shadow-[0_0_20px_rgba(162,127,243,0.3)]"
                : "bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isExpanded ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-zinc-600"
              }`}
            />
            <span>{isExpanded ? "Estado: Expandido" : "Estado: Colapsado"}</span>
          </button>
        </div>
      </div>

      {/* 6-Level Progressive Evolution Ladder (Clickable Tiers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 relative z-10">
        {EVOLUTION_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTier(tier.id)}
              className={`flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? "bg-white/[0.08] border border-white/30 shadow-[0_12px_40px_rgba(0,0,0,0.9)] scale-[1.02]"
                  : "bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Nivel 0{tier.level}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </div>

              <h4 className={`text-xs font-semibold tracking-wide w-full leading-snug ${
                isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
              }`}>
                {tier.title}
              </h4>

              <span className="text-[10px] text-zinc-400 font-mono mt-1 block truncate w-full">
                {tier.codename.split(" ")[0]}
              </span>

              <div className="mt-3 pt-2.5 border-t border-white/[0.06] w-full flex items-center justify-between text-[10px]">
                <span
                  className="font-mono font-medium transition-colors"
                  style={{ color: isSelected ? tier.accent : "#71717A" }}
                >
                  {isSelected ? "Inspeccionando" : "Ver Nivel →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Master Interactive Stage: Live Photorealistic Sidenav vs Evolutionary Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left: 1:1 Live Interactive Sidenav Render in Real App Context (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#010103] border border-white/[0.08] rounded-[28px] relative overflow-hidden min-h-[580px]">
          {/* Backdrop Switcher Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] relative z-20">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 font-mono">Entorno:</span>
              <div className="inline-flex rounded-xl bg-white/[0.04] p-0.5 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setBackdropTheme("workspace")}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    backdropTheme === "workspace" ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Workspace Room
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropTheme("studio")}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    backdropTheme === "studio" ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Acoustic Studio
                </button>
                <button
                  type="button"
                  onClick={() => setBackdropTheme("obsidian")}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    backdropTheme === "obsidian" ? "bg-white/15 text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Obsidian Void
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 border border-white/10">
                Nivel {activeTierMeta.level}: {activeTierMeta.title}
              </span>
            </div>
          </div>

          {/* Context Photographic Backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {backdropTheme === "workspace" && (
              <img
                src="/assets/workspace_room_bg.png"
                alt="Workspace Backdrop"
                className="w-full h-full object-cover opacity-25 filter blur-[2px]"
              />
            )}
            {backdropTheme === "studio" && (
              <img
                src="/assets/speaking_studio_headphones_mic.jpg"
                alt="Studio Backdrop"
                className="w-full h-full object-cover opacity-20 filter blur-[3px]"
              />
            )}
            {backdropTheme === "obsidian" && <div className="w-full h-full bg-[#020205]" />}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          {/* Sidenav Dynamic Model Mounted */}
          <div className="relative z-10 my-auto flex items-center justify-start pl-4 sm:pl-8 py-4">
            <aside
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
              className={`flex flex-col justify-between backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none h-[490px] relative z-20 ${
                isExpanded ? "w-60 px-3.5" : "w-16 px-2"
              } ${
                // Tier specific material classes
                selectedTier === "tier_1_cupertino"
                  ? "bg-[#06070d]/85 border border-white/[0.08] rounded-[28px] py-4 shadow-[0_24px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : selectedTier === "tier_2_linear"
                  ? "bg-[#080911]/90 border border-white/[0.12] rounded-[24px] py-3.5 shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
                  : selectedTier === "tier_3_raycast"
                  ? "bg-[#05060e]/92 border border-[#A27FF3]/30 rounded-[30px] py-4 shadow-[0_25px_85px_rgba(0,0,0,0.98),0_0_20px_rgba(162,127,243,0.15)]"
                  : selectedTier === "tier_4_vision_spatial"
                  ? "bg-white/[0.04] border border-white/20 rounded-[32px] py-4 shadow-[0_30px_90px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.25)]"
                  : selectedTier === "tier_5_haute_chrono"
                  ? "bg-[#040508]/95 border border-[#34D399]/30 rounded-[26px] py-4 shadow-[0_25px_80px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(52,211,153,0.2)]"
                  : "bg-[#030308]/98 border border-[#F43F5E]/30 rounded-[34px] py-4 shadow-[0_30px_100px_rgba(0,0,0,0.98),0_0_25px_rgba(244,63,94,0.18)]"
              }`}
            >
              {/* Top Brand Monolith */}
              <div className="flex flex-col items-center w-full space-y-3">
                <div className="w-full flex items-center justify-center relative">
                  {/* Tier 6 Orbiting Quantum Micro-Particles around Logo */}
                  {selectedTier === "tier_6_quantum_sovereign" && (
                    <div className="absolute w-12 h-12 pointer-events-none">
                      <span className="absolute w-1.5 h-1.5 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E] animate-[spin_4s_linear_infinite] -top-1 left-2" />
                      <span className="absolute w-1 h-1 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8] animate-[spin_6s_linear_infinite_reverse] -bottom-1 right-2" />
                    </div>
                  )}

                  <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-b from-white/[0.09] to-white/[0.02] border border-white/[0.14] text-white shadow-[0_4px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 cursor-pointer p-2 group/logo">
                    <svg
                      viewBox={`0 0 ${CELAEST_LOGO_VIEWBOX.width} ${CELAEST_LOGO_VIEWBOX.height}`}
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                    >
                      <path d={CELAEST_LOGO_PATH_D} fill="currentColor" />
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col items-start ml-3">
                      <span className="text-[13px] font-semibold text-white tracking-[0.24em] whitespace-nowrap uppercase font-sans">
                        CELAEST
                      </span>
                      {selectedTier === "tier_2_linear" && (
                        <span className="text-[9px] font-mono text-zinc-500">v2.4 PRO</span>
                      )}
                      {selectedTier === "tier_3_raycast" && (
                        <span className="text-[9px] font-mono text-[#A27FF3] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-pulse" />
                          48kHz Synced
                        </span>
                      )}
                      {selectedTier === "tier_6_quantum_sovereign" && (
                        <span className="text-[9px] font-mono text-[#F43F5E]">Quantum AI Core</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Sub-pixel Gradient Separator */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-0.5" />

                {/* Navigation Items Stack */}
                <nav className="flex flex-col w-full space-y-1.5">
                  {navSampleItems.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveNav(item.id)}
                        className={`relative flex items-center w-full py-2 rounded-xl transition-all duration-200 group/btn cursor-pointer ${
                          isExpanded ? "px-3 justify-start" : "justify-center"
                        } ${
                          isActive
                            ? "bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent text-white border border-white/[0.14] shadow-[0_2px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]"
                            : "text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                        }`}
                      >
                        {/* Integrated Laser Hairline on Active */}
                        {isActive && (
                          <div
                            className="absolute left-1.5 w-[2.5px] h-4 rounded-full shadow-[0_0_8px_currentColor]"
                            style={{
                              backgroundColor: activeTierMeta.accent,
                              color: activeTierMeta.accent,
                            }}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover/btn:scale-105 ${
                            isActive ? "text-white filter drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" : "text-inherit"
                          }`}
                        >
                          {item.icon}
                        </div>

                        {/* Label */}
                        {isExpanded && (
                          <span
                            className={`ml-3 text-[13px] tracking-wide whitespace-nowrap transition-colors ${
                              isActive ? "text-white font-medium" : "text-zinc-400 group-hover/btn:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                        )}

                        {/* Live Telemetry / Audio Waves in Tier 3 & Tier 6 */}
                        {isExpanded &&
                          (selectedTier === "tier_3_raycast" || selectedTier === "tier_6_quantum_sovereign") &&
                          item.hasTelemetry && (
                            <div className="ml-auto flex items-center gap-0.5">
                              <span className="w-0.5 h-2 bg-[#A27FF3] rounded-full animate-[pulse_0.7s_infinite]" />
                              <span className="w-0.5 h-3 bg-white rounded-full animate-[pulse_1.1s_infinite_0.2s]" />
                              <span className="w-0.5 h-1.5 bg-[#38BDF8] rounded-full animate-[pulse_0.9s_infinite_0.4s]" />
                            </div>
                          )}

                        {/* Tier 2 & 5: Keyboard Shortcut Engraved */}
                        {isExpanded &&
                          (selectedTier === "tier_2_linear" || selectedTier === "tier_5_haute_chrono") &&
                          !item.hasTelemetry && (
                            <span className="ml-auto text-[10px] font-mono text-zinc-600 group-hover/btn:text-zinc-400 transition-colors">
                              {item.shortcut}
                            </span>
                          )}

                        {/* Notification Dot (Memory) */}
                        {item.hasDot && (
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_8px_#A27FF3] ${
                              isExpanded ? "ml-auto mr-1" : "absolute top-2 right-2"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* DYNAMIC EVOLUTIONARY PROFILE FOOTER */}
              <div className="flex flex-col items-center w-full space-y-1.5 mt-auto pt-2">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent my-0.5" />

                {/* Profile Container: Pure Floating, Zero Box Standard */}
                <div
                  className={`relative w-full transition-all duration-300 cursor-pointer group/prof bg-transparent border-0 select-none ${
                    isExpanded ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
                  }`}
                >
                  <div className="flex items-center w-full">
                    {/* Avatar Element dynamically tailored to Tier */}
                    <div className="relative flex items-center justify-center shrink-0">
                      {/* Tier 4: Rotating Specular Ring */}
                      {selectedTier === "tier_4_vision_spatial" && (
                        <div className="absolute -inset-1 rounded-full border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.3)] animate-[spin_10s_linear_infinite]" />
                      )}

                      {/* Tier 5 & 6: Radial Learning Momentum Chrono Arc */}
                      {(selectedTier === "tier_5_haute_chrono" || selectedTier === "tier_6_quantum_sovereign") && (
                        <svg className="w-9 h-9 -rotate-90 absolute pointer-events-none" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="1.5" />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke={activeTierMeta.accent}
                            strokeWidth="1.5"
                            strokeDasharray="100"
                            strokeDashoffset="35"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}

                      {/* Real Executive Portrait */}
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                        <img
                          src="/assets/avatar_executive_luxury.jpg"
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
                      </div>

                      {/* Tier 3 & 6: Living Audio Filaments floating next to avatar */}
                      {(selectedTier === "tier_3_raycast" || selectedTier === "tier_6_quantum_sovereign") && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                          <span className="w-[1.5px] h-2 bg-[#A27FF3] rounded-full animate-pulse" />
                          <span className="w-[1.5px] h-3.5 bg-white rounded-full animate-[pulse_1s_infinite_0.2s]" />
                          <span className="w-[1.5px] h-1.5 bg-[#38BDF8] rounded-full animate-[pulse_0.8s_infinite_0.4s]" />
                        </div>
                      )}
                    </div>

                    {/* Expanded Profile Info with Kinetic Typography */}
                    {isExpanded && (
                      <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left">
                        <KineticLuxuryText
                          text={userName}
                          trigger={isExpanded || kineticTrigger}
                          className="text-[13px] font-medium text-white tracking-tight truncate leading-tight group-hover/prof:text-zinc-100"
                        />
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                          <span className="text-[10.5px] text-zinc-400 font-sans tracking-wide truncate">
                            {userLevel}
                            {selectedTier === "tier_5_haute_chrono" && " · 65% XP"}
                            {selectedTier === "tier_3_raycast" && " · 48kHz"}
                            {selectedTier === "tier_6_quantum_sovereign" && " · Sovereign"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logout Action */}
                <div
                  className={`flex items-center w-full py-1.5 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer group/logout ${
                    isExpanded ? "px-3 justify-start" : "justify-center"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {isExpanded && (
                    <span className="ml-3 text-xs font-normal tracking-wide text-inherit">
                      Cerrar Sesión
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Right: Evolutionary Breakdown & What this Tier Adds Over the Previous (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#04040a] border border-white/[0.08] rounded-[28px] relative">
          <div className="flex flex-col space-y-5">
            {/* Tier Identity Badge */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  Nivel de Evolución 0{activeTierMeta.level} / 06
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono font-medium"
                  style={{
                    backgroundColor: `${activeTierMeta.accent}15`,
                    color: activeTierMeta.accent,
                    borderColor: `${activeTierMeta.accent}30`,
                    borderWidth: 1,
                  }}
                >
                  {activeTierMeta.codename}
                </span>
              </div>
              <h3 className="text-xl font-medium text-white tracking-tight">
                {activeTierMeta.title}
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {activeTierMeta.evolutionSummary}
              </p>
            </div>

            {/* WHAT THIS TIER ADDS OVER THE PREVIOUS */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
                ¿Qué mejora sobre el nivel anterior?
              </span>
              <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                {activeTierMeta.whatItAddsOverPrevious}
              </p>
            </div>

            {/* Key Features List */}
            <div className="flex flex-col space-y-2 text-xs text-zinc-400">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                Puntos Clave de Manufactura:
              </span>
              {activeTierMeta.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTierMeta.accent }} />
                  <span className="text-zinc-300">{feat}</span>
                </div>
              ))}
            </div>

            {/* Live Name Input to test Kinetic Scrambler */}
            <div className="flex flex-col space-y-2 p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Audicionar tu Nombre en este Nivel
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#A27FF3]"
                />
                <input
                  type="text"
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  className="w-28 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#A27FF3]"
                />
              </div>
            </div>
          </div>

          {/* Master One-Click Application Button */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleApplyToLiveApp(activeTierMeta)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-semibold text-xs tracking-wide hover:bg-zinc-200 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
            >
              <span>Activar Nivel {activeTierMeta.level} ({activeTierMeta.title}) en Sidenav Real</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="text-[10px] text-center text-zinc-500 font-mono">
              Sincroniza en tiempo real el sidebar izquierdo de la aplicación
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Progressive Evolution Gallery (All 6 Tiers Rendered Together) */}
      <div className="flex flex-col space-y-4 pt-4 border-t border-white/[0.06] relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white tracking-wide">
            Matriz de Evolución Simultánea (6 Niveles Comparados)
          </h4>
          <span className="text-xs text-zinc-500 font-mono">Haz clic en cualquiera para audicionarlo o activarlo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
          {EVOLUTION_TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => handleApplyToLiveApp(tier)}
                className={`flex flex-col justify-between p-3.5 rounded-2xl transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "bg-[#0a0c18] border border-white/40 shadow-[0_0_25px_rgba(255,255,255,0.15)] scale-[1.02]"
                    : "bg-[#040409] border border-white/[0.06] hover:border-white/20 hover:bg-[#070712]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-zinc-400">Nivel 0{tier.level}</span>
                  {isSelected ? (
                    <span className="text-[8.5px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                      Activo
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-mono text-zinc-600 group-hover/card:text-zinc-400">
                      Elegir
                    </span>
                  )}
                </div>

                {/* Simulated Micro Sidenav Model */}
                <div className="py-2.5 px-2 rounded-xl bg-black/50 border border-white/[0.04] flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">C</span>
                    </div>
                    <span className="text-[10px] font-bold text-white tracking-wider">CELAEST</span>
                  </div>

                  <div className="w-full h-px bg-white/10" />

                  <div className="flex flex-col space-y-1">
                    <div className="w-full py-1 px-1.5 rounded-md bg-white/15 text-[9px] text-white flex items-center justify-between">
                      <span>Interview</span>
                      {tier.level >= 3 && <span className="w-1 h-1 rounded-full bg-[#A27FF3]" />}
                    </div>
                    <div className="w-full py-0.5 px-1.5 text-[9px] text-zinc-500">Reading</div>
                  </div>

                  <div className="w-full h-px bg-white/10 mt-1" />

                  {/* Profile Simulation */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
                      <img src="/assets/avatar_executive_luxury.jpg" alt="A" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="text-[9px] font-medium text-white truncate">{userName.split(" ")[0]}</span>
                      <span className="text-[7.5px] text-zinc-500 truncate">{tier.archetype.split("·")[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.04]">
                  <span className="text-[9px] font-mono block truncate" style={{ color: tier.accent }}>
                    {tier.codename}
                  </span>
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
