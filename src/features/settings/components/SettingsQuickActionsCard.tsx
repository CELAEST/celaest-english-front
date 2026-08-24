import React, { useState } from "react";
import { Check } from "lucide-react";
import { vaultMaintenance } from "../services/vaultMaintenance";
import { ExportVaultIcon, PurgeVaultIcon } from "./SettingsBespokeIcons";

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
        ? "border-[#2a1215] bg-gradient-to-b from-[#170a0d]/80 to-[#100609]/50 hover:border-[#ef4444]/45 hover:shadow-[0_10px_28px_rgba(239,68,68,0.13)]"
        : "border-white/[0.06] bg-white/[0.03] hover:border-[#A27FF3]/40 hover:bg-white/[0.05] hover:shadow-[0_10px_28px_rgba(112,72,232,0.14)]"
    }`}
  >
    <span
      className={`flex items-center gap-2 text-xs font-medium tracking-wide transition-colors duration-300 ${
        state === "done"
          ? "text-[#4ade80]"
          : danger
            ? "text-[#f0a2a2] group-hover:text-[#fca5a5]"
            : "text-[#b9b4cc] group-hover:text-[#f8f8f8]"
      }`}
    >
      {icon}
      {state === "done" ? "Done" : label}
      {state === "done" && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
    </span>
    <span
      className={`text-[10.5px] font-light leading-relaxed transition-colors duration-300 ${
        state === "done"
          ? "text-[#4ade80]/70"
          : "text-[#66667c] group-hover:text-[#8a8a9e]"
      }`}
    >
      {state === "done"
        ? "Completed successfully"
        : state === "working"
          ? "Working…"
          : hint}
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
      console.warn("Vault export failed", err);
    } finally {
      setTimeout(() => setExportState("idle"), 2500);
    }
  };

  const handlePurge = () => {
    const confirmed = window.confirm(
      "Purge the local encrypted vault? Your AI provider keys and stored learning data will be removed from this device. This cannot be undone."
    );
    if (!confirmed) return;
    setPurgeState("working");
    const purged = vaultMaintenance.purgeAll();
    window.dispatchEvent(new CustomEvent("celaest:vault-purged", { detail: { purged } }));
    setPurgeState("done");
    setTimeout(() => setPurgeState("idle"), 2500);
  };

  return (
    <div className="rounded-3xl border border-[#111220] bg-[#05060c] p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm sm:text-base font-medium text-[#f8f8f8] tracking-wide">
          Privacy &amp; Data
        </span>
        <span className="text-[10px] tracking-wider uppercase font-semibold text-[#A27FF3] drop-shadow-[0_0_8px_rgba(162,127,243,0.45)]">
          AES-GCM Vault
        </span>
      </div>

      {/* Actions Grid */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        <QuickActionBtn
          icon={
            <ExportVaultIcon className="w-5 h-5 text-[#A27FF3] drop-shadow-[0_0_6px_rgba(162,127,243,0.45)]" />
          }
          label="Export my data"
          hint="Download an encrypted copy of your vault."
          state={exportState}
          onClick={handleExport}
        />
        <QuickActionBtn
          icon={
            <PurgeVaultIcon className="w-5 h-5 text-[#f0a2a2] drop-shadow-[0_0_6px_rgba(239,68,68,0.35)]" />
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
