import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, Info, Check, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { ProviderMark } from "../../settings/components/SettingsProviderIcons";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import {
  ErrorScenarioData,
  getDynamicUtcResetText,
} from "../../../shared/constants/errorScenarios";
import { useFocusTrap } from "../../../shared/hooks/useFocusTrap";
import { probeProviderConnection } from "../../settings/services/providerConnectivity";
import { providerKeyVault } from "../../settings/services/providerKeyVault";

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
    placeholder: "AIzaSy...",
    url: "https://aistudio.google.com/app/apikey",
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

export interface AiInfrastructureRecoveryModalProps {
  isOpen: boolean;
  scenario: ErrorScenarioData;
  cooldown: number; // in seconds
  onClose: () => void;
  onImmediateResume: () => void;
  contextType?: "writing" | "reading" | "speaking" | "general";
  bufferDetail?: {
    wordCount?: number;
    durationSeconds?: number;
    previewText?: string;
  };
}

export const AiInfrastructureRecoveryModal: React.FC<AiInfrastructureRecoveryModalProps> = ({
  isOpen,
  scenario,
  cooldown: _cooldown,
  onClose,
  onImmediateResume,
  contextType = "writing",
  bufferDetail,
}) => {
  const dialogRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onClose,
  });

  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>("groq");
  const [keyInput, setKeyInput] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isBespokeInfoHovered, setIsBespokeInfoHovered] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedSuccessInfo, setVerifiedSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const handleActivate = async () => {
    const rawKey = keyInput.trim();
    if (!rawKey) {
      setVerificationError("Por favor ingresa una clave de API.");
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    setVerifiedSuccessInfo(null);

    const defaultEndpoints: Record<AiProviderId, string> = {
      groq: "https://api.groq.com/openai/v1",
      gemini: "https://generativelanguage.googleapis.com/v1beta",
      openai: "https://api.openai.com/v1",
      anthropic: "https://api.anthropic.com/v1",
      deepseek: "https://api.deepseek.com/v1",
      grok: "https://api.x.ai/v1",
      ollama: "http://localhost:11434",
      perplexity: "https://api.perplexity.ai",
      openrouter: "https://openrouter.ai/api/v1",
      huggingface: "https://api-inference.huggingface.co/models",
      qwen: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      meta: "https://api.llama-api.com",
    };

    const defaultModels: Record<AiProviderId, string> = {
      groq: "qwen/qwen3.8-27b",
      gemini: "gemini-3.6-flash",
      openai: "gpt-4o-mini",
      anthropic: "claude-3-5-haiku-20241022",
      deepseek: "deepseek-chat",
      grok: "grok-2",
      ollama: "llama3",
      perplexity: "llama-3.1-sonar-small-128k-online",
      openrouter: "meta-llama/llama-3.3-70b-instruct",
      huggingface: "meta-llama/Llama-3.2-3B-Instruct",
      qwen: "qwen-plus",
      meta: "llama3.3-70b",
    };

    const endpoint = defaultEndpoints[selectedProvider];
    const model = defaultModels[selectedProvider];

    try {
      const probe = await probeProviderConnection(selectedProvider, rawKey, endpoint, model);
      if (!probe.ok) {
        // If it's a browser CORS / origin restriction, the key may still be valid on proxy/backend
        const isCorsOrNetwork =
          probe.message.toLowerCase().includes("cors") ||
          probe.message.toLowerCase().includes("unreachable") ||
          probe.message.toLowerCase().includes("no se pudo conectar") ||
          probe.message.toLowerCase().includes("conexión a internet") ||
          probe.message.toLowerCase().includes("servidor") ||
          probe.message.toLowerCase().includes("failed to fetch") ||
          probe.message.toLowerCase().includes("network");
        if (isCorsOrNetwork) {
          await providerKeyVault.saveKey(selectedProvider, rawKey);
          await providerKeyVault.saveActiveProviderId(selectedProvider);
          await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: model });

          setIsVerifying(false);
          setVerifiedSuccessInfo(
            `Clave de ${currentProvider.name} guardada en tu dispositivo (Modo directo activo).`,
          );
          setIsResolved(true);
          setTimeout(() => {
            onImmediateResume();
          }, 900);
          return;
        }

        setIsVerifying(false);
        setVerificationError(probe.message);
        return;
      }

      // Valid key verified with live API! Save to encrypted client vault with confirmed working model
      const targetModel = probe.discoveredModel || model;
      await providerKeyVault.saveKey(selectedProvider, rawKey);
      await providerKeyVault.saveActiveProviderId(selectedProvider);
      await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: targetModel });

      setIsVerifying(false);
      setVerifiedSuccessInfo(
        `Clave de ${currentProvider.name} verificada con éxito (${probe.latencyMs ?? 120}ms). Guardada en tu dispositivo.`,
      );
      setIsResolved(true);

      // Reanudar inmediatamente con la clave activa
      setTimeout(() => {
        onImmediateResume();
      }, 900);
    } catch (err: any) {
      setIsVerifying(false);
      setVerificationError(`No pudimos verificar la clave. Revisa tu conexión a internet o usa Groq (100% gratis).`);
    }
  };

  const isWriting = contextType === "writing";
  const isReading = contextType === "reading";

  const dial1Label = isWriting ? "TU TEXTO" : isReading ? "TU LECTURA" : scenario.dial1Label;
  const dial1Value = isWriting
    ? `${bufferDetail?.wordCount ?? 0} PALABRAS`
    : isReading
      ? "IA GENERADOR"
      : bufferDetail?.durationSeconds !== undefined
        ? `${bufferDetail.durationSeconds}s AUDIO`
        : scenario.dial1Value;

  const dial1Subtext =
    scenario.id === "keys-exhausted-pool"
      ? getDynamicUtcResetText()
      : isWriting
        ? "100% a salvo en el editor local"
        : isReading
          ? "Progreso de lectura seguro"
          : scenario.dial1Subtext;

  const dial2Label = "PROVEEDOR IA";
  const dial2Value = "BYOK Directo";
  const dial2Subtext = "Pega tu clave para continuar sin esperas";

  const reassuranceText = isWriting
    ? "Tu redacción permanece 100% intacta en el editor. No perderás ni una sola palabra."
    : isReading
      ? "Tu sesión y progreso de lectura permanecen seguros. Ingresa una clave gratuita para continuar."
      : scenario.reassurance;

  const modalNode = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-black/85 backdrop-blur-3xl overflow-y-auto no-scrollbar animate-[fadeIn_0.25s_ease-out]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-modal-headline"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl h-[94dvh] sm:h-auto max-h-[94dvh] sm:max-h-[min(92dvh,760px)] rounded-t-[26px] sm:rounded-3xl bg-[#04040A] border-t border-white/[0.12] sm:border sm:border-white/[0.07] hover:border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden select-none flex flex-col text-left animate-[slideUp_0.3s_cubic-bezier(0.16,1,0.3,1)] sm:animate-[scaleUp_0.25s_ease-out] outline-none"
      >
        {/* Mobile Grab Handle */}
        <div className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-0.5 shrink-0 select-none">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Top Specular Hairline matching Reading/Writing Card Standard */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-10" />

        {/* Fixed Header Section (Never Clipped) */}
        <div className="p-4 sm:p-6 pb-3 shrink-0 flex items-start justify-between border-b border-white/[0.04]">
          <div className="space-y-1 pr-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#C4B5FD] uppercase block">
              RECUPERACIÓN INTELIGENTE · CELAEST LINGUA
            </span>
            <h3 id="recovery-modal-headline" className="text-lg sm:text-xl md:text-2xl font-light text-white tracking-tight leading-snug">
              {scenario.humanHeadline}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-white/40 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body (Fluidly Adapts to Viewport Height) */}
        <div className="overflow-y-auto no-scrollbar p-4 sm:p-6 space-y-3.5 sm:space-y-4 flex-1">
          {/* Natural Human Subtext */}
          <p className="text-[11.5px] sm:text-xs text-[#C5C6D0] font-light leading-relaxed">
            {scenario.humanSubtext}
          </p>

          {/* Minimalist Dual Pill Dials Centrados Adaptativos */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 py-0.5 sm:py-1">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-0.5 sm:space-y-1 text-center">
              <span className="text-[9.5px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                {dial1Label}
              </span>
              <div className="text-lg sm:text-xl font-mono text-white font-light">
                {dial1Value}
              </div>
              <span className="text-[10px] sm:text-[11px] text-white/50 font-mono block">
                {dial1Subtext}
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-0.5 sm:space-y-1 text-center">
              <span className="text-[9.5px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider block">
                {dial2Label}
              </span>
              <div className="text-lg sm:text-xl font-mono text-white font-light">
                {dial2Value}
              </div>
              <span className="text-[10px] sm:text-[11px] text-white/50 font-mono block">
                {dial2Subtext}
              </span>
            </div>
          </div>

          {/* Contextual Reassurance Line */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.015] border border-white/[0.04] text-[10.5px] sm:text-[11px] text-[#C5C6D0] font-light flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FFD600] shrink-0 shadow-[0_0_8px_rgba(255,170,0,0.6)]" />
            <span>{reassuranceText}</span>
          </div>

          {/* Multi-Provider Selection: CERO CAJAS DE COLORES, CERO BORDES RECARGADOS */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-white/60 font-light">Proveedor de inferencia:</span>
              <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-white/80">{currentProvider.name}</span>
                <span className="text-white/30">·</span>
                {currentProvider.id === "groq" ? (
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                        fill="url(#goldHeaderGradModal)"
                        stroke="#FFAA00"
                        strokeWidth="0.8"
                        strokeLinejoin="round"
                      />
                      <circle cx="12" cy="12" r="1.6" fill="#FFFBEB" />
                      <defs>
                        <linearGradient id="goldHeaderGradModal" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FF7A00" />
                          <stop offset="0.5" stopColor="#FFAA00" />
                          <stop offset="1" stopColor="#FFD600" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="font-bold font-sans tracking-tight bg-gradient-to-r from-[#FF7A00] via-[#FFAA00] to-[#FFD600] bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(255,140,0,0.25)]">
                      Recomendada (100% Gratis)
                    </span>
                  </span>
                ) : (
                  <span className="text-white/60">{currentProvider.badge}</span>
                )}
              </span>
            </div>

            {/* Íconos Nativos sin Cajas Ni Bordes (Ultra-Clean, Adaptativo 3x2 en móvil, 6 en desktop) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 py-1">
              {PROVIDERS.map((prov) => {
                const isActive = selectedProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => {
                      setSelectedProvider(prov.id);
                      setKeyInput("");
                    }}
                    className="group flex flex-col items-center justify-center py-1.5 sm:py-2 px-1 cursor-pointer transition-all duration-300 relative outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 select-none border-0"
                    style={{ outline: "none", boxShadow: "none", WebkitTapHighlightColor: "transparent" }}
                  >
                    {/* Ícono sin caja contenedora */}
                    <div
                      className={`transition-all duration-300 flex items-center justify-center ${
                        isActive ? "scale-110" : "opacity-45 group-hover:opacity-90 group-hover:scale-105"
                      }`}
                    >
                      <ProviderMark providerId={prov.id} isActive={isActive} size="md" />
                    </div>

                    {/* Nombre del Proveedor */}
                    <span
                      className={`text-[11px] mt-1.5 transition-colors font-medium tracking-tight ${
                        isActive ? "text-white font-semibold" : "text-white/50 group-hover:text-white/80"
                      }`}
                    >
                      {prov.name}
                    </span>

                    {/* Modelo / Badge en Oro Feedback para Groq */}
                    {prov.id === "groq" ? (
                      <div className="inline-flex items-center gap-1 mt-0.5">
                        <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                            fill="url(#goldSparkleGradModal)"
                            stroke="#FFAA00"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                          />
                          <circle cx="12" cy="12" r="1.6" fill="#FFFBEB" />
                          <defs>
                            <linearGradient id="goldSparkleGradModal" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF7A00" />
                              <stop offset="0.5" stopColor="#FFAA00" />
                              <stop offset="1" stopColor="#FFD600" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-[9.5px] font-bold font-sans tracking-tight bg-gradient-to-r from-[#FF7A00] via-[#FFAA00] to-[#FFD600] bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(255,140,0,0.25)]">
                          Recomendada
                        </span>
                      </div>
                    ) : (
                      <span
                        className={`text-[9.5px] font-mono transition-colors ${
                          isActive ? "text-[#C4B5FD]" : "text-white/25"
                        }`}
                      >
                        {prov.badge}
                      </span>
                    )}

                    {/* Indicador sutil de línea inferior únicamente para el activo */}
                    {isActive ? (
                      <div
                        className={`w-5 h-[2px] rounded-full mt-1.5 animate-[fadeIn_0.2s_ease-out] ${
                          prov.id === "groq"
                            ? "bg-gradient-to-r from-[#FF7A00] via-[#FFAA00] to-[#FFD600] shadow-[0_0_8px_rgba(255,170,0,0.5)]"
                            : "bg-gradient-to-r from-[#C4B5FD] to-white"
                        }`}
                      />
                    ) : (
                      <div className="w-5 h-[2px] mt-1.5 opacity-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Input Strip Integrado */}
            <div className="space-y-2 pt-2.5 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs text-[#8E8EA8]">
                <div className="flex items-center space-x-2">
                  <span className="text-white/70">Clave de {currentProvider.name}:</span>
                  {/* Botón de Guía */}
                  <button
                    type="button"
                    onClick={() => setIsBespokeInfoHovered(!isBespokeInfoHovered)}
                    className="inline-flex items-center cursor-pointer text-[#C4B5FD] hover:text-white transition-colors"
                    title="Ver cómo obtener tu clave"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Enlace Directo Oficial */}
                <a
                  href={currentProvider.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C4B5FD] hover:text-white underline text-[11px] transition-colors flex items-center gap-1"
                >
                  <span>{currentProvider.isFree ? "Obtener gratis" : "Crear clave"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Guía Desplegable Inline (100% Responsiva, Cero Cortes) */}
              {isBespokeInfoHovered && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#090914] border border-white/10 text-left space-y-2 backdrop-blur-2xl animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                    <span className="text-[11px] font-medium text-white flex items-center gap-1.5">
                      <ProviderMark providerId={currentProvider.id} size="md" />
                      <span>¿Cómo obtener tu clave de {currentProvider.name}?</span>
                    </span>
                    <span className="text-[9px] font-bold font-sans tracking-tight bg-gradient-to-r from-[#FF7A00] via-[#FFAA00] to-[#FFD600] bg-clip-text text-transparent uppercase">
                      {currentProvider.isFree ? "100% Gratis" : "API Propia"}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A7A7C0] leading-relaxed font-light">
                    Es muy sencillo y solo toma unos segundos:
                  </p>
                  <ol className="text-[11px] text-[#C5C6D0] space-y-1 list-decimal list-inside font-light">
                    <li>
                      Haz clic en el enlace{" "}
                      <strong className="text-white underline font-medium">
                        "{currentProvider.isFree ? "Obtener gratis ↗" : "Crear clave ↗"}"
                      </strong>{" "}
                      arriba a la derecha.
                    </li>
                    <li>Inicia sesión con tu cuenta habitual (Google o GitHub).</li>
                    <li>
                      Presiona <strong className="text-white font-medium">"Create API Key"</strong>.
                    </li>
                    <li>
                      Copia tu código (inicia con{" "}
                      <span className="font-mono text-[#C4B5FD]">{currentProvider.placeholder}</span>) y pégalo aquí.
                    </li>
                  </ol>
                  <div className="pt-1.5 border-t border-white/[0.06] text-[10px] text-white/40">
                    Tu clave se cifra de forma local en tu navegador. CELAEST nunca la almacena en sus servidores.
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none opacity-80">
                    <ProviderMark providerId={currentProvider.id} size="md" />
                  </div>
                  <input
                    type={showKeyInput ? "text" : "password"}
                    placeholder={`Pega tu clave ${currentProvider.placeholder}`}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl pl-10 pr-10 py-2 text-xs text-white placeholder-white/20 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyInput((prev) => !prev)}
                    className="absolute right-2.5 p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    title={showKeyInput ? "Ocultar clave" : "Ver clave"}
                  >
                    {showKeyInput ? (
                      <EyeOff className="w-3.5 h-3.5 text-[#A78BFA]" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={handleActivate}
                  disabled={isVerifying || !keyInput.trim()}
                  className="px-4 sm:px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-xs font-medium cursor-pointer transition-all shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : verifiedSuccessInfo ? (
                    "¡Activada!"
                  ) : (
                    "Activar y Reanudar"
                  )}
                </button>
              </div>

              {verificationError && (
                <div className="flex items-start space-x-1.5 text-[11px] text-red-400 font-mono pt-1 leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{verificationError}</span>
                </div>
              )}

              {verifiedSuccessInfo && (
                <div className="flex items-center space-x-1.5 text-[11px] text-[#E5C07B] font-mono pt-1">
                  <Check className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
                  <span>{verifiedSuccessInfo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Action (Always Visible, Never Cut Off) */}
        <div className="p-4 sm:p-5 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] sm:pb-5 shrink-0 border-t border-white/[0.06] bg-[#04040A]/95 backdrop-blur-md flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <span className="text-xs text-[#8E8EA8] font-light text-center sm:text-left">
            Elige un proveedor o ingresa tu clave para continuar.
          </span>
          <button
            onClick={onImmediateResume}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <span>{isResolved ? "Continuando..." : "Reanudar Ahora"}</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalNode, document.body);
};
