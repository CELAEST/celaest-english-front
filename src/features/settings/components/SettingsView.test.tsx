import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsView } from "./SettingsView";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";

vi.mock("../../../infrastructure/repositories/ApiSettingsRepository", () => ({
  apiSettingsRepository: {
    getProfile: vi.fn(),
    updateSettings: vi.fn(),
    getAiProviders: vi.fn(),
    configureAiProvider: vi.fn(),
    activateAiProvider: vi.fn(),
    testAiProvider: vi.fn(),
  },
}));

vi.mock("../../../infrastructure/adapters/auth/SupabaseAuthAdapter", () => ({
  SupabaseAuthAdapter: {
    getInstance: () => ({
      getStoredUser: () => ({ name: "Test User", email: "test@celaest.com" }),
      getStoredToken: () => "fake-token",
    }),
  },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("SettingsView — real flow, no mocks in UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.mocked(apiSettingsRepository.getProfile).mockResolvedValue({
      id: "u1",
      name: "Camila",
      email: "camila@celaest.com",
      cefrLevel: "B1 — Intermediate",
      dailyFocus: "Clarity & Vocabulary",
      learningGoal: "Business Communication",
      preferenceStyle: "Balanced",
      streakDays: 1,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    } as any);
    vi.mocked(apiSettingsRepository.getAiProviders).mockResolvedValue([]);
  });

  it("renders Learning and Personal with real profile data", async () => {
    render(<SettingsView userName="Camila" />, { wrapper: createWrapper() });
    expect(await screen.findByText("LEARNING")).toBeInTheDocument();
    expect(await screen.findByText("PERSONAL")).toBeInTheDocument();
    expect(await screen.findByText("Current Level")).toBeInTheDocument();
  });

  it("opens Level modal and persists via updateSettings (real)", async () => {
    const wrapper = createWrapper();
    vi.mocked(apiSettingsRepository.updateSettings).mockResolvedValue({
      id: "u1",
      name: "Learner",
      cefrLevel: "C1 — Advanced",
      dailyFocus: "20 min",
      learningGoal: "Professional Communication & Fluency",
      preferenceStyle: "Conversation First",
      streakDays: 1,
    } as any);

    render(<SettingsView userName="Learner" />, { wrapper });
    const levelRow = await screen.findByText("Current Level");
    fireEvent.click(levelRow.closest("button")!);
    expect(await screen.findByText("Select your CEFR target")).toBeInTheDocument();
    fireEvent.click(screen.getByText("C1 — Advanced"));
    await waitFor(() => expect(apiSettingsRepository.updateSettings).toHaveBeenCalledWith(expect.objectContaining({ cefrLevel: "C1 — Advanced" })));
  });

  it("opens Profile modal and saves name (real, not prompt)", async () => {
    const wrapper = createWrapper();
    vi.mocked(apiSettingsRepository.updateSettings).mockResolvedValue({} as any);
    render(<SettingsView userName="Learner" />, { wrapper });
    const profileRow = await screen.findByText("Profile");
    fireEvent.click(profileRow.closest("button")!);
    expect(await screen.findByText("Edit profile")).toBeInTheDocument();
    const input = screen.getByPlaceholderText("Your name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Alex" } });
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(apiSettingsRepository.updateSettings).toHaveBeenCalledWith(expect.objectContaining({ name: "Alex" })));
  });
});
