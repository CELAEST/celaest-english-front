import React, { useState, useRef, useEffect } from 'react';
import { OnboardingStepProgress } from './OnboardingStepProgress';
import { OnboardingChatBubble } from './OnboardingChatBubble';
import { OnboardingChatInput } from './OnboardingChatInput';

export interface OnboardingFirstConversationStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp?: string;
  isTyping?: boolean;
}

export const OnboardingFirstConversationStep: React.FC<OnboardingFirstConversationStepProps> = ({
  onNext,
  onPrev,
}) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Tell me about yourself.',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: "Well, I'm Esteban. I'm 24 years old and I'm a developer. I love building things and solving problems.",
      timestamp: '10:43 AM',
    },
    {
      id: 'msg-3',
      sender: 'ai',
      text: 'Why do you want to become a software engineer?',
      isTyping: true,
    },
  ]);

  // Auto-scroll chat bubbles to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate AI response after user types
    setTimeout(() => {
      onNext();
    }, 1200);
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto overflow-hidden">


      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle Content Section */}
        <div className="flex-1 flex flex-col justify-center max-w-lg min-h-0 my-auto py-1">
          {/* Progress Indicator: 03 / 04 (75%) */}
          <OnboardingStepProgress
            currentStep={3}
            totalSteps={4}
            percentage={75}
            className="mb-3 sm:mb-5"
          />

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-[36px] lg:text-[42px] font-light tracking-tight text-white leading-[1.12] mb-2 sm:mb-2.5 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.12s_both]">
            Let's have your<br />
            <span className="text-[#A27FF3] font-light">
              first conversation.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed mb-3 sm:mb-4 shrink-0 animate-[fadeSlideUp_0.5s_ease-out_0.18s_both]">
            I'll ask you a few questions so I can<br />
            understand how you think and speak.
          </p>

          {/* Chat Bubbles Stack Container (Scrollable custom scrollbar inside chat container) */}
          <div
            ref={chatScrollRef}
            className="space-y-3 max-w-lg mb-3 sm:mb-4 overflow-y-auto custom-scrollbar max-h-[220px] sm:max-h-[260px] md:max-h-[300px] lg:max-h-[340px] pr-1.5 scroll-smooth animate-[fadeSlideUp_0.5s_ease-out_0.24s_both]"
          >
            {messages.map((msg) => (
              <OnboardingChatBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                timestamp={msg.timestamp}
                isTyping={msg.isTyping}
              />
            ))}
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="shrink-0 pt-1 animate-[fadeSlideUp_0.45s_ease-out_0.3s_both]">
            <OnboardingChatInput onSend={handleSendMessage} onPrev={onPrev} />
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
