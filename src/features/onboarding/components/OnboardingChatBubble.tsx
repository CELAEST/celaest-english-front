import React from "react";
import { AiAvatarIcon } from "./AiAvatarIcon";
import { UserAvatarIcon } from "./UserAvatarIcon";

export interface OnboardingChatBubbleProps {
  sender: "ai" | "user";
  text: string;
  timestamp?: string | undefined;
  isTyping?: boolean | undefined;
}

export const OnboardingChatBubble: React.FC<OnboardingChatBubbleProps> = ({
  sender,
  text,
  timestamp,
  isTyping = false,
}) => {
  const isAi = sender === "ai";

  return (
    <div className={`flex items-end gap-3 mb-4 ${isAi ? "justify-start" : "justify-end"}`}>
      {/* AI Avatar — Left side */}
      {isAi && <AiAvatarIcon />}

      {/* Message Bubble */}
      <div
        className={`relative max-w-[78%] sm:max-w-sm px-4 py-3 rounded-2xl text-[13px] sm:text-sm font-light leading-relaxed ${
          isAi
            ? "bg-[#110E24] text-slate-100 rounded-bl-sm"
            : "bg-[#14112E] text-white rounded-br-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>

        {/* Typing Dots — 3 purple animated dots */}
        {isTyping && (
          <div className="flex items-center gap-1.5 pt-2.5">
            <span
              className="w-[6px] h-[6px] rounded-full bg-[#7C3AED]"
              style={{
                animation: "chatDotBounce 1.2s ease-in-out infinite",
                animationDelay: "0ms",
              }}
            />
            <span
              className="w-[6px] h-[6px] rounded-full bg-[#8B5CF6]"
              style={{
                animation: "chatDotBounce 1.2s ease-in-out infinite",
                animationDelay: "200ms",
              }}
            />
            <span
              className="w-[6px] h-[6px] rounded-full bg-[#A78BFA]"
              style={{
                animation: "chatDotBounce 1.2s ease-in-out infinite",
                animationDelay: "400ms",
              }}
            />
          </div>
        )}

        {/* Timestamp */}
        {timestamp && !isTyping && (
          <div
            className={`text-[10px] pt-1.5 ${isAi ? "text-left text-[#5E5E80]" : "text-right text-[#7B6FA5]"}`}
          >
            {timestamp}
          </div>
        )}
      </div>

      {/* User Avatar — Right side */}
      {!isAi && <UserAvatarIcon />}
    </div>
  );
};
