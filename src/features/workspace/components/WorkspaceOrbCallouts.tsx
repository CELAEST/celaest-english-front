import React, { useState, useEffect } from "react";
import { useMemoryCards } from "../../memory/hooks/useMemoryCards";
import { useReadingArticles } from "../../reading/hooks/useReadingArticles";

export interface WorkspaceOrbCalloutsProps {
  learningGoal?: string | undefined;
  profession?: string | undefined;
  onSelectNode?: ((nodeId: string, categoryHint?: string) => void) | undefined;
}

export const WorkspaceOrbCallouts: React.FC<WorkspaceOrbCalloutsProps> = ({
  learningGoal,
  profession,
  onSelectNode,
}) => {
  const { cards } = useMemoryCards();
  const { currentArticle, articles } = useReadingArticles();

  // Dynamic memory stats from real user cards
  const memoryCount = cards.length;
  const topCard = cards[0];
  const activeMemoryTitle =
    memoryCount > 0 && topCard
      ? `“${topCard.betterWay || topCard.correctWord || topCard.userSaid}”`
      : "Personalized Lexicon Deck";
  const activeMemoryStat = memoryCount > 0 ? `${memoryCount} DUE` : "DECK READY";

  // Dynamic reading article from real repository/cache
  const targetArticle = currentArticle || articles[0];
  const wordCount = targetArticle?.content
    ? targetArticle.content.trim().split(/\s+/).length
    : 480;
  const activeReadingTitle =
    targetArticle?.title || "Architectural Paradigm Shifts in Business";
  const activeReadingStat = `${targetArticle?.readTimeMin || 4} MIN`;
  const activeReadingSub = `${targetArticle?.cefrLevel || "C1"} · ${wordCount} words`;

  // Dynamic interview simulation from real user settings
  const activeInterviewTitle = learningGoal
    ? `${learningGoal} Simulation`
    : profession
      ? `${profession} Simulation`
      : "Tech Career & AI Simulation";

  // Dynamic approved contextual images (with user-selected overrides from localStorage)
  const [memoryImg, setMemoryImg] = useState<string>("/assets/vocab_headphones_focus.webp");
  const [readingImg, setReadingImg] = useState<string>("/assets/reading_modern_architecture.webp");
  const [speakingImg, setSpeakingImg] = useState<string>("/assets/speaking_studio_mic.webp");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMem = localStorage.getItem("celaest_slot1_memory_img");
      const savedRead = localStorage.getItem("celaest_slot2_reading_img");
      const savedSpeak = localStorage.getItem("celaest_slot3_speaking_img");
      if (savedMem) setMemoryImg(savedMem);
      if (savedRead) setReadingImg(savedRead);
      if (savedSpeak) setSpeakingImg(savedSpeak);
    }
  }, []);

  return (
    <div className="hidden lg:flex flex-col space-y-4 select-none pt-2 w-full max-w-[315px] xl:max-w-[335px] shrink-0 font-['Plus_Jakarta_Sans',sans-serif] z-10">
      {/* 01 // ACTIVE MEMORY */}
      <div
        onClick={() => onSelectNode?.("memory", topCard?.category ? topCard.category.toLowerCase() : undefined)}
        className="group py-2 px-3 sm:py-3.5 sm:px-3.5 rounded-2xl bg-white/[0.04] lg:bg-transparent border border-white/[0.07] lg:border-none backdrop-blur-md lg:backdrop-blur-none hover:bg-white/[0.07] active:bg-white/[0.09] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shrink-0 snap-center w-[80vw] max-w-[270px] lg:w-full lg:max-w-full min-h-[64px] sm:min-h-[88px]"
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
          <div className="w-[48px] h-[48px] sm:w-[70px] sm:h-[70px] rounded-xl sm:rounded-2xl overflow-hidden shrink-0">
            <img
              src={memoryImg}
              alt="Vocabulary Recall"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col text-left min-w-0 flex-1 overflow-hidden space-y-0.5 sm:space-y-1">
            <span className="text-[8.5px] sm:text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase truncate block">
              VOCABULARY DECK // {activeMemoryStat}
            </span>
            <span
              className="text-xs sm:text-[14px] font-medium text-white truncate group-hover:text-[#CBD5E1] transition-colors block leading-tight"
              title={activeMemoryTitle}
            >
              {activeMemoryTitle}
            </span>
            <span className="text-[10px] sm:text-[11.5px] text-[#64748B] font-light truncate block">
              Spaced repetition recall deck
            </span>
          </div>
        </div>

        <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-1 shrink-0">
          →
        </span>
      </div>

      {/* 02 // EXECUTIVE READING */}
      <div
        onClick={() => onSelectNode?.("reading")}
        className="group py-2 px-3 sm:py-3.5 sm:px-3.5 rounded-2xl bg-white/[0.04] lg:bg-transparent border border-white/[0.07] lg:border-none backdrop-blur-md lg:backdrop-blur-none hover:bg-white/[0.07] active:bg-white/[0.09] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shrink-0 snap-center w-[80vw] max-w-[270px] lg:w-full lg:max-w-full min-h-[64px] sm:min-h-[88px]"
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
          <div className="w-[48px] h-[48px] sm:w-[70px] sm:h-[70px] rounded-xl sm:rounded-2xl overflow-hidden shrink-0">
            <img
              src={readingImg}
              alt="Executive Reading"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col text-left min-w-0 flex-1 overflow-hidden space-y-0.5 sm:space-y-1">
            <span className="text-[8.5px] sm:text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase truncate block">
              EXECUTIVE ARTICLE // {activeReadingStat}
            </span>
            <span
              className="text-xs sm:text-[14px] font-medium text-white truncate group-hover:text-[#CBD5E1] transition-colors block leading-tight"
              title={activeReadingTitle}
            >
              {activeReadingTitle}
            </span>
            <span className="text-[10px] sm:text-[11.5px] text-[#64748B] font-light truncate block">
              {activeReadingSub}
            </span>
          </div>
        </div>

        <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-1 shrink-0">
          →
        </span>
      </div>

      {/* 03 // ORAL SIMULATION */}
      <div
        onClick={() => onSelectNode?.("interview")}
        className="group py-2 px-3 sm:py-3.5 sm:px-3.5 rounded-2xl bg-white/[0.04] lg:bg-transparent border border-white/[0.07] lg:border-none backdrop-blur-md lg:backdrop-blur-none hover:bg-white/[0.07] active:bg-white/[0.09] transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 shrink-0 snap-center w-[80vw] max-w-[270px] lg:w-full lg:max-w-full min-h-[64px] sm:min-h-[88px]"
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
          <div className="w-[48px] h-[48px] sm:w-[70px] sm:h-[70px] rounded-xl sm:rounded-2xl overflow-hidden shrink-0">
            <img
              src={speakingImg}
              alt="Oral Simulation"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col text-left min-w-0 flex-1 overflow-hidden space-y-0.5 sm:space-y-1">
            <span className="text-[8.5px] sm:text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase truncate block">
              ORAL SIMULATION // LIVE AUDIO
            </span>
            <span
              className="text-xs sm:text-[14px] font-medium text-white truncate group-hover:text-[#CBD5E1] transition-colors block leading-tight"
              title={activeInterviewTitle}
            >
              {activeInterviewTitle}
            </span>
            <span className="text-[10px] sm:text-[11.5px] text-[#64748B] font-light truncate block">
              Round 01 · Duplex conversation
            </span>
          </div>
        </div>

        <span className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all text-xs pl-1 shrink-0">
          →
        </span>
      </div>
    </div>
  );
};

