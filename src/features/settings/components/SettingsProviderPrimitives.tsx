import React from "react";
import { Check, Loader2, Zap } from "lucide-react";

export interface SettingsProviderTestResultView {
  ok: boolean;
  latencyMs: number | null;
  message: string;
}

interface SettingsProviderStatusChipProps {
  status: string;
}

const STATUS_META: Record<
  string,
  { label: string; text: string; live?: boolean }
> = {
  active: {
    label: "Active",
    text: "text-[#4ade80]",
    live: true,
  },
  configured: {
    label: "Ready",
    text: "text-[#c4b5fd]",
    live: true,
  },
  available: {
    label: "Available",
    text: "text-[#999a9b]",
  },
  unreachable: {
    label: "Offline",
    text: "text-[#f5b04d]",
  },
};

export const SettingsProviderStatusChip: React.FC<
  SettingsProviderStatusChipProps
> = ({ status }) => {
  const meta = STATUS_META[status] ?? STATUS_META.available;
  return (
    <span
      className={`inline-flex items-center ${meta.text}`}
      aria-label={`Provider status: ${meta.label}`}
    >
      <span className="text-[10px] font-medium tracking-[0.18em] uppercase leading-none">
        {meta.label}
      </span>
    </span>
  );
};

export const SettingsProviderLatencyChip: React.FC<{
  latencyMs: number | null;
}> = ({ latencyMs }) => {
  if (latencyMs === null) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[#77778c]">
      <Zap className="w-3 h-3 text-[#A27FF3]/80" fill="currentColor" />
      <span className="text-[10.5px] font-mono leading-none">{latencyMs} ms</span>
    </span>
  );
};

export interface SettingsProviderTestButtonProps {
  onClick: () => void;
  isTesting: boolean;
  result: SettingsProviderTestResultView | null;
  disabled?: boolean;
}

export const SettingsProviderTestButton: React.FC<
  SettingsProviderTestButtonProps
> = ({ onClick, isTesting, result, disabled }) => (
  <div className="flex items-center gap-2.5 flex-wrap">
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isTesting}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-[#231956] bg-[#0a0817] text-xs text-[#c4b5fd] hover:border-[#A27FF3]/60 hover:text-white hover:shadow-[0_0_18px_rgba(112,72,232,0.2)] active:scale-[0.97] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
    >
      {isTesting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Zap className="w-3.5 h-3.5 text-[#A27FF3] transition-transform duration-300 group-hover:scale-110" />
      )}
      {isTesting ? "Testing…" : "Test connection"}
    </button>
    {result && (
      <span
        className={`inline-flex items-center gap-1.5 text-[10.5px] font-mono leading-none animate-[fadeIn_0.25s_ease-out_both] ${
          result.ok ? "text-[#4ade80]" : "text-[#f87171]"
        }`}
      >
        {result.ok ? (
          <Check className="w-3 h-3" strokeWidth={2.5} />
        ) : (
          <span className="w-[5px] h-[5px] rounded-full bg-current" />
        )}
        {result.message}
        {result.latencyMs !== null && ` · ${result.latencyMs} ms`}
      </span>
    )}
  </div>
);
