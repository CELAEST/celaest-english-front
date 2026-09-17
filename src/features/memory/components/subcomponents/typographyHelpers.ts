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

export const getDynamicExplanationClass = (text: string): string => {
  const len = text.trim().length;
  if (len <= 55) {
    return "text-base sm:text-lg lg:text-xl font-normal text-white/85";
  }
  if (len <= 110) {
    return "text-sm sm:text-base lg:text-lg font-normal text-white/80";
  }
  if (len <= 180) {
    return "text-xs sm:text-sm lg:text-base font-normal text-white/75";
  }
  return "text-xs sm:text-sm font-normal text-white/70 leading-relaxed";
};
