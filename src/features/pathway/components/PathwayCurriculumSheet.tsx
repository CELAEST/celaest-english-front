import React from "react";
import { Lock } from "lucide-react";
import { LearningPathway } from "../../../domain/entities/LearningPathway";

export interface PathwayCurriculumSheetProps {
  open: boolean;
  pathway: LearningPathway;
  activeNodeId: string;
  isGeneratingAi: boolean;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  onPersonalizeAi: () => void;
}

export const PathwayCurriculumSheet: React.FC<PathwayCurriculumSheetProps> = ({
  open, pathway, activeNodeId, isGeneratingAi, onClose, onSelectNode, onPersonalizeAi,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-[fadeIn_0.2s_ease-out_both]" onClick={onClose}>
      <div className="w-full max-w-md h-full bg-[#000001] border-l border-white/10 px-6 py-6 flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#A27FF3] block">
                Programa Nivel {pathway.cefrLevel} · {pathway.masteryIndex}% Dominado
              </span>
              <h2 className="text-lg font-light text-white mt-0.5">Ruta Guiada Paso a Paso</h2>
            </div>
            <button type="button" onClick={onClose} className="text-xs font-mono text-white/60 hover:text-white px-2 py-1 cursor-pointer">
              Cerrar ✕
            </button>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {pathway.nodes.map((node, idx) => {
              const selected = node.id === activeNodeId;
              const locked = node.status === "LOCKED";
              const done = node.status === "MASTERED" || node.status === "CONSOLIDATED";
              const num = String(idx + 1).padStart(2, "0");
              return (
                <button
                  key={node.id} type="button"
                  onClick={() => { onSelectNode(node.id); onClose(); }}
                  className="w-full text-left py-3.5 flex items-center justify-between gap-3 transition-colors hover:text-white cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className={`text-[10px] font-mono uppercase tracking-widest block ${done ? "text-[#4ade80]" : selected ? "text-[#A27FF3]" : "text-white/40"}`}>
                      {done ? `✓ Base ${num} · Completada` : `Base ${num} · ${node.competencyFocus}`}
                    </span>
                    <span className={`text-sm font-light block truncate mt-0.5 ${selected ? "text-white font-normal" : "text-white/80"}`}>{node.title}</span>
                  </div>
                  <span className="text-xs font-mono text-white/40 shrink-0">
                    {locked ? <Lock size={12} className="opacity-40" /> : "→"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button" onClick={onPersonalizeAi} disabled={isGeneratingAi}
          className="mt-6 w-full py-2.5 text-xs font-mono tracking-wider text-[#A27FF3] hover:text-white border-t border-white/10 pt-4 text-left cursor-pointer disabled:opacity-40"
        >
          {isGeneratingAi ? "El Profesor está adaptando ejemplos con IA..." : "Adaptar ejemplos del curso a mi perfil con IA →"}
        </button>
      </div>
    </div>
  );
};
