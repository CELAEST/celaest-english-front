import { useCallback, useEffect, useRef, useState } from "react";
import { ProductEntitlement } from "../../domain/entities/ProductEntitlement";
import { providerKeyVault } from "../../features/settings/services/providerKeyVault";
import { SupabaseAuthAdapter } from "../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { resolveProviderContextSafe } from "../../infrastructure/http/coreAiGatewayClient";
import { ErrorScenarioData } from "../constants/errorScenarios";
import { PROVIDER_KEYS_CHANGED_EVENT } from "../constants/storageEvents";
import { ByokModalMode, resolveAiModalUseCase } from "../services/aiUseCaseModalResolver";
import { useLinguaEntitlement } from "./useLinguaEntitlement";

export interface AiFailureBufferDetail { wordCount?: number | undefined; durationSeconds?: number | undefined; previewText?: string | undefined; }
export interface AiFailureOptions { featureName?: string | undefined; bufferDetail?: AiFailureBufferDetail | undefined; onDismiss?: (() => void) | undefined; }
export interface AiRecoveryModalState {
  isOpen: boolean;
  scenario: ErrorScenarioData | null;
  cooldown: number;
  cloudManaged?: boolean | undefined;
  bufferDetail?: AiFailureBufferDetail | undefined;
}

export function useAiUseCaseModals(contextType: "writing" | "reading" | "speaking" | "pathway" | "general" = "general") {
  const { entitlement, isLoading: isEntitlementLoading, canAccessNode, isByokMode, refreshEntitlement, startDirectCheckout, isCheckoutLoading } = useLinguaEntitlement();
  const [byokOpen, setByokOpen] = useState(false);
  const [byokMode, setByokMode] = useState<ByokModalMode>("promo_byok");
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallEntitlement, setPaywallEntitlement] = useState<ProductEntitlement | null>(null);
  const [paywallFeature, setPaywallFeature] = useState<string | undefined>(undefined);
  const [isRefreshingPaywall, setIsRefreshingPaywall] = useState(false);
  const [recovery, setRecovery] = useState<AiRecoveryModalState>({ isOpen: false, scenario: null, cooldown: 0 });
  const retryRef = useRef<(() => void | Promise<void>) | null>(null);
  const dismissRef = useRef<(() => void) | null>(null);
  const lastAutoRetryAtRef = useRef<number>(0);
  const byokOpenRef = useRef(byokOpen);
  byokOpenRef.current = byokOpen;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKeysChanged = () => {
      if (!byokOpenRef.current) return;
      void Promise.resolve(providerKeyVault.hasAnyConfiguredKey?.())
        .then((hasKey) => {
          if (hasKey && byokOpenRef.current) {
            dismissRef.current = null;
            setByokOpen(false);
            const fn = retryRef.current;
            retryRef.current = null;
            if (fn) void fn();
          }
        })
        .catch(() => {});
    };
    window.addEventListener(PROVIDER_KEYS_CHANGED_EVENT, handleKeysChanged);
    return () => {
      window.removeEventListener(PROVIDER_KEYS_CHANGED_EVENT, handleKeysChanged);
    };
  }, []);

  const runDismissIfPending = useCallback(() => {
    const fn = dismissRef.current; dismissRef.current = null; retryRef.current = null; fn?.();
  }, []);

  const handleAiFailure = useCallback(async (err: unknown, retryFn?: () => void | Promise<void>, opts?: AiFailureOptions) => {
    retryRef.current = retryFn ?? null; dismissRef.current = opts?.onDismiss ?? null;
    const isAuthenticated = SupabaseAuthAdapter.getInstance().isAuthenticated();
    const { hasAnyKey } = await resolveProviderContextSafe();
    const action = resolveAiModalUseCase(err, { entitlement, hasAnyKey, isAuthenticated, isByokMode });
    if (action.kind === "paywall") { setPaywallEntitlement(action.entitlement ?? entitlement); setPaywallFeature(opts?.featureName); setPaywallOpen(true); return action; }
    if (action.kind === "byok_setup") { setByokMode(action.mode); setByokOpen(true); return action; }

    // For entitled Cloud subscribers encountering a rare transient burst, try 1 invisible
    // auto-recovery retry before ever surfacing an interruption modal.
    const isTransientCloudBurst =
      action.kind === "infra_recovery" &&
      action.cloudManaged &&
      Boolean(retryFn) &&
      (action.scenario.id === "rate-limit-429" ||
        action.scenario.id === "gateway-timeout-504" ||
        action.scenario.id === "server-outage-503");

    if (isTransientCloudBurst && retryFn) {
      const now = Date.now();
      if (now - lastAutoRetryAtRef.current > 20_000) {
        lastAutoRetryAtRef.current = now;
        await new Promise((resolve) => setTimeout(resolve, 1200));
        void retryFn();
        return action;
      }
    }

    setRecovery({
      isOpen: true,
      scenario: action.scenario,
      cooldown: action.cooldownSeconds,
      cloudManaged: action.kind === "infra_recovery" ? action.cloudManaged : undefined,
      bufferDetail: opts?.bufferDetail,
    });
    return action;
  }, [entitlement, isByokMode]);

  const openByokModal = useCallback((mode?: ByokModalMode) => { setByokMode(mode ?? (isByokMode ? "promo_byok" : "trial_choice")); setByokOpen(true); }, [isByokMode]);
  const openPaywallModal = useCallback((featureName?: string) => { setPaywallEntitlement(entitlement); setPaywallFeature(featureName); setPaywallOpen(true); }, [entitlement]);

  const handleByokConfigured = useCallback(() => {
    dismissRef.current = null; setByokOpen(false);
    const fn = retryRef.current; retryRef.current = null; if (fn) void fn();
  }, []);

  const handleOpenPaywallFromByok = useCallback(() => {
    dismissRef.current = null; setByokOpen(false); setPaywallEntitlement(entitlement); setPaywallOpen(true);
  }, [entitlement]);

  const handleRefreshPaywall = useCallback(async () => {
    setIsRefreshingPaywall(true);
    try {
      const next = await refreshEntitlement();
      const { hasAnyKey } = await resolveProviderContextSafe();
      if (next.hasAccess && (next.aiCloudIncluded || hasAnyKey)) {
        dismissRef.current = null; setPaywallOpen(false);
        const fn = retryRef.current; retryRef.current = null; if (fn) void fn();
      } else if (next.hasAccess && !next.aiCloudIncluded && !hasAnyKey) {
        dismissRef.current = null; setPaywallOpen(false); setByokMode("promo_byok"); setByokOpen(true);
      }
    } finally { setIsRefreshingPaywall(false); }
  }, [refreshEntitlement]);

  const handleRecoveryResume = useCallback(() => {
    dismissRef.current = null; setRecovery((s) => ({ ...s, isOpen: false }));
    const fn = retryRef.current; retryRef.current = null; if (fn) void fn();
  }, []);

  const handleReauth = useCallback(() => {
    dismissRef.current = null; retryRef.current = null; setRecovery((s) => ({ ...s, isOpen: false }));
    if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("celaest:unauthorized"));
  }, []);

  const closeByok = useCallback(() => {
    setByokOpen(false);
    runDismissIfPending();
  }, [runDismissIfPending]);

  const closePaywall = useCallback(() => {
    setPaywallOpen(false);
    runDismissIfPending();
  }, [runDismissIfPending]);

  const closeRecovery = useCallback(() => {
    setRecovery((s) => ({ ...s, isOpen: false }));
    runDismissIfPending();
  }, [runDismissIfPending]);

  return {
    contextType, entitlement, isEntitlementLoading, canAccessNode, refreshEntitlement, isByokMode, isCheckoutLoading, startDirectCheckout, isRefreshingPaywall,
    byokOpen, byokMode, paywallOpen, paywallEntitlement: paywallEntitlement ?? entitlement, paywallFeature, recovery,
    openByokModal, openPaywallModal, handleAiFailure, handleRefreshPaywall,
    closeByok, closePaywall, closeRecovery,
    handleByokConfigured, handleOpenPaywallFromByok, handleRecoveryResume, handleReauth,
  };
}
export type AiUseCaseModalsController = ReturnType<typeof useAiUseCaseModals>;
