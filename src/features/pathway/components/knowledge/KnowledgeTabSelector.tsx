import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export type KnowledgeTab = "grammar" | "phonetics";

export interface KnowledgeTabSelectorProps {
  activeTab: KnowledgeTab;
  onSelectTab: (tab: KnowledgeTab) => void;
}

export const KnowledgeTabSelector: React.FC<KnowledgeTabSelectorProps> = ({
  activeTab,
  onSelectTab,
}) => (
  <div className="w-full flex items-center gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl select-none">
    <button
      type="button"
      onClick={() => onSelectTab("grammar")}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
        activeTab === "grammar"
          ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#7C3AED]/40 border border-[#A78BFA]/40 text-white font-medium shadow-[0_2px_12px_rgba(124,58,237,0.25)]"
          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <BookOpen size={13} className={activeTab === "grammar" ? "text-[#DDD6FE]" : "text-white/40"} />
      <span>1. Sujeto, Verbo y Pronombres</span>
    </button>

    <button
      type="button"
      onClick={() => onSelectTab("phonetics")}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-mono transition-all cursor-pointer ${
        activeTab === "phonetics"
          ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#7C3AED]/40 border border-[#A78BFA]/40 text-white font-medium shadow-[0_2px_12px_rgba(124,58,237,0.25)]"
          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Sparkles size={13} className={activeTab === "phonetics" ? "text-[#DDD6FE]" : "text-white/40"} />
      <span>2. Abecedario Fonético IPA</span>
    </button>
  </div>
);

