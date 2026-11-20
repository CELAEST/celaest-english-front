import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callBackendAiChatGateway } from "../coreAiGatewayClient";
import { providerKeyVault } from "../../../features/settings/services/providerKeyVault";
import {
  AiInfrastructureError,
  directClientAiService,
} from "../../../features/settings/services/directClientAiService";

describe("coreAiGatewayClient — BYOK Direct Isolation & Proxy Fallback", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("executes BYOK directly with user key instead of hitting shared backend pool when Central Core is disabled", async () => {
    await providerKeyVault.setCentralCoreEnabled(false);
    await providerKeyVault.saveKey("groq", "gsk_user_byok_key");
    await providerKeyVault.saveActiveProviderId("groq");

    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const directSpy = vi
      .spyOn(directClientAiService, "chatCompletion")
      .mockResolvedValueOnce("Nuclear Engineer");

    const out = await callBackendAiChatGateway({
      systemPrompt: "Normalize",
      userPrompt: "ingeniero nuclear",
      providerId: "groq",
      maxTokens: 120,
    });

    expect(out).toBe("Nuclear Engineer");
    expect(directSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("falls back to backend BYOK proxy only when direct browser call fails due to CORS/network", async () => {
    await providerKeyVault.setCentralCoreEnabled(false);
    await providerKeyVault.saveKey("openai", "sk-user-openai");
    await providerKeyVault.saveActiveProviderId("openai");

    vi.spyOn(directClientAiService, "chatCompletion").mockRejectedValueOnce(
      new AiInfrastructureError("GATEWAY_TIMEOUT", "Failed to fetch", 500, "openai"),
    );

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true, response: "Cardiologist" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const out = await callBackendAiChatGateway({
      systemPrompt: "Normalize",
      userPrompt: "cardiólogo",
      providerId: "openai",
      maxTokens: 120,
    });

    expect(out).toBe("Cardiologist");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const body = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body || "{}"));
    expect(body.api_key).toBe("sk-user-openai");
  });

  it("does NOT wipe unexpired OTP JWT when gateway returns 401 without JWT_EXPIRED", async () => {
    const h = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const p = btoa(
      JSON.stringify({ sub: "u1", exp: Math.floor(Date.now() / 1000) + 3600 }),
    );
    const activeToken = `${h}.${p}.sig`;
    localStorage.setItem("lingua_access_token", activeToken);
    localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "u1", email: "u1@celaest.com" }));

    await providerKeyVault.setCentralCoreEnabled(true);
    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ success: false, code: "UNAUTHORIZED", error: "Upstream mismatch" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    );

    try {
      await expect(
        callBackendAiChatGateway({ systemPrompt: "sys", userPrompt: "hi" }),
      ).rejects.toThrow();
      expect(localStorage.getItem("lingua_access_token")).toBe(activeToken);
      expect(unauthSpy).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });
});
