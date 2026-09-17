import { useState } from "react";
import { LearnerProfileData } from "../types";
import { getDiagnosticQuestions } from "../services/onboardingQuestionsCatalog";
import { OnboardingDiagnosticEvaluator, DiagnosticResult } from "../services/onboardingDiagnosticEvaluator";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { logger } from "../../../shared/utils/logger";
import { SPANISH_MARKERS } from "../../conversation/services/speechIntelligibilityGuard";

export interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp?: string;
  isTyping?: boolean;
}

export const isBeginnerSurrender = (rawText: string): boolean => {
  const cleaned = rawText.trim().toLowerCase();
  const patterns = [
    /\bno\s+(se|sé|hablo|entiendo|comprendo|puedo|domino|manejo)\b/i,
    /\bno\s+(ingles|inglés|english)\b/i,
    /\b(cero|nada|poco)\s+de\s+(ingles|inglés|english)\b/i,
    /\b(no\s+se\s+nada|no\s+sé\s+nada)\b/i,
    /\bi\s+(don't|do\s+not|can't|cannot)\s+(know|speak|understand)\b/i,
    /\b(i\s+only\s+speak\s+spanish|solo\s+hablo\s+español|sólo\s+hablo\s+español)\b/i,
    /^(no|nada|cero|nope|ninguno)\.?$/i,
  ];
  return patterns.some((regex) => regex.test(cleaned));
};

export const useOnboardingConversation = (
  profile: LearnerProfileData,
  onUpdateProfile: (partial: Partial<LearnerProfileData>) => void,
) => {
  const baselineLevel = profile.placementQuiz?.estimatedLevel || "B1";
  const questions = getDiagnosticQuestions(profile.profession, baselineLevel);

  const [turn, setTurn] = useState<1 | 2 | 3 | 4>(1);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: questions[0].question,
      timestamp: "Just now",
    },
  ]);

  const handleSendMessage = async (text: string) => {
    const updatedAnswers = [...userAnswers, text];
    setUserAnswers(updatedAnswers);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    // If user explicitly expresses they don't know English, stop immediately with empathy
    if (isBeginnerSurrender(text)) {
      setTurn(4);
      onUpdateProfile({
        cefrLevel: "A1 — Beginner",
        conversationStyle: "Foundational & Step-by-Step",
        speakingConfidence: "Low",
        pronunciationScore: "Foundational Practice",
      });

      const role = profile.profession && profile.profession.trim() ? profile.profession.trim() : "profesional";
      const empathyClosing = `¡Entendido! No te preocupes en absoluto. Lingua está diseñado exactamente para ti: empezaremos desde cero absoluto, paso a paso, con las palabras y frases clave para tu trabajo como ${role}. ¡Tu ruta personalizada de nivel inicial está lista!`;

      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, sender: "ai", text: empathyClosing, timestamp: "Just now" },
        ]);
      }, 500);
      return;
    }

    const isSpanishTurn =
      /[áéíóúüñ¿¡]/i.test(text) ||
      text.toLowerCase().split(/\s+/).filter((w) => SPANISH_MARKERS.has(w)).length >= 2;

    if (turn === 1) {
      setTurn(2);
      const nextPrompt = isSpanishTurn
        ? `I noticed you replied in Spanish! In Lingua, we will build your English from the ground up. Try answering this next question in English (even with just simple words):\n\n${questions[1].question}`
        : questions[1].question;
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, sender: "ai", text: nextPrompt, timestamp: "Just now" },
        ]);
      }, 700);
    } else if (turn === 2) {
      setTurn(3);
      const nextPrompt = isSpanishTurn
        ? `Let's keep practicing in English! Even 1 or 2 simple words help calibrate your level:\n\n${questions[2].question}`
        : questions[2].question;
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, sender: "ai", text: nextPrompt, timestamp: "Just now" },
        ]);
      }, 700);
    } else if (turn === 3) {
      setTurn(4);
      // Fast client-side dual-signal linguistic pre-evaluation (0ms)
      const diag: DiagnosticResult = OnboardingDiagnosticEvaluator.evaluate(
        updatedAnswers,
        profile.placementQuiz
      );

      onUpdateProfile({
        cefrLevel: diag.cefrLabel,
        conversationStyle: diag.conversationStyle,
        speakingConfidence: diag.speakingConfidence,
        pronunciationScore: "Pending Audio Assessment",
      });

      let feedback = diag.isSpanishDetected
        ? "Diagnostic complete! I noticed your responses were in Spanish. Don't worry—Lingua is specially designed to guide Spanish speakers from zero to fluency. I've calibrated your starting roadmap at A1 Foundation!"
        : `Diagnostic complete. I've calibrated your CEFR baseline at ${diag.cefrLabel} with ${diag.keyStrengths.join(", ")}. Your personalized roadmap is ready!`;

      try {
        const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
        const hasKey = await providerKeyVault.hasKey(activeProvider);
        if (hasKey) {
          const rawFeedback = await directClientAiService.chatCompletion({
            systemPrompt: `You are Lingua, an empathetic expert AI Language Mentor. A candidate completed a 2-stage placement diagnostic (Multiple-choice placement & conversational chat). Diagnostic Summary: ${diag.aiDossierSummary} Write a warm, 2-sentence conversational feedback acknowledging a specific detail from their answers and welcoming them to their personalized path. Direct to candidate, no quotes, no preamble.`,
            userPrompt: `Role: ${profile.profession || "Professional"}\nAnswers:\n1. ${updatedAnswers[0]}\n2. ${updatedAnswers[1]}\n3. ${updatedAnswers[2]}`,
            providerId: activeProvider,
            maxTokens: 250,
          });
          const clean = rawFeedback.replace(/^["'`]+|["'`.]+$/g, "").trim();
          if (clean.length > 25) {
            feedback = clean;
          }
        }
      } catch (err) {
        logger.warn("[useOnboardingConversation] Mentor direct feedback skipped, using heuristic summary", err);
      }

      setIsAiTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `ai-${Date.now()}`, sender: "ai", text: feedback, timestamp: "Just now" },
      ]);
    }
  };

  return {
    turn,
    messages,
    isAiTyping,
    handleSendMessage,
  };
};
