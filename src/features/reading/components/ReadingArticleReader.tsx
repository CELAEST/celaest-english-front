import React, { useState } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";

export interface ReadingArticleReaderProps {
  content: string;
  onLookupWord?: (word: string) => Promise<WordLookup>;
  onAddToMemory?: (wordData: WordLookup) => Promise<void>;
}

export const ReadingArticleReader: React.FC<ReadingArticleReaderProps> = ({
  content,
  onLookupWord,
  onAddToMemory,
}) => {
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [activeWordData, setActiveWordData] = useState<WordLookup | null>(null);
  const [isLoadingLookup, setIsLoadingLookup] = useState<boolean>(false);
  const [popoverCoords, setPopoverCoords] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Split content cleanly into words preserving natural punctuation attached to the token
  const words = content ? content.trim().split(/\s+/) : [];

  const handleWordClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    cleanWord: string,
    idx: number,
  ) => {
    e.stopPropagation();
    setActiveWordIndex(idx);
    setAddedSuccess(false);

    // Get exact bounding box of the clicked word
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = 265;
    const popoverHeight = 275;
    const verticalGap = 16;

    // Viewport-aware Smart Positioning: NEVER overlap the word
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let top: number;
    if (spaceBelow >= popoverHeight + verticalGap || spaceBelow >= spaceAbove) {
      // Place BELOW the word with guaranteed clearance
      top = rect.bottom + verticalGap;
    } else {
      // Place ABOVE the word with guaranteed clearance
      top = rect.top - popoverHeight - verticalGap;
    }

    // Safety clamp within viewport
    top = Math.max(20, Math.min(top, window.innerHeight - popoverHeight - 20));

    // Horizontal centering clamped inside window viewport with safety margin
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(24, Math.min(left, window.innerWidth - popoverWidth - 24));

    setPopoverCoords({ top, left });
    setShowTooltip(true);

    if (onLookupWord) {
      setIsLoadingLookup(true);
      try {
        const data = await onLookupWord(cleanWord);
        setActiveWordData(data);
      } catch (err) {
        console.warn("Failed lookup for word:", cleanWord, err);
        setActiveWordData({
          word: cleanWord,
          spanishTranslation: cleanWord,
          phonetic: `/'${cleanWord}'/`,
          partOfSpeech: "vocabulary",
          definition: `Contextual meaning for '${cleanWord}'.`,
          exampleSentence: `Using '${cleanWord}' in context enhances clarity and professional expression.`,
        });
      } finally {
        setIsLoadingLookup(false);
      }
    }
  };

  // Store a reference to utterance to prevent garbage collection bugs in some browsers
  const [currentUtterance, setCurrentUtterance] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWordData) return;

    setIsPlayingAudio(true);
    try {
      if (activeWordData.audioUrl) {
        const audio = new Audio(activeWordData.audioUrl);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          console.warn("Failed to load audio URL, falling back to TTS");
          speakFallback(activeWordData.word);
        };
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio playback prevented:", err);
            speakFallback(activeWordData.word);
          });
        }
      } else {
        speakFallback(activeWordData.word);
      }
    } catch (err) {
      console.error("Audio error:", err);
      speakFallback(activeWordData.word);
    }
  };

  const speakFallback = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;

      // Load voices to ensure we get a good English one if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith("en-") && v.name.includes("Google"),
      );
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentUtterance(null);
      };
      utterance.onerror = (e) => {
        console.error("TTS Error:", e);
        setIsPlayingAudio(false);
        setCurrentUtterance(null);
      };

      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 800);
    }
  };

  const handleSaveToMemory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeWordData || addedSuccess) return;
    setIsAdding(true);
    try {
      if (onAddToMemory) {
        await onAddToMemory(activeWordData);
      }
      setAddedSuccess(true);
    } catch (err) {
      console.warn("Failed to save word to Memory Bank", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full max-w-[620px] flex-1 min-h-0 flex flex-col justify-start items-start text-left text-[#b5b6be] font-sans text-base sm:text-lg lg:text-[18px] font-light leading-relaxed sm:leading-[1.75] select-text overflow-visible relative transition-all pt-1 sm:pt-2 pb-4">
      <div className="tracking-wide text-[#b5b6be] leading-relaxed sm:leading-[1.75] animate-[fadeSlideUp_0.4s_ease-out_both] relative z-10 text-left w-full pl-0 overflow-visible">
        {words.map((rawWord, idx) => {
          const cleanWord = rawWord
            .toLowerCase()
            .replace(/[^a-z'-]/g, "")
            .replace(/^-+|-+$/g, "");
          const isSelected = activeWordIndex === idx && showTooltip;

          return (
            <span
              key={idx}
              className="inline-block overflow-visible mr-1.5 my-0.5"
            >
              <button
                onClick={(e) => handleWordClick(e, cleanWord, idx)}
                className={`px-1 py-0.5 rounded transition-all duration-200 cursor-pointer focus:outline-none font-normal inline-flex items-center border ${
                  isSelected
                    ? "bg-[#7048E8]/25 border-[#A27FF3] text-white shadow-[0_0_16px_rgba(162,127,243,0.5)] scale-105"
                    : "border-transparent text-[#b5b6be] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.1]"
                }`}
              >
                {rawWord}
              </button>
            </span>
          );
        })}
      </div>

      {/* EXACT BESPOKE VOCABULARY MODAL (Aligned with Perfectly Centered Speaker Badge) */}
      {showTooltip && (
        <>
          {/* Backdrop click dismiss */}
          <div
            className="fixed inset-0 z-[9998] bg-transparent"
            onClick={() => setShowTooltip(false)}
          />

          {/* Ultra-Premium Glassmorphic Card Container with Generous Left Room */}
          <div
            style={{
              top: `${popoverCoords.top}px`,
              left: `${popoverCoords.left}px`,
            }}
            className="fixed z-[9999] w-[255px] sm:w-[270px] pl-7 pr-5 pt-4 pb-4 rounded-[24px] bg-[#0c0c1c]/65 backdrop-blur-2xl border border-white/[0.04] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(162,127,243,0.06),inset_0_1px_0_rgba(255,255,255,0.05)] text-left flex flex-col select-none animate-[fadeIn_0.18s_ease-out_both] overflow-visible"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Ultra-Premium Ambient Lights (Inner Glow) */}
            <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#A27FF3] opacity-[0.12] blur-[40px]" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#bd9ad4] opacity-[0.08] blur-[30px]" />
            </div>

            {/* Prominent Left Speaker Squircle Badge: Background with NO border */}
            <button
              onClick={handlePlayAudio}
              title="Listen to native pronunciation"
              className={`absolute top-[20px] -left-[18px] w-11 h-11 rounded-2xl bg-[#111224] flex items-center justify-center text-[#c4b5fd] hover:text-white hover:bg-[#1a1b32] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_6px_16px_rgba(0,0,0,0.5)] z-20 ${
                isPlayingAudio
                  ? "scale-105 text-white shadow-[0_0_14px_rgba(162,127,243,0.5)]"
                  : ""
              }`}
            >
              <svg
                className={`w-[26px] h-[26px] transition-transform duration-200 ${isPlayingAudio ? "scale-110" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>

            {isLoadingLookup ? (
              <div className="flex items-center justify-center py-8 space-x-2 text-[#A27FF3] text-xs">
                <span className="animate-spin text-sm">✦</span>
                <span className="font-light tracking-wide text-white/70">
                  Translating...
                </span>
              </div>
            ) : activeWordData ? (
              <>
                {/* Word Title & Phonetic Shifted Right for Space */}
                <div className="flex flex-col pl-3">
                  <h3 className="text-[23px] font-bold text-white tracking-tight leading-none mt-0.5">
                    {activeWordData.word}
                  </h3>

                  {/* Phonetic in Italic Monospace */}
                  <span className="text-[12px] text-[#7b7c93] font-mono italic mt-1 block">
                    {activeWordData.phonetic || `/'${activeWordData.word}'/`}
                  </span>
                </div>

                {/* Part of Speech */}
                <span className="text-[11px] text-[#525368] font-normal mt-2.5 pl-3 block">
                  {activeWordData.partOfSpeech || "noun"}
                </span>

                {/* Vocablo Translation */}
                <span className="text-[12px] font-medium text-[#b096dd] mt-0.5 pl-3 block">
                  vocablo:{" "}
                  {activeWordData.spanishTranslation || activeWordData.word}
                </span>

                {/* Definition / Explanation Note */}
                {activeWordData.definition && (
                  <p className="text-[11.5px] text-[#7e8096] font-normal leading-[1.5] mt-2 pl-3 block">
                    {activeWordData.definition}
                  </p>
                )}

                {/* Divider Line */}
                <div className="w-full h-px bg-[#141528] my-3.5" />

                {/* Example Sentence in Quotes (Italic) */}
                <p className="text-[11.5px] italic text-[#7e8096] font-normal leading-[1.5] block mb-3.5 pl-3">
                  "
                  {activeWordData.exampleSentence ||
                    `Using '${activeWordData.word}' in context enhances clarity and professional expression.`}
                  "
                </p>

                {/* Bottom Action: + Add to Memory */}
                <div className="flex items-center justify-start pt-0.5 pl-3">
                  <button
                    onClick={handleSaveToMemory}
                    disabled={isAdding || addedSuccess}
                    className={`text-[12px] font-medium tracking-wide transition-all flex items-center ${
                      addedSuccess
                        ? "text-[#4ade80]"
                        : "text-[#b096dd] hover:text-white cursor-pointer"
                    }`}
                  >
                    <span>
                      {addedSuccess
                        ? "✓ Saved to Memory"
                        : isAdding
                          ? "Saving..."
                          : "+ Add to Memory"}
                    </span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};
