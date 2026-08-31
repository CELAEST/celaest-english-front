import React, { useState } from "react";
import { Check } from "lucide-react";
import { vaultMaintenance } from "../services/vaultMaintenance";
import { ExportVaultIcon, PurgeVaultIcon } from "./SettingsBespokeIcons";
import { logger } from "../../../shared/utils/logger";

type QuickActionState = "idle" | "working" | "done";

interface QuickActionBtnProps {
  icon: React.ReactNode;
  label: string;
  hint: string;
  state: QuickActionState;
  danger?: boolean;
  onClick: () => void;
}

const QuickActionBtn: React.FC<QuickActionBtnProps> = ({
  icon,
  label,
  hint,
  state,
  danger,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-busy={state === "working"}
    className={`group relative flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-2xl border text-left transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ${
      danger
        ? "border-rose-900/30 bg-rose-950/20 hover:border-rose-500/40 hover:bg-rose-950/30"
        : "border-white/[0.06] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
    }`}
  >
    <span
      className={`flex items-center gap-2 text-xs font-medium tracking-wide transition-colors duration-300 ${
        state === "done"
          ? "text-emerald-400"
          : danger
            ? "text-rose-400/80 group-hover:text-rose-400"
            : "text-white/70 group-hover:text-white"
      }`}
    >
      {icon}
      {state === "done" ? "Done" : label}
      {state === "done" && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
    </span>
    <span
      className={`text-[10.5px] font-mono leading-relaxed transition-colors duration-300 ${
        state === "done" ? "text-emerald-400/70" : "text-white/30 group-hover:text-white/50"
      }`}
    >
      {state === "done" ? "Completed successfully" : state === "working" ? "Working…" : hint}
    </span>
  </button>
);

export const SettingsQuickActionsCard: React.FC = () => {
  const [exportState, setExportState] = useState<QuickActionState>("idle");
  const [purgeState, setPurgeState] = useState<QuickActionState>("idle");

  const handleExport = async () => {
    setExportState("working");
    try {
      const data = await vaultMaintenance.exportAll();
      vaultMaintenance.downloadExport(data);
      setExportState("done");
    } catch (err) {
      logger.warn("Vault export failed", err);
    } finally {
      setTimeout(() => setExportState("idle"), 2500);
    }
  };

  const handlePurge = () => {
    const confirmed = window.confirm(
      "Purge the local encrypted vault? Your AI provider keys and stored learning data will be removed from this device. This cannot be undone.",
    );
    if (!confirmed) return;
    setPurgeState("working");
    const purged = vaultMaintenance.purgeAll();
    window.dispatchEvent(new CustomEvent("celaest:vault-purged", { detail: { purged } }));
    setPurgeState("done");
    setTimeout(() => setPurgeState("idle"), 2500);
  };

  return (
    <div className="relative rounded-3xl border border-white/[0.07] hover:border-white/[0.12] bg-[#04040A] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-300">
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between z-10 relative">
        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          Privacy &amp; Data
        </span>
        <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
          AES-GCM Vault
        </span>
      </div>

      {/* Actions Grid */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 z-10 relative">
        <QuickActionBtn
          icon={
            <ExportVaultIcon className="w-4 h-4 text-white/50 group-hover:text-white" />
          }
          label="Export my data"
          hint="Download an encrypted copy of your vault."
          state={exportState}
          onClick={handleExport}
        />
        <QuickActionBtn
          icon={
            <PurgeVaultIcon className="w-4 h-4 text-rose-400/70" />
          }
          label="Purge vault"
          hint="Erase all local data from this device."
          state={purgeState}
          danger
          onClick={handlePurge}
        />
      </div>
    </div>
  );
};
