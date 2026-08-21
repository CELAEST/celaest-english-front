import { useState } from 'react';
import { OnboardingStep, UserAnswer, LearningDnaSummary } from '../types';

export const useOnboardingFlow = () => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [learningDna, setLearningDna] = useState<LearningDnaSummary>({
    careerGoal: 'Programming & AI',
    preferredTopics: ['Programming', 'AI', 'Automation'],
    speakingConfidence: 'Medium',
    dailyPracticeMinutes: 20,
    learningStyle: 'Conversation-first learner',
    proficiencyLevel: 'B1 — Intermediate',
  });

  const nextStep = () => {
    if (step === 'welcome') setStep('questions');
    else if (step === 'questions') setStep('dna-analysis');
    else if (step === 'dna-analysis') setStep('first-conversation');
    else if (step === 'first-conversation') setStep('ready');
  };

  const prevStep = () => {
    if (step === 'questions') setStep('welcome');
    else if (step === 'dna-analysis') setStep('questions');
    else if (step === 'first-conversation') setStep('dna-analysis');
    else if (step === 'ready') setStep('first-conversation');
  };

  const submitAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => [...prev.filter((a) => a.questionId !== questionId), { questionId, answer }]);
  };

  return {
    step,
    setStep,
    answers,
    submitAnswer,
    learningDna,
    setLearningDna,
    isAnalyzing,
    setIsAnalyzing,
    nextStep,
    prevStep,
  };
};
