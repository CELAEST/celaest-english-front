/**
 * Direct Client AI Service (BYOK Execution Engine)
 * Directly calls provider endpoints (Groq, Gemini, DeepSeek, OpenAI) using
 * the user's client-encrypted API key when CELAEST-CORE is disabled or bypassed.
 */

import { AiProviderId } from "../../../domain/entities/AiProvider";
import { providerKeyVault } from "./providerKeyVault";
import { logger } from "../../../shared/utils/logger";

export class AiInfrastructureError extends Error {
  constructor(
    public readonly code:
      | "RATE_LIMIT_COOLDOWN"
      | "AI_KEYS_EXHAUSTED"
      | "AUTH_DECLINED_KEY"
      | "GATEWAY_TIMEOUT"
      | "CLUSTER_OUTAGE",
    message: string,
    public readonly status?: number,
    public readonly providerId?: AiProviderId,
    public readonly rawErrorDetails?: string,
  ) {
    super(message);
    this.name = "AiInfrastructureError";
  }
}

/**
 * Diagnostic parser for provider HTTP error bodies.
 * Identifies exact root causes (quota exhaustion, invalid API key, TPM rate limits, network outages)
 * to provide human-friendly feedback.
 */
export function parseProviderError(
  status: number,
  errBody: string,
  providerId: AiProviderId,
): AiInfrastructureError {
  let parsedMsg = "";
  let parsedCode = "";
  let parsedType = "";

  try {
    const json = JSON.parse(errBody);
    parsedMsg =
      json?.error?.message ||
      json?.message ||
      (typeof json?.error === "string" ? json.error : "");
    parsedCode = String(json?.error?.code || json?.code || "");
    parsedType = String(json?.error?.type || json?.type || "");
  } catch {
    parsedMsg = errBody.slice(0, 240);
  }

  const lowerMsg = (parsedMsg + " " + parsedCode + " " + parsedType).toLowerCase();
  const provUpper = providerId.toUpperCase();

  // 1. Quota / Balance Exhaustion (e.g. OpenAI 429 insufficient_quota, Anthropic credit balance, DeepSeek 402)
  const isQuota =
    status === 402 ||
    parsedCode === "insufficient_quota" ||
    parsedType === "insufficient_quota" ||
    parsedType === "insufficient_balance_error" ||
    lowerMsg.includes("quota") ||
    lowerMsg.includes("credit balance") ||
    lowerMsg.includes("insufficient balance") ||
    lowerMsg.includes("billing");

  if (isQuota) {
    return new AiInfrastructureError(
      "AI_KEYS_EXHAUSTED",
      `Cuota o saldo agotado en ${provUpper}: ${parsedMsg || "Límite de facturación alcanzado"}.`,
      status,
      providerId,
      errBody,
    );
  }

  // 2. Authentication / Invalid Key (401, 403, invalid_api_key)
  if (
    status === 401 ||
    status === 403 ||
    parsedCode === "invalid_api_key" ||
    parsedType === "authentication_error" ||
    lowerMsg.includes("api key") ||
    lowerMsg.includes("unauthorized")
  ) {
    return new AiInfrastructureError(
      "AUTH_DECLINED_KEY",
      `Clave de ${provUpper} no válida o no autorizada (${parsedMsg || `HTTP ${status}`}).`,
      status,
      providerId,
      errBody,
    );
  }

  // 3. Rate Limit (429 TPM/RPM)
  if (
    status === 429 ||
    parsedCode === "rate_limit_exceeded" ||
    lowerMsg.includes("rate limit") ||
    lowerMsg.includes("too many requests")
  ) {
    return new AiInfrastructureError(
      "RATE_LIMIT_COOLDOWN",
      `Límite de peticiones por minuto en ${provUpper}: ${parsedMsg || "Espera unos segundos para reanudar"}.`,
      status,
      providerId,
      errBody,
    );
  }

  // 4. Timeout (504)
  if (status === 504 || lowerMsg.includes("timeout")) {
    return new AiInfrastructureError(
      "GATEWAY_TIMEOUT",
      `Tiempo de espera agotado al conectar con ${provUpper}.`,
      status,
      providerId,
      errBody,
    );
  }

  // 5. Server Outage / 5xx
  return new AiInfrastructureError(
    "CLUSTER_OUTAGE",
    `Error del servidor ${provUpper} (HTTP ${status}): ${parsedMsg || "Fallo transitorio en la red de inferencia"}.`,
    status,
    providerId,
    errBody,
  );
}

