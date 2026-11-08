import React from "react";
import { Lock, Sparkles, ExternalLink, X, CheckCircle2, RefreshCw } from "lucide-react";
import { ProductEntitlement } from "../../../domain/entities/ProductEntitlement";
import { ENV } from "../../../shared/constants/env";

export interface LinguaMarketplacePaywallModalProps {
  isOpen: boolean; entitlement: ProductEntitlement; isCheckoutLoading?: boolean | undefined;
  isRefreshing?: boolean | undefined; onClose: () => void; onCheckout: () => void;
  onRefreshEntitlement?: (() => void) | undefined;
}

const INCLUDED_BENEFITS = [
  "Pathway Estructurado Completo (A1 a C1) con Voz Neural",
  "Conversación IA en Vivo con CELAEST IA Mesh (Cero API Keys)",
  "Laboratorio Fonético IPA, Escritura y Bóveda Léxica",
];

export const LinguaMarketplacePaywallModal: React.FC<LinguaMarketplacePaywallModalProps> = ({
  isOpen, entitlement, isCheckoutLoading = false, isRefreshing = false, onClose, onCheckout, onRefreshEntitlement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#07070C] p-6 sm:p-7 text-white shadow-[0_32px_96px_rgba(0,0,0,0.95)]">
        <button type="button" onClick={onClose} aria-label="Cerrar modal" className="absolute top-4 right-4 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-[11px] font-mono uppercase tracking-wider mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>CELAEST Marketplace · Licencia Pro</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Desbloquea {entitlement.productName || "CELAEST Lingua AI"}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-white/60 leading-relaxed">
          Completaste la Base 01 de prueba. Adquiere tu licencia en el ecosistema CELAEST o activa tu Plan Corporativo para desbloquear todas las bases y créditos Cloud IA.
        </p>

        <div className="mt-5 space-y-2.5 border-y border-white/[0.07] py-4">
          {INCLUDED_BENEFITS.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-xs text-white/85">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-white/45">Acceso Completo</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-white">${entitlement.basePrice.toFixed(2)}</span>
            <span className="text-xs text-white/45 font-mono">{entitlement.currency}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button type="button" disabled={isCheckoutLoading} onClick={onCheckout} className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50">
            <Sparkles className="w-4 h-4" />
            <span>{isCheckoutLoading ? "Conectando con Stripe..." : "Desbloquear Acceso Ahora"}</span>
          </button>
          <a href={ENV.marketplaceDashboardUrl} target="_blank" rel="noopener noreferrer" className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 text-xs font-medium flex items-center justify-center gap-1.5 transition-all">
            <span>Abrir en CELAEST Marketplace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {onRefreshEntitlement && (
            <button type="button" disabled={isRefreshing} onClick={onRefreshEntitlement} className="w-full py-2 rounded-xl text-[11px] font-mono text-violet-300/80 hover:text-violet-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50">
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Verificando licencia..." : "Ya lo adquirí · Verificar acceso"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
