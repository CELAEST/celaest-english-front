import React, { useState, useId } from 'react';
import {
  NexusTopicRadarIcon,
  NexusNeuralDnaIcon,
  NexusLexiconCodexIcon,
  StepCompletedCheckIcon,
  StepTopicTargetIcon,
  StepPersonalizeDnaIcon,
  StepFinalizeBookIcon,
} from '../../reading/components/ReadingBespokeIcons';

/* ─────────────────────────────────────────────────────
   READING GENERATION STATES SHOWCASE
   Interactive Lab module to visualize, inspect, and
   calibrate the first 2 loading states (and the 3rd)
   when the AI generates a new reading story.
   ───────────────────────────────────────────────────── */

const STEPS = [
  {
    id: 1,
    title: 'Calibrating Topic & CEFR Level',
    subtitle: 'Selecting optimal topic & CEFR target...',
    percentage: 34,
    NexusIcon: NexusTopicRadarIcon,
    StepIcon: StepTopicTargetIcon,
    semanticMeaning:
      'The AI Mentor scans user interests, recent conversation topics, and fixes the CEFR skill target (A1–C2). The optic radar icon symbolizes precision convergence on the ideal content zone.',
  },
  {
    id: 2,
    title: 'Synthesizing Linguistic DNA & Vocabulary',
    subtitle: 'Personalizing vocabulary & contextual nuances...',
    percentage: 72,
    NexusIcon: NexusNeuralDnaIcon,
    StepIcon: StepPersonalizeDnaIcon,
    semanticMeaning:
      'Maps the neural synapse network of keywords, grammar structures, and vocabulary personalized for the user. The double-helix icon represents unique linguistic DNA synthesis.',
  },
  {
    id: 3,
    title: 'Finalizing Immersive Reading Experience',
    subtitle: 'Synthesizing personalized reading experience...',
    percentage: 98,
    NexusIcon: NexusLexiconCodexIcon,
    StepIcon: StepFinalizeBookIcon,
    semanticMeaning:
      'Assembles the final reading layout with paragraphs, vocabulary highlights, and pagination. The codex icon represents the complete knowledge artifact ready for consumption.',
  },
];

const DISPLAY_SIZES = [
  { label: '28px (Timeline Node)', size: 28 },
  { label: '48px (Standard)', size: 48 },
  { label: '96px (Detail)', size: 96 },
  { label: '160px (Nexus Hero)', size: 160 },
];

export interface ReadingGenerationStatesShowcaseProps {
  defaultStep?: number | undefined;
}

