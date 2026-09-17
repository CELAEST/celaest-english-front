import React from "react";
import { ShieldCheck } from "lucide-react";
import { useApiKeySetup } from "../hooks/useApiKeySetup";
import { OnboardingProviderGrid } from "./api-key/OnboardingProviderGrid";
import { OnboardingKeyInputCard } from "./api-key/OnboardingKeyInputCard";
import { OnboardingApiKeyActions } from "./api-key/OnboardingApiKeyActions";

interface OnboardingApiKeyStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const OnboardingApiKeyStep: React.FC<OnboardingApiKeyStepProps> = ({
  onNext,
  onPrev,
}) => {
  const {
    selectedProvider,
    selectProvider,
    currentProvider,
    keyInput,
    setKeyInput,
    isVerifying,
    verificationError,
    verifiedSuccessInfo,
    hasExistingKey,
    verifyAndSave,
  } = useApiKeySetup();

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        <div className="shrink-0 h-5 sm:h-7" />

        <div className="flex-1 flex flex-col justify-center max-w-xl min-h-0 my-auto py-1 space-y-3">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.4s_ease-out_both]">
              Conecta tu Motor de IA
            </h1>
            <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed">
              Lingua analiza tu fluidez y diagnostica tu nivel CEFR en tiempo real. Configura tu proveedor de inferencia favorito para una práctica continua.
            </p>
          </div>

          <OnboardingProviderGrid selectedProvider={selectedProvider} onSelect={selectProvider} />

          <OnboardingKeyInputCard
            provider={currentProvider}
            keyInput={keyInput}
            setKeyInput={setKeyInput}
            hasExistingKey={hasExistingKey}
            error={verificationError}
            successInfo={verifiedSuccessInfo}
          />

          <div className="flex items-center space-x-2 text-[10px] text-white/40 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
            <span>Cifrado AES-256 en tu dispositivo. Tu clave nunca se comparte ni se almacena en CELAEST.</span>
          </div>

          <OnboardingApiKeyActions
            onPrev={onPrev}
            onConfirm={() => verifyAndSave(onNext)}
            isVerifying={isVerifying}
            hasExistingKey={hasExistingKey}
            hasInput={Boolean(keyInput.trim())}
          />
        </div>

        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
