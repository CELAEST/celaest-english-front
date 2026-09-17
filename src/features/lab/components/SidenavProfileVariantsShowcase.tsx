import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KineticLuxuryText } from "../../workspace/components/KineticLuxuryText";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
  TechnicalWritingQuillIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export type LuxurySidenavVariantId =
  | "atelier_minimalist"
  | "acoustic_resonance"
  | "specular_glass"
  | "precision_chrono";

interface LuxuryConceptMeta {
  id: LuxurySidenavVariantId;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  accent: string;
  highlight: string;
}

const LUXURY_CONCEPTS: LuxuryConceptMeta[] = [
  {
    id: "atelier_minimalist",
    title: "1. Atelier Swiss Minimalist",
    subtitle: "Pure Floating Portrait · Whisper Halo",
    tagline: "El pináculo de la elegancia silenciosa. Cero contenedores, cero marcos.",
    description:
      "Retrato ejecutivo de alta definición con un halo sub-píxel de 0.5px. El nombre se decodifica cinéticamente con tipografía limpia en Title Case (Esteban Pérez), acompañado de un micro-punto esmeralda que respira indicando conexión en tiempo real.",
    accent: "#FFFFFF",
    highlight: "Retrato ejecutivo puro con halo especular y tipografía flotante",
  },
  {
    id: "acoustic_resonance",
    title: "2. Acoustic AI Waveform",
    subtitle: "Voice-AI Filaments · 48kHz High-Fidelity",
    tagline: "Filamentos acústicos vivos que flotan en el vacío junto al avatar.",
    description:
      "Tres micro-filamentos sónicos de 1.5px flotan libremente a la derecha del avatar, pulsando de forma sutil a frecuencias acústicas reales de voz. Al posar el cursor, el nombre se decodifica cinéticamente y se revela el estado de alta fidelidad.",
    accent: "#A27FF3",
    highlight: "Filamentos acústicos de audio flotantes sin ningún contenedor",
  },
  {
    id: "specular_glass",
    title: "3. Specular Glass Ring",
    subtitle: "Apple Vision Pro OS · Anillo de Cáusticas",
    tagline: "Cáusticas de luz rotativas y refracción sobre fondo oscuro absoluto.",
    description:
      "Un micro-anillo de luz especular gira suavemente en torno al retrato con reflejos cáusticos de vidrio. El nombre experimenta la transición cinética de caracteres sin ninguna caja, integrándose orgánicamente en el cristal del Sidenav.",
    accent: "#38BDF8",
    highlight: "Anillo cáustico de vidrio espacial y decodificación fluida",
  },
  {
    id: "precision_chrono",
    title: "4. Precision Chrono Orbit",
    subtitle: "Linear Precision · Arco de Momentum XP",
    tagline: "Arco radial matemático de progreso diario con precisión de relojería.",
    description:
      "Un arco radial de 1.5px abraza el avatar marcando el progreso de aprendizaje (65% Momentum). La tipografía cinética revela el nombre del usuario con suavidad mecánica digna de un cronómetro de lujo suizo.",
    accent: "#34D399",
    highlight: "Arco de progreso radial sub-píxel con cinética suiza",
  },
];

type BackdropMode = "obsidian" | "workspace" | "studio";

