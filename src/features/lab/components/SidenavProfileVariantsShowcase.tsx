import React, { useState } from "react";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
} from "../../workspace/components/WorkspaceBespokeIcons";

export type SidenavVariantId =
  | "pure_minimal"
  | "apple_glass"
  | "linear_stealth"
  | "raycast_dual"
  | "velvet_ambient";

interface VariantMeta {
  id: SidenavVariantId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
}

const VARIANTS: VariantMeta[] = [
  {
    id: "pure_minimal",
    name: "1. Pure Zen Minimalist (Recomendado)",
    badge: "Active Sidenav Default",
    tagline: "Cero redundancia · Máximo espacio negativo · Foco 100% en navegación",
    description:
      "Elimina completamente la caja de perfil redundante. El acceso a Ajustes se realiza limpiamente a través del ícono nativo de Settings, y el cierre de sesión queda como una acción inferior sutil y no invasiva.",
  },
  {
    id: "apple_glass",
    name: "2. Apple Glass Monogram",
    badge: "Ultra-Subtle Glass",
    tagline: "Avatar translúcido de 32px · Dot de presencia esmeralda · Tipografía sin bordes",
    description:
      "Un micro-avatar circular en vidrio ahumado con un punto de actividad en verde esmeralda. Al expandirse, muestra el nombre en tipografía etérea sin recuadros pesados ni bordes gruesos.",
  },
  {
    id: "linear_stealth",
    name: "3. Linear Stealth Micro-Card",
    badge: "Monospace Precision",
    tagline: "Obsidiana profunda · Borde sub-píxel 1px · Chip mono para nivel CEFR",
    description:
      "Inspirado en la ergonomía de Linear y Vercel: una tarjeta de perfil de altura ultra reducida (h-10), con micro-borde casi invisible y nivel de usuario formateado como chip técnico monospaced.",
  },
  {
    id: "raycast_dual",
    name: "4. Raycast Dual Action",
    badge: "Compact Action Dock",
    tagline: "Dock de iconos gemelos · Expansión horizontal simétrica · Tooltips flotantes",
    description:
      "Agrupa el avatar de perfil y el botón de logout en una hilera horizontal de dos micro-botones en estado colapsado, que se abren como dos cápsulas independientes al pasar el cursor.",
  },
  {
    id: "velvet_ambient",
    name: "5. Velvet Ambient Glow",
    badge: "High-Fashion Violet Halo",
    tagline: "Halo etéreo de 24px · Resonancia púrpura CELAEST · Gradiente satinado",
    description:
      "Para quienes buscan un toque de diseño sensorial de lujo: un sutil resplandor violeta (#A27FF3) detrás del avatar que pulsa suavemente, sin añadir bordes pesados.",
  },
];

