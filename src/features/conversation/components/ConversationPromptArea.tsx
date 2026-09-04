import React, { useRef, useEffect } from "react";

export interface ConversationPromptAreaProps {
  currentQuestionText?: string;
  userTranscript?: string;
  selectedVoice?: "en-US-AriaNeural" | "en-US-ChristopherNeural";
  onSelectVoice?: (voice: "en-US-AriaNeural" | "en-US-ChristopherNeural") => void;
  onRepeatQuestion?: () => void;
  onClearTranscript?: () => void;
  onTranscriptChange?: (text: string) => void;
  onSubmitAnswer?: (text: string) => void;
}

export const ConversationPromptArea: React.FC<ConversationPromptAreaProps> = ({
  currentQuestionText = "",
  userTranscript = "",
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

  return (
    <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl flex flex-col justify-start gap-[clamp(6px,1.2vh,14px)] text-left px-3 sm:px-6 shrink-0 animate-[fadeIn_0.35s_ease-out_both] font-sans">
      {/* 1. Question Hero Section */}
      {currentQuestionText && (
        <div className="w-full flex flex-col gap-[clamp(4px,0.7vh,7px)] shrink-0 select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-[#8264C3]">
                QUESTION
              </span>
              <span className="h-px w-8 bg-gradient-to-r from-[#8264C3]/50 to-transparent inline-block" />
            </div>

            {/* Dual Mentor Switcher (Pure Typography & Clean Micro Sparks) */}
            {onSelectVoice && (
              <div className="inline-flex items-center gap-1.5 leading-none select-none">
                {/* Aria Spark */}
                <button
                  type="button"
                  onClick={() => onSelectVoice("en-US-AriaNeural")}
                  title="Interviewer: Aria (Femenino)"
                  aria-label="Select Aria interviewer voice"
                  className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
                    selectedVoice === "en-US-AriaNeural"
                      ? "text-[#C4B5FD] font-semibold drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]"
                      : "text-white/35 hover:text-white/70 font-normal"
                  }`}
                >
                  <svg
                    width={9}
                    height={9}
                    viewBox="0 0 24 24"
                    fill={selectedVoice === "en-US-AriaNeural" ? "#C4B5FD" : "currentColor"}
                    className={`shrink-0 ${
                      selectedVoice === "en-US-AriaNeural" ? "animate-pulse" : "opacity-30"
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <span>Aria</span>
                </button>

                <span className="text-white/20 text-[10px] select-none font-light leading-none">|</span>

                {/* Chris Spark */}
                <button
                  type="button"
                  onClick={() => onSelectVoice("en-US-ChristopherNeural")}
                  title="Interviewer: Christopher (Ejecutivo)"
                  aria-label="Select Christopher interviewer voice"
                  className={`inline-flex items-center gap-1 text-[11px] font-sans transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 outline-none leading-none ${
                    selectedVoice === "en-US-ChristopherNeural"
                      ? "text-[#7DD3FC] font-semibold drop-shadow-[0_0_8px_rgba(125,211,252,0.5)]"
                      : "text-white/35 hover:text-white/70 font-normal"
                  }`}
                >
                  <svg
                    width={9}
                    height={9}
                    viewBox="0 0 24 24"
                    fill={selectedVoice === "en-US-ChristopherNeural" ? "#7DD3FC" : "currentColor"}
                    className={`shrink-0 ${
                      selectedVoice === "en-US-ChristopherNeural" ? "animate-pulse" : "opacity-30"
                    }`}
                    aria-hidden="true"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <span>Chris</span>
                </button>

                {onRepeatQuestion && (
                  <>
                    <span className="text-white/20 text-xs select-none font-light leading-none">·</span>
                    <button
                      type="button"
                      onClick={onRepeatQuestion}
                      title="Repetir pregunta en voz alta"
                      aria-label="Repeat interviewer question"
                      className="inline-flex items-center gap-1 text-[11px] font-sans text-white/40 hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 outline-none leading-none active:scale-95 ml-0.5"
                    >
                      <svg
                        className="w-3 h-3 text-[#A27FF3]"
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
          <p className="text-[clamp(18px,2.5vh,25px)] font-sans font-light text-[#f8f8f8] tracking-wide leading-relaxed select-text">
            {currentQuestionText}
          </p>
        </div>
      )}

      {/* Subtle clean divider line with edge fade */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0 my-[clamp(3px,0.6vh,6px)]" />

      {/* 2. Live Transcript Header */}
      <div className="w-full flex flex-col gap-[clamp(4px,0.7vh,7px)] shrink-0">
        <div className="flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center space-x-2.5 min-w-0">
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-white/40 shrink-0">
              LIVE TRANSCRIPT
            </span>
            <span className="text-[9.5px] font-medium text-purple-300/70 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20 tracking-normal shrink-0 hidden sm:inline-block">
              Editable antes de enviar
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-white/20 to-transparent inline-block shrink-0" />
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

        {/* Text Area: High-definition typography with comfortable reading contrast */}
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
          placeholder="Start speaking with the mic or type your answer here (Click green OK or press Enter to submit)..."
          style={{ outline: "none", boxShadow: "none" }}
          className="w-full border-0 border-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 shadow-none focus:shadow-none h-[clamp(80px,13vh,160px)] bg-transparent font-sans text-[clamp(15px,1.9vh,18.5px)] text-[#E2E8F0] font-normal leading-[1.65] tracking-[-0.012em] caret-[#A27FF3] resize-none placeholder:text-white/35 placeholder:font-light placeholder:tracking-normal overflow-y-auto no-scrollbar selection:bg-[#A27FF3]/30 selection:text-white transition-all duration-200"
        />
      </div>
    </div>
  );
};
