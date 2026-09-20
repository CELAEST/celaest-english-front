import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReadingArticle } from "../../../domain/entities/ReadingArticle";
import { WordLookup, GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { readingAudioPrefetcher } from "../services/readingAudioPrefetcher";
import { AiReadingArticleGenerator } from "../services/aiReadingArticleGenerator";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";

const READING_CACHE_KEY = "lingua_reading_articles_v2";
const ACTIVE_ARTICLE_ID_KEY = "lingua_reading_active_id_v2";

/**
 * Calculates ideal words per page based on viewport height to ensure:
 * - Zero vertical scrolling (never triggers scrollbars or overflow)
 * - Prudent breathing room (~80-120px) above ReadingBottomBar
 * - Clean multi-page pagination that turns pages right before container boundaries
 */
function getTargetWordsForHeight(height: number, fontSizeIndex: number = 0): number {
  let baseWords: number;
  if (height < 680) baseWords = 38;  // Compact mobile / small viewports with browser address bar
  else if (height < 780) baseWords = 46;  // Standard mobile (iPhone mini / standard)
  else if (height < 900) baseWords = 52;  // Modern smartphones (iPhone 13/14/15/16)
  else if (height < 1050) baseWords = 68; // Pro Max / Tablets / Small laptops
  else baseWords = 95;                   // Desktop 1080p+

  // Scaling words-per-page based on active text size:
  // fontSizeIndex 0: Estándar (17px) -> baseWords
  // fontSizeIndex 1: Grande (19px) -> ~26% fewer words so lines fit without overflowing
  // fontSizeIndex 2: Extra (21px) -> ~46% fewer words so large text fits comfortably without any cut-off
  if (fontSizeIndex === 1) {
    return Math.max(20, Math.round(baseWords * 0.74));
  }
  if (fontSizeIndex === 2) {
    return Math.max(16, Math.round(baseWords * 0.54));
  }
  return baseWords;
}

/**
 * Dynamic Viewport-Calibrated Text Paginator:
 * - Strict Zero-Scroll Guarantee: enforces a hard ceiling so no page exceeds container capacity.
 * - Prudent Bottom Cushion: guarantees comfortable clearance above ReadingBottomBar.
 * - Balanced Distribution: breaks on sentence boundaries and balances pages evenly.
 */
function paginateText(fullText: string, targetWordsPerPage: number): string[] {
  if (!fullText) return [];
  const words = fullText.trim().split(/\s+/);
  if (words.length === 0) return [];

  // Single page only if total words strictly fit within targetWordsPerPage
  if (words.length <= targetWordsPerPage) {
    return [fullText];
  }

  // Calculate balanced number of pages so every page occupies the container harmoniously
  const numPages = Math.ceil(words.length / targetWordsPerPage);
  const idealWordsPerPage = Math.ceil(words.length / numPages);
  // Hard ceiling: no page can exceed targetWordsPerPage under any circumstances
  const hardMaxPerPage = targetWordsPerPage;

  const pages: string[] = [];
  let currentChunk: string[] = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);
    const endsWithSentence = /[.!?"']$/.test(words[i]);
    const isLastPage = pages.length === numPages - 1;

    // Break on sentence boundary when we reach the balanced ideal target, or force break at hard ceiling
    if (
      !isLastPage &&
      ((currentChunk.length >= idealWordsPerPage && endsWithSentence) ||
        currentChunk.length >= hardMaxPerPage)
    ) {
      pages.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    pages.push(currentChunk.join(" "));
  }

  return pages.length > 0 ? pages : [fullText];
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

interface InitialReadingState {
  cachedArticles: ReadingArticle[];
  activeArticleId: string | null;
}

/** One-time mount read of the persisted reading cache. */
function readInitialState(): InitialReadingState {
  let cachedArticles: ReadingArticle[] = [];
  try {
    const cachedStr = localStorage.getItem(READING_CACHE_KEY);
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr) as unknown;
      if (Array.isArray(parsed)) {
        cachedArticles = parsed as ReadingArticle[];
      }
    }
  } catch (e) {
    logger.warn("Failed to load reading cache from localStorage", e);
  }

  const storedActiveId = localStorage.getItem(ACTIVE_ARTICLE_ID_KEY);
  const activeArticleId =
    storedActiveId && cachedArticles.some((a) => a.id === storedActiveId)
      ? storedActiveId
      : (cachedArticles[0]?.id ?? null);

  return { cachedArticles, activeArticleId };
}

