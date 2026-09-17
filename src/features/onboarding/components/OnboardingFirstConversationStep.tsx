import React, { useRef, useEffect } from "react";
import { LearnerProfileData } from "../types";
import { OnboardingChatBubble } from "./OnboardingChatBubble";
import { OnboardingChatInput } from "./OnboardingChatInput";
import { useOnboardingConversation } from "../hooks/useOnboardingConversation";
import { OnboardingConversationHeader } from "./first-conversation/OnboardingConversationHeader";
import { OnboardingConversationActions } from "./first-conversation/OnboardingConversationActions";

export interface OnboardingFirstConversationStepProps {
  profile: LearnerProfileData;
  onUpdateProfile: (partial: Partial<LearnerProfileData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const OnboardingFirstConversationStep: React.FC<OnboardingFirstConversationStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { turn, messages, isAiTyping, handleSendMessage } = useOnboardingConversation(
    profile,
    onUpdateProfile,
  );

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        <div className="shrink-0 h-5 sm:h-7" />

        <div className="flex-1 flex flex-col justify-center max-w-lg min-h-0 my-auto py-1">
          <OnboardingConversationHeader turn={turn} />

          <div
            ref={chatScrollRef}
            className="space-y-2.5 max-w-lg mb-3 overflow-y-auto custom-scrollbar max-h-[220px] sm:max-h-[250px] md:max-h-[270px] pr-1.5 scroll-smooth"
          >
            {messages.map((msg) => (
              <OnboardingChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
              />
            ))}

            {isAiTyping && (
              <OnboardingChatBubble
                sender="ai"
                text="Analyzing language patterns & calibrating CEFR baseline..."
                isTyping={true}
              />
            )}
          </div>

          {turn <= 3 ? (
            <OnboardingChatInput onSend={handleSendMessage} onPrev={onPrev} />
          ) : (
            <OnboardingConversationActions onPrev={onPrev} onNext={onNext} />
          )}
        </div>

        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
