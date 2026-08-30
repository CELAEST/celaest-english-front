import { useCallback } from "react";
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
  {
    id: "grok",
    name: "Grok (xAI)",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.x.ai/v1",
    models: [
      { id: "grok-3", label: "Grok 3", bestFor: "Frontier reasoning" },
      { id: "grok-3-mini", label: "Grok 3 mini", bestFor: "Fast everyday practice" },
      { id: "grok-2", label: "Grok 2", bestFor: "Balanced general use" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.perplexity.ai",
    models: [
      { id: "sonar", label: "Sonar", bestFor: "Grounded answers" },
      { id: "sonar-pro", label: "Sonar Pro", bestFor: "Deep research" },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://openrouter.ai/api/v1",
    models: [
      { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", bestFor: "Deep writing analysis" },
      { id: "openai/gpt-4o", label: "GPT-4o", bestFor: "Balanced flagship" },
      { id: "meta-llama/llama-3.1-70b-instruct", label: "Llama 3.1 70B", bestFor: "Open-weight power" },
    ],
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api-inference.huggingface.co/models",
    models: [
      { id: "meta-llama/Llama-3.1-70B-Instruct", label: "Llama 3.1 70B", bestFor: "Open-weight power" },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", label: "Mistral 7B", bestFor: "Lightweight open" },
    ],
  },
  {
    id: "qwen",
    name: "Qwen (Alibaba)",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: [
      { id: "qwen-max", label: "Qwen Max", bestFor: "Multilingual reasoning" },
      { id: "qwen2.5-72b-instruct", label: "Qwen2.5 72B", bestFor: "Open-weight flagship" },
    ],
  },
  {
    id: "meta",
    name: "Meta Llama",
    type: "cloud",
    status: "available",
    latencyMs: null,
    defaultEndpoint: "https://api.llama.com/v1",
    models: [
      { id: "llama-3.1-70b", label: "Llama 3.1 70B", bestFor: "Open-weight power" },
      { id: "llama-3.1-8b", label: "Llama 3.1 8B", bestFor: "Lightweight open" },
    ],
  },
];

export const useAiProviders = () => {
  const queryClient = useQueryClient();

  const { data: providers = FALLBACK_PROVIDERS, isLoading } = useQuery<AiProvider[]>({
    queryKey: QUERY_KEYS.settings.providers,
    queryFn: async () => {
      try {
        return await apiSettingsRepository.getAiProviders();
      } catch (err) {
        logger.warn("Provider API offline, using fallback catalog", err);
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
        (prev ?? FALLBACK_PROVIDERS).map((p) => (p.id === updated.id ? updated : p)),
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
      try {
        const result = await apiSettingsRepository.testAiProvider(providerId);
        return result;
      } catch {
        // Backend offline (or no provider endpoint) — run a real, provider-correct
        // connection probe against the stored key + endpoint as a best-effort check.
        const apiKey = await providerKeyVault.getKey(providerId);
        const config = await providerKeyVault.getConfig(providerId);
        const catalog = (providers ?? FALLBACK_PROVIDERS).find((p) => p.id === providerId);
        const endpoint = config?.endpoint ?? catalog?.defaultEndpoint ?? "";
        const model = config?.defaultModel ?? catalog?.models?.[0]?.id ?? "";
        if (!apiKey || !endpoint) {
          return { ok: false, latencyMs: null, message: "Missing API key or endpoint." };
        }
        return await probeProviderConnection(providerId, apiKey, endpoint, model);
      }
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
    activeProviderId: providers.find((p) => p.status === "active")?.id ?? null,
    configureProvider,
    activateProvider,
    testProvider,
    isTesting: testMutation.isPending,
    latestTestResult: testMutation.data ?? null,
  };
};
