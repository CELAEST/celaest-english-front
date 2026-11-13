import { describe, it, expect } from "vitest";
import {
  DEFAULT_FREE_ENTITLEMENT,
  ProductEntitlement,
} from "../../../domain/entities/ProductEntitlement";
import { ApiError } from "../../../infrastructure/http/ApiError";
import { ERROR_DATA } from "../../constants/errorScenarios";
import { AiInfrastructureError } from "../../../features/settings/services/directClientAiService";
import { resolveAiModalUseCase } from "../aiUseCaseModalResolver";

const PROMO_BYOK_ENTITLEMENT: ProductEntitlement = {
  ...DEFAULT_FREE_ENTITLEMENT,
  hasAccess: true,
  accessType: "purchase",
  productId: "prod_lingua",
  status: "active",
  planTier: 1,
  aiCloudIncluded: false,
};

const PRO_CLOUD_ENTITLEMENT: ProductEntitlement = {
  ...PROMO_BYOK_ENTITLEMENT,
  accessType: "subscription",
  planTier: 2,
  aiCloudIncluded: true,
};

describe("resolveAiModalUseCase - Strict 6 Production Scenarios", () => {
  it("1a. Maps backend 401 AUTHENTICATION_REQUIRED / JWT_EXPIRED to auth_relogin", () => {
    const err = new ApiError("Token JWT expirado", 401, "JWT_EXPIRED");
    const res = resolveAiModalUseCase(err);
    expect(res.kind).toBe("auth_relogin");
    if (res.kind === "auth_relogin") {
      expect(res.scenario).toBe(ERROR_DATA["jwt-expired-mid-interview"]);
      expect(res.scenario.specialActionType).toBe("re-auth");
    }
  });

  it("1b. Never mistakes provider API key 401/422 AUTH_DECLINED_KEY for JWT expiry", () => {
    const err422 = new ApiError("Invalid Groq API key", 422, "AUTH_DECLINED_KEY");
    const res422 = resolveAiModalUseCase(err422);
    expect(res422.kind).toBe("infra_recovery");
    if (res422.kind === "infra_recovery") {
      expect(res422.scenario.id).toBe("invalid-key-401");
      expect(res422.scenario.specialActionType).not.toBe("re-auth");
    }

    const err401Key = new ApiError("Invalid API key provided", 401, "AUTH_DECLINED_KEY");
    const res401Key = resolveAiModalUseCase(err401Key);
    expect(res401Key.kind).toBe("infra_recovery");
    if (res401Key.kind === "infra_recovery") {
      expect(res401Key.scenario.id).toBe("invalid-key-401");
    }
  });

  it("2. Maps expired, revoked, suspended, cancelled entitlements to Marketplace Paywall", () => {
    for (const [code, expectedReason] of [
      ["ENTITLEMENT_EXPIRED", "expired"],
      ["ENTITLEMENT_REVOKED", "revoked"],
      ["ENTITLEMENT_SUSPENDED", "suspended"],
      ["ENTITLEMENT_CANCELLED", "cancelled"],
    ] as const) {
      const res = resolveAiModalUseCase(
        new ApiError("License invalid", 403, code, { entitlementStatus: expectedReason }),
      );
      expect(res).toMatchObject({ kind: "paywall", reason: expectedReason });
    }
  });

  it("3. Maps 402 AI_TRIAL_ACCESS_REQUIRED (Base 01 trial without key) to dual-choice trial modal", () => {
    const res = resolveAiModalUseCase(
      new ApiError("Trial requires BYOK or upgrade", 402, "AI_TRIAL_ACCESS_REQUIRED"),
      { entitlement: DEFAULT_FREE_ENTITLEMENT, hasAnyKey: false, isAuthenticated: true },
    );
    expect(res).toEqual({ kind: "byok_setup", mode: "trial_choice" });

    const preflightTrial = resolveAiModalUseCase("NO_KEY", {
      entitlement: DEFAULT_FREE_ENTITLEMENT,
      hasAnyKey: false,
      isAuthenticated: true,
    });
    expect(preflightTrial).toEqual({ kind: "byok_setup", mode: "trial_choice" });
  });

  it("4. Maps 402 AI_BYOK_REQUIRED (promo license without key) to promo_byok setup", () => {
    const res = resolveAiModalUseCase(
      new ApiError("Configure BYOK key", 402, "AI_BYOK_REQUIRED"),
      { entitlement: PROMO_BYOK_ENTITLEMENT, hasAnyKey: false, isAuthenticated: true },
    );
    expect(res).toEqual({ kind: "byok_setup", mode: "promo_byok" });
  });

  it("5. Maps BYOK provider failures (429, 402 balance, 504 timeout, 503 outage) to infra_recovery", () => {
    const rateLimit = resolveAiModalUseCase(
      Object.assign(
        new AiInfrastructureError("RATE_LIMIT_COOLDOWN", "Rate limited retry in 18s", 429, "groq"),
        { cooldownSeconds: 18 },
      ),
      { entitlement: PROMO_BYOK_ENTITLEMENT, hasAnyKey: true, isAuthenticated: true },
    );
    expect(rateLimit.kind).toBe("infra_recovery");
    if (rateLimit.kind === "infra_recovery") {
      expect(rateLimit.scenario.id).toBe("rate-limit-429");
      expect(rateLimit.cooldownSeconds).toBe(18);
    }

    const quota = resolveAiModalUseCase(
      new ApiError("Insufficient quota balance", 402, "INSUFFICIENT_QUOTA"),
      { entitlement: PROMO_BYOK_ENTITLEMENT, hasAnyKey: true, isAuthenticated: true },
    );
    expect(quota.kind).toBe("infra_recovery");
    if (quota.kind === "infra_recovery") {
      expect(quota.scenario.id).toBe("keys-exhausted-pool");
    }

    const timeout = resolveAiModalUseCase(
      new AiInfrastructureError("GATEWAY_TIMEOUT", "Request timed out", 504, "groq"),
      { entitlement: PROMO_BYOK_ENTITLEMENT, hasAnyKey: true, isAuthenticated: true },
    );
    expect(timeout.kind).toBe("infra_recovery");
    if (timeout.kind === "infra_recovery") {
      expect(timeout.scenario.id).toBe("gateway-timeout-504");
    }
  });

  it("6. Maps AI Cloud upstream failures for Pro subscribers to infra_recovery (never byok_setup)", () => {
    const cloudOutage = resolveAiModalUseCase(
      new ApiError("CELAEST Core unreachable", 503, "AI_CORE_UNAVAILABLE"),
      { entitlement: PRO_CLOUD_ENTITLEMENT, hasAnyKey: false, isAuthenticated: true },
    );
    expect(cloudOutage.kind).toBe("infra_recovery");
    if (cloudOutage.kind === "infra_recovery") {
      expect(cloudOutage.scenario.id).toBe("server-outage-503");
    }
  });
});
