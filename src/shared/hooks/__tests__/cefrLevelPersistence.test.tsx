import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useCurrentUser } from "../useCurrentUser";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";

describe("CEFR Level User-Scoped Persistence & Anti-Reversion Suite", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("Test 1: Recovers user-scoped CEFR level when present in localStorage", () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    const mockUser = {
      id: "usr-alpha-123",
      email: "alpha@celaest.com",
      name: "Alpha User",
      role: "authenticated",
    };
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue(mockUser as any);
    vi.spyOn(authAdapter, "isAuthenticated").mockReturnValue(true);
    vi.spyOn(apiSettingsRepository, "getProfile").mockResolvedValue({
      id: "usr-alpha-123",
      name: "Alpha User",
      email: "alpha@celaest.com",
      cefrLevel: "A1",
      dailyFocus: "Clarity",
      learningGoal: "Daily Conversation",
      preferenceStyle: "Direct",
      streakDays: 3,
    });

    localStorage.setItem("celaest:user:usr-alpha-123:cefrLevel", "A1");

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    expect(result.current.settings.cefrLevel).toBe("A1");
  });

  it("Test 2: Does NOT overwrite user's selected A1 level with backend default B1", async () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    const mockUser = {
      id: "usr-beta-456",
      email: "beta@celaest.com",
      name: "Beta User",
      role: "authenticated",
    };
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue(mockUser as any);
    vi.spyOn(authAdapter, "isAuthenticated").mockReturnValue(true);

    // User locally selected A1
    localStorage.setItem("celaest:user:usr-beta-456:cefrLevel", "A1");
    localStorage.setItem("celaest:cefrLevel", "A1");

    // Backend returns initial DB default "B1 — Intermediate"
    vi.spyOn(apiSettingsRepository, "getProfile").mockResolvedValue({
      id: "usr-beta-456",
      name: "Beta User",
      email: "beta@celaest.com",
      cefrLevel: "B1 — Intermediate",
      dailyFocus: "Clarity",
      learningGoal: "Daily Conversation",
      preferenceStyle: "Direct",
      streakDays: 1,
    });

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      // Must maintain A1 and NOT revert to B1
      expect(result.current.settings.cefrLevel).toBe("A1");
    });

    // LocalStorage must still preserve A1
    expect(localStorage.getItem("celaest:user:usr-beta-456:cefrLevel")).toBe("A1");
  });

  it("Test 3: Multi-User Isolation — User A and User B have separate persistent levels", async () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();

    // User A sets A1
    const userA = { id: "user-A", email: "a@celaest.com", name: "User A", role: "authenticated" };
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue(userA as any);
    localStorage.setItem("celaest:user:user-A:cefrLevel", "A1");

    // User B sets C1
    localStorage.setItem("celaest:user:user-B:cefrLevel", "C1");

    const hookA = renderHook(() => useCurrentUser(), { wrapper });
    expect(hookA.result.current.settings.cefrLevel).toBe("A1");

    // Switch session to User B
    const userB = { id: "user-B", email: "b@celaest.com", name: "User B", role: "authenticated" };
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue(userB as any);

    const hookB = renderHook(() => useCurrentUser(), { wrapper });
    expect(hookB.result.current.settings.cefrLevel).toBe("C1");
  });

  it("Test 4: updateProfileSettings persists level to user-scoped key and dispatches normalized event", async () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    const mockUser = { id: "user-gamma", email: "gamma@celaest.com", name: "Gamma", role: "authenticated" };
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue(mockUser as any);
    vi.spyOn(authAdapter, "isAuthenticated").mockReturnValue(true);

    const updateSpy = vi.spyOn(apiSettingsRepository, "updateSettings").mockResolvedValue({
      id: "user-gamma",
      name: "Gamma",
      email: "gamma@celaest.com",
      cefrLevel: "A1",
      dailyFocus: "",
      learningGoal: "",
      preferenceStyle: "",
      streakDays: 1,
    });

    const eventSpy = vi.fn();
    window.addEventListener("celaest:level-changed", eventSpy);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await act(async () => {
      await result.current.updateProfileSettings({ cefrLevel: "A1 — Beginner" });
    });

    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({ cefrLevel: "A1" }));
    expect(localStorage.getItem("celaest:user:user-gamma:cefrLevel")).toBe("A1");
    expect(localStorage.getItem("celaest:cefrLevel")).toBe("A1");
    expect(eventSpy).toHaveBeenCalled();
    const eventDetail = (eventSpy.mock.calls[0][0] as CustomEvent).detail;
    expect(eventDetail).toBe("A1");

    window.removeEventListener("celaest:level-changed", eventSpy);
  });
});
