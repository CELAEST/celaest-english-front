import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, Globe2 } from "lucide-react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { useAiProviders } from "../hooks/useAiProviders";
import { providerKeyVault } from "../services/providerKeyVault";
import {
  SettingsProviderTestButton,
  SettingsProviderLatencyChip,
  SettingsProviderStatusChip,
} from "./SettingsProviderPrimitives";
import { ProviderIconTile } from "./SettingsProviderIcons";

const PROVIDER_HINTS: Record<AiProviderId, string> = {
  openai: "sk-…",
  anthropic: "sk-ant-…",
  gemini: "AIza…",
  deepseek: "sk-…",
  ollama: "No key required",
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
  const [hasStoredKey, setHasStoredKey] = useState<
    Partial<Record<AiProviderId, boolean>>
  >({});
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
      endpointDrafts[providerId] ??
      providers.find((p) => p.id === providerId)?.defaultEndpoint;

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
    <div className="flex flex-col">
      {/* Section Label */}
      <span className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase text-[#A27FF3]/80 mb-2 sm:mb-3 px-1">
        AI PROVIDERS
      </span>

      {/* Card Container */}
      <div className="rounded-3xl border border-[#111220] bg-[#05060c] shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-[#111220]/70">
        {providers.map((provider) => {
          const isActive = provider.status === "active";
          const isExpanded = expandedId === provider.id;
          const stored = hasStoredKey[provider.id] ?? false;
          const selectedModel =
            modelSelections[provider.id] ?? provider.models[0]?.id ?? "";

          return (
            <div
              key={provider.id}
              className={`transition-colors duration-300 ${
                isActive ? "bg-[#070612]" : ""
              }`}
            >
              {/* Row Header */}
              <button
                type="button"
                onClick={() => handleExpand(provider.id)}
                aria-expanded={isExpanded}
                className={`w-full flex items-center justify-between px-4 sm:px-5 lg:px-6 py-3.5 sm:py-4 transition-all duration-300 cursor-pointer group text-left ${
                  isActive ? "border-l-2 border-[#A27FF3]" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Brand Mark Tile */}
                  <ProviderIconTile providerId={provider.id} isActive={isActive} />

                  <div className="flex flex-col items-start min-w-0">
                    <span className="text-[13px] sm:text-sm font-medium text-[#f8f8f8] leading-tight tracking-wide">
                      {provider.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-[#999a9b] font-light leading-tight mt-0.5">
                      {provider.type === "local" ? "Local · Offline" : "Cloud"} ·{" "}
                      {provider.models.length} models
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-4">
                  <SettingsProviderLatencyChip latencyMs={provider.latencyMs} />
                  <span className="hidden sm:inline-flex">
                    <SettingsProviderStatusChip status={provider.status} />
                  </span>
                  <svg
                    className={`w-4 h-4 text-[#999a9b]/50 group-hover:text-[#A27FF3] transition-all duration-300 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Configuration Panel */}
              {isExpanded && (
                <div className="px-4 sm:px-5 lg:px-6 pb-5 pt-1 animate-[fadeSlideUp_0.35s_ease-out_both] space-y-4">
                  {/* Panel Header */}
                  <div className="flex items-center gap-3.5 py-1">
                    <ProviderIconTile providerId={provider.id} isActive={isActive} size="lg" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide leading-tight">
                        {provider.name}
                        <span className="text-[#999a9b] font-light text-xs sm:text-sm">
                          {" "}
                          · {provider.type === "local" ? "Local" : "Cloud"}
                        </span>
                      </span>
                      <span className="text-[11px] sm:text-xs text-[#77778c] font-light mt-0.5">
                        Configure your private connection
                      </span>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-gradient-to-r from-[#A27FF3]/30 via-[#111220] to-transparent" />

                  {/* API Key */}
                  {provider.type === "cloud" && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#999a9b]">
                        <KeyRound className="w-3.5 h-3.5 text-[#A27FF3]" />
                        API Key
                        <span className="normal-case tracking-normal font-light text-[10px]">
                          · encrypted in your device vault (AES-GCM)
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
                            className="w-full px-4 py-2.5 pr-10 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs font-mono text-[#f8f8f8] placeholder:text-[#55556a] focus:outline-none focus:border-[#A27FF3]/60 focus:bg-white/[0.05] transition-all duration-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowKeyFor(
                                showKeyFor === provider.id ? null : provider.id
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999a9b] hover:text-[#c4b5fd] transition-colors cursor-pointer"
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
                          className="px-3 py-2.5 rounded-xl border border-[#231956] bg-[#0a0817] text-[11px] text-[#c4b5fd] hover:border-[#A27FF3]/60 hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        >
                          Save to vault
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Endpoint */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-[#999a9b]">
                      <Globe2 className="w-3.5 h-3.5 text-[#A27FF3]" />
                      Endpoint
                    </label>
                    <input
                      type="text"
                      value={
                        endpointDrafts[provider.id] ?? provider.defaultEndpoint ?? ""
                      }
                      onChange={(e) =>
                        setEndpointDrafts((prev) => ({
                          ...prev,
                          [provider.id]: e.target.value,
                        }))
                      }
                      readOnly={provider.type === "cloud"}
                      spellCheck={false}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.07] text-xs font-mono text-[#f8f8f8] focus:outline-none focus:border-[#A27FF3]/60 focus:bg-white/[0.05] transition-all duration-300 read-only:opacity-60 read-only:cursor-default"
                    />
                  </div>

                  {/* Model Chips */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold tracking-wider uppercase text-[#999a9b]">
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
                            className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all duration-300 cursor-pointer active:scale-95 ${
                              isSelected
                                ? "bg-violet-600/20 border-violet-500/70 text-white shadow-lg shadow-violet-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                : "bg-white/[0.02] border-white/[0.06] text-[#999a9b] hover:bg-white/[0.05] hover:text-[#f8f8f8]"
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
                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
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
                          ? "bg-transparent border border-[#231956] text-[#c4b5fd]"
                          : "bg-gradient-to-r from-[#7048E8] to-[#8868F8] text-white shadow-[0_4px_20px_rgba(112,72,232,0.4)] hover:shadow-[0_4px_28px_rgba(112,72,232,0.6)] active:scale-95"
                      }`}
                    >
                      {isActive ? "Active provider ✓" : "Set as active"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vault privacy note */}
      <p className="text-[11px] text-[#66667c] font-light mt-2 px-1 leading-relaxed">
        Keys are encrypted on this device only — never sent to our servers.
        Switching providers keeps your history intact.
      </p>
    </div>
  );
};
