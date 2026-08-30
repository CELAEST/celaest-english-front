import React, { useState } from "react";

export interface OnboardingChatInputProps {
  onSend: (message: string) => void;
  onPrev: () => void;
  placeholder?: string;
}

export const OnboardingChatInput: React.FC<OnboardingChatInputProps> = ({
  onSend,
  onPrev,
  placeholder = "Type your answer...",
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
    <div className="flex items-center space-x-4 w-full pt-2">
      {/* Back Button */}
      <button
        onClick={onPrev}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#13102B] border border-[#2A244D] text-[#A699CD] hover:text-white hover:border-[#4B3B82] transition-all shrink-0 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
        aria-label="Back"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      {/* Input Pill Form */}
      <form onSubmit={handleSubmit} className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-5 pr-12 py-3 sm:py-3.5 bg-[#0D0B1F]/90 border border-[#231E42] rounded-full text-slate-200 placeholder-[#555570] focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]/50 transition-all text-xs sm:text-sm font-light backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
        />

        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-[#6366F1] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white flex items-center justify-center transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer active:scale-95"
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
