import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Globe2,
  Trash2,
  ExternalLink,
  Plus,
  Check,
  Copy,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { useAiProviders } from "../hooks/useAiProviders";
import { providerKeyVault } from "../services/providerKeyVault";
import { probeProviderConnection } from "../services/providerConnectivity";
import { SettingsProviderTestButton } from "./SettingsProviderPrimitives";
import { ProviderMark } from "./SettingsProviderIcons";
import { SettingsSection } from "./SettingsSection";

const PROVIDER_HINTS: Record<AiProviderId, string> = {
  groq: "gsk_…",
  openai: "sk-…",
  anthropic: "sk-ant-…",
  gemini: "AIza…",
  deepseek: "sk-…",
  ollama: "No requiere clave",
  grok: "xai-…",
  perplexity: "pplx-…",
  openrouter: "sk-or-…",
  huggingface: "hf_…",
  qwen: "sk-…",
  meta: "llama-…",
};

export const PROVIDER_CONSOLE_URLS: Record<AiProviderId, { label: string; url: string }> = {
  groq: {
    label: "Obtener clave en Groq Console (Gratis)",
    url: "https://console.groq.com/keys",
  },
  gemini: {
    label: "Obtener clave en Google AI Studio (Gratis)",
    url: "https://aistudio.google.com/app/apikey",
  },
  openai: {
    label: "Obtener clave en OpenAI Platform",
    url: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    label: "Obtener clave en Anthropic Console",
    url: "https://console.anthropic.com/settings/keys",
  },
  grok: {
    label: "Obtener clave en xAI Console",
    url: "https://console.x.ai",
  },
  deepseek: {
    label: "Obtener clave en DeepSeek Platform",
    url: "https://platform.deepseek.com/api_keys",
  },
  openrouter: {
    label: "Obtener clave en OpenRouter",
    url: "https://openrouter.ai/keys",
  },
  perplexity: {
    label: "Obtener clave en Perplexity API",
    url: "https://www.perplexity.ai/settings/api",
  },
  huggingface: {
    label: "Obtener token en Hugging Face",
    url: "https://huggingface.co/settings/tokens",
  },
  qwen: {
    label: "Obtener clave en Alibaba DashScope",
    url: "https://dashscope.console.aliyun.com/apiKey",
  },
  meta: {
    label: "Documentación Llama API",
    url: "https://llama.meta.com",
  },
  ollama: {
    label: "Descargar Ollama local",
    url: "https://ollama.com",
  },
};

