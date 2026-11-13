import React, { useState } from "react";
import { KeyRound, Sparkles, ExternalLink } from "lucide-react";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { AiProviderId } from "../../../domain/entities/AiProvider";

export interface LinguaByokRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigured?: () => void;
  mode?: "promo_byok" | "trial_choice";
  onOpenPaywall?: () => void;
}

export const LinguaByokRequiredModal: React.FC<LinguaByokRequiredModalProps> = ({
  isOpen,
  onClose,
  onConfigured,
  mode = "promo_byok",
  onOpenPaywall,
}) => {
  const [provider, setProvider] = useState<AiProviderId>("groq");
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!key.trim()) { setError("Ingresa una API Key válida"); return; }
    setSaving(true); setError(null);
    try {
      await providerKeyVault.saveKey(provider, key.trim());
      await providerKeyVault.saveActiveProviderId(provider);
      await providerKeyVault.setCentralCoreEnabled(false);
      onConfigured?.();
      onClose();
    } catch {
      setError("No se pudo guardar la clave");
    } finally {
      setSaving(false);
    }
  };

  const portalUrl = provider === "groq" ? "https://console.groq.com/keys" : "https://aistudio.google.com/app/apikey";
  const placeholder = provider === "groq" ? "gsk_..." : "AIzaSy...";

  const footerNode = (
    <div className="flex flex-col gap-2">
      {error && <span className="text-[11px] text-[var(--status-danger)] font-mono">{error}</span>}
      <button
        type="button" disabled={saving || !key.trim()} onClick={() => void handleSave()}
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-button-glow)" }}
        className="w-full h-10 rounded-xl text-[var(--text-primary)] font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-opacity hover:opacity-95 cursor-pointer disabled:opacity-50"
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)]" />
        <span>{saving ? "Guardando..." : "Guardar y Activar IA"}</span>
      </button>
      <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors pt-1">
        <span>Obtener API Key gratuita de {provider === "groq" ? "Groq" : "Google Gemini"}</span>
        <ExternalLink className="w-3 h-3" />
      </a>
      {mode === "trial_choice" && onOpenPaywall && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenPaywall();
          }}
          className="w-full h-9 mt-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-2)] text-[var(--text-primary)] text-xs font-medium hover:border-[var(--border-hover)] transition-colors cursor-pointer"
        >
          Ver Planes Lingua Pro (IA Cloud incluida)
        </button>
      )}
    </div>
  );

  const isTrialChoice = mode === "trial_choice";
  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      icon={<KeyRound className="w-4 h-4 text-[var(--text-accent)]" />}
      title="Motor de IA (Modo BYOK)"
      subtitle={isTrialChoice ? "Prueba Gratuita (Base 01)" : "Licencia Promocional Activa"}
      footer={footerNode}
    >
      <div className="space-y-3.5 select-none text-xs">
        <p className="text-[var(--text-secondary)] font-light leading-relaxed">
          {isTrialChoice
            ? "Estás en la prueba gratuita. Conecta tu clave gratuita de Groq o Google Gemini para usar el tutor de IA sin costo adicional, o activa Lingua Pro con IA Cloud incluida."
            : "Tu cupón incluye acceso a todo el contenido. Para generar respuestas de IA sin costo adicional, ingresa tu clave gratuita."}
        </p>
        <div className="flex gap-2">
          {(["groq", "gemini"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setProvider(p)} className={`flex-1 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer ${provider === p ? "border-[var(--accent-violet-400)] bg-[var(--surface-2)] text-[var(--text-primary)]" : "border-[var(--glass-border)] bg-[var(--surface-0)] text-[var(--text-secondary)] hover:bg-[var(--surface-1)]"}`}>
              {p === "groq" ? "Groq (Recomendado)" : "Google Gemini"}
            </button>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-0)]/80 px-3 py-2">
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] font-mono outline-none" />
        </div>
      </div>
    </AppModal>
  );
};
