import React, { useState } from "react";

export interface WritingToolsCardProps {
  onInsertPhrase?: ((phrase: string) => void) | undefined;
  userLevel?: string | undefined;
  starterPhrases?: string[] | undefined;
}

interface ToolPhrase {
  en: string;
  es: string;
}

interface ToolCategory {
  id: "improve" | "simplify" | "shorten" | "expand";
  label: string;
  badge: string;
  title: string;
  phrases: ToolPhrase[];
}

const TOOL_CATEGORIES: Record<string, ToolCategory> = {
  improve: {
    id: "improve",
    label: "Improve",
    badge: "B2/C1",
    title: "Executive Phrasing & Elevators",
    phrases: [
      { en: "In light of recent developments, ", es: "En vista de los desarrollos recientes" },
      { en: "From a strategic standpoint, ", es: "Desde una perspectiva estratégica" },
      { en: "It is paramount to ensure that ", es: "Es primordial asegurar que" },
      { en: "Taking all factors into account, ", es: "Teniendo en cuenta todos los factores" },
    ],
  },
  simplify: {
    id: "simplify",
    label: "Simplify",
    badge: "Direct",
    title: "Direct & Clear Starters",
    phrases: [
      { en: "The main objective is to ", es: "El objetivo principal es" },
      { en: "Specifically, we need to ", es: "Específicamente, necesitamos" },
      { en: "To put it simply, ", es: "Para decirlo de forma simple" },
      { en: "Our focus right now is on ", es: "Nuestro foco ahora mismo está en" },
    ],
  },
  shorten: {
    id: "shorten",
    label: "Shorten",
    badge: "Synthesis",
    title: "Synthesis & Compact Transitions",
    phrases: [
      { en: "In essence, ", es: "En esencia" },
      { en: "To summarize briefly, ", es: "Para resumir brevemente" },
      { en: "Moving forward, ", es: "Hacia adelante / En el futuro" },
      { en: "In short, ", es: "En resumen" },
    ],
  },
  expand: {
    id: "expand",
    label: "Expand",
    badge: "+Flow",
    title: "Discourse Connectors & Depth",
    phrases: [
      { en: "Furthermore, this aligns with ", es: "Además, esto se alinea con" },
      { en: "Consequently, the next step is to ", es: "En consecuencia, el siguiente paso es" },
      { en: "In addition to these results, ", es: "Además de estos resultados" },
      { en: "As evidence of this approach, ", es: "Como evidencia de este enfoque" },
    ],
  },
};

export const WritingToolsCard: React.FC<WritingToolsCardProps> = React.memo(
  function WritingToolsCard({ onInsertPhrase, userLevel, starterPhrases }) {
    const isBeginner = Boolean(userLevel && (userLevel.includes("A1") || userLevel.includes("A2")));
    const hasStarters = Boolean(starterPhrases && starterPhrases.length > 0);

    const [activeTool, setActiveTool] = useState<string | null>(() => {
      if (hasStarters && isBeginner) return "starters";
      return null;
    });

    const toggleTool = (toolId: string) => {
      setActiveTool((prev) => (prev === toolId ? null : toolId));
    };

    const handleSelectPhrase = (phrase: string) => {
      if (onInsertPhrase) {
        onInsertPhrase(phrase);
      }
    };

    const startersCategory: ToolCategory | null = hasStarters
      ? {
          id: "simplify",
          label: "Pistas",
          badge: userLevel || "Recomendado",
          title: "Frases de Apoyo Recomendadas",
          phrases: (starterPhrases || []).map((p) => ({
            en: p,
            es: "Pista recomendada para comenzar",
          })),
        }
      : null;

    const tools = [
      ...(hasStarters
        ? [
            {
              id: "starters",
              label: "Pistas",
              icon: (
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              ),
            },
          ]
        : []),
      {
        id: "improve",
        label: "Improve",
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.91 5.89H20l-4.85 3.53 1.85 5.88L12 14.77l-5 3.53 1.85-5.88L4 8.89h6.09z" />
          </svg>
        ),
      },
      {
        id: "simplify",
        label: "Simplify",
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        id: "shorten",
        label: "Shorten",
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <polyline points="9 15 15 9" />
          </svg>
        ),
      },
      {
        id: "expand",
        label: "Expand",
        icon: (
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <polyline points="15 9 9 15" />
            <polyline points="9 9 15 15" />
          </svg>
        ),
      },
    ];

    const currentCategory = activeTool === "starters"
      ? startersCategory
      : activeTool ? TOOL_CATEGORIES[activeTool] : null;

    return (
      <div className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3 shrink-0 overflow-hidden animate-[slideInRight_0.45s_ease-out_0.3s_both]">
        {/* Top Specular Hairline */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Title and Active Mode */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
            Writing Tools
          </span>
          {activeTool && (
            <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#C4B5FD]">
              {currentCategory?.badge}
            </span>
          )}
        </div>

        {/* 4 Tool Action Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 z-10">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => toggleTool(tool.id)}
                aria-label={tool.label}
                aria-pressed={isActive}
                className="flex flex-col items-center justify-center space-y-1.5 p-1.5 rounded-2xl group cursor-pointer"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "bg-[#7048E8]/20 border-[#A27FF3]/60 text-white shadow-[0_0_16px_rgba(162,127,243,0.35)] scale-105"
                      : "bg-white/[0.02] border-white/[0.06] text-white/50 group-hover:border-white/20 group-hover:text-white group-hover:bg-white/[0.05]"
                  }`}
                >
                  {tool.icon}
                </div>
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    isActive ? "text-white font-medium" : "text-white/30 group-hover:text-white"
                  }`}
                >
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Helper Phrases Drawer */}
        {currentCategory && (
          <div className="pt-2 border-t border-white/[0.05] flex flex-col space-y-2 z-10 animate-[fadeIn_0.25s_ease-out_both]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-light text-white/60 tracking-wide">
                {currentCategory.title}
              </span>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="text-[9px] font-mono text-white/30 hover:text-white/70 transition-colors cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex flex-col space-y-1.5">
              {currentCategory.phrases.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPhrase(item.en)}
                  className="group flex flex-col p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/15 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-normal text-white/90 group-hover:text-white transition-colors">
                      {item.en}
                    </span>
                    <span className="text-[9px] font-mono text-[#C4B5FD] opacity-0 group-hover:opacity-100 transition-opacity">
                      + Insert
                    </span>
                  </div>
                  <span className="text-[10px] font-light text-white/40 group-hover:text-white/50 transition-colors">
                    {item.es}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
);

WritingToolsCard.displayName = "WritingToolsCard";
