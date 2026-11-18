import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();
const mockGetSession = vi.fn();
const mockSetSession = vi.fn();
const mockExchangeCode = vi.fn();
const mockGetProfile = vi.fn();
const mockGetEntitlement = vi.fn();
let authStateCallback: ((event: string, session: any) => void) | null = null;

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../../design-system/components/Media/OptimizedVideo", () => ({
  OptimizedVideo: () => <div data-testid="optimized-video" />,
}));

vi.mock("../../../../infrastructure/adapters/auth/supabaseClient", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (event: string, session: any) => void) => {
        authStateCallback = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
      getSession: (...args: any[]) => mockGetSession(...args),
      setSession: (...args: any[]) => mockSetSession(...args),
      exchangeCodeForSession: (...args: any[]) => mockExchangeCode(...args),
    },
  },
}));

vi.mock("../../../../infrastructure/repositories/ApiSettingsRepository", () => ({
  apiSettingsRepository: {
    getProfile: (...args: any[]) => mockGetProfile(...args),
  },
}));

vi.mock("../../../../infrastructure/repositories/ApiEntitlementRepository", () => ({
  ApiEntitlementRepository: {
    getEntitlement: (...args: any[]) => mockGetEntitlement(...args),
  },
}));

vi.mock("../../../settings/services/providerKeyVault", () => ({
  providerKeyVault: {
    setCentralCoreEnabled: vi.fn().mockResolvedValue(undefined),
  },
}));

import { AuthCallbackView } from "../AuthCallbackView";

function makeJwt(payload: Record<string, any>): string {
  const h = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = btoa(JSON.stringify(payload));
  return `${h}.${p}.sig`;
}

describe("AuthCallbackView SSO handoff", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    authStateCallback = null;
    mockGetProfile.mockResolvedValue({ onboardingCompleted: true });
    mockGetEntitlement.mockResolvedValue({ hasAccess: true, aiCloudIncluded: true });
  });

  it("prioritizes incoming #access_token over stale INITIAL_SESSION and avoids Supabase setSession for cross-service OTP JWTs", async () => {
    const staleToken = makeJwt({
      sub: "stale-user",
      iss: "https://wcfrqjulnbtmmakirdic.supabase.co/auth/v1",
      exp: Math.floor(Date.now() / 1000) - 600,
    });
    const freshOtpToken = makeJwt({
      sub: "otp-user-99",
      email: "otp@celaest.com",
      iss: "https://your-project.supabase.co/auth/v1",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    mockGetSession.mockResolvedValue({
      data: { session: { access_token: staleToken, refresh_token: "stale-ref" } },
    });

    window.history.replaceState(
      {},
      "",
      `/auth/callback#access_token=${freshOtpToken}&refresh_token=hexrefresh123`,
    );

    render(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <AuthCallbackView />
      </MemoryRouter>,
    );

    // Simulate stale INITIAL_SESSION emission right on mount
    authStateCallback?.("INITIAL_SESSION", {
      access_token: staleToken,
      refresh_token: "stale-ref",
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    expect(localStorage.getItem("lingua_access_token")).toBe(freshOtpToken);
    expect(mockSetSession).not.toHaveBeenCalled();
  });

  it("refreshes expired Supabase Cloud #access_token using refresh_token via setSession before calling API", async () => {
    const expiredCloudToken = makeJwt({
      sub: "cloud-user-1",
      email: "cloud@celaest.com",
      iss: "https://wcfrqjulnbtmmakirdic.supabase.co/auth/v1",
      exp: Math.floor(Date.now() / 1000) - 120,
    });
    const refreshedCloudToken = makeJwt({
      sub: "cloud-user-1",
      email: "cloud@celaest.com",
      iss: "https://wcfrqjulnbtmmakirdic.supabase.co/auth/v1",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSetSession.mockResolvedValue({
      data: {
        session: {
          access_token: refreshedCloudToken,
          refresh_token: "new-ref-tok",
          user: { id: "cloud-user-1", email: "cloud@celaest.com", user_metadata: {} },
        },
      },
      error: null,
    });

    window.history.replaceState(
      {},
      "",
      `/auth/callback#access_token=${expiredCloudToken}&refresh_token=old-ref-tok`,
    );

    render(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <AuthCallbackView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockSetSession).toHaveBeenCalledWith({
        access_token: expiredCloudToken,
        refresh_token: "old-ref-tok",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    expect(localStorage.getItem("lingua_access_token")).toBe(refreshedCloudToken);
    expect(localStorage.getItem("lingua_refresh_token")).toBe("new-ref-tok");
  });

  it("assigns sso:<token> refresh source without calling Supabase setSession when Dashboard SSO passes only #access_token", async () => {
    const dashboardSsoToken = makeJwt({
      sub: "sso-user-42",
      email: "sso@celaest.com",
      iss: "https://wcfrqjulnbtmmakirdic.supabase.co/auth/v1",
      exp: Math.floor(Date.now() / 1000) + 86400,
    });

    mockGetSession.mockResolvedValue({ data: { session: null } });

    window.history.replaceState(
      {},
      "",
      `/auth/callback#access_token=${dashboardSsoToken}`,
    );

    render(
      <MemoryRouter initialEntries={["/auth/callback"]}>
        <AuthCallbackView />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    expect(mockSetSession).not.toHaveBeenCalled();
    expect(localStorage.getItem("lingua_access_token")).toBe(dashboardSsoToken);
    expect(localStorage.getItem("lingua_refresh_token")).toBe(`sso:${dashboardSsoToken}`);
  });
});
