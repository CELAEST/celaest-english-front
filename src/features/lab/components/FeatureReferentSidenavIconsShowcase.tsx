import React, { useState } from "react";
import { motion } from "framer-motion";

export type IconStyleSet = "cyber_minimalist" | "linear_clean" | "architectural_pro" | "celestial_flow";

interface IconProps {
  isActive?: boolean;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

/* ==========================================================================
   CYBER MINIMALIST EVOLVED ★ (Tu Selección Personalizada)
   - Cards: Las de Rec (100% las originales que pediste).
   - Workspace: Asymmetric Modern Bento (diferente, fresco y súper limpio).
   - Reading: Open Folio con cinta marcadora superior (diferente y editorial).
   - Settings: Sliders de consola táctil con muesca central de hardware.
   - Interview, Writing y Lab: Intactos (los que te gustaron).
   ========================================================================== */

/**
 * 1. WORKSPACE: Asymmetric Modern Bento (Diferente pero Ultra-Limpio)
 * Un panel maestro vertical a la izquierda + 2 paneles apilados a la derecha.
 * Rompe la monotonía de los 4 cuadrados idénticos y evoca un dashboard real.
 */
export const CyberWorkspaceIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Panel Maestro Vertical Izquierdo */}
    <rect
      x="2.5"
      y="2.5"
      width="4.8"
      height="11"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.35 : 0}
    />
    {/* Panel Superior Derecho */}
    <rect
      x="8.7"
      y="2.5"
      width="4.8"
      height="4.8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
      opacity={isActive ? 1 : 0.75}
    />
    {/* Panel Inferior Derecho */}
    <rect
      x="8.7"
      y="8.7"
      width="4.8"
      height="4.8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
  </svg>
);

/**
 * 2. MEMORY VAULT: Las Cards de Rec (Exactamente las que pediste)
 * La baraja escalonada original de Linear Clean (Rec) con máxima pureza.
 */
export const CyberMemoryIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Tarjeta de fondo de Rec */}
    <path
      d="M5.5 2.5h6a1.5 1.5 0 0 1 1.5 1.5v6"
      opacity={isActive ? 0.7 : 0.45}
    />
    {/* Tarjeta frontal de Rec */}
    <rect
      x="3"
      y="5.5"
      width="8"
      height="8"
      rx="1.5"
      fill={isActive ? "currentColor" : "none"}
    />
  </svg>
);

/**
 * 3. INTERVIEW: Ecualizador de Voz Espectral (El que te gustó)
 * 5 barras armónicas resonantes de oratoria sin cajas pesadas.
 */
export const CyberInterviewIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
  >
    <line x1="2.8" y1="7" x2="2.8" y2="9" opacity={isActive ? 1 : 0.6} />
    <line x1="5.4" y1="4.5" x2="5.4" y2="11.5" strokeWidth={strokeWidth + 0.2} />
    <line x1="8" y1="2" x2="8" y2="14" strokeWidth={strokeWidth + 0.4} />
    <line x1="10.6" y1="4.5" x2="10.6" y2="11.5" strokeWidth={strokeWidth + 0.2} />
    <line x1="13.2" y1="7" x2="13.2" y2="9" opacity={isActive ? 1 : 0.6} />
  </svg>
);

/**
 * 4. READING: Open Folio con Cinta Marcadora Superior (Diferente y Editorial)
 * Libro abierto simétrico con lomo central y cinta que asoma arriba.
 * Muy limpio, sin rayitas que ensucien el interior.
 */
export const CyberReadingIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cinta marcadora superior de lectura editorial */}
    <path
      d="M6.8 2.2v4l1.2-.9 1.2.9v-4"
      fill={isActive ? "currentColor" : "none"}
      opacity={isActive ? 1 : 0.8}
    />
    {/* Hoja izquierda abierta con caída suave */}
    <path
      d="M2.5 4.8A2 2 0 0 1 8 5.4v7.1A2 2 0 0 0 2.5 11.5V4.8z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    {/* Hoja derecha abierta */}
    <path
      d="M13.5 4.8A2 2 0 0 0 8 5.4v7.1a2 2 0 0 1 5.5-1V4.8z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
  </svg>
);

