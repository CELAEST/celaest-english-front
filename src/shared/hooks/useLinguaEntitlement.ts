import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_FREE_ENTITLEMENT,
  ProductEntitlement,
} from "../../domain/entities/ProductEntitlement";
import { providerKeyVault } from "../../features/settings/services/providerKeyVault";
import { SupabaseAuthAdapter } from "../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../infrastructure/repositories/ApiEntitlementRepository";
import { ENV } from "../constants/env";

const ENTITLEMENT_SYNC_EVENT = "celaest:entitlement-synced";
let cachedEntitlement: ProductEntitlement = DEFAULT_FREE_ENTITLEMENT;
let hasFetchedInitial = false;

export function getCachedLinguaEntitlement(): ProductEntitlement {
  return cachedEntitlement;
}

function broadcastEntitlement(next: ProductEntitlement) {
  cachedEntitlement = next;
  hasFetchedInitial = true;
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<ProductEntitlement>(ENTITLEMENT_SYNC_EVENT, { detail: next }),
    );
  }
}

export function useLinguaEntitlement() {
  const [entitlement, setEntitlement] = useState<ProductEntitlement>(
    cachedEntitlement,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!hasFetchedInitial);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  const refreshEntitlement = useCallback(async () => {
    if (!SupabaseAuthAdapter.getInstance().isAuthenticated()) {
      broadcastEntitlement(DEFAULT_FREE_ENTITLEMENT);
      setEntitlement(DEFAULT_FREE_ENTITLEMENT);
      await Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(false)).catch(() => {});
      setIsLoading(false);
      return DEFAULT_FREE_ENTITLEMENT;
    }
    setIsLoading(true);
    try {
      const resolved = await ApiEntitlementRepository.getEntitlement("lingua");
      broadcastEntitlement(resolved);
      setEntitlement(resolved);
      const isEligibleForCloud =
        resolved.hasAccess &&
        resolved.aiCloudIncluded &&
        resolved.status !== "expired" &&
        resolved.status !== "revoked" &&
        resolved.status !== "suspended" &&
        resolved.status !== "cancelled";
      await Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(isEligibleForCloud)).catch(() => {});
      return resolved;
    } catch {
      broadcastEntitlement(DEFAULT_FREE_ENTITLEMENT);
      setEntitlement(DEFAULT_FREE_ENTITLEMENT);
      await Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(false)).catch(() => {});
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
    const handleSynced = (e: Event) => {
      const custom = e as CustomEvent<ProductEntitlement>;
      if (active && custom.detail) {
        setEntitlement(custom.detail);
        setIsLoading(false);
      }
    };
    const intervalId =
      typeof window !== "undefined"
        ? window.setInterval(() => {
            if (
              active &&
              document.visibilityState === "visible" &&
              SupabaseAuthAdapter.getInstance().isAuthenticated()
            ) {
              void refreshEntitlement();
            }
          }, 20000)
        : undefined;

    if (typeof window !== "undefined") {
      window.addEventListener("celaest:auth-changed", handleAuthOrFocus);
      window.addEventListener("focus", handleAuthOrFocus);
      window.addEventListener(ENTITLEMENT_SYNC_EVENT, handleSynced);
    }
    return () => {
      active = false;
      if (intervalId !== undefined) window.clearInterval(intervalId);
      if (typeof window !== "undefined") {
        window.removeEventListener("celaest:auth-changed", handleAuthOrFocus);
        window.removeEventListener("focus", handleAuthOrFocus);
        window.removeEventListener(ENTITLEMENT_SYNC_EVENT, handleSynced);
      }
    };
  }, [refreshEntitlement]);

  const startDirectCheckout = useCallback(
    async (couponCode?: string) => {
      setIsCheckoutLoading(true);
      try {
        const returnUrl =
          typeof window !== "undefined" ? window.location.origin : "";
        if (entitlement.productId) {
          const session = await ApiEntitlementRepository.createCheckoutSession(
            entitlement.productId,
            returnUrl,
            couponCode,
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
    },
    [entitlement.productId],
  );

  const canAccessNode = useCallback(
    (nodeIndex: number) => nodeIndex === 0 || entitlement.hasAccess,
    [entitlement.hasAccess],
  );

  return {
    entitlement,
    isLoading,
    hasFullAccess: entitlement.hasAccess,
    isByokMode: entitlement.hasAccess && !entitlement.aiCloudIncluded,
    canAccessNode,
    refreshEntitlement,
    startDirectCheckout,
    isCheckoutLoading,
  };
}

