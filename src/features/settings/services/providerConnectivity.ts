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
  discoveredModel?: string | undefined;
  availableModels?: string[] | undefined;
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
          "anthropic-dangerous-direct-browser-access": "true",
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
      // Testing with a minimal 1-token completion verifies BOTH authentication
      // AND positive credit balance/quota in the user's account.
      return {
        url: `${base}/chat/completions`,
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_tokens: 1,
          messages: [{ role: "user", content: "ping" }],
        }),
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
      let discoveredModel: string | undefined;
      let availableModels: string[] | undefined;
      try {
        const data = await res.json();
        if (typeof data?.model === "string") {
          discoveredModel = data.model;
        } else if (Array.isArray(data?.data)) {
          const list: string[] = data.data
            .map((m: any) => (typeof m?.id === "string" ? m.id : ""))
            .filter(Boolean);
          availableModels = list;
          if (providerId === "groq") {
            const groqRank = [
              "openai/gpt-oss-120b",
              "openai/gpt-oss-20b",
              "qwen/qwen3.8-27b",
              "llama-3.3-70b-versatile",
              "llama-3.1-8b-instant",
              "mixtral-8x7b-32768",
            ];
            discoveredModel =
              groqRank.find((id) => list.includes(id)) ||
              list.find(
                (id) =>
                  (id.includes("gpt-oss") ||
                    id.includes("qwen") ||
                    id.includes("llama") ||
                    id.includes("mixtral")) &&
                  !id.includes("allam") &&
                  !id.includes("whisper") &&
                  !id.includes("guard") &&
                  !id.includes("vision"),
              ) ||
              "openai/gpt-oss-120b";
          }
        }
      } catch {
        // Probe endpoint response was non-JSON
      }
      return { ok: true, latencyMs, message: "Connected", discoveredModel, availableModels };
    }

    const errBody = await res.text().catch(() => "");
    const lowerBody = errBody.toLowerCase();

    // Fallback: If chat/completions failed because the requested model doesn't exist, probe GET /models
    if ((res.status === 400 || res.status === 404) && (lowerBody.includes("model") || lowerBody.includes("does not exist"))) {
      try {
        const base = endpoint.replace(/\/+$/, "");
        const modelsRes = await fetch(`${base}/models`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal,
        });
        if (modelsRes.ok) {
          const modelsData = await modelsRes.json().catch(() => null);
          let discovered: string | undefined;
          let avail: string[] | undefined;
          if (Array.isArray(modelsData?.data)) {
            avail = modelsData.data.map((m: any) => m?.id).filter(Boolean);
            if (providerId === "groq") {
              const groqRank = [
                "openai/gpt-oss-120b",
                "openai/gpt-oss-20b",
                "qwen/qwen3.8-27b",
                "llama-3.3-70b-versatile",
                "llama-3.1-8b-instant",
                "mixtral-8x7b-32768",
              ];
              discovered = groqRank.find((id) => avail?.includes(id)) || avail?.[0] || "openai/gpt-oss-120b";
            } else {
              discovered = avail?.[0];
            }
          }
          const latencyMs = Math.round(performance.now() - startedAt);
          return { ok: true, latencyMs, message: "Connected", discoveredModel: discovered, availableModels: avail };
        }
      } catch {
        // Fall through to error handler
      }
    }

    const provName =
      providerId === "deepseek"
        ? "DeepSeek"
        : providerId === "openai"
          ? "OpenAI"
          : providerId === "anthropic"
            ? "Claude"
            : providerId === "grok"
              ? "xAI Grok"
              : providerId === "gemini"
                ? "Gemini"
                : providerId === "groq"
                  ? "Groq"
                  : providerId.toUpperCase();

    // 1. Invalid or unauthorized key (401, 403, or Google's 400 API_KEY_INVALID / API key not valid)
    const isInvalidKey =
      res.status === 401 ||
      res.status === 403 ||
      lowerBody.includes("api key not valid") ||
      lowerBody.includes("api_key_invalid") ||
      lowerBody.includes("invalid_api_key") ||
      lowerBody.includes("invalid api key") ||
      lowerBody.includes("incorrect api key") ||
      lowerBody.includes("api key not found") ||
      lowerBody.includes("unregistered callers") ||
      lowerBody.includes("unauthorized") ||
      lowerBody.includes("unauthenticated") ||
      lowerBody.includes("authentication") ||
      (lowerBody.includes("api key") &&
        (lowerBody.includes("invalid") ||
          lowerBody.includes("not valid") ||
          lowerBody.includes("wrong") ||
          lowerBody.includes("missing")));

    if (isInvalidKey) {
      return {
        ok: false,
        latencyMs,
        message: `La clave de ${provName} no es válida o quedó copiada incompleta. Revisa que no falten caracteres o usa Groq (100% gratis).`,
      };
    }

    // 2. Quota / Balance exhaustion (DeepSeek 402/400 Insufficient Balance, OpenAI 429 credit_balance_exhausted, Anthropic credit, xAI spending limit)
    const isQuota =
      res.status === 402 ||
      lowerBody.includes("insufficient balance") ||
      lowerBody.includes("insufficient_balance") ||
      lowerBody.includes("insufficient_quota") ||
      lowerBody.includes("credit balance") ||
      lowerBody.includes("credit_balance_exhausted") ||
      lowerBody.includes("no credits remaining") ||
      lowerBody.includes("spending limit") ||
      lowerBody.includes("used all available credits") ||
      lowerBody.includes("purchase more credits") ||
      lowerBody.includes("insufficient funds") ||
      lowerBody.includes("billing") ||
      (lowerBody.includes("balance") && !lowerBody.includes("load balance"));

    if (isQuota) {
      return {
        ok: false,
        latencyMs,
        message: `Tu cuenta de ${provName} no tiene saldo disponible ($0.00). Cambia a Groq (100% gratis) para continuar de inmediato.`,
      };
    }

    // 3. High Demand / Server Overload (HTTP 503 UNAVAILABLE, e.g. Gemini spikes)
    const isOverloaded =
      res.status === 503 ||
      res.status === 502 ||
      lowerBody.includes("high demand") ||
      lowerBody.includes("unavailable") ||
      lowerBody.includes("temporarily overloaded") ||
      lowerBody.includes("overloaded") ||
      lowerBody.includes("capacity");

    if (isOverloaded) {
      return {
        ok: false,
        latencyMs,
        message: `Los servidores de ${provName} están temporalmente saturados por alta demanda mundial. Cambia a Groq (100% gratis) para no tener pausas.`,
      };
    }

    // 4. Model not found or not permitted for this account tier (e.g. grok-2 on xAI, retired models on Gemini)
    const isModelIssue =
      res.status === 404 ||
      lowerBody.includes("model not found") ||
      lowerBody.includes("model_not_found") ||
      lowerBody.includes("does not exist") ||
      lowerBody.includes("no longer available") ||
      lowerBody.includes("not supported for generatecontent") ||
      lowerBody.includes("json_validate_failed") ||
      (res.status === 400 && lowerBody.includes("model"));

    if (isModelIssue) {
      return {
        ok: false,
        latencyMs,
        message: `El modelo de ${provName} no está disponible para tu cuenta. Te recomendamos usar Groq (100% gratis y probado).`,
      };
    }

    // 5. Rate limit (429 TPM/RPM)
    const isRateLimit =
      res.status === 429 ||
      lowerBody.includes("rate_limit") ||
      lowerBody.includes("rate limit") ||
      lowerBody.includes("too many requests");

    if (isRateLimit) {
      return {
        ok: false,
        latencyMs,
        message: `Demasiadas peticiones en pocos segundos. Espera un momento o usa Groq (100% gratis).`,
      };
    }

    // 6. Clean Fallback: Never dump raw developer JSON to the user
    return {
      ok: false,
      latencyMs,
      message: `No pudimos conectar con ${provName}. Revisa que la clave esté activa o usa Groq (100% gratis).`,
    };
  } catch {
    const latencyMs = Math.round(performance.now() - startedAt);
    return {
      ok: false,
      latencyMs,
      message: "No se pudo conectar con el servidor. Revisa tu conexión a internet o usa Groq (100% gratis).",
    };
  } finally {
    clearTimeout(timeout);
  }
};
