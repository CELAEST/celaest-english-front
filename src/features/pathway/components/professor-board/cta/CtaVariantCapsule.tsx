import React from "react";
import { ArrowRight } from "lucide-react";

interface Props { onClick: () => void; }

export const CtaVariantCapsule: React.FC<Props> = ({ onClick }) => (
  <div className="w-full flex justify-center py-1 select-none">
    <button
      type="button" onClick={onClick}
      className="group h-8 px-5 rounded-full bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.14] border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
    >
      <span className="text-xs font-mono tracking-wider text-white/85 group-hover:text-white">
        Practicar en Pizarra
      </span>
      <ArrowRight size={12} className="text-[#A27FF3] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
    </button>
  </div>
);