export const SidenavProfileVariantsShowcase: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<SidenavVariantId>("pure_minimal");
  const [isSimulatedHover, setIsSimulatedHover] = useState(false);
  const [customName, setCustomName] = useState("Esteban Perez");
  const [customLevel, setCustomLevel] = useState("A1 — Beginner");

  const currentMeta = VARIANTS.find((v) => v.id === selectedVariant) || VARIANTS[0];

  return (
    <div className="w-full flex flex-col rounded-3xl bg-[#060711] border border-[#18192c] p-6 sm:p-8 space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141525] pb-6">
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A27FF3] shadow-[0_0_10px_#A27FF3]" />
            <h3 className="text-xl font-semibold text-white tracking-tight">
              Sidenav Profile & Footer Architecture Studio
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#A27FF3]/15 text-[#C4B5FD] border border-[#A27FF3]/30">
              5 Luxury Clean Variants
            </span>
          </div>
          <p className="text-xs text-[#8A8B9E] max-w-2xl">
            Compara y audiciona en vivo 5 conceptos ultra-limpios para la identidad del usuario y pie
            del Sidenav. Inspecciona la transición entre modo colapsado (64px) y expandido (240px)
            con tipografía real.
          </p>
        </div>

        {/* Live Controls: Toggle Hover & Name Input */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setIsSimulatedHover(!isSimulatedHover)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-2 ${
              isSimulatedHover
                ? "bg-[#A27FF3]/20 border-[#A27FF3]/50 text-white shadow-[0_0_15px_rgba(162,127,243,0.3)]"
                : "bg-[#111220] border-[#222438] text-[#8a8b9e] hover:text-white"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulatedHover ? "bg-[#4ade80]" : "bg-[#8a8b9e]"
              }`}
            />
            <span>{isSimulatedHover ? "Expanded (Hover: ON)" : "Collapsed (Hover: OFF)"}</span>
          </button>
        </div>
      </div>

      {/* Variant Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {VARIANTS.map((v) => {
          const isSelected = selectedVariant === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedVariant(v.id)}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? "bg-[#111225] border-[#A27FF3] shadow-[0_0_20px_rgba(162,127,243,0.2)]"
                  : "bg-[#090a16] border-[#16182a] hover:border-[#272944] hover:bg-[#0c0e1e]"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-[#A27FF3]/20 text-[#C4B5FD]"
                      : "bg-white/[0.04] text-[#6b6d85]"
                  }`}
                >
                  {v.badge}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]" />
                )}
              </div>
              <span
                className={`text-xs font-semibold tracking-wide truncate w-full ${
                  isSelected ? "text-white" : "text-[#9c9eb2] group-hover:text-white"
                }`}
              >
                {v.name}
              </span>
              <span className="text-[10.5px] text-[#6b6d85] line-clamp-2 mt-1 font-light leading-snug">
                {v.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Live Comparison Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Simulated Sidenav Component */}
        <div className="lg:col-span-6 flex justify-center items-center py-6 bg-[#030308] border border-[#141525] rounded-3xl min-h-[460px] relative overflow-hidden">
          {/* Subtle Ambient Violet Spotlight */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A27FF3]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Sidenav Mockup */}
          <aside
            onMouseEnter={() => setIsSimulatedHover(true)}
            onMouseLeave={() => setIsSimulatedHover(false)}
            className={`flex flex-col justify-between bg-[#05060c]/95 border border-[#111220] rounded-[32px] py-4 px-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none h-[400px] ${
              isSimulatedHover ? "w-60 px-4" : "w-16"
            }`}
          >
            {/* Top Brand / Logo */}
            <div className="flex flex-col items-center w-full space-y-3">
              <div className="w-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-2xl bg-[#080912] border border-[#231956] text-white flex items-center justify-center shrink-0 p-2">
                  <span className="text-xs font-bold tracking-widest text-[#A27FF3]">CEL</span>
                </div>
                {isSimulatedHover && (
                  <span className="ml-3 text-sm font-bold text-[#f8f8f8] tracking-[0.15em] uppercase">
                    CELAEST
                  </span>
                )}
              </div>

              <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

              {/* Mock Nav Items */}
              <div className="flex flex-col w-full space-y-1.5">
                <div
                  className={`flex items-center w-full py-2 rounded-xl bg-[#111220] text-white border border-[#231956]/60 ${
                    isSimulatedHover ? "px-3 justify-start" : "justify-center"
                  }`}
                >
                  <StudioVoiceMicIcon className="w-4 h-4 text-white" />
                  {isSimulatedHover && <span className="ml-3 text-xs font-medium">Interview</span>}
                </div>
                <div
                  className={`flex items-center w-full py-2 rounded-xl text-[#8a8b9e] hover:bg-[#111220]/50 ${
                    isSimulatedHover ? "px-3 justify-start" : "justify-center"
                  }`}
                >
                  <PrecisionOpenBookIcon className="w-4 h-4" />
                  {isSimulatedHover && <span className="ml-3 text-xs">Reading</span>}
                </div>
                <div
                  className={`flex items-center w-full py-2 rounded-xl text-[#8a8b9e] hover:bg-[#111220]/50 ${
                    isSimulatedHover ? "px-3 justify-start" : "justify-center"
                  }`}
                >
                  <CognitiveMemoryBrainIcon className="w-4 h-4" />
                  {isSimulatedHover && <span className="ml-3 text-xs">Memory</span>}
                </div>
              </div>
            </div>

            {/* DYNAMIC FOOTER VARIANT RENDERING */}
            <div className="flex flex-col items-center w-full space-y-2 mt-auto">
              <div className="w-8 h-[1px] bg-[#111220] my-0.5" />

              {/* VARIANT 1: PURE ZEN MINIMALIST */}
              {selectedVariant === "pure_minimal" && (
                <button
                  type="button"
                  className={`flex items-center w-full py-2.5 rounded-2xl text-[#f8f8f8]/60 hover:text-rose-400 hover:bg-[#111220] transition-all cursor-pointer group ${
                    isSimulatedHover ? "px-3.5 justify-start" : "justify-center"
                  }`}
                >
                  <LogoutMockIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {isSimulatedHover && (
                    <span className="ml-3 text-xs font-normal tracking-wide">Logout</span>
                  )}
                </button>
              )}

              {/* VARIANT 2: APPLE GLASS MONOGRAM */}
              {selectedVariant === "apple_glass" && (
                <div className="flex flex-col items-center w-full space-y-1">
                  <div
                    className={`flex items-center w-full py-2 rounded-2xl hover:bg-white/[0.04] transition-all cursor-pointer ${
                      isSimulatedHover ? "px-2 justify-start" : "justify-center"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-white text-xs font-medium shrink-0">
                      {customName.charAt(0)}
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#05060c]" />
                    </div>
                    {isSimulatedHover && (
                      <div className="flex flex-col items-start ml-3 overflow-hidden text-left">
                        <span className="text-xs font-medium text-white truncate">
                          {customName}
                        </span>
                        <span className="text-[9.5px] text-[#8a8b9e] font-light tracking-wide uppercase truncate">
                          {customLevel}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full py-1.5 rounded-xl text-[#8a8b9e] hover:text-rose-400 transition-colors ${
                      isSimulatedHover ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <LogoutMockIcon className="w-3.5 h-3.5" />
                    {isSimulatedHover && <span className="ml-3 text-[11px]">Logout</span>}
                  </button>
                </div>
              )}

              {/* VARIANT 3: LINEAR STEALTH MICRO-CARD */}
              {selectedVariant === "linear_stealth" && (
                <div className="flex flex-col items-center w-full space-y-1.5">
                  <div
                    className={`flex items-center w-full py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.14] transition-all cursor-pointer ${
                      isSimulatedHover ? "px-2.5 justify-between" : "justify-center px-1"
                    }`}
                  >
                    <div className="flex items-center overflow-hidden">
                      <div className="w-6 h-6 rounded-lg bg-[#141525] flex items-center justify-center text-[10px] font-mono font-bold text-white shrink-0">
                        {customName.charAt(0)}
                      </div>
                      {isSimulatedHover && (
                        <span className="ml-2.5 text-[11px] font-mono text-zinc-300 truncate">
                          {customName.toLowerCase().replace(/\s+/g, ".")}
                        </span>
                      )}
                    </div>
                    {isSimulatedHover && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                        {customLevel.split(" ")[0]}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full py-1 text-zinc-500 hover:text-rose-400 text-[10.5px] font-mono transition-colors ${
                      isSimulatedHover ? "px-2.5 justify-start" : "justify-center"
                    }`}
                  >
                    <LogoutMockIcon className="w-3 h-3" />
                    {isSimulatedHover && <span className="ml-2">exit</span>}
                  </button>
                </div>
              )}

              {/* VARIANT 4: RAYCAST DUAL ACTION */}
              {selectedVariant === "raycast_dual" && (
                <div className="flex flex-col items-center w-full space-y-1">
                  {isSimulatedHover ? (
                    <div className="flex items-center w-full gap-2">
                      <div className="flex items-center flex-1 py-1.5 px-2 rounded-xl bg-[#111220] border border-[#222438] text-white">
                        <div className="w-5 h-5 rounded-full bg-[#1e2038] flex items-center justify-center text-[10px]">
                          {customName.charAt(0)}
                        </div>
                        <span className="ml-2 text-[11px] truncate">{customName}</span>
                      </div>
                      <button
                        type="button"
                        className="p-2 rounded-xl bg-[#111220] border border-[#222438] text-zinc-400 hover:text-rose-400 transition-colors"
                        title="Logout"
                      >
                        <LogoutMockIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-[#111220] border border-[#222438] flex items-center justify-center text-white text-xs">
                        {customName.charAt(0)}
                      </div>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-500 hover:text-rose-400"
                        title="Logout"
                      >
                        <LogoutMockIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VARIANT 5: VELVET AMBIENT GLOW */}
              {selectedVariant === "velvet_ambient" && (
                <div className="flex flex-col items-center w-full space-y-1">
                  <div
                    className={`flex items-center w-full py-2 rounded-2xl hover:bg-[#A27FF3]/10 transition-all cursor-pointer ${
                      isSimulatedHover ? "px-2 justify-start" : "justify-center"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-[#161033] border border-[#A27FF3]/40 shadow-[0_0_12px_rgba(162,127,243,0.35)] flex items-center justify-center text-[#E0D4FC] text-xs font-semibold shrink-0">
                      {customName.charAt(0)}
                    </div>
                    {isSimulatedHover && (
                      <div className="flex flex-col items-start ml-3 overflow-hidden text-left">
                        <span className="text-xs font-medium text-[#F1EBFF] truncate">
                          {customName}
                        </span>
                        <span className="text-[9.5px] text-[#A27FF3] font-medium tracking-wide uppercase truncate">
                          {customLevel}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`flex items-center w-full py-1.5 rounded-xl text-[#8a8b9e] hover:text-rose-400 transition-colors ${
                      isSimulatedHover ? "px-3.5 justify-start" : "justify-center"
                    }`}
                  >
                    <LogoutMockIcon className="w-3.5 h-3.5" />
                    {isSimulatedHover && <span className="ml-3 text-[11px]">Logout</span>}
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Right: Architectural Analysis & Live Configurator */}
        <div className="lg:col-span-6 flex flex-col space-y-5 bg-[#080914] border border-[#16182a] rounded-3xl p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-[#A27FF3] uppercase">
              Architectural Rationale
            </span>
            <h4 className="text-lg font-semibold text-white">{currentMeta.name}</h4>
            <p className="text-xs text-[#9c9eb2] leading-relaxed">{currentMeta.description}</p>
          </div>

          {/* User Data Customizer for Live Simulation */}
          <div className="flex flex-col space-y-3 pt-2 border-t border-[#141525]">
            <span className="text-[11px] font-medium text-white">Simular Datos de Usuario:</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-[#6b6d85] font-mono">Nombre de Usuario</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-[#0e101f] border border-[#1c1e35] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#A27FF3]"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-[#6b6d85] font-mono">Nivel Calibrado</label>
                <input
                  type="text"
                  value={customLevel}
                  onChange={(e) => setCustomLevel(e.target.value)}
                  className="bg-[#0e101f] border border-[#1c1e35] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#A27FF3]"
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Comparison Table */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#141525]">
            <div className="p-3 rounded-xl bg-[#0c0d1b] border border-[#16172b] flex flex-col">
              <span className="text-[9.5px] text-[#6b6d85] uppercase font-mono">Espacio Libre</span>
              <span className="text-sm font-semibold text-emerald-400 mt-0.5">
                {selectedVariant === "pure_minimal" ? "100% Máximo" : "85% Óptimo"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0c0d1b] border border-[#16172b] flex flex-col">
              <span className="text-[9.5px] text-[#6b6d85] uppercase font-mono">Ruido Visual</span>
              <span className="text-sm font-semibold text-sky-400 mt-0.5">
                {selectedVariant === "pure_minimal" ? "0 (Cero)" : "Bajo (Micro)"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0c0d1b] border border-[#16172b] flex flex-col">
              <span className="text-[9.5px] text-[#6b6d85] uppercase font-mono">Acceso a Settings</span>
              <span className="text-sm font-semibold text-[#C4B5FD] mt-0.5">Vía Icono Nav</span>
            </div>
          </div>

          {/* Implementation Notice */}
          <div className="p-3.5 rounded-2xl bg-[#A27FF3]/10 border border-[#A27FF3]/25 flex items-start gap-3">
            <span className="text-[#A27FF3] text-sm">💡</span>
            <p className="text-[11px] text-[#DDD6FE] leading-relaxed">
              <strong>Estado Actual del Sidenav:</strong> Se ha implementado la opción{" "}
              <strong>Pure Zen Minimalist</strong> en la aplicación real, eliminando la cápsula
              pesada de perfil. Si prefieres alguna de las otras 4 variantes (Apple Glass, Linear,
              etc.), simplemente indícanoslo y la activaremos de inmediato.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoutMockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