export const useReadingArticles = (level?: string, profession?: string, fontSizeIndex: number = 0) => {
  const inFlightLookupsRef = useRef<Map<string, Promise<WordLookup>>>(new Map());
  const inFlightQuizRef = useRef<Map<string, Promise<GenerateQuizResponse>>>(new Map());

  const [{ cachedArticles, activeArticleId: initialActiveId }] = useState(readInitialState);

  /**
   * Local source of truth: cache-loaded articles plus everything created or
   * enriched during the session. Merged OVER the server list (cache wins),
   * exactly like the previous imperative merge effect.
   */
  const [localArticles, setLocalArticles] = useState<ReadingArticle[]>(cachedArticles);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(initialActiveId);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasFinishedArticle, setHasFinishedArticle] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  // TanStack Query: Fetch articles with 10 minutes stale time (waits for level to be resolved)
  const { data: fetchedArticles, isLoading: isQueryLoading } = useQuery({
    queryKey: QUERY_KEYS.reading.articles(level ?? "B1"),
    queryFn: () => apiReadingRepository.getArticles(level!),
    enabled: Boolean(level),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  /** Server list merged with local session articles (fresh server articles take priority). */
  const articles = useMemo(() => {
    if (!fetchedArticles || fetchedArticles.length === 0) return localArticles;
    const map = new Map<string, ReadingArticle>();
    fetchedArticles.forEach((art) => map.set(art.id, art));
    localArticles.forEach((art) => {
      if (!map.has(art.id)) {
        map.set(art.id, art);
      }
    });
    return Array.from(map.values());
  }, [fetchedArticles, localArticles]);

  const matchingLevelArticles = useMemo(() => {
    return articles.filter(
      (a) => !level || a.cefrLevel?.toUpperCase() === level.toUpperCase(),
    );
  }, [articles, level]);

  const currentArticle = useMemo(
    () => {
      const active = articles.find((a) => a.id === activeArticleId);
      if (active && (!level || active.cefrLevel?.toUpperCase() === level.toUpperCase())) {
        return active;
      }
      return matchingLevelArticles[0] ?? articles[0] ?? null;
    },
    [articles, activeArticleId, level, matchingLevelArticles],
  );

  // Restore a stored-active article that only exists server-side, or default
  // to the first server article when starting without any cache. Runs at most
  // once per mount, during render (React-endorsed state adjustment pattern).
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);
  if (!initialSelectionDone && fetchedArticles && fetchedArticles.length > 0) {
    setInitialSelectionDone(true);
    const storedActiveId = localStorage.getItem(ACTIVE_ARTICLE_ID_KEY);
    const restored =
      (storedActiveId && matchingLevelArticles.find((a) => a.id === storedActiveId)) ||
      matchingLevelArticles[0] ||
      currentArticle ||
      fetchedArticles[0];
    if (restored && restored.id !== activeArticleId) {
      setActiveArticleId(restored.id);
    }
  }

  const prevLevelRef = useRef(level);
  useEffect(() => {
    if (prevLevelRef.current !== level) {
      prevLevelRef.current = level;
      setCurrentPageIndex(0);
      setHasFinishedArticle(false);
      const matching = articles.find(
        (a) => !level || a.cefrLevel?.toUpperCase() === level.toUpperCase(),
      );
      if (matching) {
        setActiveArticleId(matching.id);
      }
    }
  }, [level, articles]);

  // Reset per-article session telemetry whenever the active article changes
  // (render-phase adjustment instead of a cascading setState effect).
  const [lastTrackedArticleId, setLastTrackedArticleId] = useState<string | null>(initialActiveId);
  if (lastTrackedArticleId !== activeArticleId) {
    setLastTrackedArticleId(activeArticleId);
    setSessionSeconds(0);
    setHasFinishedArticle(false);
  }

  // Live session reading timer: tracks real elapsed seconds while reading actively
  const trackedArticleId = currentArticle?.id;
  useEffect(() => {
    if (!trackedArticleId || isGenerating || hasFinishedArticle) return;

    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [trackedArticleId, isGenerating, hasFinishedArticle]);

  // Debounced persistence of the assembled list (avoids main-thread jank)
  useEffect(() => {
    if (articles.length === 0) return;
    const timer = setTimeout(() => {
      try {
        const cappedArticles = articles.slice(0, 8);
        localStorage.setItem(READING_CACHE_KEY, JSON.stringify(cappedArticles));
        localStorage.setItem(ACTIVE_ARTICLE_ID_KEY, activeArticleId ?? "");
      } catch (e) {
        logger.warn("Failed to persist reading cache to localStorage", e);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [articles, activeArticleId]);

  // Debounced viewport height listener (150ms) to prevent continuous re-pagination calculations
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setViewportHeight(window.innerHeight);
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  /** Inserts or replaces one article version inside the local overlay. Pure updater. */
  const upsertLocalArticle = useCallback((version: ReadingArticle) => {
    setLocalArticles((prev) => {
      const index = prev.findIndex((a) => a.id === version.id);
      if (index === -1) return [version, ...prev];
      const next = [...prev];
      next[index] = version;
      return next;
    });
  }, []);

  // Dynamic Viewport-Aware Responsive Pagination
  const fullContent = useMemo(() => {
    if (!currentArticle) return "";
    if (currentArticle.content) return currentArticle.content;
    if (currentArticle.pages && currentArticle.pages.length > 0)
      return currentArticle.pages.join(" ");
    return "";
  }, [currentArticle]);

  const targetWords = useMemo(
    () => getTargetWordsForHeight(viewportHeight, fontSizeIndex),
    [viewportHeight, fontSizeIndex],
  );
  const dynamicPages = useMemo(
    () => paginateText(fullContent, targetWords),
    [fullContent, targetWords],
  );

  const totalPages = Math.max(1, dynamicPages.length);
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), totalPages - 1);
  const progressPercentage = Math.min(100, Math.round(((safePageIndex + 1) / totalPages) * 100));
  const currentPageContent = dynamicPages[safePageIndex] || dynamicPages[0] || fullContent;

  // Proactive Background Audio Prefetching for 0ms Instant Playback (Page-by-Page & Mentor-by-Mentor)
  useEffect(() => {
    if (dynamicPages.length > 0) {
      readingAudioPrefetcher.prefetchArticlePages(dynamicPages, currentPageIndex);
    }
  }, [dynamicPages, currentPageIndex]);

  // Real Exact Word Counts & Session Telemetry
  const totalWords = useMemo(() => countWords(fullContent), [fullContent]);

  const readWords = useMemo(() => {
    if (!dynamicPages.length) return 0;
    if (hasFinishedArticle) return totalWords;
    let count = 0;
    for (let i = 0; i <= currentPageIndex && i < dynamicPages.length; i++) {
      count += countWords(dynamicPages[i]);
    }
    return Math.min(count, totalWords);
  }, [dynamicPages, currentPageIndex, hasFinishedArticle, totalWords]);

  const estimatedMinutesTotal = useMemo(() => {
    if (currentArticle?.readTimeMin && currentArticle.readTimeMin > 0) {
      return currentArticle.readTimeMin;
    }
    return Math.max(1, Math.ceil(totalWords / 160));
  }, [currentArticle, totalWords]);

  const estimatedMinutesRemaining = useMemo(() => {
    if (hasFinishedArticle) return 0;
    const remainingWords = Math.max(0, totalWords - readWords);
    return Math.max(1, Math.ceil(remainingWords / 160));
  }, [hasFinishedArticle, totalWords, readWords]);

  const actualReadingTimeMin = useMemo(() => {
    const minutes = Math.round(sessionSeconds / 60);
    return Math.max(1, minutes === 0 ? 1 : minutes);
  }, [sessionSeconds]);

  const nextPage = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      setHasFinishedArticle(true);
    }
  }, [currentPageIndex, totalPages]);

  const prevPage = useCallback(() => {
    if (hasFinishedArticle) {
      setHasFinishedArticle(false);
      return;
    }
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  }, [hasFinishedArticle]);

  const generateNextArticle = useCallback(
    async (category: string = "BUSINESS") => {
      setIsGenerating(true);
      try {
        const newArticle = await AiReadingArticleGenerator.generateArticle({
          category,
          level,
          profession,
        });

        setLocalArticles((prev) => [newArticle, ...prev.filter((a) => a.id !== newArticle.id)]);
        setActiveArticleId(newArticle.id);
        setCurrentPageIndex(0);
        return newArticle;
      } catch (err) {
        logger.warn("[useReadingArticles] Failed to generate AI article:", err);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [level, profession],
  );

  const translateWordDirect = useCallback(
    async (word: string, context?: string): Promise<string> => {
      const cleanWord = word.trim();
      if (!cleanWord) return "";

      const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
      const hasKey = await providerKeyVault.hasKey(activeProvider);

      if (!hasKey) {
        throw new Error("NO_KEY");
      }

      const systemPrompt =
        "You are an expert bilingual English-Spanish lexicographer and translator. Translate the English word or idiom into natural Spanish. Return ONLY 1 to 3 lowercase Spanish words, no punctuation, no notes, no quotes.";
      const userPrompt = context
        ? `Translate "${cleanWord}" to Spanish in the context of this sentence: "${context}". Return ONLY the Spanish translation.`
        : `Translate "${cleanWord}" to natural Spanish. Return ONLY the Spanish translation.`;

      const translationRaw = await directClientAiService.chatCompletion({
        systemPrompt,
        userPrompt,
        providerId: activeProvider,
        maxTokens: 60,
      });

      const cleanTranslation = translationRaw
        .replace(/^["'`]|["'`]$/g, "")
        .replace(/[.,!?;:]/g, "")
        .trim()
        .toLowerCase();

      if (cleanTranslation && currentArticleRef.current) {
        const currentArt = currentArticleRef.current;
        const lowerKey = cleanWord.toLowerCase();
        const existingEntry = currentArt.vocabularyMap?.[lowerKey];
        const updatedEntry: WordLookup = {
          word: cleanWord,
          phonetic: existingEntry?.phonetic || `/${cleanWord}/`,
          partOfSpeech:
            existingEntry?.partOfSpeech || (cleanWord.includes(" ") ? "phrasal verb" : "vocabulary"),
          spanishTranslation: cleanTranslation,
          definition: existingEntry?.definition || `Meaning of '${cleanWord}' in context.`,
          exampleSentence: context || existingEntry?.exampleSentence || `"${cleanWord}"`,
          cefrLevel: existingEntry?.cefrLevel || level || "B1",
          audioUrl: existingEntry?.audioUrl,
          metadata: {
            lexicalSource: existingEntry?.metadata?.lexicalSource || "client_byok",
            translationSource: `client_${activeProvider}`,
            cacheHit: false,
            resolutionTimeMs: existingEntry?.metadata?.resolutionTimeMs || 120,
          },
        };

        upsertLocalArticle({
          ...currentArt,
          vocabularyMap: {
            ...(currentArt.vocabularyMap ?? {}),
            [lowerKey]: updatedEntry,
          },
        });
      }

      return cleanTranslation;
    },
    [level, upsertLocalArticle],
  );

  const instantWordLookup = useCallback(
    async (word: string, context?: string): Promise<WordLookup> => {
      const cleanWord = word
        .toLowerCase()
        .replace(/[^a-z\s'-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!cleanWord) {
        return {
          word: word,
          phonetic: `/${word}/`,
          partOfSpeech: "vocabulary",
          spanishTranslation: "",
          definition: `Vocabulary word: ${word}.`,
          exampleSentence: context || `"${word} is an essential term."`,
          cefrLevel: level || "B1",
        };
      }

      const isValidCache = (entry?: WordLookup) => {
        if (!entry) return false;
        const tr = entry.spanishTranslation?.trim();
        if (!tr || tr === ".") return false;
        if (tr.toLowerCase() === cleanWord.toLowerCase()) {
          const isProper = entry.partOfSpeech?.toLowerCase().includes("proper");
          const hasValidDef = entry.definition && !entry.definition.startsWith("Vocabulary") && !entry.definition.startsWith("Key vocabulary") && !entry.definition.startsWith("Essential professional");
          if (!isProper && !hasValidDef) return false;
        }
        if (entry.phonetic?.startsWith("/'") || entry.phonetic === `/${cleanWord}/`) return false;
        if (entry.definition?.startsWith("Key vocabulary term:") && !entry.audioUrl) return false;
        if (entry.definition?.startsWith("Essential professional vocabulary term:")) return false;
        return true;
      };

      const lookupInArticle = (art?: ReadingArticle | null): WordLookup | undefined => {
        const map = art?.vocabularyMap;
        if (!map) return undefined;
        const direct = map[cleanWord];
        if (isValidCache(direct)) {
          return context ? { ...direct, exampleSentence: context } : direct;
        }
        const deHyphenated = cleanWord.replace(/-/g, "");
        const alternative = map[deHyphenated];
        if (isValidCache(alternative)) {
          return context ? { ...alternative, exampleSentence: context } : alternative;
        }
        return undefined;
      };

      // 1. Current article first, then any other cached article
      const currentHit = lookupInArticle(currentArticle);
      if (currentHit) return currentHit;
      for (const art of articles) {
        const hit = lookupInArticle(art);
        if (hit) return hit;
      }

      // 2. Deduplicate concurrent in-flight network requests
      const lookupKey = `${cleanWord}:${context || ""}`;
      if (inFlightLookupsRef.current.has(lookupKey)) {
        return inFlightLookupsRef.current.get(lookupKey)!;
      }

      const lookupPromise = (async () => {
        try {
          const lookupResult = await apiReadingRepository.lookupWord(cleanWord, context);

          // If backend returned untranslated or empty translation (e.g. CELAEST-CORE down), attempt client BYOK
          if (!lookupResult.spanishTranslation || lookupResult.metadata?.translationSource === "untranslated") {
            try {
              const activeProvider = (await providerKeyVault.getActiveProviderId()) || "groq";
              const hasKey = await providerKeyVault.hasKey(activeProvider);
              if (hasKey) {
                const directTr = await translateWordDirect(cleanWord, context);
                if (directTr) {
                  lookupResult.spanishTranslation = directTr;
                  if (lookupResult.metadata) {
                    lookupResult.metadata.translationSource = `client_${activeProvider}`;
                  }
                }
              }
            } catch {
              // Direct BYOK translation error ignored; fallback modal will be presented to user
            }
          }

          // Persist the enriched version so future sessions reuse it
          if (currentArticle) {
            upsertLocalArticle({
              ...currentArticle,
              vocabularyMap: {
                ...(currentArticle.vocabularyMap ?? {}),
                [cleanWord]: lookupResult,
              },
            });
          }

          return lookupResult;
        } catch {
          return {
            word: cleanWord,
            phonetic: `/${cleanWord}/`,
            partOfSpeech: "vocabulary",
            spanishTranslation: "",
            definition: `Vocabulary term: ${cleanWord}.`,
            exampleSentence: context || `"${cleanWord} is an important term in professional communication."`,
            cefrLevel: level || "B1",
          };
        } finally {
          inFlightLookupsRef.current.delete(lookupKey);
        }
      })();

      inFlightLookupsRef.current.set(lookupKey, lookupPromise);
      return lookupPromise;
    },
    [currentArticle, articles, level, upsertLocalArticle],
  );

  const articlesRef = useRef(articles);
  articlesRef.current = articles;

  const currentArticleRef = useRef(currentArticle);
  currentArticleRef.current = currentArticle;

  const getOrFetchQuiz = useCallback(
    async (
      articleId: string,
      title: string,
      content: string,
      keywords: string[] = [],
      quizLevel: string = "B1",
    ): Promise<GenerateQuizResponse> => {
      const currentArt = currentArticleRef.current;
      const allArts = articlesRef.current;

      const matchesRequest = (art: ReadingArticle) =>
        (art.id === articleId || art.title === title) &&
        art.quiz &&
        (art.quiz.questions?.length ?? 0) > 0;

      // 1. Check if currentArticle already has the quiz cached in memory
      if (currentArt && matchesRequest(currentArt)) {
        return currentArt.quiz!;
      }

      // 2. Check if any article in the assembled list has the quiz cached
      const found = allArts.find(matchesRequest);
      if (found) {
        return found.quiz!;
      }

      // 3. Deduplicate concurrent in-flight network requests
      const cacheKey = articleId || title;
      if (inFlightQuizRef.current.has(cacheKey)) {
        return inFlightQuizRef.current.get(cacheKey)!;
      }

      const quizPromise = (async () => {
        try {
          const res = await apiReadingRepository.generateQuiz(
            articleId,
            title,
            content,
            keywords,
            quizLevel,
          );
          if (res && res.questions && res.questions.length > 0) {
            const target =
              (currentArt && (currentArt.id === articleId || currentArt.title === title)
                ? currentArt
                : undefined) ?? allArts.find((a) => a.id === articleId || a.title === title);
            if (target) {
              upsertLocalArticle({ ...target, quiz: res });
            }
          }
          return res;
        } finally {
          inFlightQuizRef.current.delete(cacheKey);
        }
      })();

      inFlightQuizRef.current.set(cacheKey, quizPromise);
      return quizPromise;
    },
    [upsertLocalArticle],
  );

  return {
    articles,
    currentArticle,
    currentPageIndex,
    totalPages,
    progressPercentage,
    currentPageContent,
    allPages: dynamicPages,
    fullContent,
    totalWords,
    readWords,
    estimatedMinutesTotal,
    estimatedMinutesRemaining,
    actualReadingTimeMin,
    isLoading: isQueryLoading && articles.length === 0,
    isGenerating,
    isCompleted: hasFinishedArticle,
    nextPage,
    prevPage,
    generateNextArticle,
    instantWordLookup,
    translateWordDirect,
    getOrFetchQuiz,
  };
};
