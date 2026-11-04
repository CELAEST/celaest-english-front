import React, { useState } from "react";
import { InnovationModelId, ViewportDevice } from "./pathway-header-showcase/PathwayHeaderShowcaseTypes";
import { PathwayStepId } from "../../../domain/entities/LearningPathway";
import { PathwayHeaderShowcaseControls } from "./pathway-header-showcase/PathwayHeaderShowcaseControls";
import { ModelAxisColumnsAligned } from "./pathway-header-showcase/ModelAxisColumnsAligned";
import { ModelAxisPillsAligned } from "./pathway-header-showcase/ModelAxisPillsAligned";
import { ModelAxisCompactGap } from "./pathway-header-showcase/ModelAxisCompactGap";
import { ModelAxisSingleRow } from "./pathway-header-showcase/ModelAxisSingleRow";
import { ModelAxisNotchBridge } from "./pathway-header-showcase/ModelAxisNotchBridge";
import { ModelAxisTopicAligned } from "./pathway-header-showcase/ModelAxisTopicAligned";

export const PathwayHeaderEnterpriseShowcase: React.FC = () => {
  const [model, setModel] = useState<InnovationModelId>("axis-pills-aligned");
  const [device, setDevice] = useState<ViewportDevice>("mobile");
  const [activeStep, setActiveStep] = useState<PathwayStepId>("BUILD");

  const headerProps = {
    nodeIndex: 5, totalNodes: 32, masteredCount: 5, activeStep,
    onSelectStep: setActiveStep, onOpenCurriculum: () => {}, onOpenTutor: () => {},
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#A27FF3]/20 text-[#DDD6FE] border border-[#A27FF3]/30">
            LAB SHOWCASE · SYMMETRICAL AXIS SUITE
          </span>
          <span className="text-xs text-white/40 font-mono">Simetría 3-Columnas & Cero Espacios Vacíos</span>
        </div>
        <h2 className="text-xl font-light text-white tracking-tight">Pathway Symmetrical Header Matrix</h2>
        <p className="text-xs text-white/60 font-light">
          Alineación milimétrica entre las letras de arriba y abajo: Píldoras Enterprise, Columnas Alineadas, Gap Compacto y Fila Única.
        </p>
      </div>

      <PathwayHeaderShowcaseControls
        model={model} device={device} step={activeStep}
        onSelectModel={setModel} onSelectDevice={setDevice} onSelectStep={setActiveStep}
      />

      <div className="w-full flex justify-center py-6 bg-black/60 rounded-3xl border border-white/[0.06] overflow-hidden">
        <div
          className={`transition-all duration-300 bg-[#000001] flex flex-col justify-between rounded-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden ${
            device === "mobile" ? "w-[390px] h-[620px] p-5 sm:p-6" : "w-full max-w-4xl h-[500px] p-6"
          }`}
        >
          {model === "axis-columns-aligned" && <ModelAxisColumnsAligned {...headerProps} />}
          {model === "axis-pills-aligned" && <ModelAxisPillsAligned {...headerProps} />}
          {model === "axis-compact-gap" && <ModelAxisCompactGap {...headerProps} />}
          {model === "axis-single-row" && <ModelAxisSingleRow {...headerProps} />}
          {model === "axis-notch-bridge" && <ModelAxisNotchBridge {...headerProps} />}
          {model === "axis-topic-aligned" && <ModelAxisTopicAligned {...headerProps} />}
        </div>
      </div>
    </div>
  );
};
