import React, { useEffect, useRef, useState } from "react";

export interface WritingEditorProps {
  initialContent?: string;
  onChangeContent?: (text: string) => void;
  minWords?: number;
  maxWords?: number;
  onNewTask?: () => void;
}

const FONT_SIZES = [
  { label: "Small", className: "text-[15px] sm:text-base" },
  { label: "Medium", className: "text-base sm:text-lg" },
  { label: "Large", className: "text-lg sm:text-xl" },
] as const;

const FOCUS_RING =
  "rounded-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30";

const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

export const WritingEditor: React.FC<WritingEditorProps> = ({
  initialContent = "",
  onChangeContent,
  minWords = 80,
  maxWords = 180,
  onNewTask,
}) => {
  const [content, setContent] = useState(initialContent);
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(1);
  const [confirmingClear, setConfirmingClear] = useState<boolean>(false);

  // Lightweight undo/redo history (coalesces rapid keystrokes into snapshots)
  const historyRef = useRef<string[]>([initialContent]);
  const historyIndexRef = useRef<number>(0);
  const lastEditRef = useRef<number>(0);
  const clearTimerRef = useRef<number | null>(null);

  // Navigation availability mirrored in state so render never reads refs
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    };
  }, []);

  const wordCount = countWords(content);
  const inRange = wordCount >= minWords && wordCount <= maxWords;
  const overRange = wordCount > maxWords;

  const syncHistoryNavState = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const commitChange = (next: string) => {
    setContent(next);
    if (onChangeContent) onChangeContent(next);
  };

  const pushHistory = (value: string) => {
    const history = historyRef.current;
    const now = Date.now();
    if (history[historyIndexRef.current] === value) return;

    if (now - lastEditRef.current < 400 && historyIndexRef.current > 0) {
      history[historyIndexRef.current] = value;
    } else {
      history.splice(historyIndexRef.current + 1);
      history.push(value);
      if (history.length > 100) history.shift();
      historyIndexRef.current = history.length - 1;
    }
    lastEditRef.current = now;
    syncHistoryNavState();
  };

  const undo = () => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current -= 1;
    commitChange(historyRef.current[historyIndexRef.current]);
    syncHistoryNavState();
  };

  const redo = () => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current += 1;
    commitChange(historyRef.current[historyIndexRef.current]);
    syncHistoryNavState();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    pushHistory(e.target.value);
    commitChange(e.target.value);
  };

  const handleClear = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      clearTimerRef.current = window.setTimeout(() => setConfirmingClear(false), 2500);
      return;
    }
    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    setConfirmingClear(false);
    pushHistory("");
    commitChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const key = e.key.toLowerCase();
    if (key === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((key === "z" && e.shiftKey) || key === "y") {
      e.preventDefault();
      redo();
    }
  };

  const cycleFontSize = () => {
    setFontSizeIndex((prev) => (prev + 1) % FONT_SIZES.length);
  };

  return (
    <div
      className="relative w-full flex-1 flex flex-col bg-[#04040A] border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 rounded-3xl p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden animate-[fadeSlideUp_0.5s_ease-out_0.15s_both]"
      onKeyDown={handleKeyDown}
    >
      {/* Top Specular Hairline */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Toolbar with crisp, well-defined separator line */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.12] pb-4 mb-4 select-none shrink-0 z-10">
        {/* Left: New task · Text size · Word goal */}
        <div className="flex items-center gap-3 sm:gap-4 text-white/50 min-w-0">
          {onNewTask && (
            <button
              type="button"
              onClick={onNewTask}
              aria-label="Show a different writing task"
              className={`flex items-center gap-2 text-xs font-mono transition-all duration-300 cursor-pointer group active:scale-95 ${FOCUS_RING}`}
            >
              <svg
                className="w-4 h-4 text-[#A27FF3] group-hover:text-[#38BDF8] group-hover:rotate-180 transition-all duration-500 shrink-0 drop-shadow-[0_0_8px_rgba(162,127,243,0.7)]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
              <span className="font-medium tracking-wider bg-gradient-to-r from-[#A27FF3] via-[#c084fc] to-[#38BDF8] bg-clip-text text-transparent group-hover:brightness-125 transition-all duration-300 drop-shadow-[0_0_12px_rgba(162,127,243,0.3)]">
                New task
              </span>
            </button>
          )}

          {onNewTask && <span className="h-4 w-px bg-white/[0.12]" aria-hidden="true" />}

          <button
            type="button"
            onClick={cycleFontSize}
            aria-label={`Text size: ${FONT_SIZES[fontSizeIndex].label}. Activate to change`}
            className={`px-1.5 py-0.5 rounded text-xs font-mono text-white/60 hover:text-white transition-colors ${FOCUS_RING}`}
          >
            Aa
          </button>

          <span className="h-4 w-px bg-white/[0.12]" aria-hidden="true" />

          <div
            id="writing-word-goal"
            role="status"
            aria-live="polite"
            className={`flex items-center gap-1.5 text-xs font-mono tabular-nums transition-colors ${
              overRange ? "text-rose-400" : inRange ? "text-emerald-400" : "text-white/40"
            }`}
          >
            <span className="font-light">{wordCount}</span>
            <span className="text-white/25">
              / {minWords}–{maxWords} words
            </span>
          </div>
        </div>

        {/* Right: Clear · Undo · Redo */}
        <div className="flex items-center gap-2 sm:gap-3 text-white/40 shrink-0">
          <button
            type="button"
            onClick={handleClear}
            aria-label={confirmingClear ? "Confirm: clear all text" : "Clear all text"}
            className={`text-xs font-mono transition-colors px-2 py-1 rounded-lg ${
              confirmingClear ? "text-rose-400 bg-rose-500/10" : "hover:text-white hover:bg-white/[0.03]"
            } ${FOCUS_RING}`}
          >
            {confirmingClear ? "Sure?" : "Clear"}
          </button>

          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            aria-label="Undo"
            aria-keyshortcuts="Control+Z"
            className={`hover:text-white hover:bg-white/[0.03] transition-colors p-1.5 rounded-lg disabled:opacity-20 disabled:pointer-events-none ${FOCUS_RING}`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 14L4 9l5-5" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
            </svg>
          </button>

          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            aria-label="Redo"
            aria-keyshortcuts="Control+Shift+Z"
            className={`hover:text-white hover:bg-white/[0.03] transition-colors p-1.5 rounded-lg disabled:opacity-20 disabled:pointer-events-none ${FOCUS_RING}`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 14l5-5-5-5" />
              <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
            </svg>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full relative z-10">
        <textarea
          value={content}
          onChange={handleTextChange}
          autoFocus
          aria-label="Writing editor"
          aria-describedby="writing-word-goal"
          lang="en"
          spellCheck={false}
          className={`w-full h-full min-h-[280px] sm:min-h-[340px] bg-transparent text-[#f8f8f8] font-sans font-light leading-relaxed resize-none focus:outline-none placeholder-white/20 no-scrollbar selection:bg-white/20 ${FONT_SIZES[fontSizeIndex].className}`}
          placeholder="Start writing here..."
        />
      </div>
    </div>
  );
};
