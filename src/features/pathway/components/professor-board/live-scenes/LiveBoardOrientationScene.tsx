import React from "react";
import { Sparkles, ArrowRight, BookOpen, Layers, Mic } from "lucide-react";

export interface LiveBoardOrientationSceneProps {
  subtitleSpanish?: string | undefined;
  onContinueToFormula: () => void;
}

export const LiveBoardOrientationScene: React.FC<LiveBoardOrientationSceneProps> = ({
  subtitleSpanish,
  onContinueToFormula,
}) => {
  return (
    <div
      className="flex flex-col justify-between gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl animate-[fadeIn_0.3s_ease-out_both] select-none"
      data-testid="live-board-orientation-scene"
    >
      {/* 1. Header: Orientation Badge */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-[#A27FF3]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">
            BIENVENIDA & DINÁMICA DE CLASE
          </span>
        </div>
        <button
          type="button"
          onClick={onContinueToFormula}
          className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-[#DDD6FE]/70 hover:text-white transition-colors cursor-pointer"
          title="Saltar orientación e ir directo a la regla"
        >
          <span>Ir a la regla</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 2. Visual 3-Pillars Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#C4B2F7]">
            <BookOpen size={12} />
            <span className="text-[10.5px] font-mono uppercase tracking-wider font-medium">1. Pizarra</span>
          </div>
          <p className="text-[11px] text-white/60 font-light leading-snug">
            Regla visual, fórmula paso a paso y caza de trampas.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#22D3EE]">
            <Layers size={12} />
            <span className="text-[10.5px] font-mono uppercase tracking-wider font-medium">2. Práctica</span>
          </div>
          <p className="text-[11px] text-white/60 font-light leading-snug">
            Armado de fichas táctiles para forjar memoria motriz.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#4ade80]">
            <Mic size={12} />
            <span className="text-[10.5px] font-mono uppercase tracking-wider font-medium">3. Tu Voz</span>
          </div>
          <p className="text-[11px] text-white/60 font-light leading-snug">
            Activación y certificación acústica en tiempo real.
          </p>
        </div>
      </div>

      {/* 3. Subtitle Bar synced with Liam's speech */}
      <div className="flex items-start gap-2 pt-1 border-t border-white/[0.05]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#A27FF3] shadow-[0_0_8px_#A27FF3] shrink-0 mt-1.5 animate-pulse" />
        <p className="text-xs sm:text-[12.5px] text-white/85 font-light leading-relaxed italic">
          {subtitleSpanish || "Liam te acompaña paso a paso. Escucha su explicación inicial antes de comenzar."}
        </p>
      </div>
    </div>
  );
};
