import React, { useState } from 'react';

export interface WritingEditorProps {
  initialContent?: string;
  onChangeContent?: (text: string) => void;
}

const DEFAULT_EMAIL_TEXT = `Dear Mr. Thompson,

I hope this email finds you well.

I wanted to share a quick update on the marketing strategy we discussed last week.

We've completed the initial research and identified three key opportunities that align with your goals.

I'd be happy to schedule a call to walk you through the next steps.

Best regards,
Esteban`;

export const WritingEditor: React.FC<WritingEditorProps> = ({
  initialContent = DEFAULT_EMAIL_TEXT,
  onChangeContent,
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeFormats, setActiveFormats] = useState<{ [key: string]: boolean }>({
    bold: false,
    italic: false,
    underline: true,
  });

  const toggleFormat = (key: string) => {
    setActiveFormats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (onChangeContent) onChangeContent(e.target.value);
  };

  const handleClear = () => {
    setContent('');
    if (onChangeContent) onChangeContent('');
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-[fadeSlideUp_0.5s_ease-out_0.15s_both]">
      {/* Rich Text Toolbar */}
      <div className="flex items-center justify-between border-b border-[#111220] pb-4 mb-4 select-none shrink-0">
        {/* Left Formatting Tools */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-[#8a8a9e]">
          <button className="text-sm font-medium hover:text-[#f8f8f8] transition-colors">Aa</button>
          
          <button 
            onClick={() => toggleFormat('bold')}
            className={`text-sm font-bold transition-colors ${activeFormats.bold ? 'text-[#f8f8f8]' : 'hover:text-[#f8f8f8]'}`}
          >
            B
          </button>
          
          <button 
            onClick={() => toggleFormat('italic')}
            className={`text-sm italic transition-colors ${activeFormats.italic ? 'text-[#f8f8f8]' : 'hover:text-[#f8f8f8]'}`}
          >
            I
          </button>
          
          <button 
            onClick={() => toggleFormat('underline')}
            className={`text-sm underline underline-offset-2 transition-colors ${activeFormats.underline ? 'text-[#f8f8f8]' : 'hover:text-[#f8f8f8]'}`}
          >
            U
          </button>

          {/* Bulleted List Icon */}
          <button className="hover:text-[#f8f8f8] transition-colors p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          {/* Numbered List Icon */}
          <button className="hover:text-[#f8f8f8] transition-colors p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <path d="M4 6h1v4" />
              <path d="M4 10h2" />
            </svg>
          </button>

          {/* Link Icon */}
          <button className="hover:text-[#f8f8f8] transition-colors p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>
        </div>

        {/* Right Actions: Clear, Undo, Redo */}
        <div className="flex items-center space-x-4 sm:space-x-5 text-[#8a8a9e]">
          <button 
            onClick={handleClear}
            className="text-xs font-light hover:text-[#f8f8f8] transition-colors"
          >
            Clear
          </button>

          <button className="hover:text-[#f8f8f8] transition-colors p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
            </svg>
          </button>

          <button className="hover:text-[#f8f8f8] transition-colors p-0.5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 14l5-5-5-5" />
              <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Body Text Area */}
      <div className="flex-1 w-full relative">
        <textarea
          value={content}
          onChange={handleTextChange}
          spellCheck={false}
          className="w-full h-full min-h-[280px] sm:min-h-[340px] bg-transparent text-[#f8f8f8] font-sans text-base sm:text-lg font-light leading-relaxed resize-none focus:outline-none placeholder-[#8a8a9e]/40 no-scrollbar selection:bg-[#A27FF3]/30"
          placeholder="Start writing here..."
        />
      </div>
    </div>
  );
};
