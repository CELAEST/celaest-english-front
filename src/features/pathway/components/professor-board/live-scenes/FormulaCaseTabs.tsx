import React from "react";
import { FormulaCase } from "../../../../../domain/entities/LearningPathway";

export interface FormulaCaseTabsProps {
  cases: FormulaCase[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const FormulaCaseTabs: React.FC<FormulaCaseTabsProps> = React.memo(
  ({ cases, activeIndex, onSelect }) => {
    if (cases.length <= 1) return null;

    return (
      <div
        className="flex flex-wrap items-center gap-x-3.5 gap-y-1 select-none"
        role="tablist"
        aria-label="Casos de uso de la fórmula"
        data-testid="formula-case-tabs"
      >
        {cases.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={`${item.label}-${idx}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelect(idx)}
              className={`pb-0.5 text-[10px] sm:text-[10.5px] font-mono tracking-wide border-b transition-colors cursor-pointer ${
                isSelected
                  ? "text-white border-[#A78BFA] font-medium"
                  : "text-white/40 border-transparent hover:text-white/75"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);

