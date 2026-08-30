import React, { useState } from "react";

const SPEED_OPTIONS = [
  { label: "0.75x", value: 0.75 },
  { label: "0.85x", value: 0.85 },
  { label: "0.95x", value: 0.95 },
  { label: "1.00x", value: 1.0 },
  { label: "1.15x", value: 1.15 },
];

export interface ResponsiveInterviewHUDProps {
  currentRound?: number;
  currentQuestion?: number;
  totalQuestions?: number;
  roleName?: string;
  speechRate?: number;
  onSetSpeechRate?: (rate: number) => void;
  onRepeatQuestion?: () => void;
  onNextQuestion?: () => void;
  onOpenDrawer: () => void;
  onOpenAnalysisModal?: () => void;
  hasFeedback?: boolean;
}

export const ResponsiveInterviewHUD: React.FC<ResponsiveInterviewHUDProps> = ({
  currentRound = 1,
  currentQuestion = 1,
  totalQuestions = 5,
  roleName = "Product Manager",
  speechRate = 0.95,
  onSetSpeechRate,
  onRepeatQuestion,
  onNextQuestion,
  onOpenDrawer,
  onOpenAnalysisModal,
  hasFeedback = false,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  return (
    <nav
      aria-label="Interview HUD"
      className="w-full flex xl:hidden items-center justify-between px-3 sm:px-6 py-2.5 bg-transparent select-none z-30 shrink-0 font-sans"
    >
      {/* 1. TOP-LEFT: Clean Telemetry (High-End Inter Typography, Amethyst Accent, Balanced Proportions) */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="font-sans text-xs font-semibold tracking-wider text-white/60">
          ROUND {currentRound.toString().padStart(2, "0")}
        </span>
        <span className="text-white/20 font-sans">·</span>
        <span className="font-sans text-xs font-bold tracking-tight bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE] bg-clip-text text-transparent drop-shadow-[0_1px_4px_rgba(167,139,250,0.25)]">
          {currentQuestion.toString().padStart(2, "0")}/{totalQuestions.toString().padStart(2, "0")}
        </span>
        <span className="text-white/20 font-sans hidden sm:inline">·</span>
        <span className="font-sans text-xs font-medium text-white/80 tracking-normal truncate max-w-[140px] sm:max-w-[240px] hidden sm:inline">
          {roleName}
        </span>
      </div>

      {/* 2. TOP-RIGHT: Semantic Action Controls (Bespoke Handcrafted SVGs, Zero AI Look, Perfect Baseline) */}
      <div className="flex items-center space-x-4 sm:space-x-5">
        {/* A. Repeat Question Action (Bespoke Audio Loop SVG + Nucleus) */}
        {onRepeatQuestion && (
          <button
            type="button"
            onClick={onRepeatQuestion}
            className="h-6 inline-flex items-center space-x-1.5 text-white/70 hover:text-white transition-all duration-200 cursor-pointer group leading-none hover:scale-105 active:scale-95"
            title="Repetir pregunta en voz alta"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0 transform group-hover:-rotate-45 transition-transform duration-300 text-white/60 group-hover:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 2.7-6.4L2.5 8" />
              <path d="M2.5 3v5h5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-xs font-sans font-semibold tracking-tight hidden md:inline">
              Repetir
            </span>
          </button>
        )}

        {/* B. Voice Speed Selector (Bespoke Precision Tachometer Dial SVG + Value + Chevron) */}
        <div className="relative inline-flex items-center">
          <button
            type="button"
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="h-6 inline-flex items-center space-x-1.5 text-white/70 hover:text-white transition-all duration-200 cursor-pointer group leading-none hover:scale-105 active:scale-95"
            title="Velocidad de voz de la IA"
          >
            <svg
              className="w-3.5 h-3.5 text-white/60 group-hover:text-white shrink-0 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5.6 18.4A9 9 0 1 1 18.4 18.4" strokeWidth="1.5" />
              <line x1="12" y1="12" x2="16.5" y2="7.5" stroke="currentColor" strokeWidth="1.75" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="font-sans text-xs font-semibold tracking-tight text-white/80 group-hover:text-white transition-colors">
              {speechRate.toFixed(2)}x
            </span>
            <svg
              className={`w-3 h-3 text-white/40 group-hover:text-white/70 transition-transform duration-200 shrink-0 ${
                showSpeedMenu ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showSpeedMenu && (
            <>
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setShowSpeedMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-24 bg-[#080914] border border-white/10 rounded-xl p-1 shadow-2xl z-50 animate-[fadeSlideDown_0.15s_ease-out]">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSetSpeechRate?.(opt.value);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-sans font-medium transition-colors ${
                      Math.abs(speechRate - opt.value) < 0.01
                        ? "bg-[#7048E8] text-white font-semibold"
                        : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* C. Feedback Action (Vibrant Gold Gradient Inter Typography + Faceted Star Sparkle, Naked UI) */}
        {hasFeedback && onOpenAnalysisModal && (
          <button
            type="button"
            onClick={onOpenAnalysisModal}
            className="h-6 inline-flex items-center space-x-1.5 transition-all duration-200 cursor-pointer group leading-none hover:scale-105 active:scale-95"
            title="Ver análisis y retroalimentación detallada"
          >
            {/* Bespoke Gold Sparkle SVG */}
            <svg
              className="w-3.5 h-3.5 shrink-0 transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="url(#feedbackGoldGrad)"
                stroke="#FFAA00"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="1.6" fill="#FFFBEB" />
              <defs>
                <linearGradient
                  id="feedbackGoldGrad"
                  x1="2"
                  y1="2"
                  x2="22"
                  y2="22"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF7A00" />
                  <stop offset="0.5" stopColor="#FFAA00" />
                  <stop offset="1" stopColor="#FFD600" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gold Gradient Text */}
            <span className="text-xs font-bold font-sans tracking-tight bg-gradient-to-r from-[#FF7A00] via-[#FFAA00] to-[#FFD600] bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-200 drop-shadow-[0_1px_4px_rgba(255,140,0,0.25)]">
              Feedback
            </span>
          </button>
        )}

        {/* D. Siguiente Pregunta Action (Amethyst-Lavender Cosmic Gradient Inter Typography, Perfectly Leveled) */}
        {onNextQuestion && (
          <button
            type="button"
            onClick={onNextQuestion}
            className="h-6 inline-flex items-center space-x-1.5 transition-all duration-200 cursor-pointer group leading-none hover:scale-105 active:scale-95"
            title="Pasar a la siguiente pregunta"
          >
            <span className="text-xs font-bold font-sans tracking-tight bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-[#DDD6FE] bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-200 drop-shadow-[0_1px_4px_rgba(167,139,250,0.25)] hidden sm:inline">
              Siguiente
            </span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-200 text-[#C4B5FD] group-hover:text-[#EDE9FE] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        )}

        {/* E. Cards Panel Drawer Trigger (Bespoke Handcrafted Right-Sidebar Card Inspector SVG) */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="h-6 inline-flex items-center text-white/60 hover:text-white transition-all duration-200 cursor-pointer group leading-none hover:scale-105 active:scale-95"
          title="Abrir panel de tarjetas y métricas de sesión"
        >
          <svg
            className="w-3.5 h-3.5 shrink-0 text-white/60 group-hover:text-white transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Precision frame with 3px border radius */}
            <rect x="3" y="3.5" width="18" height="17" rx="3" strokeWidth="1.5" />
            {/* Right sidebar split rail */}
            <line x1="14.5" y1="3.5" x2="14.5" y2="20.5" strokeWidth="1.5" />
            {/* Stacked floating card tiles inside the sidebar */}
            <rect
              x="16.5"
              y="6.5"
              width="3"
              height="4.5"
              rx="0.8"
              fill="currentColor"
              stroke="none"
              fillOpacity="0.75"
            />
            <rect
              x="16.5"
              y="13"
              width="3"
              height="4.5"
              rx="0.8"
              fill="currentColor"
              stroke="none"
              fillOpacity="0.35"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