export const SettingsAiProvidersSection: React.FC = () => {
  const {
    providers,
    isProvidersOffline,
    activateProvider,
    configureProvider,
    testProvider,
    isTesting,
    latestTestResult,
  } = useAiProviders();

  const [expandedId, setExpandedId] = useState<AiProviderId | null>("groq");
  const [keysByProvider, setKeysByProvider] = useState<Partial<Record<AiProviderId, string[]>>>({});
  const [newKeyDrafts, setNewKeyDrafts] = useState<Partial<Record<AiProviderId, string>>>({});
  const [keyAddErrors, setKeyAddErrors] = useState<Partial<Record<AiProviderId, string | null>>>({});
  const [isValidatingKey, setIsValidatingKey] = useState<Partial<Record<AiProviderId, boolean>>>({});
  const [perKeyTestResults, setPerKeyTestResults] = useState<
    Record<string, { ok: boolean; latencyMs: number | null; message: string; isTesting?: boolean }>
  >({});
  const [showKeyMap, setShowKeyMap] = useState<Record<string, boolean>>({});
  const [copiedKeyKey, setCopiedKeyKey] = useState<string | null>(null);
  const [endpointDrafts, setEndpointDrafts] = useState<Partial<Record<AiProviderId, string>>>({});
  const [modelSelections, setModelSelections] = useState<Partial<Record<AiProviderId, string>>>({});

  // Load all keys for all providers on mount
  const refreshKeys = useCallback(async () => {
    const result: Partial<Record<AiProviderId, string[]>> = {};
    for (const p of providers) {
      const keys = await providerKeyVault.getKeys(p.id);
      result[p.id] = keys;
    }
    setKeysByProvider(result);
  }, [providers]);

  useEffect(() => {
    void refreshKeys();
  }, [refreshKeys]);

  const handleExpand = async (providerId: AiProviderId) => {
    if (expandedId === providerId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(providerId);
    const keys = await providerKeyVault.getKeys(providerId);
    setKeysByProvider((prev) => ({ ...prev, [providerId]: keys }));
  };

  const toggleShowKey = (uniqueId: string) => {
    setShowKeyMap((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const handleCopyKey = async (uniqueId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKeyKey(uniqueId);
      setTimeout(() => setCopiedKeyKey(null), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  // Add Key with live pre-validation: reject invalid keys before saving
  const handleAddKey = async (providerId: AiProviderId) => {
    const draft = (newKeyDrafts[providerId] ?? "").trim();
    if (!draft) return;

    setKeyAddErrors((prev) => ({ ...prev, [providerId]: null }));
    setIsValidatingKey((prev) => ({ ...prev, [providerId]: true }));

    const model =
      modelSelections[providerId] ??
      providers.find((p) => p.id === providerId)?.models[0]?.id ??
      "";
    const endpoint =
      endpointDrafts[providerId] ??
      providers.find((p) => p.id === providerId)?.defaultEndpoint ??
      "";

    try {
      // Live validation with provider
      const probe = await probeProviderConnection(providerId, draft, endpoint, model);
      const isCorsOrNet =
        !probe.ok &&
        (probe.message.toLowerCase().includes("cors") ||
          probe.message.toLowerCase().includes("unreachable"));

      if (!probe.ok && !isCorsOrNet) {
        setKeyAddErrors((prev) => ({
          ...prev,
          [providerId]: probe.message || "Clave rechazada por el proveedor. Verifica que sea válida.",
        }));
        setIsValidatingKey((prev) => ({ ...prev, [providerId]: false }));
        return;
      }

      await providerKeyVault.addKey(providerId, draft);
      setNewKeyDrafts((prev) => ({ ...prev, [providerId]: "" }));
      const updated = await providerKeyVault.getKeys(providerId);
      setKeysByProvider((prev) => ({ ...prev, [providerId]: updated }));

      // Record successful test for this key
      const keyIdx = updated.indexOf(draft);
      if (keyIdx !== -1) {
        const uniqueId = `${providerId}_key_${keyIdx}`;
        setPerKeyTestResults((prev) => ({
          ...prev,
          [uniqueId]: {
            ok: true,
            latencyMs: probe.latencyMs,
            message: probe.latencyMs !== null ? `${probe.latencyMs} ms` : "Activa",
          },
        }));
      }

      const finalModel = probe.discoveredModel || model;
      await configureProvider({
        providerId,
        ...(finalModel ? { defaultModel: finalModel } : {}),
        ...(endpoint ? { endpoint } : {}),
      });
      await providerKeyVault.saveConfig(providerId, {
        ...(finalModel ? { defaultModel: finalModel } : {}),
        ...(endpoint ? { endpoint } : {}),
      });
    } catch (err: any) {
      setKeyAddErrors((prev) => ({
        ...prev,
        [providerId]: err?.message || "Error al validar la clave con el proveedor.",
      }));
    } finally {
      setIsValidatingKey((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  const handleTestIndividualKey = async (
    providerId: AiProviderId,
    keyVal: string,
    keyUniqueId: string,
  ) => {
    setPerKeyTestResults((prev) => ({
      ...prev,
      [keyUniqueId]: { ok: false, latencyMs: null, message: "Validando...", isTesting: true },
    }));

    const model =
      modelSelections[providerId] ??
      providers.find((p) => p.id === providerId)?.models[0]?.id ??
      "";
    const endpoint =
      endpointDrafts[providerId] ??
      providers.find((p) => p.id === providerId)?.defaultEndpoint ??
      "";

    try {
      const probe = await probeProviderConnection(providerId, keyVal, endpoint, model);
      setPerKeyTestResults((prev) => ({
        ...prev,
        [keyUniqueId]: {
          ok: probe.ok,
          latencyMs: probe.latencyMs,
          message: probe.ok ? `${probe.latencyMs ?? 0} ms` : probe.message || "Error",
          isTesting: false,
        },
      }));
    } catch (err: any) {
      setPerKeyTestResults((prev) => ({
        ...prev,
        [keyUniqueId]: {
          ok: false,
          latencyMs: null,
          message: err?.message || "Error",
          isTesting: false,
        },
      }));
    }
  };

  const handleRemoveKey = async (providerId: AiProviderId, index: number) => {
    await providerKeyVault.removeKeyAtIndex(providerId, index);
    const updated = await providerKeyVault.getKeys(providerId);
    setKeysByProvider((prev) => ({ ...prev, [providerId]: updated }));
  };

  return (
    <SettingsSection label="AI PROVIDERS & KEY POOL">
      {/* Subheader */}
      <div className="mb-4 px-1">
        <p className="text-xs text-zinc-400 font-light leading-relaxed">
          Tus credenciales se cifran localmente con <strong className="text-zinc-200 font-medium">AES-GCM de 256 bits</strong> en este dispositivo y están estrictamente aisladas por cuenta de usuario.
        </p>
      </div>

      {isProvidersOffline ? (
        <div className="mb-4 rounded-xl border border-zinc-500/20 bg-zinc-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-zinc-300">
          Catálogo local — el backend está fuera de línea. Las claves se preservan de forma segura en este dispositivo.
        </div>
      ) : null}

      {/* Provider List: Matches Learning and Personal quiet-row standard */}
      <div className="divide-y divide-white/[0.06]">
        {providers.map((provider) => {
          const isActive = provider.status === "active";
          const isExpanded = expandedId === provider.id;
          const isGroq = provider.id === "groq";
          const keys = keysByProvider[provider.id] ?? [];
          const hasKeys = keys.length > 0;
          const selectedModel = modelSelections[provider.id] ?? provider.models[0]?.id ?? "";
          const consoleInfo = PROVIDER_CONSOLE_URLS[provider.id];

          return (
            <div key={provider.id} className="flex flex-col">
              {/* Row: 100% Identical to SettingsListItem in Learning & Personal */}
              <button
                type="button"
                onClick={() => handleExpand(provider.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between py-3.5 sm:py-4 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer group text-left"
              >
                {/* Left: Icon + Text */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <span className="text-[#8a8a9e] group-hover:text-zinc-200 transition-colors duration-300 shrink-0">
                    <ProviderMark providerId={provider.id} isActive={isActive} size="md" />
                  </span>
                  <div className="flex flex-col items-start min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] sm:text-sm font-medium text-zinc-100 leading-tight tracking-wide">
                        {provider.name.replace(" (Recomendado)", "")}
                      </span>
                      {isGroq && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFB020] font-semibold">
                          Recomendado · Gratis
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">
                          Activo
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] sm:text-xs text-zinc-500 font-light leading-tight mt-0.5">
                      {isGroq
                        ? "Ultra-rápido (~85 ms) · Sin límites de costo ni tarjeta"
                        : provider.type === "local"
                          ? "Ejecución local en tu equipo"
                          : `${provider.models.length} modelos de inferencia`}
                    </span>
                  </div>
                </div>

                {/* Right: Value + Chevron */}
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="text-xs sm:text-sm text-zinc-400 font-light group-hover:text-zinc-200 transition-colors duration-300">
                    {hasKeys ? (keys.length === 1 ? "1 Clave" : `${keys.length} Claves`) : "Sin configurar"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-300 ${
                      isExpanded ? "rotate-90 text-zinc-200" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="pb-5 pt-1 px-1 flex flex-col gap-5 animate-[fadeSlideUp_0.2s_ease-out]">
                  {/* Key Pool Section */}
                  {provider.type === "cloud" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                          Pool de API Keys
                          <span className="text-white/20">
                            ({keys.length} {keys.length === 1 ? "clave activa" : "claves activas"})
                          </span>
                        </span>

                        {consoleInfo && (
                          <a
                            href={consoleInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#C4B5FD] hover:text-white transition font-mono cursor-pointer"
                          >
                            <span>Obtener clave en consola</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      {/* Keys List: Flat Delicate Hairline Rows */}
                      {keys.length > 0 && (
                        <div className="divide-y divide-white/[0.04] border-y border-white/[0.04]">
                          {keys.map((k, idx) => {
                            const keyUniqueId = `${provider.id}_key_${idx}`;
                            const isVisible = Boolean(showKeyMap[keyUniqueId]);
                            const isCopied = copiedKeyKey === keyUniqueId;
                            const testRes = perKeyTestResults[keyUniqueId];

                            return (
                              <div
                                key={keyUniqueId}
                                className="flex items-center justify-between gap-3 py-2.5 hover:bg-white/[0.015] transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/35 shrink-0">
                                    {idx === 0 ? "Principal" : `Respaldo ${idx + 1}`}
                                  </span>
                                  <span className="font-mono text-xs text-zinc-300 truncate select-all">
                                    {isVisible ? k : "••••••••••••••••••••••••••••••••"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {/* Key Status Indicator */}
                                  {testRes && !testRes.isTesting && (
                                    <span
                                      className={`inline-flex items-center gap-1 font-mono text-xs ${
                                        testRes.ok ? "text-emerald-400" : "text-red-400"
                                      }`}
                                      title={testRes.message}
                                    >
                                      {testRes.ok ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <AlertCircle className="w-3 h-3 text-red-400" />
                                      )}
                                      <span>
                                        {testRes.ok ? `${testRes.latencyMs ?? 0} ms` : "Error"}
                                      </span>
                                    </span>
                                  )}

                                  {/* Test Key Button */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleTestIndividualKey(provider.id, k, keyUniqueId)
                                    }
                                    disabled={testRes?.isTesting}
                                    className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer disabled:opacity-30"
                                    title="Probar esta clave"
                                  >
                                    {testRes?.isTesting ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-300" />
                                    ) : (
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Eye toggle */}
                                  <button
                                    type="button"
                                    onClick={() => toggleShowKey(keyUniqueId)}
                                    className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
                                    title={isVisible ? "Ocultar clave" : "Ver clave"}
                                  >
                                    {isVisible ? (
                                      <EyeOff className="w-3.5 h-3.5 text-[#C4B5FD]" />
                                    ) : (
                                      <Eye className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Copy button */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyKey(keyUniqueId, k)}
                                    className="p-1.5 text-zinc-400 hover:text-white transition cursor-pointer"
                                    title="Copiar clave"
                                  >
                                    {isCopied ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>

                                  {/* Trash button */}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveKey(provider.id, idx)}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                                    title="Eliminar esta clave del pool"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Key with Pre-Validation */}
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              type="password"
                              value={newKeyDrafts[provider.id] ?? ""}
                              onChange={(e) => {
                                setNewKeyDrafts((prev) => ({
                                  ...prev,
                                  [provider.id]: e.target.value,
                                }));
                                if (keyAddErrors[provider.id]) {
                                  setKeyAddErrors((prev) => ({
                                    ...prev,
                                    [provider.id]: null,
                                  }));
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  (newKeyDrafts[provider.id] ?? "").trim() &&
                                  !isValidatingKey[provider.id]
                                ) {
                                  e.preventDefault();
                                  void handleAddKey(provider.id);
                                }
                              }}
                              placeholder={
                                keys.length === 0
                                  ? `Pega tu clave (${PROVIDER_HINTS[provider.id]})`
                                  : `Agregar clave de respaldo (${PROVIDER_HINTS[provider.id]})`
                              }
                              autoComplete="off"
                              spellCheck={false}
                              className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/20 outline-none font-mono transition"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleAddKey(provider.id)}
                            disabled={
                              !(newKeyDrafts[provider.id] ?? "").trim() ||
                              isValidatingKey[provider.id]
                            }
                            className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium cursor-pointer transition-all shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                          >
                            {isValidatingKey[provider.id] ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Validando...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  {keys.length === 0 ? "Guardar clave" : "Agregar clave"}
                                </span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Floating error line */}
                        {keyAddErrors[provider.id] && (
                          <div className="flex items-start space-x-1.5 text-[11px] text-red-400 font-mono pt-1 leading-snug">
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <span>{keyAddErrors[provider.id]}</span>
                          </div>
                        )}

                        <p className="text-[11px] text-zinc-500 font-mono leading-relaxed pt-0.5">
                          Rotación automática: Si una clave llega a su límite de cuota (HTTP 429), Lingua conmuta al instante al siguiente respaldo.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Endpoint Configuration */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`celaest-endpoint-${provider.id}`}
                      className="text-[10px] font-mono tracking-widest uppercase text-white/40 flex items-center gap-1.5"
                    >
                      <Globe2 className="w-3 h-3 text-white/40" aria-hidden="true" />
                      Endpoint API
                    </label>
                    <input
                      id={`celaest-endpoint-${provider.id}`}
                      type="text"
                      value={endpointDrafts[provider.id] ?? provider.defaultEndpoint ?? ""}
                      onChange={(e) =>
                        setEndpointDrafts((prev) => ({
                          ...prev,
                          [provider.id]: e.target.value,
                        }))
                      }
                      readOnly={provider.type === "cloud"}
                      spellCheck={false}
                      className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 read-only:opacity-50 read-only:cursor-default transition"
                    />
                  </div>

                  {/* Model Selection */}
                  <fieldset className="space-y-2">
                    <legend className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                      Modelo Predeterminado
                    </legend>
                    <div
                      className="flex flex-wrap gap-1.5"
                      role="radiogroup"
                      aria-label={`${provider.name} model`}
                    >
                      {provider.models.map((model) => {
                        const isSelected = selectedModel === model.id;
                        return (
                          <button
                            key={model.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() =>
                              setModelSelections((prev) => ({
                                ...prev,
                                [provider.id]: model.id,
                              }))
                            }
                            title={model.bestFor}
                            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-white text-black font-semibold shadow-sm"
                                : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07]"
                            }`}
                          >
                            {model.label}
                          </button>
                        );
                      })}
                    </div>
                    {selectedModel && (
                      <p className="text-[11px] font-mono text-white/30">
                        {provider.models.find((m) => m.id === selectedModel)?.bestFor}
                      </p>
                    )}
                  </fieldset>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3.5 mt-1">
                    <SettingsProviderTestButton
                      onClick={() => testProvider(provider.id)}
                      isTesting={isTesting}
                      result={latestTestResult}
                      disabled={!hasKeys && provider.type === "cloud"}
                    />
                    {isActive ? (
                      <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 px-3 py-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Proveedor Activo
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => activateProvider(provider.id)}
                        disabled={!hasKeys && provider.type === "cloud"}
                        className="px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-medium transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Establecer como Activo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SettingsSection>
  );
};

