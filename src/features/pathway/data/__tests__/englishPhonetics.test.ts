import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  PHONETIC_CATEGORIES,
  ENGLISH_PHONETICS_DATA,
} from "../englishPhoneticsData";
import phoneticsManifest from "../phoneticsAudioManifest.json";

describe("English Phonetics guide — complete 44 phonemes integrity", () => {
  it("contains exactly 44 phonemes across all 5 categories", () => {
    expect(ENGLISH_PHONETICS_DATA.length).toBe(44);
    const sumCategories = PHONETIC_CATEGORIES.reduce((acc, cat) => acc + cat.symbolCount, 0);
    expect(sumCategories).toBe(44);

    for (const cat of PHONETIC_CATEGORIES) {
      const sounds = ENGLISH_PHONETICS_DATA.filter((s) => s.category === cat.id);
      expect(sounds.length).toBe(cat.symbolCount);
    }
  });

  it("every phonetic sound has valid IPA formatting, sample word, and howItSounds instruction", () => {
    for (const sound of ENGLISH_PHONETICS_DATA) {
      expect(sound.ipa).toMatch(/^\/.*\/$/);
      expect(sound.howItSounds.trim().length).toBeGreaterThan(5);
      expect(sound.isolatedAudio.trim().length).toBeGreaterThan(0);
      expect(sound.sampleWord.trim().length).toBeGreaterThan(0);
      expect(sound.sampleIpa).toMatch(/^\/.*\/$/);
      expect(sound.mouthTip.trim().length).toBeGreaterThan(5);
    }
  });

  it("includes all essential milestone sounds (/ə/, /iː/, /ɪ/, /θ/, /ð/, /v/, /ŋ/, /ɹ/, /w/)", () => {
    const ipaList = ENGLISH_PHONETICS_DATA.map((s) => s.ipa);
    expect(ipaList).toContain("/ə/");
    expect(ipaList).toContain("/iː/");
    expect(ipaList).toContain("/ɪ/");
    expect(ipaList).toContain("/θ/");
    expect(ipaList).toContain("/ð/");
    expect(ipaList).toContain("/v/");
    expect(ipaList).toContain("/ŋ/");
    expect(ipaList).toContain("/ɹ/");
    expect(ipaList).toContain("/w/");
  });

  it("every single phoneme and sample word exists on disk in public/audio/phonetics", () => {
    const manifest = phoneticsManifest as Record<string, string>;
    for (const sound of ENGLISH_PHONETICS_DATA) {
      const relPath = manifest[sound.id];
      expect(relPath, `Sound ${sound.id} must be in manifest`).toBeDefined();
      const absPath = path.resolve(process.cwd(), "public", relPath.replace(/^\//, ""));
      expect(fs.existsSync(absPath), `File ${absPath} must exist on disk`).toBe(true);
      const stat = fs.statSync(absPath);
      expect(stat.size, `File ${absPath} must be > 1KB`).toBeGreaterThan(1000);

      const wordKey = `word:${sound.sampleWord.toLowerCase().trim()}`;
      const wordRelPath = manifest[wordKey];
      expect(wordRelPath, `Word ${sound.sampleWord} must be in manifest`).toBeDefined();
      const wordAbsPath = path.resolve(process.cwd(), "public", wordRelPath.replace(/^\//, ""));
      expect(fs.existsSync(wordAbsPath), `Word file ${wordAbsPath} must exist on disk`).toBe(true);
      const wordStat = fs.statSync(wordAbsPath);
      expect(wordStat.size, `Word file ${wordAbsPath} must be > 1KB`).toBeGreaterThan(1000);
    }
  });
});
