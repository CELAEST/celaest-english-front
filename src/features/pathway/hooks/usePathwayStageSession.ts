import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveSpeechProfile, speechMomentText } from "../speech/profiles";
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
  const hasSpokenInBuildRef = useRef<boolean>(false);

  const setStep = useCallback((newStep: PathwayStepId, options?: { skipAudio?: boolean }) => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (options?.skipAudio && newStep === "BUILD") {
      hasSpokenInBuildRef.current = true;
    }
    setStepState(newStep);
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

  useEffect(() => {
    const isBase01 =
      activeNode?.orderIndex === 0 ||
      Boolean(activeNode?.title.toLowerCase().includes("orden mágico"));
    const isBase02 =
      activeNode?.orderIndex === 1 ||
      Boolean(activeNode?.title.toLowerCase().includes("it' fantasma")) ||
      Boolean(activeNode?.title.toLowerCase().includes("el it fantasma"));
    const isBase03 =
      activeNode?.orderIndex === 2 ||
      Boolean(activeNode?.title.toLowerCase().includes("ser o estar sin enredos")) ||
      Boolean(activeNode?.title.toLowerCase().includes("am · is · are"));
    const isBase04 =
      activeNode?.orderIndex === 3 ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de 'tener'")) ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de tener"));
    const isBase05 =
      activeNode?.orderIndex === 4 ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo & pregunta")) ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo y pregunta"));

    const speechProfile = resolveSpeechProfile(activeNode?.orderIndex, activeNode?.title);

    if (step === "BUILD" && activeNode?.lessonPayload) {
      if (!hasSpokenInBuildRef.current) {
        hasSpokenInBuildRef.current = true;
        // Only play build activation if Liam/AI is not ALREADY speaking (prevents overlapping duplicate speech)
        if (!speakingText && !SpeechSynthesisService.isAiPlaying()) {
          const buildActivationText =
            speechMomentText(speechProfile, "build.transition") ??
            (isBase01 || isBase02 || isBase03 || isBase04 || isBase05
              ? "Ahora es tu turno de construir... Voy a abrir las fichas en tu pantalla para que las toques en orden y forjes tu memoria motriz... ¡Adelante, tú puedes!"
              : "Ahora es tu turno de construir. Voy a abrir las fichas en tu pizarra para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!");
          playAudio(buildActivationText);
        }
      }
    } else {
      hasSpokenInBuildRef.current = false;
    }
  }, [step, activeNode?.orderIndex, activeNode?.title, activeNode?.lessonPayload, speakingText, playAudio]);

  const hasSpokenInSpeakRef = useRef<boolean>(false);
  useEffect(() => {
    const isBase01 =
      activeNode?.orderIndex === 0 ||
      Boolean(activeNode?.title.toLowerCase().includes("orden mágico"));
    const isBase02 =
      activeNode?.orderIndex === 1 ||
      Boolean(activeNode?.title.toLowerCase().includes("it' fantasma")) ||
      Boolean(activeNode?.title.toLowerCase().includes("el it fantasma"));
    const isBase03 =
      activeNode?.orderIndex === 2 ||
      Boolean(activeNode?.title.toLowerCase().includes("ser o estar sin enredos")) ||
      Boolean(activeNode?.title.toLowerCase().includes("am · is · are"));
    const isBase04 =
      activeNode?.orderIndex === 3 ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de 'tener'")) ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de tener"));
    const isBase05 =
      activeNode?.orderIndex === 4 ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo & pregunta")) ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo y pregunta"));

    if (step === "SPEAK" && activeNode?.lessonPayload) {
      if (!hasSpokenInSpeakRef.current) {
        if (!speakingText && !SpeechSynthesisService.isAiPlaying()) {
          hasSpokenInSpeakRef.current = true;
          const sentence = activeNode.lessonPayload.voicePractice.sentenceEnglish.replace(/[.!?]+$/, "");
          const instruction = isBase01
            ? "Escucha con atención cómo lo pronuncio yo:... I learn English today... Ahora activa tu micrófono y dilo tú para certificar tu avance."
            : isBase02
            ? "Escucha con atención cómo lo pronuncio yo:... It is cold today... Ahora activa tu micrófono y dilo tú para certificar tu avance."
            : isBase03
            ? "Escucha con atención cómo lo pronuncio yo:... I am ready today... Ahora activa tu micrófono y dilo tú para certificar tu avance."
            : isBase04
            ? "Escucha con atención cómo lo pronuncio yo:... I am hungry now... Ahora activa tu micrófono y dilo tú para certificar tu avance."
            : isBase05
            ? "Escucha con atención cómo lo pronuncio yo:... Are you ready today?... Ahora activa tu micrófono y dilo tú para certificar tu avance."
            : `Escucha con atención cómo lo pronuncio yo: ${sentence}. Ahora activa tu micrófono y dilo tú para certificar tu avance.`;
          const speakProfile = resolveSpeechProfile(activeNode?.orderIndex, activeNode?.title);
          if (speakProfile) {
            // SPEAK en 3 pistas: lead (es) -> modelo (en) -> instrucción (es).
            playAudio(speechMomentText(speakProfile, "speak.lead") ?? "", () =>
              playAudio(speechMomentText(speakProfile, "speak.model") ?? "", () =>
                playAudio(speechMomentText(speakProfile, "speak.instruction") ?? ""),
              ),
            );
          } else {
            playAudio(instruction);
          }
        }
      }
    } else {
      hasSpokenInSpeakRef.current = false;
    }
  }, [step, activeNode?.orderIndex, activeNode?.title, activeNode?.lessonPayload, playAudio]);

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
          const isBase01 =
            activeNode?.orderIndex === 0 ||
            Boolean(activeNode?.title.toLowerCase().includes("orden mágico"));
          const isBase02 =
            activeNode?.orderIndex === 1 ||
            Boolean(activeNode?.title.toLowerCase().includes("it' fantasma")) ||
            Boolean(activeNode?.title.toLowerCase().includes("el it fantasma"));
          const isBase03 =
            activeNode?.orderIndex === 2 ||
            Boolean(activeNode?.title.toLowerCase().includes("ser o estar sin enredos")) ||
            Boolean(activeNode?.title.toLowerCase().includes("am · is · are"));
          const isBase04 =
            activeNode?.orderIndex === 3 ||
            Boolean(activeNode?.title.toLowerCase().includes("trampa de 'tener'")) ||
            Boolean(activeNode?.title.toLowerCase().includes("trampa de tener"));
          const isBase05 =
            activeNode?.orderIndex === 4 ||
            Boolean(activeNode?.title.toLowerCase().includes("negativo & pregunta")) ||
            Boolean(activeNode?.title.toLowerCase().includes("negativo y pregunta"));

          const speechProfile = resolveSpeechProfile(activeNode?.orderIndex, activeNode?.title);

          if (sentence.toLowerCase() === targetNaturalSentence.toLowerCase()) {
            const successText =
              speechMomentText(speechProfile, "build.success") ??
              (isBase01
                ? "¡Excelente trabajo! Lo armaste en orden natural:... I learn English today... Ahora vamos a certificar tu propia voz."
                : isBase02
                ? "¡Excelente trabajo! Lo armaste en orden natural:... It is cold today... Ahora vamos a certificar tu propia voz."
                : isBase03
                ? "¡Excelente trabajo! Lo armaste en orden natural:... I am ready today... Ahora vamos a certificar tu propia voz."
                : isBase04
                ? "¡Excelente trabajo! No caíste en la trampa de have:... I am hungry now... Ahora vamos a certificar tu propia voz."
                : isBase05
                ? "¡Excelente trabajo! Invertiste el orden como un nativo:... Are you ready today?... Ahora vamos a certificar tu propia voz."
                : `¡Excelente! Lo armaste en orden natural: ${targetNaturalSentence}. Ahora vamos a certificar tu voz.`);
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
            const errorHint =
              speechMomentText(speechProfile, "build.error") ??
              (isBase01
                ? "Empieza siempre con quién:... I... luego la acción:... learn... y al final:... English today."
                : isBase02
                ? "Coloca siempre el sujeto neutro It al inicio:... It... luego el verbo:... is... y al final:... cold today."
                : isBase03
                ? "Recuerda la pareja fija exclusiva:... I... camina siempre de la mano con:... am... diciendo:... I am ready today."
                : isBase04
                ? "Recuerda la clave:... en inglés no tienes hambre con have, estás en ese estado diciendo:... I am hungry now... Inténtalo de nuevo."
                : isBase05
                ? "Recuerda la inversión:... en las preguntas el verbo tu bi va primero... diciendo... Are... antes de la persona... you... y el estado... ready today... Inténtalo de nuevo."
                : challenge.mistakeHintSpanish || "Casi lo tienes. Revisa el orden de las fichas y toca una para reorganizarla.");
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
    const isBase01 =
      activeNode?.orderIndex === 0 ||
      Boolean(activeNode?.title.toLowerCase().includes("orden mágico"));
    const isBase02 =
      activeNode?.orderIndex === 1 ||
      Boolean(activeNode?.title.toLowerCase().includes("it' fantasma")) ||
      Boolean(activeNode?.title.toLowerCase().includes("el it fantasma"));
    const isBase03 =
      activeNode?.orderIndex === 2 ||
      Boolean(activeNode?.title.toLowerCase().includes("ser o estar sin enredos")) ||
      Boolean(activeNode?.title.toLowerCase().includes("am · is · are"));
    const isBase04 =
      activeNode?.orderIndex === 3 ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de 'tener'")) ||
      Boolean(activeNode?.title.toLowerCase().includes("trampa de tener"));
    const isBase05 =
      activeNode?.orderIndex === 4 ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo & pregunta")) ||
      Boolean(activeNode?.title.toLowerCase().includes("negativo y pregunta"));
    const speechProfile = resolveSpeechProfile(activeNode?.orderIndex, activeNode?.title);
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
            const victorySpeech =
              speechMomentText(speechProfile, "voice.victory") ??
              (isBase01 || isBase02 || isBase03 || isBase04 || isBase05
                ? "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con una cadencia impecable... Base conquistada con éxito."
                : "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.");
            playAudio(victorySpeech);
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
            const retrySpeech =
              speechMomentText(speechProfile, "voice.retry") ??
              (isBase01 || isBase02 || isBase03 || isBase04 || isBase05
                ? "¡Casi lo tienes! Escucha el modelo una vez más con atención, y dilo con calma para certificar tu avance."
                : "Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.");
            playAudio(retrySpeech);
          }
        } else {
          setFailedVoiceAttempts((prev) => prev + 1);
          const notHeardSpeech =
            speechMomentText(speechProfile, "voice.not_heard") ??
            (isBase01
              ? "No logré escucharte con claridad... Repite conmigo:... I learn English today... Toca el micrófono para intentarlo."
              : isBase02
              ? "No logré escucharte con claridad... Repite conmigo:... It is cold today... Toca el micrófono para intentarlo."
              : isBase03
              ? "No logré escucharte con claridad... Repite conmigo:... I am ready today... Toca el micrófono para intentarlo."
              : isBase04
              ? "No logré escucharte con claridad... Repite conmigo:... I am hungry now... Toca el micrófono para intentarlo."
              : isBase05
              ? "No logré escucharte con claridad... Repite conmigo:... Are you ready today?... Toca el micrófono para intentarlo."
              : targetVoice
              ? `No te escuché con claridad. Di conmigo: ${targetVoice}. Toca el micrófono para intentarlo.`
              : "No te escuché con claridad. Di conmigo: I learn English today. Toca el micrófono para intentarlo.");
          playAudio(notHeardSpeech);
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

    // El modelo nativo suena antes de abrir el micrófono, para que funcione
    // igual al entrar al paso que al tocar "Hablarle al Profesor".
    if (speechProfile) {
      const modelText = speechMomentText(speechProfile, "speak.model");
      if (modelText) {
        await new Promise<void>((resolve) => {
          playAudio(modelText, () => resolve());
          setTimeout(resolve, 4000);
        });
      }
    }

    const ready = await AudioCaptureService.initMicrophone();
    if (!ready && !AudioCaptureService.isSpeechRecognitionSupported()) {
      setMicUnavailable(true);
      playAudio(
        speechMomentText(speechProfile, "mic.error") ??
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
    const localProfile = resolveSpeechProfile(activeNode?.orderIndex, activeNode?.title);
    const victorySpeech =
      speechMomentText(localProfile, "voice.victory") ??
      "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.";
    playAudio(victorySpeech);
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
