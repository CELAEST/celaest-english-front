import React, { useState, useRef, useEffect } from "react";
import { normalizeCefr, CefrLevelCode } from "../services/dynamicQuestionService";

export interface LevelSelectorPillProps {
  currentLevel: string;
  onSelectLevel: (level: CefrLevelCode) => void;
  roleName?: string;
  align?: "left" | "right";
  className?: string;
}

const CEFR_LEVELS: Array<{
  code: CefrLevelCode;
  label: string;
  sublabel: string;
}> = [
  { code: "A1", label: "A1 — Acceso", sublabel: "Vocabulario básico y frases sencillas" },
  { code: "A2", label: "A2 — Plataforma", sublabel: "Situaciones y tareas directas de equipo" },
  { code: "B1", label: "B1 — Umbral", sublabel: "Comunicación y flujos de trabajo en equipo" },
  { code: "B2", label: "B2 — Avanzado", sublabel: "Fluidez profesional y metodología STAR" },
  { code: "C1", label: "C1 — Dominio", sublabel: "Arquitectura, compensaciones y estrategia" },
  { code: "C2", label: "C2 — Maestría", sublabel: "Liderazgo ejecutivo nativo de alta escala" },
];

export const LevelSelectorPill: React.FC<LevelSelectorPillProps> = React.memo(
  function LevelSelectorPill({ currentLevel, onSelectLevel, roleName, align = "left", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeCode = normalizeCefr(currentLevel);
    const activeMeta = CEFR_LEVELS.find((l) => l.code === activeCode) || CEFR_LEVELS[2];

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        window.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("keydown", handleKeyDown);
      }
      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen]);

    return (
      <div ref={containerRef} className={`relative inline-flex items-center gap-2 select-none z-30 ${className}`}>
        {/* Role Tag (if provided) — 100% Borderless & Monochrome */}
        {roleName && (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase text-white/40 bg-white/[0.03]">
            {roleName}
          </span>
        )}

        {/* Level Selector Button — 100% Backgroundless, Only Letters and Icon */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group inline-flex items-center gap-1 text-xs font-mono tracking-wide bg-transparent hover:bg-transparent border-0 p-0 text-white/80 hover:text-white transition-all duration-200 cursor-pointer focus:outline-none"
          title="Cambiar nivel de dificultad adaptativo"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="font-semibold text-white/90">{activeMeta.code}</span>
          <svg
            className={`w-3 h-3 text-white/40 group-hover:text-white/70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Popover — 100% Borderless, Zero AI Dots, Pure Monochrome Typography */}
        {isOpen && (
          <div
            role="menu"
            aria-label="Selección de nivel adaptativo CEFR"
            className={`absolute top-full mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#09090E] border border-white/10 backdrop-blur-3xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-1.5 z-50 flex flex-col gap-0.5 overflow-hidden animate-[fadeSlideDown_0.15s_ease-out] transition-all duration-200 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Nivel Adaptativo
              </span>
              <span className="text-[10px] font-mono text-white/20">CEFR Standard</span>
            </div>

            {/* Level Items — Pure Monochrome, Zero Borders, Zero AI Dots */}
            {CEFR_LEVELS.map((item) => {
              const isSelected = item.code === activeCode;
              return (
                <button
                  key={item.code}
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    onSelectLevel(item.code);
                    setIsOpen(false);
                  }}
                  className={`group w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-xs ${
                        isSelected ? "text-white font-medium" : "text-white/80 group-hover:text-white font-normal"
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] font-light leading-snug ${
                        isSelected ? "text-white/40" : "text-white/25 group-hover:text-white/40"
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>

                  {/* Clean Monospace Level Code — Pure typography, zero box, zero color */}
                  <span
                    className={`font-mono text-xs tracking-wider ${
                      isSelected ? "text-white font-semibold" : "text-white/20 group-hover:text-white/50"
                    }`}
                  >
                    {item.code}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);


