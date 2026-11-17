import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SupabaseAuthAdapter } from "../SupabaseAuthAdapter";
import { HttpClient } from "../../../http/HttpClient";
import { callBackendAiChatGateway } from "../../../http/coreAiGatewayClient";
import { providerKeyVault } from "../../../../features/settings/services/providerKeyVault";

function createTestJwt(expSecondsFromNow: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: "user-123",
      email: "learner@celaest.com",
      exp: Math.floor(Date.now() / 1000) + expSecondsFromNow,
    }),
  );
  return `${header}.${payload}.sig`;
}

describe("Lingua Session Persistence & 401 Single-Flight Refresh", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    HttpClient.setAuthToken("");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    SupabaseAuthAdapter.getInstance().clearDeadToken();
  });

  it("preserves lingua_refresh_token and lingua_auth_user when stored access_token has expired", () => {
    const expiredJwt = createTestJwt(-120);
    const user = { id: "user-123", email: "learner@celaest.com", name: "Learner" };
    localStorage.setItem("lingua_access_token", expiredJwt);
    localStorage.setItem("lingua_refresh_token", "valid-refresh-abc");
    localStorage.setItem("lingua_auth_user", JSON.stringify(user));

    const adapter = SupabaseAuthAdapter.getInstance();
    const token = adapter.getStoredToken();

    expect(token).toBeNull();
    expect(localStorage.getItem("lingua_access_token")).toBeNull();
    expect(localStorage.getItem("lingua_refresh_token")).toBe("valid-refresh-abc");
    expect(localStorage.getItem("lingua_auth_user")).not.toBeNull();
  });

  it("coalesces concurrent refresh() calls into a single /auth/refresh request", async () => {
    const staleJwt = createTestJwt(-10);
    const freshJwt = createTestJwt(3600);
    localStorage.setItem("lingua_access_token", staleJwt);
    localStorage.setItem("lingua_refresh_token", "rt-old");
    localStorage.setItem(
      "lingua_auth_user",
      JSON.stringify({ id: "user-123", email: "learner@celaest.com" }),
    );

    let refreshFetchCalls = 0;
    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/auth/refresh")) {
        refreshFetchCalls++;
        await new Promise((r) => setTimeout(r, 20));
        return new Response(
          JSON.stringify({
            success: true,
            data: { access_token: freshJwt, refresh_token: "rt-new" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      return new Response("{}", { status: 404 });
    });

    const adapter = SupabaseAuthAdapter.getInstance();
    const [r1, r2, r3] = await Promise.all([
      adapter.refresh(staleJwt),
      adapter.refresh(staleJwt),
      adapter.refresh(staleJwt),
    ]);

    expect(refreshFetchCalls).toBe(1);
    expect(r1.success).toBe(true);
    expect(r2.accessToken).toBe(freshJwt);
    expect(r3.accessToken).toBe(freshJwt);
    expect(localStorage.getItem("lingua_access_token")).toBe(freshJwt);
    expect(localStorage.getItem("lingua_refresh_token")).toBe("rt-new");
  });

  it("HttpClient refreshes expired token cleanly and retries instead of logging out", async () => {
    const staleJwt = createTestJwt(60); // not yet expired on client clock, backend returns 401 JWT_EXPIRED
    const freshJwt = createTestJwt(3600);
    localStorage.setItem("lingua_access_token", staleJwt);
    localStorage.setItem("lingua_refresh_token", "rt-valid");
    localStorage.setItem(
      "lingua_auth_user",
      JSON.stringify({ id: "user-123", email: "learner@celaest.com" }),
    );
    HttpClient.setAuthToken(staleJwt);

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      if (String(url).includes("/auth/refresh")) {
        return new Response(
          JSON.stringify({
            success: true,
            data: { access_token: freshJwt, refresh_token: "rt-next" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      const auth = (init?.headers as Record<string, string>)?.Authorization;
      if (auth === `Bearer ${freshJwt}`) {
        return new Response(JSON.stringify({ success: true, data: { name: "Learner" } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ error: { message: "Token expired", code: "JWT_EXPIRED" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    });

    try {
      const profile = await HttpClient.get<{ name: string }>("/user/profile");
      expect(profile).toEqual({ name: "Learner" });
      expect(unauthSpy).not.toHaveBeenCalled();
      expect(fetchSpy).toHaveBeenCalledTimes(3); // 1st 401 + refresh + retried 200
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });

  it("HttpClient preserves session when /auth/refresh fails with transient network error", async () => {
    const staleJwt = createTestJwt(60);
    localStorage.setItem("lingua_access_token", staleJwt);
    localStorage.setItem("lingua_refresh_token", "rt-valid");
    HttpClient.setAuthToken(staleJwt);

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    vi.spyOn(globalThis, "fetch").mockImplementation(async (url) => {
      if (String(url).includes("/auth/refresh")) {
        throw new TypeError("Failed to fetch");
      }
      return new Response(
        JSON.stringify({ error: { message: "Token expired", code: "JWT_EXPIRED" } }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    });

    try {
      await expect(HttpClient.get("/user/profile")).rejects.toThrow();
      expect(unauthSpy).not.toHaveBeenCalled();
      expect(localStorage.getItem("lingua_refresh_token")).toBe("rt-valid");
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });

  it("callBackendAiChatGateway refreshes expired JWT and retries chat once on 401 JWT_EXPIRED", async () => {
    const staleJwt = createTestJwt(60);
    const freshJwt = createTestJwt(3600);
    localStorage.setItem("lingua_access_token", staleJwt);
    localStorage.setItem("lingua_refresh_token", "rt-ai");
    localStorage.setItem(
      "lingua_auth_user",
      JSON.stringify({ id: "user-123", email: "learner@celaest.com" }),
    );
    HttpClient.setAuthToken(staleJwt);
    await providerKeyVault.setCentralCoreEnabled(true);

    const unauthSpy = vi.fn();
    window.addEventListener("celaest:unauthorized", unauthSpy);

    vi.spyOn(globalThis, "fetch").mockImplementation(async (url, init) => {
      if (String(url).includes("/auth/refresh")) {
        return new Response(
          JSON.stringify({
            success: true,
            data: { access_token: freshJwt, refresh_token: "rt-ai-2" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
      const auth = (init?.headers as Record<string, string>)?.Authorization;
      if (auth === `Bearer ${freshJwt}`) {
        return new Response(JSON.stringify({ success: true, response: "Hello there!" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({ success: false, code: "JWT_EXPIRED", error: "JWT expired" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    });

    try {
      const reply = await callBackendAiChatGateway({
        systemPrompt: "Tutor",
        userPrompt: "Hi",
      });
      expect(reply).toBe("Hello there!");
      expect(unauthSpy).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("celaest:unauthorized", unauthSpy);
    }
  });
});
