import React from "react";

interface Props { onClick: () => void; }

export const CtaVariantNotch: React.FC<Props> = ({ onClick }) => (
  <button
    type="button" onClick={onClick}
    className="group w-full h-8 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border-t border-white/10 flex items-center justify-between transition-all cursor-pointer select-none"
  >
    <span className="text-[11px] font-mono tracking-wider text-white/70 group-hover:text-white uppercase">
      Entrar a Práctica
    </span>
    <span className="text-xs font-mono text-[#A27FF3] group-hover:text-white group-hover:translate-x-1 transition-all">
      [ 2 / 3 → ]
    </span>
  </button>
);

