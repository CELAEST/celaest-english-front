import { useState, useEffect } from "react";
import { OnboardingStep, UserAnswer, LearnerProfileData } from "../types";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";

export const useOnboardingFlow = () => {
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const storedUser = authAdapter.getStoredUser();
  const isAuth = authAdapter.isAuthenticated();

  // If genuinely authenticated with valid token, land on Welcome; otherwise ALWAYS auth (login)
  const [step, setStep] = useState<OnboardingStep>(() => (isAuth ? "welcome" : "auth"));
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Global listener for session expiration / 401: instantly route to login form
  useEffect(() => {
    const handleAuthRevoked = () => {
      setStep("auth");
    };

    const handleAuthChanged = () => {
      if (!authAdapter.isAuthenticated()) {
        setStep("auth");
      }
    };

    window.addEventListener("celaest:unauthorized", handleAuthRevoked);
    window.addEventListener("celaest:auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("celaest:unauthorized", handleAuthRevoked);
      window.removeEventListener("celaest:auth-changed", handleAuthChanged);
    };
  }, [authAdapter]);

  const [learnerProfile, setLearnerProfile] = useState<LearnerProfileData>({
    name: storedUser?.name || "Learner",
    email: storedUser?.email || "",
    learningGoal: "Professional Fluency & Spoken Confidence",
    preferenceStyle: "Conversation First",
    dailyFocus: "20 min",
    profession: "Professional",
    speakingConfidence: "Medium",
    cefrLevel: "B1 — Intermediate",
    conversationStyle: "Direct & Structured",
    pronunciationScore: "Good",
    topics: ["Professional Communication", "Career Growth", "Global Collaboration"],
  });

  const [isBeginnerTrack, setIsBeginnerTrack] = useState<boolean>(false);

  const goToStep = (target: OnboardingStep) => {
    setStep(target);
  };

  const nextStep = () => {
    if (step === "auth") setStep("api-key");
    else if (step === "welcome") setStep("api-key");
    else if (step === "api-key") setStep("beginner-check");
    else if (step === "beginner-check") setStep("questions");
    else if (step === "questions") {
      if (isBeginnerTrack) {
        setStep("ready");
      } else {
        setStep("dna-analysis");
      }
    }
    else if (step === "dna-analysis") setStep("placement-quiz");
    else if (step === "placement-quiz") setStep("first-conversation");
    else if (step === "first-conversation") setStep("ready");
  };

  const prevStep = () => {
    if (step === "welcome") {
      if (!isAuth) setStep("auth");
    } else if (step === "api-key") setStep("welcome");
    else if (step === "beginner-check") setStep("api-key");
    else if (step === "questions") setStep("beginner-check");
    else if (step === "dna-analysis") setStep("questions");
    else if (step === "placement-quiz") setStep("dna-analysis");
    else if (step === "first-conversation") setStep("placement-quiz");
    else if (step === "ready") {
      if (isBeginnerTrack) {
        setStep("questions");
      } else {
        setStep("first-conversation");
      }
    }
  };

  const selectBeginnerTrack = (profession?: string) => {
    setIsBeginnerTrack(true);
    setLearnerProfile((prev) => ({
      ...prev,
      profession: profession || prev.profession || "Professional",
      cefrLevel: "A1 — Beginner",
      speakingConfidence: "Low",
      conversationStyle: "Foundational & Step-by-Step",
      learningGoal: prev.learningGoal || "Everyday Fluency & Travel",
      preferenceStyle: prev.preferenceStyle || "Conversation First",
    }));
    setStep("questions");
  };

  const selectExperiencedTrack = () => {
    setIsBeginnerTrack(false);
    setStep("questions");
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
    goToStep,
    isBeginnerTrack,
    selectBeginnerTrack,
    selectExperiencedTrack,
  };
};
