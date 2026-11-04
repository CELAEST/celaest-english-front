import React from "react";
import { PathwayStepId } from "../../../../domain/entities/LearningPathway";

export interface MockClassroomProps {
  activeStep: PathwayStepId;
}

export const PathwayHeaderMockClassroom: React.FC<MockClassroomProps> = ({ activeStep }) => (
  <div className="flex-1 w-full flex flex-col justify-center items-center px-4 py-6 select-none">
    {activeStep === "RULE" && (
      <div className="w-full max-w-md my-auto space-y-3 text-center sm:text-left">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">La Regla Visual</span>
        <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight">Acciones y Rutinas Diarias</h3>
        <p className="text-xs sm:text-sm text-white/50 font-light leading-relaxed">
          En inglés las rutinas van sin auxiliares en afirmativo: Sujeto + Verbo Base.
        </p>
      </div>
    )}

    {activeStep === "BUILD" && (
      <div className="w-full max-w-md my-auto space-y-4">
        <div>
          <span className="text-[9.5px] font-mono uppercase tracking-[0.2em] text-[#A27FF3] block">Tu turno de construir</span>
          <h3 className="text-lg sm:text-xl font-light text-white tracking-tight mt-0.5">
            Arma en inglés: Nosotros estudiamos inglés aquí
          </h3>
        </div>
        <div className="h-10 border-b border-white/20 flex items-center">
          <span className="text-xs text-white/30 font-light">Toca las palabras de abajo en orden...</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {["English", "We", "are", "here", "study"].map((word) => (
            <span
              key={word}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/80 font-mono"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    )}

    {activeStep === "SPEAK" && (
      <div className="w-full max-w-md my-auto space-y-3 text-center sm:text-left">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A27FF3]">Certificación de Voz</span>
        <p className="text-xl sm:text-2xl font-light text-white tracking-tight">“We study English here”</p>
        <span className="text-xs text-white/40 font-mono block">Pronúncialo frente al Profesor</span>
      </div>
    )}
  </div>
);

