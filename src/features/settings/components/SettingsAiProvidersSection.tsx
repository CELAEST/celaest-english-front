import React, { useState, useEffect } from "react";
import { Eye, EyeOff, KeyRound, Globe2, Cpu } from "lucide-react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { useAiProviders } from "../hooks/useAiProviders";
import { providerKeyVault } from "../services/providerKeyVault";
import { SettingsProviderTestButton } from "./SettingsProviderPrimitives";
import { ProviderMark } from "./SettingsProviderIcons";
import { SettingsSection } from "./SettingsSection";

const PROVIDER_HINTS: Record<AiProviderId, string> = {
  groq: "gsk_…",
  openai: "sk-…",
  anthropic: "sk-ant-…",
  gemini: "AIza…",
  deepseek: "sk-…",
  ollama: "No key required",
  grok: "xai-…",
  perplexity: "pplx-…",
  openrouter: "sk-or-…",
  huggingface: "hf_…",
  qwen: "sk-…",
  meta: "llama-…",
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

  const [expandedId, setExpandedId] = useState<AiProviderId | null>(null);
  const [hasStoredKey, setHasStoredKey] = useState<Partial<Record<AiProviderId, boolean>>>({});
  const [keyDrafts, setKeyDrafts] = useState<Partial<Record<AiProviderId, string>>>({});
  const [showKeyFor, setShowKeyFor] = useState<AiProviderId | null>(null);
  const [endpointDrafts, setEndpointDrafts] = useState<Partial<Record<AiProviderId, string>>>({});
  const [modelSelections, setModelSelections] = useState<Partial<Record<AiProviderId, string>>>({});
  const [isCoreEnabled, setIsCoreEnabled] = useState<boolean>(true);

  useEffect(() => {
    void providerKeyVault.isCentralCoreEnabled().then((enabled) => {
      setIsCoreEnabled(enabled);
    });
  }, []);

  const handleToggleCore = async () => {
    const next = !isCoreEnabled;
    setIsCoreEnabled(next);
    await providerKeyVault.setCentralCoreEnabled(next);
  };

  const handleExpand = async (providerId: AiProviderId) => {
    if (expandedId === providerId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(providerId);
    setShowKeyFor(null);
    const stored = await providerKeyVault.hasKey(providerId);
    setHasStoredKey((prev) => ({ ...prev, [providerId]: stored }));
  };

  const handleSaveKey = async (providerId: AiProviderId) => {
    const draft = (keyDrafts[providerId] ?? "").trim();
    if (!draft) return;
    await providerKeyVault.saveKey(providerId, draft);
    setHasStoredKey((prev) => ({ ...prev, [providerId]: true }));
    setKeyDrafts((prev) => ({ ...prev, [providerId]: "" }));

    const model = modelSelections[providerId];
    const endpoint =
      endpointDrafts[providerId] ?? providers.find((p) => p.id === providerId)?.defaultEndpoint;

    await configureProvider({
      providerId,
      ...(model !== undefined ? { defaultModel: model } : {}),
      ...(endpoint !== undefined ? { endpoint } : {}),
    });
    await providerKeyVault.saveConfig(providerId, {
      ...(model !== undefined ? { defaultModel: model } : {}),
      ...(endpoint !== undefined ? { endpoint } : {}),
    });
  };

  return (
    <SettingsSection label="AI PROVIDERS">
      {/* 1. Master CELAEST-CORE Central Cluster Toggle */}
      <div className="mb-5 rounded-2xl border border-white/[0.08] bg-[#070714]/70 backdrop-blur-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl border transition-colors ${
              isCoreEnabled
                ? "bg-[#7048E8]/15 border-[#7048E8]/30 text-[#A78BFA]"
                : "bg-white/[0.04] border-white/[0.08] text-white/40"
            }`}
          >
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white tracking-wide">
                Clúster Central CELAEST-CORE
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                  isCoreEnabled
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}
              >
                {isCoreEnabled ? "Activo" : "Bypass BYOK"}
              </span>
            </div>
            <p className="text-xs text-white/50 font-light mt-1 max-w-xl leading-relaxed">
              {isCoreEnabled
                ? "Utiliza los servidores y el pool de claves públicas de la plataforma. Si se agotan los tokens, podrás usar tu propia clave como respaldo."
                : "Desactivado para pruebas. Lingua evaluará tus ejercicios EXCLUSIVAMENTE con la API Key privada que configures abajo."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleCore}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isCoreEnabled ? "bg-[#7048E8]" : "bg-white/20"
          }`}
          role="switch"
          aria-checked={isCoreEnabled}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              isCoreEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isProvidersOffline ? (
        <div className="mb-2 rounded-xl border border-zinc-500/20 bg-zinc-500/[0.06] px-3 py-2 text-xs leading-relaxed text-zinc-400">
          Local catalog — backend offline. Keys stay on this device; live health checks will sync
          when online.
        </div>
      ) : null}
      {/* Borderless accordion — each provider is a quiet row that expands in place */}
      <div className="flex flex-col divide-y divide-white/[0.06]">
        {providers.map((provider) => {
          const isActive = provider.status === "active";
          const isExpanded = expandedId === provider.id;
          const stored = hasStoredKey[provider.id] ?? false;
          const selectedModel = modelSelections[provider.id] ?? provider.models[0]?.id ?? "";

          return (
            <div key={provider.id}>
              {/* Row */}
              <button
                type="button"
                onClick={() => handleExpand(provider.id)}
                aria-expanded={isExpanded}
                className={`w-full flex items-center justify-between py-3.5 sm:py-4 transition-colors duration-300 cursor-pointer group text-left ${
                  isExpanded ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <ProviderMark providerId={provider.id} isActive={isActive} />
                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-[14px] sm:text-[15px] font-medium text-[#f4f4f5] leading-tight tracking-wide">
                      {provider.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#8a8a9e] font-light leading-tight mt-0.5">
                      {provider.type === "local" ? "Local · Offline" : "Cloud"} ·{" "}
                      {provider.models.length} models
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-4">
                  <span
                    className={`text-[10.5px] font-medium tracking-[0.14em] uppercase ${
                      isActive ? "text-[#9bbf9b]" : stored ? "text-[#cfcfe6]" : "text-[#6f6f82]"
                    }`}
                  >
                    {isActive ? "Active" : stored ? "Ready" : "Set up"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#6f6f82] group-hover:text-[#cfcfe6] transition-transform duration-300 ${
                      isExpanded ? "rotate-90" : ""
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

              {/* Expanded configuration — premium, no card/border; generous whitespace, hairline dividers, 44px targets */}
              {isExpanded && (
                <div className="animate-[fadeSlideUp_0.22s_ease-out_both]">
                  <div className="flex flex-col gap-6 pl-9 sm:pl-11 pr-1 pt-2 pb-7">
                    {/* Hero — large mark + identity */}
                    <div className="flex items-center gap-3.5 pb-5 border-b border-white/[0.06]">
                      <ProviderMark providerId={provider.id} isActive={isActive} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[15px] font-medium tracking-[-0.01em] text-white leading-none">
                          {provider.name}
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs leading-none text-zinc-400">
                          <span>
                            {provider.type === "cloud"
                              ? "Cloud · bring your own key"
                              : "Local · offline"}
                          </span>
                          <span className="text-white/20">·</span>
                          <span>{provider.models.length} models</span>
                        </div>
                      </div>
                      {isActive ? (
                        <span className="hidden sm:inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-black">
                          Active
                        </span>
                      ) : null}
                    </div>

                    {/* API Key */}
                    {provider.type === "cloud" && (
                      <div className="space-y-3">
                        <label
                          htmlFor={`celaest-key-${provider.id}`}
                          className="flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-400"
                        >
                          <KeyRound className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                          API Key
                          <span className="normal-case tracking-normal font-normal text-zinc-500">
                            · AES-GCM on this device
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
                              id={`celaest-key-${provider.id}`}
                              type={showKeyFor === provider.id ? "text" : "password"}
                              value={keyDrafts[provider.id] ?? ""}
                              onChange={(e) =>
                                setKeyDrafts((prev) => ({
                                  ...prev,
                                  [provider.id]: e.target.value,
                                }))
                              }
                              placeholder={
                                stored
                                  ? "•••••••••••••••• stored in vault"
                                  : PROVIDER_HINTS[provider.id]
                              }
                              autoComplete="off"
                              spellCheck={false}
                              aria-label={`${provider.name} API key`}
                              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-11 text-[13px] font-mono text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10 transition"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowKeyFor(showKeyFor === provider.id ? null : provider.id)
                              }
                              className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                              aria-label={
                                showKeyFor === provider.id ? "Hide API key" : "Show API key"
                              }
                              aria-pressed={showKeyFor === provider.id}
                            >
                              {showKeyFor === provider.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveKey(provider.id)}
                            disabled={!(keyDrafts[provider.id] ?? "").trim()}
                            className="h-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[12px] font-medium text-zinc-200 hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Save to vault
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Endpoint */}
                    <div className="space-y-3">
                      <label
                        htmlFor={`celaest-endpoint-${provider.id}`}
                        className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-400"
                      >
                        <Globe2 className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                        Endpoint
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
                        aria-label={`${provider.name} endpoint`}
                        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[13px] font-mono text-white placeholder:text-zinc-600 focus:border-white/20 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/10 read-only:opacity-60 read-only:cursor-default transition"
                      />
                    </div>

                    {/* Model */}
                    <fieldset className="space-y-3">
                      <legend className="text-[11px] font-medium tracking-[0.14em] uppercase text-zinc-400">
                        Default model
                      </legend>
                      <div
                        className="flex flex-wrap gap-2"
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
                              className={`h-8 rounded-full px-3.5 text-[12px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-[0.98] ${
                                isSelected
                                  ? "bg-white font-medium text-black shadow-sm"
                                  : "border border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-100"
                              }`}
                            >
                              {model.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedModel ? (
                        <p className="text-xs leading-relaxed text-zinc-500">
                          {provider.models.find((m) => m.id === selectedModel)?.bestFor}
                        </p>
                      ) : null}
                    </fieldset>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
                      <SettingsProviderTestButton
                        onClick={() => testProvider(provider.id)}
                        isTesting={isTesting}
                        result={latestTestResult}
                        disabled={!stored && provider.type === "cloud"}
                      />
                      <button
                        type="button"
                        onClick={() => activateProvider(provider.id)}
                        disabled={!stored && provider.type === "cloud"}
                        className={`inline-flex h-10 items-center justify-center rounded-full px-6 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] ${
                          isActive
                            ? "border border-white/15 text-zinc-200 hover:bg-white/[0.04]"
                            : "bg-white text-black shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:bg-zinc-100"
                        }`}
                      >
                        {isActive ? "Active provider" : "Set as active"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vault privacy note */}
      <p className="text-[11px] text-[#66667c] font-light mt-3 px-1 leading-relaxed">
        Keys are encrypted on this device only — never sent to our servers. Switching providers
        keeps your history intact.
      </p>
    </SettingsSection>
  );
};
