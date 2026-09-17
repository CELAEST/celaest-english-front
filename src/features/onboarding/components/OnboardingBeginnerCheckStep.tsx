import React, { useState } from "react";
import { LearnerProfileData } from "../types";

export interface OnboardingBeginnerCheckStepProps {
  profile: LearnerProfileData;
  onSelectBeginner: (profession: string) => void;
  onSelectExperienced: () => void;
  onPrev: () => void;
}

const STARTING_TRACKS = [
  {
    id: "beginner",
    title: "Empiezo desde cero",
    subtitle: "No sé nada o casi nada de inglés. Empezarás directamente desde las bases (Nivel A1) sin ningún examen.",
    badge: "Sin test",
  },
  {
    id: "diagnostic",
    title: "Tengo conocimientos previos",
    subtitle: "Sé algo de inglés y quiero hacer una prueba rápida para conocer y certificar mi nivel exacto.",
    badge: "Test de nivel",
  },
];

export const OnboardingBeginnerCheckStep: React.FC<OnboardingBeginnerCheckStepProps> = ({
  profile,
  onSelectBeginner,
  onSelectExperienced,
  onPrev,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<"beginner" | "diagnostic">("beginner");

  const handleContinue = () => {
    if (selectedTrack === "beginner") {
      onSelectBeginner(profile.profession || "Professional");
    } else {
      onSelectExperienced();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      {/* Content Container */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent Header */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Center Section — Pure typography & borderless pills */}
        <div className="flex-1 flex flex-col justify-center max-w-xl min-h-0 my-auto py-1">
          {/* Title */}
          <div className="space-y-1 mb-4 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.4s_ease-out_both]">
              ¿Cuál es tu nivel de inglés?
              <br />
              <span className="text-[#A27FF3] font-light">Elige cómo deseas comenzar.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed animate-[fadeSlideUp_0.45s_ease-out_0.08s_both]">
              Si no tienes experiencia previa, configuraremos tu mentor en nivel inicial sin someterte a exámenes.
            </p>
          </div>

          {/* Track Selection Section */}
          <div className="space-y-2 mb-6 animate-[fadeSlideUp_0.4s_ease-out_0.16s_both]">
            <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
              Selecciona tu punto de partida
            </label>

            <div className="flex flex-col space-y-2">
              {STARTING_TRACKS.map((t) => {
                const selected = selectedTrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTrack(t.id as "beginner" | "diagnostic")}
                    className={`w-full text-left px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                      selected
                        ? "bg-white/[0.12] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                        : "bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs sm:text-[14px] leading-snug font-medium text-white">
                        {t.title}
                      </span>
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0">
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/40 font-light mt-1 leading-relaxed">
                      {t.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 animate-[fadeSlideUp_0.4s_ease-out_0.24s_both]">
            <button
              onClick={onPrev}
              type="button"
              className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>

            <button
              type="button"
              onClick={handleContinue}
              className="group inline-flex items-center justify-center px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-full text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{selectedTrack === "beginner" ? "Empezar en Nivel A1" : "Hacer Test de Nivel"}</span>
              <svg className="w-3.5 h-3.5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