export const directClientAiService = {
  /**
   * Execute chat completion directly with the provider
   */
  async chatCompletion(params: {
    systemPrompt: string;
    userPrompt: string;
    providerId?: AiProviderId;
    overrideModel?: string;
    maxTokens?: number;
    _triedModels?: string[];
  }): Promise<string> {
    const activeProvider = params.providerId || (await providerKeyVault.getActiveProviderId()) || "groq";
    const apiKey = await providerKeyVault.getKey(activeProvider);

    if (!apiKey) {
      throw new AiInfrastructureError(
        "AI_KEYS_EXHAUSTED",
        `No se encontró una clave configurada para el proveedor ${activeProvider.toUpperCase()}. Ingresa una clave para continuar.`,
        401,
        activeProvider,
      );
    }

    const config = await providerKeyVault.getConfig(activeProvider);
    let resolvedModel = params.overrideModel || config?.defaultModel || getDefaultModel(activeProvider);
    
    // Proactive migration: Migrate retired/non-English models to openai/gpt-oss-20b.
    const isInvalidGroqModel =
      resolvedModel === "llama-3.1-8b-instant" ||
      resolvedModel === "allam-2-7b" ||
      resolvedModel === "llama-3.3-70b-versatile" ||
      resolvedModel.includes("allam") ||
      resolvedModel.includes("whisper") ||
      resolvedModel.includes("guard");

    if (activeProvider === "groq" && isInvalidGroqModel && !params.overrideModel) {
      resolvedModel = "openai/gpt-oss-20b";
      await providerKeyVault.saveConfig("groq", { ...config, defaultModel: "openai/gpt-oss-20b" }).catch(() => {});
    }

    const model = resolvedModel;
    const endpoint = (config?.endpoint || getDefaultEndpoint(activeProvider)).replace(/\/+$/, "");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
      // 1. Google Gemini format
      if (activeProvider === "gemini") {
        const url = `${endpoint}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: params.systemPrompt }] },
            contents: [{ parts: [{ text: params.userPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: params.maxTokens || 4096,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          logger.warn(`[directClientAiService] Gemini HTTP ${res.status}:`, errBody);
          throw parseProviderError(res.status, errBody, "gemini");
        }

        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new AiInfrastructureError("GATEWAY_TIMEOUT", "Respuesta vacía de Gemini.", 500, "gemini");
        }
        return candidateText;
      }

      // 2. Anthropic Claude format
      if (activeProvider === "anthropic") {
        const url = `${endpoint}/messages`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model,
            max_tokens: params.maxTokens || 4096,
            system: params.systemPrompt,
            messages: [{ role: "user", content: params.userPrompt }],
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          logger.warn(`[directClientAiService] Anthropic HTTP ${res.status}:`, errBody);
          throw parseProviderError(res.status, errBody, "anthropic");
        }

        const data = await res.json();
        const content = data?.content?.[0]?.text;
        if (!content) {
          throw new AiInfrastructureError("GATEWAY_TIMEOUT", "Respuesta vacía de Claude.", 500, "anthropic");
        }
        return content;
      }

      // 3. OpenAI-compatible format (Groq, OpenAI, DeepSeek, Grok xAI)
      const url = `${endpoint}/chat/completions`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: params.systemPrompt },
            { role: "user", content: params.userPrompt },
          ],
          response_format: { type: "json_object" },
          max_tokens: params.maxTokens || 4096,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        logger.warn(`[directClientAiService] ${activeProvider} HTTP ${res.status}:`, errBody);

        // Handle token limit cutoffs gracefully by expanding token budget
        const isTokenLimit =
          errBody.includes("max completion tokens reached") ||
          errBody.includes("finish_reason: length") ||
          errBody.includes("length");

        if (isTokenLimit && (params.maxTokens || 4096) < 8192) {
          logger.warn(`[directClientAiService] Token limit reached. Retrying with 8192 tokens...`);
          return directClientAiService.chatCompletion({
            ...params,
            maxTokens: 8192,
          });
        }

        // When Groq returns json_validate_failed, it includes failed_generation.
        // Attempt to extract the first valid JSON object directly from it.
        if (activeProvider === "groq" && errBody.includes("json_validate_failed")) {
          try {
            const errObj = JSON.parse(errBody);
            const failedGen = errObj?.error?.failed_generation;
            if (typeof failedGen === "string") {
              const salvaged = extractFirstJsonObject(failedGen);
              if (salvaged) {
                logger.info("[directClientAiService] Successfully salvaged valid JSON from failed_generation!");
                return salvaged;
              }
            }
          } catch {
            // ignore JSON parse error of error body
          }
        }

        const isModelIssue =
          res.status === 404 ||
          errBody.includes("model_not_found") ||
          errBody.includes("does not exist or you do not have access to it") ||
          errBody.includes("json_validate_failed") ||
          (res.status === 400 && (errBody.includes("model") || errBody.includes("exist")));

        if (isModelIssue && activeProvider === "groq") {
          const GROQ_CANDIDATE_MODELS = [
            "openai/gpt-oss-20b",
            "openai/gpt-oss-120b",
            "llama-3.3-70b-versatile",
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant",
            "llama3-70b-8192",
            "llama3-8b-8192",
            "deepseek-r1-distill-llama-70b",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
          ];
          const tried = params._triedModels || [model];
          const nextModel = GROQ_CANDIDATE_MODELS.find((m) => !tried.includes(m) && !m.includes("allam"));
          if (nextModel) {
            logger.warn(
              `[directClientAiService] Groq model '${model}' error. Auto-cascading to '${nextModel}'...`,
            );
            await providerKeyVault.saveConfig("groq", { ...config, endpoint, defaultModel: nextModel }).catch(() => {});
            return directClientAiService.chatCompletion({
              ...params,
              overrideModel: nextModel,
              _triedModels: [...tried, nextModel],
            });
          }
        }

        throw parseProviderError(res.status, errBody, activeProvider);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new AiInfrastructureError("GATEWAY_TIMEOUT", "Respuesta vacía del modelo.", 500, activeProvider);
      }
      return content;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof AiInfrastructureError) throw err;
      if ((err as Error)?.name === "AbortError") {
        throw new AiInfrastructureError(
          "GATEWAY_TIMEOUT",
          `La solicitud a ${activeProvider.toUpperCase()} excedió el tiempo límite (25s).`,
          504,
          activeProvider,
        );
      }
      throw new AiInfrastructureError(
        "GATEWAY_TIMEOUT",
        (err as Error)?.message || "Fallo de conexión.",
        500,
        activeProvider,
      );
    }
  },
};

/**
 * Extracts the first balanced JSON object from a string that starts with or contains '{'.
 * Essential for salvaging failed_generation when models output commentary or multiple blocks.
 */
export function extractFirstJsonObject(str: string): string | null {
  const startIdx = str.indexOf("{");
  if (startIdx === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < str.length; i++) {
    const char = str[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{") depth++;
      else if (char === "}") {
        depth--;
        if (depth === 0) {
          const candidate = str.slice(startIdx, i + 1);
          try {
            JSON.parse(candidate);
            return candidate;
          } catch {
            return null;
          }
        }
      }
    }
  }
  return null;
}

function getDefaultModel(provider: AiProviderId): string {
  switch (provider) {
    case "groq":
      return "openai/gpt-oss-20b";
    case "gemini":
      return "gemini-2.5-flash";
    case "openai":
      return "gpt-4o-mini";
    case "deepseek":
      return "deepseek-chat";
    case "anthropic":
      return "claude-3-5-haiku-20241022";
    case "grok":
      return "grok-2-latest";
    default:
      return "openai/gpt-oss-20b";
  }
}

function getDefaultEndpoint(provider: AiProviderId): string {
  switch (provider) {
    case "groq":
      return "https://api.groq.com/openai/v1";
    case "gemini":
      return "https://generativelanguage.googleapis.com/v1beta";
    case "openai":
      return "https://api.openai.com/v1";
    case "deepseek":
      return "https://api.deepseek.com/v1";
    case "anthropic":
      return "https://api.anthropic.com/v1";
    case "grok":
      return "https://api.x.ai/v1";
    default:
      return "https://api.groq.com/openai/v1";
  }
}
