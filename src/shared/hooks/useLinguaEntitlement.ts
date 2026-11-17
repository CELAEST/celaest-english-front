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
const ENTITLEMENT_STALE_MS = 5 * 60 * 1000;
const ENTITLEMENT_ERROR_COOLDOWN_MS = 30 * 1000;

let cachedEntitlement: ProductEntitlement = DEFAULT_FREE_ENTITLEMENT;
let hasFetchedInitial = false;
let lastSyncedAt = 0;
let lastFailedAt = 0;
let inFlightSync: Promise<ProductEntitlement> | null = null;
let syncSeq = 0;
let subscriberCount = 0;
let teardownCoordinator: (() => void) | null = null;

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

async function syncLinguaEntitlement(options?: { force?: boolean }): Promise<ProductEntitlement> {
  const force = Boolean(options?.force);

  if (!SupabaseAuthAdapter.getInstance().isAuthenticated()) {
    lastSyncedAt = 0;
    lastFailedAt = 0;
    ApiEntitlementRepository.invalidateEntitlementCache("lingua");
    broadcastEntitlement(DEFAULT_FREE_ENTITLEMENT);
    await Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(false)).catch(() => {});
    return DEFAULT_FREE_ENTITLEMENT;
  }

  const now = Date.now();
  const isTestEnv = import.meta.env.MODE === "test";
  if (!force && !isTestEnv) {
    if (hasFetchedInitial && lastSyncedAt > 0 && now - lastSyncedAt < ENTITLEMENT_STALE_MS) {
      return cachedEntitlement;
    }
    if (lastFailedAt > 0 && now - lastFailedAt < ENTITLEMENT_ERROR_COOLDOWN_MS) {
      return cachedEntitlement;
    }
  }

  if (!force && inFlightSync) {
    return inFlightSync;
  }

  const syncToken = ++syncSeq;
  const runPromise = (async (): Promise<ProductEntitlement> => {
    try {
      const resolved = force
        ? await ApiEntitlementRepository.getEntitlement("lingua", { force: true })
        : await ApiEntitlementRepository.getEntitlement("lingua");
      if (syncSeq === syncToken) {
        inFlightSync = null;
      }
      lastSyncedAt = Date.now();
      lastFailedAt = 0;
      broadcastEntitlement(resolved);
      const isEligibleForCloud =
        resolved.hasAccess &&
        resolved.aiCloudIncluded &&
        resolved.status !== "expired" &&
        resolved.status !== "revoked" &&
        resolved.status !== "suspended" &&
        resolved.status !== "cancelled";
      void Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(isEligibleForCloud)).catch(() => {});
      return resolved;
    } catch {
      if (syncSeq === syncToken) {
        inFlightSync = null;
      }
      lastFailedAt = Date.now();
      broadcastEntitlement(DEFAULT_FREE_ENTITLEMENT);
      void Promise.resolve(providerKeyVault.setCentralCoreEnabled?.(false)).catch(() => {});
      return DEFAULT_FREE_ENTITLEMENT;
    }
  })();

  inFlightSync = runPromise;
  return await runPromise;
}

function retainCoordinator(): () => void {
  subscriberCount++;
  if (subscriberCount === 1 && typeof window !== "undefined") {
    const handleAuthChanged = () => {
      lastSyncedAt = 0;
      lastFailedAt = 0;
      ApiEntitlementRepository.invalidateEntitlementCache("lingua");
      if (SupabaseAuthAdapter.getInstance().isAuthenticated()) {
        void syncLinguaEntitlement({ force: true });
      } else {
        void syncLinguaEntitlement();
      }
    };
    const handleFocus = () => {
      if (
        document.visibilityState === "visible" &&
        SupabaseAuthAdapter.getInstance().isAuthenticated()
      ) {
        void syncLinguaEntitlement();
      }
    };
    const intervalId = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        SupabaseAuthAdapter.getInstance().isAuthenticated()
      ) {
        void syncLinguaEntitlement();
      }
    }, ENTITLEMENT_STALE_MS);

    window.addEventListener("celaest:auth-changed", handleAuthChanged);
    window.addEventListener("focus", handleFocus);
    teardownCoordinator = () => {
      window.clearInterval(intervalId);
      window.removeEventListener("celaest:auth-changed", handleAuthChanged);
      window.removeEventListener("focus", handleFocus);
      teardownCoordinator = null;
    };
  }

  return () => {
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount === 0 && teardownCoordinator) {
      teardownCoordinator();
    }
  };
}

export function useLinguaEntitlement() {
  const [entitlement, setEntitlement] = useState<ProductEntitlement>(
    cachedEntitlement,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!hasFetchedInitial);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  const refreshEntitlement = useCallback(async (force = true) => {
    if (!hasFetchedInitial) setIsLoading(true);
    try {
      const resolved = await syncLinguaEntitlement({ force });
      setEntitlement(resolved);
      return resolved;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      let checkoutReturned = false;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        if (sessionId) {
          checkoutReturned = true;
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
      const resolved = await syncLinguaEntitlement({ force: checkoutReturned });
      if (active) {
        setEntitlement(resolved);
        setIsLoading(false);
      }
    };
    void init();

    const handleSynced = (e: Event) => {
      const custom = e as CustomEvent<ProductEntitlement>;
      if (active && custom.detail) {
        setEntitlement(custom.detail);
        setIsLoading(false);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener(ENTITLEMENT_SYNC_EVENT, handleSynced);
    }
    const releaseCoordinator = retainCoordinator();

    return () => {
      active = false;
      releaseCoordinator();
      if (typeof window !== "undefined") {
        window.removeEventListener(ENTITLEMENT_SYNC_EVENT, handleSynced);
      }
    };
  }, []);

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

