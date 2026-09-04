import React, { useState, useEffect } from "react";
import { X, ExternalLink, Info, ArrowRight, ShieldCheck } from "lucide-react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { AiInfrastructureRecoveryModal } from "./AiInfrastructureRecoveryModal";
import { MicHardwareRecoveryModal } from "./MicHardwareRecoveryModal";
import { SilenceShieldLuxuryModal } from "./SilenceShieldLuxuryModal";
import { JwtSessionRecoveryModal } from "./JwtSessionRecoveryModal";
import { HardwareSessionLuxuryCardsShowcase } from "./HardwareSessionLuxuryCardsShowcase";

export type SimulationCategory = "all" | "infra" | "acoustic" | "security";

export type AiApiErrorType =
  // 1. Infraestructura & Proveedores de IA
  | "rate-limit-429"
  | "keys-exhausted-pool"
  | "invalid-key-401"
  | "gateway-timeout-504"
  | "server-outage-503"
  // 2. Acústica & Hardware (Audio / Whisper)
  | "mic-blocked-permission"
  | "silence-ambient-hallucination"
  // 3. Seguridad & Sesión
  | "jwt-expired-mid-interview";

export type MasterVariantId =
  | "pure-horological"
  | "apple-spatial-clean"
  | "apple-spatial-guided"
  | "apple-spatial-multikey"
  | "apple-spatial-bespoke-icons"
  | "enterprise-fluid-monolith"
  | "cosmic-zen-capsule";

export interface ErrorScenarioData {
  id: AiApiErrorType;
  category: SimulationCategory;
  categoryLabel: string;
  httpLabel: string;
  codeName: string;
  humanHeadline: string;
  humanSubtext: string;
  reassurance: string;
  cooldownDefault: number;
  bufferWords: number;
  dial1Label: string;
  dial1Value: string;
  dial1Subtext: string;
  dial2Label: string;
  dial2Value: string;
  dial2Subtext: string;
  specialActionType?:
    "provider-swap" | "mic-test" | "resume-english" | "star-expand" | "celebrate" | "re-auth";
}

export function getDynamicUtcResetText(): string {
  const now = new Date();
  const nextUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0),
  );
  const diffMs = nextUtc.getTime() - now.getTime();
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  return `Reinicio de cuota en ${hours}h ${minutes}m (UTC 00:00)`;
}

