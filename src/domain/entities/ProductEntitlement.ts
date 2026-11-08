export type EntitlementAccessType =
  | "none"
  | "purchase"
  | "subscription"
  | "owner"
  | "trial";

export type EntitlementStatus =
  | "active"
  | "trial"
  | "expired"
  | "revoked"
  | "none";

export interface ProductEntitlement {
  hasAccess: boolean;
  accessType: EntitlementAccessType;
  productId: string;
  productSlug: string;
  productName: string;
  productType: string;
  externalUrl?: string | undefined;
  basePrice: number;
  currency: string;
  minPlanTier: number;
  licenseId?: string | undefined;
  licenseKey?: string | undefined;
  status: EntitlementStatus;
  planTier: number;
  aiCloudIncluded: boolean;
  limits?: Record<string, unknown> | undefined;
  expiresAt?: string | undefined;
}

export interface MarketplaceCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  amountLocal?: number | undefined;
  currency?: string | undefined;
}

export const DEFAULT_FREE_ENTITLEMENT: ProductEntitlement = {
  hasAccess: false,
  accessType: "none",
  productId: "",
  productSlug: "lingua",
  productName: "CELAEST Lingua AI",
  productType: "saas",
  basePrice: 29.99,
  currency: "USD",
  minPlanTier: 1,
  status: "none",
  planTier: 0,
  aiCloudIncluded: false,
};
