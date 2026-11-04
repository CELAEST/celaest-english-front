import React, { useCallback, useRef } from "react";
import { CyberVisorFaceEngine } from "./CyberVisorFaceEngine";
import { ProfessorAnimState, ProfessorCameraPreset } from "./professorTypes";
import { useProfessorCanvasLoop } from "./useProfessorCanvasLoop";

export interface ProfessorStageCanvasProps {
  state: ProfessorAnimState;
  preset?: ProfessorCameraPreset;
  isActive?: boolean;
  onTapProfessor?: (() => void) | undefined;
  faceEngine?: CyberVisorFaceEngine;
  className?: string;
}

function getPresetTransformClass(preset: ProfessorCameraPreset): string {
  if (preset === "face-focus") return "scale-[1.85] origin-[50%_24%]";
  if (preset === "bust-guide") return "scale-110 object-top";
  return "";
}

export const ProfessorStageCanvas: React.FC<ProfessorStageCanvasProps> = React.memo(
  ({
    state,
    preset = "tutor-stage",
    isActive = true,
    onTapProfessor,
    faceEngine,
    className = "w-full h-full",
  }) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const triggerGreeting = useProfessorCanvasLoop(
      hostRef,
      canvasRef,
      imgRef,
      state,
      isActive,
      faceEngine,
    );

    const handleClick = useCallback(() => {
      triggerGreeting();
      onTapProfessor?.();
    }, [triggerGreeting, onTapProfessor]);

    const presetClass = getPresetTransformClass(preset);

    return (
      <div
        ref={hostRef}
        data-testid="professor-3d-stage"
        data-state={state}
        onClick={handleClick}
        className={`relative overflow-hidden select-none flex items-center justify-center ${
          onTapProfessor ? "cursor-pointer" : ""
        } ${className}`}
      >
        {/* Tier 0 instant rest paint before binary bitmaps finish decoding */}
        <img
          ref={imgRef}
          src="/images/chibi_rest.webp?v=2"
          alt="CELAEST Chibi Mentor"
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-200 ${presetClass}`}
          loading="eager"
        />

        {/* Hybrid 2D Stage: Clean 3D Head Bitmaps + Live 60 FPS CyberVisorFaceEngine */}
        <canvas
          ref={canvasRef}
          width={720}
          height={720}
          className={`w-full h-full object-contain block pointer-events-none select-none transition-transform duration-300 ${presetClass}`}
        />

        {/* Ambient bioluminescent stage glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-4 h-28 rounded-full blur-3xl transition-opacity duration-700 opacity-75"
          style={{ background: "radial-gradient(circle, rgba(162,127,243,0.28) 0%, transparent 72%)" }}
        />
      </div>
    );
  },
);
