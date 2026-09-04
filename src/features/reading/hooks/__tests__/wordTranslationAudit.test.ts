import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useReadingArticles } from "../useReadingArticles";
import { apiReadingRepository } from "../../../../infrastructure/repositories/ApiReadingRepository";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const mockDictionary: Record<string, { translation: string; phonetic: string }> = {
  as: { translation: "como", phonetic: "/æz/" },
  the: { translation: "el", phonetic: "/ðiː/" },
  is: { translation: "es", phonetic: "/ɪz/" },
  are: { translation: "son", phonetic: "/ɑːr/" },
  was: { translation: "fue", phonetic: "/wɒz/" },
  be: { translation: "ser", phonetic: "/biː/" },
  have: { translation: "tener", phonetic: "/hæv/" },
  has: { translation: "tiene", phonetic: "/hæz/" },
  do: { translation: "hacer", phonetic: "/duː/" },
  does: { translation: "hace", phonetic: "/dʌz/" },
  will: { translation: "será", phonetic: "/wɪl/" },
  would: { translation: "haría", phonetic: "/wʊd/" },
  this: { translation: "este", phonetic: "/ðɪs/" },
  that: { translation: "ese", phonetic: "/ðæt/" },
  it: { translation: "eso", phonetic: "/ɪt/" },
  at: { translation: "en", phonetic: "/æt/" },
  by: { translation: "por", phonetic: "/baɪ/" },
  for: { translation: "para", phonetic: "/fɔːr/" },
  with: { translation: "con", phonetic: "/wɪð/" },
  from: { translation: "desde", phonetic: "/frɒm/" },
  "as well as": { translation: "así como / además de", phonetic: "/æz wɛl æz/" },
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(QueryClientProvider, { client: qc }, children);
};

describe("Reading word translation audit — 'as' must not translate to 'as'", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(apiReadingRepository, "getArticles").mockResolvedValue([]);
    vi.spyOn(apiReadingRepository, "lookupWord").mockImplementation(async (word: string) => {
      const match = mockDictionary[word.toLowerCase()] || { translation: "traducción", phonetic: "/tɛst/" };
      return {
        word,
        spanishTranslation: match.translation,
        phonetic: match.phonetic,
        partOfSpeech: "vocabulary",
        definition: `Vocabulary term: ${word}.`,
        exampleSentence: `Using '${word}' in context.`,
        cefrLevel: "B1",
      };
    });
  });

  const stopwords = [
    { word: "as", expected: "como" },
    { word: "the", expected: "el" },
    { word: "is", expected: "es" },
    { word: "are", expected: "son" },
    { word: "was", expected: "fue" },
    { word: "be", expected: "ser" },
    { word: "have", expected: "tener" },
    { word: "has", expected: "tiene" },
    { word: "do", expected: "hacer" },
    { word: "does", expected: "hace" },
    { word: "will", expected: "será" },
    { word: "would", expected: "haría" },
    { word: "this", expected: "este" },
    { word: "that", expected: "ese" },
    { word: "it", expected: "eso" },
    { word: "at", expected: "en" },
    { word: "by", expected: "por" },
    { word: "for", expected: "para" },
    { word: "with", expected: "con" },
    { word: "from", expected: "desde" },
  ];

  it.each(stopwords)("'$word' spanishTranslation must not be '$word' and must be '$expected' or valid", async ({ word, expected }) => {
    const { result } = renderHook(() => useReadingArticles("B1"), { wrapper });
    // Wait a tick for hook to initialize
    await new Promise((r) => setTimeout(r, 10));
    const data = await result.current.instantWordLookup(word, `This is ${word} a test.`);
    // Translation must not be English itself
    expect(data.spanishTranslation.toLowerCase().trim()).not.toBe(word.toLowerCase());
    expect(data.spanishTranslation.trim()).not.toBe(".");
    expect(data.spanishTranslation.trim().length).toBeGreaterThan(1);
    if (expected) {
      expect(typeof data.spanishTranslation).toBe("string");
    }
    // For the critical 'as' case, check it's 'como' (or contains como)
    if (word === "as") {
      expect(data.spanishTranslation.toLowerCase()).toMatch(/como/);
    }
    // Phonetic must not be just /word/
    expect(data.phonetic).not.toBe(`/${word}/`);
    expect(data.phonetic.length).toBeGreaterThan(3);
  });

  it("phrasal 'as well as' must have spanishTranslation not equal to itself", async () => {
    const { result } = renderHook(() => useReadingArticles("B1"), { wrapper });
    await new Promise((r) => setTimeout(r, 10));
    const data = await result.current.instantWordLookup("as well as", "He is smart as well as kind.");
    expect(data.spanishTranslation.toLowerCase().trim()).not.toBe("as well as");
    expect(data.spanishTranslation.length).toBeGreaterThan(5);
  });
});
