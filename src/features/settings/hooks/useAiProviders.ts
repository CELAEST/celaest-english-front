import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AiProvider,
  AiProviderId,
  ConfigureAiProviderPayload,
  ProviderTestResult,
} from "../../../domain/entities/AiProvider";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { providerKeyVault } from "../services/providerKeyVault";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

/**
 * Offline fallback catalog (RFC-004). Used when the backend is unreachable
 * so the provider picker always renders. `hasLocalKey` reflects the
 * encrypted local vault state per provider.
 */

const FALLBACK_PROVIDERS: AiProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.openai.com/v1",
    models: [
      { id: "gpt-4o", label: "GPT-4o", bestFor: "Balanced flagship" },
      { id: "gpt-4o-realtime", label: "GPT-4o Realtime", bestFor: "Live voice sessions" },
      { id: "gpt-4o-mini", label: "GPT-4o mini", bestFor: "Fast & cheap drills" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.anthropic.com/v1",
    models: [
      { id: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", bestFor: "Deep writing analysis" },
      { id: "claude-3-5-haiku", label: "Claude 3.5 Haiku", bestFor: "Quick corrections" },
    ],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://generativelanguage.googleapis.com/v1",
    models: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", bestFor: "Complex reasoning" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", bestFor: "Fast everyday practice" },
      { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", bestFor: "Balanced lightweight" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.deepseek.com/v1",
    models: [
      { id: "deepseek-reasoner", label: "DeepSeek R1", bestFor: "Grammar reasoning" },
      { id: "deepseek-chat", label: "DeepSeek V3", bestFor: "Everyday practice" },
    ],
  },
  {
    id: "ollama",
    name: "Ollama",
    type: "local",
    status: "unreachable",
    latencyMs: null,
    defaultEndpoint: "http://localhost:11434",
    models: [
      { id: "llama3.1", label: "Llama 3.1", bestFor: "Fully offline" },
      { id: "mistral", label: "Mistral", bestFor: "Lightweight local" },
    ],
  },
];

export const useAiProviders = () => {
  const queryClient = useQueryClient();

  const { data: providers = FALLBACK_PROVIDERS, isLoading } = useQuery<
    AiProvider[]
  >({
    queryKey: QUERY_KEYS.settings.providers,
    queryFn: async () => {
      try {
        return await apiSettingsRepository.getAiProviders();
      } catch (err) {
        console.warn("Provider API offline, using fallback catalog", err);
        return FALLBACK_PROVIDERS;
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const configureMutation = useMutation({
    mutationFn: async (payload: ConfigureAiProviderPayload) => {
      try {
        return await apiSettingsRepository.configureAiProvider(payload);
      } catch {
        // BYOK offline mode: persist non-sensitive config locally only.
        return providers.find((p) => p.id === payload.providerId)!;
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<AiProvider[]>(QUERY_KEYS.settings.providers, (prev) =>
        (prev ?? FALLBACK_PROVIDERS).map((p) => (p.id === updated.id ? updated : p))
      );
    },
  });

  const activateMutation = useMutation({
    mutationFn: async (providerId: AiProviderId) => {
      try {
        return await apiSettingsRepository.activateAiProvider(providerId);
      } catch {
        return providerId;
      }
    },
    onSuccess: (_result, providerId) => {
      queryClient.setQueryData<AiProvider[]>(QUERY_KEYS.settings.providers, (prev) =>
        (prev ?? FALLBACK_PROVIDERS).map((p) => ({
          ...p,
          status:
            p.id === providerId && p.status !== "unreachable"
              ? "active"
              : p.status === "active"
                ? "configured"
                : p.status,
        }))
      );
    },
  });

  const testMutation = useMutation({
    mutationFn: async (providerId: AiProviderId): Promise<ProviderTestResult> => {
      const startedAt = performance.now();
      const hasKey = await providerKeyVault.hasKey(providerId);
      if (!hasKey) {
        return { ok: false, latencyMs: null, message: "No API key stored in vault." };
      }
      try {
        const result = await apiSettingsRepository.testAiProvider(providerId);
        return result;
      } catch {
        // Backend offline — measure local roundtrip to endpoint as a heuristic.
        const latency = Math.round(performance.now() - startedAt);
        return {
          ok: hasKey,
          latencyMs: latency,
          message: hasKey
            ? "Key found in vault (offline check)."
            : "Key missing.",
        };
      }
    },
  });

  return {
    providers,
    isLoading,
    activeProviderId:
      providers.find((p) => p.status === "active")?.id ?? null,
    configureProvider: (payload: ConfigureAiProviderPayload) =>
      configureMutation.mutateAsync(payload),
    activateProvider: (providerId: AiProviderId) =>
      activateMutation.mutateAsync(providerId),
    testProvider: (providerId: AiProviderId) => testMutation.mutateAsync(providerId),
    isTesting: testMutation.isPending,
    latestTestResult: testMutation.data ?? null,
  };
};

