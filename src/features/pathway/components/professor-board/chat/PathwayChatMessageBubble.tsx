import React from "react";
import { Sparkles, Lightbulb, Volume2 } from "lucide-react";
import { PathwayChatMessage } from "../../../hooks/usePathwayBaseChat";

interface PathwayChatMessageBubbleProps {
  message: PathwayChatMessage;
}

export const PathwayChatMessageBubble: React.FC<PathwayChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  if (isUser) {
    return (
      <div className="flex justify-end select-text">
        <div className="max-w-[85%] px-3.5 py-2 rounded-2xl rounded-tr-sm bg-[#A27FF3]/15 border border-[#A27FF3]/30 text-white/95 text-xs leading-relaxed font-light shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  const { answer, text } = message;

  return (
    <div className="flex flex-col gap-2 select-text max-w-[95%]">
      {/* Mentor Badge */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#C4B2F7]">
        <Sparkles size={11} className="text-[#A27FF3]" />
        <span>Liam · Mentor</span>
      </div>

      {/* Answer Content Card */}
      <div className="flex flex-col gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] shadow-inner text-xs">
        {/* Direct Answer */}
        <p className="text-white/90 leading-relaxed font-light">
          {answer?.directAnswer ?? text}
        </p>

        {/* Mental Model Callout (if available) */}
        {answer?.mentalModel && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-[#A27FF3]/08 border-l-2 border-[#A27FF3] text-[11.5px] text-[#DDD6FE]/90 leading-relaxed">
            <Lightbulb size={12} className="text-[#A27FF3] shrink-0 mt-0.5" />
            <span className="font-light">{answer.mentalModel}</span>
          </div>
        )}

        {/* Example Chip (if available) */}
        {answer?.exampleEnglish && (
          <div className="flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
            <span className="font-medium text-white tracking-wide text-xs">
              “{answer.exampleEnglish}”
            </span>
            {answer.exampleSpanish && (
              <span className="text-[11px] text-white/50 font-light">
                {answer.exampleSpanish}
              </span>
            )}
          </div>
        )}

        {/* Pronunciation Tip (if available) */}
        {answer?.pronunciationTip && (
          <div className="flex items-center gap-1.5 text-[10.5px] text-white/45 font-light">
            <Volume2 size={10} className="text-[#A27FF3]/70 shrink-0" />
            <span>{answer.pronunciationTip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