export const SidenavProfileVariantsShowcase: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<LuxurySidenavVariantId>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("celaest_sidenav_variant") as LuxurySidenavVariantId;
      if (saved && LUXURY_CONCEPTS.some((c) => c.id === saved)) {
        return saved;
      }
    }
    return "atelier_minimalist";
  });

  const [isHovered, setIsHovered] = useState(true);
  const [userName, setUserName] = useState("Esteban Perez");
  const [userLevel, setUserLevel] = useState("A1 Elementary");
  const [backdrop, setBackdrop] = useState<BackdropMode>("workspace");
  const [kineticTrigger, setKineticTrigger] = useState(0);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const activeMeta = useMemo(
    () => LUXURY_CONCEPTS.find((c) => c.id === selectedConcept) || LUXURY_CONCEPTS[0],
    [selectedConcept],
  );

  const handleApply = (id: LuxurySidenavVariantId) => {
    setSelectedConcept(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("celaest_sidenav_variant", id);
      window.dispatchEvent(new CustomEvent("celaest:sidenav_variant_changed", { detail: id }));
      setAppliedNotification(`¡Concepto "${LUXURY_CONCEPTS.find((c) => c.id === id)?.title}" activado en el Sidenav real!`);
      setTimeout(() => setAppliedNotification(null), 3500);
    }
  };

  const triggerAnimationReplay = () => {
    setKineticTrigger((prev) => prev + 1);
  };

  return (
    <section className="w-full flex flex-col rounded-[32px] bg-[#030308] border border-white/[0.08] p-6 sm:p-10 space-y-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] select-none relative overflow-hidden">
      {/* Dynamic Ambient Glow */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: activeMeta.accent }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-15 transition-colors duration-700"
        style={{ background: activeMeta.accent }}
      />

      {/* Applied Toast */}
      <AnimatePresence>
        {appliedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#090b16] border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between shadow-[0_0_30px_rgba(16,185,129,0.25)] relative z-30"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{appliedNotification}</span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400/80">
              Sidenav En Vivo Actualizado
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Studio Description */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.06] pb-6 relative z-10">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Sidenav Ultra-Luxury Profile Studio
            </h2>
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 font-mono">
              Zero-Box · Kinetic Typography
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl font-light leading-relaxed">
            <strong>Cero cajas, cero marcos pesados, cero colores toscos.</strong> La animación cinética
            de decodificación de caracteres revela con suavidad el nombre del usuario en tipografía suiza limpia.
            Incluye fotografía ejecutiva real, micro-indicadores ópticos y sincronización instantánea con el Sidenav real.
          </p>
        </div>

        {/* Global Action Tools */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={triggerAnimationReplay}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 text-zinc-200 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
            title="Vuelve a reproducir la animación cinética en todos los nombres"
          >
            <svg className="w-3.5 h-3.5 text-[#A27FF3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Reproducir Cinética</span>
          </button>

          <button
            type="button"
            onClick={() => setIsHovered(!isHovered)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              isHovered
                ? "bg-[#A27FF3]/20 border-[#A27FF3]/60 text-white shadow-[0_0_20px_rgba(162,127,243,0.3)]"
                : "bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isHovered ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-zinc-600"
              }`}
            />
            <span>{isHovered ? "Sidebar: Expandido" : "Sidebar: Colapsado"}</span>
          </button>
        </div>
      </div>

      {/* Concept Selector Tabs (Minimalist Luxury Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {LUXURY_CONCEPTS.map((concept) => {
          const isSelected = selectedConcept === concept.id;
          return (
            <button
              key={concept.id}
              type="button"
              onClick={() => setSelectedConcept(concept.id)}
              className={`flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer relative group ${
                isSelected
                  ? "bg-white/[0.06] border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.8)] scale-[1.01]"
                  : "bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  {concept.subtitle.split("·")[0]}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                )}
              </div>

              <h4
                className={`text-sm font-semibold tracking-wide w-full ${
                  isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"
                }`}
              >
                {concept.title}
              </h4>

              <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 font-light leading-relaxed">
                {concept.highlight}
              </p>

              <div className="mt-4 pt-3 border-t border-white/[0.06] w-full flex items-center justify-between text-[11px]">
                <span className="text-zinc-500 font-mono">Cinética: Activa</span>
                <span
                  className="font-medium transition-colors"
                  style={{ color: isSelected ? "#34D399" : "#8A8B9E" }}
                >
                  {isSelected ? "Seleccionado" : "Audicionar →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage: Real Sidenav Simulated in Context with Images */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left: Real Simulated Sidenav Inside Photorealistic App Workspace (7 cols) */}
        <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 bg-[#010104] border border-white/[0.08] rounded-[28px] relative overflow-hidden min-h-[560px]">
          {/* Backdrop Environment Image Selector Bar */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.06] relative z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Ambiente de Previsualización:</span>
              <div className="inline-flex rounded-xl bg-white/[0.04] p-0.5 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setBackdrop("workspace")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    backdrop === "workspace"
                      ? "bg-white/15 text-white font-medium shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Executive Room
                </button>
                <button
                  type="button"
                  onClick={() => setBackdrop("studio")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    backdrop === "studio"
                      ? "bg-white/15 text-white font-medium shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Acoustic Studio
                </button>
                <button
                  type="button"
                  onClick={() => setBackdrop("obsidian")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${
                    backdrop === "obsidian"
                      ? "bg-white/15 text-white font-medium shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Obsidian Void
                </button>
              </div>
            </div>

            <span className="text-[11px] font-mono text-zinc-500">Live Render · 1:1 Scale</span>
          </div>

          {/* Context Background Backdrop */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {backdrop === "workspace" && (
              <img
                src="/assets/workspace_room_bg.png"
                alt="Workspace Room Backdrop"
                className="w-full h-full object-cover opacity-25 filter blur-[2px]"
              />
            )}
            {backdrop === "studio" && (
              <img
                src="/assets/speaking_studio_headphones_mic.jpg"
                alt="Speaking Studio Backdrop"
                className="w-full h-full object-cover opacity-20 filter blur-[3px]"
              />
            )}
            {backdrop === "obsidian" && (
              <div className="w-full h-full bg-[#020205]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Sidenav Interactive Dock */}
          <div className="relative z-10 my-auto flex items-center justify-start pl-4 sm:pl-8 py-6">
            <aside
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`flex flex-col justify-between bg-[#05060c]/95 border border-[#111220] rounded-[32px] py-4 px-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.98)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none h-[460px] relative z-20 ${
                isHovered ? "w-60 px-4" : "w-16"
              }`}
            >
              {/* Top Brand / Active Pill Header */}
              <div className="flex flex-col items-center w-full space-y-3.5">
                <div className="w-full flex items-center justify-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#080914] border border-[#231956] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(162,127,243,0.2)]">
                    <span className="text-xs font-bold tracking-widest text-[#A27FF3]">CEL</span>
                  </div>
                  {isHovered && (
                    <span className="ml-3.5 text-sm font-bold text-[#f8f8f8] tracking-[0.18em] uppercase whitespace-nowrap">
                      CELAEST
                    </span>
                  )}
                </div>

                <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

                {/* Sample Navigation Links */}
                <nav className="flex flex-col w-full space-y-2">
                  <div
                    className={`flex items-center w-full py-2.5 rounded-2xl bg-[#111220] text-white border border-[#281e66]/80 ${
                      isHovered ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <StudioVoiceMicIcon className="w-5 h-5 text-[#C4B5FD]" />
                    {isHovered && <span className="ml-3.5 text-sm font-medium">Interview</span>}
                  </div>
                  <div
                    className={`flex items-center w-full py-2.5 rounded-2xl text-zinc-400 hover:bg-[#111220]/60 transition-colors ${
                      isHovered ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <PrecisionOpenBookIcon className="w-5 h-5" />
                    {isHovered && <span className="ml-3.5 text-sm">Reading</span>}
                  </div>
                  <div
                    className={`flex items-center w-full py-2.5 rounded-2xl text-zinc-400 hover:bg-[#111220]/60 transition-colors ${
                      isHovered ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <CognitiveMemoryBrainIcon className="w-5 h-5" />
                    {isHovered && <span className="ml-3.5 text-sm">Memory</span>}
                  </div>
                  <div
                    className={`flex items-center w-full py-2.5 rounded-2xl text-zinc-400 hover:bg-[#111220]/60 transition-colors ${
                      isHovered ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <TechnicalWritingQuillIcon className="w-5 h-5" />
                    {isHovered && <span className="ml-3.5 text-sm">Writing</span>}
                  </div>
                </nav>
              </div>

              {/* DYNAMIC ZERO-BOX HYPER-LUXURY FOOTER */}
              <div className="flex flex-col items-center w-full space-y-2 mt-auto">
                <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

                {/* 1. ATELIER SWISS MINIMALIST (Pure Floating Portrait) */}
                {selectedConcept === "atelier_minimalist" && (
                  <div
                    className={`relative w-full transition-all duration-300 cursor-pointer group/atelier bg-transparent border-0 select-none ${
                      isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
                    }`}
                  >
                    <div className="flex items-center w-full justify-between">
                      <div className="flex items-center overflow-hidden">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                          <img
                            src="/assets/avatar_executive_luxury.jpg"
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#A27FF3]/20 to-transparent pointer-events-none mix-blend-overlay" />
                        </div>
                        {isHovered && (
                          <div className="flex flex-col items-start ml-3 overflow-hidden text-left">
                            <KineticLuxuryText
                              text={userName}
                              trigger={isHovered || kineticTrigger}
                              className="text-[13px] font-medium text-white tracking-tight truncate leading-tight group-hover/atelier:text-zinc-100"
                            />
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                              <span className="text-[10.5px] text-zinc-400 font-sans tracking-wide truncate">
                                {userLevel}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ACOUSTIC AI WAVEFORM (Floating Filaments) */}
                {selectedConcept === "acoustic_resonance" && (
                  <div
                    className={`relative w-full transition-all duration-300 cursor-pointer group/acoustic bg-transparent border-0 select-none ${
                      isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-[#A27FF3]/40 shadow-[0_0_14px_rgba(162,127,243,0.3)]">
                          <img
                            src="/assets/avatar_executive_luxury.jpg"
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                          <span className="w-[1.5px] h-2 bg-[#A27FF3] rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                          <span className="w-[1.5px] h-4 bg-white rounded-full animate-[pulse_1.1s_ease-in-out_0.2s_infinite]" />
                          <span className="w-[1.5px] h-1.5 bg-[#38BDF8] rounded-full animate-[pulse_0.9s_ease-in-out_0.4s_infinite]" />
                        </div>
                      </div>
                      {isHovered && (
                        <div className="flex flex-col items-start ml-4 overflow-hidden text-left">
                          <KineticLuxuryText
                            text={userName}
                            trigger={isHovered || kineticTrigger}
                            className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                          />
                          <span className="text-[10.5px] text-[#A27FF3] font-sans tracking-wide truncate mt-0.5">
                            {userLevel} · Voice Ready
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. SPECULAR GLASS RING (Apple Vision Caustic Halo) */}
                {selectedConcept === "specular_glass" && (
                  <div
                    className={`relative w-full transition-all duration-300 cursor-pointer group/specular bg-transparent border-0 select-none ${
                      isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <div className="absolute -inset-1 rounded-full border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.25)] animate-[spin_10s_linear_infinite]" />
                        <div className="w-8 h-8 rounded-full overflow-hidden relative z-10 ring-1 ring-white/20">
                          <img
                            src="/assets/avatar_executive_luxury.jpg"
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {isHovered && (
                        <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left">
                          <KineticLuxuryText
                            text={userName}
                            trigger={isHovered || kineticTrigger}
                            className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                          />
                          <span className="text-[10.5px] text-zinc-400 font-sans tracking-wide truncate mt-0.5">
                            {userLevel} · Spatial Sync
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. PRECISION CHRONO ORBIT (Radial Learning Momentum) */}
                {selectedConcept === "precision_chrono" && (
                  <div
                    className={`relative w-full transition-all duration-300 cursor-pointer group/chrono bg-transparent border-0 select-none ${
                      isHovered ? "py-1.5 px-2 hover:bg-white/[0.04] rounded-2xl" : "flex justify-center py-1"
                    }`}
                  >
                    <div className="flex items-center w-full">
                      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                        <svg className="w-9 h-9 -rotate-90 absolute pointer-events-none" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-white/10"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            className="stroke-[#34D399]"
                            strokeWidth="1.5"
                            strokeDasharray="100"
                            strokeDashoffset="35"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="w-7 h-7 rounded-full overflow-hidden relative z-10 ring-1 ring-white/20">
                          <img
                            src="/assets/avatar_executive_luxury.jpg"
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      {isHovered && (
                        <div className="flex flex-col items-start ml-3.5 overflow-hidden text-left">
                          <KineticLuxuryText
                            text={userName}
                            trigger={isHovered || kineticTrigger}
                            className="text-[13px] font-medium text-white tracking-tight truncate leading-tight"
                          />
                          <span className="text-[10.5px] text-emerald-400 font-sans tracking-wide truncate mt-0.5">
                            {userLevel} · 65% Momentum
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Logout Button (Seamlessly Integrated Below) */}
                <div
                  className={`flex items-center w-full py-2 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer group/logout ${
                    isHovered ? "px-3.5 justify-start" : "justify-center"
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {isHovered && (
                    <span className="ml-3.5 text-xs font-normal tracking-wide text-inherit">
                      Cerrar Sesión
                    </span>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Right: Concept Specs, Interactive Inspector & Live Activation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#05060f] border border-white/[0.08] rounded-[28px] relative">
          <div className="flex flex-col space-y-5">
            {/* Active Concept Title & Status */}
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">
                  Especificación de Diseño
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero-Box Certified
                </span>
              </div>
              <h3 className="text-xl font-medium text-white tracking-tight">
                {activeMeta.title}
              </h3>
              <p className="text-xs text-zinc-400 font-light leading-relaxed">
                {activeMeta.description}
              </p>
            </div>

            {/* Live Interactive Customizer */}
            <div className="flex flex-col space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Prueba en Vivo tu Nombre (Cinética Dinámica)
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu Nombre..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#A27FF3]"
                />
                <input
                  type="text"
                  value={userLevel}
                  onChange={(e) => setUserLevel(e.target.value)}
                  placeholder="Nivel CEFR..."
                  className="w-32 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-[#A27FF3]"
                />
              </div>
            </div>

            {/* Architecture Standards Checklist */}
            <div className="flex flex-col space-y-2.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Cero cajas contenedor:</strong> Integrado directamente en el vacío del Sidenav.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Kinetic Luxury Unscrambler:</strong> Decodificación limpia carácter por carácter.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Fotografía Ejecutiva 4K:</strong> Retrato real nítido con halo especular 0.5px.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span><strong>Sincronización Total:</strong> Activación instantánea en el Sidenav de toda la app.</span>
              </div>
            </div>
          </div>

          {/* Master Live Activation Action */}
          <div className="pt-4 border-t border-white/[0.06] flex flex-col space-y-2.5">
            <button
              type="button"
              onClick={() => handleApply(selectedConcept)}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-black font-semibold text-xs tracking-wide hover:bg-zinc-200 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2"
            >
              <span>Activar "{activeMeta.title}" en el Sidenav Real</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <p className="text-[11px] text-center text-zinc-500 font-mono">
              Al hacer clic, el sidebar de la izquierda se actualiza en tiempo real
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visual Gallery: All 4 Variants Rendered in Live Micro-Cards */}
      <div className="flex flex-col space-y-4 pt-4 border-t border-white/[0.06] relative z-10">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white tracking-wide">
            Galería Comparativa Simultánea (4 Variantes con Cinética Activa)
          </h4>
          <span className="text-xs text-zinc-500 font-mono">Pasa el cursor sobre cada una para ver la interacción</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LUXURY_CONCEPTS.map((c) => {
            const isSelected = selectedConcept === c.id;
            return (
              <div
                key={c.id}
                onClick={() => handleApply(c.id)}
                className={`flex flex-col justify-between p-4 rounded-2xl bg-[#040409] border transition-all duration-300 cursor-pointer group/card ${
                  isSelected
                    ? "border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.15)] bg-[#070914]"
                    : "border-white/[0.06] hover:border-white/20 hover:bg-[#070712]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-zinc-400">{c.title.split(". ")[1]}</span>
                  {isSelected ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Activo
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-zinc-500 group-hover/card:text-white">
                      Clic para activar
                    </span>
                  )}
                </div>

                {/* Simulated Micro Sidenav Profile Component */}
                <div className="py-3 px-2 rounded-xl bg-black/40 border border-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center overflow-hidden">
                    {/* Variant Avatar */}
                    {c.id === "atelier_minimalist" && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-white/20">
                        <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {c.id === "acoustic_resonance" && (
                      <div className="relative flex items-center justify-center shrink-0">
                        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#A27FF3]/50">
                          <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                          <span className="w-1 h-2 bg-[#A27FF3] rounded-full animate-pulse" />
                          <span className="w-1 h-3.5 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                    )}
                    {c.id === "specular_glass" && (
                      <div className="relative w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        <div className="absolute -inset-1 rounded-full border border-white/30 animate-[spin_8s_linear_infinite]" />
                        <div className="w-8 h-8 rounded-full overflow-hidden relative z-10">
                          <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    {c.id === "precision_chrono" && (
                      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                        <svg className="w-9 h-9 -rotate-90 absolute" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="1.5" />
                          <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#34D399]" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="35" />
                        </svg>
                        <div className="w-7 h-7 rounded-full overflow-hidden relative z-10">
                          <img src="/assets/avatar_executive_luxury.jpg" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-start ml-3 text-left overflow-hidden">
                      <KineticLuxuryText
                        text={userName}
                        trigger={kineticTrigger}
                        className="text-xs font-medium text-white tracking-tight truncate leading-tight group-hover/card:text-zinc-100"
                      />
                      <span className="text-[10px] text-zinc-400 font-sans truncate mt-0.5">
                        {c.subtitle.split("·")[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
