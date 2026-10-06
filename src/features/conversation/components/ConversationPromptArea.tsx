import React, { useRef, useEffect, useState, useMemo } from "react";

export interface ConversationPromptAreaProps {
  currentQuestionText?: string;
  currentQuestionIndex?: number;
  isGenerating?: boolean;
  roleName?: string;
  userLevel?: string;
  userTranscript?: string;
  isListening?: boolean;
  isThinking?: boolean;
  selectedVoice?: "en-US-AriaNeural" | "en-US-ChristopherNeural";
  onSelectVoice?: (voice: "en-US-AriaNeural" | "en-US-ChristopherNeural") => void;
  onRepeatQuestion?: () => void;
  onClearTranscript?: () => void;
  onTranscriptChange?: (text: string) => void;
  onSubmitAnswer?: (text: string) => void;
}

const ConversationPromptAreaInner: React.FC<ConversationPromptAreaProps> = ({
  currentQuestionText = "",
  currentQuestionIndex = 0,
  isGenerating = false,
  roleName = "Professional",
  userLevel = "B1",
  userTranscript = "",
  isListening = false,
  isThinking = false,
  selectedVoice = "en-US-AriaNeural",
  onSelectVoice,
  onRepeatQuestion,
  onClearTranscript,
  onTranscriptChange,
  onSubmitAnswer,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll textarea to bottom when speech is dictated
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [userTranscript]);

  // Only trigger waiting mode if parent specifically marked this initial generation
  const isWaitingForQuestion =
    Boolean(isGenerating) &&
    (!currentQuestionText ||
      currentQuestionText.startsWith("Preparing") ||
      currentQuestionText.startsWith("Generating"));

  // Dynamic progressive bar state that moves in real time with the network call
  const [progress, setProgress] = useState(isWaitingForQuestion ? 15 : 100);
  const [displayWaiting, setDisplayWaiting] = useState(isWaitingForQuestion);

  useEffect(() => {
    if (isWaitingForQuestion) {
      setDisplayWaiting(true);
      setProgress(15);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setProgress((prev) => {
          if (prev >= 94) {
            return Math.min(95, prev + 0.12);
          }
          let target = 15;
          if (elapsed < 600) {
            target = 15 + (elapsed / 600) * 25; // 15 -> 40%
          } else if (elapsed < 1800) {
            target = 40 + ((elapsed - 600) / 1200) * 32; // 40 -> 72%
          } else if (elapsed < 3500) {
            target = 72 + ((elapsed - 1800) / 1700) * 18; // 72 -> 90%
          } else {
            target = Math.min(94, 90 + ((elapsed - 3500) / 2000) * 4);
          }
          return Math.max(prev, target);
        });
      }, 60);

      return () => clearInterval(interval);
    } else {
      // API call completed: smoothly animate to 100% and then reveal question
      setProgress(100);
      const timeout = setTimeout(() => {
        setDisplayWaiting(false);
      }, 240);
      return () => clearTimeout(timeout);
    }
  }, [isWaitingForQuestion]);

  const stageFeedback = useMemo(() => {
    if (progress < 35) return "Conectando con el motor de IA...";
    if (progress < 72)
      return `Personalizando el escenario en tiempo real para ${roleName || "tu perfil"} (${userLevel || "B1"})...`;
    if (progress < 98) return "Sintetizando desafío oral CEFR...";
    return "¡Pregunta lista!";
  }, [progress, roleName, userLevel]);

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl flex flex-col justify-start gap-[clamp(6px,1.2vh,14px)] text-left px-0 shrink-0 font-sans">
      {/* 1. Question Hero Section */}
      <div className="w-full flex flex-col gap-[clamp(4px,0.7vh,7px)] shrink-0 select-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-[#8264C3]">
              QUESTION {currentQuestionIndex > 0 && !displayWaiting ? `· 0${currentQuestionIndex}` : ""}
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-[#8264C3]/50 to-transparent inline-block" />
            {displayWaiting && (
              <span className="text-[9.5px] tracking-[0.16em] uppercase font-mono text-[#A27FF3] animate-pulse">
                GENERATING
              </span>
            )}
          </div>

            {/* Dual Mentor Switcher (Pure Typography & Clean Micro Dot) */}
            {onSelectVoice && (
              <div className="inline-flex items-center gap-1 sm:gap-1.5 leading-none select-none">
                {/* Aria */}
                <button
                  type="button"
                  onClick={() => onSelectVoice("en-US-AriaNeural")}
                  title="Interviewer: Aria (Femenino)"
                  aria-label="Select Aria interviewer voice"
                  className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 py-2 px-2 -my-2 sm:my-0 sm:p-0 min-h-[36px] sm:min-h-0 outline-none leading-none active:scale-95 touch-manipulation ${
                    selectedVoice === "en-US-AriaNeural"
                      ? "text-white font-semibold"
                      : "text-white/40 hover:text-white/70 font-normal"
                  }`}
                >
                  {selectedVoice === "en-US-AriaNeural" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
                  )}
                  <span>Aria</span>
                </button>

                <span className="text-white/20 text-[10px] select-none font-light leading-none">|</span>

                {/* Chris */}
                <button
                  type="button"
                  onClick={() => onSelectVoice("en-US-ChristopherNeural")}
                  title="Interviewer: Christopher (Ejecutivo)"
                  aria-label="Select Christopher interviewer voice"
                  className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 py-2 px-2 -my-2 sm:my-0 sm:p-0 min-h-[36px] sm:min-h-0 outline-none leading-none active:scale-95 touch-manipulation ${
                    selectedVoice === "en-US-ChristopherNeural"
                      ? "text-white font-semibold"
                      : "text-white/40 hover:text-white/70 font-normal"
                  }`}
                >
                  {selectedVoice === "en-US-ChristopherNeural" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
                  )}
                  <span>Chris</span>
                </button>

                {onRepeatQuestion && !displayWaiting && (
                  <>
                    <span className="text-white/20 text-xs select-none font-light leading-none">·</span>
                    <button
                      type="button"
                      onClick={onRepeatQuestion}
                      title="Repetir pregunta en voz alta"
                      aria-label="Repeat interviewer question"
                      className="inline-flex items-center gap-1 text-[11px] font-sans text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 py-2 px-2 -my-2 sm:my-0 sm:p-0 min-h-[36px] sm:min-h-0 outline-none leading-none active:scale-95 touch-manipulation ml-0.5"
                    >
                      <svg
                        className="w-3 h-3 text-white/60 hover:text-white transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Repeat</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Question Text / Live Generating State */}
          {displayWaiting ? (
            <div className="w-full flex flex-col gap-2 py-1 select-none animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center">
                <span className="text-[clamp(15px,2.1vh,20px)] sm:text-[clamp(17px,2.4vh,22px)] font-sans font-medium text-white/95 tracking-normal leading-[1.45] sm:leading-[1.6]">
                  Generando tu pregunta con IA...
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/50 font-light leading-relaxed">
                {stageFeedback}
              </p>
              <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-1.5 mt-0.5">
                <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden relative border border-white/[0.04]">
                  <div
                    className="h-full bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#C084FC] rounded-full relative shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                    style={{
                      width: `${progress}%`,
                      transition: "width 120ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                    }}
                  >
                    {/* Dynamic laser beam pip on the leading edge */}
                    <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/70 rounded-full blur-[1px]" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10.5px] font-mono text-white/40">
                  <span className="font-sans text-white/40">Progreso de calibración</span>
                  <span className="font-semibold text-[#C084FC]">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <h2
              key={`question-${currentQuestionIndex}`}
              aria-live="polite"
              className="text-[clamp(15px,2.1vh,20px)] sm:text-[clamp(18px,2.5vh,24px)] font-sans font-light text-white/95 tracking-normal leading-[1.45] sm:leading-[1.6] select-text animate-[fadeSlideUp_0.3s_ease-out_both]"
            >
              {currentQuestionText}
            </h2>
          )}
        </div>

      {/* Subtle clean divider line with edge fade */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0 my-1 sm:my-[clamp(3px,0.6vh,6px)]" />

      {/* 2. Live Transcript Header */}
      <div className="w-full flex flex-col gap-[clamp(4px,0.7vh,7px)] shrink-0">
        <div className="flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-white/40 shrink-0">
              LIVE TRANSCRIPT
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-white/20 to-transparent inline-block shrink-0" />
            {isListening && (
              <span className="text-[10px] sm:text-[10.5px] font-medium tracking-[0.18em] uppercase font-sans text-white/45 select-none transition-opacity duration-200">
                Live
              </span>
            )}
            {isThinking && (
              <span className="text-[10px] sm:text-[10.5px] font-medium tracking-[0.18em] uppercase font-sans text-white/45 select-none transition-opacity duration-200">
                Evaluating
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {userTranscript.trim().length > 0 && onClearTranscript && (
              <button
                type="button"
                onClick={onClearTranscript}
                aria-label="Clear answer transcript"
                className="text-[11px] font-medium text-white/40 hover:text-white/80 transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white/[0.05]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Text Area: Clean native typography without artificial floating overlays */}
        <textarea
          ref={textareaRef}
          id="interview-user-transcript"
          name="interviewUserTranscript"
          aria-label="Tu respuesta en inglés"
          value={userTranscript}
          spellCheck={false}
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => onTranscriptChange && onTranscriptChange(e.target.value)}
          onKeyDown={(e) => {
            // Prevent Space or other typing keys from leaking to global window listeners
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (userTranscript.trim() && onSubmitAnswer) {
                onSubmitAnswer(userTranscript);
              }
            }
          }}
          placeholder={
            displayWaiting
              ? "Preparando pregunta con IA... Podrás responder en un momento"
              : isListening
                ? "Listening... speak in English"
                : isThinking
                  ? "Processing your answer..."
                  : "Start speaking with the mic or type your answer here (Click green OK or press Enter to submit)..."
          }
          style={{ outline: "none", boxShadow: "none" }}
          className="w-full border-0 border-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 shadow-none focus:shadow-none h-[clamp(72px,12vh,125px)] sm:h-[clamp(85px,14vh,180px)] bg-transparent font-sans text-[clamp(16px,1.9vh,18.5px)] text-[#E2E8F0] font-normal leading-[1.65] tracking-[-0.012em] caret-[#A27FF3] resize-none placeholder:text-white/35 placeholder:font-light placeholder:tracking-normal overflow-y-auto no-scrollbar selection:bg-[#A27FF3]/30 selection:text-white transition-all duration-200"
        />
      </div>
    </div>
  );
};

export const ConversationPromptArea = React.memo(ConversationPromptAreaInner);

