import React, { useState } from "react";
import { LiveBoardOrientationScene } from "../../pathway/components/professor-board/live-scenes/LiveBoardOrientationScene";
import { OrientationIntroStage } from "../../pathway/services/PathwayLectureEngine";
import { INTRO_STAGE_PRESETS } from "./orientation-showcase/OrientationShowcaseData";

export const OrientationSceneShowcase: React.FC = () => {
  const [stage, setStage] = useState<OrientationIntroStage>("welcome");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [statusNote, setStatusNote] = useState<string | null>(null);

  const active = INTRO_STAGE_PRESETS.find((s) => s.id === stage) || INTRO_STAGE_PRESETS[0]!;

  return (
    <div className="w-full flex flex-col space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#A27FF3]/20 text-[#DDD6FE] border border-[#A27FF3]/30">
              ORIENTATION SUITE · ZERO-BOX HAIRLINE
            </span>
            <span className="text-xs text-white/40 font-mono">Activa en Producción</span>
          </div>
          <h2 className="text-xl font-light text-white tracking-tight">Bienvenida &amp; Dinámica de Clase (Anti-AI Clean)</h2>
          <p className="text-xs text-white/60 font-light">
            Tipografía pura con líneas divisorias finas e índices de color alineados a 1 Fórmula, sin cajas ni píldoras redundantes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          {(["desktop", "mobile"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setDevice(v)}
              className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                device === v ? "bg-[#A27FF3]/25 text-white border border-[#A27FF3]/50" : "text-white/45 hover:text-white border border-white/[0.06]"
              }`}
            >
              {v === "desktop" ? "Desktop" : "Mobile (390px)"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {INTRO_STAGE_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setStage(p.id)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              stage === p.id
                ? "bg-[#A27FF3]/25 border border-[#A27FF3]/60 text-[#DDD6FE]"
                : "text-white/50 border border-white/[0.06] hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="w-full flex justify-center py-6 px-4 bg-black/60 rounded-3xl border border-white/[0.06]">
        <div
          className={`transition-all duration-300 bg-[#000001] border border-white/[0.08] rounded-2xl p-5 ${
            device === "mobile" ? "w-[360px]" : "w-full max-w-2xl"
          }`}
        >
          <LiveBoardOrientationScene
            introStage={active.id}
            subtitleSpanish={active.subtitle}
            onContinueToFormula={() => setStatusNote("Transición silenciosa a 1 Fórmula")}
            onOpenGuide={() => setStatusNote("Guía abierta: Estructura (14) + Fonética (44)")}
          />
          {statusNote && (
            <p className="mt-2 pt-2 border-t border-white/[0.05] text-[10.5px] font-mono text-[#22D3EE]">
              {statusNote}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
