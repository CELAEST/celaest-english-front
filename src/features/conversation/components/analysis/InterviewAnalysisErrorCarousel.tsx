import React, { useState } from "react";
import {
  X,
  Check,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Bookmark,
  BookOpen,
} from "lucide-react";
import { SpecificErrorItem } from "../../services/interviewEngineService";
import { TopHighlight, cleanRuleNote } from "./analysisHelpers";

export interface InterviewAnalysisErrorCarouselProps {
  errors: SpecificErrorItem[];
  userSpokenText?: string;
  savedErrorIds: Set<string>;
  onSaveSpecificError: (errorItem: SpecificErrorItem) => Promise<boolean>;
  onSaveAllErrors: () => Promise<number>;
  onNavigateToMemory?: (() => void) | undefined;
}

export const InterviewAnalysisErrorCarousel: React.FC<InterviewAnalysisErrorCarouselProps> = ({
  errors,
  userSpokenText = "",
  savedErrorIds,
  onSaveSpecificError,
  onSaveAllErrors,
  onNavigateToMemory,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);

  const currentError = errors[index] || errors[0];

  const goNav = (dir: number) => {
    if (errors.length === 0) return;
    setIndex((prev) => (prev + dir + errors.length) % errors.length);
  };

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    await onSaveAllErrors();
    setIsSavingAll(false);
  };

  if (errors.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#18152e] bg-[#070611] shadow-2xl flex items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-8">
        <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#16122e] border border-[#271f4f]">
          <CircleCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#6ce2a3]" strokeWidth={2.5} />
        </span>
        <p className="text-[13.5px] sm:text-[15px] font-normal text-white/90 tracking-wide text-center leading-relaxed">
          {userSpokenText.split(/\s+/).filter(Boolean).length < 20
            ? "Respuesta breve sin errores gramaticales directos. Te sugerimos ampliar tu argumento con ejemplos de tu experiencia técnica."
            : "Excelente precisión gramatical en tu respuesta. No se detectaron errores sintácticos."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="mb-3.5 sm:mb-4 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base sm:text-[17px] font-semibold text-white tracking-tight">Análisis de mejora</h3>
          <span className="text-xs sm:text-[12.5px] font-medium text-[#8a8a9e]">
            • {errors.length} {errors.length === 1 ? "corrección" : "correcciones"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToMemory && (
            <button
              onClick={onNavigateToMemory}
              className="text-xs text-[#8a8a9e] hover:text-white underline transition-colors cursor-pointer hidden sm:inline-block mr-2"
            >
              Ver en Memory Bank →
            </button>
          )}
          {savedErrorIds.has(currentError.id) && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#6ce2a3]">
              <CircleCheck className="h-4 w-4" strokeWidth={2.5} />
              Guardado
            </span>
          )}
          <button
            onClick={handleSaveAll}
            disabled={isSavingAll}
            className="flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#a7a8b5] hover:text-white transition-colors cursor-pointer"
          >
            <Bookmark className="h-4 w-4" fill={isSavingAll ? "currentColor" : "none"} />
            {isSavingAll ? "Guardando..." : "Guardar todo"}
          </button>
        </div>
      </div>

      {/* 3-Piece Layout */}
      <div
        className="
          relative grid items-start gap-x-4 gap-y-3
          [grid-template-columns:1fr]
          md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.05fr)]
          md:[grid-template-rows:auto_auto_4.5rem]
        "
      >
        {/* Error Card */}
        <article
          className="edge relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-7 md:self-stretch md:[grid-area:1/1/4/2] flex flex-col justify-between"
          style={{
            background:
              "radial-gradient(110% 90% at 0% 0%, rgba(216,102,122,0.06), transparent 60%), radial-gradient(120% 80% at 30% 100%, rgba(216,102,122,0.03), transparent 65%), #090A14",
            ["--edge" as string]:
              "linear-gradient(160deg, rgba(216,102,122,0.55), rgba(216,102,122,0.14) 35%, rgba(216,102,122,0.05) 70%, rgba(255,255,255,0.04))",
          }}
        >
          <TopHighlight />
          <div>
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 shrink-0 text-[#d8667a]" aria-hidden="true" strokeWidth={2.5} />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#d8667a]">
                  INCORRECTO / POCO CLARO
                </span>
              </div>
              {currentError.errorType && (
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#8a8a9e] uppercase">
                  {currentError.errorType}
                </span>
              )}
            </div>
            <p className="relative mt-3.5 sm:mt-4 text-lg sm:text-xl font-medium text-[#b0b1c0] line-through decoration-[#d8667a]/60 decoration-1 leading-snug">
              {currentError.errorWord}
            </p>
          </div>

          <div className="relative mt-5 sm:mt-6 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#6f7180]">
              <span className="font-medium">Nivel CEFR:</span>
              <span className="font-semibold text-[#f4f4f7]">{currentError.cefrLevel || "B2"}</span>
            </div>

            <button
              onClick={() => onSaveSpecificError(currentError)}
              disabled={savedErrorIds.has(currentError.id)}
              className={`transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium ${
                savedErrorIds.has(currentError.id) ? "text-[#55c9a4] cursor-default" : "text-[#8a8a9e] hover:text-white"
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" fill={savedErrorIds.has(currentError.id) ? "currentColor" : "none"} />
              <span>{savedErrorIds.has(currentError.id) ? "Guardado" : "Guardar en Memory"}</span>
            </button>
          </div>
        </article>

        {/* Decorative arrow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[4.75rem] z-20 hidden -translate-x-1/2 -translate-y-1/2 text-[#a27ff3]/55 md:block"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
        </span>

        {/* Success Card */}
        <article
          className="edge relative z-10 overflow-hidden self-start rounded-2xl p-4 sm:p-6 lg:p-7 md:[grid-area:1/2/2/3]"
          style={{
            background: "radial-gradient(110% 90% at 100% 0%, rgba(85,201,164,0.06), transparent 60%), #090A14",
            ["--edge" as string]:
              "linear-gradient(160deg, rgba(85,201,164,0.55), rgba(85,201,164,0.14) 35%, rgba(85,201,164,0.05) 70%, rgba(255,255,255,0.04))",
          }}
        >
          <TopHighlight />
          <div className="relative flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-[#55c9a4]" aria-hidden="true" strokeWidth={2.5} />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#55c9a4]">MEJOR OPCIÓN</span>
          </div>
          <p className="relative mt-3.5 sm:mt-4 text-lg sm:text-xl font-medium text-[#55c9a4] sm:text-[1.4rem] sm:leading-snug">
            {currentError.correctWord}
          </p>
          {currentError.translationSpanish && (
            <div className="relative mt-3 sm:mt-3.5">
              <p className="text-[10px] sm:text-[11px] font-semibold text-[#8a8a9e] uppercase tracking-wider">Traducción al español:</p>
              <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#d4d4e0]">
                {cleanRuleNote(currentError.translationSpanish)}
              </p>
            </div>
          )}
        </article>

        {/* Grammar Rule Card */}
        <div
          className="edge relative z-10 self-start rounded-xl px-4 py-3.5 md:ml-8 md:[grid-area:2/1/3/3] lg:ml-10"
          style={{
            background: "#0B0C16",
            ["--edge" as string]:
              "linear-gradient(160deg, rgba(162,127,243,0.40), rgba(162,127,243,0.10) 45%, rgba(255,255,255,0.03))",
          }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#a27ff3]" aria-hidden="true" />
            <span className="text-xs font-semibold text-[#f4f4f7]">Regla gramatical:</span>
          </div>
          <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#d4d4e0]">
            {cleanRuleNote(currentError.explanation, currentError.translationSpanish)}
          </p>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => goNav(-1)}
          disabled={errors.length <= 1}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label="Ir a la corrección anterior"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Anterior</span>
        </button>

        {errors.length > 1 && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-[#6f7180]">{index + 1} de {errors.length}</span>
            <nav aria-label="Progreso de correcciones" className="flex items-center gap-1.5">
              {errors.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Ir a corrección ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`transition-all cursor-pointer ${
                    i === index ? "h-1.5 w-6 rounded-full bg-[#9d7cf0]" : "h-1.5 w-1.5 rounded-full bg-white/[0.12] hover:bg-[#8a8a9e]"
                  }`}
                />
              ))}
            </nav>
          </div>
        )}

        <button
          onClick={() => goNav(1)}
          disabled={errors.length <= 1}
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          aria-label="Ir a la siguiente corrección"
        >
          <span>Siguiente</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
