import React from "react";

export type GuideSection = "structure" | "phonetics";

export interface GuideHeaderTitleProps {
  activeSection: GuideSection;
  onSelectSection: (section: GuideSection) => void;
}

export const GuideHeaderTitle: React.FC<GuideHeaderTitleProps> = ({
  activeSection,
  onSelectSection,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      onSelectSection(activeSection === "structure" ? "phonetics" : "structure");
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Modalidad de aprendizaje"
      onKeyDown={handleKeyDown}
      className="flex items-center gap-3 sm:gap-4 select-none"
    >
      <button
        type="button"
        role="tab"
        id="guide-tab-structure"
        aria-selected={activeSection === "structure"}
        aria-controls="guide-panel-structure"
        onClick={() => onSelectSection("structure")}
        className={`group relative text-[15px] sm:text-[16px] transition-colors duration-150 cursor-pointer pb-1 outline-none ${
          activeSection === "structure"
            ? "text-white font-medium"
            : "text-white/40 hover:text-white/80 font-normal"
        }`}
      >
        <span>Estructura</span>
        {activeSection === "structure" ? (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A78BFA] rounded-full" />
        ) : (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-white/20 rounded-full transition-colors" />
        )}
      </button>

      <span className="text-white/20 select-none text-xs font-light">·</span>

      <button
        type="button"
        role="tab"
        id="guide-tab-phonetics"
        aria-selected={activeSection === "phonetics"}
        aria-controls="guide-panel-phonetics"
        onClick={() => onSelectSection("phonetics")}
        className={`group relative text-[15px] sm:text-[16px] transition-colors duration-150 cursor-pointer pb-1 outline-none ${
          activeSection === "phonetics"
            ? "text-white font-medium"
            : "text-white/40 hover:text-white/80 font-normal"
        }`}
      >
        <span>Alfabeto Fonético</span>
        {activeSection === "phonetics" ? (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A78BFA] rounded-full" />
        ) : (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-white/20 rounded-full transition-colors" />
        )}
      </button>
    </div>
  );
};
