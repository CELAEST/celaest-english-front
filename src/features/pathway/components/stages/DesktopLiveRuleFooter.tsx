import React from "react";
import { KnowledgeTab } from "../knowledge/KnowledgeTabSelector";

export interface DesktopLiveRuleFooterProps {
  onContinueToBuild: () => void;
  onOpenAnatomy?: (() => void) | undefined;
  onOpenKnowledge?: ((tab: KnowledgeTab) => void) | undefined;
}

export const DesktopLiveRuleFooter: React.FC<DesktopLiveRuleFooterProps> = ({
  onContinueToBuild, onOpenAnatomy, onOpenKnowledge,
}) => {
  const handleOpenGuide = onOpenAnatomy ?? (() => onOpenKnowledge?.("grammar"));

  return (
    <div className="flex items-center justify-between gap-4 pt-0.5 select-none">
      {(onOpenAnatomy || onOpenKnowledge) && (
        <button
          type="button"
          onClick={handleOpenGuide}
          className="text-xs font-mono text-[#DDD6FE] hover:text-white underline decoration-[#A78BFA]/50 underline-offset-4 cursor-pointer flex items-center gap-1.5 transition-colors"
        >
          <span>¿Cómo funciona la estructura en inglés?</span>
          <span>→</span>
        </button>
      )}
      <button
        type="button"
        onClick={onContinueToBuild}
        className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#9333EA] hover:to-[#7C3AED] text-white text-xs font-mono uppercase tracking-[0.14em] font-medium shadow-[0_0_24px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
      >
        <span>Practicar con el Profesor</span>
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </button>
    </div>
  );
};
