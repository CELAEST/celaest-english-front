import { useCallback, useRef, useState } from "react";
import { ERROR_DATA, ErrorScenarioData } from "../../../shared/constants/errorScenarios";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";

export interface PathwayAiRecoveryState {
  isOpen: boolean;
  scenario: ErrorScenarioData;
  cooldown: number;
  previewText?: string | undefined;
}

const DEFAULT_RECOVERY: PathwayAiRecoveryState = {
  isOpen: false,
  scenario: ERROR_DATA["keys-exhausted-pool"],
  cooldown: 0,
};

/**
 * Coordinates BYOK and Infrastructure Recovery modals for live Pathway AI calls
 * (Ask Professor QA and AI Curriculum Personalization) with automatic pending retry.
 */
export function usePathwayAiModals() {
  const [byokOpen, setByokOpen] = useState(false);
  const [recoveryState, setRecoveryState] = useState<PathwayAiRecoveryState>(DEFAULT_RECOVERY);
  const pendingRetryRef = useRef<(() => void) | null>(null);

  const handleAiFailure = useCallback(
    (err: unknown, retryFn: () => void, previewText?: string) => {
      pendingRetryRef.current = retryFn;
      const errCode = String((err as { code?: string })?.code || "");
      const errMsg = String((err as { message?: string })?.message || err || "").toLowerCase();

      if (
        errCode === "BYOK_REQUIRED" ||
        errMsg.includes("byok_required") ||
        errMsg.includes("configura tu clave")
      ) {
        setByokOpen(true);
        return;
      }

      const { scenario, cooldownSeconds } = classifyAiError(err);
      setRecoveryState({
        isOpen: true,
        scenario,
        cooldown: cooldownSeconds,
        previewText,
      });
    },
    [],
  );

  const runPendingRetry = useCallback(() => {
    const retry = pendingRetryRef.current;
    pendingRetryRef.current = null;
    if (retry) retry();
  }, []);

  const handleByokConfigured = useCallback(() => {
    setByokOpen(false);
    runPendingRetry();
  }, [runPendingRetry]);

  const handleByokClose = useCallback(() => {
    setByokOpen(false);
    pendingRetryRef.current = null;
  }, []);

  const handleRecoveryClose = useCallback(() => {
    setRecoveryState((prev) => ({ ...prev, isOpen: false }));
    pendingRetryRef.current = null;
  }, []);

  const handleRecoveryResume = useCallback(() => {
    setRecoveryState((prev) => ({ ...prev, isOpen: false }));
    runPendingRetry();
  }, [runPendingRetry]);

  return {
    byokOpen,
    setByokOpen,
    recoveryState,
    handleAiFailure,
    handleByokConfigured,
    handleByokClose,
    handleRecoveryClose,
    handleRecoveryResume,
  };
}

