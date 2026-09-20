import React, { useEffect, useRef, useState, useCallback } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { ENV } from "../../../shared/constants/env";
import { logger } from "../../../shared/utils/logger";
import { VocabloTranslateIcon, MemoryBankSaveIcon } from "./ReadingBespokeIcons";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";

export interface ReadingWordModalProps {
  wordData: WordLookup | null;
  isLoading: boolean;
  coords: { top: number; left: number };
  onClose: () => void;
  onAddToMemory?: ((wordData: WordLookup) => Promise<void>) | undefined;
  onOpenRecoveryModal?: ((word: string, context?: string) => void) | undefined;
  onDirectTranslate?: ((word: string, context?: string) => Promise<string | null>) | undefined;
  isAlreadyInMemory?: boolean | undefined;
}

export const ReadingWordModal: React.FC<ReadingWordModalProps> = React.memo(
  ({
    wordData,
    isLoading,
    coords,
    onClose,
    onAddToMemory,
    onOpenRecoveryModal,
    onDirectTranslate,
    isAlreadyInMemory = false,
  }) => {
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [isTranslatingDirect, setIsTranslatingDirect] = useState(false);
    const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // 3D Spatial Tilt Physics & Dynamic Specular Sheen (Direct RAF DOM updates — Zero React Re-renders)
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    const rafIdRef = useRef<number | null>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((x - centerX) / centerX) * 5;
      const tiltY = ((y - centerY) / centerY) * -5;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        if (cardRef.current) {
          cardRef.current.style.transform = `perspective(1200px) rotateX(${tiltY}deg) rotateY(${tiltX}deg)`;
        }
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(350px circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12), transparent 70%)`;
        }
      });
    }, []);

    const handleMouseLeave = useCallback(() => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (cardRef.current) {
        cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
      }
      if (glareRef.current) {
        glareRef.current.style.background = "radial-gradient(350px circle at 50% 50%, rgba(255, 255, 255, 0), transparent 70%)";
      }
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
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      };
    }, [onClose]);

    // Reset addition and translation states whenever a different word is selected
    useEffect(() => {
      setAddedSuccess(false);
      setIsAdding(false);
      setIsTranslatingDirect(false);
    }, [wordData?.word]);

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
        if (audioRef.current) {
          audioRef.current.pause();
        }

        const audioUrl =
          wordData.audioUrl ||
          `${ENV.apiUrl}/tts/stream?text=${encodeURIComponent(wordData.word)}&voice=en-US-AriaNeural`;
        const audio = MobileAudioUnlocker.getSharedAudio() || new Audio();
        audio.src = audioUrl;
        audio.preload = "auto";
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlayingAudio(false);
          audioRef.current = null;
        };
        audio.onerror = () => {
          audioRef.current = null;
          speakFallback(wordData.word);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            audioRef.current = null;
            speakFallback(wordData.word);
          });
        }
      } catch {
        audioRef.current = null;
        speakFallback(wordData.word);
      }
    };

    const handleSaveToMemory = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!wordData || addedSuccess || isAlreadyInMemory) return;
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

    const hasValidTranslation = Boolean(
      wordData?.spanishTranslation &&
        wordData.spanishTranslation.trim() !== "" &&
        wordData.metadata?.translationSource !== "untranslated",
    );

    const handleTriggerDirectTranslate = useCallback(
      async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!wordData) return;

        if (onDirectTranslate) {
          setIsTranslatingDirect(true);
          try {
            const tr = await onDirectTranslate(wordData.word, wordData.exampleSentence);
            if (tr) {
              setIsTranslatingDirect(false);
              return;
            }
          } catch {
            // Fall through to open recovery modal if direct translation fails or no key
          } finally {
            setIsTranslatingDirect(false);
          }
        }

        if (onOpenRecoveryModal) {
          onOpenRecoveryModal(wordData.word, wordData.exampleSentence);
        }
      },
      [wordData, onDirectTranslate, onOpenRecoveryModal],
    );

    return (
      <>
        {/* Backdrop click dismiss — cursor-pointer and touch handler required for iOS Safari tap dispatch */}
        <div
          role="button"
          tabIndex={-1}
          className="fixed inset-0 z-[9998] bg-transparent cursor-pointer select-none"
          onClick={onClose}
          onTouchEnd={(e) => {
            e.preventDefault();
            onClose();
          }}
          aria-label="Cerrar modal"
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
          }}
          className="fixed z-[9999] w-[275px] sm:w-[295px] pl-5 pr-4 pt-4 pb-4 sm:pl-6 sm:pr-5 sm:pt-5 sm:pb-5 rounded-3xl bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] shadow-[0_32px_80px_rgba(0,0,0,0.95)] text-left flex flex-col select-none animate-[fadeIn_0.18s_ease-out_both] overflow-visible transition-transform duration-150 ease-out group max-h-[calc(100dvh-95px)] sm:max-h-[calc(100dvh-40px)]"
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

          {/* Dynamic Specular Sheen (Direct RAF updated) */}
          <div
            ref={glareRef}
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300"
            style={{
              background: "radial-gradient(350px circle at 50% 50%, rgba(255, 255, 255, 0), transparent 70%)",
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
            <div className="relative z-10 flex flex-col overflow-y-auto no-scrollbar max-h-[calc(100dvh-125px)] sm:max-h-[calc(100dvh-60px)] pr-0.5">
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
                  wordData.partOfSpeech?.toLowerCase().includes("phrasal") ||
                  wordData.word.includes(" ")
                    ? "text-[#A27FF3]"
                    : "text-[#6b6c82]"
                }`}
              >
                {wordData.partOfSpeech?.toLowerCase().includes("phrasal") ||
                wordData.word.includes(" ")
                  ? "phrasal verb"
                  : wordData.partOfSpeech || "vocabulary"}
              </span>

              {/* Vocablo Translation */}
              <div className="flex items-center space-x-1.5 mt-2 pl-2">
                <VocabloTranslateIcon />
                {hasValidTranslation ? (
                  <span className="text-[12.5px] font-medium text-[#c4b5fd]">
                    {wordData.spanishTranslation}
                  </span>
                ) : isTranslatingDirect ? (
                  <span className="text-[11.5px] font-mono text-[#c4b5fd] animate-pulse flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#A27FF3] animate-ping" />
                    Traduciendo con IA...
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleTriggerDirectTranslate}
                    className="group inline-flex items-center gap-1.5 py-0.5 px-2 rounded-lg bg-[#A27FF3]/15 hover:bg-[#A27FF3]/25 border border-[#A27FF3]/30 hover:border-[#A27FF3]/50 text-[#c4b5fd] hover:text-white text-[11px] font-medium transition-all cursor-pointer shadow-[0_0_12px_rgba(162,127,243,0.15)]"
                    title="Clúster central inactivo. Haz clic para traducir con tu clave o conectar una API."
                  >
                    <svg
                      className="w-3 h-3 text-[#A27FF3] group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                    <span>Traducir con IA (Configurar API)</span>
                  </button>
                )}
              </div>

              {/* Definition / Explanation Note */}
              {wordData.definition && (
                <p className="text-[11.5px] text-[#8e90a5] font-light leading-[1.5] mt-2 pl-2 line-clamp-3 sm:line-clamp-none">
                  {wordData.definition}
                </p>
              )}

              {/* Divider Line */}
              <div className="w-full h-px bg-white/[0.05] my-2 sm:my-3" />

              {/* Example Sentence */}
              {wordData.exampleSentence && (
                <p className="text-[11.5px] italic text-[#8e90a5] font-light leading-[1.5] mb-2.5 pl-2 line-clamp-3 sm:line-clamp-none">
                  "{wordData.exampleSentence.replace(/^["']+|["']+$/g, "").trim()}"
                </p>
              )}

              {/* Bottom Action: + Add to Memory / ✓ In Memory (Pure Floating Typography — Zero Pill, Zero Border) */}
              <div className="flex items-center justify-start pt-0.5 pl-2">
                {addedSuccess || isAlreadyInMemory ? (
                  <span
                    aria-label="Word already in Memory"
                    className="text-[12px] font-medium tracking-wide flex items-center space-x-1.5 text-[#4ade80] select-none"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#4ade80]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>In Memory</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveToMemory}
                    disabled={isAdding}
                    aria-label="Add word to Memory"
                    className="text-[12px] font-medium tracking-wide transition-all flex items-center space-x-1.5 group text-[#A27FF3] hover:text-white cursor-pointer"
                  >
                    <MemoryBankSaveIcon className="w-3.5 h-3.5 text-[#A27FF3] group-hover:scale-110 transition-transform" />
                    <span>{isAdding ? "Saving..." : "Add to Memory"}</span>
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  },
);

ReadingWordModal.displayName = "ReadingWordModal";
