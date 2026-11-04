import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PathwayNode,
  PathwayStepId,
} from "../../../domain/entities/LearningPathway";
import { CompletePathwayNodeParams } from "../../../domain/repositories/IPathwayRepository";
import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import { SpeechSynthesisService } from "../../conversation/services/speechSynthesisService";
import { PronunciationEvaluationResult } from "../services/PathwayPronunciationEngine";
import { stopAndEvaluatePathwayVoice } from "../services/pathwayVoiceEvaluator";

export interface WordChipItem {
  id: string;
  word: string;
}

function buildShuffledPool(target: string[], distractors: string[]): WordChipItem[] {
  const combined = [...target, ...distractors].map((word, index) => ({
    id: `chip-${index}-${word}`,
    word,
  }));
  // Deterministic non-trivial shuffle so layout never flickers on re-renders
  return combined.sort((a, b) => {
    const hashA = a.word.charCodeAt(0) * 31 + a.id.length * 7;
    const hashB = b.word.charCodeAt(0) * 31 + b.id.length * 7;
    return hashA - hashB;
  });
}

export function usePathwayStageSession(
  activeNode: PathwayNode | null,
  profession: string,
  onCompleteNode: (
    sentence: string,
    evaluation?: CompletePathwayNodeParams["evaluation"],
  ) => Promise<unknown>,
  cefrLevel: string = "A1",
) {
  const [step, setStepState] = useState<PathwayStepId>("RULE");
  const [placedIds, setPlacedIds] = useState<string[]>([]);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluatingVoice, setIsEvaluatingVoice] = useState<boolean>(false);
  const [failedVoiceAttempts, setFailedVoiceAttempts] = useState<number>(0);
  const [micUnavailable, setMicUnavailable] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>("");
  const [isCompletedBanner, setIsCompletedBanner] = useState<boolean>(false);
  const [isSavingCompletion, setIsSavingCompletion] = useState<boolean>(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationEvaluationResult | null>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setStep = useCallback((nextStep: PathwayStepId) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setStepState(nextStep);
  }, []);

  const challenge = activeNode?.lessonPayload?.blockChallenge;

  const allChips = useMemo(
    () =>
      challenge
        ? buildShuffledPool(challenge.targetTokens, challenge.distractorTokens)
        : [],
    [challenge],
  );

  const placedChips = useMemo(
    () =>
      placedIds
        .map((id) => allChips.find((c) => c.id === id))
        .filter((c): c is WordChipItem => Boolean(c)),
    [placedIds, allChips],
  );

  const availableChips = useMemo(
    () => allChips.filter((c) => !placedIds.includes(c.id)),
    [allChips, placedIds],
  );

  const targetSentence = useMemo(
    () => (challenge ? challenge.targetTokens.join(" ") : ""),
    [challenge],
  );

  const builtSentence = useMemo(
    () => placedChips.map((c) => c.word).join(" "),
    [placedChips],
  );

  const isBuildComplete = Boolean(
    challenge && placedChips.length === challenge.targetTokens.length,
  );
  const isBuildCorrect =
    isBuildComplete &&
    builtSentence.toLowerCase() === targetSentence.toLowerCase();
  const hasBuildMistake = isBuildComplete && !isBuildCorrect;

  useEffect(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    SpeechSynthesisService.stop();
    setSpeakingText(null);
    setStepState("RULE");
    setPlacedIds([]);
    setSpokenTranscript("");
    setIsRecording(false);
    setIsEvaluatingVoice(false);
    setFailedVoiceAttempts(0);
    setMicUnavailable(false);
    setIsCompletedBanner(false);
    setPronunciationResult(null);
  }, [activeNode?.id]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      SpeechSynthesisService.stop();
    };
  }, []);

  const playAudio = useCallback((text: string, onComplete?: () => void) => {
    if (!text.trim()) {
      onComplete?.();
      return;
    }
    setSpeakingText(text);
    void SpeechSynthesisService.speak(text, {
      voice: "liam",
      preventSyntheticFallback: true,
      onEnd: () => {
        setSpeakingText(null);
        onComplete?.();
      },
      onError: () => {
        setSpeakingText(null);
        onComplete?.();
      },
    });
  }, []);

  const hasSpokenInBuildRef = useRef<boolean>(false);
  useEffect(() => {
    if (step === "BUILD" && activeNode?.lessonPayload) {
      if (!hasSpokenInBuildRef.current) {
        hasSpokenInBuildRef.current = true;
        // Only play build activation if Liam/AI is not ALREADY speaking (prevents overlapping duplicate speech)
        if (!speakingText && !SpeechSynthesisService.isAiPlaying()) {
          const buildActivationText = "Ahora es tu turno de construir. Voy a abrir las fichas en tu pizarra para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!";
          playAudio(buildActivationText);
        }
      }
    } else {
      hasSpokenInBuildRef.current = false;
    }
  }, [step, activeNode?.lessonPayload, speakingText, playAudio]);

  const hasSpokenInSpeakRef = useRef<boolean>(false);
  useEffect(() => {
    if (step === "SPEAK" && activeNode?.lessonPayload) {
      if (!hasSpokenInSpeakRef.current) {
        hasSpokenInSpeakRef.current = true;
        if (!speakingText && !SpeechSynthesisService.isAiPlaying()) {
          const sentence = activeNode.lessonPayload.voicePractice.sentenceEnglish.replace(/[.!?]+$/, "");
          const instruction = `Escucha con atención cómo lo pronuncio yo: ${sentence}. Ahora activa tu micrófono y dilo tú para certificar tu avance.`;
          playAudio(instruction);
        }
      }
    } else {
      hasSpokenInSpeakRef.current = false;
    }
  }, [step, activeNode?.lessonPayload, playAudio]);

  const tapAvailableChip = useCallback(
    (chipId: string) => {
      if (!challenge) return;
      setPlacedIds((prev) => {
        if (prev.includes(chipId) || prev.length >= challenge.targetTokens.length) {
          return prev;
        }
        const next = [...prev, chipId];
        if (next.length === challenge.targetTokens.length) {
          const sentence = next
            .map((id) => allChips.find((c) => c.id === id)?.word || "")
            .join(" ");
          const targetNaturalSentence = challenge.targetTokens.join(" ");
          if (sentence.toLowerCase() === targetNaturalSentence.toLowerCase()) {
            const successText = `¡Excelente! Lo armaste en orden natural: ${targetNaturalSentence}. Ahora vamos a certificar tu voz.`;
            playAudio(successText, () => {
              if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
              autoAdvanceTimerRef.current = setTimeout(() => {
                setStep("SPEAK");
              }, 400);
            });
            // Generous safety fallback in case audio device hangs or errors
            if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = setTimeout(() => {
              setStep("SPEAK");
            }, 15000);
          } else {
            const errorHint = challenge.mistakeHintSpanish || "Casi lo tienes. Revisa el orden de las fichas y toca una para reorganizarla.";
            playAudio(errorHint);
          }
        }
        return next;
      });
    },
    [challenge, allChips, playAudio],
  );

  const removePlacedChip = useCallback((chipId: string) => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    setPlacedIds((prev) => prev.filter((id) => id !== chipId));
  }, []);

  const resetBlocks = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    setPlacedIds([]);
  }, []);

  const finishLesson = useCallback(
    async (
      finalSentence: string,
      evaluation?: CompletePathwayNodeParams["evaluation"],
    ) => {
      setIsSavingCompletion(true);
      try {
        await onCompleteNode(finalSentence, evaluation);
        setIsCompletedBanner(true);
      } finally {
        setIsSavingCompletion(false);
      }
    },
    [onCompleteNode],
  );

  const toggleRecording = useCallback(async () => {
    const targetVoice =
      activeNode?.lessonPayload?.voicePractice.sentenceEnglish || targetSentence;
    if (isRecording) {
      const liveSnapshot = (
        AudioCaptureService.getLatestTranscript() || spokenTranscript
      ).trim();
      setIsRecording(false);
      setIsEvaluatingVoice(true);

      try {
        const { transcript: captured, evaluation: evalResult } =
          await stopAndEvaluatePathwayVoice({
            targetSentence: targetVoice,
            liveTranscriptSnapshot: liveSnapshot,
            profession,
          });

        if (captured && evalResult) {
          setSpokenTranscript(captured);
          setPronunciationResult(evalResult);

          if (evalResult.passed) {
            setFailedVoiceAttempts(0);
            playAudio("¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito.");
            await finishLesson(captured, {
              overallScore: evalResult.overallScore,
              structureScore: evalResult.completenessScore,
              lexicalScore: evalResult.accuracyScore,
              fluencyScore: evalResult.fluencyScore,
              diagnostic: {
                summarySpanish: evalResult.feedbackSpanish,
                primaryGap: evalResult.primaryGap,
                coachingAction: evalResult.coachingActionSpanish,
                modelUpgrade: targetVoice,
                extractedErrors: evalResult.mispronouncedWords.map((m) => ({
                  userSaid: m.heardAs,
                  errorWord: m.heardAs,
                  correctWord: m.word,
                  betterWay: targetVoice,
                  translationSpanish: m.tip,
                  grammarExplanation: m.tip,
                  cefrLevel,
                })),
              },
            });
          } else {
            setFailedVoiceAttempts((prev) => prev + 1);
            playAudio("Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.");
          }
        } else {
          setFailedVoiceAttempts((prev) => prev + 1);
          playAudio(
            targetVoice
              ? `No te escuché con claridad. Di conmigo: ${targetVoice}. Toca el micrófono para intentarlo.`
              : "No te escuché con claridad. Di conmigo: I learn English today. Toca el micrófono para intentarlo.",
          );
        }
      } finally {
        setIsEvaluatingVoice(false);
      }
      return;
    }

    SpeechSynthesisService.stop();
    setSpeakingText(null);
    setPronunciationResult(null);
    setSpokenTranscript("");

    const ready = await AudioCaptureService.initMicrophone();
    if (!ready && !AudioCaptureService.isSpeechRecognitionSupported()) {
      setMicUnavailable(true);
      playAudio(
        "No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.",
      );
      return;
    }

    setIsRecording(true);
    AudioCaptureService.startRecognition({
      lang: "en-US",
      initialTranscript: "",
      roleName: profession,
      question: targetVoice,
      onTranscript: (txt) => setSpokenTranscript(txt),
      onError: () => {
        if (!AudioCaptureService.hasLiveMicStream()) {
          setIsRecording(false);
          setMicUnavailable(true);
        }
      },
    });
  }, [activeNode, targetSentence, isRecording, spokenTranscript, profession, cefrLevel, finishLesson, playAudio]);

  const completeWithoutMic = useCallback(async () => {
    const voiceSentence = activeNode?.lessonPayload?.voicePractice.sentenceEnglish || targetSentence;
    setFailedVoiceAttempts(0);
    setPronunciationResult(null);
    await finishLesson(voiceSentence, {
      overallScore: 80,
      structureScore: 80,
      lexicalScore: 80,
      fluencyScore: 80,
      diagnostic: {
        summarySpanish: "Base completada en modo manual silencioso.",
        primaryGap: "",
        coachingAction: "Practica con micrófono en tu siguiente sesión para certificar fonética.",
        modelUpgrade: voiceSentence,
        extractedErrors: [],
      },
    });
    playAudio("¡Base completada! Avanzamos al siguiente reto.");
  }, [activeNode, targetSentence, finishLesson, playAudio]);

  const canSkipWithoutMic = micUnavailable || failedVoiceAttempts >= 2;

  return {
    step,
    setStep,
    availableChips,
    placedChips,
    isBuildCorrect,
    hasBuildMistake,
    speakingText,
    isRecording,
    isEvaluatingVoice,
    failedVoiceAttempts,
    micUnavailable,
    canSkipWithoutMic,
    spokenTranscript,
    isCompletedBanner,
    isSavingCompletion,
    pronunciationResult,
    playAudio,
    tapAvailableChip,
    removePlacedChip,
    resetBlocks,
    toggleRecording,
    completeWithoutMic,
    finishLesson,
  };
}
