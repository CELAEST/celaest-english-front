import React from "react";
import { PathwayChatMessage } from "../../../hooks/usePathwayBaseChat";

interface PathwayChatMessageBubbleProps {
  message: PathwayChatMessage;
}

export const PathwayChatMessageBubble: React.FC<PathwayChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end select-text">
        <div className="max-w-[88%] px-2.5 py-1.5 border-r-2 border-[#A27FF3] bg-white/[0.02] text-white text-xs leading-relaxed font-normal">
          {message.text}
        </div>
      </div>
    );
  }

  const { answer, text } = message;
  const isOffTopic = Boolean(answer?.isOffTopic);

  return (
    <div className="flex flex-col gap-1 select-text max-w-[96%]">
      {/* Mentor Label */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#A27FF3]">
          Liam · Mentor
        </span>
        {isOffTopic && (
          <span className="text-[8.5px] font-mono tracking-wider uppercase px-1.5 py-0.2 bg-amber-500/10 border border-amber-500/25 text-amber-300/80 rounded">
            Enfoque en Inglés
          </span>
        )}
      </div>

      {/* Direct Answer */}
      <p className="text-xs text-white/90 leading-relaxed font-light">
        {answer?.directAnswer ?? text}
      </p>

      {/* Mental Model / Guidance Callout */}
      {answer?.mentalModel && (
        <div
          className={`text-[11px] leading-relaxed italic border-l-2 pl-2 mt-0.5 font-light ${
            isOffTopic
              ? "border-amber-400/40 text-amber-200/80"
              : "border-[#A27FF3]/40 text-white/60"
          }`}
        >
          {answer.mentalModel}
        </div>
      )}

      {/* Example Chip (only for on-topic English queries with examples) */}
      {!isOffTopic && answer?.exampleEnglish && (
        <div className="px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] text-[11.5px] mt-0.5">
          <span className="text-white font-medium block">
            “{answer.exampleEnglish}”
          </span>
          {answer.exampleSpanish && (
            <span className="text-[10.5px] text-white/45 font-light block">
              {answer.exampleSpanish}
            </span>
          )}
        </div>
      )}

      {/* Pronunciation Tip (only for on-topic English queries) */}
      {!isOffTopic && answer?.pronunciationTip && (
        <div className="text-[10px] text-white/40 italic font-light mt-0.5">
          Tip fonético: {answer.pronunciationTip}
        </div>
      )}
    </div>
  );
};
