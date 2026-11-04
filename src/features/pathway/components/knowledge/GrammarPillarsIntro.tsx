import React from "react";

export const GrammarPillarsIntro: React.FC = () => (
  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-2">
    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#A78BFA]">
      La Estructura Fundamental del Inglés
    </span>
    <p className="text-xs sm:text-[13px] text-white/80 font-light leading-relaxed">
      En inglés <strong className="text-white font-medium">cada oración completa necesita un protagonista (Sujeto)</strong> y <strong className="text-white font-medium">un motor de acción (Verbo)</strong>. En español puedes decir “aprendo inglés” sin decir “yo”, pero en inglés es <span className="text-emerald-300 font-medium">obligatorio</span> decir <span className="font-mono text-emerald-300">“I learn”</span>.
    </p>
  </div>
);

