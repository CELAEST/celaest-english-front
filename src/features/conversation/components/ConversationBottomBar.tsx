import React, { useState } from "react";

export interface ConversationBottomBarProps {
  isListening?: boolean;
  starHint?: string;
  onChangeQuestion?: () => void;
}

export const ConversationBottomBar: React.FC<ConversationBottomBarProps> = ({
  isListening = true,
  starHint = "Structure your answer with STAR: Situation, Task, Action, and measurable Result.",
  onChangeQuestion,
}) => {
  const [showTipsModal, setShowTipsModal] = useState(false);

  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-8 py-1.5 pb-3 select-none z-20 animate-[slideUp_0.4s_ease-out_both] relative shrink-0">
      {/* Bottom Left: STAR Method Tips Button */}
      <div className="relative">
        <button
          onClick={() => setShowTipsModal((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060713] border border-[#14152b] text-[#f8f8f8] hover:border-[#A27FF3]/60 hover:scale-105 active:scale-95 text-xs font-light transition-all duration-300 cursor-pointer shadow-lg group whitespace-nowrap shrink-0"
        >
          <svg
            className="w-3.5 h-3.5 text-[#A27FF3] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
            <path d="M9 21h6" />
          </svg>
          <span className="text-xs font-normal tracking-wide text-white/90 group-hover:text-white">
            STAR Method Tips
          </span>
        </button>

        {/* Tips Floating Popover */}
        {showTipsModal && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setShowTipsModal(false)}
            />
            <div className="absolute left-0 bottom-10 w-72 sm:w-80 bg-[#060713] border border-[#14152b] rounded-2xl p-4 shadow-2xl z-50 animate-[fadeSlideUp_0.25s_ease-out_both]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#A27FF3]">STAR Interview Strategy</span>
                <button
                  onClick={() => setShowTipsModal(false)}
                  className="text-neutral-400 hover:text-white text-xs p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-white/90 font-light leading-relaxed mb-3">
                {starHint}
              </p>
              <div className="space-y-1.5 text-[11px] text-neutral-400">
                <p><strong className="text-[#A27FF3]">S</strong>ituation: Set the scene in 1 sentence.</p>
                <p><strong className="text-[#A27FF3]">T</strong>ask: What was the goal or obstacle?</p>
                <p><strong className="text-[#A27FF3]">A</strong>ction: What specific action did YOU take?</p>
                <p><strong className="text-[#A27FF3]">R</strong>esult: What was the measurable positive outcome?</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Right: Change Question Button when paused or idle */}
      {!isListening && onChangeQuestion && (
        <button
          onClick={onChangeQuestion}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#060713] border border-[#14152b] text-[#f8f8f8] hover:border-[#A27FF3]/60 hover:scale-105 active:scale-95 text-xs font-light transition-all duration-300 cursor-pointer shadow-lg group animate-[fadeIn_0.3s_ease-out_both]"
        >
          <svg
            className="w-3.5 h-3.5 text-[#A27FF3] group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          <span className="text-xs font-normal text-white/90 group-hover:text-white">Change question</span>
        </button>
      )}
    </div>
  );
};
