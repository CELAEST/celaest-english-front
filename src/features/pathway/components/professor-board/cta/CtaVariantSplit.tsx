import React from "react";
import { ArrowRight } from "lucide-react";

interface Props { onClick: () => void; }

export const CtaVariantSplit: React.FC<Props> = ({ onClick }) => (
  <div className="w-full flex items-center justify-between py-1 px-1 border-t border-white/[0.04] select-none">
    <div className="flex flex-col">
      <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Siguiente Momento</span>
      <span className="text-xs font-light text-white/85">Construcción con Bloques</span>
    </div>
    <button
      type="button" onClick={onClick}
      className="group w-8 h-8 rounded-full bg-white text-black hover:bg-[#DDD6FE] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
      title="Ir a Practicar"
    >
      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
);

