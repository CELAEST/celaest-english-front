import React, { useState, useRef, useEffect } from "react";
import { OnboardingStepProgress } from "./OnboardingStepProgress";
import { OnboardingChatBubble } from "./OnboardingChatBubble";
import { OnboardingChatInput } from "./OnboardingChatInput";
import { LearnerProfileData } from "../types";

export interface OnboardingFirstConversationStepProps {
  profile: LearnerProfileData;
  onUpdateProfile: (partial: Partial<LearnerProfileData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp?: string;
  isTyping?: boolean;
}

export const OnboardingFirstConversationStep: React.FC<OnboardingFirstConversationStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [turn, setTurn] = useState<1 | 2 | 3>(1);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const initialQuestion = profile.profession
    ? `Tell me briefly about what you do as a ${profile.profession} and what projects you're currently working on.`
    : "Tell me a little about yourself and what you're hoping to achieve with English.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: initialQuestion,
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    if (turn === 1) {
      setTurn(2);
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Great! If you had the opportunity to collaborate with an international team, what would be your biggest challenge in daily communication?",
            timestamp: "Just now",
          },
        ]);
      }, 1200);
    } else if (turn === 2) {
      setTurn(3);
      // Run CEFR lexical & grammatical heuristic diagnostic
      const fullText = `${messages.map((m) => m.text).join(" ")} ${text}`;
      const words = fullText.split(/\s+/).filter(Boolean);
      const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
      const wordCount = words.length;

      let calculatedLevel = "B1 — Intermediate";
      let style = "Analytical & Direct";
      let confidence: "Low" | "Medium" | "High" = "Medium";

      if (wordCount >= 40 || uniqueWords.size >= 30) {
        calculatedLevel = "B2 — Upper Intermediate";
        style = "Fluent & Expressive";
        confidence = "High";
      } else if (wordCount >= 20) {
        calculatedLevel = "B1 — Intermediate";
        style = "Structured & Clear";
        confidence = "Medium";
      } else {
        calculatedLevel = "A2 — Elementary";
        style = "Foundational & Concise";
        confidence = "Low";
      }

      onUpdateProfile({
        cefrLevel: calculatedLevel,
        conversationStyle: style,
        speakingConfidence: confidence,
        pronunciationScore: confidence === "High" ? "Strong" : "Good",
      });

      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: `Excellent! Diagnostic complete. I've calibrated your CEFR benchmark at ${calculatedLevel}. Your personalized learning plan is ready.`,
            timestamp: "Just now",
          },
        ]);
      }, 1400);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle: Conversation Diagnostic Content */}
        <div className="flex-1 flex flex-col justify-center max-w-lg min-h-0 my-auto py-1">
          {/* Progress Indicator: 03 / 04 (75%) */}
          <OnboardingStepProgress
            currentStep={3}
            totalSteps={4}
            percentage={75}
            className="mb-3 sm:mb-4"
          />

          {/* Title */}
          <div className="space-y-0.5 mb-3 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.4s_ease-out_both]">
              First Conversation.
            </h1>
            <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed animate-[fadeSlideUp_0.45s_ease-out_0.08s_both]">
              Answer naturally in English. I&apos;ll assess your vocabulary and fluency in real-time.
            </p>
          </div>

          {/* Chat Messages Container */}
          <div
            ref={chatScrollRef}
            className="space-y-3 max-w-lg mb-3 overflow-y-auto custom-scrollbar max-h-[220px] sm:max-h-[260px] md:max-h-[280px] pr-1.5 scroll-smooth"
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
                text="Analyzing language patterns..."
                isTyping={true}
              />
            )}
          </div>

          {/* Chat Input or Finished CTA */}
          {turn <= 2 ? (
            <OnboardingChatInput onSend={handleSendMessage} onPrev={onPrev} />
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onPrev}
                className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>

              <button
                onClick={onNext}
                className="group inline-flex items-center justify-center px-10 sm:px-14 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white transition-all duration-300 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(124,58,237,0.8)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>View Learning Roadmap</span>
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Spacer */}
        <div className="shrink-0 h-1 sm:h-2" />
      </div>
    </div>
  );
};
