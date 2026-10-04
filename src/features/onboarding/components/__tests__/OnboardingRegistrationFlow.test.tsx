import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OnboardingView } from "../OnboardingView";
import { SupabaseAuthAdapter } from "../../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { apiSettingsRepository } from "../../../../infrastructure/repositories/ApiSettingsRepository";

vi.mock("../../../../design-system/components/Media/OptimizedVideo", () => ({
  OptimizedVideo: () => <div data-testid="mock-video" />,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Onboarding Registration Flow - Begin Screen Contract", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("fresh registration directs user to Welcome ('Begin') screen instead of auto-finishing or defaulting to Professional", async () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    // Simulate user registered: authenticated but not completed onboarding
    vi.spyOn(authAdapter, "isAuthenticated").mockReturnValue(true);
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue({
      id: "fresh-usr-777",
      email: "esteban2@example.com",
      name: "Esteban2",
      role: "member",
      onboardingCompleted: false,
    });

    vi.spyOn(apiSettingsRepository, "getProfile").mockResolvedValue({
      id: "fresh-usr-777",
      email: "esteban2@example.com",
      name: "Esteban2",
      cefrLevel: "B1",
      dailyFocus: "Clarity & Vocabulary",
      learningGoal: "Daily Conversation",
      preferenceStyle: "Conversation First",
      profession: "",
      onboardingCompleted: false,
      streakDays: 1,
    });

    const onFinish = vi.fn();

    render(<OnboardingView onFinish={onFinish} />, {
      wrapper: createWrapper(),
    });

    // onFinish MUST NOT be called for a fresh unonboarded user
    expect(onFinish).not.toHaveBeenCalled();

    // The user MUST see the "Begin" screen
    expect(screen.getByText("Your AI Language Mentor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Begin/i })).toBeInTheDocument();
  });

  it("returning user with onboardingCompleted=true triggers onFinish to direct to dashboard", async () => {
    const authAdapter = SupabaseAuthAdapter.getInstance();
    vi.spyOn(authAdapter, "isAuthenticated").mockReturnValue(true);
    vi.spyOn(authAdapter, "getStoredUser").mockReturnValue({
      id: "returning-usr-888",
      email: "returning@example.com",
      name: "Returning Learner",
      role: "member",
      onboardingCompleted: true,
    });

    localStorage.setItem("lingua_onboarding_completed_returning-usr-888", "true");

    vi.spyOn(apiSettingsRepository, "getProfile").mockResolvedValue({
      id: "returning-usr-888",
      email: "returning@example.com",
      name: "Returning Learner",
      cefrLevel: "C1",
      dailyFocus: "Executive Polish",
      learningGoal: "Global Leadership",
      preferenceStyle: "Actionable",
      profession: "Cardiologist",
      onboardingCompleted: true,
      streakDays: 15,
    });

    const onFinish = vi.fn();

    render(<OnboardingView onFinish={onFinish} />, {
      wrapper: createWrapper(),
    });

    // onFinish MUST be called to immediately enter workspace
    expect(onFinish).toHaveBeenCalled();
  });
});
