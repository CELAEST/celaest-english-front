import React, { useState } from "react";
import {
  PrecisionOpenBookIcon,
  TechnicalWritingQuillIcon,
  StudioVoiceMicIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

type ControlConceptId =
  | "cyber-kinetic-rail"
  | "linear-obsidian-bar"
  | "spatial-vision-glass"
  | "hud-swiss-telemetry"
  | "prism-chromatic-edge"
  | "naked-quantum-pearl";

interface ControlConcept {
  id: ControlConceptId;
  name: string;
  tagline: string;
  vibe: string;
  highlights: string[];
  renderComponent: (
    activeTab: number,
    onTabChange: (index: number) => void,
    counts: { speaking: number; reading: number; writing: number },
  ) => React.ReactElement;
}

export const LuxurySegmentedControlsShowcase: React.FC = () => {
  const [selectedConceptId, setSelectedConceptId] = useState<ControlConceptId>("cyber-kinetic-rail");
  const [activeTabIndices, setActiveTabIndices] = useState<Record<ControlConceptId, number>>({
    "cyber-kinetic-rail": 1,
    "linear-obsidian-bar": 1,
    "spatial-vision-glass": 1,
    "hud-swiss-telemetry": 1,
    "prism-chromatic-edge": 1,
    "naked-quantum-pearl": 1,
  });

  const counts = { speaking: 10, reading: 5, writing: 10 };

  const handleTabChange = (conceptId: ControlConceptId, index: number) => {
    setActiveTabIndices((prev) => ({ ...prev, [conceptId]: index }));
  };

  const CONCEPTS: ControlConcept[] = [
    // -------------------------------------------------------------
    // CONCEPT 1: Cyber-Kinetic Laser Rail (Direct Match to Cyber Laser Standard)
    // -------------------------------------------------------------
    {
      id: "cyber-kinetic-rail",
      name: "1. Cyber-Kinetic Laser Rail",
      tagline: "En perfecta armonía con el Toast seleccionado · Haz láser inferior cinético",
      vibe: "CELAEST Cyber-Kinetic Standard",
      highlights: [
        "Cero bloques blancos toscos que encandilan la vista",
        "Haz láser cinético inferior pulsante en el tab activo",
        "Badges de conteo en tipografía monospace fluida",
        "Iconografía vectorial bespoke suiza integrada",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { label: "Speaking", count: c.speaking, Icon: StudioVoiceMicIcon, color: "#A855F7" },
          { label: "Reading", count: c.reading, Icon: PrecisionOpenBookIcon, color: "#38BDF8" },
          { label: "Writing", count: c.writing, Icon: TechnicalWritingQuillIcon, color: "#10B981" },
        ];
        return (
          <div className="flex items-center gap-6 select-none py-1">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className="group relative flex flex-col items-center py-2 px-1 cursor-pointer transition-all duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <tab.Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        active
                          ? "text-white scale-110 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                          : "text-white/40 group-hover:text-white/80"
                      }`}
                    />
                    <span
                      className={`text-[13px] font-medium tracking-wide transition-colors ${
                        active ? "text-white font-semibold" : "text-white/50 group-hover:text-white/90"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-all ${
                        active
                          ? "bg-white/[0.12] text-white font-bold border border-white/[0.15]"
                          : "bg-white/[0.04] text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>

                  {/* Kinetic Laser Line Underneath Active Tab */}
                  {active ? (
                    <div
                      className="absolute -bottom-1 inset-x-0 h-[2px] rounded-full animate-[pulse_2s_infinite]"
                      style={{
                        background: `linear-gradient(90deg, ${tab.color} 0%, rgba(162,127,243,0.4) 70%, transparent 100%)`,
                      }}
                    />
                  ) : (
                    <div className="absolute -bottom-1 inset-x-0 h-[1px] bg-transparent group-hover:bg-white/10 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 2: Linear Obsidian Specular Bar (Linear App Architecture)
    // -------------------------------------------------------------
    {
      id: "linear-obsidian-bar",
      name: "2. Linear Obsidian Specular Bar",
      tagline: "Riel aerodinámico de obsidiana · Pestaña biselada con luz lavanda",
      vibe: "Linear & Vercel Segmented Control",
      highlights: [
        "Contenedor en cápsula delgada con borde de micro-precisión",
        "Pestaña activa en cristal amatista con brillo sutil",
        "Transición deslizante suave",
        "Píldora numérica con contraste visual óptimo",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { label: "Speaking", count: c.speaking },
          { label: "Reading", count: c.reading },
          { label: "Writing", count: c.writing },
        ];
        return (
          <div className="inline-flex items-center p-1 rounded-full bg-[#05040e] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] select-none">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    active
                      ? "bg-[#18142a] text-white font-semibold border border-[#A27FF3]/40 shadow-[0_4px_20px_rgba(112,72,232,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-[#A27FF3]/25 text-[#DDD6FE] font-bold border border-[#A27FF3]/30"
                        : "bg-white/[0.06] text-white/40"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 3: Apple Vision Pro Spatial Glass (Hyper-Translucent)
    // -------------------------------------------------------------
    {
      id: "spatial-vision-glass",
      name: "3. Apple Vision Pro Spatial Glass",
      tagline: "Capa espacial hiper-translúcida · Reflejo especular interior",
      vibe: "visionOS Spatial Glass Control",
      highlights: [
        "Efecto de cristal líquido de alta gama",
        "Resplandor lavanda suave (reemplaza el blanco encandilante)",
        "Iconos semánticos vectoriales",
        "Sensación táctil premium y fluida",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { label: "Speaking", count: c.speaking, Icon: StudioVoiceMicIcon },
          { label: "Reading", count: c.reading, Icon: PrecisionOpenBookIcon },
          { label: "Writing", count: c.writing, Icon: TechnicalWritingQuillIcon },
        ];
        return (
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    active
                      ? "bg-white/[0.1] text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_25px_rgba(112,72,232,0.25)] border border-white/[0.18]"
                      : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <tab.Icon className={`w-3.5 h-3.5 ${active ? "text-[#DDD6FE]" : "text-white/30"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-md ${
                      active ? "bg-white/20 text-white font-bold" : "bg-white/5 text-white/30"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 4: Minimalist Monospace HUD (Swiss Radar Telemetry)
    // -------------------------------------------------------------
    {
      id: "hud-swiss-telemetry",
      name: "4. Minimalist Monospace HUD",
      tagline: "Telemetría suiza · Numeración ordinal y puntos cuánticos",
      vibe: "Swiss Timepiece & Architectural Radar",
      highlights: [
        "Cero cápsulas pesadas: pura elegancia tipográfica",
        "Prefijo numérico ordinal (01, 02, 03)",
        "Punto cuántico pulsante en la sección activa",
        "Alta densidad de información y bajo ruido",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { code: "01", label: "SPEAKING", count: c.speaking },
          { code: "02", label: "READING", count: c.reading },
          { code: "03", label: "WRITING", count: c.writing },
        ];
        return (
          <div className="flex items-center gap-5 select-none font-mono">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className={`group flex items-center gap-2 py-1.5 cursor-pointer transition-all ${
                    active ? "text-white" : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-pulse shadow-[0_0_8px_rgba(162,127,243,0.9)]" />
                  )}
                  <span className="text-[10px] text-white/30 group-hover:text-white/50">{tab.code}</span>
                  <span className={`text-xs tracking-[0.15em] uppercase ${active ? "font-bold text-[#DDD6FE]" : "font-normal"}`}>
                    {tab.label}
                  </span>
                  <span
                    className={`text-[9.5px] px-1 rounded ${
                      active ? "bg-[#A27FF3]/20 text-[#C4B5FD] font-semibold" : "text-white/30"
                    }`}
                  >
                    [{tab.count}]
                  </span>
                </button>
              );
            })}
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 5: Prism Chromatic Sheen (Multi-Color Refraction)
    // -------------------------------------------------------------
    {
      id: "prism-chromatic-edge",
      name: "5. Prism Chromatic Sheen",
      tagline: "Borde refractivo multicolor · Acento de luz espectral por modo",
      vibe: "High-End Luxury Optics",
      highlights: [
        "Borde ultra fino con gradiente multicolor prismático",
        "Color adaptativo por categoría (Violeta, Cyan, Esmeralda)",
        "Sombra ambiental con halo cromático sutil",
        "Resalta la riqueza visual del modo activo",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { label: "Speaking", count: c.speaking, gradient: "from-[#EC4899] to-[#8B5CF6]" },
          { label: "Reading", count: c.reading, gradient: "from-[#8B5CF6] to-[#06B6D4]" },
          { label: "Writing", count: c.writing, gradient: "from-[#06B6D4] to-[#10B981]" },
        ];
        return (
          <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-[#04030A] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] select-none">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className={`relative p-[1px] rounded-xl transition-all duration-300 cursor-pointer ${
                    active ? `bg-gradient-to-r ${tab.gradient} shadow-[0_0_20px_rgba(139,92,246,0.3)]` : "bg-transparent"
                  }`}
                >
                  <div
                    className={`px-3.5 py-1.5 rounded-[11px] text-xs flex items-center gap-2 transition-all ${
                      active ? "bg-[#070512] text-white font-semibold" : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-md ${
                        active ? "bg-white/15 text-white font-bold" : "bg-white/5 text-white/30"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      },
    },

    // -------------------------------------------------------------
    // CONCEPT 6: Naked Quantum Pearl (Editorial Haute Couture)
    // -------------------------------------------------------------
    {
      id: "naked-quantum-pearl",
      name: "6. Naked Quantum Pearl",
      tagline: "Cero contenedores · Texto flotante con perla cuántica centrada",
      vibe: "Cosmos & Minimalist Editorial Luxury",
      highlights: [
        "100% Sin cajas de fondo ni bordes de encapsulado",
        "Perla cuántica lavanda centrada bajo el texto activo",
        "Máxima pureza tipográfica y amplitud visual",
        "Integra armónicamente con cualquier fondo cósmico",
      ],
      renderComponent: (activeTab, onTabChange, c) => {
        const tabs = [
          { label: "Speaking", count: c.speaking },
          { label: "Reading", count: c.reading },
          { label: "Writing", count: c.writing },
        ];
        return (
          <div className="flex items-center gap-8 select-none py-1">
            {tabs.map((tab, i) => {
              const active = i === activeTab;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onTabChange(i)}
                  className="group relative flex flex-col items-center cursor-pointer py-1"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm tracking-wide transition-all ${
                        active
                          ? "text-white font-medium text-[14px]"
                          : "text-white/40 group-hover:text-white/80 font-light"
                      }`}
                    >
                      {tab.label}
                    </span>
                    <span
                      className={`text-[10px] font-mono transition-colors ${
                        active ? "text-[#C4B5FD] font-semibold" : "text-white/30"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </div>

                  {/* Centered Quantum Pearl Indicator */}
                  {active ? (
                    <div className="mt-1.5 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4B5FD] shadow-[0_0_10px_#C4B5FD,0_0_20px_rgba(196,181,253,0.5)] animate-pulse" />
                    </div>
                  ) : (
                    <div className="mt-1.5 h-1.5 w-1.5" />
                  )}
                </button>
              );
            })}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-8 bg-[#04030A] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex flex-col">
          <span className="text-[10.5px] font-mono tracking-[0.2em] text-[#A27FF3] uppercase font-semibold">
            LUXURY SEGMENTED CONTROL & TAB SWITCHER STUDIO · 6 CONCEPTS
          </span>
          <h3 className="text-xl font-light text-white mt-1">
            Compara los diseños de navegación por pestañas (Speaking · Reading · Writing)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8E90A5]">Interactúa con cada tab para probar su física</span>
        </div>
      </div>

      {/* Grid of 6 Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CONCEPTS.map((concept) => {
          const isSelected = selectedConceptId === concept.id;
          const activeIndex = activeTabIndices[concept.id];

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

                {/* Highlights */}
                <ul className="space-y-1 pt-1">
                  {concept.highlights.map((h, i) => (
                    <li key={i} className="text-[11px] text-white/50 flex items-center gap-1.5">
                      <span className="text-[#A27FF3]">✓</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Component Render */}
              <div className="my-auto py-6 flex items-center justify-center bg-[#020106]/70 rounded-2xl border border-white/[0.04]">
                {concept.renderComponent(
                  activeIndex,
                  (idx) => handleTabChange(concept.id, idx),
                  counts,
                )}
              </div>

              {/* Selection Button */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[11px] font-mono text-white/40">
                  Tab Activo:{" "}
                  <strong className="text-white">
                    {activeIndex === 0 ? "Speaking" : activeIndex === 1 ? "Reading" : "Writing"}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedConceptId(concept.id)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#10B981] text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                      : "bg-[#16142a] text-[#C4B5FD] hover:bg-[#A27FF3] hover:text-white"
                  }`}
                >
                  {isSelected ? "✓ Seleccionado" : "Elegir para Memory"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
