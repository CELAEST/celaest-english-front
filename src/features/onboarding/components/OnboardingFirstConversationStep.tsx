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

  const handleSendMessage = async (text: string) => {
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
      }, 1100);
    } else if (turn === 2) {
      setTurn(3);

      const allUserTexts = [
        ...messages.filter((m) => m.sender === "user").map((m) => m.text),
        text,
      ].join(". ");

      try {
        const { CoreAiEvaluatorService } = await import(
          "../../conversation/services/coreAiEvaluatorService"
        );

        const evaluation = await CoreAiEvaluatorService.evaluate(
          allUserTexts,
          {
            id: 1,
            question:
              "Tell me about your background, projects, and key communication challenges.",
            category: "BEHAVIORAL",
            starHint: "Describe your professional background, active projects, and daily communication challenges.",
            expectedKeywords: [
              "project",
              "team",
              "communication",
              "challenge",
              "experience",
            ],
          },
          profile.profession || profile.learningGoal || "Professional",
        );

        // --- CEFR Calibration: Composite Scoring + LLM Estimation ---
        const grammar = evaluation.grammarScore ?? 50;
        const vocab = evaluation.vocabularyScore ?? 50;
        const clarity = evaluation.clarityScore ?? 50;
        const compositeScore = Math.round(
          grammar * 0.35 + vocab * 0.35 + clarity * 0.30,
        );

        // LLM's own CEFR judgment (if available) takes priority
        const llmCefr = evaluation.estimatedCefrLevel;

        const cefrFromScore = (score: number): string => {
          if (score >= 93) return "C2";
          if (score >= 85) return "C1";
          if (score >= 72) return "B2";
          if (score >= 58) return "B1";
          if (score >= 40) return "A2";
          return "A1";
        };

        const cefrLabels: Record<string, string> = {
          C2: "C2 — Mastery",
          C1: "C1 — Advanced",
          B2: "B2 — Upper Intermediate",
          B1: "B1 — Intermediate",
          A2: "A2 — Elementary",
          A1: "A1 — Beginner",
        };

        const cefrStyles: Record<string, string> = {
          C2: "Native-Like & Nuanced",
          C1: "Fluent & Expressive",
          B2: "Confident & Articulate",
          B1: "Structured & Clear",
          A2: "Foundational & Concise",
          A1: "Emerging & Building",
        };

        const cefrConfidence: Record<string, "Low" | "Medium" | "High"> = {
          C2: "High",
          C1: "High",
          B2: "High",
          B1: "Medium",
          A2: "Low",
          A1: "Low",
        };

        // Use LLM estimation if valid, otherwise fall back to composite score
        const validCefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
        const normalizedLlmCefr = llmCefr?.toUpperCase().trim();
        const cefrCode = validCefrLevels.includes(normalizedLlmCefr || "")
          ? normalizedLlmCefr!
          : cefrFromScore(compositeScore);

        const calculatedLevel = cefrLabels[cefrCode] || "B1 — Intermediate";
        const style = cefrStyles[cefrCode] || "Structured & Clear";
        const confidence = cefrConfidence[cefrCode] || "Medium";

        const strengthsNote =
          evaluation.keyStrengths && evaluation.keyStrengths.length > 0
            ? evaluation.keyStrengths.slice(0, 2).join(", ")
            : "";

        const feedbackMsg = evaluation.strategicFeedback?.explanation
          ? `${evaluation.strategicFeedback.explanation} I have calibrated your baseline at ${calculatedLevel}.`
          : strengthsNote
            ? `Diagnostic complete. I've detected ${strengthsNote} and calibrated your CEFR baseline at ${calculatedLevel}.`
            : `Diagnostic complete. I've calibrated your CEFR baseline at ${calculatedLevel}. Your personalized learning plan is ready.`;

        onUpdateProfile({
          cefrLevel: calculatedLevel,
          conversationStyle: style,
          speakingConfidence: confidence,
          pronunciationScore: "Pending Audio Assessment",
        });

        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: feedbackMsg,
            timestamp: "Just now",
          },
        ]);
      } catch (evalErr) {
        // Safe fallback if network/mesh is interrupted
        const words = allUserTexts.split(/\s+/).filter(Boolean);
        const uniqueWords = new Set(words.map((w) => w.toLowerCase()));
        const wordCount = words.length;

        let calculatedLevel = "B1 — Intermediate";
        if (wordCount >= 60 && uniqueWords.size >= 40) {
          calculatedLevel = "C1 — Advanced";
        } else if (wordCount >= 40 && uniqueWords.size >= 28) {
          calculatedLevel = "B2 — Upper Intermediate";
        } else if (wordCount >= 20) {
          calculatedLevel = "B1 — Intermediate";
        } else if (wordCount >= 8) {
          calculatedLevel = "A2 — Elementary";
        } else {
          calculatedLevel = "A1 — Beginner";
        }

        onUpdateProfile({
          cefrLevel: calculatedLevel,
          conversationStyle: "Structured & Clear",
          speakingConfidence: "Medium",
          pronunciationScore: "Pending Audio Assessment",
        });
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: `Diagnostic complete. I've calibrated your CEFR benchmark at ${calculatedLevel}. Your personalized learning plan is ready.`,
            timestamp: "Just now",
          },
        ]);
      }
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
