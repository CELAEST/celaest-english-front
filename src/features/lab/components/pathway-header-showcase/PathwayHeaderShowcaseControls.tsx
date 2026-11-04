import React from "react";
import { InnovationModelId, ViewportDevice } from "./PathwayHeaderShowcaseTypes";
import { PathwayStepId } from "../../../../domain/entities/LearningPathway";
import { Smartphone, Monitor } from "lucide-react";

interface ControlsProps {
  model: InnovationModelId;
  device: ViewportDevice;
  step: PathwayStepId;
  onSelectModel: (m: InnovationModelId) => void;
  onSelectDevice: (d: ViewportDevice) => void;
  onSelectStep: (s: PathwayStepId) => void;
}

const MODELS: Array<{ id: InnovationModelId; label: string }> = [
  { id: "axis-columns-aligned", label: "1. Columnas (Texto Puro)" },
  { id: "axis-pills-aligned", label: "2. Píldoras Enterprise (Síntesis)" },
  { id: "axis-compact-gap", label: "3. Gap Compacto (4px)" },
  { id: "axis-single-row", label: "4. Fila Única (Cero Espacio)" },
  { id: "axis-notch-bridge", label: "5. Cápsula Puente" },
  { id: "axis-topic-aligned", label: "6. Con Título & Columnas" },
];

export const PathwayHeaderShowcaseControls: React.FC<ControlsProps> = ({
  model, device, step, onSelectModel, onSelectDevice, onSelectStep,
}) => (
  <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
    <div className="flex flex-wrap items-center gap-1.5">
      {MODELS.map((m) => (
        <button
          key={m.id} type="button" onClick={() => onSelectModel(m.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all cursor-pointer ${
            model === m.id
              ? "bg-[#A27FF3]/25 border border-[#A27FF3]/70 text-[#DDD6FE] font-semibold shadow-sm"
              : "bg-white/[0.03] text-white/50 border border-white/5 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <div className="flex items-center p-0.5 rounded-full bg-white/[0.03] border border-white/10">
        <button
          type="button" onClick={() => onSelectDevice("mobile")}
          className={`p-1.5 rounded-full transition-colors ${device === "mobile" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
          title="Vista Mobile (390px)"
        >
          <Smartphone size={13} />
        </button>
        <button
          type="button" onClick={() => onSelectDevice("desktop")}
          className={`p-1.5 rounded-full transition-colors ${device === "desktop" ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}
          title="Vista Desktop"
        >
          <Monitor size={13} />
        </button>
      </div>

      <div className="flex items-center gap-1 pl-2 border-l border-white/10">
        {(["RULE", "BUILD", "SPEAK"] as PathwayStepId[]).map((s, idx) => (
          <button
            key={s} type="button" onClick={() => onSelectStep(s)}
            className={`px-2 py-0.5 rounded-full text-[11px] font-mono transition-colors ${step === s ? "text-[#A27FF3] bg-[#A27FF3]/20 font-semibold" : "text-white/40 hover:text-white"}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  </div>
);
