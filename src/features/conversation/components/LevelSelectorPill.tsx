import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { normalizeCefr, CefrLevelCode } from "../services/dynamicQuestionService";

export interface LevelSelectorPillProps {
  currentLevel: string;
  onSelectLevel: (level: CefrLevelCode) => void;
  roleName?: string;
  align?: "left" | "right";
  direction?: "up" | "down";
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
  function LevelSelectorPill({ currentLevel, onSelectLevel, roleName, align = "left", direction = "down", className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeCode = normalizeCefr(currentLevel);
    const activeMeta = CEFR_LEVELS.find((l) => l.code === activeCode) || CEFR_LEVELS[2];

    const [isMobile, setIsMobile] = useState<boolean>(() =>
      typeof window !== "undefined" ? window.innerWidth < 640 : false
    );

    // Gestural swipe-down to dismiss refs (AppModal standard)
    const sheetRef = useRef<HTMLDivElement>(null);
    const handlePillRef = useRef<HTMLDivElement>(null);
    const touchStartYRef = useRef(0);
    const touchDeltaRef = useRef(0);
    const isDraggingRef = useRef(false);
    const isPullingFromBodyRef = useRef(false);

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaRef.current = 0;
      isDraggingRef.current = true;
      if (handlePillRef.current) {
        handlePillRef.current.style.width = "48px";
        handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDraggingRef.current || !sheetRef.current) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - touchStartYRef.current;
      touchDeltaRef.current = delta;

      sheetRef.current.style.transition = "none";
      if (delta > 0) {
        sheetRef.current.style.transform = `translate3d(0, ${delta}px, 0)`;
        const opacity = Math.max(0.3, 1 - delta / 350);
        sheetRef.current.style.opacity = `${opacity}`;
      } else {
        sheetRef.current.style.transform = `translate3d(0, ${delta * 0.15}px, 0)`;
        sheetRef.current.style.opacity = "1";
      }
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      isPullingFromBodyRef.current = false;
      if (handlePillRef.current) {
        handlePillRef.current.style.width = "40px";
        handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
      }

      const delta = touchDeltaRef.current;
      if (sheetRef.current) {
        if (delta > 65) {
          sheetRef.current.style.transition = "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out";
          sheetRef.current.style.transform = "translate3d(0, 100%, 0)";
          sheetRef.current.style.opacity = "0";
          setTimeout(() => {
            setIsOpen(false);
            if (sheetRef.current) {
              sheetRef.current.style.transform = "";
              sheetRef.current.style.opacity = "";
              sheetRef.current.style.transition = "";
            }
          }, 200);
        } else {
          sheetRef.current.style.transition = "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out";
          sheetRef.current.style.transform = "translate3d(0, 0, 0)";
          sheetRef.current.style.opacity = "1";
        }
      }
      touchDeltaRef.current = 0;
    };

    const handleBodyTouchStart = (e: React.TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaRef.current = 0;
      if (sheetRef.current && sheetRef.current.scrollTop <= 0) {
        isPullingFromBodyRef.current = true;
      } else {
        isPullingFromBodyRef.current = false;
      }
    };

    const handleBodyTouchMove = (e: React.TouchEvent) => {
      if (!isPullingFromBodyRef.current || !sheetRef.current) return;
      if (sheetRef.current.scrollTop > 0) {
        isPullingFromBodyRef.current = false;
        return;
      }
      const currentY = e.touches[0].clientY;
      const delta = currentY - touchStartYRef.current;
      if (delta > 0) {
        isDraggingRef.current = true;
        touchDeltaRef.current = delta;
        sheetRef.current.style.transition = "none";
        sheetRef.current.style.transform = `translate3d(0, ${delta * 0.85}px, 0)`;
        const opacity = Math.max(0.3, 1 - (delta * 0.85) / 350);
        sheetRef.current.style.opacity = `${opacity}`;
        if (handlePillRef.current) {
          handlePillRef.current.style.width = "48px";
          handlePillRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
        }
      }
    };

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 640);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          const target = e.target as HTMLElement;
          if (!target.closest?.("[role='menu']")) {
            setIsOpen(false);
          }
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

