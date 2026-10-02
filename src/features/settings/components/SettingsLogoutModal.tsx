import React, { useState } from "react";
import { Loader2 } from "lucide-react";

export interface SettingsLogoutModalProps {
  isOpen: boolean;
  onConfirmLogout: () => Promise<void> | void;
  onClose: () => void;
}

const SettingsLogoutModalInner: React.FC<SettingsLogoutModalProps> = ({
  isOpen,
  onConfirmLogout,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirmLogout();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] rounded-2xl border border-white/10 bg-[#0c0c16]/95 p-5 shadow-2xl backdrop-blur-xl flex flex-col gap-4 animate-[scaleUp_0.18s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1.5 text-left">
          <h3
            id="logout-dialog-title"
            className="text-base font-medium text-white tracking-tight"
          >
            ¿Cerrar sesión?
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            ¿Estás seguro de que deseas salir? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saliendo...</span>
              </>
            ) : (
              <span>Cerrar sesión</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const SettingsLogoutModal = React.memo(SettingsLogoutModalInner);
