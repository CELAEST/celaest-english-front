import { describe, it, expect, vi, beforeEach } from "vitest";
import { probeProviderConnection } from "../providerConnectivity";

describe("providerConnectivity — Real-World Multi-Provider Error Handling (Antibobos)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles Gemini HTTP 400 API_KEY_INVALID with friendly plain Spanish", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          error: {
            code: 400,
            message: "API key not valid. Please pass a valid API key.",
            status: "INVALID_ARGUMENT",
            details: [
              {
                "@type": "type.googleapis.com/google.rpc.ErrorInfo",
                reason: "API_KEY_INVALID",
              },
            ],
          },
        }),
    } as any));

    const result = await probeProviderConnection(
      "gemini",
      "bad-key",
      "https://generativelanguage.googleapis.com/v1beta",
      "gemini-3.6-flash",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("La clave de Gemini no es válida o quedó copiada incompleta");
    expect(result.message).not.toContain("INVALID_ARGUMENT");
    expect(result.message).not.toContain("{");
  });

  it("handles xAI Grok HTTP 400 Model not found with clear advice", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          code: "invalid-argument",
          error: "Model not found: grok-2",
        }),
    } as any));

    const result = await probeProviderConnection(
      "grok",
      "xai-key",
      "https://api.x.ai/v1",
      "grok-2",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("El modelo de xAI Grok no está disponible para tu cuenta");
    expect(result.message).toContain("Groq");
    expect(result.message).not.toContain("invalid-argument");
  });

  it("handles OpenAI HTTP 429 credit_balance_exhausted ($0 balance)", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 429,
      text: async () =>
        JSON.stringify({
          error: {
            message:
              "You have no credits remaining. Add credits to continue using the API at https://platform.openai.com/settings/organization/billing/.",
            type: "insufficient_quota",
            code: "credit_balance_exhausted",
          },
        }),
    } as any));

    const result = await probeProviderConnection(
      "openai",
      "sk-proj-test",
      "https://api.openai.com/v1",
      "gpt-4o-mini",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Tu cuenta de OpenAI no tiene saldo disponible ($0.00)");
    expect(result.message).toContain("Groq (100% gratis)");
    expect(result.message).not.toContain("credit_balance_exhausted");
  });

  it("handles DeepSeek HTTP 402 Insufficient Balance", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 402,
      text: async () =>
        JSON.stringify({
          error: {
            message: "Insufficient Balance",
            type: "unknown_error",
            code: "invalid_request_error",
          },
        }),
    } as any));

    const result = await probeProviderConnection(
      "deepseek",
      "sk-deepseek-test",
      "https://api.deepseek.com/v1",
      "deepseek-chat",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Tu cuenta de DeepSeek no tiene saldo disponible ($0.00)");
    expect(result.message).toContain("Groq (100% gratis)");
  });

  it("handles Gemini HTTP 503 UNAVAILABLE (Global Demand Spike)", async () => {
    global.fetch = vi.fn(async () => ({
      ok: false,
      status: 503,
      text: async () =>
        JSON.stringify({
          error: {
            code: 503,
            message:
              "This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.",
            status: "UNAVAILABLE",
          },
        }),
    } as any));

    const result = await probeProviderConnection(
      "gemini",
      "AIzaSy-test",
      "https://generativelanguage.googleapis.com/v1beta",
      "gemini-flash-latest",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Los servidores de Gemini están temporalmente saturados por alta demanda mundial");
    expect(result.message).toContain("Groq (100% gratis)");
  });

  it("handles network/CORS error gracefully without technical jargon", async () => {
    global.fetch = vi.fn(async () => {
      throw new Error("Failed to fetch");
    });

    const result = await probeProviderConnection(
      "groq",
      "gsk-test",
      "https://api.groq.com/openai/v1",
      "qwen/qwen3.8-27b",
    );

    expect(result.ok).toBe(false);
    expect(result.message).toContain("No se pudo conectar con el servidor. Revisa tu conexión a internet");
    expect(result.message).not.toContain("CORS");
  });
});
