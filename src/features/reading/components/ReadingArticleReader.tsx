import React, { useState, useCallback, useMemo } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { ReadingWordModal } from "./ReadingWordModal";

export interface ReadingArticleReaderProps {
  content: string;
  onLookupWord?: (word: string) => Promise<WordLookup>;
  onAddToMemory?: (wordData: WordLookup) => Promise<void>;
}

export const ReadingArticleReader: React.FC<ReadingArticleReaderProps> = React.memo(({
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

  // Split content cleanly into words
  const words = useMemo(() => (content ? content.trim().split(/\s+/) : []), [content]);

  const handleCloseModal = useCallback(() => {
    setShowTooltip(false);
    setActiveWordIndex(null);
  }, []);

  const handleWordClick = useCallback(async (
    e: React.MouseEvent<HTMLButtonElement>,
    cleanWord: string,
    idx: number,
  ) => {
    e.stopPropagation();
    setActiveWordIndex(idx);

    // Get exact bounding box of the clicked word
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = Math.min(315, window.innerWidth - 32);
    const estimatedHeight = 330;
    const verticalGap = 8;

    // Viewport-aware Smart Positioning: Choose direction with the greatest available space
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    let top: number;
    // If not enough space below, or if space above is significantly larger, position ABOVE
    if (spaceBelow < estimatedHeight + verticalGap && spaceAbove > spaceBelow) {
      top = rect.top - estimatedHeight - verticalGap;
    } else {
      top = rect.bottom + verticalGap;
    }

    // Safety clamp within viewport to guarantee zero clipping
    top = Math.max(16, Math.min(top, window.innerHeight - estimatedHeight - 16));

    // Horizontal centering clamped inside window viewport with safety margin for floating speaker
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(32, Math.min(left, window.innerWidth - popoverWidth - 20));

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
          cefrLevel: "B1",
        });
      } finally {
        setIsLoadingLookup(false);
      }
    }
  }, [onLookupWord]);

  return (
    <article
      role="article"
      aria-label="Reading content"
      className="w-full max-w-[620px] flex-1 min-h-0 flex flex-col justify-start items-start text-left text-[#b5b6be] font-sans text-[15px] sm:text-[16px] lg:text-[17px] font-light leading-[1.65] sm:leading-[1.7] select-text overflow-visible relative transition-all pt-0.5 pb-1 sm:pb-2"
    >
      <div className="tracking-wide text-[#b5b6be] leading-[1.65] sm:leading-[1.7] animate-[fadeSlideUp_0.4s_ease-out_both] relative z-10 text-left w-full pl-0 overflow-visible">
        {words.map((rawWord, idx) => {
          const cleanWord = rawWord
            .toLowerCase()
            .replace(/[^a-z'-]/g, "")
            .replace(/^-+|-+$/g, "");
          const isSelected = activeWordIndex === idx && showTooltip;

          return (
            <span
              key={`${cleanWord}-${idx}`}
              className="inline-block overflow-visible mr-1.5 my-0.5"
            >
              <button
                type="button"
                onClick={(e) => handleWordClick(e, cleanWord, idx)}
                aria-label={`Look up vocabulary word ${rawWord}`}
                aria-expanded={isSelected}
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

      {/* Extracted Bespoke Vocabulary Modal */}
      {showTooltip && (
        <ReadingWordModal
          wordData={activeWordData}
          isLoading={isLoadingLookup}
          coords={popoverCoords}
          onClose={handleCloseModal}
          onAddToMemory={onAddToMemory}
        />
      )}
    </article>
  );
});

ReadingArticleReader.displayName = "ReadingArticleReader";