export const ReadingGenerationStatesShowcase: React.FC<ReadingGenerationStatesShowcaseProps> = ({
  defaultStep = 1,
}) => {
  const [activeStep, setActiveStep] = useState<number>(defaultStep);
  const [displaySize, setDisplaySize] = useState<number>(96);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const baseId = useId();
  const ringGradientId = `labNexusOrbitGrad-${baseId}`;

  const currentStepData = STEPS.find((s) => s.id === activeStep) || STEPS[0];
  const ringCircumference = 2 * Math.PI * 64;
  const ringOffset =
    ringCircumference - (currentStepData.percentage / 100) * ringCircumference;

  const runAnimation = () => {
    setIsAnimating(true);
    setActiveStep(1);
    setTimeout(() => setActiveStep(2), 1200);
    setTimeout(() => setActiveStep(3), 2600);
    setTimeout(() => setIsAnimating(false), 3800);
  };

  return (
    <div className="flex flex-col space-y-5 p-6 rounded-3xl bg-[#070714]/80 border border-white/[0.06] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white tracking-wide flex items-center gap-2">
            Reading Generation States
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-md bg-[#7048E8]/25 border border-[#A27FF3]/30 text-[#C4B5FD]">
              Loading Flow
            </span>
          </h3>
          <p className="text-xs text-[#8a8a9e]">
            Inspect and compare the 3 sequential AI states when generating a new personalized reading.
          </p>
        </div>

        {/* Animate Button */}
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            isAnimating
              ? 'bg-[#A27FF3]/30 text-[#C4B5FD] cursor-not-allowed'
              : 'bg-[#7048E8] text-white hover:bg-[#8B5CF6] shadow-[0_0_20px_rgba(112,72,232,0.5)] hover:shadow-[0_0_30px_rgba(112,72,232,0.7)]'
          }`}
        >
          {isAnimating ? '⏳ Simulating...' : '▶ Run Full Animation'}
        </button>
      </div>

      {/* Step Selector Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0c0c20] border border-white/[0.05]">
        {STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => !isAnimating && setActiveStep(step.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${
              activeStep === step.id
                ? 'bg-[#A27FF3] text-white font-medium shadow-[0_0_14px_rgba(162,127,243,0.5)]'
                : 'text-[#8a8a9e] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <span className="font-mono text-[10px] opacity-70">0{step.id}</span>
            <span className="hidden sm:inline">{step.title.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </div>

      {/* Main Canvas: Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Nexus Holographic Centerpiece (Orbital Ring + Central Icon) */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#030208] border border-white/[0.04] min-h-[300px]">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#A27FF3] mb-4 font-medium">
            Nexus Centerpiece · Step 0{activeStep}
          </span>

          {/* Orbital Ring + Nexus Icon */}
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-[#7048E8]/20 blur-2xl pointer-events-none scale-110" />

            {/* Orbital SVG */}
            <svg
              className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none"
              viewBox="0 0 160 160"
              aria-hidden="true"
            >
              <circle
                cx="80" cy="80" r="72"
                stroke="#1a1b32" strokeWidth="1.5" fill="none"
                strokeDasharray="2 10.5"
              />
              <circle
                cx="80" cy="80" r="64"
                stroke="#121324" strokeWidth="3.5" fill="none"
              />
              <circle
                cx="80" cy="80" r="64"
                stroke={`url(#${ringGradientId})`}
                strokeWidth="4" fill="none"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id={ringGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DDD6FE" />
                  <stop offset="50%" stopColor="#A27FF3" />
                  <stop offset="100%" stopColor="#7048E8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Nexus Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="flex items-center justify-center transition-all duration-500 animate-[fadeIn_0.4s_ease-out_both]" key={activeStep}>
                <currentStepData.NexusIcon className="w-10 h-10 sm:w-11 sm:h-11 text-[#DDD6FE]" />
              </div>
              <span className="text-[11px] font-mono font-medium text-[#c4b5fd]/90 tabular-nums mt-1.5 tracking-wider">
                {currentStepData.percentage}%
              </span>
            </div>
          </div>

          {/* Phase Label */}
          <span className="text-xs sm:text-[13px] font-medium text-[#C4B5FD] tracking-wide mt-4 transition-all text-center">
            {currentStepData.subtitle}
          </span>
        </div>

        {/* RIGHT: Isolated Icon Inspector & Semantic Meaning */}
        <div className="flex flex-col space-y-4">
          {/* Size Selector */}
          <div className="flex items-center flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#0c0c20] border border-white/[0.05]">
            {DISPLAY_SIZES.map((ds) => (
              <button
                key={ds.size}
                onClick={() => setDisplaySize(ds.size)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                  displaySize === ds.size
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-[#6b6c82] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {ds.label}
              </button>
            ))}
          </div>

          {/* Icon Inspector Canvas */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#030208] border border-white/[0.04] min-h-[200px]">
            <div className="flex items-center gap-8">
              {/* Nexus Icon at selected size */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="flex items-center justify-center rounded-xl bg-[#111126] border border-white/[0.06] p-3 transition-all overflow-hidden"
                  style={{ width: displaySize + 24, height: displaySize + 24 }}
                >
                  <div style={{ width: displaySize, height: displaySize }} className="flex items-center justify-center">
                    <currentStepData.NexusIcon className="w-full h-full text-[#DDD6FE]" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#6b6c82]">Nexus</span>
              </div>

              {/* Step Icon at selected size */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="flex items-center justify-center rounded-xl bg-[#111126] border border-white/[0.06] p-3 transition-all overflow-hidden"
                  style={{ width: Math.max(displaySize * 0.6, 40) + 24, height: Math.max(displaySize * 0.6, 40) + 24 }}
                >
                  <div style={{ width: Math.max(displaySize * 0.6, 14), height: Math.max(displaySize * 0.6, 14) }} className="flex items-center justify-center">
                    <currentStepData.StepIcon className="w-full h-full text-[#C4B5FD]" />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#6b6c82]">Step Node</span>
              </div>
            </div>
          </div>

          {/* Semantic Meaning Card */}
          <div className="p-4 rounded-2xl bg-[#080816]/70 border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-[#7048E8]/30 flex items-center justify-center text-[#C4B5FD]">
                <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="6" />
                  <line x1="8" y1="5" x2="8" y2="9" />
                  <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold text-white tracking-wide">
                Step 0{activeStep} — Semantic Context
              </h4>
            </div>
            <p className="text-xs text-[#8e90a5] leading-relaxed">
              {currentStepData.semanticMeaning}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: Inline Timeline Preview */}
      <div className="w-full max-w-[460px] mx-auto pt-2">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#6b6c82] mb-2 block text-center">
          Timeline Progress Bar Preview
        </span>
        <div className="w-full relative">
          {/* Track */}
          <div className="absolute left-[16.66%] right-[16.66%] top-[14px] h-[2px] bg-[#16172e] z-0 -translate-y-1/2" />
          <div
            className="absolute left-[16.66%] top-[14px] h-[2px] bg-[#7048E8] transition-all duration-700 ease-out z-0 -translate-y-1/2 shadow-[0_0_8px_rgba(112,72,232,0.8)]"
            style={{
              width:
                activeStep === 1 ? '0%' : activeStep === 2 ? '33.33%' : '66.66%',
            }}
          />
          <div className="w-full grid grid-cols-3 relative z-10">
            {STEPS.map((step) => {
              const isActive = activeStep >= step.id;
              const isCompleted = activeStep > step.id;
              return (
                <div key={step.id} className="flex flex-col items-center text-center">
                  <button
                    onClick={() => !isAnimating && setActiveStep(step.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border cursor-pointer ${
                      isActive
                        ? 'bg-[#7048E8] border-[#A27FF3] shadow-[0_0_12px_rgba(112,72,232,0.6)]'
                        : 'bg-[#0c0c1c] border-[#22243d] hover:border-[#A27FF3]/40'
                    }`}
                  >
                    {isCompleted ? (
                      <StepCompletedCheckIcon className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <step.StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#5e6078]'}`} />
                    )}
                  </button>
                  <span
                    className={`text-[11px] sm:text-xs mt-2.5 transition-colors duration-300 ${
                      isActive ? 'text-[#f0f0f5] font-medium' : 'text-[#71728a] font-light'
                    }`}
                  >
                    {step.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
