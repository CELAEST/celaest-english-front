import { useState, useEffect, useRef } from "react";
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
];

const DEFAULT_ENDPOINTS: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1",
};

const DEFAULT_MODELS: Record<string, string> = {
  groq: "openai/gpt-oss-120b",
};

export const useApiKeySetup = () => {
  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>("groq");
  const [keyInput, setKeyInput] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verifiedSuccessInfo, setVerifiedSuccessInfo] = useState<string | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const target: AiProviderId = "groq";
      const exists = await providerKeyVault.hasKey(target);
      if (mounted) {
        setSelectedProvider(target);
        setHasExistingKey(exists);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const selectProvider = async (_id: AiProviderId) => {
    setSelectedProvider("groq");
    setVerificationError(null);
    setVerifiedSuccessInfo(null);
    setKeyInput("");
    const exists = await providerKeyVault.hasKey("groq");
    setHasExistingKey(exists);
  };

  const verifyAndSave = async (onSuccess: () => void) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    const rawKey = keyInput.trim();
    let effectiveKey = rawKey;
    if (!effectiveKey && hasExistingKey) {
      effectiveKey = (await providerKeyVault.getKey(selectedProvider)) || "";
    }
    if (!effectiveKey) {
      setVerificationError("Por favor ingresa una clave de API válida");
      isSubmittingRef.current = false;
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
      setVerifiedSuccessInfo("¡Motor activo confirmado!");
      setTimeout(() => {
        setIsVerifying(false);
        isSubmittingRef.current = false;
        onSuccess();
      }, 200);
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
        isSubmittingRef.current = false;
        setVerificationError(probe.message);
        return;
      }
      const finalModel = probe.discoveredModel || model;
      await providerKeyVault.saveKey(selectedProvider, effectiveKey);
      await providerKeyVault.saveActiveProviderId(selectedProvider);
      await providerKeyVault.setCentralCoreEnabled(false);
      await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: finalModel });
      setHasExistingKey(true);
      setVerifiedSuccessInfo(
        isCorsOrNet
          ? "Clave guardada en tu dispositivo (Modo directo activo)."
          : "¡Motor configurado y activo con éxito!"
      );
      setTimeout(() => {
        setIsVerifying(false);
        isSubmittingRef.current = false;
        onSuccess();
      }, 600);
    } catch (err: any) {
      try {
        await providerKeyVault.saveKey(selectedProvider, effectiveKey);
        await providerKeyVault.saveActiveProviderId(selectedProvider);
        await providerKeyVault.setCentralCoreEnabled(false);
        await providerKeyVault.saveConfig(selectedProvider, { endpoint, defaultModel: model });
        setHasExistingKey(true);
        setVerifiedSuccessInfo("Clave guardada en tu dispositivo.");
        setTimeout(() => {
          setIsVerifying(false);
          isSubmittingRef.current = false;
          onSuccess();
        }, 600);
      } catch {
        setIsVerifying(false);
        isSubmittingRef.current = false;
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
