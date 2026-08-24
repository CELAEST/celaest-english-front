import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReadingArticle } from "../../../domain/entities/ReadingArticle";
import { WordLookup, GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";

const READING_CACHE_KEY = "lingua_reading_articles_v2";
const ACTIVE_ARTICLE_ID_KEY = "lingua_reading_active_id_v2";

/**
 * Calculates ideal words per page based on viewport height to ensure:
 * - Small screens: zero text clipping & zero scroll (28 words)
 * - Large screens: balanced rich text fill (60-85 words)
 */
function getTargetWordsForHeight(height: number): number {
  if (height < 700) return 28;   // Small screens: ~4-5 lines
  if (height < 820) return 42;   // Medium laptops: ~5-6 lines
  if (height < 980) return 60;   // Desktop 1080p: ~7-8 lines
  return 85;                     // Large 1440p/4K monitors: ~9-11 lines
}

/**
 * Dynamic Text Paginator: Splits text into wordsPerPage blocks on sentence boundaries.
 */
function paginateText(fullText: string, targetWordsPerPage: number): string[] {
  if (!fullText) return [];
  const words = fullText.trim().split(/\s+/);
  if (words.length <= targetWordsPerPage) return [fullText];

  const pages: string[] = [];
  let currentChunk: string[] = [];

  for (let i = 0; i < words.length; i++) {
    currentChunk.push(words[i]);
    const endsWithSentence = /[.!?]"?$/.test(words[i]);
    if ((currentChunk.length >= targetWordsPerPage && endsWithSentence) || currentChunk.length >= targetWordsPerPage + 10) {
      pages.push(currentChunk.join(" "));
      currentChunk = [];
    }
  }
  if (currentChunk.length > 0) {
    pages.push(currentChunk.join(" "));
  }

  return pages.length > 0 ? pages : [fullText];
}

export const useReadingArticles = (level: string = "B1") => {
  const inFlightLookupsRef = useRef<Map<string, Promise<WordLookup>>>(new Map());
  const inFlightQuizRef = useRef<Map<string, Promise<GenerateQuizResponse>>>(new Map());
  const saveStorageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [articles, setArticles] = useState<ReadingArticle[]>([]);
  const [currentArticle, setCurrentArticle] = useState<ReadingArticle | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(
    typeof window !== "undefined" ? window.innerHeight : 800
  );

  // Live session reading timer: tracks real elapsed seconds while reading actively
  useEffect(() => {
    if (!currentArticle || isGenerating || isCompleted) return;

    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentArticle?.id, isGenerating, isCompleted]);

  // Reset session timer when article changes
  useEffect(() => {
    setSessionSeconds(0);
  }, [currentArticle?.id]);

  // Debounced storage persistence to avoid main-thread jank on rapid lookups
  const persistArticlesDebounced = useCallback((updatedArticles: ReadingArticle[]) => {
    if (saveStorageTimerRef.current) {
      clearTimeout(saveStorageTimerRef.current);
    }
    saveStorageTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(READING_CACHE_KEY, JSON.stringify(updatedArticles));
      } catch (e) {
        console.warn("Failed to persist reading cache to localStorage", e);
      }
    }, 400);
  }, []);

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
      if (saveStorageTimerRef.current) clearTimeout(saveStorageTimerRef.current);
    };
  }, []);

  // TanStack Query: Fetch articles with 10 minutes stale time
  const { data: fetchedArticles, isLoading: isQueryLoading } = useQuery({
    queryKey: QUERY_KEYS.reading.articles(level),
    queryFn: () => apiReadingRepository.getArticles(level),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Initial load from localStorage
  useEffect(() => {
    const activeId = localStorage.getItem(ACTIVE_ARTICLE_ID_KEY);

    try {
      const cachedStr = localStorage.getItem(READING_CACHE_KEY);
      if (cachedStr) {
        const cachedArticles: ReadingArticle[] = JSON.parse(cachedStr);
        if (cachedArticles && cachedArticles.length > 0) {
          setArticles(cachedArticles);
          const active = cachedArticles.find((a) => a.id === activeId) || cachedArticles[0];
          setCurrentArticle(active);
        }
      }
    } catch (e) {
      console.warn("Failed to load reading cache from localStorage", e);
    }
  }, []);

  // Merge remote fetched articles with local cache
  useEffect(() => {
    if (fetchedArticles && fetchedArticles.length > 0) {
      const activeId = localStorage.getItem(ACTIVE_ARTICLE_ID_KEY);
      setArticles((prev) => {
        const map = new Map<string, ReadingArticle>();
        prev.forEach((art) => map.set(art.id, art));
        fetchedArticles.forEach((art) => {
          if (!map.has(art.id)) {
            map.set(art.id, art);
          }
        });
        const merged = Array.from(map.values());
        try {
          localStorage.setItem(READING_CACHE_KEY, JSON.stringify(merged));
        } catch (e) {
          console.warn("Failed to save reading cache to localStorage", e);
        }
        return merged;
      });

      if (activeId) {
        const found = fetchedArticles.find((a: ReadingArticle) => a.id === activeId);
        if (found) {
          setCurrentArticle(found);
          return;
        }
      }
      setCurrentArticle((prev) => prev || fetchedArticles[0]);
    }
  }, [fetchedArticles]);

  // Dynamic Viewport-Aware Responsive Pagination
  const fullContent = useMemo(() => {
    if (!currentArticle) return "";
    if (currentArticle.content) return currentArticle.content;
    if (currentArticle.pages && currentArticle.pages.length > 0) return currentArticle.pages.join(" ");
    return "";
  }, [currentArticle]);

  const targetWords = useMemo(() => getTargetWordsForHeight(viewportHeight), [viewportHeight]);
  const dynamicPages = useMemo(() => paginateText(fullContent, targetWords), [fullContent, targetWords]);

  const totalPages = Math.max(1, dynamicPages.length);
  const progressPercentage = Math.min(100, Math.round(((currentPageIndex + 1) / totalPages) * 100));
  const currentPageContent = dynamicPages[currentPageIndex] || dynamicPages[0] || fullContent;

  // Real Exact Word Counts & Session Telemetry
  const totalWords = useMemo(() => {
    if (!fullContent) return 0;
    return fullContent.trim().split(/\s+/).filter(Boolean).length;
  }, [fullContent]);

  const readWords = useMemo(() => {
    if (!dynamicPages.length) return 0;
    if (isCompleted) return totalWords;
    let count = 0;
    for (let i = 0; i <= currentPageIndex && i < dynamicPages.length; i++) {
      count += dynamicPages[i].trim().split(/\s+/).filter(Boolean).length;
    }
    return Math.min(count, totalWords);
  }, [dynamicPages, currentPageIndex, isCompleted, totalWords]);

  const estimatedMinutesTotal = useMemo(() => {
    if (currentArticle?.readTimeMin && currentArticle.readTimeMin > 0) {
      return currentArticle.readTimeMin;
    }
    return Math.max(1, Math.ceil(totalWords / 160));
  }, [currentArticle?.readTimeMin, totalWords]);

  const estimatedMinutesRemaining = useMemo(() => {
    if (isCompleted) return 0;
    const remainingWords = Math.max(0, totalWords - readWords);
    return Math.max(1, Math.ceil(remainingWords / 160));
  }, [isCompleted, totalWords, readWords]);

  const actualReadingTimeMin = useMemo(() => {
    const minutes = Math.round(sessionSeconds / 60);
    return Math.max(1, minutes === 0 ? 1 : minutes);
  }, [sessionSeconds]);

  const nextPage = useCallback(() => {
    setCurrentPageIndex((prev) => {
      if (prev < totalPages - 1) {
        return prev + 1;
      }
      setIsCompleted(true);
      return prev;
    });
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setIsCompleted((completed) => {
      if (completed) {
        return false;
      }
      setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      return false;
    });
  }, []);

  const generateNextArticle = useCallback(async (category: string = "BUSINESS") => {
    setIsCompleted(false);
    setIsGenerating(true);
    setSessionSeconds(0);
    try {
      const newArticle = await apiReadingRepository.generateArticle(category, level);

      setArticles((prev) => {
        const map = new Map<string, ReadingArticle>();
        map.set(newArticle.id, newArticle);
        prev.forEach((art) => map.set(art.id, art));
        const updated = Array.from(map.values());
        try {
          localStorage.setItem(READING_CACHE_KEY, JSON.stringify(updated));
          localStorage.setItem(ACTIVE_ARTICLE_ID_KEY, newArticle.id);
        } catch (e) {
          console.warn("Failed to persist new article to localStorage", e);
        }
        return updated;
      });

      setCurrentArticle(newArticle);
      setCurrentPageIndex(0);
      return newArticle;
    } catch (err) {
      console.warn("Failed to generate AI article", err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [level]);

  const instantWordLookup = useCallback(async (word: string): Promise<WordLookup> => {
    const cleanWord = word.toLowerCase().replace(/[^a-z'-]/g, "").replace(/^-+|-+$/g, "");
    if (!cleanWord) {
      return {
        word: word,
        phonetic: `/${word}/`,
        partOfSpeech: "vocabulary",
        spanishTranslation: word,
        definition: `Vocabulary word: ${word}.`,
        exampleSentence: `"${word} is an essential term."`,
        cefrLevel: level,
      };
    }

    const isValidCache = (entry?: WordLookup) => {
      if (!entry) return false;
      const tr = entry.spanishTranslation?.trim();
      if (!tr || tr === "." || tr === cleanWord) return false;
      if (entry.phonetic?.startsWith("/'") || entry.phonetic === `/${cleanWord}/`) return false;
      if (entry.definition?.startsWith("Key vocabulary term:") && !entry.audioUrl) return false;
      if (entry.definition?.startsWith("Essential professional vocabulary term:")) return false;
      return true;
    };

    if (currentArticle?.vocabularyMap) {
      if (isValidCache(currentArticle.vocabularyMap[cleanWord])) {
        return currentArticle.vocabularyMap[cleanWord];
      }
      const deHyphenated = cleanWord.replace(/-/g, "");
      if (isValidCache(currentArticle.vocabularyMap[deHyphenated])) {
        return currentArticle.vocabularyMap[deHyphenated];
      }
    }

    for (const art of articles) {
      if (art.vocabularyMap && isValidCache(art.vocabularyMap[cleanWord])) {
        return art.vocabularyMap[cleanWord];
      }
    }

    if (inFlightLookupsRef.current.has(cleanWord)) {
      return inFlightLookupsRef.current.get(cleanWord)!;
    }

    const lookupPromise = (async () => {
      try {
        const lookupResult = await apiReadingRepository.lookupWord(cleanWord);

        // Immutable state updates
        setCurrentArticle((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            vocabularyMap: {
              ...(prev.vocabularyMap || {}),
              [cleanWord]: lookupResult,
            },
          };
        });

        setArticles((prev) => {
          const updated = prev.map((art) => {
            if (art.id === currentArticle?.id) {
              return {
                ...art,
                vocabularyMap: {
                  ...(art.vocabularyMap || {}),
                  [cleanWord]: lookupResult,
                },
              };
            }
            return art;
          });
          persistArticlesDebounced(updated);
          return updated;
        });

        return lookupResult;
      } catch (err) {
        return {
          word: cleanWord,
          phonetic: `/${cleanWord}/`,
          partOfSpeech: "vocabulary",
          spanishTranslation: cleanWord,
          definition: `Vocabulary term: ${cleanWord}.`,
          exampleSentence: `"${cleanWord} is an important term in professional communication."`,
          cefrLevel: level,
        };
      } finally {
        inFlightLookupsRef.current.delete(cleanWord);
      }
    })();

    inFlightLookupsRef.current.set(cleanWord, lookupPromise);
    return lookupPromise;
  }, [currentArticle?.id, currentArticle?.vocabularyMap, articles, level, persistArticlesDebounced]);

  const getOrFetchQuiz = useCallback(async (
    articleId: string,
    title: string,
    content: string,
    keywords: string[] = [],
    quizLevel: string = "B1"
  ): Promise<GenerateQuizResponse> => {
    // 1. Check if currentArticle already has the quiz cached in memory
    if (
      currentArticle &&
      (currentArticle.id === articleId || currentArticle.title === title) &&
      currentArticle.quiz &&
      currentArticle.quiz.questions?.length > 0
    ) {
      return currentArticle.quiz;
    }

    // 2. Check if any article in state array has the quiz cached
    const found = articles.find((a) => a.id === articleId || a.title === title);
    if (found?.quiz && found.quiz.questions?.length > 0) {
      return found.quiz;
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
          quizLevel
        );
        if (res && res.questions && res.questions.length > 0) {
          // Immutable state updates
          setCurrentArticle((prev) => {
            if (prev && (prev.id === articleId || prev.title === title)) {
              return { ...prev, quiz: res };
            }
            return prev;
          });

          setArticles((prev) => {
            const updated = prev.map((art) => {
              if (art.id === articleId || art.title === title) {
                return { ...art, quiz: res };
              }
              return art;
            });
            persistArticlesDebounced(updated);
            return updated;
          });
        }
        return res;
      } finally {
        inFlightQuizRef.current.delete(cacheKey);
      }
    })();

    inFlightQuizRef.current.set(cacheKey, quizPromise);
    return quizPromise;
  }, [currentArticle, articles, persistArticlesDebounced]);

  return {
    articles,
    currentArticle,
    currentPageIndex,
    totalPages,
    progressPercentage,
    currentPageContent,
    fullContent,
    totalWords,
    readWords,
    estimatedMinutesTotal,
    estimatedMinutesRemaining,
    actualReadingTimeMin,
    isLoading: isQueryLoading && articles.length === 0,
    isGenerating,
    isCompleted,
    nextPage,
    prevPage,
    generateNextArticle,
    instantWordLookup,
    getOrFetchQuiz,
  };
};
