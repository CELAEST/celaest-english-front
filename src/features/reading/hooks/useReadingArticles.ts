import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReadingArticle } from "../../../domain/entities/ReadingArticle";
import { WordLookup, GenerateQuizResponse } from "../../../domain/repositories/IReadingRepository";
import { apiReadingRepository } from "../../../infrastructure/repositories/ApiReadingRepository";
import { AiReadingArticleGenerator } from "../services/aiReadingArticleGenerator";
import { QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { directClientAiService } from "../../settings/services/directClientAiService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { logger } from "../../../shared/utils/logger";
import { phoneticLookupService } from "../services/phoneticLookupService";
import { onDeviceTranslatorService } from "../services/onDeviceTranslatorService";
import { getUniversalSeedArticle } from "../services/universalSeedArticles";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";

const READING_CACHE_KEY = "lingua_reading_articles_v2";
const ACTIVE_ARTICLE_ID_KEY = "lingua_reading_active_id_v2";

function getReadingCacheKey(userId?: string): string {
  if (userId && userId !== "anon") {
    return `lingua:user:${userId}:reading_articles_v2`;
  }
  return READING_CACHE_KEY;
}

function getActiveArticleIdKey(userId?: string): string {
  if (userId && userId !== "anon") {
    return `lingua:user:${userId}:reading_active_id_v2`;
  }
  return ACTIVE_ARTICLE_ID_KEY;
}

/**
 * Dynamic Viewport & Container-Calibrated Word Budget:
 * Calculates ideal words per page based on measured container dimensions and active font size.
 * Guarantees:
 * - Zero vertical scroll / clipping across mobile, tablet, laptop, and desktop.
 * - Prudent clearance (~20px-26px) above ReadingBottomBar so text NEVER collides.
 * - Symmetrical Container Fill: eliminates artificial empty voids by adapting to true line capacity.
 */
export function getTargetWordsForDimensions(
  width: number,
  height: number,
  fontSizeIndex: number = 0,
): number {
  const isMobile = width < 640;
  // Reserve space only for the Hint Pill (~28px) + small breathing buffer (~8px)
  // NOTE: Header, ArticleHeader, and BottomBar are already excluded by flex layout — do NOT double-count
  const hintAndBreathing = isMobile ? 36 : 40;
  const usableHeight = Math.max(60, height - hintAndBreathing);
  const isLargeFont = fontSizeIndex === 1;

  // Exact typographic line heights (matching Tailwind leading):
  // Estándar: mobile 17px * 1.75 ≈ 30px, desktop 18.5px * 1.85 ≈ 34.5px
  // Grande: mobile 19px * 1.8 ≈ 34.5px, desktop 20.5px * 1.9 ≈ 39px
  const lineHeight = isLargeFont ? (isMobile ? 34.5 : 39) : (isMobile ? 30 : 34.5);
  const maxLines = Math.max(2, Math.floor(usableHeight / lineHeight));

  // Effective text column width (capped at 680px by max-w-[680px])
  const effectiveWidth = Math.min(Math.max(280, width), 680);

  // Exact English word width including interactive button padding:
  // Estándar: mobile ~52px (6-7 words/line on 350px), desktop ~68px (10 words/line on 680px)
  // Grande:   mobile ~64px (5-6 words/line on 350px), desktop ~80px (8 words/line on 680px)
  const pxPerWord = isLargeFont ? (isMobile ? 64 : 80) : (isMobile ? 52 : 68);
  const wordsPerLine = Math.max(4, Math.floor(effectiveWidth / pxPerWord));

  // Natural capacity of the container with responsive safety margin:
  // Mobile needs less safety margin because narrow columns wrap more predictably
  const rawTarget = maxLines * wordsPerLine;
  const safetyFactor = isMobile ? 0.92 : 0.88;
  const targetWords = Math.floor(rawTarget * safetyFactor);

  // Enforce sensible boundary: minimum 16 words (mobile mini), safe maximum for the space
  return Math.max(16, targetWords);
}

export function getTargetWordsForHeight(height: number, fontSizeIndex: number = 0): number {
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 640 : false;
  // Estimate usable reader container height from window height by reserving space for orb, headers, dock/bottom bar
  const fixedOverhead = isMobile ? 280 : 360;
  const estimatedContainerHeight = Math.max(120, height - fixedOverhead);
  return getTargetWordsForDimensions(
    typeof window !== "undefined" ? window.innerWidth : 680,
    estimatedContainerHeight,
    fontSizeIndex,
  );
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Splits text into complete sentences, preserving end punctuation (. ! ?).
 */
function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  const regex = /[^.!?]+[.!?]+["')\]]?\s*/g;
  const matches = text.match(regex);
  if (!matches || matches.length === 0) {
    return [text.trim()];
  }
  const sentences = matches.map((s) => s.trim()).filter(Boolean);
  const matchedLength = sentences.reduce((acc, s) => acc + s.length, 0);
  const remaining = text.slice(matchedLength).trim();
  if (remaining) {
    if (sentences.length > 0) {
      sentences[sentences.length - 1] += " " + remaining;
    } else {
      sentences.push(remaining);
    }
  }
  return sentences;
}

/**
 * Attempts to distribute sentences evenly across numPages so that no page exceeds maxWordsPerPage.
 */
function tryDistributeSentences(
  sentences: string[],
  numPages: number,
  maxWordsPerPage: number,
): string[] | null {
  const totalWords = sentences.reduce((acc, s) => acc + countWords(s), 0);
  const targetWordsPerPage = Math.ceil(totalWords / numPages);

  const pages: string[] = [];
  let currentSentences: string[] = [];
  let currentWords = 0;
  let sIndex = 0;

  for (let p = 0; p < numPages; p++) {
    const isLastPage = p === numPages - 1;
    currentSentences = [];
    currentWords = 0;

    if (isLastPage) {
      while (sIndex < sentences.length) {
        const s = sentences[sIndex];
        const sWords = countWords(s);
        currentWords += sWords;
        currentSentences.push(s);
        sIndex++;
      }
      if (currentWords > maxWordsPerPage || currentSentences.length === 0) {
        return null;
      }
      pages.push(currentSentences.join(" "));
    } else {
      while (sIndex < sentences.length) {
        const s = sentences[sIndex];
        const sWords = countWords(s);
        const remainingSentencesCount = sentences.length - (sIndex + 1);
        const remainingPagesCount = numPages - (p + 1);

        if (remainingSentencesCount < remainingPagesCount) {
          break;
        }

        if (currentSentences.length > 0 && currentWords + sWords > maxWordsPerPage) {
          break;
        }

        currentWords += sWords;
        currentSentences.push(s);
        sIndex++;

        if (currentWords >= targetWordsPerPage && remainingSentencesCount >= remainingPagesCount) {
          break;
        }
      }

      if (currentSentences.length === 0) {
        return null;
      }
      pages.push(currentSentences.join(" "));
    }
  }

  return sIndex === sentences.length ? pages : null;
}

function greedyPackSentences(sentences: string[], maxWordsPerPage: number): string[] {
  const pages: string[] = [];
  let currentChunk: string[] = [];
  let currentCount = 0;

  for (const sentence of sentences) {
    const sWords = countWords(sentence);
    if (currentChunk.length > 0 && currentCount + sWords > maxWordsPerPage) {
      pages.push(currentChunk.join(" "));
      currentChunk = [sentence];
      currentCount = sWords;
    } else {
      currentChunk.push(sentence);
      currentCount += sWords;
    }
  }

  if (currentChunk.length > 0) {
    pages.push(currentChunk.join(" "));
  }

  return pages;
}

/**
 * Smart Viewport-Adaptive Paginator:
 * - Strict Zero-Scroll Guarantee: ensures every page fits completely inside the container.
 * - Symmetrical Natural Fill: balances sentences across pages to prevent artificial purple voids.
 * - Zero-Orphan Protection: strictly prevents 1-4 word stub pages by rebalancing pages evenly.
 * - Sentence Boundary Integrity: never splits words in the middle of sentences or phrases.
 */
function paginateText(fullText: string, maxWordsPerPage: number): string[] {
  if (!fullText) return [];
  const words = fullText.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  // Single page if entire text fits safely in container capacity
  if (words.length <= maxWordsPerPage) {
    return [fullText.trim()];
  }

  const sentences = splitIntoSentences(fullText);
  if (sentences.length <= 1) {
    const numPages = Math.ceil(words.length / maxWordsPerPage);
    const wordsPerPage = Math.ceil(words.length / numPages);
    const pages: string[] = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pages.push(words.slice(i, i + wordsPerPage).join(" "));
    }
    return pages;
  }

  // Find balanced sentence distribution starting from minimum theoretical pages
  let numPages = Math.max(2, Math.ceil(words.length / maxWordsPerPage));

  while (numPages <= sentences.length) {
    const balancedPages = tryDistributeSentences(sentences, numPages, maxWordsPerPage);
    if (balancedPages !== null) {
      // Check if last page has at least 10 words or is balanced
      const lastWords = countWords(balancedPages[balancedPages.length - 1]);
      if (lastWords >= 10 || balancedPages.length === 1) {
        return balancedPages;
      }
    }
    numPages++;
  }

  // Fallback: greedy pack sentences
  const greedyPages = greedyPackSentences(sentences, maxWordsPerPage);

  // Rebalance last two pages if last page is an orphan stub (< 12 words)
  if (greedyPages.length > 1) {
    const lastWords = countWords(greedyPages[greedyPages.length - 1]);
    if (lastWords < 12) {
      const combined = greedyPages[greedyPages.length - 2] + " " + greedyPages[greedyPages.length - 1];
      const lastTwoSentences = splitIntoSentences(combined);
      const rebalanced = tryDistributeSentences(lastTwoSentences, 2, maxWordsPerPage);
      if (rebalanced && rebalanced.length === 2) {
        greedyPages[greedyPages.length - 2] = rebalanced[0];
        greedyPages[greedyPages.length - 1] = rebalanced[1];
      }
    }
  }

  return greedyPages;
}

interface InitialReadingState {
  cachedArticles: ReadingArticle[];
  activeArticleId: string | null;
}

function matchesRole(art: ReadingArticle | undefined | null, targetProfession?: string): boolean {
  if (!art || !targetProfession) return true;
  const p = targetProfession.trim().toLowerCase();
  if (p === "" || p === "professional" || p === "general") return true;
  const artProf = (art.profession || "").toLowerCase();
  if (artProf && (artProf === p || artProf.includes(p) || p.includes(artProf))) return true;
  const text = `${art.content || ""} ${art.title || ""} ${art.excerpt || ""} ${art.category || ""}`.toLowerCase();
  return text.includes(p);
}

/** One-time mount read of the persisted reading cache filtered strictly to target level and profession. */
function readInitialState(level?: string, profession?: string, userId?: string): InitialReadingState {
  let cachedArticles: ReadingArticle[] = [];
  try {
    const key = getReadingCacheKey(userId);
    let cachedStr = localStorage.getItem(key);
    if (!cachedStr && userId && userId !== "anon") {
      cachedStr = localStorage.getItem(READING_CACHE_KEY);
    }
    if (cachedStr) {
      const parsed = JSON.parse(cachedStr) as unknown;
      if (Array.isArray(parsed)) {
        cachedArticles = (parsed as ReadingArticle[]).filter((a) => {
          if (!a || !a.id) return false;
          if (level && a.cefrLevel && a.cefrLevel.toUpperCase() !== level.toUpperCase()) return false;
          if (profession && !matchesRole(a, profession)) return false;
          return true;
        });
      }
    }
  } catch (e) {
    logger.warn("Failed to load reading cache from localStorage", e);
  }

  if (cachedArticles.length === 0) {
    const seed = getUniversalSeedArticle(level || "B1", profession);
    cachedArticles = [seed];
  }

  const activeKey = getActiveArticleIdKey(userId);
  let storedActiveId = typeof window !== "undefined" ? localStorage.getItem(activeKey) : null;
  if (!storedActiveId && userId && userId !== "anon") {
    storedActiveId = localStorage.getItem(ACTIVE_ARTICLE_ID_KEY);
  }
  const activeArticleId =
    storedActiveId && cachedArticles.some((a) => a.id === storedActiveId)
      ? storedActiveId
      : (cachedArticles[0]?.id ?? null);

  return { cachedArticles, activeArticleId };
}

export const useReadingArticles = (
  level?: string,
  profession?: string,
  fontSizeIndex: number = 0,
  containerDimensions?: { width: number; height: number },
) => {
  const currentUserId = SupabaseAuthAdapter.getInstance().getStoredUser()?.id;
  const inFlightLookupsRef = useRef<Map<string, Promise<WordLookup>>>(new Map());
  const inFlightQuizRef = useRef<Map<string, Promise<GenerateQuizResponse>>>(new Map());

  const [{ cachedArticles, activeArticleId: initialActiveId }] = useState(() =>
    readInitialState(level, profession, currentUserId),
  );

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
    queryKey: QUERY_KEYS.reading.articles(level ?? "B1", profession),
    queryFn: () => apiReadingRepository.getArticles(level!, profession),
    enabled: Boolean(level),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const matchesProfession = useCallback(
    (art?: ReadingArticle | null) => {
      if (!art || !profession || profession.toLowerCase() === "professional" || profession.toLowerCase() === "general") {
        return true;
      }
      const p = profession.toLowerCase();
      const artProf = (art.profession || "").toLowerCase();
      if (artProf && (artProf === p || artProf.includes(p) || p.includes(artProf))) {
        return true;
      }
      const content = (art.content || "").toLowerCase();
      const title = (art.title || "").toLowerCase();
      const excerpt = (art.excerpt || "").toLowerCase();
      const category = (art.category || "").toLowerCase();
      return content.includes(p) || title.includes(p) || excerpt.includes(p) || category.includes(p);
    },
    [profession],
  );

  /** Server list merged with local session articles (local session articles take priority). */
  const articles = useMemo(() => {
    const serverList = Array.isArray(fetchedArticles) ? fetchedArticles : [];
    const localList = Array.isArray(localArticles) ? localArticles : [];
    if (serverList.length === 0) return localList;
    if (localList.length === 0) return serverList;
    const map = new Map<string, ReadingArticle>();
    localList.forEach((art) => {
      if (art && art.id) map.set(art.id, art);
    });
    serverList.forEach((art) => {
      if (art && art.id && !map.has(art.id)) {
        map.set(art.id, art);
      }
    });
    return Array.from(map.values());
  }, [fetchedArticles, localArticles]);

  const matchingLevelArticles = useMemo(() => {
    const byLevel = articles.filter(
      (a) => Boolean(a) && (!level || a.cefrLevel?.toUpperCase() === level.toUpperCase()),
    );
    const isSpecificProf =
      profession &&
      profession.toLowerCase() !== "professional" &&
      profession.toLowerCase() !== "general";
    if (isSpecificProf) {
      return byLevel.filter(matchesProfession);
    }
    return byLevel;
  }, [articles, level, matchesProfession, profession]);

  const currentArticle = useMemo(
    () => {
      const active = articles.find((a) => Boolean(a) && a.id === activeArticleId);
      if (active && (!level || active.cefrLevel?.toUpperCase() === level.toUpperCase()) && matchesProfession(active)) {
        return active;
      }
      return matchingLevelArticles[0] ?? null;
    },
    [articles, activeArticleId, level, matchingLevelArticles, matchesProfession],
  );

  // Restore a stored-active article that only exists server-side cleanly via effect
  const hasInitializedServerSelection = useRef(false);
  useEffect(() => {
    if (!hasInitializedServerSelection.current && Array.isArray(fetchedArticles) && fetchedArticles.length > 0) {
      hasInitializedServerSelection.current = true;
      if (activeArticleId) {
        const current = articles.find((a) => a && a.id === activeArticleId);
        if (
          current &&
          matchesProfession(current) &&
          (!level || current.cefrLevel?.toUpperCase() === level.toUpperCase())
        ) {
          return;
        }
      }

      const storedActiveId = typeof window !== "undefined" ? localStorage.getItem(getActiveArticleIdKey(currentUserId)) : null;
      const storedArt = storedActiveId ? articles.find((a) => a && a.id === storedActiveId) : null;
      const restored =
        (storedArt && matchesProfession(storedArt) ? storedArt : null) ||
        matchingLevelArticles[0] ||
        fetchedArticles.find(matchesProfession) ||
        fetchedArticles[0];
      if (restored && restored.id && restored.id !== activeArticleId) {
        setActiveArticleId(restored.id);
      }
    }
  }, [fetchedArticles, matchingLevelArticles, articles, activeArticleId, matchesProfession, level]);

  const prevLevelRef = useRef(level);
  const prevProfRef = useRef(profession);
  useEffect(() => {
    if (prevLevelRef.current !== level || prevProfRef.current !== profession) {
      prevLevelRef.current = level;
      prevProfRef.current = profession;
      setCurrentPageIndex(0);
      setHasFinishedArticle(false);

      const currentActive = articles.find((a) => a && a.id === activeArticleId);
      const stillValid =
        currentActive &&
        (!level || currentActive.cefrLevel?.toUpperCase() === level.toUpperCase()) &&
        matchesProfession(currentActive);

      if (!stillValid) {
        const matching = matchingLevelArticles[0];
        if (matching && matching.id) {
          setActiveArticleId(matching.id);
        } else {
          setActiveArticleId(null);
        }
      }
    }
  }, [level, profession, matchingLevelArticles, articles, activeArticleId, matchesProfession]);

  // Reset per-article session telemetry whenever the active article changes
  const lastTrackedArticleIdRef = useRef<string | null>(initialActiveId);
  useEffect(() => {
    if (lastTrackedArticleIdRef.current !== activeArticleId) {
      lastTrackedArticleIdRef.current = activeArticleId;
      setSessionSeconds(0);
      setHasFinishedArticle(false);
    }
  }, [activeArticleId]);

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
        localStorage.setItem(getReadingCacheKey(currentUserId), JSON.stringify(cappedArticles));
        localStorage.setItem(getActiveArticleIdKey(currentUserId), activeArticleId ?? "");
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

  const targetWords = useMemo(() => {
    if (containerDimensions && containerDimensions.width > 0 && containerDimensions.height > 0) {
      return getTargetWordsForDimensions(
        containerDimensions.width,
        containerDimensions.height,
        fontSizeIndex,
      );
    }
    return getTargetWordsForHeight(viewportHeight, fontSizeIndex);
  }, [containerDimensions, viewportHeight, fontSizeIndex]);
  const dynamicPages = useMemo(
    () => paginateText(fullContent, targetWords),
    [fullContent, targetWords],
  );

  const totalPages = Math.max(1, dynamicPages.length);
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), totalPages - 1);
  const progressPercentage = Math.min(100, Math.round(((safePageIndex + 1) / totalPages) * 100));
  const currentPageContent = dynamicPages[safePageIndex] || dynamicPages[0] || fullContent;

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
    async (category: string = "CAREER") => {
      setIsGenerating(true);
      try {
        const effectiveCategory =
          category === "BUSINESS" && profession && profession.toLowerCase() !== "professional" && profession.toLowerCase() !== "general"
            ? "CAREER"
            : category;
        const newArticle = await AiReadingArticleGenerator.generateArticle({
          category: effectiveCategory,
          level,
          profession,
        });

        setLocalArticles((prev) => {
          const next = [newArticle, ...prev.filter((a) => a.id !== newArticle.id)];
          try {
            localStorage.setItem(getReadingCacheKey(currentUserId), JSON.stringify(next.slice(0, 8)));
            localStorage.setItem(getActiveArticleIdKey(currentUserId), newArticle.id);
          } catch {}
          return next;
        });
        setActiveArticleId(newArticle.id);
        setCurrentPageIndex(0);
        setHasFinishedArticle(false);
        setSessionSeconds(0);
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

      const persistWordTranslation = (tr: string, source: string, resolutionTimeMs: number) => {
        if (!currentArticleRef.current) return;
        const currentArt = currentArticleRef.current;
        const lowerKey = cleanWord.toLowerCase();
        const existingEntry = currentArt.vocabularyMap?.[lowerKey];
        const rawPhonetic = existingEntry?.phonetic;
        const validPhonetic =
          rawPhonetic && rawPhonetic !== `/${cleanWord}/` && !rawPhonetic.startsWith("/'")
            ? rawPhonetic
            : phoneticLookupService.getPhonetic(cleanWord);

        const updatedEntry: WordLookup = {
          word: cleanWord,
          phonetic: validPhonetic,
          partOfSpeech:
            existingEntry?.partOfSpeech || (cleanWord.includes(" ") ? "phrasal verb" : "vocabulary"),
          spanishTranslation: tr,
          definition: existingEntry?.definition || `Meaning of '${cleanWord}' in context.`,
          exampleSentence: context || existingEntry?.exampleSentence || `"${cleanWord}"`,
          cefrLevel: existingEntry?.cefrLevel || level || "B1",
          audioUrl: existingEntry?.audioUrl,
          metadata: {
            lexicalSource: existingEntry?.metadata?.lexicalSource || source,
            translationSource: source,
            cacheHit: false,
            resolutionTimeMs,
          },
        };

        upsertLocalArticle({
          ...currentArt,
          vocabularyMap: {
            ...(currentArt.vocabularyMap ?? {}),
            [lowerKey]: updatedEntry,
          },
        });
      };

      // 1. Tier 1: Try On-Device Translation API (Chrome 138+ / WICG Built-in AI) - 0 tokens, 0 network
      if (onDeviceTranslatorService.isSupported()) {
        try {
          const onDeviceTr = await onDeviceTranslatorService.translate(cleanWord, { context });
          if (onDeviceTr) {
            persistWordTranslation(onDeviceTr, "on_device_browser", 10);
            return onDeviceTr;
          }
        } catch {
          // Graceful fallback to remote BYOK provider
        }
      }

      // 2. Tier 2: Remote BYOK LLM Provider
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

      if (cleanTranslation) {
        persistWordTranslation(cleanTranslation, `client_${activeProvider}`, 120);
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
          phonetic: phoneticLookupService.getPhonetic(word),
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

          // If backend returned untranslated or empty translation, attempt on-device translation first, then client BYOK
          if (!lookupResult.spanishTranslation || lookupResult.metadata?.translationSource === "untranslated") {
            try {
              // 1. Try On-Device Translation API (Chrome 138+) - 0 tokens
              if (onDeviceTranslatorService.isSupported()) {
                const onDeviceTr = await onDeviceTranslatorService.translate(cleanWord, { context });
                if (onDeviceTr) {
                  lookupResult.spanishTranslation = onDeviceTr;
                  if (lookupResult.metadata) {
                    lookupResult.metadata.translationSource = "on_device_browser";
                  }
                }
              }

              // 2. Fall back to BYOK LLM if still untranslated
              if (!lookupResult.spanishTranslation || lookupResult.metadata?.translationSource === "untranslated") {
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
              }
            } catch {
              // Direct BYOK translation error ignored; fallback modal will be presented to user
            }
          }

          // Ensure phonetic is valid IPA and never a fallback /word/ string
          const strippedPhonetic = (lookupResult.phonetic || "").replace(/^\/+|\/+$/g, "").trim().toLowerCase();
          if (!lookupResult.phonetic || strippedPhonetic === cleanWord) {
            lookupResult.phonetic = phoneticLookupService.getPhonetic(cleanWord);
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
            phonetic: phoneticLookupService.getPhonetic(cleanWord),
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
    isLoading: isQueryLoading && !currentArticle,
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
