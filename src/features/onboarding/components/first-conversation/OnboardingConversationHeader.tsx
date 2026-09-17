import React from "react";
import { OnboardingStepProgress } from "../OnboardingStepProgress";

interface OnboardingConversationHeaderProps {
  turn: 1 | 2 | 3 | 4;
}

export const OnboardingConversationHeader: React.FC<OnboardingConversationHeaderProps> = ({ turn }) => {
  const levelBadge =
    turn === 1
      ? "Level 1 • A1-A2 Routine & Basics"
      : turn === 2
      ? "Level 2 • B1-B2 Problem Solving"
      : turn === 3
      ? "Level 3 • C1-C2 Strategy & Vision"
      : "Diagnostic Evaluation Completed";

  return (
    <div className="space-y-2 mb-2 shrink-0">
      <OnboardingStepProgress currentStep={3} totalSteps={4} percentage={75} className="mb-2" />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white leading-tight">
          First Conversation.
        </h1>
        <span className="text-[10px] sm:text-[10.5px] font-mono uppercase tracking-widest text-[#A78BFA]">
          {levelBadge}
        </span>
      </div>

      <p className="text-xs text-[#999a9b] font-light leading-relaxed">
        Answer naturally in English. I&apos;ll assess your vocabulary and fluency in real-time across 3 difficulty tiers.
      </p>
    </div>
  );
};
