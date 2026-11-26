import React, { useState } from "react";
import { KeyRound, Sparkles, ExternalLink } from "lucide-react";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { AiProviderId } from "../../../domain/entities/AiProvider";

export interface LinguaByokRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured?: () => void;
  mode?: "promo_byok" | "trial_choice" | "quota_exceeded" | "recovery_byok";
  isTrial?: boolean;
  aiRequestsLimit?: number | undefined;
  onOpenPaywall?: () => void;
}

export const LinguaByokRequiredModal: React.FC<LinguaByokRequiredModalProps> = ({
  isOpen,
  onClose,
  onConfigured,
  mode = "promo_byok",
  isTrial = false,
  aiRequestsLimit,
  onOpenPaywall,
}) => {
  const provider: AiProviderId = "groq";
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKeyChange = (val: string) => {
    setKey(val);
    if (error) setError(null);
  };

  const handleSave = async () => {
    const cleanKey = key.trim();
    if (!cleanKey) { setError("Ingresa una API Key válida de Groq"); return; }
    setSaving(true); setError(null);
    try {
      await providerKeyVault.saveKey(provider, cleanKey);
      await providerKeyVault.saveActiveProviderId(provider);
      await providerKeyVault.setCentralCoreEnabled(false);
      setKey("");
      onConfigured?.();
      onClose();
    } catch {
      setError("No se pudo guardar la clave");
    } finally {
      setSaving(false);
    }
  };

  const portalUrl = "https://console.groq.com/keys";
  const placeholder = "gsk_...";

  const footerNode = (
    <div className="flex flex-col gap-2">
      {error && <span className="text-[11px] text-[var(--status-danger)] font-mono">{error}</span>}
      <button
        type="button" disabled={saving || !key.trim()} onClick={() => void handleSave()}
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-button-glow)" }}
        className="w-full h-10 rounded-xl text-[var(--text-primary)] font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-opacity hover:opacity-95 cursor-pointer disabled:opacity-50"
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)]" />
        <span>{saving ? "Guardando..." : "Guardar y Activar Groq"}</span>
      </button>
      <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pt-1">
        <span>Obtener API Key gratuita de Groq</span>
        <ExternalLink className="w-3 h-3" />
      </a>
      {(mode === "trial_choice" || mode === "quota_exceeded") && onOpenPaywall && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPaywall();
          }}
          className="w-full h-9 mt-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-primary)] text-xs font-medium hover:border-[var(--border-hover)] transition-colors cursor-pointer"
        >
          {mode === "quota_exceeded"
            ? "Ver Planes / Ampliar Cuota Cloud"
            : "Ver Planes Lingua Pro (IA Cloud incluida)"}
        </button>
      )}
    </div>
  );

  const isTrialChoice = mode === "trial_choice";
  const isQuotaExceeded = mode === "quota_exceeded";
  const trialLimit = typeof aiRequestsLimit === "number" && aiRequestsLimit > 0 ? aiRequestsLimit : 200;
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      icon={<KeyRound className="w-4 h-4 text-[var(--text-accent)]" />}
      title={
        isQuotaExceeded
          ? isTrial
            ? "Cuota de Prueba IA Completada"
            : "Cuota Mensual Completada"
          : "Motor Groq (Modo BYOK)"
      }
      subtitle={
        isQuotaExceeded
          ? isTrial
            ? `Completaste las ${trialLimit} peticiones IA de tu trial WELCOME`
            : "Límite mensual de IA Cloud alcanzado"
          : isTrialChoice
            ? "Prueba Gratuita (Base 01)"
            : "Licencia Promocional Activa"
      }
      footer={footerNode}
    >
      <div className="space-y-3.5 select-none text-xs">
        <p className="text-[var(--text-secondary)] font-light leading-relaxed">
          {isQuotaExceeded
            ? isTrial
              ? `Has usado las ${trialLimit} respuestas en la nube incluidas en tu prueba gratuita de 15 días. Conecta tu clave gratuita de Groq para continuar sin límites de inmediato, o activa Lingua Pro.`
              : "Alcanzaste el límite mensual de respuestas en la nube de tu plan. Conecta tu clave gratuita de Groq para continuar sin límites de inmediato, o revisa los planes disponibles."
            : isTrialChoice
              ? "Estás en la prueba gratuita. Conecta tu clave gratuita de Groq para usar el tutor de IA sin costo adicional, o activa Lingua Pro con IA Cloud incluida."
              : "Tu cupón incluye acceso a todo el contenido. Para generar respuestas de IA sin costo adicional, ingresa tu clave gratuita de Groq."}
        </p>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--accent-violet-400)] bg-[var(--surface-2)] text-xs font-mono text-[var(--text-primary)]">
          <span>Groq · Motor Oficial</span>
          <span className="text-[10px] text-[var(--text-accent)] uppercase">100% Gratis</span>
        </div>
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-0)]/80 px-3 py-2">
          <input type="password" value={key} onChange={(e) => handleKeyChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] font-mono outline-none" />
        </div>
      </div>
    </AppModal>
  );
};
