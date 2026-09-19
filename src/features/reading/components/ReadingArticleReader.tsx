import React, { useState, useCallback, useMemo, useRef } from "react";
import { WordLookup } from "../../../domain/repositories/IReadingRepository";
import { ReadingWordModal } from "./ReadingWordModal";
import { VocabloTranslateIcon } from "./ReadingBespokeIcons";
import { logger } from "../../../shared/utils/logger";
import {
  VERIFIED_PHRASAL_VERBS_SET,
  OBJECT_PRONOUNS_SET,
} from "../utils/phrasalVerbsCatalog";

export interface ReadingArticleReaderProps {
  content: string;
  fullContent?: string | undefined;
  articlePhrasalVerbs?: string[] | undefined;
  onLookupWord?: (word: string, context?: string) => Promise<WordLookup>;
  onAddToMemory?: (wordData: WordLookup) => Promise<void>;
  onOpenRecoveryModal?: (word: string, context?: string) => void;
  onDirectTranslate?: (word: string, context?: string) => Promise<string | null>;
  activeKaraokeWordIndex?: number | null | undefined;
  isWordSaved?: ((word: string) => boolean) | undefined;
  fontSizeClassName?: string | undefined;
}

interface WordRange {
  start: number;
  end: number;
  phrase: string;
}

