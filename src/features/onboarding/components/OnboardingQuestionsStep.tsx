import React, { useState } from "react";
import { OnboardingStepProgress } from "./OnboardingStepProgress";
import { LearnerProfileData } from "../types";
import { ProfessionNormalizerService } from "../services/professionNormalizerService";
import { AiInfrastructureRecoveryModal } from "../../lab/components/AiInfrastructureRecoveryModal";
import { classifyAiError } from "../../../shared/services/aiErrorClassifier";
import { ErrorScenarioData, ERROR_DATA } from "../../../shared/constants/errorScenarios";
import { Loader2 } from "lucide-react";
import { logger } from "../../../shared/utils/logger";

export interface OnboardingQuestionsStepProps {
  profile: LearnerProfileData;
  onUpdateProfile: (partial: Partial<LearnerProfileData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const GOALS = [
  { id: "tech", label: "Tech, AI & Software Engineering", value: "Tech Career & AI" },
  { id: "business", label: "Global Business & Remote Work", value: "Business & International Work" },
  { id: "fluency", label: "Natural Spoken Fluency & Travel", value: "Everyday Fluency & Travel" },
  { id: "academic", label: "Academic, TOEFL / IELTS Exams", value: "Academic & Exams" },
];

const STYLES = [
  { id: "conv", label: "Conversation First • Active speaking from Day 1", value: "Conversation First" },
  { id: "read", label: "Reading & Deep Vocabulary Analysis", value: "Reading First" },
  { id: "drill", label: "Real-world Scenario & Interview Drills", value: "Interview Drills" },
  { id: "bal", label: "Balanced • Adaptive mix of all skills", value: "Balanced" },
];

const COMMITMENTS = [
  { id: "10", label: "10 min / day • Quick daily boost", value: "10 min" },
  { id: "20", label: "20 min / day • Optimal progress", value: "20 min" },
  { id: "30", label: "30+ min / day • Fast-track mastery", value: "30 min" },
];

export const OnboardingQuestionsStep: React.FC<OnboardingQuestionsStepProps> = ({
  profile,
  onUpdateProfile,
  onNext,
  onPrev,
}) => {
  const [subStep, setSubStep] = useState<0 | 1 | 2 | 3>(0);
  const [professionInput, setProfessionInput] = useState(profile.profession || "");
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [recoveryScenario, setRecoveryScenario] = useState<ErrorScenarioData>(ERROR_DATA["keys-exhausted-pool"]);
  const [recoveryCooldown, setRecoveryCooldown] = useState(0);
  const [engineErrorMessage, setEngineErrorMessage] = useState<string | null>(null);

  const canAdvance =
    subStep === 0
      ? Boolean(profile.learningGoal)
      : subStep === 1
        ? Boolean(profile.preferenceStyle)
        : subStep === 2
          ? Boolean(profile.dailyFocus)
          : Boolean(professionInput.trim());

  const handleNextSubStep = async () => {
    if (!canAdvance || isNormalizing) return;
    if (subStep < 3) {
      setSubStep((prev) => (prev + 1) as 0 | 1 | 2 | 3);
    } else {
      setIsNormalizing(true);
      setEngineErrorMessage(null);
      try {
        const cleanProfession = await ProfessionNormalizerService.normalizeAsync(professionInput);
        onUpdateProfile({ profession: cleanProfession });
        onNext();
      } catch (err: any) {
        logger.warn("[OnboardingQuestionsStep] AI Provider failure during profession normalization:", err);
        const { scenario, cooldownSeconds } = classifyAiError(err);
        setRecoveryScenario(scenario);
        setRecoveryCooldown(cooldownSeconds);
        setEngineErrorMessage(
          err?.message || "Tu proveedor de IA no tiene saldo disponible (Insufficient Balance).",
        );
        setIsRecoveryModalOpen(true);
      } finally {
        setIsNormalizing(false);
      }
    }
  };

  const handlePrevSubStep = () => {
    if (subStep > 0) {
      setSubStep((prev) => (prev - 1) as 0 | 1 | 2 | 3);
    } else {
      onPrev();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col mx-auto select-none overflow-hidden">
      {/* Left-Side Content Panel */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1280px] mx-auto px-5 sm:px-10 lg:px-16 py-3 sm:py-5 overflow-hidden">
        {/* Top Spacer matching persistent LINGUA Header height */}
        <div className="shrink-0 h-5 sm:h-7" />

        {/* Middle: Question Content (Pure typography & borderless pills) */}
        <div className="flex-1 flex flex-col justify-center max-w-xl min-h-0 my-auto py-1">
          {/* Progress Indicator: 01 / 04 (25%) */}
          <OnboardingStepProgress
            currentStep={1}
            totalSteps={4}
            percentage={25}
            className="mb-3 sm:mb-4"
          />

          {/* Title */}
          <div className="space-y-1 mb-3 shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-light tracking-tight text-white leading-tight animate-[fadeSlideUp_0.4s_ease-out_both]">
              Hi, I&apos;m Lingua.
              <br />
              <span className="text-[#A27FF3] font-light">I&apos;ll be your AI Mentor.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#999a9b] font-light leading-relaxed animate-[fadeSlideUp_0.45s_ease-out_0.08s_both]">
              Let&apos;s calibrate your learning journey to fit your real goals.
            </p>
          </div>

          {/* Substep 0: Learning Goal */}
          {subStep === 0 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                1. What is your main objective with English?
              </label>
              <div className="flex flex-col space-y-1.5">
                {GOALS.map((g) => {
                  const selected = profile.learningGoal === g.value;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onUpdateProfile({ learningGoal: g.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.12] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                          : "bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 1: Learning Style */}
          {subStep === 1 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                2. How do you prefer to learn?
              </label>
              <div className="flex flex-col space-y-1.5">
                {STYLES.map((s) => {
                  const selected = profile.preferenceStyle === s.value;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onUpdateProfile({ preferenceStyle: s.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.12] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                          : "bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 2: Daily Commitment */}
          {subStep === 2 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-2 tracking-wide">
                3. How much time can you practice daily?
              </label>
              <div className="flex flex-col space-y-1.5">
                {COMMITMENTS.map((c) => {
                  const selected = profile.dailyFocus === c.value;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onUpdateProfile({ dailyFocus: c.value })}
                      className={`w-full text-left px-4 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                        selected
                          ? "bg-white/[0.12] text-white font-medium shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                          : "bg-white/[0.02] hover:bg-white/[0.06] text-white/60 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substep 3: Profession / Field */}
          {subStep === 3 && (
            <div className="space-y-2 mb-4 animate-[fadeSlideUp_0.4s_ease-out_both]">
              <label className="block text-xs sm:text-sm font-medium text-[#C4B5FD] mb-1.5 tracking-wide">
                4. What is your profession or specialty?
              </label>
              <p className="text-[11px] text-[#71719A] font-light mb-2">
                I will tailor conversation topics and vocabulary to your career.
              </p>
              <div className="relative border-b border-white/20 focus-within:border-[#8B5CF6] transition-colors py-1.5">
                <input
                  type="text"
                  value={professionInput}
                  onChange={(e) => {
                    setProfessionInput(e.target.value);
                    onUpdateProfile({ profession: e.target.value });
                    if (engineErrorMessage) setEngineErrorMessage(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && canAdvance && !isNormalizing) {
                      e.preventDefault();
                      void handleNextSubStep();
                    }
                  }}
                  placeholder="e.g. Software Engineer, Doctor, Designer, Student..."
                  className="w-full bg-transparent text-sm text-white placeholder-[#555570] outline-none"
                  autoFocus
                />
              </div>

              {engineErrorMessage && (
                <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 animate-[fadeIn_0.2s_ease-out]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    <span className="font-light leading-relaxed">
                      {engineErrorMessage.includes("saldo") || engineErrorMessage.includes("Balance")
                        ? "Tu cuenta de IA no tiene saldo disponible ($0.00). Cambia a Groq gratis para continuar de una vez."
                        : engineErrorMessage}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRecoveryModalOpen(true)}
                    className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white text-black font-medium text-[11px] hover:bg-white/90 transition-all shrink-0 cursor-pointer shadow-sm"
                  >
                    Cambiar a Groq Gratis
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevSubStep}
              disabled={isNormalizing}
              className="flex items-center text-xs sm:text-sm font-light text-[#9999B5] hover:text-white hover:-translate-x-0.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>

            <button
              type="button"
              disabled={!canAdvance || isNormalizing}
              onClick={handleNextSubStep}
              aria-disabled={!canAdvance || isNormalizing}
              className={`group inline-flex items-center justify-center px-8 sm:px-12 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 rounded-full ${
                canAdvance && !isNormalizing
                  ? "text-white bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
                  : "text-white/30 bg-white/[0.05] border border-white/[0.05] cursor-not-allowed"
              }`}
            >
              {isNormalizing ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Verificando IA...</span>
                </span>
              ) : (
                <>
                  <span>{subStep === 3 ? "Continue" : "Next"}</span>
                  <svg className="w-3.5 h-3.5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="shrink-0 h-1 sm:h-2" />
      </div>

      {/* Luxury AI Infrastructure Recovery Modal */}
      <AiInfrastructureRecoveryModal
        isOpen={isRecoveryModalOpen}
        scenario={recoveryScenario}
        cooldown={recoveryCooldown}
        contextType="writing"
        onClose={() => setIsRecoveryModalOpen(false)}
        onImmediateResume={() => {
          setIsRecoveryModalOpen(false);
          setEngineErrorMessage(null);
          setTimeout(() => {
            void handleNextSubStep();
          }, 350);
        }}
      />
    </div>
  );
};
