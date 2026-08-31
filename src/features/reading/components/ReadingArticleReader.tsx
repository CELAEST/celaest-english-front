import React, { useState, useCallback, useMemo, useRef } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { ReadingWordModal } from "./ReadingWordModal";
import { logger } from "../../../shared/utils/logger";
import {
  VERIFIED_PHRASAL_VERBS_SET,
  OBJECT_PRONOUNS_SET,
} from "../utils/phrasalVerbsCatalog";

export interface ReadingArticleReaderProps {
  content: string;
  articlePhrasalVerbs?: string[] | undefined;
  onLookupWord?: (word: string, context?: string) => Promise<WordLookup>;
  onAddToMemory?: (wordData: WordLookup) => Promise<void>;
  activeKaraokeWordIndex?: number | null | undefined;
}

interface WordRange {
  start: number;
  end: number;
  phrase: string;
}

export const ReadingArticleReader: React.FC<ReadingArticleReaderProps> = React.memo(
  ({ content, articlePhrasalVerbs, onLookupWord, onAddToMemory, activeKaraokeWordIndex }) => {
    const [hoveredRange, setHoveredRange] = useState<WordRange | null>(null);
    const [activeRange, setActiveRange] = useState<WordRange | null>(null);
    const [activeWordData, setActiveWordData] = useState<WordLookup | null>(null);
    const [isLoadingLookup, setIsLoadingLookup] = useState<boolean>(false);
    const [popoverCoords, setPopoverCoords] = useState<{
      top: number;
      left: number;
    }>({ top: 0, left: 0 });
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const buttonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

    // Merge AI extracted story phrasal verbs with Universal Master Corpus
    const activePhrasalSet = useMemo(() => {
      const set = new Set(VERIFIED_PHRASAL_VERBS_SET);
      if (articlePhrasalVerbs && Array.isArray(articlePhrasalVerbs)) {
        for (const phrase of articlePhrasalVerbs) {
          if (phrase) {
            set.add(phrase.toLowerCase().trim());
          }
        }
      }
      return set;
    }, [articlePhrasalVerbs]);

    // Split content cleanly into words
    const rawWords = useMemo(() => (content ? content.trim().split(/\s+/) : []), [content]);

    // Cleaned word tokens
    const cleanTokens = useMemo(() => {
      return rawWords.map((w) =>
        w.toLowerCase().replace(/[^a-z'-]/g, "").replace(/^-+|-+$/g, ""),
      );
    }, [rawWords]);

    // Pre-calculate genuine phrasal verb & idiom spans from curated dictionary
    const phrasalSpans = useMemo(() => {
      const map = new Map<number, WordRange>();
      const n = cleanTokens.length;

      for (let i = 0; i < n; i++) {
        // 1. 4-word Idioms
        if (i + 3 < n) {
          const phrase4 = `${cleanTokens[i]} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]} ${cleanTokens[i + 3]}`;
          if (activePhrasalSet.has(phrase4)) {
            const range: WordRange = { start: i, end: i + 3, phrase: phrase4 };
            for (let k = i; k <= i + 3; k++) map.set(k, range);
            i += 3;
            continue;
          }
        }

        // 2. 3-word Continuous Phrasal Verbs & Idioms
        if (i + 2 < n) {
          const phrase3 = `${cleanTokens[i]} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]}`;
          if (activePhrasalSet.has(phrase3)) {
            const range: WordRange = { start: i, end: i + 2, phrase: phrase3 };
            for (let k = i; k <= i + 2; k++) map.set(k, range);
            i += 2;
            continue;
          }

          // 3. Separable Phrasal Verbs with Object Pronoun
          if (OBJECT_PRONOUNS_SET.has(cleanTokens[i + 1])) {
            const splitVerb = `${cleanTokens[i]} ${cleanTokens[i + 2]}`;
            if (activePhrasalSet.has(splitVerb)) {
              const range: WordRange = { start: i, end: i + 2, phrase: splitVerb };
              for (let k = i; k <= i + 2; k++) map.set(k, range);
              i += 2;
              continue;
            }
          }
        }

        // 4. 2-word Phrasal Verbs & Collocations
        if (i + 1 < n) {
          const phrase2 = `${cleanTokens[i]} ${cleanTokens[i + 1]}`;
          if (activePhrasalSet.has(phrase2)) {
            const range: WordRange = { start: i, end: i + 1, phrase: phrase2 };
            map.set(i, range);
            map.set(i + 1, range);
            i += 1;
          }
        }
      }

      return map;
    }, [cleanTokens, activePhrasalSet]);

    const handleCloseModal = useCallback(() => {
      setShowTooltip(false);
      setActiveRange(null);
    }, []);

    const performLookup = useCallback(
      async (phrase: string, rect: DOMRect) => {
        const popoverWidth = Math.min(315, window.innerWidth - 32);
        const estimatedHeight = 330;
        const verticalGap = 8;

        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;

        let top: number;
        if (spaceBelow < estimatedHeight + verticalGap && spaceAbove > spaceBelow) {
          top = rect.top - estimatedHeight - verticalGap;
        } else {
          top = rect.bottom + verticalGap;
        }

        top = Math.max(16, Math.min(top, window.innerHeight - estimatedHeight - 16));
        let left = rect.left + rect.width / 2 - popoverWidth / 2;
        left = Math.max(32, Math.min(left, window.innerWidth - popoverWidth - 20));

        setPopoverCoords({ top, left });
        setShowTooltip(true);

        // Extract surrounding sentence for authentic, contextual examples
        let contextSentence = "";
        if (content) {
          const sentences = content.match(/[^.!?]+[.!?]*/g) || [content];
          const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
          const match = sentences.find((s) => new RegExp(`\\b${escaped}\\b`, "i").test(s));
          contextSentence = match ? match.trim() : content.trim();
        }

        if (onLookupWord) {
          setIsLoadingLookup(true);
          try {
            const data = await onLookupWord(phrase, contextSentence);
            setActiveWordData(data);
          } catch (err) {
            logger.warn("Failed lookup for phrase:", phrase, err);
            setActiveWordData({
              word: phrase,
              spanishTranslation: phrase,
              phonetic: `/${phrase}/`,
              partOfSpeech: phrase.includes(" ") ? "phrasal verb" : "vocabulary",
              definition: `Contextual meaning for '${phrase}'.`,
              exampleSentence: contextSentence || `Using '${phrase}' in context enhances clarity and natural English fluency.`,
              cefrLevel: "B1",
            });
          } finally {
            setIsLoadingLookup(false);
          }
        }
      },
      [onLookupWord, content],
    );

    const handleWordClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>, idx: number) => {
        e.stopPropagation();

        const phrasalMatch = phrasalSpans.get(idx);
        const range: WordRange = phrasalMatch || {
          start: idx,
          end: idx,
          phrase: cleanTokens[idx],
        };

        setActiveRange(range);

        // Calculate unified bounding rectangle across all words in the range
        const firstEl = buttonRefs.current.get(range.start);
        const lastEl = buttonRefs.current.get(range.end);

        let combinedRect: DOMRect;
        if (firstEl && lastEl) {
          const r1 = firstEl.getBoundingClientRect();
          const r2 = lastEl.getBoundingClientRect();
          const minLeft = Math.min(r1.left, r2.left);
          const maxRight = Math.max(r1.right, r2.right);
          const minTop = Math.min(r1.top, r2.top);
          const maxBottom = Math.max(r1.bottom, r2.bottom);
          combinedRect = new DOMRect(minLeft, minTop, maxRight - minLeft, maxBottom - minTop);
        } else {
          combinedRect = e.currentTarget.getBoundingClientRect();
        }

        performLookup(range.phrase, combinedRect);
      },
      [phrasalSpans, cleanTokens, performLookup],
    );

    // Multi-Word Drag / Range Selection Listener for free text selection
    const handleTextSelection = useCallback(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const rawSelected = selection.toString().trim();
      if (!rawSelected) return;

      const cleanPhrase = rawSelected
        .toLowerCase()
        .replace(/[^a-z\s'-]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const wordCount = cleanPhrase.split(" ").filter(Boolean).length;
      if (wordCount >= 2 && wordCount <= 5) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return;

          setActiveRange(null);
          performLookup(cleanPhrase, rect);
        } catch {
          // Range access fallback
        }
      }
    }, [performLookup]);

    return (
      <article
        role="article"
        aria-label="Reading content"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        className="w-full flex-1 min-h-0 flex flex-col justify-start items-start text-left text-[#c5c6d0] font-sans text-[15px] sm:text-[16px] lg:text-[17px] font-light leading-[1.65] sm:leading-[1.7] select-text overflow-visible relative transition-all pt-0.5 pb-1 sm:pb-2"
      >
        <div className="tracking-wide text-[#c5c6d0] leading-[1.65] sm:leading-[1.7] animate-[fadeSlideUp_0.4s_ease-out_both] relative z-10 text-left w-full overflow-visible">
          {rawWords.map((rawWord, idx) => {
            const cleanWord = cleanTokens[idx];
            const phrasalMatch = phrasalSpans.get(idx);
            const isPhrasalPart = phrasalMatch !== undefined;
            const isStart = phrasalMatch ? idx === phrasalMatch.start : false;
            const isEnd = phrasalMatch ? idx === phrasalMatch.end : false;
            const isSingle = phrasalMatch ? phrasalMatch.start === phrasalMatch.end : true;

            const isKaraokeSpoken =
              activeKaraokeWordIndex !== null &&
              activeKaraokeWordIndex !== undefined &&
              idx === activeKaraokeWordIndex;
            const isHovered =
              hoveredRange !== null && idx >= hoveredRange.start && idx <= hoveredRange.end;
            const isSelected =
              activeRange !== null &&
              showTooltip &&
              idx >= activeRange.start &&
              idx <= activeRange.end;

            // Fluid continuous rounded borders for multi-word phrasal groups
            const roundingClass =
              isPhrasalPart && !isSingle
                ? isStart
                  ? "rounded-l-md rounded-r-none"
                  : isEnd
                    ? "rounded-r-md rounded-l-none"
                    : "rounded-none"
                : "rounded-md";

            const spacingClass = isPhrasalPart && !isSingle && !isEnd ? "mr-[2px]" : "mr-1.5";

            return (
              <span
                key={`${cleanWord}-${idx}`}
                className={`inline-block overflow-visible my-0.5 ${spacingClass}`}
              >
                <button
                  ref={(el) => {
                    if (el) buttonRefs.current.set(idx, el);
                    else buttonRefs.current.delete(idx);
                  }}
                  type="button"
                  onClick={(e) => handleWordClick(e, idx)}
                  onMouseEnter={() => {
                    if (phrasalMatch) setHoveredRange(phrasalMatch);
                  }}
                  onMouseLeave={() => {
                    if (hoveredRange) setHoveredRange(null);
                  }}
                  aria-label={`Look up vocabulary word ${rawWord}`}
                  aria-expanded={isSelected}
                  className={`px-1.5 py-0.5 transition-colors duration-150 cursor-pointer focus:outline-none font-normal inline-flex items-center text-left ${roundingClass} ${
                    isSelected
                      ? "bg-[#7048E8]/35 text-white ring-1 ring-[#A27FF3] shadow-[0_0_12px_rgba(162,127,243,0.35)]"
                      : isKaraokeSpoken
                        ? "bg-[#7048E8]/40 text-white ring-1 ring-[#A27FF3]/70 shadow-[0_0_10px_rgba(162,127,243,0.35)] font-medium"
                        : isHovered
                          ? "bg-[#7048E8]/25 text-white shadow-[0_0_8px_rgba(162,127,243,0.25)]"
                          : isPhrasalPart
                            ? "text-[#e2d9fc] underline decoration-[#A27FF3]/65 decoration-[1.5px] underline-offset-[4px] hover:text-white hover:bg-[#7048E8]/20 hover:decoration-[#A27FF3]"
                            : "text-[#c5c6d0] hover:text-white hover:bg-white/[0.08]"
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
  },
);

ReadingArticleReader.displayName = "ReadingArticleReader";
