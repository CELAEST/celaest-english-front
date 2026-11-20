import React from "react";
import { OrientationIntroStage } from "../../../services/PathwayLectureEngine";

export interface LiveBoardOrientationSceneProps {
  introStage?: OrientationIntroStage | undefined;
  subtitleSpanish?: string | undefined;
  onContinueToFormula: () => void;
  onOpenGuide?: (() => void) | undefined;
}

const METHOD_PILLARS = [
  {
    code: "01",
    title: "PIZARRA",
    note: "Regla visual y trampa",
    labelClass: "text-[#C4B2F7]",
    barClass: "bg-[#A78BFA] shadow-[0_0_10px_rgba(167,139,250,0.45)]",
  },
  {
    code: "02",
    title: "PRÁCTICA",
    note: "Fichas en movimiento",
    labelClass: "text-[#7DD3FC]",
    barClass: "bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.45)]",
  },
  {
    code: "03",
    title: "TU VOZ",
    note: "Oído y habla en vivo",
    labelClass: "text-[#86EFAC]",
    barClass: "bg-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.45)]",
  },
] as const;

export const LiveBoardOrientationScene: React.FC<LiveBoardOrientationSceneProps> = ({
  introStage,
  subtitleSpanish,
  onContinueToFormula,
  onOpenGuide,
}) => {
  const isGuideActive = introStage === "guide";
  const isMethodFocus = introStage === "philosophy" || introStage === "method";

  return (
    <div
      className="flex flex-col gap-2.5 py-0.5 animate-[fadeIn_0.22s_ease-out_both] select-none"
      data-testid="live-board-orientation-scene"
    >
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-white/[0.06]">
        <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#C4B2F7]">
          00 · BIENVENIDA &amp; MÉTODO
        </span>
        <button
          type="button"
          onClick={onContinueToFormula}
          className="group inline-flex items-center gap-1 text-[10.5px] font-mono text-[#22D3EE] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          title="Saltar introducción e ir directo a la regla"
        >
          <span>Ir a la regla</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-0 sm:divide-x divide-white/[0.07] py-0.5">
        {METHOD_PILLARS.map((pillar, idx) => (
          <div
            key={pillar.code}
            className={`relative pb-1.5 transition-opacity duration-300 ${
              idx === 0 ? "sm:pr-3.5" : idx === 1 ? "sm:px-3.5" : "sm:pl-3.5"
            } ${isGuideActive ? "opacity-45" : isMethodFocus ? "opacity-100" : "opacity-90"}`}
          >
            <span
              className={`text-[8.5px] font-mono uppercase tracking-[0.18em] block ${pillar.labelClass}`}
            >
              {pillar.code} · {pillar.title}
            </span>
            <span className="text-[12.5px] sm:text-[13px] font-light text-white/85 block mt-0.5 leading-snug">
              {pillar.note}
            </span>
            <span className={`mt-1.5 block h-[2px] w-7 rounded-full ${pillar.barClass}`} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 border-t border-white/[0.06] text-[10.5px] font-mono">
        {onOpenGuide ? (
          <button
            type="button"
            onClick={onOpenGuide}
            className={`transition-colors cursor-pointer underline-offset-4 ${
              isGuideActive
                ? "text-[#DDD6FE] underline decoration-[#A78BFA]/70"
                : "text-white/50 hover:text-white/90"
            }`}
          >
            Guía · 14 bloques &amp; 44 fonemas
          </button>
        ) : (
          <span className={isGuideActive ? "text-[#DDD6FE]" : "text-white/50"}>
            Guía · 14 bloques &amp; 44 fonemas
          </span>
        )}
        <span className="text-white/20" aria-hidden>
          ·
        </span>
        <span className="text-white/50">Preguntar · IA en vivo</span>
      </div>

      <p className="text-[11.5px] sm:text-xs text-white/75 font-light leading-relaxed">
        {subtitleSpanish ||
          "Escucha la guía inicial paso a paso o toca Ir a la regla para entrar directo."}
      </p>
    </div>
  );
};
