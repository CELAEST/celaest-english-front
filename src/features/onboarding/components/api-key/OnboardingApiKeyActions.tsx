import React from "react";
import { Loader2, ArrowRight } from "lucide-react";

interface OnboardingApiKeyActionsProps {
  onPrev?: (() => void) | undefined;
  onLogout?: (() => void) | undefined;
  onConfirm: () => void;
  isVerifying: boolean;
  hasExistingKey: boolean;
  hasInput: boolean;
}

export const OnboardingApiKeyActions: React.FC<OnboardingApiKeyActionsProps> = ({
  onPrev,
  onLogout,
  onConfirm,
  isVerifying,
  hasExistingKey,
  hasInput,
}) => {
  const canContinue = hasExistingKey || hasInput;

  return (
    <div className="flex items-center justify-between pt-3">
      {onLogout ? (
        <button
          type="button"
          onClick={onLogout}
          className="text-xs font-light text-[#71719A] hover:text-[#A27FF3] transition-colors cursor-pointer outline-none focus-visible:underline"
        >
          Cerrar sesión
        </button>
      ) : onPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Atrás
        </button>
      ) : (
        <div />
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isVerifying || !canContinue}
        className="group inline-flex items-center justify-center px-6 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            <span>Verificando...</span>
          </>
        ) : (
          <>
            <span>
              {!canContinue
                ? "Ingresa tu clave para continuar"
                : hasExistingKey && !hasInput
                ? "Continuar con clave activa"
                : "Verificar y Continuar"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </div>
  );
};
