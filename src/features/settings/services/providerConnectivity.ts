/**
 * Provider connectivity probe
 *
 * Performs a minimal, provider-correct request to verify that a stored API key
 * actually reaches the provider's endpoint. Used as the offline fallback when
 * the backend is unreachable, so "Test connection" gives a real signal
 * (valid key / reachable / CORS-blocked) instead of only checking local vault
 * state.
 *
 * NOTE: most cloud vendors block browser CORS, so a CORS error here does NOT
 * mean the key is invalid — it means the browser cannot call that origin
 * directly. The authoritative check is the backend proxy, when available.
 */

import { AiProviderId } from "../../../domain/entities/AiProvider";

export interface ProviderProbeResult {
  ok: boolean;
  latencyMs: number | null;
  message: string;
}

interface RequestSpec {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: string;
}

const buildSpec = (
  providerId: AiProviderId,
  apiKey: string,
  endpoint: string,
  model: string,
): RequestSpec => {
  const base = endpoint.replace(/\/+$/, "");

  switch (providerId) {
    case "anthropic":
      return {
        url: `${base}/messages`,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model,
          max_tokens: 1,
          messages: [{ role: "user", content: "ping" }],
        }),
      };

    case "gemini":
      return {
        url: `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(
          apiKey,
        )}`,
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "ping" }] }] }),
      };

    case "ollama":
      return {
        url: `${base}/api/tags`,
        method: "GET",
        headers: {},
      };

    case "huggingface":
      return {
        url: `${base}/${encodeURIComponent(model)}`,
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: "ping" }),
      };

    default: {
      // OpenAI-compatible: groq, openai, grok (xAI), perplexity, openrouter,
      // deepseek, qwen, meta (Llama API).
      // Testing with GET /models authenticates the key and verifies the endpoint
      // without depending on a specific model ID existing in the account tier.
      return {
        url: `${base}/models`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      };
    }
  }
};

export const probeProviderConnection = async (
  providerId: AiProviderId,
  apiKey: string,
  endpoint: string,
  model: string,
): Promise<ProviderProbeResult> => {
  const startedAt = performance.now();
  const spec = buildSpec(providerId, apiKey, endpoint, model);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  const init: RequestInit = {
    method: spec.method,
    headers: spec.headers,
    signal: controller.signal,
  };
  if (spec.body !== undefined) {
    init.body = spec.body;
  }

  try {
    const res = await fetch(spec.url, init);
    const latencyMs = Math.round(performance.now() - startedAt);

    if (res.ok) {
      return { ok: true, latencyMs, message: "Connected" };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, latencyMs, message: "Invalid API key" };
    }
    if (res.status === 404) {
      return { ok: false, latencyMs, message: "Endpoint or model not found (404)" };
    }
    return { ok: false, latencyMs, message: `HTTP ${res.status}` };
  } catch {
    const latencyMs = Math.round(performance.now() - startedAt);
    return {
      ok: false,
      latencyMs,
      message: "Unreachable — offline or browser CORS blocked this origin",
    };
  } finally {
    clearTimeout(timeout);
  }
};
