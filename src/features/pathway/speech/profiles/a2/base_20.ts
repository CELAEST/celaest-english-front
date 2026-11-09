import { BaseSpeechProfile, PAUSE } from "../../types";

/**
 * A2 Base 20 — El Propósito Limpio: To + Verbo.
 *
 * Dos casos de la misma regla:
 *  1. propósito afirmativo → to + verbo base  → "She saved money to buy a laptop."
 *  2. propósito negado     → not to + verbo   → "I took a taxi not to be late."
 *
 * Trampa = commonMistake exacta del currículo: "I study for to learn English."
 *   → "I study to learn English."
 * Objetivo de voz: "I practice every day to improve." (voicePractice.sentenceEnglish).
 *
 * Nota de idioma: las pistas en español que nombran las partículas de la fórmula llevan
 * `canonical` igual al texto. No son préstamos accidentales: el mentor dice la partícula
 * tal como debe oírse y el QA la compara con la ortografía académica.
 */
export const baseA220SpeechProfile: BaseSpeechProfile = {
  baseId: "base_a2_20",
  orderIndex: 19,
  title: "El Propósito Limpio: To + Verbo",
  targetSentence: "I practice every day to improve.",
  voiceProfile: "v2_expresivo",
  moments: [
    {
      id: "welcome",
      beat: "DIALOG",
      language: "es",
      text: "¡Bienvenido a tu clase de propósito! Hoy vas a decir para qué hacés algo sin copiar el para del español y sin inventar preposiciones. Tocá Comenzar Clase.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why",
      beat: "DIALOG",
      language: "es",
      text: "En español unís dos ideas con la palabra para. En inglés ese puente es más corto: una sola partícula entre la acción y su objetivo. Si copiás el español, la frase suena extranjera.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why.promise",
      beat: "DIALOG",
      language: "es",
      text: "Al final vas a unir dos acciones con una sola partícula, también en negativo, y vas a decirlo en voz alta sin traducir palabra por palabra.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.rule",
      beat: "FORMULA",
      language: "es",
      text: "La regla tiene dos casos: propósito afirmativo y propósito negado. En los dos, el verbo final va en su forma base y delante no entra ninguna preposición. Los vemos uno por uno.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.case1.intro",
      beat: "FORMULA",
      language: "es",
      text: "Caso uno: propósito afirmativo. Cuando querés decir para qué hacés algo, unís la acción con to y el verbo base. Nunca pongas for delante del verbo: esa combinación no existe.",
      canonical:
        "Caso uno: propósito afirmativo. Cuando querés decir para qué hacés algo, unís la acción con to y el verbo base. Nunca pongas for delante del verbo: esa combinación no existe.",
      badgeLabel: "FÓRMULA · CASO 1 DE 2",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case1.model",
      beat: "FORMULA",
      language: "en",
      text: "She saved money to buy a laptop.",
      badgeLabel: "FÓRMULA · CASO 1 DE 2",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "formula.case2.intro",
      beat: "FORMULA",
      language: "es",
      text: "Caso dos: propósito negado. Si el objetivo es evitar algo, el no va delante de la partícula y nunca detrás. Decís not to y después el verbo base.",
      canonical:
        "Caso dos: propósito negado. Si el objetivo es evitar algo, el no va delante de la partícula y nunca detrás. Decís not to y después el verbo base.",
      badgeLabel: "FÓRMULA · CASO 2 DE 2",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case2.model",
      beat: "FORMULA",
      language: "en",
      text: "I took a taxi not to be late.",
      badgeLabel: "FÓRMULA · CASO 2 DE 2",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.intro",
      beat: "TRAP",
      language: "es",
      text: "Mirá la alerta roja. El error típico es traducir el para dos veces y decir for to delante del verbo. Escuchá cómo suena.",
      canonical:
        "Mirá la alerta roja. El error típico es traducir el para dos veces y decir for to delante del verbo. Escuchá cómo suena.",
      cue: { trapPhase: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.wrong",
      beat: "TRAP",
      language: "en",
      text: "I study for to learn English.",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.pivot",
      beat: "TRAP",
      language: "es",
      text: "En su lugar, la partícula del propósito aparece sola delante del verbo base, sin la preposición que copiás del español.",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.right",
      beat: "TRAP",
      language: "en",
      text: "I study to learn English.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.anchor",
      beat: "TRAP",
      language: "es",
      text: "Ancla mental: un propósito, una partícula. Si aparecen dos palabras antes del verbo, sobra una.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.intro",
      beat: "TRAP_CHECK",
      language: "es",
      text: "Ahora elegís vos. En pantalla hay dos frases y solo una usa la partícula del propósito sin copiar el español.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.error",
      beat: "TRAP_CHECK",
      language: "es",
      text: "Esa frase metió una preposición de más. El propósito va con una sola partícula delante del verbo base.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.success",
      beat: "TRAP_CHECK",
      language: "es",
      text: "Exacto. Una sola partícula y el verbo limpio: ese es el propósito natural. Ahora escuchá dos ejemplos.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.appointment",
      beat: "EXAMPLES",
      language: "en",
      text: "I called to confirm the appointment.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "example.phonetic",
      beat: "EXAMPLES",
      language: "es",
      text: "Fijate en la unión: la partícula se pega al verbo y las dos acciones suenan juntas, como ai kold tu konférm. Nada se corta en el puente.",
      canonical:
        "Fijate en la unión: la partícula se pega al verbo y las dos acciones suenan juntas, como ai kold tu konférm. Nada se corta en el puente.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.review",
      beat: "EXAMPLES",
      language: "en",
      text: "We meet early to review the plan.",
      cue: { activeExampleIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "build.transition",
      beat: "BUILD",
      language: "es",
      text: "Si algo no te cierra, tocá Preguntar. Ahora vamos a la pizarra.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.intro",
      beat: "BUILD",
      language: "es",
      text: "Armá la frase de izquierda a derecha hasta completar el propósito: acción, partícula y verbo base.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.error",
      beat: "BUILD",
      language: "es",
      text: "Empezá por la acción inicial, seguí con la partícula del propósito y cerrá con el verbo base y su complemento. Las fichas de preposición no entran.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.success",
      beat: "BUILD",
      language: "es",
      text: "Muy bien. El propósito quedó en una sola partícula y la frase fluye sin traducción literal. Ahora tu voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak.lead",
      beat: "SPEAK",
      language: "es",
      text: "Escuchá cómo suena la frase completa:",
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "speak.model",
      beat: "SPEAK",
      language: "en",
      text: "I practice every day to improve.",
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "speak.instruction",
      beat: "SPEAK",
      language: "es",
      text: "Encendé el micrófono y decí la frase completa con tu voz natural.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.retry",
      beat: "DIALOG",
      language: "es",
      text: "Casi lo tenés. Volvé a escuchar y probá de nuevo con calma.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.not_heard",
      beat: "DIALOG",
      language: "es",
      text: "No logré escucharte. Acercate al micrófono y repetí la frase junto a mí.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.victory",
      beat: "DIALOG",
      language: "es",
      text: "Excelente. Uniste la acción con su propósito en una sola partícula. Base conquistada.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "mic.error",
      beat: "DIALOG",
      language: "es",
      text: "Tu micrófono no arrancó. Autorizá el permiso del navegador o seguí en modo silencioso.",
      pauseAfterMs: PAUSE.standard,
    },
  ],
};
