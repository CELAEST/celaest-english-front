import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { WorkspaceDashboardView } from "../WorkspaceDashboardView";
import { QueryProvider } from "../../../../shared/providers/QueryProvider";
import { SupabaseAuthAdapter } from "../../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../../../infrastructure/repositories/ApiEntitlementRepository";
import { apiSettingsRepository } from "../../../../infrastructure/repositories/ApiSettingsRepository";
import { apiPathwayRepository } from "../../../../infrastructure/repositories/ApiPathwayRepository";
import { DEFAULT_FREE_ENTITLEMENT } from "../../../../domain/entities/ProductEntitlement";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";

describe("WorkspaceDashboardView + PathwayStudioView — Single-Entry Promo BYOK Modal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
    localStorage.setItem(
      "lingua_auth_user",
      JSON.stringify({ id: "coupon-user-1", email: "coupon@celaest.com", name: "Coupon User" }),
    );
    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "purchase",
      status: "active",
      aiCloudIncluded: false,
    });
    vi.spyOn(apiSettingsRepository, "getProfile").mockResolvedValue({
      id: "coupon-user-1",
      name: "Coupon User",
      email: "coupon@celaest.com",
      cefrLevel: "A1",
      dailyFocus: "20 min",
      learningGoal: "Fluency",
      preferenceStyle: "Conversation First",
      profession: "Developer",
      streakDays: 0,
      onboardingCompleted: true,
    });
    vi.spyOn(apiPathwayRepository, "getCurrentPathway").mockResolvedValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it(
    "renders exactly ONE LinguaByokRequiredModal when entering Pathway with a promo coupon and closes permanently after 1 save",
    async () => {
      // Warm lazy pathway chunk before timing assertion
      await import("../../../pathway");

      render(
        <QueryProvider>
          <WorkspaceDashboardView defaultTab="pathway" userName="Coupon User" userLevel="A1" />
        </QueryProvider>,
      );

      // Wait for lazy-loaded PathwayStudioView and promo BYOK modal to mount together
      await waitFor(
        () => {
          expect(screen.getAllByText(/Motor Groq \(Modo BYOK\)/i)).toHaveLength(1);
        },
        { timeout: 10000 },
      );

      // Give extra ticks for any competing shell effect to settle; still strictly 1 dialog
      await act(async () => {
        await new Promise((r) => setTimeout(r, 150));
      });
      expect(screen.getAllByRole("dialog")).toHaveLength(1);

      const input = screen.getByPlaceholderText("gsk_...");
      fireEvent.change(input, { target: { value: "gsk_single_entry_coupon_12345" } });

      const saveBtn = screen.getByRole("button", { name: /Guardar y Activar Groq/i });
      fireEvent.click(saveBtn);

      // Single submission clears ALL BYOK prompts on screen (never asks twice)
      await waitFor(async () => {
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(await providerKeyVault.getKey("groq")).toBe("gsk_single_entry_coupon_12345");
        expect(await providerKeyVault.hasAnyConfiguredKey()).toBe(true);
      });
    },
    15000,
  );
});
