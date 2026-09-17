import { describe, it, expect, beforeEach, vi } from "vitest";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { probeProviderConnection } from "../../settings/services/providerConnectivity";
import { useOnboardingFlow } from "../hooks/useOnboardingFlow";
import { renderHook, act } from "@testing-library/react";

describe("E2E User Journeys & End-to-End System Integration Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("Journey 1: Session-to-User Vault Continuity & Migration", () => {
    it("migrates guest-entered Groq API keys, config and active provider to new user on registration", async () => {
      // 1. Guest user enters API key before registering (unauthenticated session)
      expect(localStorage.getItem("lingua_auth_user")).toBeNull();
      await providerKeyVault.saveKey("groq", "gsk_guest_initial_key");
      await providerKeyVault.saveActiveProviderId("groq");
      await providerKeyVault.saveConfig("groq", {
        endpoint: "https://api.groq.com/openai/v1",
        defaultModel: "llama-3.3-70b-versatile",
      });

      // Verify guest session has key
      expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_guest_initial_key"]);
      expect(await providerKeyVault.getActiveProviderId()).toBe("groq");

      // 2. User registers or signs in
      const newUserId = "user-uuid-999";
      localStorage.setItem(
        "lingua_auth_user",
        JSON.stringify({ id: newUserId, email: "newuser@celaest.com", name: "Elena" }),
      );

      // 3. Vault migration executes
      await providerKeyVault.migrateSessionToUser(newUserId);

      // 4. Authenticated user now has the key in their user-scoped vault
      const userKeys = await providerKeyVault.getKeys("groq");
      expect(userKeys).toEqual(["gsk_guest_initial_key"]);

      const activeProvider = await providerKeyVault.getActiveProviderId();
      expect(activeProvider).toBe("groq");

      const userConfig = await providerKeyVault.getConfig("groq");
      expect(userConfig?.defaultModel).toBe("llama-3.3-70b-versatile");
    });

    it("auto-migrates from session when getKeys is called by an authenticated user if not yet migrated", async () => {
      // Key entered as guest
      await providerKeyVault.saveKey("groq", "gsk_auto_migrated_key");

      // User logs in
      localStorage.setItem(
        "lingua_auth_user",
        JSON.stringify({ id: "user-auto-1", email: "auto@celaest.com" }),
      );

      // getKeys automatically finds session key and migrates it
      const keys = await providerKeyVault.getKeys("groq");
      expect(keys).toEqual(["gsk_auto_migrated_key"]);
    });
  });

  describe("Journey 2: Anti-Bucle 'Begin' & Seamless Transition on Registration", () => {
    it("advances from auth directly to api-key without bouncing back to welcome (Begin)", () => {
      const { result } = renderHook(() => useOnboardingFlow());

      // Initial state is auth (if unauthenticated)
      expect(result.current.step).toBe("auth");

      // When advancing from auth after registration/login, goes directly to api-key (never welcome)
      act(() => {
        result.current.nextStep();
      });

      expect(result.current.step).toBe("api-key");
      expect(result.current.step).not.toBe("welcome");
    });

    it("allows goToStep to jump cleanly to beginner-check if API key already configured", () => {
      const { result } = renderHook(() => useOnboardingFlow());

      act(() => {
        result.current.goToStep("beginner-check");
      });

      expect(result.current.step).toBe("beginner-check");
    });
  });

  describe("Journey 3: Multi-Account Isolation", () => {
    it("strictly isolates keys between User A and User B", async () => {
      // User A
      localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-a", email: "a@celaest.com" }));
      await providerKeyVault.saveKey("groq", "gsk_user_a_key");
      expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_user_a_key"]);

      // User B logs in
      localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-b", email: "b@celaest.com" }));
      expect(await providerKeyVault.getKeys("groq")).toEqual([]);

      // User B adds their key
      await providerKeyVault.saveKey("groq", "gsk_user_b_key");
      expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_user_b_key"]);

      // Switch back to User A
      localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-a", email: "a@celaest.com" }));
      expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_user_a_key"]);
    });
  });

  describe("Journey 4: Resilient Provider Connectivity & Model Discovery", () => {
    it("falls back to GET /models when chat/completions returns 400 model_not_found", async () => {
      // Mock fetch: first call (chat/completions with obsolete model) fails with 400
      // Second call (GET /models) succeeds with live model list
      const fetchMock = vi.fn().mockImplementation((url: string) => {
        if (url.includes("/chat/completions")) {
          return Promise.resolve({
            ok: false,
            status: 400,
            text: () => Promise.resolve(JSON.stringify({ error: { message: "The model 'nonexistent-model' does not exist" } })),
          });
        }
        if (url.includes("/models")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                data: [
                  { id: "llama-3.1-8b-instant" },
                  { id: "llama-3.3-70b-versatile" },
                  { id: "mixtral-8x7b-32768" },
                ],
              }),
          });
        }
        return Promise.reject(new Error("Unknown url"));
      });

      vi.stubGlobal("fetch", fetchMock);

      const probe = await probeProviderConnection(
        "groq",
        "gsk_valid_live_key",
        "https://api.groq.com/openai/v1",
        "nonexistent-model",
      );

      expect(probe.ok).toBe(true);
      expect(probe.discoveredModel).toBe("llama-3.3-70b-versatile");
      expect(probe.availableModels).toContain("llama-3.3-70b-versatile");
    });

    it("correctly identifies invalid API keys without false negatives", async () => {
      const fetchMock = vi.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 401,
          text: () => Promise.resolve(JSON.stringify({ error: { message: "Invalid API Key" } })),
        });
      });

      vi.stubGlobal("fetch", fetchMock);

      const probe = await probeProviderConnection(
        "groq",
        "gsk_invalid_test_key",
        "https://api.groq.com/openai/v1",
        "llama-3.3-70b-versatile",
      );

      expect(probe.ok).toBe(false);
      expect(probe.message.toLowerCase()).toContain("válida");
    });
  });
});
