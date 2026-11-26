import {
  DEFAULT_FREE_ENTITLEMENT,
  MarketplaceCheckoutSession,
  ProductEntitlement,
} from "../../domain/entities/ProductEntitlement";
import { ENV } from "../../shared/constants/env";
import { HttpClient } from "../http/HttpClient";

interface RawProductEntitlement {
  has_access?: boolean;
  access_type?: ProductEntitlement["accessType"];
  product_id?: string;
  product_slug?: string;
  product_name?: string;
  product_type?: string;
  external_url?: string;
  base_price?: number;
  currency?: string;
  min_plan_tier?: number;
  license_id?: string;
  license_key?: string;
  status?: ProductEntitlement["status"];
  plan_tier?: number;
  ai_cloud_included?: boolean;
  ai_requests_used?: number;
  ai_requests_limit?: number;
  quota_exhausted?: boolean;
  limits?: Record<string, unknown>;
  expires_at?: string;
}

interface RawCheckoutResponse {
  session_id: string;
  checkout_url: string;
  amount_local?: number;
  currency?: string;
}

const ENTITLEMENT_CACHE_TTL_MS = 5 * 60 * 1000;
const entitlementCache = new Map<string, { data: ProductEntitlement; fetchedAt: number }>();
const inFlightEntitlements = new Map<string, Promise<ProductEntitlement>>();

if (typeof window !== "undefined") {
  const clearCache = () => {
    entitlementCache.clear();
  };
  window.addEventListener("celaest:auth-changed", clearCache);
  window.addEventListener("celaest:unauthorized", clearCache);
}

export class ApiEntitlementRepository {
  static invalidateEntitlementCache(slug?: string): void {
    if (slug) {
      entitlementCache.delete(slug);
    } else {
      entitlementCache.clear();
    }
  }

  static async getEntitlement(
    slug = "lingua",
    options?: { force?: boolean },
  ): Promise<ProductEntitlement> {
    if (import.meta.env.DEV) {
      const user = localStorage.getItem("lingua_auth_user");
      if (user?.includes("dev-user-local")) {
        return {
          ...DEFAULT_FREE_ENTITLEMENT,
          hasAccess: true,
          accessType: "subscription",
          productId: "prod_lingua_dev",
          productSlug: slug,
          productName: "Lingua Dev Full Access",
          productType: "saas",
          basePrice: 0,
          currency: "USD",
          status: "active",
          planTier: 2,
          aiCloudIncluded: true,
          limits: {},
        };
      }
    }

    const force = Boolean(options?.force);
    const cached = entitlementCache.get(slug);
    if (!force && cached && Date.now() - cached.fetchedAt < ENTITLEMENT_CACHE_TTL_MS) {
      return cached.data;
    }

    const pending = inFlightEntitlements.get(slug);
    if (!force && pending) {
      return pending;
    }

    const fetchPromise = (async (): Promise<ProductEntitlement> => {
      const raw = await HttpClient.get<RawProductEntitlement>(
        `${ENV.celaestBackUrl}/user/my/entitlements/${encodeURIComponent(slug)}`,
      );
      const resolved: ProductEntitlement = {
        hasAccess: Boolean(raw?.has_access),
        accessType: raw?.access_type ?? "none",
        productId: raw?.product_id ?? DEFAULT_FREE_ENTITLEMENT.productId,
        productSlug: raw?.product_slug ?? slug,
        productName: raw?.product_name ?? DEFAULT_FREE_ENTITLEMENT.productName,
        productType: raw?.product_type ?? "saas",
        externalUrl: raw?.external_url,
        basePrice:
          typeof raw?.base_price === "number"
            ? raw.base_price
            : DEFAULT_FREE_ENTITLEMENT.basePrice,
        currency: raw?.currency || DEFAULT_FREE_ENTITLEMENT.currency,
        minPlanTier: raw?.min_plan_tier ?? 1,
        licenseId: raw?.license_id,
        licenseKey: raw?.license_key,
        status: raw?.status ?? "none",
        planTier: raw?.plan_tier ?? 0,
        aiCloudIncluded: Boolean(raw?.ai_cloud_included),
        aiRequestsUsed:
          typeof raw?.ai_requests_used === "number" ? raw.ai_requests_used : undefined,
        aiRequestsLimit:
          typeof raw?.ai_requests_limit === "number" ? raw.ai_requests_limit : undefined,
        quotaExhausted: Boolean(raw?.quota_exhausted),
        limits: raw?.limits,
        expiresAt: raw?.expires_at,
      };
      entitlementCache.set(slug, { data: resolved, fetchedAt: Date.now() });
      return resolved;
    })();

    inFlightEntitlements.set(slug, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      if (inFlightEntitlements.get(slug) === fetchPromise) {
        inFlightEntitlements.delete(slug);
      }
    }
  }

  static async createCheckoutSession(
    productId: string,
    returnUrl: string,
    couponCode?: string,
  ): Promise<MarketplaceCheckoutSession> {
    const raw = await HttpClient.post<RawCheckoutResponse>(
      `${ENV.celaestBackUrl}/user/marketplace/checkout`,
      {
        product_id: productId,
        return_url: returnUrl,
        ...(couponCode && couponCode.trim() ? { coupon_code: couponCode.trim() } : {}),
      },
    );
    return {
      sessionId: raw.session_id,
      checkoutUrl: raw.checkout_url,
      amountLocal: raw.amount_local,
      currency: raw.currency,
    };
  }

  static async verifyCheckoutSession(
    sessionId: string,
  ): Promise<{ status: string }> {
    entitlementCache.clear();
    return HttpClient.get<{ status: string }>(
      `${ENV.celaestBackUrl}/user/marketplace/checkout/verify/${encodeURIComponent(sessionId)}`,
    );
  }
}

