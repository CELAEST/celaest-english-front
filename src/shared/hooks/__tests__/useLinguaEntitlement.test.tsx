import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useLinguaEntitlement } from "../useLinguaEntitlement";
import { useAiUseCaseModals } from "../useAiUseCaseModals";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { HttpClient } from "../../../infrastructure/http/HttpClient";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { providerKeyVault } from "../../../features/settings/services/providerKeyVault";
import { LinguaMarketplacePaywallModal } from "../../../features/workspace/components/LinguaMarketplacePaywallModal";
import { LinguaByokRequiredModal } from "../../../features/workspace/components/LinguaByokRequiredModal";
import { DEFAULT_FREE_ENTITLEMENT } from "../../../domain/entities/ProductEntitlement";

const Harness: React.FC = () => {
  const { entitlement, isLoading, hasFullAccess, canAccessNode } =
    useLinguaEntitlement();
  if (isLoading) return <div data-testid="loading">loading</div>;
  return (
    <div>
      <span data-testid="access">{String(hasFullAccess)}</span>
      <span data-testid="type">{entitlement.accessType}</span>
      <span data-testid="base0">{String(canAccessNode(0))}</span>
      <span data-testid="base1">{String(canAccessNode(1))}</span>
    </div>
  );
};

describe("useLinguaEntitlement & LinguaMarketplacePaywallModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, "", "/workspace");
  });

  it("grants Base 01 trial access and gates Base 02+ when user has no Marketplace entitlement", async () => {
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(
      true,
    );
    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: false,
      accessType: "none",
    });

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("access").textContent).toBe("false");
    });
    expect(screen.getByTestId("base0").textContent).toBe("true");
    expect(screen.getByTestId("base1").textContent).toBe("false");
  });

  it("unlocks all bases and enables Central Core AI when Marketplace entitlement includes AI cloud", async () => {
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(
      true,
    );
    const centralCoreSpy = vi
      .spyOn(providerKeyVault, "setCentralCoreEnabled")
      .mockResolvedValue();

    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "purchase",
      status: "active",
      aiCloudIncluded: true,
    });

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("access").textContent).toBe("true");
    });
    expect(screen.getByTestId("type").textContent).toBe("purchase");
    expect(screen.getByTestId("base0").textContent).toBe("true");
    expect(screen.getByTestId("base1").textContent).toBe("true");
    expect(centralCoreSpy).toHaveBeenCalledWith(true);
  });

  it("verifies Stripe checkout session_id on return and strips query params", async () => {
    window.history.replaceState(
      {},
      "",
      "/workspace?success=true&session_id=cs_live_999",
    );
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(
      true,
    );
    const verifySpy = vi
      .spyOn(ApiEntitlementRepository, "verifyCheckoutSession")
      .mockResolvedValue({ status: "completed" });
    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "purchase",
      status: "active",
      aiCloudIncluded: true,
    });

    render(<Harness />);

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith("cs_live_999");
      expect(screen.getByTestId("access").textContent).toBe("true");
    });
    expect(window.location.search).toBe("");
  });

  it("renders LinguaMarketplacePaywallModal and triggers direct checkout CTA", () => {
    const onCheckout = vi.fn();
    const onClose = vi.fn();

    render(
      <LinguaMarketplacePaywallModal
        isOpen={true}
        entitlement={{
          ...DEFAULT_FREE_ENTITLEMENT,
          productName: "CELAEST Lingua AI",
          basePrice: 29.99,
          currency: "USD",
        }}
        onClose={onClose}
        onCheckout={onCheckout}
      />,
    );

    expect(screen.getByText(/Desbloquea CELAEST Lingua AI/i)).toBeTruthy();
    expect(screen.getByText("$29.99")).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: /Desbloquear Acceso Ahora/i }),
    );
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it("renders expired license state in modal and disables Central Core AI", async () => {
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    const centralCoreSpy = vi.spyOn(providerKeyVault, "setCentralCoreEnabled").mockResolvedValue();

    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: false,
      accessType: "purchase",
      status: "expired",
      aiCloudIncluded: true,
    });

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("access").textContent).toBe("false");
    });
    expect(centralCoreSpy).toHaveBeenCalledWith(false);

    render(
      <LinguaMarketplacePaywallModal
        isOpen={true}
        entitlement={{
          ...DEFAULT_FREE_ENTITLEMENT,
          status: "expired",
          productName: "CELAEST Lingua AI",
          basePrice: 29.99,
          currency: "USD",
        }}
        onClose={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );

    expect(screen.getByText(/Tu Licencia ha Expirado/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Renovar Acceso Ahora/i })).toBeTruthy();
  });

  it("handles BYOK mode when entitlement has access but aiCloudIncluded is false", async () => {
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    const centralCoreSpy = vi.spyOn(providerKeyVault, "setCentralCoreEnabled").mockResolvedValue();

    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "purchase",
      status: "active",
      aiCloudIncluded: false,
    });

    render(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("access").textContent).toBe("true");
    });
    expect(centralCoreSpy).toHaveBeenCalledWith(false);
  });

  it("passes uppercase coupon code to onCheckout when entered in paywall modal", () => {
    const onCheckout = vi.fn();
    render(
      <LinguaMarketplacePaywallModal
        isOpen={true}
        entitlement={{
          ...DEFAULT_FREE_ENTITLEMENT,
          productName: "CELAEST Lingua AI",
          basePrice: 29.99,
          currency: "USD",
        }}
        onClose={vi.fn()}
        onCheckout={onCheckout}
      />,
    );

    const input = screen.getByPlaceholderText(/¿Tienes un cupón\?/i);
    fireEvent.change(input, { target: { value: "promo100" } });

    expect(screen.getByDisplayValue("PROMO100")).toBeTruthy();

    const redeemButton = screen.getByRole("button", { name: /Canjear cupón y desbloquear/i });
    fireEvent.click(redeemButton);

    expect(onCheckout).toHaveBeenCalledWith("PROMO100");
  });

  it("LinguaByokRequiredModal saves free key to vault, disables central core, and invokes callback", async () => {
    const saveKeySpy = vi.spyOn(providerKeyVault, "saveKey").mockResolvedValue();
    const setActiveSpy = vi.spyOn(providerKeyVault, "saveActiveProviderId").mockResolvedValue();
    const setCentralSpy = vi.spyOn(providerKeyVault, "setCentralCoreEnabled").mockResolvedValue();
    const onConfigured = vi.fn();
    const onClose = vi.fn();

    render(
      <LinguaByokRequiredModal
        isOpen={true}
        onClose={onClose}
        onConfigured={onConfigured}
      />,
    );

    expect(screen.getByText(/Motor de IA \(Modo BYOK\)/i)).toBeTruthy();

    const input = screen.getByPlaceholderText("gsk_...");
    fireEvent.change(input, { target: { value: "gsk_live_test_key_123" } });

    const saveButton = screen.getByRole("button", { name: /Guardar y Activar IA/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveKeySpy).toHaveBeenCalledWith("groq", "gsk_live_test_key_123");
      expect(setActiveSpy).toHaveBeenCalledWith("groq");
      expect(setCentralSpy).toHaveBeenCalledWith(false);
      expect(onConfigured).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("LinguaByokRequiredModal in trial_choice mode shows Free Trial header and switches to Paywall cleanly", () => {
    const onClose = vi.fn();
    const onOpenPaywall = vi.fn();

    render(
      <LinguaByokRequiredModal
        isOpen={true}
        mode="trial_choice"
        onClose={onClose}
        onOpenPaywall={onOpenPaywall}
      />,
    );

    expect(screen.getByText(/Prueba Gratuita \(Base 01\)/i)).toBeTruthy();
    const upgradeBtn = screen.getByRole("button", { name: /Ver Planes Lingua Pro/i });
    fireEvent.click(upgradeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onOpenPaywall).toHaveBeenCalledTimes(1);
  });

  it("LinguaByokRequiredModal auto-aligns provider to gemini when pasting an AIza key to avoid mismatch", async () => {
    const saveKeySpy = vi.spyOn(providerKeyVault, "saveKey").mockResolvedValue();
    const setActiveSpy = vi.spyOn(providerKeyVault, "saveActiveProviderId").mockResolvedValue();
    const setCentralSpy = vi.spyOn(providerKeyVault, "setCentralCoreEnabled").mockResolvedValue();
    const onConfigured = vi.fn();

    render(
      <LinguaByokRequiredModal
        isOpen={true}
        onClose={vi.fn()}
        onConfigured={onConfigured}
      />,
    );

    const input = screen.getByPlaceholderText("gsk_...");
    fireEvent.change(input, { target: { value: "AIzaSyAutoAlignedGeminiKey99" } });

    const saveButton = screen.getByRole("button", { name: /Guardar y Activar IA/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveKeySpy).toHaveBeenCalledWith("gemini", "AIzaSyAutoAlignedGeminiKey99");
      expect(setActiveSpy).toHaveBeenCalledWith("gemini");
      expect(setCentralSpy).toHaveBeenCalledWith(false);
      expect(onConfigured).toHaveBeenCalledTimes(1);
    });
  });

  it("useAiUseCaseModals closes open BYOK modal automatically when providerKeyVault saves a key", async () => {
    localStorage.clear();
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "purchase",
      status: "active",
      aiCloudIncluded: false,
    });

    const ModalControllerHarness: React.FC = () => {
      const ctrl = useAiUseCaseModals("pathway");
      return (
        <div>
          <span data-testid="byok-open">{String(ctrl.byokOpen)}</span>
          <button type="button" onClick={() => ctrl.openByokModal("promo_byok")}>
            open
          </button>
        </div>
      );
    };

    render(<ModalControllerHarness />);
    fireEvent.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByTestId("byok-open").textContent).toBe("true");

    await act(async () => {
      await providerKeyVault.saveKey("groq", "gsk_sync_event_key_1");
    });

    await waitFor(() => {
      expect(screen.getByTestId("byok-open").textContent).toBe("false");
    });
  });

  it("deduplicates concurrent hook mounts into a single getEntitlement call (anti-burst)", async () => {
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    let resolveFetch!: (val: typeof DEFAULT_FREE_ENTITLEMENT) => void;
    const pendingPromise = new Promise<typeof DEFAULT_FREE_ENTITLEMENT>((resolve) => {
      resolveFetch = resolve;
    });
    const spy = vi
      .spyOn(ApiEntitlementRepository, "getEntitlement")
      .mockReturnValue(pendingPromise);

    render(
      <>
        <Harness />
        <Harness />
        <Harness />
        <Harness />
        <Harness />
      </>,
    );

    expect(spy).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFetch({
        ...DEFAULT_FREE_ENTITLEMENT,
        hasAccess: true,
        accessType: "purchase",
        status: "active",
        aiCloudIncluded: true,
      });
      await pendingPromise;
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("access").every((el) => el.textContent === "true")).toBe(true);
    });
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("caches ApiEntitlementRepository.getEntitlement across repeated calls within TTL unless forced", async () => {
    ApiEntitlementRepository.invalidateEntitlementCache();
    const httpSpy = vi.spyOn(HttpClient, "get").mockResolvedValue({
      has_access: true,
      access_type: "purchase",
      status: "active",
      ai_cloud_included: true,
    });

    const [a, b, c] = await Promise.all([
      ApiEntitlementRepository.getEntitlement("lingua"),
      ApiEntitlementRepository.getEntitlement("lingua"),
      ApiEntitlementRepository.getEntitlement("lingua"),
    ]);

    expect(a.hasAccess).toBe(true);
    expect(b.hasAccess).toBe(true);
    expect(c.hasAccess).toBe(true);
    expect(httpSpy).toHaveBeenCalledTimes(1);

    // Subsequent call within TTL reuses cache without hitting HttpClient again
    await ApiEntitlementRepository.getEntitlement("lingua");
    expect(httpSpy).toHaveBeenCalledTimes(1);

    // Explicit force=true bypasses TTL cache
    await ApiEntitlementRepository.getEntitlement("lingua", { force: true });
    expect(httpSpy).toHaveBeenCalledTimes(2);
  });
});

