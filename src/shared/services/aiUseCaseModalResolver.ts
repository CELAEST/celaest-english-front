import { ProductEntitlement } from "../../domain/entities/ProductEntitlement";
import { ERROR_DATA, ErrorScenarioData } from "../constants/errorScenarios";
import { classifyAiError } from "./aiErrorClassifier";

export type ByokModalMode = "trial_choice" | "promo_byok";

export type PaywallReason =
  | "expired"
  | "revoked"
  | "suspended"
  | "cancelled"
  | "required";

export interface AiModalResolutionContext {
  entitlement?: ProductEntitlement | undefined;
  hasAnyKey?: boolean | undefined;
  isAuthenticated?: boolean | undefined;
}

export type ResolvedAiModalAction =
  | {
      kind: "auth_relogin";
      scenario: ErrorScenarioData;
      cooldownSeconds: number;
    }
  | {
      kind: "paywall";
      reason: PaywallReason;
      entitlement?: ProductEntitlement | undefined;
    }
  | {
      kind: "byok_setup";
      mode: ByokModalMode;
    }
  | {
      kind: "infra_recovery";
      scenario: ErrorScenarioData;
      cooldownSeconds: number;
    };

const EXPIRED_STATUSES = new Set<string>([
  "expired",
  "revoked",
  "suspended",
  "cancelled",
]);

function extractStatus(err: any): number | undefined {
  return typeof err?.status === "number" ? err.status : undefined;
}

function extractCode(err: any): string {
  const raw = err?.code ?? err?.details?.code ?? "";
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
}

function extractEntitlementStatus(err: any, entitlement?: ProductEntitlement): string {
  const fromErr = err?.details?.entitlementStatus;
  if (typeof fromErr === "string" && fromErr.trim()) {
    return fromErr.trim().toLowerCase();
  }
  return (entitlement?.status || "").trim().toLowerCase();
}

function mapPaywallReason(code: string, entStatus: string): PaywallReason {
  if (code === "ENTITLEMENT_EXPIRED" || entStatus === "expired") return "expired";
  if (code === "ENTITLEMENT_REVOKED" || entStatus === "revoked") return "revoked";
  if (code === "ENTITLEMENT_SUSPENDED" || entStatus === "suspended") return "suspended";
  if (code === "ENTITLEMENT_CANCELLED" || entStatus === "cancelled") return "cancelled";
  return "required";
}

/**
 * Deterministically maps any AI error (or pre-flight missing-access condition)
 * into one of the 6 exact user-facing recovery paths, eliminating fake answers
 * or misleading promo/quota modals.
 */
export function resolveAiModalUseCase(
  err: unknown,
  context: AiModalResolutionContext = {},
): ResolvedAiModalAction {
  const errObj = (err && typeof err === "object" ? err : {}) as Record<string, any>;
  const status = extractStatus(errObj);
  const code = extractCode(errObj);
  const entStatus = extractEntitlementStatus(errObj, context.entitlement);
  const msg = String(errObj?.message ?? err ?? "").toLowerCase();
  const detailsStr = String(errObj?.rawErrorDetails ?? errObj?.details ?? "").toLowerCase();
  const full = `${code.toLowerCase()} ${msg} ${detailsStr}`;

  const mentionsProviderKey =
    code === "AUTH_DECLINED_KEY" ||
    full.includes("auth_declined") ||
    full.includes("invalid_api_key") ||
    full.includes("invalid key") ||
    full.includes("incorrect api key");

  // 1. Session expired / not authenticated (never confuse with provider API key 401/422)
  const isBackendSessionFailure =
    code === "JWT_EXPIRED" ||
    code === "AUTHENTICATION_REQUIRED" ||
    code === "JWT_SESSION_REFRESH" ||
    (code === "UNAUTHORIZED" && !mentionsProviderKey) ||
    (status === 401 && !mentionsProviderKey && !full.includes("api key") && !full.includes("clave configurada")) ||
    (full.includes("jwt") && (full.includes("expired") || full.includes("expir")));

  if (
    isBackendSessionFailure ||
    code === "UNAUTHENTICATED" ||
    err === "UNAUTHENTICATED"
  ) {
    return {
      kind: "auth_relogin",
      scenario: ERROR_DATA["jwt-expired-mid-interview"],
      cooldownSeconds: 0,
    };
  }

  // 2. Expired / revoked / suspended / cancelled entitlement
  const isEntitlementCode =
    code === "ENTITLEMENT_EXPIRED" ||
    code === "ENTITLEMENT_REVOKED" ||
    code === "ENTITLEMENT_SUSPENDED" ||
    code === "ENTITLEMENT_CANCELLED" ||
    code === "ENTITLEMENT_REQUIRED";

  if (
    isEntitlementCode ||
    (status === 403 && EXPIRED_STATUSES.has(entStatus)) ||
    (EXPIRED_STATUSES.has(entStatus) && !mentionsProviderKey && code !== "RATE_LIMIT_COOLDOWN")
  ) {
    return {
      kind: "paywall",
      reason: mapPaywallReason(code, entStatus),
      entitlement: context.entitlement,
    };
  }

  // 3 & 4. Free Trial choice vs Promo BYOK setup (missing key)
  const isExplicitTrialCode = code === "AI_TRIAL_ACCESS_REQUIRED";
  const isExplicitByokCode =
    code === "AI_BYOK_REQUIRED" ||
    code === "BYOK_REQUIRED" ||
    errObj?.name === "PathwayByokRequiredError";
  const isMissingKeyWithoutCloud =
    !context.entitlement?.aiCloudIncluded &&
    context.hasAnyKey === false &&
    (err === "NO_KEY" ||
      msg === "no_key" ||
      status === 402 ||
      (code === "AI_KEYS_EXHAUSTED" &&
        (status === 401 || msg.includes("no hay clave") || msg.includes("no se encontró una clave") || msg.includes("desactivado"))));

  if (isExplicitTrialCode) {
    return { kind: "byok_setup", mode: "trial_choice" };
  }

  if (isExplicitByokCode || isMissingKeyWithoutCloud) {
    const hasActiveLicense =
      Boolean(context.entitlement?.hasAccess) && !EXPIRED_STATUSES.has(entStatus) && entStatus !== "none";
    return {
      kind: "byok_setup",
      mode: hasActiveLicense ? "promo_byok" : "trial_choice",
    };
  }

  // 5 & 6. Provider failure (BYOK configured) or CELAEST Cloud failure
  const classified = classifyAiError(err);
  if (classified.errorType === "jwt-expired-mid-interview") {
    return {
      kind: "auth_relogin",
      scenario: classified.scenario,
      cooldownSeconds: classified.cooldownSeconds,
    };
  }

  return {
    kind: "infra_recovery",
    scenario: classified.scenario,
    cooldownSeconds: classified.cooldownSeconds,
  };
}
