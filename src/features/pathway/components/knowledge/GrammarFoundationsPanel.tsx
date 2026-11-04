import React from "react";
import { Volume2 } from "lucide-react";
import { PRONOUNS_DATA, VERBS_DATA } from "../../data/pathwayKnowledgeData";
import { GrammarPillarsIntro } from "./GrammarPillarsIntro";

export interface GrammarFoundationsPanelProps {
  playingText: string | null;
  onPlayAudio: (text: string) => void;
}

export const GrammarFoundationsPanel: React.FC<GrammarFoundationsPanelProps> = ({
  playingText, onPlayAudio,
}) => (
  <div className="flex flex-col gap-4 py-1 select-none animate-[fadeIn_0.2s_ease-out]">
    <GrammarPillarsIntro />

    {/* Section 1: Pronouns */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-medium text-white border-l-2 border-[#A78BFA] pl-2">
          <span>1. Sujeto / Pronombres (¿Quién hace la acción?)</span>
        </h3>
        <span className="text-[10px] font-mono text-white/40">7 Pronombres Vitales</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PRONOUNS_DATA.map((p) => (
          <button
            key={p.token} type="button" onClick={() => onPlayAudio(p.exampleEnglish)}
            className="text-left p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-[#A78BFA]/40 transition-all flex items-start justify-between gap-2 group cursor-pointer"
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono font-semibold text-white group-hover:text-[#DDD6FE]">{p.token}</span>
                <span className="text-xs text-white/50">{p.spanish}</span>
              </div>
              <p className="text-[11px] text-[#A78BFA]/80 font-mono mt-0.5 truncate">“{p.exampleEnglish}”</p>
            </div>
            <Volume2 size={13} className={`shrink-0 mt-1 transition-colors ${playingText === p.exampleEnglish ? "text-[#DDD6FE] animate-pulse" : "text-white/30 group-hover:text-[#A78BFA]"}`} />
          </button>
        ))}
      </div>
    </div>

    {/* Section 2: Verbs */}
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-medium text-white border-l-2 border-emerald-400 pl-2">
          <span>2. Verbos (El motor de la frase: ¿Qué ocurre?)</span>
        </h3>
        <span className="text-[10px] font-mono text-white/40">Acción y Estado</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {VERBS_DATA.map((v) => (
          <button
            key={v.token} type="button" onClick={() => onPlayAudio(v.exampleEnglish)}
            className="text-left p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-emerald-400/40 transition-all flex items-start justify-between gap-2 group cursor-pointer"
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-mono font-semibold text-emerald-300 group-hover:text-emerald-200">{v.token}</span>
                <span className="text-xs text-white/50">{v.spanish}</span>
              </div>
              <p className="text-[11px] text-white/60 font-mono mt-0.5 truncate">“{v.exampleEnglish}”</p>
            </div>
            <Volume2 size={13} className={`shrink-0 mt-1 transition-colors ${playingText === v.exampleEnglish ? "text-emerald-300 animate-pulse" : "text-white/30 group-hover:text-emerald-400"}`} />
          </button>
        ))}
      </div>
    </div>
  </div>
);
