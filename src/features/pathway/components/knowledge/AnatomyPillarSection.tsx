import React from "react";
import { Volume2 } from "lucide-react";
import { AnatomyPillar } from "../../data/englishAnatomyData";
import { AnatomyShowcaseExample } from "./AnatomyShowcaseExample";
import { HighlightedSentence } from "./HighlightedSentence";

export interface AnatomyPillarSectionProps {
  pillar: AnatomyPillar;
  speakingText: string | null;
  onPlayAudio: (text: string) => void;
  children?: React.ReactNode;
}

export const AnatomyPillarSection: React.FC<AnatomyPillarSectionProps> = ({
  pillar, speakingText, onPlayAudio, children,
}) => (
  <section className="space-y-3.5 py-1 animate-[fadeIn_0.2s_ease-out_both] select-none">
    {/* 1. Concepto & Explicación */}
    <div className="space-y-1">
      <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#A78BFA]">
        Bloque {pillar.number} · {pillar.tagline}
      </span>
      <h3 className="text-lg sm:text-xl font-normal text-white tracking-tight">{pillar.name}</h3>
      <p className="text-xs sm:text-[13px] text-white/70 font-light leading-relaxed">{pillar.humanConcept}</p>
    </div>

    {/* 2. Alerta de la trampa común del español */}
    <div className="py-2 border-y border-white/[0.06] text-xs sm:text-[12.5px] font-light leading-relaxed">
      <span className="font-mono text-[#F43F5E] uppercase tracking-wider mr-1.5 font-medium">Trampa común del español:</span>
      <span className="text-white/85">{pillar.spanishTrapRule}</span>
    </div>

    {/* 3. Desglose de piezas y frases */}
    <div className="divide-y divide-white/[0.04]">
      {pillar.items.map((item) => {
        const isSpeaking = speakingText === item.example.english;
        return (
          <div key={item.token} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-4 group">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm sm:text-base font-medium text-white">{item.token}</span>
                <span className="text-xs text-white/40 font-light">— {item.spanish}</span>
              </div>
              <p className="text-[11px] text-white/50 font-light">
                {item.roleNote}
                {item.example.comparisonNote && <span className="text-[#A78BFA]/80 ml-1.5 font-mono">({item.example.comparisonNote})</span>}
              </p>
            </div>
            <button
              type="button" onClick={() => onPlayAudio(item.example.english)}
              className="text-left flex items-baseline gap-2 cursor-pointer transition-colors pt-0.5 sm:pt-0"
              title={item.example.spanish}
            >
              <HighlightedSentence
                text={`“${item.example.english}”`}
                highlight={item.example.highlightToken}
                className={`text-xs sm:text-[13px] font-light transition-colors ${isSpeaking ? "text-[#A78BFA]" : "text-white/80 group-hover:text-white"}`}
              />
              <Volume2 size={12} aria-hidden className={`shrink-0 transition-colors ${isSpeaking ? "text-[#A78BFA] animate-pulse" : "text-white/30 group-hover:text-[#A78BFA]"}`} />
            </button>
          </div>
        );
      })}
    </div>

    {/* Bloque previo (p. ej. Fórmula Universal en bloque 14) */}
    {children}

    {/* 4. Ejemplo del tema al final ("de últimas" como culminación en PC y Mobile) */}
    <div className="pt-2 border-t border-white/[0.06]">
      <AnatomyShowcaseExample pillarId={pillar.id} speakingText={speakingText} onPlayAudio={onPlayAudio} />
    </div>
  </section>
);
