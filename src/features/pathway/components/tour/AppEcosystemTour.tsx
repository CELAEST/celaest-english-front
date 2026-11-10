import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, X, BookOpen, Mic, PenTool, Layout, Compass, LucideIcon } from "lucide-react";
import { ECOSYSTEM_TOUR_STEPS, TourStep } from "./tourStepsData";

interface AppEcosystemTourProps {
  isOpen: boolean;
  userId?: string | undefined;
  onClose: () => void;
}

const STEP_ICONS: Record<TourStep["iconName"], LucideIcon> = {
  board: Layout,
  mic: Mic,
  book: BookOpen,
  pen: PenTool,
  sparkles: Sparkles,
  compass: Compass,
};

export const AppEcosystemTour: React.FC<AppEcosystemTourProps> = ({
  isOpen,
  userId = "default",
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = ECOSYSTEM_TOUR_STEPS[currentIndex] ?? ECOSYSTEM_TOUR_STEPS[0];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === ECOSYSTEM_TOUR_STEPS.length - 1;
  const StepIcon = STEP_ICONS[currentStep.iconName] ?? Sparkles;

  const handleFinish = () => {
    try {
      localStorage.setItem(`lingua_ecosystem_tour_seen_${userId}`, "true");
    } catch {
      // safe fallback
    }
    onClose();
  };

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => Math.min(prev + 1, ECOSYSTEM_TOUR_STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out_both] select-none"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-black/90 border border-white/[0.12] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col gap-5 overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-[#A27FF3]/15 blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">
              GUÍA DEL SISTEMA
            </span>
            <span className="text-white/20 text-xs">•</span>
            <span className="text-[10px] font-mono text-white/50">{currentStep.number}</span>
          </div>

          <button
            type="button"
            onClick={handleFinish}
            className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 rounded-md"
            title="Saltar tour"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step Body */}
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center text-[#A27FF3] shrink-0">
              <StepIcon size={20} />
            </div>
            <div>
              <span className="inline-block text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#A27FF3] bg-[#A27FF3]/10 px-2 py-0.5 rounded-full mb-1">
                {currentStep.highlightPill}
              </span>
              <h3 className="text-base sm:text-lg font-medium text-white tracking-tight leading-snug">
                {currentStep.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#DDD6FE]/80 font-light italic">
            {currentStep.tagline}
          </p>

          <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed font-light">
            {currentStep.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {ECOSYSTEM_TOUR_STEPS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? "w-6 bg-[#A27FF3]" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors cursor-pointer ${
              isFirst ? "opacity-20 cursor-not-allowed" : ""
            }`}
          >
            <ArrowLeft size={13} />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              Saltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#A27FF3] hover:bg-[#8B5CF6] text-white text-xs font-medium shadow-[0_0_16px_rgba(162,127,243,0.35)] transition-all cursor-pointer"
            >
              <span>{isLast ? "Comenzar" : "Siguiente"}</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
