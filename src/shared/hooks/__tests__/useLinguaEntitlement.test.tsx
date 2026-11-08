import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useLinguaEntitlement } from "../useLinguaEntitlement";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { providerKeyVault } from "../../../features/settings/services/providerKeyVault";
import { LinguaMarketplacePaywallModal } from "../../../features/workspace/components/LinguaMarketplacePaywallModal";
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
});

