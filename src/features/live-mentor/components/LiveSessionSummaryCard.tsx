import React from "react";
import { ArrowRight, Sparkles, Volume2, X } from "lucide-react";
import { BilingualVoicePipeline } from "../services/bilingualVoicePipeline";
import { LiveSessionSummary } from "../types";

interface LiveSessionSummaryCardProps {
  summary: LiveSessionSummary;
  onDismiss: () => void;
  onRestart: () => void;
}

export const LiveSessionSummaryCard: React.FC<LiveSessionSummaryCardProps> = ({
  summary,
  onDismiss,
  onRestart,
}) => (
  <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-md">
    <div
      className="w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--glass-border-hover)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em]"
            style={{ color: "var(--text-accent)" }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resumen de tu charla</span>
          </span>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {summary.strength}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar resumen"
          className="p-1 rounded-lg transition-opacity hover:opacity-80 cursor-pointer"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        {summary.upgrades.map((item, idx) => (
          <div
            key={`${item.better}-${idx}`}
            className="rounded-xl p-3.5 space-y-1.5"
            style={{
              background: "var(--surface-0)",
              border: "1px solid var(--glass-border)",
            }}
          >
            {item.said && (
              <div className="text-[11px] line-through" style={{ color: "var(--text-tertiary)" }}>
                {item.said}
              </div>
            )}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.better}
              </span>
              <button
                type="button"
                onClick={() => void BilingualVoicePipeline.speakFluid(item.better)}
                aria-label="Escuchar pronunciación"
                className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-accent)",
                }}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {item.tip}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          onDismiss();
          onRestart();
        }}
        className="w-full h-11 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-95"
        style={{
          background: "var(--gradient-primary)",
          color: "var(--text-primary)",
        }}
      >
        <span>Seguir conversando</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