export const ERROR_DATA: Record<AiApiErrorType, ErrorScenarioData> = {
  "rate-limit-429": {
    id: "rate-limit-429",
    category: "infra",
    categoryLabel: "Infraestructura & IA",
    httpLabel: "429",
    codeName: "RATE_LIMIT_COOLDOWN",
    humanHeadline: "El clúster de IA está en ciclo de enfriamiento",
    humanSubtext:
      "Alta concurrencia en los servidores compartidos de inferencia. La reanudación es automática.",
    reassurance: "Tu respuesta hablada está 100% a salvo y congelada en memoria local.",
    cooldownDefault: 14,
    bufferWords: 48,
    dial1Label: "TU AUDIO",
    dial1Value: "01:42 min",
    dial1Subtext: "100% seguro en memoria",
    dial2Label: "REANUDACIÓN",
    dial2Value: "seg",
    dial2Subtext: "Automática sin tocar nada",
    specialActionType: "provider-swap",
  },
  "keys-exhausted-pool": {
    id: "keys-exhausted-pool",
    category: "infra",
    categoryLabel: "Infraestructura & IA",
    httpLabel: "POOL",
    codeName: "AI_KEYS_EXHAUSTED",
    humanHeadline: "Límite diario alcanzado en el clúster público",
    humanSubtext:
      "Todas las claves del pool compartido completaron su cupo de hoy. Puedes continuar al instante activando Groq gratis.",
    reassurance:
      "Tu audio permanece cifrado en tu navegador. Solo ingresa una clave gratuita para continuar.",
    cooldownDefault: 0,
    bufferWords: 52,
    dial1Label: "POOL PÚBLICO",
    dial1Value: "100% AGOTADO",
    dial1Subtext: getDynamicUtcResetText(),
    dial2Label: "BYPASS VIP",
    dial2Value: "GROQ GRATIS",
    dial2Subtext: "Sin esperas ni tarjeta",
    specialActionType: "provider-swap",
  },
  "invalid-key-401": {
    id: "invalid-key-401",
    category: "infra",
    categoryLabel: "Infraestructura & IA",
    httpLabel: "401",
    codeName: "AUTH_DECLINED",
    humanHeadline: "Tu clave privada de IA no pudo ser verificada",
    humanSubtext:
      "El proveedor reportó que la clave expiró o no tiene saldo. Puedes cambiar a Groq gratis con un solo clic.",
    reassurance: "Tu respuesta está segura en tu navegador y continuará automáticamente.",
    cooldownDefault: 0,
    bufferWords: 42,
    dial1Label: "ESTADO CLAVE",
    dial1Value: "NO VÁLIDA",
    dial1Subtext: "Error de autenticación",
    dial2Label: "RESPALDO",
    dial2Value: "DISPONIBLE",
    dial2Subtext: "Groq 100% Gratuito",
    specialActionType: "provider-swap",
  },
  "gateway-timeout-504": {
    id: "gateway-timeout-504",
    category: "infra",
    categoryLabel: "Infraestructura & IA",
    httpLabel: "504",
    codeName: "GATEWAY_TIMEOUT",
    humanHeadline: "La conexión de red tardó más de lo habitual",
    humanSubtext:
      "Hubo una fluctuación en la conexión mientras transmitías tus datos, pero tu grabación sigue intacta.",
    reassurance: "Tu micrófono y transcripción están guardados en tu navegador sin ningún corte.",
    cooldownDefault: 8,
    bufferWords: 34,
    dial1Label: "PAQUETES LOCALES",
    dial1Value: "100% RETENIDOS",
    dial1Subtext: "Cero pérdida de voz",
    dial2Label: "AUTO-REINTENTO",
    dial2Value: "seg",
    dial2Subtext: "Conexión reestablecida",
    specialActionType: "provider-swap",
  },
  "server-outage-503": {
    id: "server-outage-503",
    category: "infra",
    categoryLabel: "Infraestructura & IA",
    httpLabel: "503",
    codeName: "CLUSTER_OUTAGE",
    humanHeadline: "Mantenimiento temporal del servidor de IA",
    humanSubtext:
      "El clúster central se está actualizando. Puedes desviar tu respuesta en 1 clic a otro modelo.",
    reassurance:
      "No tienes que volver a hablar; el motor de respaldo puede evaluarte de inmediato.",
    cooldownDefault: 18,
    bufferWords: 55,
    dial1Label: "NODO REMOTO",
    dial1Value: "ACTUALIZANDO",
    dial1Subtext: "Cluster en mantenimiento",
    dial2Label: "IA ALTERNATIVA",
    dial2Value: "LISTA",
    dial2Subtext: "Failover inmediato",
    specialActionType: "provider-swap",
  },
  "mic-blocked-permission": {
    id: "mic-blocked-permission",
    category: "acoustic",
    categoryLabel: "Hardware & Acústica",
    httpLabel: "MIC",
    codeName: "MIC_PERMISSION_DENIED",
    humanHeadline: "El acceso al micrófono está deshabilitado",
    humanSubtext:
      "Tu navegador no tiene permiso para capturar audio. Solo necesitas presionar el ícono de candado para activarlo.",
    reassurance:
      "No se requiere reiniciar la sesión; el sistema detectará el micrófono en tiempo real.",
    cooldownDefault: 0,
    bufferWords: 0,
    dial1Label: "PERMISOS",
    dial1Value: "BLOQUEADO",
    dial1Subtext: "Navegador / Sistema",
    dial2Label: "DESBLOQUEO",
    dial2Value: "1 CLIC",
    dial2Subtext: "Ícono de candado 🔒",
    specialActionType: "mic-test",
  },
  "silence-ambient-hallucination": {
    id: "silence-ambient-hallucination",
    category: "acoustic",
    categoryLabel: "Hardware & Acústica",
    httpLabel: "SHIELD",
    codeName: "SILENCE_FILTERED",
    humanHeadline: "El micrófono detectó silencio o ruido ambiental",
    humanSubtext:
      "Whisper captó estática de fondo sin voz inteligible. El 0-Token Shield protegió tu turno sin penalizaciones.",
    reassurance:
      "Tu puntaje se mantiene intacto. Solo habla con un volumen constante para registrar tu respuesta.",
    cooldownDefault: 0,
    bufferWords: 0,
    dial1Label: "SEÑAL ACÚSTICA",
    dial1Value: "ESTÁTICA AMBIENTAL",
    dial1Subtext: "Filtrado por 0-Token Shield",
    dial2Label: "PENALIZACIÓN",
    dial2Value: "0% (NEUTRAL)",
    dial2Subtext: "Turno sin penalización",
    specialActionType: "mic-test",
  },
  "jwt-expired-mid-interview": {
    id: "jwt-expired-mid-interview",
    category: "security",
    categoryLabel: "Sesión & Bóveda",
    httpLabel: "AUTH",
    codeName: "JWT_SESSION_REFRESH",
    humanHeadline: "Renovación transparente de tu sesión activa",
    humanSubtext:
      "Tu credencial de autenticación caducó mientras respondías. La bóveda local protegió tu avance en la pregunta 4 de 5.",
    reassurance:
      "Se refrescó tu sesión sin reiniciar la entrevista ni perder ninguna de tus respuestas previas.",
    cooldownDefault: 0,
    bufferWords: 76,
    dial1Label: "SESIÓN SUPABASE",
    dial1Value: "TOKEN REFRESCADO",
    dial1Subtext: "Renovación silenciosa",
    dial2Label: "PROGRESO PRESERVADO",
    dial2Value: "4 / 5 PREGUNTAS",
    dial2Subtext: "Cero pérdida de datos",
    specialActionType: "re-auth",
  },
};

