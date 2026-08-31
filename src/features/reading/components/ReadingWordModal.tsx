import React, { useEffect, useRef, useState, useCallback } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { logger } from "../../../shared/utils/logger";
import { VocabloTranslateIcon, MemoryBankSaveIcon } from "./ReadingBespokeIcons";

export interface ReadingWordModalProps {
  wordData: WordLookup | null;
  isLoading: boolean;
  coords: { top: number; left: number };
  onClose: () => void;
  onAddToMemory?: ((wordData: WordLookup) => Promise<void>) | undefined;
}

export const ReadingWordModal: React.FC<ReadingWordModalProps> = React.memo(
  ({ wordData, isLoading, coords, onClose, onAddToMemory }) => {
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 3D Spatial Tilt Physics & Dynamic Specular Sheen (matching card movement)
    const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      setTilt({
        x: ((x - centerX) / centerX) * 5,
        y: ((y - centerY) / centerY) * -5,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100,
        glareOpacity: 0.12,
      });
    }, []);

    const handleMouseLeave = useCallback(() => {
      setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, glareOpacity: 0 });
    }, []);

    // Keyboard accessibility: Dismiss on Escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    }, [onClose]);

    const speakFallback = (text: string) => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.85;

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
          currentUtteranceRef.current = null;
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          currentUtteranceRef.current = null;
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 800);
      }
    };

    const handlePlayAudio = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!wordData) return;

      setIsPlayingAudio(true);
      try {
        if (wordData.audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          const audio = new Audio(wordData.audioUrl);
          audioRef.current = audio;
          audio.onended = () => setIsPlayingAudio(false);
          audio.onerror = () => {
            speakFallback(wordData.word);
          };
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              speakFallback(wordData.word);
            });
          }
        } else {
          speakFallback(wordData.word);
        }
      } catch {
        speakFallback(wordData.word);
      }
    };

    const handleSaveToMemory = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!wordData || addedSuccess) return;
      setIsAdding(true);
      try {
        if (onAddToMemory) {
          await onAddToMemory(wordData);
        }
        setAddedSuccess(true);
      } catch (err) {
        logger.warn("Failed to save word to Memory Bank", err);
      } finally {
        setIsAdding(false);
      }
    };

    return (
      <>
        {/* Backdrop click dismiss */}
        <div
          className="fixed inset-0 z-[9998] bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Spatial 3D Flashcard Container Style with Subtle White Backlight Glow */}
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="word-modal-title"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
          }}
          className="fixed z-[9999] w-[275px] sm:w-[295px] pl-6 pr-5 pt-5 pb-5 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_32px_80px_rgba(0,0,0,0.95)] text-left flex flex-col select-none animate-[fadeIn_0.18s_ease-out_both] overflow-visible transition-transform duration-150 ease-out group"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ultra-Subtle Monochromatic White Backlight Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-3 sm:-inset-4 rounded-[36px] transition-opacity duration-300 opacity-40 group-hover:opacity-60 z-[-1]"
            style={{
              background:
                "radial-gradient(75% 65% at 50% 50%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02) 50%, transparent 80%)",
              filter: "blur(30px)",
              transform: "translate3d(0, 0, -10px)",
            }}
          />

          {/* Dynamic Specular Sheen */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(350px circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, ${tilt.glareOpacity}), transparent 70%)`,
            }}
          />

          {/* Top Specular Hairline */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />

          {/* Left Speaker Squircle Badge */}
          {!isLoading && wordData && (
            <button
              type="button"
              onClick={handlePlayAudio}
              aria-label={`Listen to pronunciation of ${wordData.word}`}
              className={`absolute top-[20px] -left-[18px] w-11 h-11 rounded-2xl bg-[#04040A] border border-white/[0.08] hover:border-white/20 flex items-center justify-center text-[#c4b5fd] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] z-40 animate-[scaleIn_0.2s_ease-out_both] ${
                isPlayingAudio
                  ? "scale-105 text-white border-[#A27FF3]/60 shadow-[0_0_16px_rgba(162,127,243,0.4)]"
                  : ""
              }`}
            >
              <svg
                className={`w-[22px] h-[22px] transition-transform duration-200 ${isPlayingAudio ? "scale-110" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          )}

          {isLoading ? (
            /* Shimmer Skeleton */
            <div className="flex flex-col py-1.5 space-y-3 relative z-10 animate-pulse">
              <div className="flex flex-col space-y-1.5 pl-1">
                <div className="h-6 w-32 rounded-lg bg-white/[0.08]" />
                <div className="h-3 w-20 rounded bg-white/[0.04]" />
              </div>
              <div className="h-4 w-40 rounded bg-white/[0.06] pl-1" />
              <div className="w-full h-px bg-white/[0.04] my-1" />
              <div className="flex flex-col space-y-1.5 pl-1">
                <div className="h-3 w-full rounded bg-white/[0.04]" />
                <div className="h-3 w-4/5 rounded bg-white/[0.03]" />
              </div>
              <div className="h-3.5 w-24 rounded bg-white/[0.05] mt-1 pl-1" />
            </div>
          ) : wordData ? (
            <div className="relative z-10 flex flex-col">
              {/* Word Title & Phonetic */}
              <div className="flex flex-col pl-2">
                <h3
                  id="word-modal-title"
                  className="text-[20px] sm:text-[22px] font-bold text-white tracking-tight leading-none mt-0.5"
                >
                  {wordData.word}
                </h3>

                <span className="text-[11.5px] text-[#8a8b9e] font-mono italic mt-1">
                  {wordData.phonetic?.replace(/^\/'/, "/").split(",")[0] || `/${wordData.word}/`}
                </span>
              </div>

              {/* Part of Speech */}
              <span
                className={`text-[10px] uppercase tracking-widest font-mono font-semibold mt-2 pl-2 ${
                  wordData.partOfSpeech?.toLowerCase().includes("phrasal") || wordData.word.includes(" ")
                    ? "text-[#A27FF3]"
                    : "text-[#6b6c82]"
                }`}
              >
                {wordData.partOfSpeech?.toLowerCase().includes("phrasal") || wordData.word.includes(" ")
                  ? "phrasal verb"
                  : wordData.partOfSpeech || "vocabulary"}
              </span>

              {/* Vocablo Translation */}
              <div className="flex items-center space-x-1.5 mt-2 pl-2">
                <VocabloTranslateIcon />
                <span className="text-[12.5px] font-medium text-[#c4b5fd]">
                  {wordData.spanishTranslation || wordData.word}
                </span>
              </div>

              {/* Definition / Explanation Note */}
              {wordData.definition && (
                <p className="text-[11.5px] text-[#8e90a5] font-light leading-[1.5] mt-2 pl-2">
                  {wordData.definition}
                </p>
              )}

              {/* Divider Line */}
              <div className="w-full h-px bg-white/[0.05] my-3" />

              {/* Example Sentence */}
              {wordData.exampleSentence && (
                <p className="text-[11.5px] italic text-[#8e90a5] font-light leading-[1.5] mb-3 pl-2">
                  "{wordData.exampleSentence.replace(/^["']+|["']+$/g, "").trim()}"
                </p>
              )}

              {/* Bottom Action: + Add to Memory */}
              <div className="flex items-center justify-start pt-0.5 pl-2">
                <button
                  type="button"
                  onClick={handleSaveToMemory}
                  disabled={isAdding || addedSuccess}
                  aria-label={addedSuccess ? "Word saved to Memory" : "Add word to Memory"}
                  className={`text-[12px] font-medium tracking-wide transition-all flex items-center space-x-1.5 group ${
                    addedSuccess
                      ? "text-[#4ade80]"
                      : "text-[#A27FF3] hover:text-white cursor-pointer"
                  }`}
                >
                  {!addedSuccess && (
                    <MemoryBankSaveIcon className="w-3.5 h-3.5 text-[#A27FF3] group-hover:scale-110 transition-transform" />
                  )}
                  <span>
                    {addedSuccess ? "✓ Saved to Memory" : isAdding ? "Saving..." : "Add to Memory"}
                  </span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  },
);

ReadingWordModal.displayName = "ReadingWordModal";
