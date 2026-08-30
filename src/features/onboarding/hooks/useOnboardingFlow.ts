import { useState } from "react";
import { OnboardingStep, UserAnswer, LearnerProfileData } from "../types";

export const useOnboardingFlow = () => {
  // Initial entry point is Auth (Sign In / Register)
  const [step, setStep] = useState<OnboardingStep>("auth");
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [learnerProfile, setLearnerProfile] = useState<LearnerProfileData>({
    name: "Learner",
    email: "",
    learningGoal: "Tech Career & AI",
    preferenceStyle: "Conversation First",
    dailyFocus: "20 min",
    profession: "Software Engineer",
    speakingConfidence: "Medium",
    cefrLevel: "B1 — Intermediate",
    conversationStyle: "Direct & Structured",
    pronunciationScore: "Good",
    topics: ["Programming", "AI", "Technology"],
  });

  const nextStep = () => {
    if (step === "auth") setStep("welcome");
    else if (step === "welcome") setStep("questions");
    else if (step === "questions") setStep("dna-analysis");
    else if (step === "dna-analysis") setStep("first-conversation");
    else if (step === "first-conversation") setStep("ready");
  };

  const prevStep = () => {
    if (step === "welcome") setStep("auth");
    else if (step === "questions") setStep("welcome");
    else if (step === "dna-analysis") setStep("questions");
    else if (step === "first-conversation") setStep("dna-analysis");
    else if (step === "ready") setStep("first-conversation");
  };

  const openAuth = () => setStep("auth");
  const openWelcome = () => setStep("welcome");

  const updateLearnerProfile = (partial: Partial<LearnerProfileData>) => {
    setLearnerProfile((prev) => ({ ...prev, ...partial }));
  };

  const submitAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionId !== questionId),
      { questionId, answer },
    ]);
  };

  return {
    step,
    setStep,
    openAuth,
    openWelcome,
    answers,
    submitAnswer,
    learnerProfile,
    updateLearnerProfile,
    isAnalyzing,
    setIsAnalyzing,
    nextStep,
    prevStep,
  };
};
