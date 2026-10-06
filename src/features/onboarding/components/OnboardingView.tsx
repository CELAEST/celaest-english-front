import React from "react";
import { OptimizedVideo } from "../../../design-system/components/Media/OptimizedVideo";
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
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";

export interface OnboardingViewProps {
  onFinish?: () => void;
}

const OnboardingViewInner: React.FC<OnboardingViewProps> = ({ onFinish }) => {
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

  const { updateProfileSettings, settings } = useCurrentUser();
  const authAdapter = SupabaseAuthAdapter.getInstance();
  const isAuth = authAdapter.isAuthenticated();
  const storedUser = authAdapter.getStoredUser();

  // If already completed onboarding, auto-finish immediately (zero amnesia, zero restart)
  React.useEffect(() => {
    const isCompleted =
      (storedUser?.id ? localStorage.getItem(`lingua_onboarding_completed_${storedUser.id}`) === "true" : false) ||
      (storedUser?.email ? localStorage.getItem(`lingua_onboarding_completed_${storedUser.email}`) === "true" : false) ||
      storedUser?.onboardingCompleted === true ||
      settings?.onboardingCompleted === true;

    if (isAuth && isCompleted && onFinish) {
      onFinish();
    }
  }, [isAuth, settings?.onboardingCompleted, storedUser?.id, storedUser?.email, storedUser?.onboardingCompleted, onFinish]);

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
    if (learnerProfile.profession) {
      localStorage.setItem("celaest:active_profession", learnerProfile.profession);
    }
    localStorage.setItem("lingua_onboarding_completed", "true");
    if (storedUser?.id) localStorage.setItem(`lingua_onboarding_completed_${storedUser.id}`, "true");
    if (storedUser?.email) localStorage.setItem(`lingua_onboarding_completed_${storedUser.email}`, "true");
    if (onFinish) onFinish();
    else logger.info("Onboarding complete — Start Learning");
  };

  const isCenteredHeroLayout = step === "welcome" || step === "auth";
  const showRightVideo =
    step === "api-key" ||
    step === "questions" ||
    step === "dna-analysis" ||
    step === "placement-quiz" ||
    step === "first-conversation" ||
    step === "beginner-check";

  return (
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#000003] text-slate-100 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* 🌟 Right-Side AI Mentor Sphere Video — ask — visible only on desktop (lg+), grande e imponente para apreciar todos los detalles */}
      {showRightVideo && (
        <>
          <div className="hidden lg:flex absolute inset-y-0 right-0 w-[55vw] items-center justify-center pointer-events-none z-0 overflow-hidden">
            <div className="scale-[1.25] xl:scale-[1.4] 2xl:scale-[1.5] transition-transform duration-300 flex items-center justify-center">
              <OptimizedVideo
                src="/assets/ask"
                className="w-[780px] xl:w-[920px] 2xl:w-[1080px] h-auto object-contain mix-blend-screen opacity-95 pointer-events-none"
              />
            </div>
          </div>
          {/* Gradiente protector legibilidad */}
          <div className="absolute inset-0 pointer-events-none z-[1] hidden lg:block bg-gradient-to-r from-[#000003] via-[#000003]/90 to-transparent" style={{ width: "45%" }} />
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
                if (mode === "login") {
                  try {
                    const profile = await apiSettingsRepository.getProfile();
                    const isUserCompletedLocal =
                      (authUser?.id && localStorage.getItem(`lingua_onboarding_completed_${authUser.id}`) === "true") ||
                      (authUser?.email && localStorage.getItem(`lingua_onboarding_completed_${authUser.email}`) === "true") ||
                      authUser?.onboardingCompleted === true;

                    if (profile && (profile.onboardingCompleted || isUserCompletedLocal)) {
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
                      if (authUser?.id) localStorage.setItem(`lingua_onboarding_completed_${authUser.id}`, "true");
                      if (authUser?.email) localStorage.setItem(`lingua_onboarding_completed_${authUser.email}`, "true");
                      try {
                        apiSettingsRepository.updateSettings({ onboardingCompleted: true }).catch(() => {});
                      } catch {
                        // ignore
                      }
                      if (onFinish) {
                        onFinish();
                        return;
                      }
                    }
                  } catch (err) {
                    logger.warn("[OnboardingView] Could not fetch remote profile on login", err);
                    const isUserCompletedLocal =
                      (authUser?.id && localStorage.getItem(`lingua_onboarding_completed_${authUser.id}`) === "true") ||
                      (authUser?.email && localStorage.getItem(`lingua_onboarding_completed_${authUser.email}`) === "true") ||
                      authUser?.onboardingCompleted === true;
                    if (isUserCompletedLocal) {
                      localStorage.setItem("lingua_onboarding_completed", "true");
                      if (authUser?.id) localStorage.setItem(`lingua_onboarding_completed_${authUser.id}`, "true");
                      if (authUser?.email) localStorage.setItem(`lingua_onboarding_completed_${authUser.email}`, "true");
                      if (onFinish) {
                        onFinish();
                        return;
                      }
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
                  if (authUser?.id) localStorage.setItem(`lingua_onboarding_completed_${authUser.id}`, "true");
                  if (authUser?.email) localStorage.setItem(`lingua_onboarding_completed_${authUser.email}`, "true");
                  if (onFinish) {
                    onFinish();
                    return;
                  }
                }

                // 4. Fresh registration: Proceed cleanly to API Key screen
                goToStep("api-key");
              }}
            />
          )}
          {step === "welcome" && (
            <OnboardingWelcomeStep onBegin={nextStep} onOpenLogin={openAuth} />
          )}
          {step === "api-key" && (
            <OnboardingApiKeyStep onNext={nextStep} />
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

export const OnboardingView = React.memo(OnboardingViewInner);

