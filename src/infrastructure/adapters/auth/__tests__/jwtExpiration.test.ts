import { describe, it, expect, beforeEach, vi } from "vitest";
import { isJwtExpired, SupabaseAuthAdapter } from "../SupabaseAuthAdapter";
import { renderHook, act } from "@testing-library/react";
import { useOnboardingFlow } from "../../../../features/onboarding/hooks/useOnboardingFlow";

// Helper to create valid JWT strings with customizable payload
function createTestJwt(expSecondsFromNow: number): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + expSecondsFromNow;
  const payload = btoa(JSON.stringify({ sub: "user-123", email: "learner@celaest.com", exp }));
  const signature = "fake_signature_for_test";
  return `${header}.${payload}.${signature}`;
}

describe("JWT Expiration & Auto-Redirect to Login Guard", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("isJwtExpired", () => {
    it("identifies null or empty strings as expired", () => {
      expect(isJwtExpired(null)).toBe(true);
      expect(isJwtExpired("")).toBe(true);
    });

    it("does not crash or flag non-JWT mock strings without dots", () => {
      // For compatibility with mock tests that use dummy token strings
      expect(isJwtExpired("dummy-token")).toBe(false);
    });

    it("correctly identifies expired JWT tokens (past timestamp)", () => {
      const expiredToken = createTestJwt(-3600); // 1 hour ago
      expect(isJwtExpired(expiredToken)).toBe(true);
    });

    it("correctly identifies valid, active JWT tokens (future timestamp)", () => {
      const activeToken = createTestJwt(3600); // 1 hour in future
      expect(isJwtExpired(activeToken)).toBe(false);
    });
  });

  describe("SupabaseAuthAdapter with Expired Token", () => {
    it("clears dead token from localStorage and returns null when expired", () => {
      const expiredToken = createTestJwt(-60);
      localStorage.setItem("lingua_access_token", expiredToken);
      localStorage.setItem("lingua_auth_user", JSON.stringify({ email: "learner@celaest.com" }));

      const adapter = SupabaseAuthAdapter.getInstance();
      const token = adapter.getStoredToken();

      expect(token).toBeNull();
      expect(localStorage.getItem("lingua_access_token")).toBeNull();
      expect(adapter.isAuthenticated()).toBe(false);
    });

    it("preserves active token when not expired", () => {
      const activeToken = createTestJwt(3600);
      localStorage.setItem("lingua_access_token", activeToken);

      const adapter = SupabaseAuthAdapter.getInstance();
      const token = adapter.getStoredToken();

      expect(token).toBe(activeToken);
      expect(adapter.isAuthenticated()).toBe(true);
    });
  });

  describe("useOnboardingFlow - Guard Against Stuck in 'Begin'", () => {
    it("initializes directly on 'auth' (login) when token is expired", () => {
      const expiredToken = createTestJwt(-100);
      localStorage.setItem("lingua_access_token", expiredToken);

      const { result } = renderHook(() => useOnboardingFlow());
      expect(result.current.step).toBe("auth");
    });

    it("transitions immediately to 'auth' when celaest:unauthorized event is fired", () => {
      const activeToken = createTestJwt(3600);
      localStorage.setItem("lingua_access_token", activeToken);

      const { result } = renderHook(() => useOnboardingFlow());
      act(() => {
        result.current.openWelcome();
      });
      expect(result.current.step).toBe("welcome");

      // Simulate 401 unauthorized / expired JWT event from HttpClient
      act(() => {
        window.dispatchEvent(new CustomEvent("celaest:unauthorized"));
      });

      // Must immediately transition to auth/login, never stay on begin!
      expect(result.current.step).toBe("auth");
    });

    it("transitions to 'auth' when session is cleared and celaest:auth-changed is dispatched", () => {
      const activeToken = createTestJwt(3600);
      localStorage.setItem("lingua_access_token", activeToken);

      const { result } = renderHook(() => useOnboardingFlow());
      act(() => {
        result.current.openWelcome();
      });
      expect(result.current.step).toBe("welcome");

      // Session is cleared
      localStorage.clear();
      act(() => {
        window.dispatchEvent(new CustomEvent("celaest:auth-changed"));
      });

      // Must immediately transition to auth/login
      expect(result.current.step).toBe("auth");
    });
  });
});
