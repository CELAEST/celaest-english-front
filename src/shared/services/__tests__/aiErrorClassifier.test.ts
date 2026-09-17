import { describe, it, expect } from "vitest";
import { classifyAiError } from "../aiErrorClassifier";

describe("classifyAiError", () => {
  it("classifies 401 and invalid api key correctly", () => {
    const err = { code: "AUTH_DECLINED_KEY", message: "API key invalid" };
    const result = classifyAiError(err);
    expect(result.errorType).toBe("invalid-key-401");
    expect(result.scenario.id).toBe("invalid-key-401");
  });

  it("classifies 429 rate limit correctly and preserves custom cooldown", () => {
    const err = { message: "Rate limit reached 429", cooldownSeconds: 30 };
    const result = classifyAiError(err);
    expect(result.errorType).toBe("rate-limit-429");
    expect(result.cooldownSeconds).toBe(30);
  });

  it("classifies quota exhausted correctly", () => {
    const err = { message: "All keys exhausted insufficient_quota" };
    const result = classifyAiError(err);
    expect(result.errorType).toBe("keys-exhausted-pool");
    expect(result.scenario.humanSubtext).toContain("Todas las claves");
  });

  it("classifies 504 gateway timeout correctly", () => {
    const err = { message: "Gateway timeout 504" };
    const result = classifyAiError(err);
    expect(result.errorType).toBe("gateway-timeout-504");
  });

  it("falls back to server-outage-503 for unknown errors", () => {
    const err = { message: "Internal server error" };
    const result = classifyAiError(err);
    expect(result.errorType).toBe("server-outage-503");
  });
});
