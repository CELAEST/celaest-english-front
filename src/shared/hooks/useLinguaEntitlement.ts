import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_FREE_ENTITLEMENT,
  ProductEntitlement,
} from "../../domain/entities/ProductEntitlement";
import { providerKeyVault } from "../../features/settings/services/providerKeyVault";
import { SupabaseAuthAdapter } from "../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../infrastructure/repositories/ApiEntitlementRepository";
import { ENV } from "../constants/env";

export function useLinguaEntitlement() {
  const [entitlement, setEntitlement] = useState<ProductEntitlement>(
    DEFAULT_FREE_ENTITLEMENT,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  const refreshEntitlement = useCallback(async () => {
    if (!SupabaseAuthAdapter.getInstance().isAuthenticated()) {
      setEntitlement(DEFAULT_FREE_ENTITLEMENT);
      await providerKeyVault.setCentralCoreEnabled(false);
      setIsLoading(false);
      return DEFAULT_FREE_ENTITLEMENT;
    }
    setIsLoading(true);
    try {
      const resolved = await ApiEntitlementRepository.getEntitlement("lingua");
      setEntitlement(resolved);
      const isEligibleForCloud =
        resolved.hasAccess &&
        resolved.aiCloudIncluded &&
        resolved.status !== "expired" &&
        resolved.status !== "revoked";
      await providerKeyVault.setCentralCoreEnabled(isEligibleForCloud);
      return resolved;
    } catch {
      setEntitlement(DEFAULT_FREE_ENTITLEMENT);
      await providerKeyVault.setCentralCoreEnabled(false);
      return DEFAULT_FREE_ENTITLEMENT;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
          try {
            await ApiEntitlementRepository.verifyCheckoutSession(sessionId);
          } catch {
            // Webhook fallback handles delayed verification
          }
          params.delete("session_id");
          params.delete("success");
          params.delete("product_id");
          const query = params.toString();
          const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
          window.history.replaceState({}, "", cleanUrl);
        }
      }
      if (active) await refreshEntitlement();
    };
    void init();

    const handleAuthOrFocus = () => {
      if (active && SupabaseAuthAdapter.getInstance().isAuthenticated()) {
        void refreshEntitlement();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("celaest:auth-changed", handleAuthOrFocus);
      window.addEventListener("focus", handleAuthOrFocus);
    }
    return () => {
      active = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("celaest:auth-changed", handleAuthOrFocus);
        window.removeEventListener("focus", handleAuthOrFocus);
      }
    };
  }, [refreshEntitlement]);

  const startDirectCheckout = useCallback(async () => {
    setIsCheckoutLoading(true);
    try {
      const returnUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      if (entitlement.productId) {
        const session = await ApiEntitlementRepository.createCheckoutSession(
          entitlement.productId,
          returnUrl,
        );
        if (session.checkoutUrl && typeof window !== "undefined") {
          window.location.assign(session.checkoutUrl);
          return;
        }
      }
      if (typeof window !== "undefined") {
        window.open(ENV.marketplaceDashboardUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setIsCheckoutLoading(false);
    }
  }, [entitlement.productId]);

  const canAccessNode = useCallback(
    (nodeIndex: number) => nodeIndex === 0 || entitlement.hasAccess,
    [entitlement.hasAccess],
  );

  return {
    entitlement,
    isLoading,
    hasFullAccess: entitlement.hasAccess,
    canAccessNode,
    refreshEntitlement,
    startDirectCheckout,
    isCheckoutLoading,
  };
}

