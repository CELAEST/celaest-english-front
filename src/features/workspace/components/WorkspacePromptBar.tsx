import React, { useState } from 'react';

export interface WorkspacePromptBarProps {
  onSubmitPrompt?: ((prompt: string) => void) | undefined;
}

export const WorkspacePromptBar: React.FC<WorkspacePromptBarProps> = ({ onSubmitPrompt }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onSubmitPrompt) {
      onSubmitPrompt(inputValue.trim());
      setInputValue('');
    }
  };

  const topicSuggestions = [
    {
      id: 'weekend',
      label: 'Your weekend',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#8E90A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
        </svg>
      ),
    },
    {
      id: 'challenge',
      label: 'A challenge you faced',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#8E90A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.779V4.5l-3.114.778a9 9 0 01-6.086-.71l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
        </svg>
      ),
    },
    {
      id: 'learned',
      label: 'Something you learned',
      icon: (
        <svg className="w-3.5 h-3.5 text-[#8E90A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.516 0c.85.493 1.508 1.333 1.508 2.316V18" />
        </svg>
      ),
    },
    {
      id: 'mind',
      label: 'Anything on your mind',
      icon: <span className="text-xs font-mono text-[#8E90A6] tracking-tighter">···</span>,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 select-none pt-2 pb-1 z-20">
      {/* Question Header */}
      <div className="flex flex-col items-center text-center space-y-1.5 animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '300ms' }}>
        <span className="text-[10px] font-semibold tracking-[0.25em] text-[#A78BFA] uppercase">
          I’M LISTENING.
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white font-normal tracking-tight">
          What happened at work today?
        </h2>
      </div>

      {/* Clean Glassmorphic Pill Prompt Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex items-center gap-3 pl-2 pr-2.5 py-1.5 rounded-full bg-[#090714]/80 backdrop-blur-xl border border-[#2A1D4E]/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] shadow-[0_0_20px_rgba(112,72,232,0.12)] focus-within:border-[#8B5CF6]/80 focus-within:shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-300 relative group animate-[fadeSlideUp_0.5s_ease-out_both]"
        style={{ animationDelay: '420ms' }}
      >
        {/* Left Voice Capsule Wrapper */}
        <div className="relative flex items-center justify-center p-0.5 rounded-full bg-[#110C27] border border-[#352563]/60 shadow-[0_0_12px_rgba(139,92,246,0.2)] shrink-0">
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            aria-label="Voice input"
            className="relative w-10 h-10 rounded-full bg-[#0E0A22] flex items-center justify-center cursor-pointer shrink-0 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            {/* Slender Glowing Ring SVG */}
            <svg
              className={`w-10 h-10 transition-transform duration-700 ${
                isListening ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
              viewBox="0 0 40 40"
              fill="none"
            >
              <defs>
                <linearGradient id="cleanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DDD6FE" />
                  <stop offset="50%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#7048E8" />
                </linearGradient>
              </defs>

              {/* Slender Ring */}
              <circle cx="20" cy="20" r="16.5" stroke="url(#cleanGlow)" strokeWidth="1.8" />
              {/* Top Specular Arc */}
              <path d="M14 4.8 C 17 4.2, 23 4.2, 26 4.8" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
            </svg>

            {/* 5 Waveform Bars */}
            <div className="absolute inset-0 flex items-center justify-center gap-[2.5px] z-10">
              {/* Bar 1: Left Dot */}
              <span
                className={`w-0.5 rounded-full bg-[#C4B5FD] transition-all ${
                  isListening ? 'h-2 animate-wave-1' : 'h-1'
                }`}
              />
              {/* Bar 2: Left Medium */}
              <span
                className={`w-0.5 rounded-full bg-[#A78BFA] transition-all ${
                  isListening ? 'h-3 animate-wave-2' : 'h-2.5'
                }`}
              />
              {/* Bar 3: Prominent Tall Center Bar */}
              <span
                className={`w-0.5 rounded-full bg-gradient-to-b from-[#DDD6FE] to-[#7048E8] transition-all ${
                  isListening ? 'h-5 animate-wave-3' : 'h-5'
                }`}
              />
              {/* Bar 4: Right Medium */}
              <span
                className={`w-0.5 rounded-full bg-[#A78BFA] transition-all ${
                  isListening ? 'h-3 animate-wave-4' : 'h-2.5'
                }`}
              />
              {/* Bar 5: Right Dot */}
              <span
                className={`w-0.5 rounded-full bg-[#8B5CF6] transition-all ${
                  isListening ? 'h-2 animate-wave-5' : 'h-1'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Crisp Text Input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Speak or type your answer..."
          className="flex-1 bg-transparent text-sm text-white placeholder-[#7B7C98] outline-none font-light tracking-wide pl-0.5"
        />

        {/* Right Submit Button Circle */}
        <button
          type="submit"
          aria-label="Send prompt"
          className="w-9 h-9 rounded-full bg-[#120D2B] border border-[#7048E8]/60 text-white flex items-center justify-center hover:bg-[#7048E8]/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(112,72,232,0.35)]"
        >
          <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </form>

      {/* Quick Topic Chips */}
      <div className="flex flex-col items-center space-y-2.5 pt-0.5 w-full animate-[fadeSlideUp_0.5s_ease-out_both]" style={{ animationDelay: '520ms' }}>
        <span className="text-[9.5px] font-semibold tracking-[0.22em] text-[#8E90A6] uppercase">
          YOU CAN ALSO TALK ABOUT
        </span>

        <div className="flex flex-nowrap items-center justify-center gap-2.5 sm:gap-3.5 lg:gap-4 w-full px-2">
          {topicSuggestions.map((topic, i) => (
            <button
              key={topic.id}
              onClick={() => onSubmitPrompt && onSubmitPrompt(topic.label)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#080811] border border-[#141622] text-[11.5px] sm:text-xs text-[#8E90A6] hover:text-white hover:border-[#7048E8]/50 hover:bg-[#0D0E1A] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer font-light shrink-0 whitespace-nowrap group shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              style={{ animationDelay: `${550 + i * 60}ms` }}
            >
              <span className="flex items-center justify-center transition-colors group-hover:text-white">
                {topic.icon}
              </span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
