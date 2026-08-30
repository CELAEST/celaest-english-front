import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Check,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Bookmark,
  Volume2,
  Mic,
  Play,
  Pause,
  Copy,
  BookOpen,
  Trophy,
  BookOpenCheck,
  Languages,
  AudioLines,
  Lightbulb,
  Target,
} from "lucide-react";
import { SpecificErrorItem } from "../services/interviewEngineService";
import { ComprehensiveTurnFeedback } from "../services/masterAiFeedbackEngine";
import { SpeechSynthesisService } from "../services/speechSynthesisService";
import { sanitizeFeedbackTone } from "../services/coreAiEvaluatorService";
import { AppModal } from "../../../design-system/components/Modal/AppModal";
import { logger } from "../../../shared/utils/logger";

const WAVEFORM_BARS = [
  3, 4, 6, 14, 20, 12, 6, 4, 4, 8, 18, 24, 22, 16, 10, 6, 4, 6, 12, 20, 24, 22, 14, 8, 6, 4, 10, 18,
  22, 16, 8, 4, 6, 12, 20, 22, 14, 6, 4, 4, 8, 16, 20, 14, 8, 4, 6, 12, 18, 14, 8, 4, 6, 14, 22, 18,
  10, 6, 4, 6, 10, 16, 12, 8, 4, 4, 6, 12, 18, 14, 8, 4, 4, 6, 12, 16, 10, 6, 4, 4, 6, 12, 18, 22,
  16, 8, 4, 4, 6, 10, 6, 4, 3,
];

const formatPlaybackTime = (sec: number): string => {
  const safeSec = Math.max(0, Math.floor(sec));
  const m = Math.floor(safeSec / 60);
  const s = Math.floor(safeSec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

function TopHighlight() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_18%)]"
    />
  );
}

function cleanRuleNote(translationSpanish?: string, explanation?: string): string {
  if (!translationSpanish) return sanitizeFeedbackTone(explanation || "");

  let text = translationSpanish.trim();

  // If text contains the bombillito emoji (U+1F4A1), extract only the focused rule/reminder after it
  if (/[\u{1F4A1}]/u.test(text)) {
    const parts = text
      .split(/[\u{1F4A1}]/u)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 1) {
      text = parts[parts.length - 1];
    } else if (parts.length === 1) {
      text = parts[0];
    }
  }

  // Remove leading prefixes like "Regla:", "Nota:", etc.
  text = text.replace(/^(Regla|Nota|Tip|Consejo)\s*:\s*/i, "").trim();

  // Capitalize first letter
  const cleaned = text ? text.charAt(0).toUpperCase() + text.slice(1) : explanation || "";
  return sanitizeFeedbackTone(cleaned);
}

function getDynamicInsight(feedback: ComprehensiveTurnFeedback): string {
  if (
    feedback.strategicFeedback?.explanation &&
    feedback.strategicFeedback.explanation.trim().length > 10
  ) {
    return sanitizeFeedbackTone(feedback.strategicFeedback.explanation.trim());
  }

  const strengths = feedback.keyStrengths?.filter(Boolean) || [];
  const errors = feedback.unclearOrErrorWords || [];

  if (strengths.length > 0) {
    const citedStrengths = strengths
      .slice(0, 2)
      .map((s) => `'${s}'`)
      .join(" y ");
    if (errors.length === 0) {
      return `Articulaste tus ideas con fluidez y destacaste al integrar ${citedStrengths}, proyectando un perfil seguro y estructurado.`;
    }
    return `Identificamos conceptos valiosos en tu respuesta como ${citedStrengths}. Se detectaron ${errors.length} oportunidades de estructura para conectar aún mejor tus oraciones.`;
  }

  if (errors.length === 0) {
    return "Demostraste una respuesta concisa, natural y sin errores léxicos ni gramaticales para esta pregunta.";
  }

  return `Identificamos tu iniciativa comunicativa y ${errors.length} puntos clave de gramática y vocabulario para consolidar tu estructura en las siguientes tomas.`;
}

