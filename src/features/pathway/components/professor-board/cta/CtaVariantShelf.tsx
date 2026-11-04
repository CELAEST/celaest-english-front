import React from "react";
import { ArrowRight } from "lucide-react";

interface Props { onClick: () => void; }

export const CtaVariantShelf: React.FC<Props> = ({ onClick }) => (
  <button
    type="button" onClick={onClick}
    className="group w-full flex items-center justify-between py-2 px-1 text-left cursor-pointer transition-all select-none"
  >
    <span className="text-xs sm:text-[13px] font-mono tracking-wider text-white/80 group-hover:text-white transition-colors">
      Práctica en Pizarra
    </span>
    <div className="w-6 h-6 rounded-full bg-white text-black group-hover:bg-[#DDD6FE] flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-sm active:scale-95">
      <ArrowRight size={12} />
    </div>
  </button>
);
