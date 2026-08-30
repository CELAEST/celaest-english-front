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
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A27FF3]/70";

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
      className="w-full flex-1 flex flex-col bg-[#05060c] border border-[#111220] hover:border-[#1a1a35] transition-colors duration-300 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-[fadeSlideUp_0.5s_ease-out_0.15s_both]"
      onKeyDown={handleKeyDown}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-[#111220] pb-4 mb-4 select-none shrink-0">
        {/* Left: New task · Text size · Word goal */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#8a8a9e] min-w-0">
          {onNewTask && (
            <button
              type="button"
              onClick={onNewTask}
              aria-label="Show a different writing task"
              className={`flex items-center gap-1.5 text-sm font-medium hover:text-[#f8f8f8] transition-colors ${FOCUS_RING}`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
              <span className="hidden sm:inline">New task</span>
            </button>
          )}

          {onNewTask && <span className="h-4 w-px bg-[#111220]" aria-hidden="true" />}

          <button
            type="button"
            onClick={cycleFontSize}
            aria-label={`Text size: ${FONT_SIZES[fontSizeIndex].label}. Activate to change`}
            className={`text-sm font-medium hover:text-[#f8f8f8] transition-colors ${FOCUS_RING}`}
          >
            Aa
          </button>

          <span className="h-4 w-px bg-[#111220]" aria-hidden="true" />

          <div
            id="writing-word-goal"
            role="status"
            aria-live="polite"
            className={`flex items-center gap-1.5 text-xs tabular-nums transition-colors ${
              overRange ? "text-[#d8667a]" : inRange ? "text-[#55c9a4]" : "text-[#8a8a9e]"
            }`}
          >
            <span className="font-medium">{wordCount}</span>
            <span className="text-[#8a8a9e]/60">
              / {minWords}–{maxWords} words
            </span>
          </div>
        </div>

        {/* Right: Clear · Undo · Redo */}
        <div className="flex items-center gap-3 sm:gap-4 text-[#8a8a9e] shrink-0">
          <button
            type="button"
            onClick={handleClear}
            aria-label={confirmingClear ? "Confirm: clear all text" : "Clear all text"}
            className={`text-xs font-light transition-colors px-1 ${
              confirmingClear ? "text-[#d8667a]" : "hover:text-[#f8f8f8]"
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
            className={`hover:text-[#f8f8f8] transition-colors p-0.5 disabled:opacity-40 disabled:pointer-events-none ${FOCUS_RING}`}
          >
            <svg
              className="w-4 h-4"
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
            className={`hover:text-[#f8f8f8] transition-colors p-0.5 disabled:opacity-40 disabled:pointer-events-none ${FOCUS_RING}`}
          >
            <svg
              className="w-4 h-4"
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
      <div className="flex-1 w-full relative">
        <textarea
          value={content}
          onChange={handleTextChange}
          autoFocus
          aria-label="Writing editor"
          aria-describedby="writing-word-goal"
          lang="en"
          spellCheck={false}
          className={`w-full h-full min-h-[280px] sm:min-h-[340px] bg-transparent text-[#f8f8f8] font-sans font-light leading-relaxed resize-none focus:outline-none placeholder-[#8a8a9e]/40 no-scrollbar selection:bg-[#A27FF3]/30 ${FONT_SIZES[fontSizeIndex].className}`}
          placeholder="Start writing here..."
        />
      </div>
    </div>
  );
};
