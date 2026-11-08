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
  limits?: Record<string, unknown>;
  expires_at?: string;
}

interface RawCheckoutResponse {
  session_id: string;
  checkout_url: string;
  amount_local?: number;
  currency?: string;
}

export class ApiEntitlementRepository {
  static async getEntitlement(slug = "lingua"): Promise<ProductEntitlement> {
    const raw = await HttpClient.get<RawProductEntitlement>(
      `${ENV.celaestBackUrl}/user/my/entitlements/${encodeURIComponent(slug)}`,
    );
    return {
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
      limits: raw?.limits,
      expiresAt: raw?.expires_at,
    };
  }

  static async createCheckoutSession(
    productId: string,
    returnUrl: string,
  ): Promise<MarketplaceCheckoutSession> {
    const raw = await HttpClient.post<RawCheckoutResponse>(
      `${ENV.celaestBackUrl}/user/marketplace/checkout`,
      { product_id: productId, return_url: returnUrl },
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
    return HttpClient.get<{ status: string }>(
      `${ENV.celaestBackUrl}/user/marketplace/checkout/verify/${encodeURIComponent(sessionId)}`,
    );
  }
}

