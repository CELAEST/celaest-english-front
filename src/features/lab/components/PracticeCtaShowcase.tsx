import React, { useState } from "react";
import { PracticeCtaVariant, LessonBoardPracticeCta } from "../../pathway/components/professor-board/LessonBoardPracticeCta";
import { CTA_MODELS } from "./practice-cta-showcase/PracticeCtaShowcaseTypes";
import { PracticeCtaShowcaseControls } from "./practice-cta-showcase/PracticeCtaShowcaseControls";
import { Volume2, MessageSquareQuote } from "lucide-react";

export const PracticeCtaShowcase: React.FC = () => {
  const [selected, setSelected] = useState<PracticeCtaVariant>("shelf");
  const [feedback, setFeedback] = useState<string | null>(null);

  const current = CTA_MODELS.find((m) => m.id === selected) || CTA_MODELS[0]!;

  const handleTrigger = () => {
    setFeedback(`¡Acción disparada con éxito: ${current.label}!`);
    setTimeout(() => setFeedback(null), 2400);
  };

  return (
    <div className="w-full flex flex-col space-y-4 select-none">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-[#A27FF3]/20 text-[#DDD6FE] border border-[#A27FF3]/30">
            CTA SUITE · ANTI-AI & ZERO-BOX
          </span>
          <span className="text-xs text-white/40 font-mono">{current.badge}</span>
        </div>
        <h2 className="text-xl font-light text-white tracking-tight">Practice CTA Sophistication Matrix</h2>
        <p className="text-xs text-white/60 font-light">{current.philosophy}</p>
      </div>

      <PracticeCtaShowcaseControls selected={selected} onSelect={setSelected} />

      <div className="w-full flex justify-center py-6 bg-black/60 rounded-3xl border border-white/[0.06] overflow-hidden">
        <div className="w-[390px] rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/[0.08] p-4 flex flex-col gap-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)]">
          {/* Mock Lesson Board Content */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <span className="text-[10px] font-mono tracking-widest text-[#A27FF3] uppercase">LECCIÓN EN VIVO</span>
            <span className="text-[11px] font-mono text-white/40">PROFESOR LIAM</span>
          </div>
          <p className="text-xs font-light text-white/70 leading-relaxed">
            "Cuando hablas de acciones en presente continuo, el verbo auxiliar 'be' es indispensable antes del gerundio."
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-white/40 pt-1">
            <span className="flex items-center gap-1.5"><Volume2 size={12} /> Ejemplo</span>
            <span className="flex items-center gap-1.5"><MessageSquareQuote size={12} /> Preguntar</span>
          </div>

          {/* Practice CTA Insertion Slot */}
          <div className="pt-2 border-t border-white/[0.06]">
            <LessonBoardPracticeCta variant={selected} onClick={handleTrigger} />
          </div>

          {feedback && (
            <div className="mt-1 px-3 py-1.5 rounded-lg bg-[#A27FF3]/20 border border-[#A27FF3]/40 text-center text-xs font-mono text-[#DDD6FE] animate-pulse">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

