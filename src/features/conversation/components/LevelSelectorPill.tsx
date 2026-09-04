import React, { useState, useRef, useEffect } from "react";
import { normalizeCefr, CefrLevelCode } from "../services/dynamicQuestionService";

export interface LevelSelectorPillProps {
  currentLevel: string;
  onSelectLevel: (level: CefrLevelCode) => void;
  roleName?: string;
}

const CEFR_LEVELS: Array<{
  code: CefrLevelCode;
  label: string;
  sublabel: string;
  badgeColor: string;
}> = [
  { code: "A1", label: "A1 — Acceso", sublabel: "Vocabulario básico y frases sencillas", badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { code: "A2", label: "A2 — Plataforma", sublabel: "Situaciones y tareas directas de equipo", badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30" },
  { code: "B1", label: "B1 — Umbral", sublabel: "Comunicación y flujos de trabajo en equipo", badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { code: "B2", label: "B2 — Avanzado", sublabel: "Fluidez profesional y metodología STAR", badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
  { code: "C1", label: "C1 — Dominio", sublabel: "Arquitectura, compensaciones y estrategia", badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30" },
  { code: "C2", label: "C2 — Maestría", sublabel: "Liderazgo ejecutivo nativo de alta escala", badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30" },
];

export const LevelSelectorPill: React.FC<LevelSelectorPillProps> = ({
  currentLevel,
  onSelectLevel,
  roleName,
}) => {
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
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-2 select-none z-30">
      {/* Role Tag (if provided) */}
      {roleName && (
        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-white/5 border border-white/10 text-slate-300">
          {roleName}
        </span>
      )}

      {/* Level Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all duration-200 border cursor-pointer ${activeMeta.badgeColor} hover:brightness-125 focus:outline-none focus:ring-1 focus:ring-violet-400/50 backdrop-blur-md shadow-sm`}
        title="Cambiar nivel de dificultad adaptativo"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-semibold">{activeMeta.code}</span>
        <span className="hidden xs:inline text-[11px] opacity-90">· {activeMeta.label.split(" — ")[1] || "Nivel"}</span>
        <svg
          className={`w-3 h-3 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-[#0d0d1b]/95 backdrop-blur-xl border border-white/15 shadow-2xl p-2 z-50 flex flex-col gap-1 animate-[fadeSlideDown_0.2s_ease-out_both]">
          <div className="px-3 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Nivel Adaptativo
            </span>
            <span className="text-[10px] text-violet-400 font-medium">CEFR Standard</span>
          </div>

          {CEFR_LEVELS.map((item) => {
            const isSelected = item.code === activeCode;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  onSelectLevel(item.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between transition-all ${
                  isSelected
                    ? "bg-violet-600/30 text-white border border-violet-500/40"
                    : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                    {item.label}
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    )}
                  </span>
                  <span className="text-[10px] text-slate-400 font-light">{item.sublabel}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeColor}`}>
                  {item.code}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
