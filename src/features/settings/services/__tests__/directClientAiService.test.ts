import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  directClientAiService,
  parseProviderError,
  AiInfrastructureError,
} from "../directClientAiService";
import { providerKeyVault } from "../providerKeyVault";

describe("directClientAiService - Multi-Provider Diagnostic & Resilience", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("parseProviderError - Diagnostic & Root Cause Detection", () => {
    it("classifies OpenAI 429 insufficient_quota as AI_KEYS_EXHAUSTED", () => {
      const openAiQuotaError = JSON.stringify({
        error: {
          message: "You exceeded your current quota, please check your plan and billing details.",
          type: "insufficient_quota",
          code: "insufficient_quota",
        },
      });

      const err = parseProviderError(429, openAiQuotaError, "openai");
      expect(err.code).toBe("AI_KEYS_EXHAUSTED");
      expect(err.message).toContain("Cuota o saldo agotado en OPENAI");
      expect(err.status).toBe(429);
      expect(err.providerId).toBe("openai");
    });

    it("classifies OpenAI 401 invalid_api_key as AUTH_DECLINED_KEY", () => {
      const openAiAuthError = JSON.stringify({
        error: {
          message: "Incorrect API key provided: sk-proj-***.",
          type: "invalid_request_error",
          code: "invalid_api_key",
        },
      });

      const err = parseProviderError(401, openAiAuthError, "openai");
      expect(err.code).toBe("AUTH_DECLINED_KEY");
      expect(err.message).toContain("Clave de OPENAI no válida");
      expect(err.status).toBe(401);
    });

    it("classifies Anthropic credit balance too low as AI_KEYS_EXHAUSTED", () => {
      const anthropicBillingError = JSON.stringify({
        type: "error",
        error: {
          type: "invalid_request_error",
          message: "Your credit balance is too low to access the Claude API. Please go to Plans & Billing to upgrade or purchase credits.",
        },
      });

      const err = parseProviderError(400, anthropicBillingError, "anthropic");
      expect(err.code).toBe("AI_KEYS_EXHAUSTED");
      expect(err.message).toContain("Cuota o saldo agotado en ANTHROPIC");
    });

    it("classifies Anthropic 401 invalid x-api-key as AUTH_DECLINED_KEY", () => {
      const anthropicAuthError = JSON.stringify({
        type: "error",
        error: {
          type: "authentication_error",
          message: "invalid x-api-key",
        },
      });

      const err = parseProviderError(401, anthropicAuthError, "anthropic");
      expect(err.code).toBe("AUTH_DECLINED_KEY");
      expect(err.message).toContain("Clave de ANTHROPIC no válida");
    });

    it("classifies Groq 429 TPM limit as RATE_LIMIT_COOLDOWN", () => {
      const groqRateLimit = JSON.stringify({
        error: {
          message: "Rate limit reached for model llama-3.1-8b-instant on tokens per minute (TPM). Limit 6000, Used 5800. Please try again in 4s.",
          type: "tokens",
          code: "rate_limit_exceeded",
        },
      });

      const err = parseProviderError(429, groqRateLimit, "groq");
      expect(err.code).toBe("RATE_LIMIT_COOLDOWN");
      expect(err.message).toContain("Límite de peticiones por minuto en GROQ");
    });

    it("classifies DeepSeek 402 Insufficient Balance as AI_KEYS_EXHAUSTED", () => {
      const deepSeekError = JSON.stringify({
        error: {
          message: "Insufficient Balance",
          type: "insufficient_balance_error",
          code: "invalid_request_error",
        },
      });

      const err = parseProviderError(402, deepSeekError, "deepseek");
      expect(err.code).toBe("AI_KEYS_EXHAUSTED");
      expect(err.message).toContain("Cuota o saldo agotado en DEEPSEEK");
    });

    it("classifies 504 status as GATEWAY_TIMEOUT", () => {
      const err = parseProviderError(504, "Gateway Timeout", "groq");
      expect(err.code).toBe("GATEWAY_TIMEOUT");
    });

    it("classifies 503 status as CLUSTER_OUTAGE", () => {
      const err = parseProviderError(503, "Service Unavailable", "groq");
      expect(err.code).toBe("CLUSTER_OUTAGE");
    });
  });

  describe("chatCompletion - Multi-Provider Dispatch", () => {
    const originalFetch = global.fetch;

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it("throws AI_KEYS_EXHAUSTED if no key is configured", async () => {
      await expect(
        directClientAiService.chatCompletion({
          systemPrompt: "system",
          userPrompt: "hello",
          providerId: "groq",
        }),
      ).rejects.toThrow(AiInfrastructureError);
    });

    it("formats Anthropic requests correctly with browser access header and parses response", async () => {
      await providerKeyVault.saveKey("anthropic", "sk-ant-test-key-12345");

      let capturedUrl = "";
      let capturedHeaders: any = {};
      let capturedBody: any = {};

      global.fetch = vi.fn(async (url: any, init: any) => {
        capturedUrl = String(url);
        capturedHeaders = init?.headers || {};
        capturedBody = JSON.parse(init?.body || "{}");

        return {
          ok: true,
          status: 200,
          json: async () => ({
            content: [{ text: '{"scoreClarity": 95, "summary": "Excelente"}' }],
          }),
        } as any;
      });

      const result = await directClientAiService.chatCompletion({
        systemPrompt: "You are a mentor",
        userPrompt: "Evaluate my answer",
        providerId: "anthropic",
      });

      expect(capturedUrl).toBe("https://api.anthropic.com/v1/messages");
      expect(capturedHeaders["x-api-key"]).toBe("sk-ant-test-key-12345");
      expect(capturedHeaders["anthropic-version"]).toBe("2023-06-01");
      expect(capturedHeaders["anthropic-dangerous-direct-browser-access"]).toBe("true");
      expect(capturedBody.messages[0].content).toBe("Evaluate my answer");
      expect(result).toBe('{"scoreClarity": 95, "summary": "Excelente"}');
    });

    it("formats OpenAI-compatible requests correctly and parses content", async () => {
      await providerKeyVault.saveKey("groq", "gsk_test_groq_key");

      let capturedUrl = "";
      let capturedHeaders: any = {};

      global.fetch = vi.fn(async (url: any, init: any) => {
        capturedUrl = String(url);
        capturedHeaders = init?.headers || {};

        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: '{"scoreClarity": 88}' } }],
          }),
        } as any;
      });

      const result = await directClientAiService.chatCompletion({
        systemPrompt: "System test",
        userPrompt: "User test",
        providerId: "groq",
      });

      expect(capturedUrl).toBe("https://api.groq.com/openai/v1/chat/completions");
      expect(capturedHeaders["Authorization"]).toBe("Bearer gsk_test_groq_key");
      expect(result).toBe('{"scoreClarity": 88}');
    });

    it("proactively migrates deprecated models (allam-2-7b, llama-3.1) to openai/gpt-oss-20b", async () => {
      await providerKeyVault.saveKey("groq", "gsk_test_groq_key");
      await providerKeyVault.saveConfig("groq", {
        endpoint: "https://api.groq.com/openai/v1",
        defaultModel: "allam-2-7b",
      });

      let sentModel = "";
      global.fetch = vi.fn(async (_url: any, init: any) => {
        const body = JSON.parse(init?.body || "{}");
        sentModel = body.model;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: '{"status": "ok"}' } }],
          }),
        } as any;
      });

      const result = await directClientAiService.chatCompletion({
        systemPrompt: "System",
        userPrompt: "User",
        providerId: "groq",
      });

      expect(result).toBe('{"status": "ok"}');
      expect(sentModel).toBe("openai/gpt-oss-20b");

      // Verify that the vault was updated with the migrated model
      const updatedConfig = await providerKeyVault.getConfig("groq");
      expect(updatedConfig?.defaultModel).toBe("openai/gpt-oss-20b");
    });

    it("salvages valid JSON from json_validate_failed failed_generation payload", async () => {
      await providerKeyVault.saveKey("groq", "gsk_test_groq_key");

      global.fetch = vi.fn(async (_url: any, _init: any) => {
        return {
          ok: false,
          status: 400,
          text: async () =>
            JSON.stringify({
              error: {
                message: "Failed to generate JSON. Please adjust your prompt.",
                type: "invalid_request_error",
                code: "json_validate_failed",
                failed_generation:
                  '{\n  "overallScore": 95,\n  "summary": "Excelente"\n}\n\nExtra trailing garbage',
              },
            }),
        } as any;
      });

      const result = await directClientAiService.chatCompletion({
        systemPrompt: "System",
        userPrompt: "User",
        providerId: "groq",
      });

      expect(result).toBe('{\n  "overallScore": 95,\n  "summary": "Excelente"\n}');
    });

    it("auto-cascades to next Groq candidate model when receiving model_not_found error", async () => {
      await providerKeyVault.saveKey("groq", "gsk_test_groq_key");

      const modelsRequested: string[] = [];
      global.fetch = vi.fn(async (_url: any, init: any) => {
        const body = JSON.parse(init?.body || "{}");
        modelsRequested.push(body.model);

        if (body.model === "custom-deprecated-model") {
          return {
            ok: false,
            status: 404,
            text: async () =>
              JSON.stringify({
                error: {
                  message: "The model `custom-deprecated-model` does not exist or you do not have access to it.",
                  type: "invalid_request_error",
                  code: "model_not_found",
                },
              }),
          } as any;
        }

        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [{ message: { content: '{"recovered": true}' } }],
          }),
        } as any;
      });

      const result = await directClientAiService.chatCompletion({
        systemPrompt: "System",
        userPrompt: "User",
        providerId: "groq",
        overrideModel: "custom-deprecated-model",
      });

      expect(result).toBe('{"recovered": true}');
      expect(modelsRequested).toContain("custom-deprecated-model");
      expect(modelsRequested).toContain("openai/gpt-oss-20b");
    });
  });
});
