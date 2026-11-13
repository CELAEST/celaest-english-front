import React from "react";
import { AiInfrastructureRecoveryModal } from "../../features/lab/components/AiInfrastructureRecoveryModal";
import { LinguaByokRequiredModal } from "../../features/workspace/components/LinguaByokRequiredModal";
import { LinguaMarketplacePaywallModal } from "../../features/workspace/components/LinguaMarketplacePaywallModal";
import { AiUseCaseModalsController } from "../hooks/useAiUseCaseModals";

export interface AiUseCaseModalsHostProps {
  controller: AiUseCaseModalsController;
}

/**
 * Shared portal host rendering the exact recovery, BYOK/Trial, or Marketplace
 * Paywall modal resolved for any AI failure across Lingua practice views.
 */
export const AiUseCaseModalsHost: React.FC<AiUseCaseModalsHostProps> = ({
  controller,
}) => {
  return (
    <>
      <LinguaByokRequiredModal
        isOpen={controller.byokOpen}
        mode={controller.byokMode}
        onClose={controller.closeByok}
        onConfigured={controller.handleByokConfigured}
        onOpenPaywall={controller.handleOpenPaywallFromByok}
      />

      <LinguaMarketplacePaywallModal
        isOpen={controller.paywallOpen}
        entitlement={controller.paywallEntitlement}
        featureName={controller.paywallFeature}
        isCheckoutLoading={controller.isCheckoutLoading}
        isRefreshing={controller.isRefreshingPaywall}
        onClose={controller.closePaywall}
        onCheckout={controller.startDirectCheckout}
        onRefreshEntitlement={() => void controller.handleRefreshPaywall()}
      />

      {controller.recovery.isOpen && controller.recovery.scenario && (
        <AiInfrastructureRecoveryModal
          isOpen={controller.recovery.isOpen}
          scenario={controller.recovery.scenario}
          cooldown={controller.recovery.cooldown}
          onClose={controller.closeRecovery}
          onImmediateResume={controller.handleRecoveryResume}
          onReauth={controller.handleReauth}
          contextType={controller.contextType}
          bufferDetail={controller.recovery.bufferDetail}
        />
      )}
    </>
  );
};