        {/* Dropdown Popover — Native Mobile Bottom Sheet via Portal / Desktop Clean Floating Popover */}
        {isOpen && (
          <>
            {isMobile && typeof document !== "undefined"
              ? createPortal(
                  <div>
                    {/* Mobile Backdrop Overlay */}
                    <div
                      className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[90] animate-[fadeIn_0.15s_ease-out]"
                      onClick={() => setIsOpen(false)}
                      aria-hidden="true"
                    />

                    {/* Mobile Native Bottom Sheet (Docked to bottom-0 with swipe-down to dismiss) */}
                    <div
                      ref={sheetRef}
                      role="menu"
                      aria-modal="true"
                      aria-label="Selección de nivel adaptativo CEFR"
                      onTouchStart={handleBodyTouchStart}
                      onTouchMove={handleBodyTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onTouchCancel={handleTouchEnd}
                      className="fixed inset-x-0 bottom-0 z-[100] w-full max-w-lg mx-auto rounded-t-[28px] rounded-b-none bg-[#09090E]/95 border-t border-white/15 backdrop-blur-3xl shadow-[0_-16px_48px_rgba(0,0,0,0.95)] px-4 pt-2 pb-[max(2rem,env(safe-area-inset-bottom,2rem))] flex flex-col gap-1 max-h-[85dvh] overflow-y-auto no-scrollbar animate-[fadeSlideUp_0.22s_ease-out]"
                    >
                      {/* Interactive Drag Bar & Accessibility Handle */}
                      <div
                        className="w-full flex flex-col items-center pt-1.5 pb-2 cursor-grab active:cursor-grabbing touch-none select-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                        aria-label="Deslizar hacia abajo para cerrar"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") setIsOpen(false);
                        }}
                      >
                        <div
                          ref={handlePillRef}
                          className="w-10 h-1.5 rounded-full bg-white/25 transition-all duration-200"
                        />
                      </div>

                      {/* Header */}
                      <div className="px-2 py-1 flex items-center justify-between mb-1 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                          Nivel Adaptativo
                        </span>
                        <span className="text-[10px] font-mono text-white/30">CEFR Standard</span>
                      </div>

                      {/* Level Items */}
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
                            className={`group w-full text-left px-3.5 py-2.5 rounded-2xl text-xs flex items-center justify-between transition-colors duration-150 cursor-pointer min-h-[48px] active:scale-[0.98] ${
                              isSelected
                                ? "bg-white/[0.08] text-white"
                                : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                              <span
                                className={`text-xs ${
                                  isSelected ? "text-white font-medium" : "text-white/80 group-hover:text-white font-normal"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span
                                className={`text-[11px] font-light leading-snug truncate ${
                                  isSelected ? "text-white/40" : "text-white/25 group-hover:text-white/40"
                                }`}
                              >
                                {item.sublabel}
                              </span>
                            </div>

                            <span
                              className={`font-mono text-xs tracking-wider shrink-0 ${
                                isSelected ? "text-white font-semibold" : "text-white/20 group-hover:text-white/50"
                              }`}
                            >
                              {item.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>,
                  document.body
                )
              : (
                  /* Desktop In-Place Popover (100% Unchanged Desktop Standard) */
                  <div
                    role="menu"
                    aria-label="Selección de nivel adaptativo CEFR"
                    className={`absolute w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#09090E] border border-white/10 backdrop-blur-3xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] p-1.5 z-50 flex flex-col gap-0.5 overflow-hidden transition-all duration-200 ${
                      direction === "up"
                        ? `bottom-full mb-2 animate-[fadeIn_0.15s_ease-out] ${align === "right" ? "right-0" : "left-0"}`
                        : `top-full mt-2 animate-[fadeSlideDown_0.15s_ease-out] ${align === "right" ? "right-0" : "left-0"}`
                    }`}
                  >
                    {/* Header */}
                    <div className="px-3 py-2 flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                        Nivel Adaptativo
                      </span>
                      <span className="text-[10px] font-mono text-white/20">CEFR Standard</span>
                    </div>

                    {/* Level Items */}
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
          </>
        )}
      </div>
    );
  }
);


