import React from "react";
import { ANATOMY_SHOWCASE } from "../../data/englishAnatomyShowcase";
import { ShowcaseAudioSentence } from "./ShowcaseAudioSentence";

export interface AnatomyShowcaseExampleProps {
  pillarId: string;
  speakingText: string | null;
  onPlayAudio: (text: string) => void;
}

export const AnatomyShowcaseExample: React.FC<AnatomyShowcaseExampleProps> = ({
  pillarId, speakingText, onPlayAudio,
}) => {
  const showcase = ANATOMY_SHOWCASE[pillarId];
  if (!showcase) return null;
  const isSpeaking = speakingText === showcase.correct;

  return (
    <div className="space-y-2 py-1 select-none">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block">
        Ejemplo del tema
      </span>

      {/* Vista Mobile: flujo vertical compacto (screenshot original) */}
      <div className="sm:hidden space-y-1.5">
        <p className="text-[13px] text-white/45 font-light">
          <span className="text-[#F43F5E] font-mono mr-2" aria-label="Incorrecto">✗</span>
          <span className="line-through decoration-[#F43F5E]/60">{showcase.wrong}</span>
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-[#4ADE80] font-mono" aria-label="Correcto">✓</span>
          <ShowcaseAudioSentence
            sentence={showcase.correct}
            highlight={showcase.highlight}
            isSpeaking={isSpeaking}
            onPlay={() => onPlayAudio(showcase.correct)}
          />
        </div>
        <p className="text-xs text-white/50 font-light pl-5">{showcase.spanish}</p>
      </div>

      {/* Vista PC / Desktop: contraste horizontal en 2 columnas con tipografía flotante */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-6 items-start pt-0.5">
        <div className="space-y-1 pr-4 border-r border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#F43F5E]/80 block">
            ✗ Error Común
          </span>
          <p className="text-[13.5px] text-white/40 font-light line-through decoration-[#F43F5E]/60">
            {showcase.wrong}
          </p>
          <p className="text-[11px] text-white/35 font-light">
            Interferencia del español
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#4ADE80]/80 block">
            ✓ Estructura Correcta
          </span>
          <ShowcaseAudioSentence
            sentence={showcase.correct}
            highlight={showcase.highlight}
            isSpeaking={isSpeaking}
            onPlay={() => onPlayAudio(showcase.correct)}
          />
          <p className="text-xs text-white/50 font-light">{showcase.spanish}</p>
        </div>
      </div>
    </div>
  );
};
