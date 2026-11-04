import React, { useEffect, useState } from "react";
import { ProfessorStageCanvas, warmProfessorModelCache } from "../../../design-system/components/Professor3D";
import { BridgeModuleTarget } from "../../../domain/entities/LearningPathway";
import { apiPathwayRepository } from "../../../infrastructure/repositories/ApiPathwayRepository";

export interface WorkspaceProfessorGuideProps {
  userLevel: string;
  profession: string;
  learningGoal: string;
  isActive?: boolean;
  onOpenPathway: () => void;
  onNavigateModule?: ((target: BridgeModuleTarget) => void) | undefined;
}

export const WorkspaceProfessorGuide: React.FC<WorkspaceProfessorGuideProps> = ({
  userLevel, profession, learningGoal, isActive = true, onOpenPathway, onNavigateModule,
}) => {
  const computeBrief = () => {
    const pw = apiPathwayRepository.getOrSeedInitialPathway(userLevel, profession, learningGoal);
    const done = pw.nodes.filter((n) => n.status === "MASTERED" || n.status === "CONSOLIDATED").length;
    const currentIdx = Math.max(0, pw.nodes.findIndex((n) => n.status === "ACTIVE"));
    const currentNode = pw.nodes[currentIdx] || pw.nodes[0];
    const bridge = currentNode?.lessonPayload?.bridgeModule;
    return { done, total: pw.nodes.length, currentIdx, title: currentNode?.title || "Bases de Inglés", bridge };
  };

  const [brief, setBrief] = useState(computeBrief);

  useEffect(() => {
    warmProfessorModelCache();
  }, []);

  useEffect(() => {
    setBrief(computeBrief());
    const sync = () => setBrief(computeBrief());
    window.addEventListener("celaest:pathway-updated", sync);
    return () => window.removeEventListener("celaest:pathway-updated", sync);
  }, [userLevel, profession, learningGoal]);

  return (
    <div className="pt-2 border-t border-white/[0.08] flex items-center gap-3.5 w-full max-w-md mx-auto lg:mx-0 text-left">
      <div
        onClick={onOpenPathway}
        title="Entrar a clase con tu Profesor"
        className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden shrink-0 cursor-pointer bg-white/[0.02]"
      >
        <ProfessorStageCanvas state="idle" preset="bust-guide" isActive={isActive} />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3] block">
          Tu Profesor Guía · {brief.done}/{brief.total} Bases ({userLevel})
        </span>
        <p className="text-xs text-white/80 font-light leading-snug truncate">
          Siguiente: <span className="text-white font-normal">{brief.title}</span>
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-0.5">
          <button type="button" onClick={onOpenPathway} className="text-[11px] font-mono tracking-wider text-white hover:text-[#A27FF3] cursor-pointer">
            IR A CLASE 0{brief.currentIdx + 1} →
          </button>
          {brief.bridge && onNavigateModule && (
            <button type="button" onClick={() => onNavigateModule(brief.bridge!.target)} className="text-[11px] font-mono tracking-wider text-white/55 hover:text-white cursor-pointer">
              PRACTICAR EN {brief.bridge.moduleLabel.toUpperCase()} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
