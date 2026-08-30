import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Globe2 } from "lucide-react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { useAiProviders } from "../hooks/useAiProviders";
import { providerKeyVault } from "../services/providerKeyVault";
import {
  SettingsProviderTestButton,
} from "./SettingsProviderPrimitives";
import { ProviderMark } from "./SettingsProviderIcons";
import { SettingsSection } from "./SettingsSection";

const PROVIDER_HINTS: Record<AiProviderId, string> = {
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

              {/* Expanded configuration (no nested card — just clean fields) */}
              {isExpanded && (
                <div className="pb-6 pt-1 animate-[fadeSlideUp_0.3s_ease-out_both]">
                  <div className="flex flex-col gap-5 pl-9 sm:pl-11 pr-1">
                    {/* Large brand mark + name — hero header of the expanded panel */}
                    <div className="flex items-center gap-3.5 pb-4 border-b border-white/[0.06]">
                      <ProviderMark providerId={provider.id} isActive={isActive} size="lg" />
                      <div className="min-w-0">
                        <div className="text-[15px] font-medium text-zinc-100 leading-tight">
                          {provider.name}
                        </div>
                        <div className="text-xs text-zinc-500 leading-tight">
                          {provider.type === "cloud"
                            ? "Cloud provider · bring your own key"
                            : "Local / self-hosted"}
                        </div>
                      </div>
                    </div>
                    {/* API Key */}
                    {provider.type === "cloud" && (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#8a8a9e]">
                          <KeyRound className="w-3.5 h-3.5 text-[#8a8a9e]" />
                          API Key
                          <span className="normal-case tracking-normal font-light text-[10px] text-[#66667c]">
                            · encrypted on this device (AES-GCM)
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <input
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
                              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-[#f4f4f5] placeholder:text-[#55556a] focus:outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all duration-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowKeyFor(showKeyFor === provider.id ? null : provider.id)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8a9e] hover:text-[#e4e4ef] transition-colors cursor-pointer"
                              aria-label={showKeyFor === provider.id ? "Hide key" : "Show key"}
                            >
                              {showKeyFor === provider.id ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveKey(provider.id)}
                            disabled={!(keyDrafts[provider.id] ?? "").trim()}
                            className="px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-[11px] text-[#d4d4e8] hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                          >
                            Save to vault
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Endpoint */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#8a8a9e]">
                        <Globe2 className="w-3.5 h-3.5 text-[#8a8a9e]" />
                        Endpoint
                      </label>
                      <input
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
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-mono text-[#f4f4f5] focus:outline-none focus:border-white/30 focus:bg-white/[0.04] transition-all duration-300 read-only:opacity-50 read-only:cursor-default"
                      />
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-[#8a8a9e]">
                        Default model
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {provider.models.map((model) => {
                          const isSelected = selectedModel === model.id;
                          return (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() =>
                                setModelSelections((prev) => ({
                                  ...prev,
                                  [provider.id]: model.id,
                                }))
                              }
                              title={model.bestFor}
                              className={`px-3 py-1.5 rounded-lg border text-[11px] transition-all duration-300 cursor-pointer active:scale-95 ${
                                isSelected
                                  ? "bg-white/[0.07] border-white/30 text-white"
                                  : "bg-transparent border-white/[0.08] text-[#8a8a9e] hover:border-white/20 hover:text-[#f4f4f5]"
                              }`}
                            >
                              {model.label}
                            </button>
                          );
                        })}
                      </div>
                      {selectedModel && (
                        <p className="text-[11px] text-[#77778c] font-light">
                          {provider.models.find((m) => m.id === selectedModel)?.bestFor}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
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
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                          isActive
                            ? "text-[#9bbf9b] border border-white/10"
                            : "bg-white text-[#0b0b10] hover:bg-white/90 active:scale-95"
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
