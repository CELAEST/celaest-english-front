import { useState, useEffect } from "react";
import { AiProviderId } from "../../../domain/entities/AiProvider";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { probeProviderConnection } from "../../settings/services/providerConnectivity";

export interface ProviderOption {
  id: AiProviderId;
  name: string;
  badge: string;
  placeholder: string;
  url: string;
  isFree: boolean;
}

export const ONBOARDING_PROVIDERS: ProviderOption[] = [
  { id: "groq", name: "Groq", badge: "Recomendada", placeholder: "gsk_...", url: "https://console.groq.com/keys", isFree: true },
  { id: "gemini", name: "Gemini", badge: "Flash Gratis", placeholder: "AIza...", url: "https://aistudio.google.com/apikey", isFree: true },
  { id: "grok", name: "Grok", badge: "$25 Gratis", placeholder: "xai-...", url: "https://console.x.ai/", isFree: true },
  { id: "openai", name: "OpenAI", badge: "GPT-4o", placeholder: "sk-proj-...", url: "https://platform.openai.com/api-keys", isFree: false },
  { id: "anthropic", name: "Claude", badge: "3.5 Sonnet", placeholder: "sk-ant-...", url: "https://console.anthropic.com/settings/keys", isFree: false },
  { id: "deepseek", name: "DeepSeek", badge: "V3", placeholder: "sk-...", url: "https://platform.deepseek.com/api_keys", isFree: false },
];

const DEFAULT_ENDPOINTS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1",
  gemini: "https://generativelanguage.googleapis.com/v1beta",
  grok: "https://api.x.ai/v1",
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  deepseek: "https://api.deepseek.com/v1",
};

const DEFAULT_MODELS: Record<string, string> = {
  groq: "openai/gpt-oss-120b",
  gemini: "gemini-3.6-flash",
  grok: "grok-2",
  openai: "gpt-4o-mini",
  anthropic: "claude-3-5-haiku-20241022",
  deepseek: "deepseek-chat",
};

export const useApiKeySetup = () => {
  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>("groq");
  const [keyInput, setKeyInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedSuccessInfo, setVerifiedSuccessInfo] = useState<string | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const activeId = await providerKeyVault.getActiveProviderId();
      const target = activeId || "groq";
      const exists = await providerKeyVault.hasKey(target);
      if (mounted) {
        setSelectedProvider(target);
        setHasExistingKey(exists);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const selectProvider = async (id: AiProviderId) => {
    setSelectedProvider(id);
    setVerificationError(null);
    setVerifiedSuccessInfo(null);
    setKeyInput("");
    const exists = await providerKeyVault.hasKey(id);
    setHasExistingKey(exists);
  };

  const verifyAndSave = async (onSuccess: () => void) => {
    const rawKey = keyInput.trim();
    let effectiveKey = rawKey;
    if (!effectiveKey && hasExistingKey) {
      effectiveKey = (await providerKeyVault.getKey(selectedProvider)) || "";
    }
    if (!effectiveKey) {
      setVerificationError("Por favor ingresa una clave de API válida");
      return;
    }

    // 1. Continuing with already configured and active key: NEVER block on network/probe failure
    if (hasExistingKey && !rawKey) {
      setIsVerifying(true);
      setVerificationError(null);
      const endpoint = DEFAULT_ENDPOINTS[selectedProvider] || "https://api.groq.com/openai/v1";
      const model = DEFAULT_MODELS[selectedProvider] || "llama-3.3-70b-versatile";

      await providerKeyVault.saveActiveProviderId(selectedProvider);
      await providerKeyVault.setCentralCoreEnabled(false);

      // Best-effort background probe for dynamic model discovery only; never block navigation
      try {
        const probe = await probeProviderConnection(selectedProvider, effectiveKey, endpoint, model);
        if (probe.ok && probe.discoveredModel) {
          await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: probe.discoveredModel });
        }
      } catch {
        // Non-blocking best-effort
      }
      setIsVerifying(false);
      setVerifiedSuccessInfo("¡Motor activo confirmado!");
      setTimeout(onSuccess, 200);
      return;
    }

    // 2. User entered a new key
    setIsVerifying(true);
    setVerificationError(null);
    const endpoint = DEFAULT_ENDPOINTS[selectedProvider] || "https://api.groq.com/openai/v1";
    const model = DEFAULT_MODELS[selectedProvider] || "llama-3.3-70b-versatile";

    try {
      const probe = await probeProviderConnection(selectedProvider, effectiveKey, endpoint, model);
      const isCorsOrNet =
        !probe.ok &&
        (probe.message.toLowerCase().includes("cors") ||
          probe.message.toLowerCase().includes("unreachable") ||
          probe.message.toLowerCase().includes("no se pudo conectar") ||
          probe.message.toLowerCase().includes("conexión a internet") ||
          probe.message.toLowerCase().includes("servidor") ||
          probe.message.toLowerCase().includes("failed to fetch") ||
          probe.message.toLowerCase().includes("network"));

      if (!probe.ok && !isCorsOrNet) {
        setIsVerifying(false);
        setVerificationError(probe.message);
        return;
      }
      const finalModel = probe.discoveredModel || model;
      await providerKeyVault.saveKey(selectedProvider, effectiveKey);
      await providerKeyVault.saveActiveProviderId(selectedProvider);
      await providerKeyVault.setCentralCoreEnabled(false);
      await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: finalModel });
      setHasExistingKey(true);
      setIsVerifying(false);
      setVerifiedSuccessInfo(
        isCorsOrNet
          ? "Clave guardada en tu dispositivo (Modo directo activo)."
          : "¡Motor configurado y activo con éxito!"
      );
      setTimeout(onSuccess, 600);
    } catch (err: any) {
      try {
        await providerKeyVault.saveKey(selectedProvider, effectiveKey);
        await providerKeyVault.saveActiveProviderId(selectedProvider);
        await providerKeyVault.setCentralCoreEnabled(false);
        await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: model });
        setHasExistingKey(true);
        setIsVerifying(false);
        setVerifiedSuccessInfo("Clave guardada en tu dispositivo.");
        setTimeout(onSuccess, 600);
      } catch {
        setIsVerifying(false);
        setVerificationError(`No pudimos verificar la clave. Revisa tu conexión a internet o usa Groq (100% gratis).`);
      }
    }
  };

  const currentProvider = ONBOARDING_PROVIDERS.find((p) => p.id === selectedProvider) || ONBOARDING_PROVIDERS[0];

  return {
    selectedProvider,
    selectProvider,
    currentProvider,
    keyInput,
    setKeyInput,
    isVerifying,
    verificationError,
    verifiedSuccessInfo,
    hasExistingKey,
    verifyAndSave,
  };
};
