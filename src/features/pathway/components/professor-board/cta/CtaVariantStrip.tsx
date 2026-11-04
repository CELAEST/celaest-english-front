import React from "react";
import { ArrowRight } from "lucide-react";

interface Props { onClick: () => void; }

export const CtaVariantStrip: React.FC<Props> = ({ onClick }) => (
  <button
    type="button" onClick={onClick}
    className="group w-full flex items-center justify-between py-2 px-0.5 text-white/75 hover:text-white transition-colors cursor-pointer select-none"
  >
    <span className="text-xs font-mono tracking-wider">Construir la Regla</span>
    <div className="flex items-center gap-1.5 text-xs font-mono text-white/45 group-hover:text-white transition-all group-hover:translate-x-1">
      <span className="text-[11px] tracking-widest uppercase">Práctica</span>
      <ArrowRight size={13} className="text-[#A27FF3] group-hover:text-white transition-colors" />
    </div>
  </button>
);
