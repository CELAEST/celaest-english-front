import React from "react";
import { ChevronRight } from "lucide-react";

interface Props { onClick: () => void; }

export const CtaVariantSlide: React.FC<Props> = ({ onClick }) => (
  <div className="w-full py-1 select-none">
    <div
      role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="relative w-full h-9 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center px-1 cursor-pointer overflow-hidden group hover:border-white/15 transition-all"
    >
      <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/15 flex items-center justify-center text-white/80 transition-all group-hover:translate-x-1">
        <ChevronRight size={14} />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono tracking-widest text-white/45 group-hover:text-white/70 transition-colors uppercase pointer-events-none">
        Deslizar o pulsar para practicar
      </span>
    </div>
  </div>
);

