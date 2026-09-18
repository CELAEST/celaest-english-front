import React from "react";
import { useOnboardingFlow } from "../hooks/useOnboardingFlow";
import { OnboardingWelcomeStep } from "./OnboardingWelcomeStep";
import { OnboardingAuthStep } from "./OnboardingAuthStep";
import { OnboardingApiKeyStep } from "./OnboardingApiKeyStep";
import { OnboardingBeginnerCheckStep } from "./OnboardingBeginnerCheckStep";
import { OnboardingQuestionsStep } from "./OnboardingQuestionsStep";
import { OnboardingDnaAnalysisStep } from "./OnboardingDnaAnalysisStep";
import { OnboardingPlacementQuizStep } from "./OnboardingPlacementQuizStep";
import { OnboardingFirstConversationStep } from "./OnboardingFirstConversationStep";
import { OnboardingReadyStep } from "./OnboardingReadyStep";
import { useCurrentUser } from "../../../shared/hooks/useCurrentUser";
import { apiSettingsRepository } from "../../../infrastructure/repositories/ApiSettingsRepository";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";

export interface OnboardingViewProps {
  onFinish?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  const {
    step,
    nextStep,
    prevStep,
    goToStep,
    openAuth,
    learnerProfile,
    updateLearnerProfile,
    selectBeginnerTrack,
    selectExperiencedTrack,
    answers,
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
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#000003] text-slate-100 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* 🌟 Right-Side Video — ask — super fluido, sin salto, mix-blend para negro */}
      {!isCenteredHeroLayout && (
        <>
          <video
            src="/assets/ask.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute top-1/2 right-0 sm:right-[1%] lg:right-[2%] xl:right-[3%] w-[96%] sm:w-[85%] lg:w-[58%] xl:w-[54%] 2xl:w-[50%] h-[75vh] sm:h-[85vh] lg:h-[94vh] max-w-[1100px] object-contain pointer-events-none z-0 opacity-90 hidden sm:block mix-blend-screen"
            style={{
              transform: "translateY(-50%) scale(1.4) translateZ(0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />
          {/* Mobile: video proporcional arriba — fluido */}
          <video
            src="/assets/ask.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute top-[4%] left-1/2 w-[94%] h-[32vh] object-contain pointer-events-none z-0 opacity-30 sm:hidden rounded-2xl overflow-hidden mix-blend-screen"
            style={{
              transform: "translateX(-50%) translateZ(0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />
          {/* Gradiente protector legibilidad */}
          <div className="absolute inset-0 pointer-events-none z-[1] hidden lg:block bg-gradient-to-r from-[#000003] via-[#000003]/95 to-transparent" style={{ width: "54%" }} />
        </>
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
              onSuccess={async (authUser, mode) => {
                if (authUser?.id) {
                  // 1. Instantly migrate all session-stored keys and configs to user vault
                  try {
                    await providerKeyVault.migrateSessionToUser(authUser.id);
                  } catch (e) {
                    logger.warn("[OnboardingView] Key migration error", e);
                  }
                }

                if (authUser?.name) {
                  updateLearnerProfile({ name: authUser.name, email: authUser.email || "" });
                }

                // 2. Returning User Login or Profile already completed
                try {
                  const profile = await apiSettingsRepository.getProfile();
                  if (profile && (profile.onboardingCompleted || mode === "login")) {
                    updateLearnerProfile({
                      name: (profile.name || authUser?.name || learnerProfile.name || "Learner") as string,
                      email: (profile.email || authUser?.email || learnerProfile.email || "") as string,
                      cefrLevel: profile.cefrLevel || learnerProfile.cefrLevel,
                      dailyFocus: profile.dailyFocus || learnerProfile.dailyFocus,
                      learningGoal: profile.learningGoal || learnerProfile.learningGoal,
                      preferenceStyle: profile.preferenceStyle || learnerProfile.preferenceStyle,
                      profession: profile.profession || learnerProfile.profession,
                    });
                    localStorage.setItem("lingua_onboarding_completed", "true");
                    if (onFinish) {
                      onFinish();
                      return;
                    }
                  }
                } catch (err) {
                  logger.warn("[OnboardingView] Could not fetch remote profile on login", err);
                  // If login succeeded and backend is temporarily unreachable, let returning users in
                  if (mode === "login") {
                    localStorage.setItem("lingua_onboarding_completed", "true");
                    if (onFinish) {
                      onFinish();
                      return;
                    }
                  }
                }

                // 3. User already took test / diagnostic in this session before registering
                const hasCompletedTestLocally =
                  Boolean(learnerProfile.placementQuiz) ||
                  answers.length > 0 ||
                  learnerProfile.cefrLevel !== "B1 — Intermediate";

                if (hasCompletedTestLocally) {
                  try {
                    await updateProfileSettings({
                      name: authUser?.name || learnerProfile.name || "Learner",
                      cefrLevel: learnerProfile.cefrLevel,
                      dailyFocus: learnerProfile.dailyFocus,
                      learningGoal: learnerProfile.learningGoal,
                      preferenceStyle: learnerProfile.preferenceStyle,
                      profession: learnerProfile.profession,
                      onboardingCompleted: true,
                    });
                  } catch (e) {
                    logger.warn("[OnboardingView] Error saving pre-calibrated test data on register", e);
                  }
                  localStorage.setItem("lingua_onboarding_completed", "true");
                  if (onFinish) {
                    onFinish();
                    return;
                  }
                }

                // 4. Fresh registration: Proceed straight into configuration, never bounce to "Begin"
                localStorage.removeItem("lingua_onboarding_completed");
                const hasExistingKey =
                  (await providerKeyVault.hasKey("groq")) ||
                  (await providerKeyVault.hasKey("gemini")) ||
                  (await providerKeyVault.hasKey("openai"));

                if (hasExistingKey) {
                  goToStep("beginner-check");
                } else {
                  goToStep("api-key");
                }
              }}
              onBackToWelcome={openAuth}
            />
          )}
          {step === "welcome" && (
            <OnboardingWelcomeStep onBegin={nextStep} onOpenLogin={openAuth} />
          )}
          {step === "api-key" && (
            <OnboardingApiKeyStep onNext={nextStep} onPrev={prevStep} />
          )}
          {step === "beginner-check" && (
            <OnboardingBeginnerCheckStep
              profile={learnerProfile}
              onSelectBeginner={(prof) => selectBeginnerTrack(prof)}
              onSelectExperienced={() => selectExperiencedTrack()}
              onPrev={prevStep}
            />
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
          {step === "placement-quiz" && (
            <OnboardingPlacementQuizStep
              onComplete={(result) => {
                updateLearnerProfile({ placementQuiz: result });
                nextStep();
              }}
              onSkipAsBeginner={() => selectBeginnerTrack(learnerProfile.profession)}
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
