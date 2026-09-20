import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "../useCurrentUser";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import * as settingsProfileHook from "../../../features/settings/hooks/useSettingsProfile";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCurrentUser - Independent User Persistence", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("preserves onboardingCompleted: true when user-scoped completion flag exists, even if profile is loading/null", () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue({
      id: "user-alpha-123",
      email: "alpha@example.com",
      name: "Alpha User",
      role: "member",
    });

    // Mark completion for this specific user
    localStorage.setItem("lingua_onboarding_completed_user-alpha-123", "true");

    // Profile is null (e.g. backend cold start or offline)
    vi.spyOn(settingsProfileHook, "useSettingsProfile").mockReturnValue({
      displayName: "Alpha User",
      streakDays: 0,
      currentFocus: "",
      currentLevel: "",
      profession: "",
      profile: null,
      isLoading: true,
      error: null,
      updateSettings: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.settings.onboardingCompleted).toBe(true);
  });

  it("does not falsely mark a new independent user as completed if they have not completed it", () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue({
      id: "user-beta-456",
      email: "beta@example.com",
      name: "Beta User",
      role: "member",
    });

    // Another user's flag exists, but NOT user-beta-456
    localStorage.setItem("lingua_onboarding_completed_user-alpha-123", "true");

    vi.spyOn(settingsProfileHook, "useSettingsProfile").mockReturnValue({
      displayName: "Beta User",
      streakDays: 0,
      currentFocus: "",
      currentLevel: "",
      profession: "",
      profile: null,
      isLoading: false,
      error: null,
      updateSettings: vi.fn(),
    });

    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    expect(result.current.settings.onboardingCompleted).toBe(false);
  });
});
