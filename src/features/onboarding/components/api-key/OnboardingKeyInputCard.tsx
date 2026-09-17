import React, { useState } from "react";
import { ExternalLink, Info, Check, AlertCircle } from "lucide-react";
import { ProviderMark } from "../../../settings/components/SettingsProviderIcons";
import { ProviderOption } from "../../hooks/useApiKeySetup";

interface OnboardingKeyInputCardProps {
  provider: ProviderOption;
  keyInput: string;
  setKeyInput: (val: string) => void;
  hasExistingKey: boolean;
  error: string | null;
  successInfo: string | null;
}

export const OnboardingKeyInputCard: React.FC<OnboardingKeyInputCardProps> = ({
  provider,
  keyInput,
  setKeyInput,
  hasExistingKey,
  error,
  successInfo,
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-2.5 pt-2">
      <div className="flex items-center justify-between text-xs text-[#8E8EA8]">
        <div className="flex items-center space-x-1.5">
          <span className="text-white/80 font-medium">Clave de {provider.name}:</span>
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-[#C4B5FD] hover:text-white transition-colors cursor-pointer"
            title="Cómo obtener tu clave"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
        <a
          href={provider.url}
          target="_blank"
          rel="noreferrer"
          className="text-[#A27FF3] hover:text-[#C4B5FD] underline text-[11px] flex items-center gap-1 transition-colors"
        >
          <span>{provider.isFree ? "Obtener gratis ↗" : "Crear clave ↗"}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {showGuide && (
        <div className="p-3 rounded-xl bg-[#0B0B1A] border border-white/10 text-[11px] text-[#A7A7C0] space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
          <p className="font-medium text-white">¿Cómo obtenerla en 30 segundos?</p>
          <ol className="list-decimal list-inside space-y-0.5 text-white/70">
            <li>Haz clic en &quot;{provider.isFree ? "Obtener gratis ↗" : "Crear clave ↗"}&quot;.</li>
            <li>Inicia sesión con Google o GitHub.</li>
            <li>Crea una nueva clave y pégala abajo (comienza con <span className="font-mono text-[#C4B5FD]">{provider.placeholder}</span>).</li>
          </ol>
        </div>
      )}

      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none opacity-75">
          <ProviderMark providerId={provider.id} size="md" />
        </div>
        <input
          type="password"
          placeholder={hasExistingKey && !keyInput ? "•••••••••••••••• (Clave activa detectada)" : `Pega tu clave ${provider.placeholder}`}
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/10 focus:border-[#8B5CF6] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-white/30 outline-none font-mono transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 text-[11px] text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successInfo && (
        <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{successInfo}</span>
        </div>
      )}
    </div>
  );
};
