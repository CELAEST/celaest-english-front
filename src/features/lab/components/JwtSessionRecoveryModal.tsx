import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface JwtSessionRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResume: () => void;
}

export type JwtModalVariant =
  | "apple-spatial-vault"
  | "enterprise-monolith"
  | "horological-chrono"
  | "cosmic-zen-capsule";

export const JwtSessionRecoveryModal: React.FC<JwtSessionRecoveryModalProps> = ({
  isOpen,
  onClose,
  onResume,
}) => {
  const [activeVariant, setActiveVariant] = useState<JwtModalVariant>("apple-spatial-vault");
  const [showTerminalLog, setShowTerminalLog] = useState<boolean>(false);
  const [showVaultAudit, setShowVaultAudit] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-3xl animate-[fadeIn_0.2s_ease-out]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-[#04040A] border border-white/[0.08] hover:border-white/[0.14] shadow-[0_32px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden select-none p-7 sm:p-8 flex flex-col space-y-6 text-left animate-[scaleUp_0.25s_ease-out]"
      >
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* ── TOP VARIANT SWITCHER TOOLBAR ── */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
          <span className="text-[10px] font-mono text-[#C4B5FD] uppercase tracking-wider">
            ESTUDIO UX/UI · 4 VARIANTES
          </span>

          {/* Clean Segmented Control (Zero Emojis, Pure Luxury Typography) */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] gap-1">
            {[
              { id: "apple-spatial-vault", label: "★ Spatial" },
              { id: "enterprise-monolith", label: "✦ Enterprise" },
              { id: "horological-chrono", label: "⏱ Horological" },
              { id: "cosmic-zen-capsule", label: "◈ Cosmic Zen" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVariant(v.id as JwtModalVariant)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-mono transition-all cursor-pointer ${
                  activeVariant === v.id
                    ? "bg-white text-black font-medium shadow-sm"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 1. VARIANT: APPLE SPATIAL CRYPTEX (VISIONOS HIGH GLASS)                   */}
        {/* ========================================================================= */}
        {activeVariant === "apple-spatial-vault" && (
          <div className="space-y-6">
            {/* Header: Bespoke Cryptex Node (NO bolitas verdes) */}
            <div className="flex items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group">
                <svg className="w-7 h-7 text-[#34D399]" viewBox="0 0 32 32" fill="none">
                  {/* Outer Precision Chamfered Shield */}
                  <path
                    d="M16 3L6 7.5V15C6 22 10.5 27 16 29C21.5 27 26 22 26 15V7.5L16 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="url(#spatialVaultAura)"
                  />
                  {/* Inner Cryptographic Keyway & Concentric Resonator */}
                  <circle cx="16" cy="14.5" r="4" stroke="#E5C07B" strokeWidth="1.4" />
                  <path d="M16 16.5V20M14 20H18" stroke="#E5C07B" strokeWidth="1.4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="spatialVaultAura" x1="6" y1="3" x2="26" y2="29" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#34D399" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#7048E8" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#34D399] uppercase block">
                  BÓVEDA CRIPTOGRÁFICA · SESIÓN ACTIVA
                </span>
                <h3 className="text-xl font-light text-white tracking-tight leading-snug">
                  Sesión renovada con éxito
                </h3>
              </div>
            </div>

            {/* Reassurance Message */}
            <p className="text-sm text-[#C5C6D0] font-light leading-relaxed">
              Tu token caducó durante la entrevista. La bóveda local renovó tu sesión de forma transparente. <strong className="text-white font-normal">Tu progreso y respuestas previas están 100% protegidos</strong>.
            </p>

            {/* Spatial Multi-Track Progress Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70 font-light">Progreso Preservado:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                  Pregunta 4 de 5 Intacta
                </span>
              </div>

              {/* Progress Stepper Track */}
              <div className="flex items-center gap-1.5 h-1.5">
                <div className="flex-1 h-full rounded-full bg-emerald-400" />
                <div className="flex-1 h-full rounded-full bg-emerald-400" />
                <div className="flex-1 h-full rounded-full bg-emerald-400" />
                <div className="flex-1 h-full rounded-full bg-emerald-400 animate-pulse" />
                <div className="flex-1 h-full rounded-full bg-white/15" />
              </div>

              {/* Audit Toggle */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-white/40">
                <span className="font-mono">Cifrado: AES-256 GCM</span>
                <button
                  onClick={() => setShowVaultAudit(!showVaultAudit)}
                  className="text-[#C4B5FD] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{showVaultAudit ? "Ocultar auditoría" : "Auditar bóveda local"}</span>
                  {showVaultAudit ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {showVaultAudit && (
                <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-[10.5px] font-mono space-y-1 text-white/60 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex justify-between">
                    <span>HASH TRANSACCIÓN:</span>
                    <span className="text-emerald-400">0x9c4a...7f2b (Válido)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>LATENCIA DE REFRESH:</span>
                    <span className="text-white/80">142 ms (Silencioso)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BUFFER DE AUDIO LOCAL:</span>
                    <span className="text-white/80">01:42 min guardado</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                0% Pérdida de Datos
              </span>

              <button
                onClick={onResume}
                className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
              >
                Reanudar Entrevista →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. VARIANT: ENTERPRISE ZERO-TRUST GATEWAY (LINEAR / STRIPE STANDARD)      */}
        {/* ========================================================================= */}
        {activeVariant === "enterprise-monolith" && (
          <div className="space-y-5">
            {/* Header: Hexagonal Gateway Vector */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shrink-0">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 32 32" fill="none">
                    {/* Outer Interlocking Hexagonal Gateway */}
                    <path d="M16 4L27 10.5V21.5L16 28L5 21.5V10.5L16 4Z" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.4" />
                    {/* Inner Dynamic Rotation Token Nodes */}
                    <path d="M16 9L23 13V19L16 23L9 19V13L16 9Z" stroke="#34D399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="rgba(52,211,153,0.08)" />
                    <circle cx="16" cy="16" r="2" fill="#E5C07B" />
                  </svg>
                </div>

                <div>
                  <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase block">
                    ENTERPRISE SECURITY RECOVERY
                  </span>
                  <h3 className="text-xl font-light text-white tracking-tight leading-snug">
                    Token Refrescado en Background
                  </h3>
                </div>
              </div>

              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                200 OK
              </span>
            </div>

            <p className="text-xs text-[#A7A7C0] font-light leading-relaxed">
              La credencial de Supabase caducó durante la sesión. El protocolo silencioso de GoTrue reconectó el canal sin recargar la página.
            </p>

            {/* Dual Enterprise Metric Panels */}
            <div className="grid grid-cols-2 gap-3 py-1">
              <div className="p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">SESIÓN SUPABASE</span>
                <span className="text-sm font-mono text-emerald-400 font-medium">RECONECTADA</span>
                <span className="text-[10px] text-white/40 font-mono block">Cero downtime</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.06] space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">BUFFER DE VOZ</span>
                <span className="text-sm font-mono text-white font-medium">CONGELADO</span>
                <span className="text-[10px] text-white/40 font-mono block">Respuesta 4 segura</span>
              </div>
            </div>

            {/* Interactive Terminal Telemetry Toggle */}
            <div className="space-y-2">
              <button
                onClick={() => setShowTerminalLog(!showTerminalLog)}
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/15 flex items-center justify-between text-xs font-mono text-white/60 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <Terminal className="w-3.5 h-3.5 text-[#C4B5FD]" />
                  <span>Ver registro criptográfico de consola</span>
                </div>
                {showTerminalLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTerminalLog && (
                <div className="p-3 rounded-xl bg-black/80 border border-emerald-500/20 font-mono text-[10px] text-emerald-400/90 space-y-1 animate-[fadeIn_0.15s_ease-out]">
                  <div>&gt; [AUTH] Access token expired at 21:35:12 UTC</div>
                  <div>&gt; [VAULT] Invoking GoTrue silent refresh endpoint...</div>
                  <div>&gt; [VAULT] HTTP 200 OK — New JWT re-keyed in memory</div>
                  <div>&gt; [VAULT] Audio snapshot preserved at byte offset #84920</div>
                  <div className="text-white/60">&gt; Session seamless: candidate ready to continue.</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#8E8EA8] font-light">
                No necesitas volver a iniciar sesión.
              </span>
              <button
                onClick={onResume}
                className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
              >
                Continuar sin Interrupción →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. VARIANT: HOROLOGICAL CHRONO-VAULT (WATCHMAKING CALIBER)                */}
        {/* ========================================================================= */}
        {activeVariant === "horological-chrono" && (
          <div className="space-y-6 font-mono">
            {/* Top Horological Corner Marks */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px] text-white/40">
              <span>CALIBRE: CHRONO-VAULT 24K</span>
              <span className="text-[#E5C07B]">STATUS: SYNCHRONIZED</span>
            </div>

            {/* Mechanical Chrono Escapement Centerpiece */}
            <div className="py-2 flex items-center justify-center">
              <div className="relative w-28 h-28 rounded-full border border-[#E5C07B]/30 flex items-center justify-center p-2 bg-[#E5C07B]/[0.02]">
                <div className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 w-1.5 h-1.5 rounded-full bg-[#E5C07B]" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-sm font-light text-white">4 / 5</span>
                  <span className="text-[9px] text-[#E5C07B] uppercase tracking-wider">Preguntas</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-center">
              <h4 className="text-base font-light text-white tracking-tight">
                Sincronización Criptográfica Perfecta
              </h4>
              <p className="text-xs text-white/50 font-light leading-relaxed max-w-sm mx-auto">
                La firma de sesión fue renovada. Tu línea temporal de respuestas está sellada y lista para evaluación.
              </p>
            </div>

            {/* Mechanical Telemetry Strip */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[11px]">
              <span className="text-white/40">[▮▮▮▮▮▯▯] VAULT_OK</span>
              <span className="text-[#E5C07B]">TTL: 3600S EXTENDIDO</span>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-white/40">0% DATA CORRUPTION</span>
              <button
                onClick={onResume}
                className="px-6 py-2.5 rounded-xl bg-[#E5C07B] text-black text-xs font-semibold hover:bg-[#E5C07B]/90 transition-all cursor-pointer shadow-lg"
              >
                REANUDAR EVALUACIÓN ↗
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. VARIANT: COSMIC ZEN CAPSULE (MINIMAL ORGANIC HARMONY)                  */}
        {/* ========================================================================= */}
        {activeVariant === "cosmic-zen-capsule" && (
          <div className="space-y-6 text-center py-2">
            {/* Luminescent Mobius Ribbon & Harmony Vector Emblem */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shadow-[0_0_40px_rgba(112,72,232,0.25)]">
                <svg className="w-8 h-8 text-[#C4B5FD]" viewBox="0 0 32 32" fill="none">
                  {/* Fluid Organic Double Loop */}
                  <path
                    d="M8 16C8 12 11 9 16 9C21 9 24 12 24 16C24 20 21 23 16 23C11 23 8 20 8 16Z"
                    stroke="url(#zenMobiusGrad)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="3" fill="#34D399" fillOpacity="0.8" />
                  <defs>
                    <linearGradient id="zenMobiusGrad" x1="8" y1="9" x2="24" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#C4B5FD" />
                      <stop offset="0.5" stopColor="#7048E8" />
                      <stop offset="1" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-light text-white tracking-tight">
                Todo sigue en su lugar
              </h3>
              <p className="text-sm text-[#C5C6D0] font-light max-w-sm mx-auto leading-relaxed">
                Tu concentración es lo único que importa. El sistema protegió tu respuesta y refrescó tus credenciales en un parpadeo.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Pregunta 4 preservada · 0% Pérdida</span>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={onResume}
                className="px-8 py-3 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
              >
                Continuar con tu Práctica
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
