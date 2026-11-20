import React from "react";
import { AiProviderId } from "../../../../domain/entities/AiProvider";
import { ProviderMark } from "../../../settings/components/SettingsProviderIcons";
import { ONBOARDING_PROVIDERS } from "../../hooks/useApiKeySetup";

interface OnboardingProviderGridProps {
  selectedProvider: AiProviderId;
  onSelect: (id: AiProviderId) => void;
}

export const OnboardingProviderGrid: React.FC<OnboardingProviderGridProps> = ({
  selectedProvider,
  onSelect,
}) => {
  const groq = ONBOARDING_PROVIDERS[0];
  if (!groq) return null;
  const isActive = selectedProvider === groq.id;

  return (
    <div className="py-1.5">
      <button
        key={groq.id}
        type="button"
        onClick={() => onSelect(groq.id)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/[0.06] border border-[#8B5CF6]/45 shadow-[0_0_16px_rgba(139,92,246,0.18)] transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`transition-transform duration-200 ${isActive ? "scale-105" : ""}`}>
            <ProviderMark providerId={groq.id} isActive={true} size="md" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-white tracking-tight">{groq.name}</div>
            <div className="text-[11px] text-white/55 font-light">
              Motor de inferencia ultra-rápido (~85 ms)
            </div>
          </div>
        </div>
        <span className="text-[10px] font-bold tracking-tight bg-gradient-to-r from-[#FF7A00] to-[#FFD600] bg-clip-text text-transparent uppercase">
          100% Gratis
        </span>
      </button>
    </div>
  );
};