function getDynamicRecommendation(feedback: ComprehensiveTurnFeedback): string {
  if (
    feedback.strategicFeedback?.recommendation &&
    feedback.strategicFeedback.recommendation.trim().length > 10
  ) {
    return sanitizeFeedbackTone(feedback.strategicFeedback.recommendation.trim());
  }

  if (feedback.tipsForNextTurn && feedback.tipsForNextTurn.trim().length > 10) {
    return sanitizeFeedbackTone(feedback.tipsForNextTurn.trim());
  }

  const errors = feedback.unclearOrErrorWords || [];
  const hasFalseCognates = errors.some(
    (e) =>
      e.errorType === "VOCABULARY" ||
      e.explanation.toLowerCase().includes("falso amigo") ||
      e.explanation.toLowerCase().includes("cognado"),
  );

  if (hasFalseCognates) {
    return "Paso a paso: Presta atención a los falsos cognados señalados abajo (ej. attend vs assist, summarize vs resume) para garantizar máxima precisión y naturalidad.";
  }

  if (errors.length > 0) {
    return "Paso a paso: Para tu próxima respuesta, concéntrate en conectar oraciones cortas con el modelo STAR y apóyate en los términos sugeridos en las tarjetas inferiores.";
  }

  return "Mantén esta cadencia ejecutiva. Para respuestas de liderazgo de mayor calibre, cuantifica el impacto en negocio (ROI, % de adopción o tiempos de entrega).";
}

export interface InterviewAnalysisModalProps {
  feedback: ComprehensiveTurnFeedback;
  savedErrorIds: Set<string>;
  onClose: () => void;
  onSaveSpecificError: (errorItem: SpecificErrorItem) => Promise<boolean>;
  onSaveAllErrors: () => Promise<number>;
  onNavigateToMemory?: (() => void) | undefined;
}

interface ScoreGaugeProps {
  value: number;
  from: string;
  to: string;
  id: string;
  glowColor?: string;
  size?: number;
  stroke?: number;
}

