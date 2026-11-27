import React from "react";
import { KeyRound, LogOut } from "lucide-react";
import { LinguaTrialStatusBadge } from "../../workspace/components/LinguaTrialStatusBadge";

interface LiveRobotTopBarProps {
  isTrial: boolean;
  trialDaysRemaining: number | null;
  aiRequestsUsed?: number | undefined;
  aiRequestsLimit?: number | undefined;
  isByokMode: boolean;
  onOpenPaywall: () => void;
  onOpenByok: () => void;
  onSignOut: () => void;
}

export const LiveRobotTopBar: React.FC<LiveRobotTopBarProps> = ({
  isTrial,
  trialDaysRemaining,
  aiRequestsUsed,
  aiRequestsLimit,
  isByokMode,
  onOpenPaywall,
  onOpenByok,
  onSignOut,
}) => (
  <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 select-none">
    <div className="inline-flex items-center gap-2.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: "var(--accent-violet-400)" }}
      />
      <span
        className="text-xs font-semibold tracking-[0.18em] uppercase font-mono"
        style={{ color: "var(--text-primary)" }}
      >
        CELAEST Lingua
      </span>
    </div>

    <div className="flex items-center gap-2">
      {isTrial && (
        <LinguaTrialStatusBadge
          daysRemaining={trialDaysRemaining}
          requestsUsed={aiRequestsUsed}
          requestsLimit={aiRequestsLimit}
          onUpgradeClick={onOpenPaywall}
        />
      )}
      {isByokMode && (
        <button
          type="button"
          onClick={onOpenByok}
          className="h-8 px-3 rounded-full text-xs font-mono inline-flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer"
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
          }}
          title="Configurar clave Groq BYOK"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Groq Key</span>
        </button>
      )}
      <button
        type="button"
        onClick={onSignOut}
        aria-label="Cerrar sesión"
        title="Cerrar sesión"
        className="h-8 w-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-90 cursor-pointer"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--glass-border)",
          color: "var(--text-secondary)",
        }}
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  </header>
);
