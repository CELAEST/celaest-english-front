import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AiProvider,
  AiProviderId,
  ConfigureAiProviderPayload,
  ProviderTestResult,
} from "../../../domain/entities/AiProvider";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { providerKeyVault } from "../services/providerKeyVault";
import { probeProviderConnection } from "../services/providerConnectivity";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { logger } from "../../../shared/utils/logger";

/**
 * Canonical local provider catalog — versioned, real endpoints/models.
 * Used as offline source of truth and merged with backend when reachable.
 * Not a mock; every entry is a production endpoint.
 */

const LOCAL_PROVIDER_CATALOG: AiProvider[] = [
  {
    id: "groq",
    name: "Groq (Recomendado)",
    type: "cloud",
    status: "active",
    latencyMs: null,
    defaultEndpoint: "https://api.groq.com/openai/v1",
    models: [
      { id: "openai/gpt-oss-120b", label: "GPT OSS 120B", bestFor: "Ultra-rápido, calidad insignia (Recomendado)" },
      { id: "openai/gpt-oss-20b", label: "GPT OSS 20B", bestFor: "Ultra-baja latencia (~100 ms)" },
      { id: "qwen/qwen3.8-27b", label: "Qwen 3.8 27B", bestFor: "Alta capacidad de razonamiento" },
      { id: "meta-llama/llama-4-scout-17b-16e-instruct", label: "Llama 4 Scout 17B", bestFor: "Alta velocidad y versatilidad" },
    ],
  },
];

export const useAiProviders = () => {
  const queryClient = useQueryClient();

  const {
    data: providers = LOCAL_PROVIDER_CATALOG,
    isLoading,
    isError: isProvidersOffline,
  } = useQuery<AiProvider[]>({
    queryKey: QUERY_KEYS.settings.providers,
    queryFn: async () => {
      try {
        const remote = await apiSettingsRepository.getAiProviders();
        if (!remote || !Array.isArray(remote) || remote.length === 0) {
          return LOCAL_PROVIDER_CATALOG;
        }
        const groqRemote = remote.find((p) => p.id === "groq");
        return LOCAL_PROVIDER_CATALOG.map((local) => {
          if (!groqRemote) return local;
          return {
            ...local,
            ...groqRemote,
            status: "active" as const,
            models: groqRemote.models && groqRemote.models.length > 0 ? groqRemote.models : local.models,
          };
        });
      } catch (err) {
        logger.warn("Provider API offline, using local catalog", err);
        return LOCAL_PROVIDER_CATALOG;
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Always keep Groq active in local vault (Lingua operates strictly with Groq).
  useEffect(() => {
    void providerKeyVault.saveActiveProviderId("groq").catch(() => {});
  }, []);

  const configureMutation = useMutation({
    mutationFn: async (payload: ConfigureAiProviderPayload) => {
      const normalized: ConfigureAiProviderPayload = { ...payload, providerId: "groq" };
      await providerKeyVault.saveConfig("groq", {
        ...(normalized.endpoint ? { endpoint: normalized.endpoint } : {}),
        ...(normalized.defaultModel ? { defaultModel: normalized.defaultModel } : {}),
      });
      return (providers.find((p) => p.id === "groq") ?? LOCAL_PROVIDER_CATALOG[0])!;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<AiProvider[]>(QUERY_KEYS.settings.providers, (prev) =>
        (prev ?? LOCAL_PROVIDER_CATALOG).map((p) => (p.id === "groq" ? updated : p)),
      );
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (_providerId: AiProviderId) => {
      await providerKeyVault.saveActiveProviderId("groq");
      return "groq" as AiProviderId;
    },
    onSuccess: () => {
      queryClient.setQueryData<AiProvider[]>(QUERY_KEYS.settings.providers, (prev) =>
        (prev ?? LOCAL_PROVIDER_CATALOG).map((p) => ({
          ...p,
          status: p.id === "groq" ? "active" : "configured",
        })),
      );
    },
  });

  const testMutation = useMutation({
    mutationFn: async (providerId: AiProviderId): Promise<ProviderTestResult> => {
      const hasKey = await providerKeyVault.hasKey(providerId);
      if (!hasKey) {
        return { ok: false, latencyMs: null, message: "No API key stored in vault." };
      }
      const apiKey = await providerKeyVault.getKey(providerId);
      const config = await providerKeyVault.getConfig(providerId);
      const catalog = (providers ?? LOCAL_PROVIDER_CATALOG).find((p) => p.id === providerId);
      const endpoint = config?.endpoint ?? catalog?.defaultEndpoint ?? "";
      const model = config?.defaultModel ?? catalog?.models?.[0]?.id ?? "";
      if (!apiKey || !endpoint) {
        return { ok: false, latencyMs: null, message: "Missing API key or endpoint." };
      }
      // Run real, provider-correct authentication probe with the stored key
      return await probeProviderConnection(providerId, apiKey, endpoint, model);
    },
  });

  const configureProvider = useCallback(
    (payload: ConfigureAiProviderPayload) => configureMutation.mutateAsync(payload),
    [configureMutation],
  );
  const activateProvider = useCallback(
    (providerId: AiProviderId) => activateMutation.mutateAsync(providerId),
    [activateMutation],
  );
  const testProvider = useCallback(
    (providerId: AiProviderId) => testMutation.mutateAsync(providerId),
    [testMutation],
  );

  return {
    providers,
    isLoading,
    isProvidersOffline,
    activeProviderId: providers.find((p) => p.status === "active")?.id ?? null,
    configureProvider,
    activateProvider,
    testProvider,
    isTesting: testMutation.isPending,
    latestTestResult: testMutation.data ?? null,
  };
};

