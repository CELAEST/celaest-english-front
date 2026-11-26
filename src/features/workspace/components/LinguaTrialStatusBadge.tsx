import React from "react";
import { Sparkles } from "lucide-react";

interface LinguaTrialStatusBadgeProps {
  daysRemaining: number | null;
  requestsUsed?: number | undefined;
  requestsLimit?: number | undefined;
  onUpgradeClick: () => void;
}

export const LinguaTrialStatusBadge: React.FC<LinguaTrialStatusBadgeProps> = ({
  daysRemaining,
  requestsUsed,
  requestsLimit,
  onUpgradeClick,
}) => {
  const daysLabel =
    daysRemaining !== null
      ? `${daysRemaining} ${daysRemaining === 1 ? "día restante" : "días restantes"}`
      : "Prueba activa";
  const quotaLabel =
    typeof requestsLimit === "number" && requestsLimit > 0
      ? ` · ${requestsUsed ?? 0}/${requestsLimit} IA`
      : "";

  return (
    <button
      type="button"
      onClick={onUpgradeClick}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-primary)",
      }}
      title="Prueba gratuita WELCOME activa — clic para desbloquear acceso definitivo"
    >
      <Sparkles className="w-3.5 h-3.5" style={{ color: "var(--accent-violet-500)" }} />
      <span>Trial WELCOME: {daysLabel}{quotaLabel}</span>
    </button>
  );
};
