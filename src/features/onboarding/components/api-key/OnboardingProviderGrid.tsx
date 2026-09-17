import React from "react";
import { AiProviderId } from "../../../../domain/entities/AiProvider";
import { ProviderMark } from "../../../settings/components/SettingsProviderIcons";
import { ONBOARDING_PROVIDERS, ProviderOption } from "../../hooks/useApiKeySetup";

interface OnboardingProviderGridProps {
  selectedProvider: AiProviderId;
  onSelect: (id: AiProviderId) => void;
}

export const OnboardingProviderGrid: React.FC<OnboardingProviderGridProps> = ({
  selectedProvider,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 py-2">
      {ONBOARDING_PROVIDERS.map((prov: ProviderOption) => {
        const isActive = selectedProvider === prov.id;
        return (
          <button
            key={prov.id}
            type="button"
            onClick={() => onSelect(prov.id)}
            className={`group flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 cursor-pointer border ${
              isActive
                ? "bg-white/[0.08] border-[#8B5CF6]/60 shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "opacity-60 group-hover:opacity-90"}`}>
              <ProviderMark providerId={prov.id} isActive={isActive} size="md" />
            </div>
            <span className={`text-[11px] mt-1 font-medium tracking-tight ${isActive ? "text-white" : "text-white/60"}`}>
              {prov.name}
            </span>
            {prov.id === "groq" ? (
              <span className="text-[9px] font-bold tracking-tight bg-gradient-to-r from-[#FF7A00] to-[#FFD600] bg-clip-text text-transparent">
                Gratis
              </span>
            ) : (
              <span className={`text-[9px] font-mono ${isActive ? "text-[#C4B5FD]" : "text-white/30"}`}>
                {prov.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