/**
 * 5. WRITING: Estilete Angular Micro-Ingeniería (El que te gustó)
 */
export const CyberWritingIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M11.8 2.5l1.7 1.7-7.2 7.2L3 13l1.6-3.3 7.2-7.2z"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    <line x1="9.8" y1="4.5" x2="11.5" y2="6.2" opacity={0.7} />
  </svg>
);

/**
 * 6. LAB: Matraz Cónico con Destello Cuántico (El que te gustó)
 */
export const CyberLabIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M6.5 2.5h3 M7.5 2.5v3L3.5 12a1.2 1.2 0 0 0 1 1.8h7a1.2 1.2 0 0 0 1-1.8L8.5 5.5v-3"
      fill={isActive ? "currentColor" : "none"}
      fillOpacity={isActive ? 0.25 : 0}
    />
    <line x1="5.2" y1="9.8" x2="10.8" y2="9.8" opacity={0.8} />
    <circle cx="12.5" cy="3.5" r="0.8" fill="currentColor" />
  </svg>
);

/**
 * 7. SETTINGS: Sliders de Consola Táctil con Muesca Central (Diferente y Hardware)
 * Dos rieles amplios con botones cápsula redondeados y ranura vertical de hardware.
 * Elimina la confusión visual y transmite ajuste fino de sintetizador.
 */