interface ProviderOption {
  id: AiProviderId;
  name: string;
  badge: string;
  placeholder: string;
  url: string;
  isFree: boolean;
}

const PROVIDERS: ProviderOption[] = [
  {
    id: "groq",
    name: "Groq",
    badge: "Recomendada",
    placeholder: "gsk_...",
    url: "https://console.groq.com/keys",
    isFree: true,
  },
  {
    id: "grok",
    name: "Grok",
    badge: "$25 Gratis",
    placeholder: "xai-...",
    url: "https://console.x.ai/",
    isFree: true,
  },
  {
    id: "openai",
    name: "OpenAI",
    badge: "GPT-4o",
    placeholder: "sk-proj-...",
    url: "https://platform.openai.com/api-keys",
    isFree: false,
  },
  {
    id: "anthropic",
    name: "Claude",
    badge: "3.5 Sonnet",
    placeholder: "sk-ant-...",
    url: "https://console.anthropic.com/settings/keys",
    isFree: false,
  },
  {
    id: "gemini",
    name: "Gemini",
    badge: "Flash Gratis",
    placeholder: "AIza...",
    url: "https://aistudio.google.com/apikey",
    isFree: true,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    badge: "V3",
    placeholder: "sk-...",
    url: "https://platform.deepseek.com/api_keys",
    isFree: false,
  },
];

