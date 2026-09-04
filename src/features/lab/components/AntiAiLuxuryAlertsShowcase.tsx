import React, { useState } from "react";
import { toast as sonnerToast } from "sonner";
import {
  CognitiveMemoryBrainIcon,
  QuantumNeuralGaugeIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

type AlertConceptId =
  | "aurora-beam"
  | "linear-pill"
  | "spatial-glass"
  | "laser-kinetic"
  | "prism-crystal"
  | "hud-beacon";

type AlertScenario = "spanish" | "gibberish" | "mic-pause" | "memory-saved" | "streak";

interface AlertConcept {
  id: AlertConceptId;
  name: string;
  tagline: string;
  vibe: string;
  highlights: string[];
  renderComponent: (scenario: AlertScenario, onDismiss?: () => void) => React.ReactElement;
}

export const AntiAiLuxuryAlertsShowcase: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<AlertScenario>("spanish");
  const [activeConceptId, setActiveConceptId] = useState<AlertConceptId>("aurora-beam");

  const getScenarioContent = (scenario: AlertScenario) => {
    switch (scenario) {
      case "spanish":
        return {
          tag: "SPANISH DETECTED · AUTO-PAUSED",
          title: "Detectamos que estás hablando en español",
          desc: "El micrófono se ha pausado automáticamente. Por favor continúa en inglés para entrenar tu fluidez.",
          stat: "0 Tokens Consumidos",
          accentColor: "#A855F7",
        };
      case "gibberish":
        return {
          tag: "LINGUISTIC SHIELD · BLOCKED",
          title: "Entrada de texto no comprensible",
          desc: "Estructura una oración completa en inglés para recibir retroalimentación precisa del Mentor IA.",
          stat: "Anti-Alucinación Activo",
          accentColor: "#F43F5E",
        };
      case "mic-pause":
        return {
          tag: "AUDIO CAPTURE · SILENCE",
          title: "Audio ambiental o silencio prolongado",
          desc: "No capturamos voz clara. Acércate al micrófono o habla con mayor proyección vocal.",
          stat: "48kHz Stream",
          accentColor: "#38BDF8",
        };
      case "memory-saved":
        return {
          tag: "MEMORY VAULT · ENCRYPTED",
          title: "Corrección guardada en tu Banco de Memoria",
          desc: "“Distributed systems & latency review” agregada con éxito para tu próxima sesión de repaso.",
          stat: "AES-256 Synced",
          accentColor: "#10B981",
        };
      case "streak":
        return {
          tag: "PROGRESS MILESTONE · TIER C1",
          title: "¡Racha de 7 días consecutivos completada!",
          desc: "Has aumentado tu estabilidad gramatical en un +14% durante las simulaciones técnicas.",
          stat: "+250 XP Gain",
          accentColor: "#F59E0B",
        };
    }
  };

  // Trigger Sonner Live Toast with the chosen custom concept
  const triggerLiveToast = (conceptId: AlertConceptId) => {
    const concept = CONCEPTS.find((c) => c.id === conceptId);
    if (!concept) return;

    sonnerToast.custom(
      (id) => concept.renderComponent(selectedScenario, () => sonnerToast.dismiss(id)),
      { duration: 4500 },
    );
  };

  const CONCEPTS: AlertConcept[] = [
    // -------------------------------------------------------------
    // CONCEPT 1: Aurora Ethereal Beam (Zero Container · Pure Light)
    // -------------------------------------------------------------
    {
      id: "aurora-beam",
      name: "1. Aurora Ethereal Beam",
      tagline: "Cero contenedores toscos · Fondo de luz volumétrica y aura atmosférica",
      vibe: "Apple Vision Pro Atmosphere & Stripe Luxury",
      highlights: [
        "Sin bordes gruesos ni cajas oscuras",
        "Gradiente de luz espacial posterior",
        "Línea de brillo especular superior ultra fina",
        "Tipografía de alto contraste con resplandor lavanda",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative group w-full sm:w-[420px] max-w-[calc(100vw-32px)] select-none pointer-events-auto">
            {/* Atmospheric Aurora Backlight */}
            <div
              className="absolute -inset-1 rounded-3xl opacity-75 blur-xl transition-all duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse at center, ${data.accentColor}40 0%, rgba(112,72,232,0.15) 50%, transparent 80%)`,
              }}
            />

            {/* Naked Obsidian Canvas with 1px Specular Glow */}
            <div className="relative rounded-2xl bg-[#030208]/90 backdrop-blur-3xl p-4.5 px-5 shadow-[0_24px_70px_rgba(0,0,0,0.95)] overflow-hidden">
              {/* Top Specular Hairline */}
              <div
                className="absolute top-0 inset-x-6 h-[1.5px]"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${data.accentColor} 50%, transparent 100%)`,
                }}
              />

              {/* Header Row */}
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full animate-pulse shrink-0"
                    style={{
                      backgroundColor: data.accentColor,
                      boxShadow: `0 0 12px ${data.accentColor}`,
                    }}
                  />
                  <span
                    className="text-[10.5px] font-mono tracking-[0.22em] uppercase font-bold truncate"
                    style={{ color: data.accentColor }}
                  >
                    {data.tag}
                  </span>
                </div>
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="text-white/30 hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-white/[0.05]"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Title */}
              <h4 className="text-[13.5px] font-medium text-white tracking-[-0.01em] leading-snug">
                {data.title}
              </h4>

              {/* Description */}
              <p className="text-xs text-[#9E9EBD] font-light leading-relaxed mt-1 select-text">
                {data.desc}
              </p>
            </div>
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 2: Linear Cosmic Pill (Aerodynamic OLED Capsule)
    // -------------------------------------------------------------
    {
      id: "linear-pill",
      name: "2. Linear Cosmic Pill",
      tagline: "Cápsula aerodinámica flotante · Acento vertical de energía cromática",
      vibe: "Linear App & Vercel High-Speed Interface",
      highlights: [
        "Silueta en píldora fluida sin bordes cuadrados",
        "Barra vertical cromática con gradiente de alta definición",
        "Ultra ligera y sin estorbar elementos de fondo",
        "Etiqueta de estado en monospace puro",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative w-full sm:w-[400px] max-w-[calc(100vw-32px)] select-none pointer-events-auto">
            <div className="relative rounded-full bg-[#05040d]/95 backdrop-blur-2xl py-3 px-4.5 pl-4 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_25px_rgba(112,72,232,0.15)] flex items-center justify-between gap-3.5 border border-white/[0.06]">
              {/* Left Chromatic Indicator Ribbon */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-1.5 h-7 rounded-full shrink-0 animate-pulse"
                  style={{
                    background: `linear-gradient(180deg, ${data.accentColor}, #DDD6FE)`,
                    boxShadow: `0 0 10px ${data.accentColor}80`,
                  }}
                />
                <div className="flex flex-col text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9.5px] font-mono tracking-[0.2em] uppercase font-semibold truncate"
                      style={{ color: data.accentColor }}
                    >
                      {data.tag}
                    </span>
                    <span className="text-[9px] font-mono text-white/35 shrink-0">{data.stat}</span>
                  </div>
                  <span className="text-xs font-normal text-white truncate max-w-[270px]">
                    {data.title}
                  </span>
                </div>
              </div>

              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-white/30 hover:text-white p-1 rounded-full hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 3: Apple Vision Pro Spatial Glass (Hyper-Translucent)
    // -------------------------------------------------------------
    {
      id: "spatial-glass",
      name: "3. Apple Vision Pro Spatial Glass",
      tagline: "Capa espacial hiper-translúcida · Iconografía vectorial suiza",
      vibe: "visionOS Spatial Computing & Cosmos Design",
      highlights: [
        "Fondo translúcido de profundidad óptica",
        "Icono vectorial bespoke sin contenedor cuadrado",
        "Reflejos interiores suaves en luz especular",
        "Integración perfecta con fondos cósmicos",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative group w-full sm:w-[410px] max-w-[calc(100vw-32px)] select-none pointer-events-auto">
            <div className="relative rounded-3xl bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-3xl p-4.5 px-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_28px_70px_rgba(0,0,0,0.85)] border border-white/[0.08] transition-all duration-300">
              <div className="flex items-start gap-4">
                {/* Standalone Vector Icon with Radiant Glow */}
                <div
                  className="shrink-0 mt-0.5"
                  style={{
                    color: data.accentColor,
                    filter: `drop-shadow(0 0 10px ${data.accentColor}60)`,
                  }}
                >
                  <CognitiveMemoryBrainIcon className="w-7 h-7" />
                </div>

                <div className="flex flex-col text-left min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold"
                      style={{ color: data.accentColor }}
                    >
                      {data.tag}
                    </span>
                    {onDismiss && (
                      <button
                        type="button"
                        onClick={onDismiss}
                        className="text-white/30 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <h4 className="text-[13.5px] font-medium text-white tracking-tight mt-0.5">
                    {data.title}
                  </h4>
                  <p className="text-xs text-[#9E9EBD] font-light leading-relaxed mt-1 select-text">
                    {data.desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 4: Cyber-Kinetic Laser Beam (Naked Typography)
    // -------------------------------------------------------------
    {
      id: "laser-kinetic",
      name: "4. Cyber-Kinetic Laser Beam",
      tagline: "100% Sin caja · Tipografía suspendida con haz de luz cinético",
      vibe: "Hyper-Minimalist Futuristic HUD",
      highlights: [
        "Cero fondo o caja opaca: la tipografía flota en el espacio",
        "Haz inferior láser con degradado dinámico",
        "Elimina 100% de la sensación de 'alerta de plantilla IA'",
        "Máxima legibilidad y elegancia",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative w-full sm:w-[410px] max-w-[calc(100vw-32px)] select-none pointer-events-auto">
            <div className="relative py-3.5 px-4 bg-[#000002]/85 backdrop-blur-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              {/* Header */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: data.accentColor,
                      boxShadow: `0 0 8px ${data.accentColor}`,
                    }}
                  />
                  <span
                    className="text-[10.5px] font-mono tracking-[0.22em] uppercase font-bold"
                    style={{ color: data.accentColor }}
                  >
                    {data.tag}
                  </span>
                </div>
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="text-white/30 hover:text-white p-0.5 transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Title & Desc */}
              <h4 className="text-[13px] font-semibold text-white tracking-tight">{data.title}</h4>
              <p className="text-xs text-[#8E90A5] font-light leading-relaxed mt-1">{data.desc}</p>

              {/* Kinetic Laser Line Underneath */}
              <div
                className="mt-3 h-[2px] w-full rounded-full animate-[pulse_2s_infinite]"
                style={{
                  background: `linear-gradient(90deg, ${data.accentColor} 0%, rgba(162,127,243,0.3) 70%, transparent 100%)`,
                }}
              />
            </div>
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 5: Prism Crystal Sheen (Multi-Chromatic Refraction)
    // -------------------------------------------------------------
    {
      id: "prism-crystal",
      name: "5. Prism Crystal Sheen",
      tagline: "Borde refractivo prismático · Micro-partículas de color vibrante",
      vibe: "High-End Luxury Jewelry & Optical Instruments",
      highlights: [
        "Borde ultra fino con gradiente multicolor refractivo",
        "Partícula centelleante de estado",
        "Resalte especular en terciopelo obsidiana",
        "Acento de color adaptable según la severidad",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative group w-full sm:w-[410px] max-w-[calc(100vw-32px)] select-none pointer-events-auto p-[1px] rounded-2xl bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#06B6D4] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(139,92,246,0.2)]">
            <div className="relative rounded-[15px] bg-[#04030A]/95 backdrop-blur-2xl p-4 px-4.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs">✨</span>
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold bg-gradient-to-r from-[#F472B6] to-[#C084FC] bg-clip-text text-transparent">
                    {data.tag}
                  </span>
                </div>
                {onDismiss && (
                  <button
                    type="button"
                    onClick={onDismiss}
                    className="text-white/30 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
              <h4 className="text-[13px] font-medium text-white tracking-tight leading-snug">
                {data.title}
              </h4>
              <p className="text-xs text-[#9E9EBD] font-light leading-relaxed mt-1 select-text">
                {data.desc}
              </p>
            </div>
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 6: Minimalist HUD Beacon (Swiss Precision Telemetry)
    // -------------------------------------------------------------
    {
      id: "hud-beacon",
      name: "6. Minimalist HUD Beacon",
      tagline: "Micro-telemetría suiza · Anillo orbital de convergencia",
      vibe: "Swiss Timepiece & Architectural Radar",
      highlights: [
        "Diseño ultra compacto de alta densidad",
        "Retícula de calibración radar con micro-ticks",
        "Cero ruido visual",
        "Ideal para notificaciones rápidas de estado",
      ],
      renderComponent: (scenario, onDismiss) => {
        const data = getScenarioContent(scenario);
        return (
          <div className="relative w-full sm:w-[390px] max-w-[calc(100vw-32px)] select-none pointer-events-auto">
            <div className="relative rounded-2xl bg-[#030208]/95 border border-white/[0.07] backdrop-blur-2xl p-4 shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex items-start gap-3.5">
              {/* Radar Reticle Icon */}
              <div className="shrink-0 mt-0.5 text-[#DDD6FE]">
                <QuantumNeuralGaugeIcon className="w-6 h-6" />
              </div>

              <div className="flex flex-col text-left min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[9.5px] font-mono tracking-[0.2em] uppercase font-bold"
                    style={{ color: data.accentColor }}
                  >
                    {data.tag}
                  </span>
                  {onDismiss && (
                    <button
                      type="button"
                      onClick={onDismiss}
                      className="text-white/30 hover:text-white p-0.5 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <h4 className="text-[13px] font-medium text-white tracking-tight mt-0.5">
                  {data.title}
                </h4>
                <p className="text-xs text-[#8E90A5] font-light leading-relaxed mt-0.5">
                  {data.desc}
                </p>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-8 bg-[#04030A] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
      {/* Control Bar: Scenario Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col">
          <span className="text-[10.5px] font-mono tracking-[0.2em] text-[#A27FF3] uppercase font-semibold">
            LUXURY TOAST & ALERT DESIGN STUDIO · 6 PROPRIETARY CONCEPTS
          </span>
          <h3 className="text-xl font-light text-white mt-1">
            Selecciona el escenario de prueba & Compara en tiempo real
          </h3>
        </div>

        {/* Scenario Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#080714] p-1 rounded-2xl border border-white/[0.06]">
          {[
            { id: "spanish" as AlertScenario, label: "🇪🇸 Spanish Detected" },
            { id: "gibberish" as AlertScenario, label: "🛡️ Gibberish Shield" },
            { id: "mic-pause" as AlertScenario, label: "🎙️ Mic Silence" },
            { id: "memory-saved" as AlertScenario, label: "🧠 Memory Vault" },
            { id: "streak" as AlertScenario, label: "🔥 7-Day Streak" },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedScenario === sc.id
                  ? "bg-[#A27FF3] text-white shadow-[0_0_15px_rgba(162,127,243,0.5)]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 6 Anti-AI Luxury Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CONCEPTS.map((concept) => {
          const isSelected = activeConceptId === concept.id;
          return (
            <div
              key={concept.id}
              className={`flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 ${
                isSelected
                  ? "bg-[#090718] border-2 border-[#A27FF3] shadow-[0_0_30px_rgba(162,127,243,0.2)]"
                  : "bg-[#060510] border border-white/[0.07] hover:border-white/[0.15]"
              }`}
            >
              {/* Concept Info */}
              <div className="flex flex-col space-y-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {concept.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-[#DDD6FE]">
                    {concept.vibe}
                  </span>
                </div>
                <p className="text-xs text-[#8E90A5] font-light leading-relaxed">
                  {concept.tagline}
                </p>

                {/* Highlights List */}
                <ul className="space-y-1 pt-1">
                  {concept.highlights.map((h, i) => (
                    <li key={i} className="text-[11px] text-white/50 flex items-center gap-1.5">
                      <span className="text-[#A27FF3]">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Live Card Preview */}
              <div className="my-auto py-2 flex items-center justify-center">
                {concept.renderComponent(selectedScenario)}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerLiveToast(concept.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-medium text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🚀 Probar flotante en vivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveConceptId(concept.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : "bg-[#16142a] text-[#C4B5FD] hover:bg-[#A27FF3] hover:text-white"
                  }`}
                >
                  {isSelected ? "✓ Seleccionado" : "Elegir"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