export const CyberSettingsIcon: React.FC<IconProps> = ({
  isActive = false,
  className = "",
  size = 18,
  strokeWidth = 1.5,
}) => (
  <svg
    viewBox="0 0 16 16"
    width={size}
    height={size}
    style={{ width: `${size}px`, height: `${size}px` }}
    className={`shrink-0 ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Riel Superior */}
    <line x1="2.5" y1="5.5" x2="13.5" y2="5.5" opacity={0.5} />
    {/* Botón Deslizante Superior con Ranura Central */}
    <rect
      x="4.5"
      y="3.8"
      width="3.2"
      height="3.4"
      rx="1.2"
      fill={isActive ? "currentColor" : "#06060e"}
    />
    <line
      x1="6.1"
      y1="4.5"
      x2="6.1"
      y2="6.5"
      stroke={isActive ? "#06060e" : "currentColor"}
      opacity={0.8}
    />

    {/* Riel Inferior */}
    <line x1="2.5" y1="10.5" x2="13.5" y2="10.5" opacity={0.5} />
    {/* Botón Deslizante Inferior Desplazado */}
    <rect
      x="8.3"
      y="8.8"
      width="3.2"
      height="3.4"
      rx="1.2"
      fill={isActive ? "currentColor" : "#06060e"}
    />
    <line
      x1="9.9"
      y1="9.5"
      x2="9.9"
      y2="11.5"
      stroke={isActive ? "#06060e" : "currentColor"}
      opacity={0.8}
    />
  </svg>
);


/* ==========================================================================
   LINEAR CLEAN (Rec) — PRESERVADO INTACTO PARA REFERENCIA
   ========================================================================== */

export const LinearWorkspaceIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1.2" fill={isActive ? "currentColor" : "none"} />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1.2" fill={isActive ? "currentColor" : "none"} opacity={isActive ? 1 : 0.75} />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1.2" fill={isActive ? "currentColor" : "none"} opacity={isActive ? 1 : 0.75} />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1.2" fill={isActive ? "currentColor" : "none"} />
  </svg>
);

export const LinearMemoryIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 2.5h6a1.5 1.5 0 0 1 1.5 1.5v6" opacity={isActive ? 0.7 : 0.45} />
    <rect x="3" y="5.5" width="8" height="8" rx="1.5" fill={isActive ? "currentColor" : "none"} />
  </svg>
);

export const LinearInterviewIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5.5" y="2" width="5" height="7.5" rx="2.5" fill={isActive ? "currentColor" : "none"} />
    <path d="M3 6.5a5 5 0 0 0 10 0" />
    <line x1="8" y1="11.5" x2="8" y2="14" />
  </svg>
);

export const LinearReadingIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 4a2.5 2.5 0 0 1 5.5 1v7.5A2.5 2.5 0 0 0 2.5 11.5V4z" fill={isActive ? "currentColor" : "none"} />
    <path d="M13.5 4a2.5 2.5 0 0 0-5.5 1v7.5a2.5 2.5 0 0 1 5.5-1V4z" fill={isActive ? "currentColor" : "none"} />
  </svg>
);

export const LinearWritingIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5.2 12.8 2.5 13.5l.7-2.7L11.5 2.5z" fill={isActive ? "currentColor" : "none"} />
  </svg>
);

export const LinearLabIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 2.5h3 M7.5 2.5v3L3.5 12a1.2 1.2 0 0 0 1 1.8h7a1.2 1.2 0 0 0 1-1.8L8.5 5.5v-3" fill={isActive ? "currentColor" : "none"} />
    <line x1="5.2" y1="9.8" x2="10.8" y2="9.8" stroke={isActive ? "#06060e" : "currentColor"} opacity={0.8} />
  </svg>
);

export const LinearSettingsIcon: React.FC<IconProps> = ({ isActive = false, className = "w-4 h-4", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="2.5" y1="5.5" x2="13.5" y2="5.5" opacity={0.6} />
    <circle cx="5.5" cy="5.5" r="1.9" fill={isActive ? "currentColor" : "#06060e"} />
    <line x1="2.5" y1="10.5" x2="13.5" y2="10.5" opacity={0.6} />
    <circle cx="10.5" cy="10.5" r="1.9" fill={isActive ? "currentColor" : "#06060e"} />
  </svg>
);


/* ==========================================================================
   OTRAS FAMILIAS PARA COMPARACIÓN (Architectural Pro & Celestial Flow)
   ========================================================================== */

export const ArchWorkspaceIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="2.5" width="11" height="4.8" rx="1.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <rect x="2.5" y="9.2" width="5" height="4.3" rx="1.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <rect x="8.5" y="9.2" width="5" height="4.3" rx="1.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
  </svg>
);

export const ArchMemoryIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 2.5h6a1.2 1.2 0 0 1 1.2 1.2v6" opacity={isActive ? 0.75 : 0.45} />
    <rect x="3" y="5.5" width="8.2" height="8" rx="1.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <circle cx="7.1" cy="9.5" r="1" fill="currentColor" />
  </svg>
);

export const ArchInterviewIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5.2" y="2" width="5.6" height="7.2" rx="2.8" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <path d="M2.8 6.5a5.2 5.2 0 0 0 10.4 0" />
    <line x1="8" y1="11.7" x2="8" y2="14" />
    <line x1="5.5" y1="14" x2="10.5" y2="14" />
  </svg>
);

export const ArchReadingIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 3.5h4.2a1.2 1.2 0 0 1 1.3 1.2v7.8H2.5V3.5z" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <path d="M13.5 3.5H9.3a1.2 1.2 0 0 0-1.3 1.2v7.8h5.5V3.5z" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
  </svg>
);

export const ArchWritingIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.5 2.5l1 1a1.2 1.2 0 0 1 0 1.7L5.5 13.2l-3 .3.3-3L10.8 2.5a1.2 1.2 0 0 1 1.7 0z" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <line x1="9.5" y1="3.8" x2="12.2" y2="6.5" opacity={0.7} />
  </svg>
);

export const ArchLabIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2.5h4 M7 2.5v3.2L3.2 12.2a1 1 0 0 0 .9 1.3h7.8a1 1 0 0 0 .9-1.3L9 5.7V2.5" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <path d="M5.5 9.5C6.5 10 9.5 10 10.5 9.5" opacity={0.8} />
  </svg>
);

export const ArchSettingsIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="2.5" y1="5.5" x2="13.5" y2="5.5" opacity={0.6} />
    <rect x="4.5" y="4.2" width="3.2" height="2.6" rx="1.3" fill={isActive ? "currentColor" : "#06060e"} />
    <line x1="2.5" y1="10.5" x2="13.5" y2="10.5" opacity={0.6} />
    <rect x="8.3" y="9.2" width="3.2" height="2.6" rx="1.3" fill={isActive ? "currentColor" : "#06060e"} />
  </svg>
);

export const FlowWorkspaceIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="2.5" width="4.8" height="4.8" rx="2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <rect x="8.7" y="2.5" width="4.8" height="4.8" rx="2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} opacity={isActive ? 1 : 0.8} />
    <rect x="2.5" y="8.7" width="4.8" height="4.8" rx="2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} opacity={isActive ? 1 : 0.8} />
    <rect x="8.7" y="8.7" width="4.8" height="4.8" rx="2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
  </svg>
);

export const FlowMemoryIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5.5 3h5a2 2 0 0 1 2 2v6" opacity={isActive ? 0.8 : 0.45} />
    <rect x="2.8" y="5" width="8.4" height="8.5" rx="2.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <line x1="5.2" y1="8" x2="8.8" y2="8" opacity={0.7} />
  </svg>
);

export const FlowInterviewIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="8" cy="8" r="2.2" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.35 : 0} />
    <path d="M4.5 5a4.8 4.8 0 0 0 0 6" />
    <path d="M11.5 5a4.8 4.8 0 0 1 0 6" />
    <path d="M2.5 3.2a7.5 7.5 0 0 0 0 9.6" opacity={0.7} />
    <path d="M13.5 3.2a7.5 7.5 0 0 1 0 9.6" opacity={0.7} />
  </svg>
);

export const FlowReadingIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 4C4.5 3.5 6.5 4.5 8 5.5C9.5 4.5 11.5 3.5 13.5 4v7.5C11.5 11 9.5 12 8 13C6.5 12 4.5 11 2.5 11.5V4z" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <line x1="8" y1="5.5" x2="8" y2="13" opacity={0.6} />
  </svg>
);

export const FlowWritingIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.8 2.5a1.2 1.2 0 0 1 1.7 1.7L5.8 13 2.5 13.5l.5-3.3L12.8 2.5z" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <path d="M3.2 14c1.2-.8 3-.5 4.8-.8" opacity={0.7} />
  </svg>
);

export const FlowLabIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="8,2.2 13.8,13 2.2,13" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.22 : 0} />
    <line x1="4.8" y1="10" x2="11.2" y2="6.5" opacity={0.8} />
  </svg>
);

export const FlowSettingsIcon: React.FC<IconProps> = ({ isActive = false, className = "", size = 18, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 16 16" width={size} height={size} style={{ width: `${size}px`, height: `${size}px` }} className={`shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="3.5" width="11" height="4.2" rx="2.1" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <circle cx="5" cy="5.6" r="1.3" fill="currentColor" />
    <rect x="2.5" y="9.2" width="11" height="4.2" rx="2.1" fill={isActive ? "currentColor" : "none"} fillOpacity={isActive ? 0.25 : 0} />
    <circle cx="11" cy="11.3" r="1.3" fill="currentColor" />
  </svg>
);


/* ==========================================================================
   INTERACTIVE LAB SHOWCASE COMPONENT
   ========================================================================== */

export const FeatureReferentSidenavIconsShowcase: React.FC = () => {
  const [selectedSet, setSelectedSet] = useState<IconStyleSet>("cyber_minimalist");
  const [activeTab, setActiveTab] = useState<string>("interview");
  const [inspectedFeature, setInspectedFeature] = useState<string>("workspace");
  const [iconSize, setIconSize] = useState<number>(20); // 16px, 18px, 20px
  const [strokeWeight, setStrokeWeight] = useState<number>(1.75); // 1.25, 1.5, 1.75

  const setDescriptors: Record<IconStyleSet, { title: string; badge: string; desc: string }> = {
    cyber_minimalist: {
      title: "Cyber Minimalist ★ (Tu Elección Personalizada)",
      badge: "TU SELECCIÓN REFINADA",
      desc: "Evolución a medida: Cards exactas de Rec + Workspace asimétrico moderno (panel maestro + 2 widgets) + Reading con cinta editorial + Settings con faders de consola táctil con ranura de hardware.",
    },
    linear_clean: {
      title: "Linear Clean (Rec)",
      badge: "EL ORIGINAL INTACTO",
      desc: "El diseño original conservado al 100% para referencia: Bento 2x2, cartas con profundidad, micrófono cápsula, libro simétrico, pluma a 45°, matraz con horizonte y rieles de precisión.",
    },
    architectural_pro: {
      title: "Architectural Pro",
      badge: "STRIPE & VERCEL",
      desc: "Geometría ortogonal ejecutiva con grid jerárquico, micrófono con base de pedestal sólida y faders horizontales.",
    },
    celestial_flow: {
      title: "Celestial Flow",
      badge: "APPLE HIG FLUID",
      desc: "Curvatura squircle continua y ondas acústicas radiantes estilo Siri.",
    },
  };

  const features = [
    {
      id: "workspace",
      label: "WORKSPACE",
      subtitle: "Asymmetric Modern Bento",
      tag: "NUEVO & LIMPIO",
      desc: "Un panel maestro vertical a la izquierda + 2 widgets apilados a la derecha. Rompe los 4 cuadrados idénticos con una estética moderna tipo Linear / Notion.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberWorkspaceIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearWorkspaceIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchWorkspaceIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowWorkspaceIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "memory",
      label: "MEMORY VAULT",
      subtitle: "Cards Exactas de Rec",
      tag: "DE REC ★",
      desc: "La baraja de cartas escalonadas exacta de Linear Clean (Rec) que pediste, con profundidad limpia y cero ruido.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberMemoryIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearMemoryIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchMemoryIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowMemoryIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "interview",
      label: "INTERVIEW",
      subtitle: "Ecualizador Espectral de Voz",
      tag: "APROBADO",
      desc: "5 barras armónicas resonantes de oratoria. Pura onda vocal de IA sin cajas ni micrófonos pesados.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberInterviewIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearInterviewIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchInterviewIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowInterviewIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "reading",
      label: "READING",
      subtitle: "Open Folio con Cinta Marcadora",
      tag: "NUEVO & LIMPIO",
      desc: "Libro abierto simétrico con cinta editorial superior. Sin micro-rayas que ensucien, pura silueta distinguida.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberReadingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearReadingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchReadingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowReadingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "writing",
      label: "WRITING STUDIO",
      subtitle: "Estilete Angular Micro-Ingeniería",
      tag: "APROBADO",
      desc: "Lápiz estilográfico angular a 45° con trazo limpio de bisel. Cero líneas de relleno artificial.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberWritingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearWritingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchWritingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowWritingIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "lab",
      label: "DESIGN LAB",
      subtitle: "Matraz Cónico con Destello Cuántico",
      tag: "APROBADO",
      desc: "Matraz de alquimia experimental con línea única de horizonte y partícula cuántica superior.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberLabIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearLabIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchLabIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowLabIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
    {
      id: "settings",
      label: "SETTINGS",
      subtitle: "Sliders Táctiles con Ranura de Hardware",
      tag: "NUEVO & LIMPIO",
      desc: "Dos rieles amplios con botones cápsula redondeados y ranura vertical central. Ajuste fino de hardware de audio.",
      renderers: {
        cyber_minimalist: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <CyberSettingsIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        linear_clean: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <LinearSettingsIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        architectural_pro: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <ArchSettingsIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
        celestial_flow: (active: boolean, sz = iconSize, sw = strokeWeight) => (
          <FlowSettingsIcon isActive={active} size={sz} strokeWidth={sw} />
        ),
      },
    },
  ];

  const currentFeatureData = features.find((f) => f.id === inspectedFeature) || features[0];
  const activeSetInfo = setDescriptors[selectedSet];

  return (
    <div className="w-full flex flex-col space-y-8 rounded-3xl bg-[#000003] border border-white/[0.08] p-6 lg:p-10 text-white shadow-[0_32px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] relative overflow-hidden select-none">
      {/* Ambient Glow */}
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-[#7048e8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-white/[0.07] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#A78BFA] px-2.5 py-0.5 rounded-full bg-[#7048e8]/20 border border-[#7048e8]/30 font-semibold">
              {activeSetInfo.badge}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              CELAEST SIDENAV SUITE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {activeSetInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1 leading-relaxed">
            {activeSetInfo.desc}
          </p>
        </div>

        {/* Style Paradigm Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl gap-1">
            <button
              onClick={() => setSelectedSet("cyber_minimalist")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedSet === "cyber_minimalist"
                  ? "bg-[#7048e8] text-white shadow-[0_0_16px_rgba(112,72,232,0.4)] font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              ★ Cyber Minimalist (A Medida)
            </button>
            <button
              onClick={() => setSelectedSet("linear_clean")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedSet === "linear_clean"
                  ? "bg-[#7048e8] text-white shadow-[0_0_16px_rgba(112,72,232,0.4)] font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Linear Clean (Rec)
            </button>
            <button
              onClick={() => setSelectedSet("architectural_pro")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedSet === "architectural_pro"
                  ? "bg-[#7048e8] text-white shadow-[0_0_16px_rgba(112,72,232,0.4)] font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Architectural Pro
            </button>
            <button
              onClick={() => setSelectedSet("celestial_flow")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedSet === "celestial_flow"
                  ? "bg-[#7048e8] text-white shadow-[0_0_16px_rgba(112,72,232,0.4)] font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Celestial Flow
            </button>
          </div>

          {/* Scale & Weight Controls */}
          <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/[0.06] p-1.5 rounded-xl text-[11px] font-mono text-zinc-400">
            <span>Escala:</span>
            {[16, 18, 20].map((s) => (
              <button
                key={s}
                onClick={() => setIconSize(s)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  iconSize === s ? "bg-white/20 text-white font-semibold" : "hover:text-white"
                }`}
              >
                {s}px
              </button>
            ))}
            <span className="text-zinc-600 pl-1">|</span>
            <span>Trazo:</span>
            {[1.25, 1.5, 1.75].map((w) => (
              <button
                key={w}
                onClick={() => setStrokeWeight(w)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  strokeWeight === w ? "bg-white/20 text-white font-semibold" : "hover:text-white"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Comparison & Live Interactive Sidenav Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Sidenav Dock Simulator */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>SIMULADOR SIDENAV EN VIVO ({iconSize}PX)</span>
            <span className="text-[#A78BFA]">PROBAR INTERACCIÓN</span>
          </div>

          <div className="relative p-6 rounded-2xl bg-[#030208] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center min-h-[460px]">
            {/* Simulated Desktop Vertical Rail */}
            <div className="w-16 py-4 px-2 rounded-2xl bg-[#06060e]/95 border border-white/[0.08] flex flex-col items-center space-y-2 shadow-[0_12px_32px_rgba(0,0,0,0.9)]">
              {/* Logo Mark */}
              <div className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                <span className="w-2 h-2 rounded-full bg-[#7048e8] shadow-[0_0_10px_#7048e8]" />
              </div>

              {/* Navigation Items */}
              {features.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setInspectedFeature(item.id);
                    }}
                    className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${
                      isActive ? "text-white" : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidenavIndicatorLabV6"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-xl z-0 bg-gradient-to-r from-[#7048e8] to-[#6038e0] shadow-[0_0_16px_rgba(112,72,232,0.4)]"
                      />
                    )}
                    <div className="relative z-10 flex items-center justify-center">
                      {item.renderers[selectedSet](isActive)}
                    </div>
                  </button>
                );
              })}

              <div className="pt-4 border-t border-white/[0.06] w-full flex justify-center">
                <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                  EP
                </div>
              </div>
            </div>

            {/* Context Tooltip Preview on Right */}
            <div className="ml-8 flex-1 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono text-[#A78BFA] uppercase tracking-wider">
                  SELECCIÓN:
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  {currentFeatureData.tag}
                </span>
              </div>
              <div className="text-sm font-semibold text-white mb-1">
                {currentFeatureData.label}
              </div>
              <div className="text-xs text-zinc-400 leading-relaxed mb-3">
                {currentFeatureData.desc}
              </div>
              <div className="text-[10px] font-mono px-2.5 py-1 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.06] inline-block">
                Dimensiones: {iconSize}px · Trazo: {strokeWeight}px
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed High-Definition Inspection Matrix */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span>MICROSCOPIO DE ANATOMÍA (DETALLE ÓPTICO & AIRE)</span>
            <span className="text-emerald-400">PURA PRECISIÓN</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#030208] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col space-y-6">
            {/* Feature Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.02] rounded-xl border border-white/[0.05]">
              {features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setInspectedFeature(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    inspectedFeature === f.id
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>{f.id}</span>
                  {f.tag.includes("NUEVO") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {f.tag.includes("REC") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                  )}
                </button>
              ))}
            </div>

            {/* Micro Inspection Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Inactive State */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  {iconSize}px En Reposo
                </span>
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-zinc-400">
                  {currentFeatureData.renderers[selectedSet](false)}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Línea Pura</span>
              </div>

              {/* Active State with Violet Glow Pill */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center space-y-3">
                <span className="text-[10px] font-mono text-[#A78BFA] uppercase tracking-widest">
                  {iconSize}px Con Píldora
                </span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#7048e8] to-[#6038e0] shadow-[0_0_16px_rgba(112,72,232,0.4)] flex items-center justify-center text-white">
                  {currentFeatureData.renderers[selectedSet](true)}
                </div>
                <span className="text-[10px] font-mono text-zinc-300">Alto Contraste</span>
              </div>

              {/* Magnified Macro */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  28px Vista Macro
                </span>
                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-[#A78BFA]">
                  {currentFeatureData.renderers[selectedSet](false, 28, strokeWeight)}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Sin Detalle Roto</span>
              </div>
            </div>

            {/* Design Principles & Semantic Rationale */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white tracking-tight">
                    {currentFeatureData.label} — {currentFeatureData.subtitle}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {currentFeatureData.tag}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">
                  {iconSize}×{iconSize}px Grid
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {currentFeatureData.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPARISON MATRIX: All 4 Paradigms Cara a Cara */}
      <div className="pt-6 border-t border-white/[0.07]">
        <div className="flex items-center justify-between mb-4 px-1">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Tabla Comparativa Cara a Cara
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Compara la suite a medida de Cyber Minimalist frente a las demás alternativas.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#A78BFA] bg-[#7048e8]/10 px-2.5 py-1 rounded border border-[#7048e8]/20">
            {iconSize}PX EN REPOSO
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-mono text-zinc-400">
                <th className="py-3 px-4 font-normal">HERRAMIENTA</th>
                <th className="py-3 px-4 font-normal text-white">
                  CYBER MINIMALIST ★ (A MEDIDA)
                </th>
                <th className="py-3 px-4 font-normal">LINEAR CLEAN (REC)</th>
                <th className="py-3 px-4 font-normal">ARCHITECTURAL PRO</th>
                <th className="py-3 px-4 font-normal">CELESTIAL FLOW</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {features.map((feat) => (
                <tr
                  key={feat.id}
                  onClick={() => setInspectedFeature(feat.id)}
                  className={`transition-colors cursor-pointer ${
                    inspectedFeature === feat.id ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{feat.label}</span>
                      {feat.tag.includes("NUEVO") && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                          NUEVO
                        </span>
                      )}
                      {feat.tag.includes("REC") && (
                        <span className="text-[9px] font-mono text-[#A78BFA] bg-[#7048e8]/20 px-1 py-0.5 rounded border border-[#7048e8]/30">
                          DE REC
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">/{feat.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-white">
                        {feat.renderers.cyber_minimalist(false, iconSize, strokeWeight)}
                      </div>
                      <span className="text-[10px] font-mono text-[#A78BFA] font-medium">Custom</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-zinc-300">
                        {feat.renderers.linear_clean(false, iconSize, strokeWeight)}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">Original</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-zinc-300">
                        {feat.renderers.architectural_pro(false, iconSize, strokeWeight)}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">Arch Pro</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-zinc-300">
                        {feat.renderers.celestial_flow(false, iconSize, strokeWeight)}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">Celestial</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
