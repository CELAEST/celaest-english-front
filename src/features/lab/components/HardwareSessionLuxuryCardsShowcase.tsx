import React, { useState } from "react";
import { Mic, Shield, Lock, ArrowUpRight } from "lucide-react";
import { AiApiErrorType } from "./AiEngineErrorsLuxuryStudio";

interface HardwareSessionLuxuryCardsShowcaseProps {
  selectedScenario: AiApiErrorType;
  onSelectScenario: (err: AiApiErrorType) => void;
  onOpenModal: (err: AiApiErrorType) => void;
}

export type CardStyleVariant =
  | "apple-spatial-lens"
  | "bento-reactive-studio"
  | "horological-caliber"
  | "cyber-obsidian-blade";

export const HardwareSessionLuxuryCardsShowcase: React.FC<HardwareSessionLuxuryCardsShowcaseProps> = ({
  selectedScenario,
  onSelectScenario,
  onOpenModal,
}) => {
  const [activeCardStyle, setActiveCardStyle] = useState<CardStyleVariant>("apple-spatial-lens");

  // State for Bento reactive interactive micro-widgets
  const [isMicHovered, setIsMicHovered] = useState<boolean>(false);
  const [isShieldHovered, setIsShieldHovered] = useState<boolean>(false);
  const [isVaultHovered, setIsVaultHovered] = useState<boolean>(false);

  const CARDS_DATA = [
    {
      id: "mic-blocked-permission" as AiApiErrorType,
      tag: "MIC",
      category: "HARDWARE DE AUDIO",
      headline: "El acceso al micrófono está deshabilitado",
      subtext: "Tu navegador bloqueó la captura. Se resuelve con 1 clic en el ícono de candado.",
      statusText: "● Hardware Nativo",
      statusColor: "text-[#C4B5FD]",
      badge: "Web Audio API",
      telemetry: "LATENCIA: 12ms · DISP: DEFAULT",
      accentGrad: "from-[#7048E8]/20 via-[#C4B5FD]/5 to-transparent",
      accentBorder: "group-hover:border-[#C4B5FD]/40",
      accentGlow: "rgba(196,181,253,0.15)",
    },
    {
      id: "silence-ambient-hallucination" as AiApiErrorType,
      tag: "SHIELD",
      category: "ACÚSTICA PREVENTIVA",
      headline: "El micrófono detectó silencio o ruido ambiental",
      subtext: "Whisper captó estática de sala. El 0-Token Shield protegió tu turno sin penalización.",
      statusText: "● 0% Penalización",
      statusColor: "text-emerald-400",
      badge: "0-Token Shield",
      telemetry: "UMBRAL: 28 dB · RECHAZO: 100%",
      accentGrad: "from-sky-500/20 via-sky-300/5 to-transparent",
      accentBorder: "group-hover:border-sky-400/40",
      accentGlow: "rgba(56,189,248,0.15)",
    },
    {
      id: "jwt-expired-mid-interview" as AiApiErrorType,
      tag: "AUTH",
      category: "SEGURIDAD DE SESIÓN",
      headline: "Renovación transparente de tu sesión activa",
      subtext: "Tu credencial caducó. La bóveda local renovó tu token sin perder respuestas.",
      statusText: "● Cero Pérdida",
      statusColor: "text-emerald-400",
      badge: "Bóveda Cripto AES",
      telemetry: "SUPABASE · PREG 4/5 ACTIVA",
      accentGrad: "from-emerald-500/20 via-emerald-300/5 to-transparent",
      accentBorder: "group-hover:border-emerald-400/40",
      accentGlow: "rgba(52,211,153,0.15)",
    },
  ];

  return (
    <div className="w-full space-y-4 text-left select-none">
      {/* ── STYLE SELECTOR TABS HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase">
              EXPLORADOR DE CONCEPTOS UX/UI
            </span>
            <span className="text-white/20">·</span>
            <span className="text-[10px] font-mono text-emerald-400">4 Estilos Super Premium</span>
          </div>
          <h3 className="text-sm sm:text-base font-light text-white tracking-tight">
            Tarjetas de Resiliencia & Activadores de Modal
          </h3>
        </div>

        {/* Style Switcher Toolbar */}
        <div className="flex flex-wrap items-center p-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] gap-1">
          {[
            { id: "apple-spatial-lens", label: "★ Apple Spatial Lens" },
            { id: "bento-reactive-studio", label: "✦ Bento Reactivo con Live Widgets" },
            { id: "horological-caliber", label: "⏱ Horological Caliber" },
            { id: "cyber-obsidian-blade", label: "⚡ Cyber-Obsidian Blade" },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveCardStyle(style.id as CardStyleVariant)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                activeCardStyle === style.id
                  ? "bg-white text-black font-medium shadow-md shadow-white/10"
                  : "text-[#8A8A9E] hover:text-white"
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. STYLE VARIANT: APPLE SPATIAL PRISMATIC LENS ── */}
      {activeCardStyle === "apple-spatial-lens" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS_DATA.map((card) => {
            const isSelected = selectedScenario === card.id;
            return (
              <div
                key={card.id}
                onClick={() => {
                  onSelectScenario(card.id);
                  onOpenModal(card.id);
                }}
                className={`group relative p-6 rounded-3xl bg-[#04040A] border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between space-y-5 ${
                  isSelected
                    ? "border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] bg-gradient-to-b from-white/[0.04] to-[#04040A]"
                    : "border-white/[0.07] hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                {/* Specular Top Hairline */}
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all" />

                {/* Subtle Ambient Radial Glow on Hover */}
                <div
                  className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none"
                  style={{ background: card.accentGlow }}
                />

                {/* Card Header: Bespoke Vector Emblem + Tag */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] group-hover:border-white/20 flex items-center justify-center transition-all group-hover:scale-105 shadow-inner">
                    {card.id === "mic-blocked-permission" ? (
                      /* Broadcast Condenser Capsule Icon */
                      <svg className="w-6 h-6 text-[#C4B5FD]" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M5 10V11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M12 18V21M8 21H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="8.5" r="1" fill="currentColor" />
                      </svg>
                    ) : card.id === "silence-ambient-hallucination" ? (
                      /* 0-Token Acoustic Shield Icon */
                      <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2.5L4 6.2V11.8C4 16.8 7.4 20.3 12 21.5C16.6 20.3 20 16.8 20 11.8V6.2L12 2.5Z" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M8.5 12H15.5M10 9H14M10 15H14" stroke="currentColor" strokeOpacity="0.8" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    ) : (
                      /* Cryptographic Vault Keyhole Icon */
                      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="10" width="14" height="11" rx="4" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="15" r="1.5" fill="#E5C07B" />
                        <path d="M12 16.5V18" stroke="#E5C07B" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                      {card.tag}
                    </span>
                    <span className="text-[10px] font-mono text-white/50 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                      {card.badge}
                    </span>
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-2 relative z-10">
                  <h4 className="text-base font-light text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                    {card.headline}
                  </h4>
                  <p className="text-xs text-[#8E8EA8] font-light leading-relaxed">
                    {card.subtext}
                  </p>
                </div>

                {/* Footer Action Strip */}
                <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs relative z-10">
                  <span className={`text-[11px] font-mono ${card.statusColor} flex items-center gap-1.5`}>
                    {card.statusText}
                  </span>

                  <div className="flex items-center gap-1 text-white/70 group-hover:text-white text-xs font-medium group-hover:translate-x-0.5 transition-all">
                    <span>Simular Modal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 2. STYLE VARIANT: BENTO REACTIVE STUDIO (LIVE MICRO-WIDGETS) ── */}
      {activeCardStyle === "bento-reactive-studio" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Mic with Interactive Equalizer */}
          <div
            onClick={() => {
              onSelectScenario("mic-blocked-permission");
              onOpenModal("mic-blocked-permission");
            }}
            onMouseEnter={() => setIsMicHovered(true)}
            onMouseLeave={() => setIsMicHovered(false)}
            className="group relative p-6 rounded-3xl bg-[#030308] border border-white/[0.08] hover:border-[#C4B5FD]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_20px_50px_rgba(112,72,232,0.12)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#7048E8]/20 border border-[#7048E8]/40 text-[#C4B5FD]">
                HARDWARE MIC
              </span>
              <span className="text-[11px] font-mono text-white/40">1-Clic Desbloqueo</span>
            </div>

            {/* Interactive Live Audio Wave Visualizer */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] text-white/80 font-mono block">Canal de Audio</span>
                <span className="text-[10px] text-white/40 font-mono">
                  {isMicHovered ? "Muestreando 48kHz..." : "En espera de permiso"}
                </span>
              </div>
              <div className="flex items-center gap-1 h-6">
                {[20, 55, 80, 100, 70, 90, 45, 30].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isMicHovered ? "bg-[#C4B5FD]" : "bg-white/15"
                    }`}
                    style={{ height: isMicHovered ? `${h * 0.22 + 4}px` : "6px" }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white group-hover:text-[#C4B5FD] transition-colors">
                El acceso al micrófono está deshabilitado
              </h4>
              <p className="text-xs text-[#8E8EA8] font-light leading-relaxed">
                El navegador bloqueó la entrada de sonido. Pulsa para verificar el flujo de resolución.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-white/40 font-mono text-[11px]">Nativo 0 Latencia</span>
              <span className="text-[#C4B5FD] font-mono font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Abrir Modal</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Card 2: 0-Token Shield with Decibel Gauge */}
          <div
            onClick={() => {
              onSelectScenario("silence-ambient-hallucination");
              onOpenModal("silence-ambient-hallucination");
            }}
            onMouseEnter={() => setIsShieldHovered(true)}
            onMouseLeave={() => setIsShieldHovered(false)}
            className="group relative p-6 rounded-3xl bg-[#030308] border border-white/[0.08] hover:border-sky-400/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 border border-sky-500/40 text-sky-400">
                0-TOKEN SHIELD
              </span>
              <span className="text-[11px] font-mono text-emerald-400">0% Penalización</span>
            </div>

            {/* Interactive Decibel Gate Visualizer */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-white/60">Umbral de Habla:</span>
                <span className="text-sky-400 font-medium">
                  {isShieldHovered ? "28 dB (Filtrado)" : "28 dB Activo"}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isShieldHovered ? "w-2/3 bg-gradient-to-r from-sky-500 to-sky-300" : "w-1/4 bg-white/30"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white group-hover:text-sky-400 transition-colors">
                El micrófono detectó silencio o ruido ambiental
              </h4>
              <p className="text-xs text-[#8E8EA8] font-light leading-relaxed">
                Descarta paquetes mudos antes de invocar la red neuronal, protegiendo turnos y créditos.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-white/40 font-mono text-[11px]">Whisper v3 Guard</span>
              <span className="text-sky-400 font-mono font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Abrir Modal</span>
                <span>→</span>
              </span>
            </div>
          </div>

          {/* Card 3: Auth Vault with Ring Sync */}
          <div
            onClick={() => {
              onSelectScenario("jwt-expired-mid-interview");
              onOpenModal("jwt-expired-mid-interview");
            }}
            onMouseEnter={() => setIsVaultHovered(true)}
            onMouseLeave={() => setIsVaultHovered(false)}
            className="group relative p-6 rounded-3xl bg-[#030308] border border-white/[0.08] hover:border-emerald-400/40 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-[0_20px_50px_rgba(52,211,153,0.12)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                BÓVEDA CRIPTO
              </span>
              <span className="text-[11px] font-mono text-emerald-400">AES-256 Activo</span>
            </div>

            {/* Interactive Vault Sync Node */}
            <div className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                    isVaultHovered ? "bg-emerald-400/20 text-emerald-400" : "bg-white/[0.04] text-white/50"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-white font-mono block">Pregunta 4 de 5</span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {isVaultHovered ? "Guardado en Bóveda ✓" : "Sincronizado"}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded-lg bg-white/[0.04]">
                0% Pérdida
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                Renovación transparente de tu sesión activa
              </h4>
              <p className="text-xs text-[#8E8EA8] font-light leading-relaxed">
                El token JWT se renueva de forma transparente sin expulsar al usuario ni interrumpir la evaluación.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-white/40 font-mono text-[11px]">GoTrue Silent Refresh</span>
              <span className="text-emerald-400 font-mono font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Abrir Modal</span>
                <span>→</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. STYLE VARIANT: HOROLOGICAL CALIBER (WATCHMAKING PRECISION) ── */}
      {activeCardStyle === "horological-caliber" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          {CARDS_DATA.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                onSelectScenario(card.id);
                onOpenModal(card.id);
              }}
              className="group relative p-6 rounded-2xl bg-[#04040A] border border-white/[0.09] hover:border-[#E5C07B]/60 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4"
            >
              {/* Horological Corner Alignment Ticks */}
              <div className="absolute top-2 left-2 text-[9px] text-white/20 select-none">+</div>
              <div className="absolute top-2 right-2 text-[9px] text-white/20 select-none">+</div>
              <div className="absolute bottom-2 left-2 text-[9px] text-white/20 select-none">+</div>
              <div className="absolute bottom-2 right-2 text-[9px] text-white/20 select-none">+</div>

              <div className="flex items-center justify-between text-[10px] text-white/40 border-b border-white/[0.06] pb-2">
                <span>CALIBRE: {card.tag}</span>
                <span className="text-[#E5C07B]">{card.telemetry}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-light text-white group-hover:text-[#E5C07B] transition-colors leading-snug">
                  {card.headline}
                </h4>
                <p className="text-[11px] text-[#8E8EA8] font-light leading-relaxed">
                  {card.subtext}
                </p>
              </div>

              {/* Segmented Mechanical Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10.5px]">
                <span className="text-white/40 tracking-wider">[▮▮▮▮▮▯▯] READY</span>
                <span className="text-[#E5C07B] group-hover:underline flex items-center gap-1">
                  <span>DISPARAR MODAL</span>
                  <span>↗</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 4. STYLE VARIANT: CYBER-OBSIDIAN BLADE (FLOATING GLYPH WATERMARK) ── */}
      {activeCardStyle === "cyber-obsidian-blade" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS_DATA.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                onSelectScenario(card.id);
                onOpenModal(card.id);
              }}
              className="group relative p-7 rounded-3xl bg-[#020205] border border-white/[0.06] hover:border-white/20 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 overflow-hidden"
            >
              {/* Giant Watermark Glyph in Background */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-5 group-hover:opacity-20 transition-opacity text-white pointer-events-none">
                {card.id === "mic-blocked-permission" ? (
                  <Mic className="w-full h-full" />
                ) : card.id === "silence-ambient-hallucination" ? (
                  <Shield className="w-full h-full" />
                ) : (
                  <Lock className="w-full h-full" />
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase">
                  {card.category}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-shadow" />
              </div>

              <div className="space-y-2 relative z-10">
                <h4 className="text-lg font-extralight text-white tracking-tight leading-snug">
                  {card.headline}
                </h4>
                <p className="text-xs text-[#A7A7C0] font-light leading-relaxed">
                  {card.subtext}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between relative z-10">
                <span className="text-xs font-mono text-white/40">
                  {card.statusText}
                </span>
                <button className="px-4 py-1.5 rounded-xl bg-white text-black text-xs font-medium group-hover:bg-white/90 transition-all shadow-md">
                  Ver Solución →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