export const ReadingArticleReader: React.FC<ReadingArticleReaderProps> = React.memo(
  ({
    content,
    articlePhrasalVerbs,
    onLookupWord,
    onAddToMemory,
    onOpenRecoveryModal,
    onDirectTranslate,
    activeKaraokeWordIndex,
    isWordSaved,
    fontSizeClassName,
  }) => {
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

    const lemmatizeToken = (w: string) => {
      if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
      if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
      if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) return w.slice(0, -1);
      return w;
    };

    // Pre-calculate genuine phrasal verb & idiom spans from curated dictionary
    const phrasalSpans = useMemo(() => {
      const map = new Map<number, WordRange>();
      const n = cleanTokens.length;

      for (let i = 0; i < n; i++) {
        // 1. 4-word Idioms
        if (i + 3 < n) {
          const phrase4 = `${cleanTokens[i]} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]} ${cleanTokens[i + 3]}`;
          const lemma4 = `${lemmatizeToken(cleanTokens[i])} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]} ${cleanTokens[i + 3]}`;
          if (activePhrasalSet.has(phrase4) || activePhrasalSet.has(lemma4)) {
            const canonical = activePhrasalSet.has(phrase4) ? phrase4 : lemma4;
            const range: WordRange = { start: i, end: i + 3, phrase: canonical };
            for (let k = i; k <= i + 3; k++) map.set(k, range);
            i += 3;
            continue;
          }
        }

        // 2. 3-word Continuous Phrasal Verbs & Idioms
        if (i + 2 < n) {
          const phrase3 = `${cleanTokens[i]} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]}`;
          const lemma3 = `${lemmatizeToken(cleanTokens[i])} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]}`;
          if (activePhrasalSet.has(phrase3) || activePhrasalSet.has(lemma3)) {
            const canonical = activePhrasalSet.has(phrase3) ? phrase3 : lemma3;
            const range: WordRange = { start: i, end: i + 2, phrase: canonical };
            for (let k = i; k <= i + 2; k++) map.set(k, range);
            i += 2;
            continue;
          }

          // 3. Separable Phrasal Verbs with Object Pronoun
          if (OBJECT_PRONOUNS_SET.has(cleanTokens[i + 1])) {
            const splitVerb = `${cleanTokens[i]} ${cleanTokens[i + 2]}`;
            const lemmaSplit = `${lemmatizeToken(cleanTokens[i])} ${cleanTokens[i + 2]}`;
            if (activePhrasalSet.has(splitVerb) || activePhrasalSet.has(lemmaSplit)) {
              const canonical = activePhrasalSet.has(splitVerb) ? splitVerb : lemmaSplit;
              const range: WordRange = { start: i, end: i + 2, phrase: canonical };
              for (let k = i; k <= i + 2; k++) map.set(k, range);
              i += 2;
              continue;
            }
          }
        }

        // 4. 2-word Phrasal Verbs & Collocations
        if (i + 1 < n) {
          const phrase2 = `${cleanTokens[i]} ${cleanTokens[i + 1]}`;
          const lemma2 = `${lemmatizeToken(cleanTokens[i])} ${cleanTokens[i + 1]}`;
          if (activePhrasalSet.has(phrase2) || activePhrasalSet.has(lemma2)) {
            const canonical = activePhrasalSet.has(phrase2) ? phrase2 : lemma2;
            const range: WordRange = { start: i, end: i + 1, phrase: canonical };
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
        const isMobile = window.innerWidth < 640;
        const popoverWidth = Math.min(isMobile ? 275 : 295, window.innerWidth - 24);
        const bottomSafetyPadding = isMobile ? 86 : 24; // 86px clears the mobile floating navigation dock cleanly
        const topSafetyPadding = isMobile ? 12 : 16;
        const verticalGap = 8;
        const estimatedHeight = isMobile ? 320 : 340;

        const spaceAbove = rect.top - topSafetyPadding;
        const spaceBelow = window.innerHeight - bottomSafetyPadding - rect.bottom;

        let top: number;
        if (spaceBelow < estimatedHeight + verticalGap && spaceAbove > spaceBelow) {
          top = rect.top - estimatedHeight - verticalGap;
        } else {
          top = rect.bottom + verticalGap;
        }

        // Clamp so the modal never pushes under the floating mobile dock or off top edge
        const maxTop = Math.max(topSafetyPadding, window.innerHeight - bottomSafetyPadding - estimatedHeight);
        top = Math.max(topSafetyPadding, Math.min(top, maxTop));
        let left = rect.left + rect.width / 2 - popoverWidth / 2;
        left = Math.max(20, Math.min(left, window.innerWidth - popoverWidth - 14));

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
              spanishTranslation: "",
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

    // Calculate sentence index for each word (splits on terminal punctuation: '.', '!', '?', ';')
    const wordSentenceIndices = useMemo(() => {
      const map: number[] = [];
      let currentSentence = 0;
      for (let i = 0; i < rawWords.length; i++) {
        map.push(currentSentence);
        if (/[.!?…;]$/.test(rawWords[i])) {
          currentSentence++;
        }
      }
      return map;
    }, [rawWords]);

    const isListening = activeKaraokeWordIndex !== null && activeKaraokeWordIndex !== undefined;
    const activeSentenceIdx =
      isListening && activeKaraokeWordIndex !== null ? wordSentenceIndices[activeKaraokeWordIndex] : null;

    return (
      <article
        role="article"
        aria-label="Reading content"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
        className={`w-full flex-1 min-h-0 flex flex-col justify-start items-start text-[#d1d2dc] font-sans ${
          fontSizeClassName ||
          "text-[17px] sm:text-[18px] lg:text-[18.5px] leading-[1.75] sm:leading-[1.85]"
        } font-light select-text overflow-hidden relative transition-all pt-0.5 pb-1 sm:pb-2`}
      >
        {/* Mobile-Friendly Word Affordance Hint Pill */}
        <div className="w-full flex items-center justify-between pb-2 pt-0.5 select-none animate-[fadeIn_0.4s_ease-out]">
          <div className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-xs text-[#A27FF3] font-sans tracking-wide">
            <VocabloTranslateIcon className="w-3.5 h-3.5 text-[#A27FF3]" />
            <span>Toca cualquier palabra para ver traducción y fonética</span>
          </div>
        </div>

        <div className="w-full relative z-10 text-justify [text-align:justify] [text-align-last:left] [text-wrap:pretty] tracking-[-0.006em] sm:tracking-[0.01em] text-[#d1d2dc] leading-[inherit] animate-[fadeSlideUp_0.4s_ease-out_both]">
          {rawWords.map((rawWord, idx) => {
            const cleanWord = cleanTokens[idx];
            const phrasalMatch = phrasalSpans.get(idx);
            const isPhrasalPart = phrasalMatch !== undefined;
            const isStart = phrasalMatch ? idx === phrasalMatch.start : false;
            const isEnd = phrasalMatch ? idx === phrasalMatch.end : false;
            const isSingle = phrasalMatch ? phrasalMatch.start === phrasalMatch.end : true;

            const wordSentenceIdx = wordSentenceIndices[idx];
            const isWordInActiveSentence = isListening && wordSentenceIdx === activeSentenceIdx;
            const isPastSentence =
              isListening && activeSentenceIdx !== null && wordSentenceIdx < activeSentenceIdx;
            const isFutureSentence =
              isListening && activeSentenceIdx !== null && wordSentenceIdx > activeSentenceIdx;

            const isKaraokeCurrentWord = isListening && idx === activeKaraokeWordIndex;
            const isKaraokeAlreadySpoken = isListening && idx < activeKaraokeWordIndex;

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

            const isInternalPhrasal = isPhrasalPart && !isSingle && !isEnd;
            const spacingClass = isInternalPhrasal ? "mr-[1px] sm:mr-[1.5px]" : "";

            let visualStyle = "";
            if (isSelected) {
              visualStyle =
                "transition-colors duration-150 bg-white/20 text-white ring-1 ring-white/30";
            } else if (isKaraokeCurrentWord) {
              visualStyle =
                "transition-none bg-white/[0.14] text-white";
            } else if (isHovered) {
              visualStyle = isPhrasalPart
                ? "transition-colors duration-150 bg-white/[0.08] text-white underline decoration-[#C4B5FD] decoration-[1.5px] underline-offset-[4px]"
                : "transition-colors duration-150 bg-white/[0.08] text-white";
            } else if (isListening) {
              if (isWordInActiveSentence) {
                if (isKaraokeAlreadySpoken) {
                  visualStyle = "transition-colors duration-150 text-white";
                } else {
                  visualStyle = "transition-colors duration-150 text-white/80";
                }
              } else if (isPastSentence) {
                visualStyle = "transition-colors duration-300 text-[#c5c6d0]/50";
              } else if (isFutureSentence) {
                visualStyle = "transition-colors duration-300 text-[#c5c6d0]/60";
              }
            } else if (isPhrasalPart) {
              visualStyle =
                "transition-colors duration-150 text-[#ede9fe] underline decoration-[#C4B5FD]/75 decoration-[1.5px] underline-offset-[4px] hover:text-white hover:decoration-[#C4B5FD] hover:bg-white/[0.06]";
            } else {
              visualStyle =
                "transition-colors duration-150 text-[#d1d2dc] hover:text-white hover:bg-white/[0.06]";
            }

            return (
              <React.Fragment key={`${cleanWord}-${idx}`}>
                <span
                  className={`inline-block overflow-visible my-0 sm:my-0.5 ${spacingClass}`}
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
                    title={cleanWord ? `Click to look up "${cleanWord}"` : undefined}
                    aria-haspopup="dialog"
                    aria-expanded={isSelected}
                    className={`px-[1px] sm:px-1 py-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-black inline-flex items-center text-left active:scale-[0.97] active:bg-white/20 active:text-white transition-transform ${roundingClass} ${visualStyle}`}
                  >
                    {rawWord}
                  </button>
                </span>
                {!isInternalPhrasal && idx < rawWords.length - 1 ? " " : null}
              </React.Fragment>
            );
          })}
        </div>

        {/* Extracted Bespoke Vocabulary Modal */}
        {showTooltip && (
          <ReadingWordModal
            key={activeWordData?.word || "reading-modal"}
            wordData={activeWordData}
            isLoading={isLoadingLookup}
            coords={popoverCoords}
            onClose={handleCloseModal}
            onAddToMemory={onAddToMemory}
            onOpenRecoveryModal={onOpenRecoveryModal}
            isAlreadyInMemory={Boolean(activeWordData?.word && isWordSaved?.(activeWordData.word))}
            onDirectTranslate={async (word: string, context?: string) => {
              if (!onDirectTranslate) return null;
              const tr = await onDirectTranslate(word, context);
              if (tr) {
                setActiveWordData((prev) => (prev ? { ...prev, spanishTranslation: tr } : null));
              }
              return tr;
            }}
          />
        )}
      </article>
    );
  },
);

ReadingArticleReader.displayName = "ReadingArticleReader";
