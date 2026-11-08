import React, { useState } from "react";
import { Lock, Sparkles, ExternalLink, RefreshCw, ShieldAlert, Tag } from "lucide-react";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import { ProductEntitlement } from "../../../domain/entities/ProductEntitlement";
import { ENV } from "../../../shared/constants/env";

export interface LinguaMarketplacePaywallModalProps {
  isOpen: boolean; entitlement: ProductEntitlement; featureName?: string | undefined;
  isCheckoutLoading?: boolean | undefined; isRefreshing?: boolean | undefined;
  onClose: () => void; onCheckout: (couponCode?: string) => void; onRefreshEntitlement?: (() => void) | undefined;
}

const INCLUDED_CAPABILITIES = [
  "Ruta estructurada completa (A1 a C1) con voz neural en vivo",
  "Práctica conversacional con CELAEST IA Mesh o BYOK ilimitado",
  "Laboratorio fonético IPA, escritura asistida y bóveda léxica",
];

export const LinguaMarketplacePaywallModal: React.FC<LinguaMarketplacePaywallModalProps> = ({
  isOpen, entitlement, featureName, isCheckoutLoading = false, isRefreshing = false, onClose, onCheckout, onRefreshEntitlement,
}) => {
  const [coupon, setCoupon] = useState("");
  const isExpired = entitlement.status === "expired";
  const isRevoked = entitlement.status === "revoked" || entitlement.status === "suspended" || entitlement.status === "cancelled";
  const statusLabel = isRevoked ? "Licencia revocada o suspendida" : isExpired ? "Suscripción vencida" : "Licencia CELAEST Marketplace";
  const titleText = isRevoked ? "Acceso Restringido" : isExpired ? "Tu Licencia ha Expirado" : (featureName ? `Desbloquea ${featureName}` : `Desbloquea ${entitlement.productName || "Lingua Completo"}`);
  const desc = isRevoked
    ? "Tu licencia fue revocada o suspendida. Reactívala o adquiere una nueva en CELAEST Marketplace para continuar."
    : isExpired
      ? `Tu periodo de acceso finalizó${entitlement.expiresAt ? ` el ${new Date(entitlement.expiresAt).toLocaleDateString()}` : ""}. Renueva para retomar tu progreso.`
      : featureName ? `Activa tu licencia para desbloquear ${featureName} y todas las herramientas avanzadas.` : "Completaste la Base 01 de prueba. Adquiere tu licencia para desbloquear todas las bases y módulos.";

  const hasCoupon = coupon.trim().length > 0;
  const btnText = isCheckoutLoading ? (hasCoupon ? "Canjeando cupón..." : "Conectando...") : hasCoupon ? "Canjear cupón y desbloquear" : isExpired || isRevoked ? "Renovar Acceso Ahora" : "Desbloquear Acceso Ahora";

  const footerNode = (
    <div className="flex flex-col gap-2.5">
      <button
        type="button" disabled={isCheckoutLoading} onClick={() => onCheckout(coupon.trim() || undefined)}
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-button-glow)" }}
        className="w-full h-10 rounded-xl text-[var(--text-primary)] font-medium text-xs tracking-wide flex items-center justify-center gap-2 transition-opacity hover:opacity-95 cursor-pointer disabled:opacity-50"
      >
        <Sparkles className="w-3.5 h-3.5 text-[var(--text-accent)]" />
        <span>{btnText}</span>
      </button>
      <div className="flex items-center justify-between px-1 pt-0.5 text-[11px] font-mono text-[var(--text-secondary)]">
        <a href={ENV.marketplaceDashboardUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
          <span>Abrir Marketplace</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        {onRefreshEntitlement && (
          <button type="button" disabled={isRefreshing} onClick={onRefreshEntitlement} className="inline-flex items-center gap-1.5 text-[var(--text-accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50">
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Verificando..." : "Ya tengo licencia · Verificar"}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AppModal isOpen={isOpen} onClose={onClose} size="sm" icon={isRevoked ? <ShieldAlert className="w-4 h-4 text-[var(--status-danger)]" /> : <Lock className="w-4 h-4" />} title={titleText} subtitle={statusLabel} footer={footerNode}>
      <div className="space-y-3.5 select-none">
        <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] font-light leading-relaxed">{desc}</p>
        <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--surface-1)]/70 divide-y divide-white/[0.05] px-4 py-1">
          {INCLUDED_CAPABILITIES.map((item) => (
            <div key={item} className="py-2.5 flex items-center gap-2.5 text-xs text-[var(--text-primary)]/85 font-light">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-violet-400)] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-0)]/80 px-3 py-2">
          <Tag className="w-3.5 h-3.5 text-[var(--accent-violet-400)] shrink-0" />
          <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="¿Tienes un cupón? (ej. PROMO100)" className="bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] font-mono outline-none flex-1 uppercase tracking-wider" />
          {coupon && (<button type="button" onClick={() => setCoupon("")} className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer">Limpiar</button>)}
        </div>
        <div className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--surface-0)]/80 px-4 py-2.5">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--text-secondary)]">{isExpired || isRevoked ? "Renovación mensual" : "Licencia mensual"}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-medium tracking-tight text-[var(--text-primary)]">${entitlement.basePrice.toFixed(2)}</span>
            <span className="text-[11px] font-mono text-[var(--text-tertiary)]">{entitlement.currency}</span>
          </div>
        </div>
      </div>
    </AppModal>
  );
};
