import React, { useRef, useEffect } from "react";

export interface ConversationPromptAreaProps {
  currentQuestionText?: string;
  userTranscript?: string;
  onTranscriptChange?: (text: string) => void;
  onSubmitAnswer?: (text: string) => void;
}

export const ConversationPromptArea: React.FC<ConversationPromptAreaProps> = ({
  currentQuestionText = "",
  userTranscript = "",
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
          <div className="flex items-center space-x-2.5">
            <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-[#8264C3]">
              QUESTION
            </span>
            <span className="h-px w-8 bg-gradient-to-r from-[#8264C3]/50 to-transparent inline-block" />
          </div>
          <p className="text-[clamp(18px,2.5vh,25px)] font-sans font-light text-[#f8f8f8] tracking-wide leading-relaxed select-text">
            {currentQuestionText}
          </p>
        </div>
      )}

      {/* Subtle clean divider line with edge fade */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent shrink-0 my-[clamp(4px,0.8vh,8px)]" />

      {/* 2. Live Transcript Response Stream */}
      <div className="w-full flex flex-col gap-[clamp(4px,0.7vh,7px)] shrink-0">
        <div className="flex items-center space-x-2.5 shrink-0 select-none">
          <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.22em] uppercase font-sans text-white/40">
            LIVE TRANSCRIPT
          </span>
          <span className="h-px w-8 bg-gradient-to-r from-white/20 to-transparent inline-block" />
        </div>

        {/* Text Area: High-definition typography with comfortable reading contrast */}
        <textarea
          ref={textareaRef}
          value={userTranscript}
          spellCheck={false}
          autoCapitalize="sentences"
          autoComplete="off"
          autoCorrect="off"
          onChange={(e) => onTranscriptChange && onTranscriptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (userTranscript.trim() && onSubmitAnswer) {
                onSubmitAnswer(userTranscript);
              }
            }
          }}
          placeholder="Start speaking or type your answer here (Press Enter to submit)..."
          style={{ outline: "none", boxShadow: "none" }}
          className="w-full border-0 border-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 ring-0 shadow-none focus:shadow-none h-[clamp(85px,14vh,180px)] bg-transparent font-sans text-[clamp(15px,1.9vh,18.5px)] text-[#E2E8F0] font-normal leading-[1.65] tracking-[-0.012em] caret-[#A27FF3] resize-none placeholder:text-white/35 placeholder:font-light placeholder:tracking-normal overflow-y-auto no-scrollbar selection:bg-[#A27FF3]/30 selection:text-white transition-all duration-200"
        />
      </div>
    </div>
  );
};
