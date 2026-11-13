import { useCallback } from "react";
import { useAiUseCaseModals } from "../../../shared/hooks/useAiUseCaseModals";

/**
 * Coordinates all 6 AI failure / entitlement / BYOK / Trial modals for live
 * Pathway AI calls with automatic pending retry and orphan message cleanup.
 */
export function usePathwayAiModals() {
  const controller = useAiUseCaseModals("pathway");

  const handleAiFailure = useCallback(
    (err: unknown, retryFn: () => void, previewText?: string, onDismiss?: () => void) => {
      void controller.handleAiFailure(err, retryFn, {
        featureName: "Prof. Liam IA",
        ...(previewText ? { bufferDetail: { previewText } } : {}),
        ...(onDismiss ? { onDismiss } : {}),
      });
    },
    [controller],
  );

  return {
    controller,
    byokOpen: controller.byokOpen,
    byokMode: controller.byokMode,
    paywallOpen: controller.paywallOpen,
    openPaywallModal: controller.openPaywallModal,
    closePaywall: controller.closePaywall,
    openByokModal: controller.openByokModal,
    recoveryState: controller.recovery,
    handleAiFailure,
  };
}
