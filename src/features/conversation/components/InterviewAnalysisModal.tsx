import React, { useState, useEffect, useRef } from "react";
import { SpecificErrorItem } from "../services/interviewEngineService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import { logger } from "../../../shared/utils/logger";
import {
  getDynamicInsight,
  InterviewAnalysisScorecard,
  InterviewAnalysisStrategyGrid,
  InterviewAnalysisTranscriptCard,
  InterviewAnalysisImprovedAnswerCard,
  InterviewAnalysisErrorCarousel,
} from "./analysis";

export interface InterviewAnalysisModalProps {
  feedback: ComprehensiveTurnFeedback;
  savedErrorIds: Set<string>;
  onClose: () => void;
  onSaveSpecificError: (errorItem: SpecificErrorItem) => Promise<boolean>;
  onSaveAllErrors: () => Promise<number>;
  onNavigateToMemory?: (() => void) | undefined;
}

export const InterviewAnalysisModal: React.FC<InterviewAnalysisModalProps> = ({
  feedback,
  savedErrorIds,
  onClose,
  onSaveSpecificError,
  onSaveAllErrors,
  onNavigateToMemory,
}) => {
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState<boolean>(false);
  const [isPlayingRecommendationAudio, setIsPlayingRecommendationAudio] = useState<boolean>(false);

  // Real user audio recording player states
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);
  const [userAudioCurrentTime, setUserAudioCurrentTime] = useState<number>(0);
  const [userAudioDuration, setUserAudioDuration] = useState<number>(() => {
    const raw = feedback.recordingDurationSeconds;
    return raw && Number.isFinite(raw) && raw > 0 ? raw : 0;
  });

  const effectiveDuration = (() => {
    if (Number.isFinite(userAudioDuration) && userAudioDuration > 0) {
      return userAudioDuration;
    }
    const raw = feedback.recordingDurationSeconds;
    if (raw && Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    return 0;
  })();

  // Stop user audio and TTS on unmount or close
  useEffect(() => {
    const audioEl = userAudioRef.current;
    return () => {
      if (audioEl) {
        audioEl.pause();
      }
      SpeechSynthesisService.stop();
    };
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleToggleUserAudio = () => {
    if (!userAudioRef.current) return;

    if (isPlayingUserAudio) {
      userAudioRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      if (isPlayingModelAudio) {
        SpeechSynthesisService.stop();
        setIsPlayingModelAudio(false);
      }
      if (isPlayingRecommendationAudio) {
        SpeechSynthesisService.stop();
        setIsPlayingRecommendationAudio(false);
      }
      userAudioRef.current.play().catch((e) => logger.warn("Audio play notice:", e));
      setIsPlayingUserAudio(true);
    }
  };

  const handleSeekUserAudio = (fraction: number) => {
    if (!userAudioRef.current) return;
    const duration = effectiveDuration || userAudioRef.current.duration || 1;
    const targetTime = Math.max(0, Math.min(duration, fraction * duration));
    userAudioRef.current.currentTime = targetTime;
    setUserAudioCurrentTime(targetTime);
  };

  const handleSkipUserAudio = (deltaSeconds: number) => {
    if (!userAudioRef.current) return;
    const duration = effectiveDuration || userAudioRef.current.duration || 0;
    const current = userAudioRef.current.currentTime || 0;
    const targetTime = Math.max(0, Math.min(duration > 0 ? duration : current + deltaSeconds, current + deltaSeconds));
    userAudioRef.current.currentTime = targetTime;
    setUserAudioCurrentTime(targetTime);
  };

  const handlePlayRecommendationExample = (exampleText: string) => {
    if (isPlayingUserAudio && userAudioRef.current) {
      userAudioRef.current.pause();
      setIsPlayingUserAudio(false);
    }
    if (isPlayingModelAudio) {
      SpeechSynthesisService.stop();
      setIsPlayingModelAudio(false);
    }

    if (isPlayingRecommendationAudio) {
      SpeechSynthesisService.stop();
      setIsPlayingRecommendationAudio(false);
      return;
    }

    setIsPlayingRecommendationAudio(true);
    SpeechSynthesisService.speak(exampleText, {
      rate: 0.9,
      onEnd: () => setIsPlayingRecommendationAudio(false),
      onError: () => setIsPlayingRecommendationAudio(false),
    });
  };

  const handlePlayModelAnswer = () => {
    if (isPlayingUserAudio && userAudioRef.current) {
      userAudioRef.current.pause();
      setIsPlayingUserAudio(false);
    }
    if (isPlayingRecommendationAudio) {
      SpeechSynthesisService.stop();
      setIsPlayingRecommendationAudio(false);
    }

    if (isPlayingModelAudio) {
      SpeechSynthesisService.stop();
      setIsPlayingModelAudio(false);
      return;
    }
    setIsPlayingModelAudio(true);
    SpeechSynthesisService.speak(feedback.improvedFullAnswer, {
      rate: 0.9,
      onEnd: () => setIsPlayingModelAudio(false),
      onError: () => setIsPlayingModelAudio(false),
    });
  };

  const errors = feedback.unclearOrErrorWords || [];

  return (
    <AppModal
      size="lg"
      title="Evaluación de Desempeño"
      subtitle="Análisis lingüístico, precisión gramatical y estrategia"
      ariaLabel="Evaluación de Desempeño"
      onClose={onClose}
      icon={
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z"
            stroke="url(#hdr_grad)"
            strokeWidth="1.75"
            fill="url(#hdr_fill)"
            fillOpacity="0.2"
          />
          <circle cx="12" cy="12" r="3.5" stroke="#A27FF3" strokeWidth="1.5" />
          <path
            d="M12 6V8.5M12 15.5V18M6.5 9L8.5 10.5M15.5 13.5L17.5 15M6.5 15L8.5 13.5M15.5 10.5L17.5 9"
            stroke="#9d7cf0"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="hdr_grad" x1="3.34" y1="2" x2="20.66" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#674ee6" />
            </linearGradient>
            <linearGradient id="hdr_fill" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#3b1d7d" />
            </linearGradient>
          </defs>
        </svg>
      }
      bodyClassName="px-3 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3 lg:px-7 lg:pt-6 lg:pb-3"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-[#8a8a9e] hidden sm:block">
            Revisa los detalles de tu turno o continúa practicando.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7048E8] to-[#A27FF3] text-white text-xs font-semibold transition-all shadow-lg shadow-[#7048E8]/30 hover:opacity-90 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Continuar con la siguiente pregunta</span>
            <span>→</span>
          </button>
        </div>
      }
    >
      <div aria-live="polite" role="status" className="sr-only">
        {`Evaluación completada. Puntaje global ${feedback.overallScore} de 100. ` +
          `Gramática ${Math.round(feedback.grammarScore)}, vocabulario ${Math.round(
            feedback.vocabularyScore,
          )}, claridad ${Math.round(feedback.clarityScore)}. ` +
          getDynamicInsight(feedback)}
      </div>

      <div className="mx-auto max-w-4xl space-y-3.5 sm:space-y-5">
        <InterviewAnalysisScorecard feedback={feedback} />

        <InterviewAnalysisStrategyGrid
          feedback={feedback}
          isPlayingRecommendationAudio={isPlayingRecommendationAudio}
          onPlayRecommendationExample={handlePlayRecommendationExample}
        />

        <div className="flex flex-col gap-4">
          <InterviewAnalysisTranscriptCard
            feedback={feedback}
            isPlayingUserAudio={isPlayingUserAudio}
            userAudioCurrentTime={userAudioCurrentTime}
            effectiveDuration={effectiveDuration}
            userAudioRef={userAudioRef}
            onToggleUserAudio={handleToggleUserAudio}
            onSeekUserAudio={handleSeekUserAudio}
            onSkipUserAudio={handleSkipUserAudio}
            onAudioTimeUpdate={() => {
              if (userAudioRef.current) {
                setUserAudioCurrentTime(userAudioRef.current.currentTime);
              }
            }}
            onAudioLoadedMetadata={() => {
              const audio = userAudioRef.current;
              if (!audio) return;
              if (Number.isFinite(audio.duration) && audio.duration > 0) {
                setUserAudioDuration(audio.duration);
              } else if (audio.duration === Infinity) {
                const onSeeked = () => {
                  audio.removeEventListener("seeked", onSeeked);
                  if (Number.isFinite(audio.duration) && audio.duration > 0) {
                    setUserAudioDuration(audio.duration);
                  }
                  audio.currentTime = 0;
                };
                audio.addEventListener("seeked", onSeeked, { once: true });
                audio.currentTime = 1e101;
              }
            }}
            onAudioEnded={() => {
              setIsPlayingUserAudio(false);
              setUserAudioCurrentTime(0);
            }}
          />

          <InterviewAnalysisImprovedAnswerCard
            improvedFullAnswer={feedback.improvedFullAnswer}
            isPlayingModelAudio={isPlayingModelAudio}
            onPlayModelAnswer={handlePlayModelAnswer}
          />
        </div>

        <InterviewAnalysisErrorCarousel
          errors={errors}
          userSpokenText={feedback.userSpokenText}
          savedErrorIds={savedErrorIds}
          onSaveSpecificError={onSaveSpecificError}
          onSaveAllErrors={onSaveAllErrors}
          onNavigateToMemory={onNavigateToMemory}
        />
      </div>
    </AppModal>
  );
};
