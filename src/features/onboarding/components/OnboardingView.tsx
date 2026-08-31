import React from "react";
import { useOnboardingFlow } from "../hooks/useOnboardingFlow";
import { OnboardingWelcomeStep } from "./OnboardingWelcomeStep";
import { OnboardingAuthStep } from "./OnboardingAuthStep";
import { OnboardingQuestionsStep } from "./OnboardingQuestionsStep";
import { OnboardingDnaAnalysisStep } from "./OnboardingDnaAnalysisStep";
import { OnboardingFirstConversationStep } from "./OnboardingFirstConversationStep";
import { OnboardingReadyStep } from "./OnboardingReadyStep";
import { useCurrentUser } from "../../../shared/hooks/useCurrentUser";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { logger } from "../../../shared/utils/logger";

export interface OnboardingViewProps {
  onFinish?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  const {
    step,
    nextStep,
    prevStep,
    openAuth,
    learnerProfile,
    updateLearnerProfile,
  } = useOnboardingFlow();

  const { updateProfileSettings } = useCurrentUser();

  const handleStartLearning = async () => {
    try {
      await updateProfileSettings({
        name: learnerProfile.name || "Learner",
        cefrLevel: learnerProfile.cefrLevel,
        dailyFocus: learnerProfile.dailyFocus,
        learningGoal: learnerProfile.learningGoal,
        preferenceStyle: learnerProfile.preferenceStyle,
        profession: learnerProfile.profession,
        onboardingCompleted: true,
      });
    } catch (e) {
      logger.warn("[OnboardingView] Error saving profile settings on finish", e);
    }
    localStorage.setItem("lingua_onboarding_completed", "true");
    if (onFinish) onFinish();
    else logger.info("Onboarding complete — Start Learning");
  };

  const isCenteredHeroLayout = step === "welcome" || step === "auth";

  return (
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#03030E] text-slate-100 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* 🌟 Persistent Right-Side Background Orb — Only for question/assessment steps */}
      {!isCenteredHeroLayout && (
        <div
          className="absolute top-0 right-0 w-[88%] h-full bg-cover bg-no-repeat pointer-events-none z-0 opacity-90 blend-graphic-edges-right"
          style={{
            backgroundImage: "url('/assets/orb_questions_bg.png')",
            backgroundPosition: "calc(50% + 130px) center",
          }}
        />
      )}

      {/* 🌟 Persistent L I N G U A Header */}
      {!isCenteredHeroLayout && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] px-5 sm:px-10 lg:px-16 pt-5 sm:pt-7 z-30 pointer-events-none select-none">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
            L I N G U A
          </span>
        </div>
      )}

      {/* Main Content Area — Smooth Animated Step Transitions */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center overflow-hidden min-h-0 pt-0">
        <div
          key={step}
          className="w-full h-full flex flex-col items-center justify-center animate-step-transition"
        >
          {step === "auth" && (
            <OnboardingAuthStep
              onSuccess={async (authUser) => {
                if (authUser?.name) {
                  updateLearnerProfile({ name: authUser.name, email: authUser.email || "" });
                }

                // Check if user has genuinely completed the onboarding placement diagnostic:
                try {
                  const profile = await apiSettingsRepository.getProfile();
                  if (profile && profile.onboardingCompleted) {
                    updateLearnerProfile({
                      name: (profile.name || authUser?.name || "Learner") as string,
                      email: (profile.email || authUser?.email || "") as string,
                      cefrLevel: profile.cefrLevel,
                      dailyFocus: profile.dailyFocus,
                      learningGoal: profile.learningGoal || "Tech Career",
                      preferenceStyle: profile.preferenceStyle || "Conversation First",
                      profession: profile.profession || "Software & Technology",
                    });
                    localStorage.setItem("lingua_onboarding_completed", "true");
                    if (onFinish) {
                      onFinish();
                      return;
                    }
                  }
                } catch (err) {
                  logger.warn("[OnboardingView] Could not fetch remote profile on login", err);
                }

                // If user has not completed the placement diagnostic interview, proceed through calibration
                localStorage.removeItem("lingua_onboarding_completed");
                nextStep();
              }}
              onBackToWelcome={openAuth}
            />
          )}
          {step === "welcome" && (
            <OnboardingWelcomeStep onBegin={nextStep} onOpenLogin={openAuth} />
          )}
          {step === "questions" && (
            <OnboardingQuestionsStep
              profile={learnerProfile}
              onUpdateProfile={updateLearnerProfile}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === "dna-analysis" && (
            <OnboardingDnaAnalysisStep
              profile={learnerProfile}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === "first-conversation" && (
            <OnboardingFirstConversationStep
              profile={learnerProfile}
              onUpdateProfile={updateLearnerProfile}
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === "ready" && (
            <OnboardingReadyStep
              profile={learnerProfile}
              onStartLearning={handleStartLearning}
              onPrev={prevStep}
            />
          )}
        </div>
      </main>
    </div>
  );
};
