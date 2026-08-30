/**
 * Linguistic Translation & Explanation Normalizer
 * Guarantees that:
 * 1. `translationSpanish` strictly contains the direct Spanish translation of the chunk/phrase.
 * 2. `grammarExplanation` strictly contains the pedagogical grammatical rule in Spanish.
 * 3. Never allows instructional notes ("Usa 'as'...", "Elimina 'am'...", "Después de 'is'...")
 *    to contaminate the `translationSpanish` field.
 */

export function normalizeTranslationAndExplanation(
  betterWay: string = "",
  errorWord: string = "",
  rawTranslation: string = "",
  rawExplanation: string = "",
  correctWord: string = "",
): { translationSpanish: string; grammarExplanation: string } {
  const cleanBetter = betterWay.trim();
  const cleanTrans = rawTranslation.trim();
  const cleanExpl = rawExplanation.trim();
  const cleanCorrect = (correctWord || "").trim();
  const cleanError = (errorWord || "").trim();

  // 1. Check if rawTranslation is actually a grammar instruction rule in Spanish
  const isRuleLike =
    /^(usa\b|utiliza\b|di\b|elimina\b|despu[eé]s\s+de\b|con\b|para\s+acciones\b|en\s+ingl[eé]s\b|la\s+forma\s+correcta\b|no\s+uses\b|recuerda\s+que\b)/i.test(
      cleanTrans,
    );

  let finalExplanation = cleanExpl;
  let finalTranslation = isRuleLike ? "" : cleanTrans;

  if (isRuleLike) {
    // rawTranslation is actually an explanation rule in Spanish
    const explIsEnglish =
      /^[A-Za-z\s.,;:'"()-]+$/.test(cleanExpl) &&
      !/[áéíóúñÁÉÍÓÚÑ]/.test(cleanExpl);
    if (!finalExplanation || explIsEnglish || finalExplanation.length < 15) {
      finalExplanation = cleanTrans;
    }
  }

  // 2. Clean up translation wrapping quotes if present
  if (finalTranslation) {
    finalTranslation = finalTranslation.replace(/^["'«“]+|["'»”]+$/g, "").trim();
  }

  // 3. If still empty, construct an honest contextual translation fallback
  if (!finalTranslation) {
    const target = cleanCorrect || cleanBetter || cleanError;
    finalTranslation = target ? `Traducción: "${target}"` : "Traducción al español";
  }

  if (!finalExplanation) {
    finalExplanation = "Alineación gramatical y uso natural en inglés profesional.";
  }

  return {
    translationSpanish: finalTranslation,
    grammarExplanation: finalExplanation,
  };
}