function ScoreGauge({
  value,
  from,
  to,
  id,
  glowColor = "rgba(162, 127, 243, 0.40)",
  size = 80,
  stroke = 5.5,
}: ScoreGaugeProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#141528"
          strokeWidth={stroke}
        />
        {/* Animated Metric Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: glowColor ? `drop-shadow(0 0 6px ${glowColor})` : undefined,
          }}
        />
      </svg>
      {/* Centered Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[20px] font-bold tracking-tight text-white font-mono leading-none">
          {safeValue}
        </span>
        <span className="text-[9px] font-medium text-white/40 leading-none mt-0.5">%</span>
      </div>
    </div>
  );
}

const getTierLabel = (score: number): string => {
  if (score >= 90) return "Nivel Ejecutivo";
  if (score >= 80) return "Nivel Avanzado";
  if (score >= 70) return "Nivel Competente";
  return "En Desarrollo";
};

export const InterviewAnalysisModal: React.FC<InterviewAnalysisModalProps> = ({
  feedback,
  savedErrorIds,
  onClose,
  onSaveSpecificError,
  onSaveAllErrors,
  onNavigateToMemory,
}) => {
  const [index, setIndex] = useState<number>(0);
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState<boolean>(false);

  // Real user audio recording player states
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false);
  const [userAudioCurrentTime, setUserAudioCurrentTime] = useState<number>(0);
  const [userAudioDuration, setUserAudioDuration] = useState<number>(
    feedback.recordingDurationSeconds || 0,
  );

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

  const errors = feedback.unclearOrErrorWords || [];
  const currentError = errors[index] || errors[0];

  const goNav = (dir: number) => {
    if (errors.length === 0) return;
    setIndex((prev) => (prev + dir + errors.length) % errors.length);
  };

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
      userAudioRef.current.play().catch((e) => logger.warn("Audio play notice:", e));
      setIsPlayingUserAudio(true);
    }
  };

  const handleSeekUserAudio = (fraction: number) => {
    if (!userAudioRef.current) return;
    const duration = userAudioDuration || userAudioRef.current.duration || 1;
    const targetTime = fraction * duration;
    userAudioRef.current.currentTime = targetTime;
    setUserAudioCurrentTime(targetTime);
  };

  const handlePlayModelAnswer = () => {
    if (isPlayingUserAudio && userAudioRef.current) {
      userAudioRef.current.pause();
      setIsPlayingUserAudio(false);
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

  const handleSaveAll = async () => {
    setIsSavingAll(true);
    await onSaveAllErrors();
    setIsSavingAll(false);
  };

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
            <linearGradient
              id="hdr_grad"
              x1="3.34"
              y1="2"
              x2="20.66"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#674ee6" />
            </linearGradient>
            <linearGradient
              id="hdr_fill"
              x1="12"
              y1="2"
              x2="12"
              y2="22"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A27FF3" />
              <stop offset="1" stopColor="#3b1d7d" />
            </linearGradient>
          </defs>
        </svg>
      }
      bodyClassName="p-5 lg:p-7"
    >
      {/* Screen-reader live region: announces the evaluation result when it
          appears, so blind/low-vision learners get the score and insight
          without hunting through the visual cards. */}
      <div aria-live="polite" role="status" className="sr-only">
        {`Evaluación completada. Puntaje global ${feedback.overallScore} de 100. ` +
          `Gramática ${Math.round(feedback.grammarScore)}, vocabulario ${Math.round(
            feedback.vocabularyScore,
          )}, claridad ${Math.round(feedback.clarityScore)}. ` +
          getDynamicInsight(feedback)}
      </div>

      <div className="mx-auto max-w-4xl space-y-5">
        {/* Master Executive Scorecard & Competencies Hub */}
        <section className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Overall Score Hero (lg:col-span-5) */}
            <div className="lg:col-span-5 flex items-center gap-5 lg:pr-7 lg:border-r lg:border-white/[0.06]">
              <ScoreGauge
                value={feedback.overallScore}
                id="gauge_overall_hero"
                from="#7048E8"
                to="#A27FF3"
                glowColor="rgba(162, 127, 243, 0.45)"
                size={84}
                stroke={6}
              />
              <div className="flex-1 min-w-0 flex flex-col justify-center space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4.5 w-4.5 text-[#A27FF3] shrink-0" />
                  <h3 className="text-[16.5px] font-semibold text-white tracking-tight leading-none">
                    Puntaje Global
                  </h3>
                </div>
                <p className="text-[12px] font-medium text-[#c4b5fd] leading-none">
                  {getTierLabel(feedback.overallScore)}
                </p>
                <p className="text-[12px] text-[#8a8a9e] leading-relaxed">
                  Rendimiento general de fluidez, vocabulario y gramática.
                </p>
              </div>
            </div>

            {/* Right Column: 3 Detailed Competency Progress Bars (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Grammar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-[#9d7cf0] shrink-0" />
                    <span className="font-medium text-white">Gramática</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#8a8a9e]">
                      {getTierLabel(feedback.grammarScore)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {Math.round(feedback.grammarScore)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(157,124,240,0.4)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, feedback.grammarScore))}%`,
                      background: "linear-gradient(90deg, #674ee6, #9d7cf0)",
                    }}
                  />
                </div>
              </div>

              {/* Vocabulary */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-[#c084fc] shrink-0" />
                    <span className="font-medium text-white">Vocabulario</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#8a8a9e]">
                      {getTierLabel(feedback.vocabularyScore)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {Math.round(feedback.vocabularyScore)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(192,132,252,0.4)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, feedback.vocabularyScore))}%`,
                      background: "linear-gradient(90deg, #8f71ee, #c084fc)",
                    }}
                  />
                </div>
              </div>

              {/* Clarity and Voice */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-2">
                    <AudioLines className="h-4 w-4 text-[#A27FF3] shrink-0" />
                    <span className="font-medium text-white">Claridad y Voz</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] text-[#8a8a9e]">
                      {getTierLabel(feedback.clarityScore)}
                    </span>
                    <span className="font-semibold text-white tabular-nums">
                      {Math.round(feedback.clarityScore)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden p-[1px]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(162,127,243,0.4)]"
                    style={{
                      width: `${Math.min(100, Math.max(0, feedback.clarityScore))}%`,
                      background: "linear-gradient(90deg, #7048E8, #A27FF3)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Insights & Recommendation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Key Insights */}
          <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#A27FF3] shrink-0" />
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    Key Insights
                  </h3>
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
                  ANÁLISIS
                </span>
              </div>

              <div className="flex items-start gap-3.5 pl-1 pr-2">
                <svg
                  className="w-[18px] h-[15px] shrink-0 mt-1 text-[#674ee6]"
                  viewBox="0 0 28 22"
                  fill="currentColor"
                >
                  <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
                </svg>
                <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">
                  "{getDynamicInsight(feedback)}"
                </p>
              </div>
            </div>
          </article>

          {/* Card 2: Strategy Recommendation */}
          <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 shadow-xl flex flex-col justify-between transition-all duration-300">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#A27FF3] shrink-0" />
                  <h3 className="text-[15px] font-semibold text-white tracking-tight">
                    Strategy Recommendation
                  </h3>
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#8a8a9e]">
                  RECOMENDACIÓN
                </span>
              </div>

              <div className="flex items-start gap-3.5 pl-1 pr-2">
                <svg
                  className="w-[18px] h-[15px] shrink-0 mt-1 text-[#674ee6]"
                  viewBox="0 0 28 22"
                  fill="currentColor"
                >
                  <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
                </svg>
                <p className="text-[13.5px] sm:text-[14px] leading-[1.65] text-[#d4d4e0] font-normal">
                  "{getDynamicRecommendation(feedback)}"
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Transcript & Improved Answer Stack */}
        <div className="flex flex-col gap-4">
          {/* 1. Lo que dijiste (User Transcript) */}
          <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl transition-all">
            {/* Real User Audio Element */}
            {feedback.userAudioUrl && (
              <audio
                ref={userAudioRef}
                src={feedback.userAudioUrl}
                preload="metadata"
                onTimeUpdate={() => {
                  if (userAudioRef.current) {
                    setUserAudioCurrentTime(userAudioRef.current.currentTime);
                  }
                }}
                onLoadedMetadata={() => {
                  if (userAudioRef.current && userAudioRef.current.duration) {
                    setUserAudioDuration(userAudioRef.current.duration);
                  }
                }}
                onEnded={() => {
                  setIsPlayingUserAudio(false);
                  setUserAudioCurrentTime(0);
                }}
              />
            )}

            {/* Header Row */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-[#A27FF3] shrink-0" />
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[16px] font-semibold text-white tracking-tight">
                    Lo que dijiste
                  </h3>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
                    Transcripción
                  </span>
                </div>
              </div>

              <button
                onClick={handleToggleUserAudio}
                className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#8f71ee] hover:text-[#c4b5fd] transition-colors cursor-pointer"
              >
                <Volume2
                  className={`h-4 w-4 ${isPlayingUserAudio ? "text-emerald-400 animate-pulse" : "text-[#8f71ee]"}`}
                />
                <span>{isPlayingUserAudio ? "Pausar audio" : "Escuchar audio"}</span>
              </button>
            </div>

            {/* Body: Bespoke Purple SVG Quote Icon + Quoted Text */}
            <div className="flex items-start gap-4 pl-2 sm:pl-5 pr-6 sm:pr-28 mb-7">
              <svg
                className="w-[25px] h-[20px] shrink-0 mt-0.5 text-[#674ee6]"
                viewBox="0 0 28 22"
                fill="currentColor"
              >
                <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
              </svg>
              <p className="text-[14.5px] leading-[1.75] text-[#d4d4e0] font-normal">
                "{feedback.userSpokenText}"
              </p>
            </div>

            {/* Audio Player Bar */}
            <div className="flex items-center gap-4 pl-2 sm:pl-5 pr-4 sm:pr-14 max-w-[740px] pt-1">
              <button
                onClick={handleToggleUserAudio}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#171233] border border-[#2a2057] text-white hover:scale-105 hover:bg-[#221a47] transition-all cursor-pointer shadow-md"
                aria-label={isPlayingUserAudio ? "Pausar mi audio" : "Reproducir mi audio"}
              >
                {isPlayingUserAudio ? (
                  <Pause className="h-4 w-4 fill-white text-white" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5 fill-white text-white" />
                )}
              </button>

              {/* Dynamic interactive waveform */}
              <div
                className="flex-1 flex items-center justify-between gap-[2px] sm:gap-[2.5px] h-6 overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const fraction = Math.max(0, Math.min(1, clickX / rect.width));
                  handleSeekUserAudio(fraction);
                }}
                title="Haz clic en cualquier punto para reproducir"
              >
                {WAVEFORM_BARS.map((h, i) => {
                  const effectiveDuration = userAudioDuration || 1;
                  const progress = userAudioCurrentTime / effectiveDuration;
                  const barProgress = i / WAVEFORM_BARS.length;
                  const isPassed = barProgress <= progress;

                  return (
                    <div
                      key={i}
                      className={`w-[1.5px] rounded-full shrink-0 transition-colors ${
                        isPassed
                          ? "bg-[#A27FF3] shadow-[0_0_6px_rgba(162,127,243,0.8)]"
                          : "bg-[#674ee6]/35 group-hover:bg-[#674ee6]/60"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>

              <span className="text-[13px] font-medium text-[#7c7b94] ml-2 shrink-0 font-mono">
                {formatPlaybackTime(
                  userAudioCurrentTime > 0 ? userAudioCurrentTime : userAudioDuration || 0,
                )}
              </span>
            </div>
          </article>

          {/* 2. Respuesta mejorada (Native Model Answer) */}
          <article className="relative rounded-2xl bg-[#090A14] border border-white/[0.08] p-6 sm:p-7 shadow-xl transition-all">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#A27FF3] shrink-0" />
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[16px] font-semibold text-white tracking-tight">
                    Respuesta mejorada
                  </h3>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8a9e]">
                    Modelo nativo
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlayModelAnswer}
                className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#8f71ee] hover:text-[#c4b5fd] transition-colors cursor-pointer"
              >
                <Volume2
                  className={`h-4 w-4 ${isPlayingModelAudio ? "text-emerald-400 animate-pulse" : "text-[#8f71ee]"}`}
                />
                <span>{isPlayingModelAudio ? "Detener" : "Escuchar respuesta"}</span>
              </button>
            </div>

            {/* Body: Bespoke Purple SVG Quote Icon + Quoted Native Text */}
            <div className="flex items-start gap-4 pl-2 sm:pl-5 pr-6 sm:pr-28 mb-4">
              <svg
                className="w-[25px] h-[20px] shrink-0 mt-0.5 text-[#674ee6]"
                viewBox="0 0 28 22"
                fill="currentColor"
              >
                <path d="M2.5 14.5c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7zm13 0c0-4.8 3-8.5 7.5-10.2l1.2 2.2c-3.2 1.1-4.8 3.2-5.1 5.3.5-.2 1.2-.3 1.9-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-3.2 0-5.5-2.8-5.5-7z" />
              </svg>
              <p className="text-[14.5px] leading-[1.75] text-[#d4d4e0] font-normal">
                "{feedback.improvedFullAnswer}"
              </p>
            </div>

            {/* Bottom Row: Copy Button right aligned */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(feedback.improvedFullAnswer);
                }}
                title="Copiar respuesta"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[#8a8a9e] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all cursor-pointer shadow-sm"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>

        {/* Errors & Improvement Analysis Single-Row Flashcard Carousel */}
        {errors.length > 0 ? (
          <div className="mt-8">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[17px] font-semibold text-white tracking-tight">
                  Análisis de mejora
                </h3>
                <span className="text-[12.5px] font-medium text-[#8a8a9e]">
                  • {errors.length} {errors.length === 1 ? "corrección" : "correcciones"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {onNavigateToMemory && (
                  <button
                    onClick={onNavigateToMemory}
                    className="text-xs text-[#8a8a9e] hover:text-white underline transition-colors cursor-pointer hidden sm:inline-block mr-2"
                  >
                    Ver en Memory Bank →
                  </button>
                )}
                {savedErrorIds.has(currentError.id) && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#6ce2a3]">
                    <CircleCheck className="h-4 w-4" strokeWidth={2.5} />
                    Guardado
                  </span>
                )}
                <button
                  onClick={handleSaveAll}
                  disabled={isSavingAll}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#a7a8b5] hover:text-white transition-colors cursor-pointer"
                >
                  <Bookmark className="h-4 w-4" fill={isSavingAll ? "currentColor" : "none"} />
                  {isSavingAll ? "Guardando..." : "Guardar todo"}
                </button>
              </div>
            </div>

            {/* 3-Piece Layout from improvement-analysis.tsx */}
            <div
              className="
                    relative grid items-start gap-x-4 gap-y-3
                    [grid-template-columns:1fr]
                    md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.05fr)]
                    md:[grid-template-rows:auto_auto_4.5rem]
                  "
            >
              {/* Error card — intentionally the tallest element; spans all rows on desktop */}
              <article
                className="edge relative overflow-hidden rounded-2xl p-6 sm:p-7 md:self-stretch md:[grid-area:1/1/4/2] flex flex-col justify-between"
                style={{
                  background:
                    "radial-gradient(110% 90% at 0% 0%, rgba(216,102,122,0.06), transparent 60%), radial-gradient(120% 80% at 30% 100%, rgba(216,102,122,0.03), transparent 65%), #090A14",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(216,102,122,0.55), rgba(216,102,122,0.14) 35%, rgba(216,102,122,0.05) 70%, rgba(255,255,255,0.04))",
                }}
              >
                <TopHighlight />
                <div>
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <X
                        className="h-4 w-4 shrink-0 text-[#d8667a]"
                        aria-hidden="true"
                        strokeWidth={2.5}
                      />
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#d8667a]">
                        INCORRECTO / POCO CLARO
                      </span>
                    </div>
                    {currentError.errorType && (
                      <span className="text-[11px] font-semibold tracking-wider text-[#8a8a9e] uppercase">
                        {currentError.errorType}
                      </span>
                    )}
                  </div>
                  <p className="relative mt-4 text-xl font-medium text-[#b0b1c0] line-through decoration-[#d8667a]/60 decoration-1 leading-snug">
                    {currentError.errorWord}
                  </p>
                </div>

                {/* Bottom area of Card 1: CEFR level on left, Guardar en Memory on right (NO divider line) */}
                <div className="relative mt-6 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#6f7180]">
                    <span className="font-medium">Nivel CEFR:</span>
                    <span className="font-semibold text-[#f4f4f7]">
                      {currentError.cefrLevel || "B2"}
                    </span>
                  </div>

                  <button
                    onClick={() => onSaveSpecificError(currentError)}
                    disabled={savedErrorIds.has(currentError.id)}
                    className={`transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium ${
                      savedErrorIds.has(currentError.id)
                        ? "text-[#55c9a4] cursor-default"
                        : "text-[#8a8a9e] hover:text-white"
                    }`}
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      fill={savedErrorIds.has(currentError.id) ? "currentColor" : "none"}
                    />
                    <span>
                      {savedErrorIds.has(currentError.id) ? "Guardado" : "Guardar en Memory"}
                    </span>
                  </button>
                </div>
              </article>

              {/* Decorative arrow: aligned to the sentence transformation row, not card centers */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[4.75rem] z-20 hidden -translate-x-1/2 -translate-y-1/2 text-[#a27ff3]/55 md:block"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={2.25} />
              </span>

              {/* Success card — ends earlier; sits in the top row only */}
              <article
                className="edge relative z-10 overflow-hidden self-start rounded-2xl p-6 sm:p-7 md:[grid-area:1/2/2/3]"
                style={{
                  background:
                    "radial-gradient(110% 90% at 100% 0%, rgba(85,201,164,0.06), transparent 60%), #090A14",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(85,201,164,0.55), rgba(85,201,164,0.14) 35%, rgba(85,201,164,0.05) 70%, rgba(255,255,255,0.04))",
                }}
              >
                <TopHighlight />
                <div className="relative flex items-center gap-2">
                  <Check
                    className="h-4 w-4 shrink-0 text-[#55c9a4]"
                    aria-hidden="true"
                    strokeWidth={2.5}
                  />
                  <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#55c9a4]">
                    MEJOR OPCIÓN
                  </span>
                </div>
                <p className="relative mt-4 text-xl font-medium text-[#55c9a4] sm:text-[1.4rem] sm:leading-snug">
                  {currentError.correctWord}
                </p>
                <div className="relative mt-4">
                  <p className="text-xs font-semibold text-[#d4d4e0] uppercase tracking-wider">
                    Explicación:
                  </p>
                  <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[#a7a8b5]">
                    {currentError.explanation}
                  </p>
                </div>
              </article>

              {/* Grammar rule / Note — occupies the lower area, layered above the red card's
                      lower extension. Inset from the left so the red card grows wider and
                      wraps around it. */}
              <div
                className="edge relative z-10 self-start rounded-xl px-4 py-3.5 md:ml-8 md:[grid-area:2/1/3/3] lg:ml-10"
                style={{
                  background: "#0B0C16",
                  ["--edge" as string]:
                    "linear-gradient(160deg, rgba(162,127,243,0.40), rgba(162,127,243,0.10) 45%, rgba(255,255,255,0.03))",
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#a27ff3]" aria-hidden="true" />
                  <span className="text-xs font-semibold text-[#f4f4f7]">Regla gramatical:</span>
                </div>
                <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[#a7a8b5]">
                  {cleanRuleNote(currentError.translationSpanish, currentError.explanation)}
                </p>
              </div>
            </div>

            {/* Footer Navigation: Anterior on Left, Dots/Counter in Center, Siguiente on Right */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => goNav(-1)}
                disabled={errors.length <= 1}
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Ir a la corrección anterior"
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Anterior</span>
              </button>

              {errors.length > 1 && (
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-medium text-[#6f7180]">
                    {index + 1} de {errors.length}
                  </span>
                  <nav aria-label="Progreso de correcciones" className="flex items-center gap-1.5">
                    {errors.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Ir a corrección ${i + 1}`}
                        onClick={() => setIndex(i)}
                        className={`transition-all cursor-pointer ${
                          i === index
                            ? "h-1.5 w-6 rounded-full bg-[#9d7cf0]"
                            : "h-1.5 w-1.5 rounded-full bg-white/[0.12] hover:bg-[#8a8a9e]"
                        }`}
                      />
                    ))}
                  </nav>
                </div>
              )}

              <button
                onClick={() => goNav(1)}
                disabled={errors.length <= 1}
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#8a8a9e] transition-colors hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                aria-label="Ir a la siguiente corrección"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 lg:p-8 rounded-2xl border border-[#18152e] bg-[#070611] shadow-2xl flex items-center justify-center gap-4 mt-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#16122e] border border-[#271f4f]">
              <CircleCheck className="h-6 w-6 text-[#6ce2a3]" strokeWidth={2.5} />
            </span>
            <p className="text-[15.5px] font-normal text-white tracking-wide">
              ¡Excelente entrega nativa! No se detectaron errores.
            </p>
          </div>
        )}
      </div>
    </AppModal>
  );
};