export const AiEngineErrorsLuxuryStudio: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<AiApiErrorType>("mic-blocked-permission");
  const [activeVariant, setActiveVariant] = useState<MasterVariantId>(
    "apple-spatial-bespoke-icons",
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [cooldown, setCooldown] = useState<number>(14);
  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>("groq");
  const [keyInput, setKeyInput] = useState<string>("");
  const [isInfoHovered, setIsInfoHovered] = useState<boolean>(false);
  const [isMultiInfoHovered, setIsMultiInfoHovered] = useState<boolean>(false);
  const [savedKeyProvider, setSavedKeyProvider] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  const scenario = ERROR_DATA[selectedScenario] || ERROR_DATA["rate-limit-429"];
  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const infraKeys: AiApiErrorType[] = [
    "rate-limit-429",
    "keys-exhausted-pool",
    "invalid-key-401",
    "gateway-timeout-504",
    "server-outage-503",
  ];

  useEffect(() => {
    setCooldown(scenario.cooldownDefault || 0);
    setIsResolved(false);
  }, [selectedScenario]);

  useEffect(() => {
    if (cooldown <= 0 || isResolved || !isModalOpen) return;
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          setIsResolved(true);
          setTimeout(() => setIsModalOpen(false), 1200);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown, isResolved, isModalOpen]);

  const handleOpenModal = (err: AiApiErrorType) => {
    setSelectedScenario(err);
    setIsModalOpen(true);
  };

  const handleImmediateResume = () => {
    setIsResolved(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 1100);
  };

  const handleSaveAndActivateKey = () => {
    if (!keyInput.trim()) {
      handleImmediateResume();
      return;
    }
    setSavedKeyProvider(currentProvider.name);
    setTimeout(() => {
      handleImmediateResume();
    }, 800);
  };

  return (
    <div className="w-full flex flex-col space-y-8 select-none">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase">
            <span>LABORATORIO DE RESILIENCIA · 8 CASOS REALES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Simulador Maestro de Casos y Errores del Sistema
          </h2>
          <p className="text-xs sm:text-sm text-[#8E8EA8] max-w-2xl font-light leading-relaxed">
            Auditoría exhaustiva de todos los casos reales de infraestructura y hardware en CELAEST:
            cuotas de IA, caídas de red, calibración de micrófono, alucinaciones de silencio en
            Whisper y renovación criptográfica de sesión.
          </p>
        </div>

        {/* Navigation Tabs de Variantes */}
        <div className="flex flex-wrap items-center p-1 rounded-2xl bg-white/[0.02] border border-white/[0.08] gap-1 self-start lg:self-end">
          {[
            { id: "apple-spatial-bespoke-icons", label: "★ Apple Vision con Iconos (Oficial)" },
            { id: "apple-spatial-multikey", label: "Apple Vision Multi-Key Pro" },
            { id: "apple-spatial-guided", label: "Apple Vision Asistido (Base)" },
            { id: "apple-spatial-clean", label: "Apple Vision Pure Glass" },
            { id: "pure-horological", label: "Monolito Original" },
            { id: "enterprise-fluid-monolith", label: "Linear / Stripe Enterprise" },
            { id: "cosmic-zen-capsule", label: "Cosmos Minimal Capsule" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveVariant(tab.id as MasterVariantId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                activeVariant === tab.id
                  ? "bg-white text-black font-medium shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  : "text-[#8A8A9E] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 1: SUITE DE INFRAESTRUCTURA & IA (5 CASOS CONSOLIDADOS)           */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3 text-left">
          <div className="flex items-center space-x-3">
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm text-amber-400 font-mono shrink-0">
              ⚡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-medium text-white tracking-tight">
                  Infraestructura & Clúster de IA
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  ✓ 5 Casos Finalizados
                </span>
              </div>
              <p className="text-xs text-[#8E8EA8] font-light">
                Modelos de recuperación con los 6 proveedores oficiales (Groq Recomendada, Grok,
                OpenAI, Claude, Gemini, DeepSeek).
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-white/40 self-end sm:self-center">
            Modal Blindado · Componente Independiente
          </span>
        </div>

        {/* Grid de los 5 casos de Infraestructura */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {infraKeys.map((errKey) => {
            const cfg = ERROR_DATA[errKey];
            const isSelected = selectedScenario === errKey;
            return (
              <div
                key={errKey}
                onClick={() => handleOpenModal(errKey)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden text-left group ${
                  isSelected
                    ? "bg-[#0a0a14] border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.06)]"
                    : "bg-[#030308] border-white/[0.06] hover:border-white/12 hover:bg-[#06060c]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">
                    {cfg.httpLabel}
                  </span>
                  <span className="text-[9.5px] font-mono text-amber-400/80 uppercase tracking-widest">
                    Infraestructura
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-white leading-snug group-hover:text-amber-400 transition-colors">
                    {cfg.humanHeadline}
                  </h4>
                  <p className="text-[11px] text-[#8E8EA8] font-light line-clamp-2 leading-relaxed">
                    {cfg.humanSubtext}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                  <span className="text-[10px] font-mono text-white/30 truncate max-w-[130px]">
                    {cfg.codeName}
                  </span>
                  <span className="text-amber-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver modal</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN 2: HARDWARE ACÚSTICO & SEGURIDAD DE SESIÓN (3 CASOS FINALIZADOS)  */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* SECCIÓN 2: HARDWARE ACÚSTICO & SEGURIDAD DE SESIÓN (4 ESTILOS SUPER PREMIUM) */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-6">
        <HardwareSessionLuxuryCardsShowcase
          selectedScenario={selectedScenario}
          onSelectScenario={(err) => setSelectedScenario(err)}
          onOpenModal={(err) => handleOpenModal(err)}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {/* EL MODAL REAL DE PRODUCCIÓN                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <>
          {/* ========================================================================= */}
          {scenario.category === "infra" && activeVariant === "apple-spatial-bespoke-icons" ? (
            <AiInfrastructureRecoveryModal
              isOpen={isModalOpen}
              scenario={scenario}
              cooldown={cooldown}
              onClose={() => setIsModalOpen(false)}
              onImmediateResume={handleImmediateResume}
            />
          ) : scenario.id === "mic-blocked-permission" ? (
            <MicHardwareRecoveryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onResume={handleImmediateResume}
            />
          ) : scenario.id === "silence-ambient-hallucination" ? (
            <SilenceShieldLuxuryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onResume={handleImmediateResume}
            />
          ) : scenario.id === "jwt-expired-mid-interview" ? (
            <JwtSessionRecoveryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onResume={handleImmediateResume}
            />
          ) : (
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) setIsModalOpen(false);
              }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-3xl animate-[fadeIn_0.25s_ease-out]"
            >
              {/* ========================================================================= */}
              {/* 2. CASOS NO-INFRAESTRUCTURA: HARDWARE, PEDAGOGÍA, SESIÓN (BESPOKE ICONS)  */}
              {/* ========================================================================= */}
              {activeVariant === "apple-spatial-bespoke-icons" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-xl rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none p-8 sm:p-9 flex flex-col space-y-6 text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  {/* Top Specular Hairline matching Reading/Writing Card Standard */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
                        RECUPERACIÓN INTELIGENTE · CELAEST LINGUA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Natural Human Subtext */}
                  <p className="text-xs text-[#C5C6D0] font-light leading-relaxed">
                    {scenario.humanSubtext}
                  </p>

                  {/* Minimalist Dual Pill Dials Centrados Adaptativos */}
                  <div className="grid grid-cols-2 gap-3.5 py-1">
                    <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-1 text-center">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                        {scenario.dial1Label}
                      </span>
                      <div className="text-xl sm:text-2xl font-mono text-white font-light">
                        {scenario.dial1Value}
                      </div>
                      <span className="text-[11px] text-white/50 font-mono block">
                        {scenario.dial1Subtext}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-1 text-center">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                        {scenario.dial2Label}
                      </span>
                      <div className="text-xl sm:text-2xl font-mono text-white font-light">
                        {cooldown > 0 ? `${cooldown} seg` : scenario.dial2Value}
                      </div>
                      <span className="text-[11px] text-white/50 font-mono block">
                        {scenario.dial2Subtext}
                      </span>
                    </div>
                  </div>

                  {/* Contextual Reassurance Line */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.015] border border-white/[0.04] text-[11px] text-[#C5C6D0] font-light flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFD600] shrink-0 shadow-[0_0_8px_rgba(255,170,0,0.6)]" />
                    <span>{scenario.reassurance}</span>
                  </div>



                  {/* Bottom Action Adaptativo */}
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#8E8EA8] font-light">
                      {scenario.category === "acoustic"
                        ? "Tu hardware se calibra automáticamente."
                        : "No toques nada: continuará solo."}
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg flex items-center gap-2"
                    >
                      <span>
                        {isResolved
                          ? "Continuando..."
                          : scenario.specialActionType === "mic-test"
                            ? "Probar Micrófono"
                            : scenario.specialActionType === "resume-english"
                              ? "Reanudar en Inglés"
                              : scenario.specialActionType === "celebrate"
                                ? "Siguiente Pregunta"
                                : scenario.specialActionType === "re-auth"
                                  ? "Guardar y Continuar"
                                  : "Reanudar Ahora"}
                      </span>
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 2. APPLE VISION MULTI-KEY PRO (La Variante Anterior)     */}
              {/* ========================================================= */}
              {activeVariant === "apple-spatial-multikey" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-[#04040A]/95 border border-white/[0.08] shadow-[0_40px_130px_rgba(0,0,0,0.99)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
                        RECUPERACIÓN INTELIGENTE · CELAEST LINGUA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#C5C6D0] font-light leading-relaxed">
                    {scenario.humanSubtext}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        TU AUDIO
                      </span>
                      <div className="text-xl font-mono text-white">01:42 min</div>
                      <span className="text-[11px] text-white/50 font-mono">100% seguro</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        REANUDACIÓN
                      </span>
                      <div className="text-xl font-mono text-white">{cooldown} seg</div>
                      <span className="text-[11px] text-white/50 font-mono">Automática</span>
                    </div>
                  </div>

                  <div className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8E8EA8]">Selecciona proveedor de clave:</span>
                        <span className="text-[10px] font-mono text-white/40">
                          {currentProvider.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                        {PROVIDERS.map((prov) => {
                          const isActive = selectedProvider === prov.id;
                          return (
                            <button
                              key={prov.id}
                              onClick={() => {
                                setSelectedProvider(prov.id);
                                setKeyInput("");
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                                isActive
                                  ? "bg-white text-black font-medium shadow-sm"
                                  : "bg-white/[0.03] text-white/60 hover:text-white border border-white/[0.06]"
                              }`}
                            >
                              {prov.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-[#8E8EA8]">
                        <div className="flex items-center space-x-1.5">
                          <span>Clave de {currentProvider.name} (Opcional):</span>
                          <div
                            className="relative inline-flex items-center cursor-pointer"
                            onMouseEnter={() => setIsMultiInfoHovered(true)}
                            onMouseLeave={() => setIsMultiInfoHovered(false)}
                            onClick={() => setIsMultiInfoHovered(!isMultiInfoHovered)}
                          >
                            <Info className="w-3.5 h-3.5 text-[#C4B5FD] hover:text-white transition-colors" />

                            {isMultiInfoHovered && (
                              <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 p-4 rounded-2xl bg-[#090914] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 text-left space-y-2.5 backdrop-blur-2xl animate-[fadeIn_0.15s_ease-out]">
                                <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                                  <span className="text-[11px] font-medium text-white">
                                    ¿Cómo obtener tu clave de {currentProvider.name}?
                                  </span>
                                  <span className="text-[9px] font-mono text-emerald-400 uppercase">
                                    {currentProvider.isFree ? "100% Gratis" : "API Propia"}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#A7A7C0] leading-relaxed font-light">
                                  Es muy sencillo y solo te toma unos segundos:
                                </p>
                                <ol className="text-[11px] text-[#C5C6D0] space-y-1.5 list-decimal list-inside font-light">
                                  <li>
                                    Haz clic en el enlace{" "}
                                    <strong className="text-white underline font-medium">
                                      "
                                      {currentProvider.isFree
                                        ? "Obtener gratis ↗"
                                        : "Crear clave ↗"}
                                      "
                                    </strong>{" "}
                                    que ves aquí a la derecha.
                                  </li>
                                  <li>Inicia sesión con tu cuenta habitual (Google o GitHub).</li>
                                  <li>
                                    Presiona{" "}
                                    <strong className="text-white font-medium">
                                      "Create API Key"
                                    </strong>
                                    .
                                  </li>
                                  <li>Copia tu código y pégalo en esta casilla.</li>
                                </ol>
                                <div className="pt-1.5 border-t border-white/[0.06] text-[10px] text-white/40">
                                  Tu clave se cifra de forma local en tu navegador.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <a
                          href={currentProvider.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#C4B5FD] hover:text-white underline text-[11px] transition-colors"
                        >
                          {currentProvider.isFree ? "Obtener gratis ↗" : "Crear clave ↗"}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          placeholder={`Pega tu clave ${currentProvider.placeholder}`}
                          value={keyInput}
                          onChange={(e) => setKeyInput(e.target.value)}
                          className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-white/20 outline-none font-mono"
                        />
                        <button
                          onClick={handleSaveAndActivateKey}
                          className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium cursor-pointer transition-all shrink-0"
                        >
                          {savedKeyProvider ? "¡Activada!" : "Activar"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#8E8EA8] font-light">
                      No toques nada: continuará solo.
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      {isResolved ? "Continuando..." : "Reanudar Ahora"}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 3. BASE: APPLE VISION ASISTIDO (Intacto)                  */}
              {/* ========================================================= */}
              {activeVariant === "apple-spatial-guided" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-[#04040A]/95 border border-white/[0.08] shadow-[0_40px_130px_rgba(0,0,0,0.99)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
                        RECUPERACIÓN INTELIGENTE · CELAEST LINGUA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#C5C6D0] font-light leading-relaxed">
                    {scenario.humanSubtext}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        TU AUDIO
                      </span>
                      <div className="text-xl font-mono text-white">01:42 min</div>
                      <span className="text-[11px] text-white/50 font-mono">100% seguro</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        REANUDACIÓN
                      </span>
                      <div className="text-xl font-mono text-white">{cooldown} seg</div>
                      <span className="text-[11px] text-white/50 font-mono">Automática</span>
                    </div>
                  </div>

                  <div className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#8E8EA8]">
                      <div className="flex items-center space-x-1.5">
                        <span>Clave privada de Groq (Opcional):</span>
                        <div
                          className="relative inline-flex items-center cursor-pointer"
                          onMouseEnter={() => setIsInfoHovered(true)}
                          onMouseLeave={() => setIsInfoHovered(false)}
                          onClick={() => setIsInfoHovered(!isInfoHovered)}
                        >
                          <Info className="w-3.5 h-3.5 text-[#C4B5FD] hover:text-white transition-colors" />

                          {isInfoHovered && (
                            <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 p-4 rounded-2xl bg-[#090914] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 text-left space-y-2.5 backdrop-blur-2xl animate-[fadeIn_0.15s_ease-out]">
                              <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                                <span className="text-[11px] font-medium text-white">
                                  ¿Cómo obtener tu clave gratis?
                                </span>
                                <span className="text-[9px] font-mono text-emerald-400 uppercase">
                                  Sin Coste
                                </span>
                              </div>
                              <p className="text-[11px] text-[#A7A7C0] leading-relaxed font-light">
                                Groq te da acceso gratuito a modelos de ultra-alta velocidad sin
                                tarjeta de crédito:
                              </p>
                              <ol className="text-[11px] text-[#C5C6D0] space-y-1.5 list-decimal list-inside font-light">
                                <li>
                                  Ingresa a{" "}
                                  <span className="font-mono text-white">
                                    console.groq.com/keys
                                  </span>
                                </li>
                                <li>Inicia sesión con Google o GitHub</li>
                                <li>
                                  Haz clic en{" "}
                                  <strong className="text-white font-medium">
                                    "Create API Key"
                                  </strong>
                                </li>
                                <li>Copia tu clave y pégala aquí</li>
                              </ol>
                              <div className="pt-1.5 border-t border-white/[0.06] text-[10px] text-white/40">
                                Tu clave queda guardada de forma segura solo en tu navegador.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C4B5FD] hover:text-white underline text-[11px]"
                      >
                        Obtener gratis ↗
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="gsk_..."
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-white/20 outline-none font-mono"
                      />
                      <button
                        onClick={() => handleImmediateResume()}
                        className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium cursor-pointer"
                      >
                        Activar
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#8E8EA8] font-light">
                      No toques nada: continuará solo.
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      {isResolved ? "Continuando..." : "Reanudar Ahora"}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 4. BASE: APPLE VISION PURE GLASS (Intacto)                */}
              {/* ========================================================= */}
              {activeVariant === "apple-spatial-clean" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-[#04040A]/95 border border-white/[0.08] shadow-[0_40px_130px_rgba(0,0,0,0.99)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
                        RECUPERACIÓN INTELIGENTE · CELAEST LINGUA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#C5C6D0] font-light leading-relaxed">
                    {scenario.humanSubtext}
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        TU AUDIO
                      </span>
                      <div className="text-xl font-mono text-white">01:42 min</div>
                      <span className="text-[11px] text-white/50 font-mono">100% seguro</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        REANUDACIÓN
                      </span>
                      <div className="text-xl font-mono text-white">{cooldown} seg</div>
                      <span className="text-[11px] text-white/50 font-mono">Automática</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#8E8EA8] truncate">
                      ¿Tienes tu clave privada de Groq?
                    </span>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C4B5FD] hover:text-white underline text-[11px] shrink-0"
                    >
                      Obtener gratis
                    </a>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#8E8EA8] font-light">
                      No toques nada: continuará solo.
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      {isResolved ? "Continuando..." : "Reanudar Ahora"}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 5. BASE: MONOLITO ORIGINAL (Intacto)                      */}
              {/* ========================================================= */}
              {activeVariant === "pure-horological" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-xl rounded-3xl bg-[#030308] border border-white/[0.08] shadow-[0_40px_120px_rgba(0,0,0,0.98)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="absolute top-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.22em] text-[#C4B5FD] uppercase font-medium block">
                        CRONOMETRÍA DE ALTA PRECISIÓN · RESPUESTA INTACTA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                        DURACIÓN DE TU RESPUESTA
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono text-white font-light">
                        01:42<span className="text-xs text-white/40 ml-1">min</span>
                      </div>
                      <span className="text-[11px] text-white/60 font-mono block pt-1">
                        ✓ 100% Buffered
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1.5">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                        ENFRIAMIENTO DE CLÚSTER
                      </span>
                      <div className="text-2xl sm:text-3xl font-mono text-white font-light">
                        {cooldown}
                        <span className="text-xs text-white/40 ml-1">seg</span>
                      </div>
                      <span className="text-[11px] text-white/40 font-mono block pt-1">
                        Auto-reanudación
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#8E8EA8]">
                      <span>API Key Privada (Groq / OpenAI):</span>
                      <a
                        href="https://console.groq.com/keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#C4B5FD] hover:text-white flex items-center gap-1 text-[11px] underline underline-offset-4 transition-colors"
                      >
                        <span>Crear clave gratis</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="gsk_... o sk-..."
                        value={keyInput}
                        onChange={(e) => setKeyInput(e.target.value)}
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 outline-none font-mono"
                      />
                      <button
                        onClick={() => handleImmediateResume()}
                        className="px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium transition-all cursor-pointer shrink-0 shadow-sm"
                      >
                        Continuar ya
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-xs text-[#8E8EA8] font-light">
                      No toques nada: el evaluador continuará automáticamente.
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      {isResolved ? "Continuando..." : "Reanudar Ahora"}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 6. BASE: LINEAR / STRIPE ENTERPRISE (Intacto)             */}
              {/* ========================================================= */}
              {activeVariant === "enterprise-fluid-monolith" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-[#030308] border border-white/[0.08] shadow-[0_40px_130px_rgba(0,0,0,0.99)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                  <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-white/50" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
                          ENTERPRISE RECOVERY · CELAEST CLOUD
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-1">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        AUDIO CAPTURADO
                      </span>
                      <div className="text-2xl font-mono text-white font-light">01:42 min</div>
                      <span className="text-[11px] text-white/60 font-mono">✓ 100% Protegido</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        SINCRONIZACIÓN
                      </span>
                      <div className="text-2xl font-mono text-white font-light">{cooldown} seg</div>
                      <span className="text-[11px] text-white/40 font-mono">
                        Reanudación activa
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#8E8EA8]">¿Clave personal de Groq?</span>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:underline text-[11px] flex items-center gap-1"
                    >
                      <span>Crear gratis en Groq</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-[#8E8EA8] font-light">
                      Reanudará automáticamente en {cooldown}s.
                    </span>
                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      {isResolved ? "Continuando..." : "Reanudar Ahora"}
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* 7. BASE: COSMOS MINIMAL CAPSULE (Intacto)                 */}
              {/* ========================================================= */}
              {activeVariant === "cosmic-zen-capsule" && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-lg rounded-3xl bg-[#020206] border border-white/[0.08] shadow-[0_40px_130px_rgba(0,0,0,0.99)] p-8 sm:p-9 flex flex-col space-y-6 select-none text-left animate-[scaleUp_0.25s_ease-out]"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-[0.25em] text-[#C4B5FD] uppercase block">
                        PAZ MENTAL · SESIÓN EN MEMORIA
                      </span>
                      <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight leading-snug">
                        {scenario.humanHeadline}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1 text-xs text-[#C5C6D0] font-light leading-relaxed">
                    <span>Tu grabación está guardada y lista para ser evaluada.</span>
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1.5 border-t border-white/[0.04]">
                      <span>DURACIÓN: 01:42 MIN</span>
                      <span>ESTADO: 100% INTACTO</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs">
                    <span className="text-[#8E8EA8]">Reanudando tu práctica:</span>
                    <span className="font-mono text-sm text-white font-light">
                      {cooldown} segundos
                    </span>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/40 hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>¿Tienes clave Groq?</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleImmediateResume()}
                      className="px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg"
                    >
                      Continuar Evaluación
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
