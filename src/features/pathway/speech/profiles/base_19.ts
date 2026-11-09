import { BaseSpeechProfile, PAUSE } from "../types";

/**
 * Base 19 — La Existencia en el Mundo: There is y There are.
 *
 * El currículo declara TRES casos de fórmula y el guion los explica uno por uno:
 *  1. hay uno (o incontable) → "There is a clear solution."
 *  2. hay varios → "There are several options available."
 *  3. preguntar → "Is there a solution for this?"
 *
 * La trampa del español es traducir "hay" con el verbo tener
 * ("Have many people in the room."). El guion nunca pronuncia la palabra inglesa
 * del verbo tener: la describe como "el verbo tener" y deja que la pizarra la muestre.
 *
 * Mismo contrato que el resto: una pista = un idioma, un caso por par
 * intro/modelo, respelling (der is, der ar, is der) solo cuando se nombra el inglés
 * y pausas en `pauseAfterMs`.
 */
export const base19SpeechProfile: BaseSpeechProfile = {
  baseId: "base_19",
  orderIndex: 18,
  title: "La Existencia en el Mundo: There is y There are",
  targetSentence: "There is a clear solution.",
  voiceProfile: "v2_expresivo",
  moments: [
    {
      id: "welcome",
      beat: "DIALOG",
      language: "es",
      text: "¡Bienvenido a tu clase! Hoy aprendes a decir que algo existe, que hay algo en el mundo, y también a preguntarlo. Pulsa Comenzar Clase para recorrer la fórmula, la trampa y tu práctica de voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why",
      beat: "DIALOG",
      language: "es",
      text: "Hoy abrimos una puerta muy productiva. En español la palabra hay sirve para todo, y el inglés la obliga a cambiar según la cantidad y hasta en las preguntas.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why.promise",
      beat: "DIALOG",
      language: "es",
      text: "Te voy a dar las tres formas de esta idea y a mostrarte por qué el verbo tener nunca las reemplaza. Así tus descripciones suenan nativas desde la primera frase.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.rule",
      beat: "FORMULA",
      language: "es",
      text: "El reto de esta base es la existencia. La palabra hay tiene tres formas en inglés, y cada una depende de la cantidad o de la intención. Esta regla tiene tres usos y vamos a verlos uno por uno.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.case1.intro",
      beat: "FORMULA",
      language: "es",
      text: "Primer uso: hay una sola cosa, o algo que no se cuenta. Para eso usamos der is, que suena unido y significa hay. Escucha:",
      badgeLabel: "FÓRMULA · CASO 1 DE 3",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case1.model",
      beat: "FORMULA",
      language: "en",
      text: "There is a clear solution.",
      badgeLabel: "FÓRMULA · CASO 1 DE 3",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "formula.case2.intro",
      beat: "FORMULA",
      language: "es",
      text: "Segundo uso: hay varios elementos. Cuando son dos o más, cambiamos a der ar y el verbo acompaña al plural. Escucha:",
      badgeLabel: "FÓRMULA · CASO 2 DE 3",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case2.model",
      beat: "FORMULA",
      language: "en",
      text: "There are several options available.",
      badgeLabel: "FÓRMULA · CASO 2 DE 3",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "formula.case3.intro",
      beat: "FORMULA",
      language: "es",
      text: "Tercer uso: preguntar si existe algo. Aquí la fórmula se da vuelta y la pregunta empieza con is der. Escucha:",
      badgeLabel: "FÓRMULA · CASO 3 DE 3",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 2 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case3.model",
      beat: "FORMULA",
      language: "en",
      text: "Is there a solution for this?",
      badgeLabel: "FÓRMULA · CASO 3 DE 3",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 2 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.intro",
      beat: "TRAP",
      language: "es",
      text: "Mira la alerta roja de tu pizarra. En español decimos hay con un solo verbo para cualquier cantidad, y el inglés no presta el verbo tener para esta idea. Escucha el error típico:",
      cue: { trapPhase: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.wrong",
      beat: "TRAP",
      language: "en",
      text: "Have many people in the room.",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.pivot",
      beat: "TRAP",
      language: "es",
      text: "En su lugar, la existencia se abre con der is o con der ar, y el verbo tener se queda afuera. Decimos:",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.right",
      beat: "TRAP",
      language: "en",
      text: "There are many people in the room.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.anchor",
      beat: "TRAP",
      language: "es",
      text: "Tu ancla mental para no dudar jamás: si la idea es hay, el der abre la frase y el verbo tener nunca entra en esa idea.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.intro",
      beat: "TRAP_CHECK",
      language: "es",
      text: "Ahora elige tú. En tu pantalla hay dos versiones de una misma escena y solo una usa la fórmula real.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.error",
      beat: "DIALOG",
      language: "es",
      text: "¡Mucho ojo! Ahí apareció el verbo tener donde debía estar la fórmula de existencia. Toca la otra opción.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Exacto! Abriste con der y cerraste con el plural. Escucha ahora dos frases reales.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.solution",
      beat: "EXAMPLES",
      language: "en",
      text: "There is a simple solution for this.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "example.phonetic",
      beat: "EXAMPLES",
      language: "es",
      text: "Fíjate cómo der se pega con is y casi forman una sola sílaba. El secreto es der is a símpol solúshon for dis.",
      canonical:
        "Fíjate cómo there se pega con is y casi forman una sola sílaba. El secreto es there is a simple solution for this.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.options",
      beat: "EXAMPLES",
      language: "en",
      text: "There are several options available.",
      cue: { activeExampleIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "build.transition",
      beat: "BUILD",
      language: "es",
      text: "Si algo no encaja, tienes el botón Preguntar a mano. Ahora construye la frase tú: las fichas se abren en tu pantalla para que tu mano memorice la fórmula. ¡Vamos!",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.intro",
      beat: "BUILD",
      language: "es",
      text: "Coloca las fichas de izquierda a derecha hasta decir que hay una solución clara.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.error",
      beat: "DIALOG",
      language: "es",
      text: "Abre con la fórmula de existencia, sigue con la cantidad y cierra con la cosa. Toca una ficha para moverla.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Muy bien! La existencia quedó armada sin el verbo tener. Ahora vamos a certificar tu voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak.lead",
      beat: "SPEAK",
      language: "es",
      text: "Escucha cómo digo yo que algo existe:",
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "speak.model",
      beat: "SPEAK",
      language: "en",
      text: "There is a clear solution.",
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "speak.instruction",
      beat: "SPEAK",
      language: "es",
      text: "Enciende tu micrófono y repite la frase completa, sin prisa.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.retry",
      beat: "DIALOG",
      language: "es",
      text: "¡Casi lo tienes! Vuelve a escuchar el modelo y cuida la unión de der con is.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.not_heard",
      beat: "DIALOG",
      language: "es",
      text: "No te escuché con claridad. Acércate al micrófono y repite la fórmula completa.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.victory",
      beat: "DIALOG",
      language: "es",
      text: "¡Excelente pronunciación! Dijiste la existencia con la fórmula correcta y sin el verbo tener. Base conquistada.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "mic.error",
      beat: "DIALOG",
      language: "es",
      text: "El micrófono no respondió. Revisa el permiso del navegador y vuelve a intentarlo, o sigue en modo silencioso.",
      pauseAfterMs: PAUSE.standard,
    },
  ],
};
