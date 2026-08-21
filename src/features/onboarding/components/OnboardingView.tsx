import React from 'react';
import { useOnboardingFlow } from '../hooks/useOnboardingFlow';
import { OnboardingWelcomeStep } from './OnboardingWelcomeStep';
import { OnboardingQuestionsStep } from './OnboardingQuestionsStep';
import { OnboardingDnaAnalysisStep } from './OnboardingDnaAnalysisStep';
import { OnboardingFirstConversationStep } from './OnboardingFirstConversationStep';
import { OnboardingReadyStep } from './OnboardingReadyStep';
import { OnboardingFooter } from './OnboardingFooter';

export interface OnboardingViewProps {
  onFinish?: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onFinish }) => {
  const { step, nextStep, prevStep } = useOnboardingFlow();

  const handleStartLearning = () => {
    if (onFinish) onFinish();
    else console.log('Onboarding complete — Start Learning');
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen bg-[#03030E] text-slate-100 font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* 🌟 Persistent Right-Side Background Orb — Only rendered for question/flow steps (step !== 'welcome') so image NEVER moves between steps */}
      {step !== 'welcome' && (
        <div
          className="absolute top-0 right-0 w-[88%] h-full bg-cover bg-no-repeat pointer-events-none z-0 opacity-90 blend-graphic-edges-right"
          style={{
            backgroundImage: "url('/assets/orb_questions_bg.png')",
            backgroundPosition: 'calc(50% + 130px) center',
          }}
        />
      )}

      {/* 🌟 Persistent L I N G U A Header — Rendered outside key={step} so it NEVER re-renders, jumps, or animates on step changes */}
      {step !== 'welcome' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] px-5 sm:px-10 lg:px-16 pt-5 sm:pt-7 z-30 pointer-events-none select-none">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#7750a7] uppercase">
            L I N G U A
          </span>
        </div>
      )}

      {/* Main Content Area — Smooth Animated Step Transitions (key={step} re-triggers animate-step-transition on every step change) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center overflow-hidden min-h-0 pt-0">
        <div key={step} className="w-full h-full flex flex-col items-center justify-center animate-step-transition">
          {step === 'welcome' && <OnboardingWelcomeStep onBegin={nextStep} />}
          {step === 'questions' && <OnboardingQuestionsStep onNext={nextStep} onPrev={prevStep} />}
          {step === 'dna-analysis' && (
            <OnboardingDnaAnalysisStep onNext={nextStep} onPrev={prevStep} />
          )}
          {step === 'first-conversation' && (
            <OnboardingFirstConversationStep onNext={nextStep} onPrev={prevStep} />
          )}
          {step === 'ready' && (
            <OnboardingReadyStep onStartLearning={handleStartLearning} onPrev={prevStep} />
          )}
        </div>
      </main>

      {/* Footer Controls — Welcome Step Only */}
      {step === 'welcome' && <OnboardingFooter />}
    </div>
  );
};
