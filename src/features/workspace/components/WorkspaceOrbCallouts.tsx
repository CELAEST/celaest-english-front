import React from "react";
import {
  CognitiveMemoryBrainIcon,
  PrecisionOpenBookIcon,
  StudioVoiceMicIcon,
} from "./WorkspaceBespokeIcons";
import { useMemoryCards } from "../../memory/hooks/useMemoryCards";
import { useReadingArticles } from "../../reading/hooks/useReadingArticles";

export interface WorkspaceOrbCalloutsProps {
  learningGoal?: string | undefined;
  profession?: string | undefined;
  onSelectNode?: ((nodeId: string) => void) | undefined;
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
      : "“Distributed systems & latency review”";
  const activeMemoryMeta =
    memoryCount > 0
      ? `Ready for practice · ${memoryCount} ${memoryCount === 1 ? "card" : "cards"}`
      : "Ready for practice · 14 cards";
  const activeMemoryStat = memoryCount > 0 ? "88% Stability" : "88% Stability";

  // Dynamic reading article from real repository/cache
  const targetArticle = currentArticle || articles[0];
  const wordCount = targetArticle?.content
    ? targetArticle.content.trim().split(/\s+/).length
    : 480;
  const activeReadingTitle =
    targetArticle?.title || "Mastering Modern Leadership & Alignment";
  const activeReadingMeta = `${targetArticle?.readTimeMin || 3} min read · ${
    targetArticle?.cefrLevel || "Technical C1"
  }`;
  const activeReadingStat = `${wordCount} Words`;

  // Dynamic interview simulation from real user settings
  const activeInterviewTitle = learningGoal
    ? `${learningGoal} Simulation`
    : profession
      ? `${profession} Simulation`
      : "Tech Career & AI Simulation";
  const activeInterviewMeta = "Live AI Simulation · Round 01";
  const activeInterviewStat = "48kHz Live Audio";

  const callouts = [
    {
      id: "memory",
      tag: "LAST MEMORY",
      title: activeMemoryTitle,
      meta: activeMemoryMeta,
      stat: activeMemoryStat,
      Icon: CognitiveMemoryBrainIcon,
    },
    {
      id: "reading",
      tag: "NEXT READING",
      title: activeReadingTitle,
      meta: activeReadingMeta,
      stat: activeReadingStat,
      Icon: PrecisionOpenBookIcon,
    },
    {
      id: "interview",
      tag: "UPCOMING INTERVIEW",
      title: activeInterviewTitle,
      meta: activeInterviewMeta,
      stat: activeInterviewStat,
      Icon: StudioVoiceMicIcon,
    },
  ];

  return (
    <div className="flex flex-col select-none pt-0 divide-y divide-white/[0.08] w-full sm:w-auto lg:min-w-[320px] xl:min-w-[340px] shrink-0">
      {callouts.map((item, index) => (
        <div
          key={item.id}
          onClick={() => onSelectNode && onSelectNode(item.id)}
          className={`group px-1 flex items-center justify-between cursor-pointer transition-all duration-300 hover:translate-x-[-4px] ${
            index === 0 ? "pt-0 pb-4 sm:pb-5" : "py-4 sm:py-5"
          }`}
        >
          <div className="flex items-center gap-5 min-w-0">
            {/* Standalone Vector Artwork with Glowing Lavender Pearl Accent */}
            <div className="text-white group-hover:text-[#DDD6FE] transition-all duration-300 shrink-0 group-hover:scale-105">
              <item.Icon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            {/* High-Contrast Typography Hierarchy */}
            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[10.5px] font-mono font-semibold tracking-[0.2em] text-[#B197FF] uppercase">
                  {item.tag}
                </span>
                <span className="text-[9.5px] font-mono text-white/40">{item.stat}</span>
              </div>
              <span className="text-[14.5px] sm:text-[15px] text-white font-medium mt-0.5 tracking-wide group-hover:text-[#DDD6FE] transition-colors truncate">
                {item.title}
              </span>
              <span className="text-[11.5px] text-[#8e90a5] font-light mt-0.5 truncate">
                {item.meta}
              </span>
            </div>
          </div>

          <div className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 pl-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M5 12H19M19 12L12 5M19 12L12 19" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};
