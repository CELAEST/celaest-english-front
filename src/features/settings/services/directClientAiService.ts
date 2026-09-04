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
    public readonly code: "RATE_LIMIT_COOLDOWN" | "AI_KEYS_EXHAUSTED" | "AUTH_DECLINED_KEY" | "GATEWAY_TIMEOUT" | "CLUSTER_OUTAGE",
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AiInfrastructureError";
  }
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
  }): Promise<string> {
    const activeProvider = params.providerId || (await providerKeyVault.getActiveProviderId()) || "groq";
    const apiKey = await providerKeyVault.getKey(activeProvider);

    if (!apiKey) {
      throw new AiInfrastructureError(
        "AI_KEYS_EXHAUSTED",
        `No se encontró una clave configurada para el proveedor ${activeProvider}. Ingresa una clave para continuar.`,
        401,
      );
    }

    const config = await providerKeyVault.getConfig(activeProvider);
    const model = params.overrideModel || config?.defaultModel || getDefaultModel(activeProvider);
    const endpoint = (config?.endpoint || getDefaultEndpoint(activeProvider)).replace(/\/+$/, "");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    try {
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
              maxOutputTokens: params.maxTokens || 2048,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new AiInfrastructureError("AUTH_DECLINED_KEY", "Tu clave de Gemini es inválida o no tiene permisos.", 401);
          }
          if (res.status === 429) {
            throw new AiInfrastructureError("RATE_LIMIT_COOLDOWN", "Límite de tasa excedido en Gemini.", 429);
          }
          throw new AiInfrastructureError("CLUSTER_OUTAGE", `Error del proveedor Gemini: HTTP ${res.status}`, res.status);
        }

        const data = await res.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new AiInfrastructureError("GATEWAY_TIMEOUT", "Respuesta vacía de Gemini.", 500);
        }
        return candidateText;
      }

      // OpenAI-compatible format (Groq, OpenAI, DeepSeek, Grok)
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
          max_tokens: params.maxTokens || 2048,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        logger.warn(`[directClientAiService] HTTP ${res.status}:`, errBody);

        if (res.status === 404 && activeProvider === "groq" && model !== "llama-3.1-8b-instant") {
          logger.info("[directClientAiService] Groq model not found, falling back to llama-3.1-8b-instant...");
          return directClientAiService.chatCompletion({
            ...params,
            overrideModel: "llama-3.1-8b-instant",
          });
        }

        if (res.status === 401 || res.status === 403) {
          throw new AiInfrastructureError(
            "AUTH_DECLINED_KEY",
            `Tu clave privada de ${activeProvider.toUpperCase()} no pudo ser verificada (HTTP ${res.status}).`,
            401,
          );
        }
        if (res.status === 429) {
          throw new AiInfrastructureError(
            "RATE_LIMIT_COOLDOWN",
            `El proveedor ${activeProvider.toUpperCase()} alcanzó su límite de tasa (HTTP 429).`,
            429,
          );
        }
        throw new AiInfrastructureError(
          "CLUSTER_OUTAGE",
          `El proveedor ${activeProvider.toUpperCase()} reportó un error HTTP ${res.status}.`,
          res.status,
        );
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) {
        throw new AiInfrastructureError("GATEWAY_TIMEOUT", "Respuesta vacía del modelo.", 500);
      }
      return content;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof AiInfrastructureError) throw err;
      if ((err as Error)?.name === "AbortError") {
        throw new AiInfrastructureError("GATEWAY_TIMEOUT", "La solicitud excedió el tiempo límite (25s).", 504);
      }
      throw new AiInfrastructureError("GATEWAY_TIMEOUT", (err as Error)?.message || "Fallo de conexión.", 500);
    }
  },
};

function getDefaultModel(provider: AiProviderId): string {
  switch (provider) {
    case "groq":
      return "llama-3.1-8b-instant";
    case "gemini":
      return "gemini-2.5-flash";
    case "openai":
      return "gpt-4o-mini";
    case "deepseek":
      return "deepseek-chat";
    case "anthropic":
      return "claude-3-5-haiku";
    default:
      return "llama-3.1-8b-instant";
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
    default:
      return "https://api.groq.com/openai/v1";
  }
}
