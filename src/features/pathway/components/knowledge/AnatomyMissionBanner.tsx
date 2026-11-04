import React, { useState } from "react";
import { Compass } from "lucide-react";

const STORAGE_KEY = "celaest:pathway:anatomy-intro-dismissed";

const readDismissed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const AnatomyMissionBanner: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(readDismissed);
  if (isDismissed) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Storage unavailable (private mode): dismiss only for this session
    }
    setIsDismissed(true);
  };

  return (
    <div className="pb-4 border-b border-white/[0.08] space-y-2 select-none animate-[fadeIn_0.2s_ease-out_both]">
      <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#A78BFA]">
        <Compass size={12} aria-hidden />
        <span>¿Para qué sirve esta guía?</span>
      </div>
      <p className="text-[13px] text-white/80 font-light leading-relaxed">
        El inglés se arma con piezas en un orden fijo. Aquí verás cada pieza, una por una y de
        la más fácil a la más compleja, con ejemplos que puedes escuchar.
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="text-xs font-mono tracking-[0.16em] uppercase text-white hover:text-[#A78BFA] transition-colors cursor-pointer py-1"
      >
        Ok, entendido
      </button>
    </div>
  );
};
