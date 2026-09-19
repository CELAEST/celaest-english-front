/**
 * Proportional Dynamic Typography Helpers for Memory Flashcards
 * Adjusts font sizes responsively based on string length to maximize impact and prevent overflow.
 */

export const sanitizeQuotes = (text?: string): string => {
  if (!text) return "";
  return text.replace(/^["'“”«»\s]+|["'“”«»\s]+$/g, "").trim();
};

export const getDynamicDefinitionClass = (text: string): string => {
  const len = text.trim().length;
  if (len <= 32) {
    return "text-2xl sm:text-3xl lg:text-3xl font-light tracking-wide";
  }
  if (len <= 65) {
    return "text-xl sm:text-2xl font-normal";
  }
  if (len <= 110) {
    return "text-lg sm:text-xl font-normal";
  }
  return "text-base sm:text-lg font-normal leading-relaxed";
};

/**
 * Dynamic sizing for back-face translations when paired with explanations in Speaking/Writing cards
 */
export const getDynamicBackTranslationClass = (
  text: string,
  hasLongExplanation: boolean = false,
): string => {
  const len = text.trim().length;
  if (hasLongExplanation) {
    if (len <= 45) return "text-sm xs:text-base sm:text-lg font-medium";
    if (len <= 85) return "text-xs xs:text-sm sm:text-base font-normal";
    return "text-xs xs:text-xs sm:text-sm font-normal";
  }
  if (len <= 35) return "text-lg xs:text-xl sm:text-2xl font-normal";
  if (len <= 75) return "text-base xs:text-lg sm:text-xl font-normal";
  return "text-sm xs:text-base sm:text-lg font-normal";
};

export const getDynamicExplanationClass = (text: string): string => {
  const len = text.trim().length;
  if (len <= 55) {
    return "text-sm sm:text-base lg:text-lg font-normal text-white/90 leading-snug sm:leading-relaxed";
  }
  if (len <= 110) {
    return "text-[13px] sm:text-sm lg:text-base font-normal text-white/85 leading-snug sm:leading-relaxed";
  }
  if (len <= 180) {
    return "text-xs sm:text-[13px] lg:text-sm font-normal text-white/80 leading-snug sm:leading-relaxed";
  }
  return "text-[11.5px] xs:text-[12px] sm:text-xs font-normal text-white/75 leading-relaxed";
};

/**
 * Proportional Dynamic Typography for Front Face Sentences (YOU SAID / BETTER WAY)
 * Scales up short sentences so they look bold, impressive and don't leave empty voids,
 * while scaling down longer multi-clause sentences so they never overflow.
 */
export const getDynamicSpeakingSentenceClass = (text: string): string => {
  const len = text.trim().length;
  if (len <= 35) {
    // Short punchy phrase (e.g. "my team and I is communicating" - 33 chars)
    return "text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-normal leading-snug tracking-tight";
  }
  if (len <= 65) {
    // Medium phrase
    return "text-lg xs:text-xl sm:text-xl lg:text-2xl font-normal leading-snug sm:leading-normal";
  }
  if (len <= 110) {
    // Longer phrase
    return "text-base xs:text-[17px] sm:text-lg lg:text-xl font-normal leading-normal";
  }
  // Very long multi-clause sentence
  return "text-[13.5px] xs:text-[14.5px] sm:text-base font-normal leading-relaxed";
};
