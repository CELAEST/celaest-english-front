import { BaseSpeechProfile, PAUSE } from "../types";

/**
 * Base 18 — Apuntar en el Espacio: This, That, These, Those.
 *
 * El currículo declara DOS casos de fórmula y el guion los explica uno por uno:
 *  1. un solo objeto → "This is my daily notebook."
 *  2. varios objetos → "These documents are important."
 *
 * La trampa del español es conservar el singular delante de varios objetos
 * ("This documents are important."). La pista del error lleva coma para que el
 * TTS no ligue "This documents" y el alumno oiga la falta: "This, documents are
 * important." El contrato de fidelidad normaliza la puntuación, así que la frase
 * sigue siendo la del currículo.
 *
 * Mismo contrato que el resto: una pista = un idioma, un caso por par
 * intro/modelo, respelling (dis, dat, dís, dóus) solo cuando se nombra el inglés
 * y pausas en `pauseAfterMs`.
 */
export const base18SpeechProfile: BaseSpeechProfile = {
  baseId: "base_18",
  orderIndex: 17,
  title: "Apuntar en el Espacio: This, That, These, Those",
  targetSentence: "These documents are important.",
  voiceProfile: "v2_expresivo",
  moments: [
    {
      id: "welcome",
      beat: "DIALOG",
      language: "es",
      text: "¡Bienvenido a tu clase! Hoy aprendes a señalar con el dedo en inglés: una cosa cerca, una cosa lejos, y también en grupo. Pulsa Comenzar Clase para ver la fórmula, esquivar la trampa y llegar a tu práctica de voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why",
      beat: "DIALOG",
      language: "es",
      text: "Hoy desbloqueas una base que se usa todo el tiempo. En español dices este, ese, estos y esos sin pensar, pero el inglés mezcla la cantidad y la distancia en palabras distintas. Y ahí aparece el error.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why.promise",
      beat: "DIALOG",
      language: "es",
      text: "Te voy a mostrar cómo elegir la palabra correcta mirando dos cosas: cuántos objetos hay y qué tan lejos están. Con eso tus frases dejan de sonar traducidas.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.rule",
      beat: "FORMULA",
      language: "es",
      text: "El reto de esta base es apuntar en el espacio. El inglés decide la palabra según la cantidad y la distancia, y además el verbo cambia. Esta regla tiene dos usos y vamos a verlos uno por uno.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.case1.intro",
      beat: "FORMULA",
      language: "es",
      text: "Primer uso: un solo objeto. Si lo tienes en la mano dices dis, y si está lejos dices dat. Después va el verbo is y por último el detalle. Escucha:",
      badgeLabel: "FÓRMULA · CASO 1 DE 2",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case1.model",
      beat: "FORMULA",
      language: "en",
      text: "This is my daily notebook.",
      badgeLabel: "FÓRMULA · CASO 1 DE 2",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "formula.case2.intro",
      beat: "FORMULA",
      language: "es",
      text: "Segundo uso: varios objetos. Si están cerca dices dís, y si están lejos dices dóus. Con varios objetos el verbo ya no es is, ahora es ar. Escucha:",
      badgeLabel: "FÓRMULA · CASO 2 DE 2",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case2.model",
      beat: "FORMULA",
      language: "en",
      text: "These documents are important.",
      badgeLabel: "FÓRMULA · CASO 2 DE 2",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.intro",
      beat: "TRAP",
      language: "es",
      text: "Mira la alerta roja de tu pizarra. En español no cambiamos la palabra cuando hay varios, decimos estos y listo. El inglés sí la cambia, y por eso muchos dejan la forma del singular. Escucha el error típico:",
      cue: { trapPhase: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.wrong",
      beat: "TRAP",
      language: "en",
      text: "This, documents are important.",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.pivot",
      beat: "TRAP",
      language: "es",
      text: "En su lugar, cuando hay varios objetos la palabra cambia a dís y el verbo cambia a ar. Así se dice:",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.right",
      beat: "TRAP",
      language: "en",
      text: "These documents are important.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.anchor",
      beat: "TRAP",
      language: "es",
      text: "Tu ancla mental para no dudar jamás: varios objetos piden palabra en plural y verbo ar, y un solo objeto pide palabra en singular y verbo is.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.intro",
      beat: "TRAP_CHECK",
      language: "es",
      text: "Probemos tu oído con documentos de verdad: toca la frase que un nativo diría al señalar varios de ellos.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.error",
      beat: "DIALOG",
      language: "es",
      text: "¡Mucho ojo! Ahí quedó el singular delante de varios documentos, y esa es justo la trampa del español. Toca la otra opción.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Exacto! Plural con plural, y sonó natural. Escucha ahora dos frases de la vida real.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.notebook",
      beat: "EXAMPLES",
      language: "en",
      text: "This is my daily notebook.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "example.phonetic",
      beat: "EXAMPLES",
      language: "es",
      text: "Fíjate en la unión de dis con is: suenan pegados, como una sola palabra. El secreto es dis is mai déili nóutbuk.",
      canonical:
        "Fíjate en la unión de this con is: suenan pegados, como una sola palabra. El secreto es this is my daily notebook.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.reports",
      beat: "EXAMPLES",
      language: "en",
      text: "Those reports over there are approved.",
      cue: { activeExampleIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "build.transition",
      beat: "BUILD",
      language: "es",
      text: "Si algo no queda claro, toca Preguntar cuando quieras. Ahora ordena la frase tú: las fichas aparecen en tu pantalla para activar tu memoria motriz. ¡Adelante!",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.intro",
      beat: "BUILD",
      language: "es",
      text: "Mueve las fichas de izquierda a derecha hasta que la frase hable de varios documentos.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.error",
      beat: "DIALOG",
      language: "es",
      text: "Empieza por la palabra del plural, sigue con el objeto y cierra con el verbo ar y el detalle. Toca una ficha para moverla.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Muy bien! Señalaste varios objetos con la palabra y con el verbo correctos. Ahora vamos a certificar tu voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak.lead",
      beat: "SPEAK",
      language: "es",
      text: "Escucha cómo señalo estos documentos yo:",
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "speak.model",
      beat: "SPEAK",
      language: "en",
      text: "These documents are important.",
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "speak.instruction",
      beat: "SPEAK",
      language: "es",
      text: "Enciende tu micrófono y repite la frase señalando varios documentos.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.retry",
      beat: "DIALOG",
      language: "es",
      text: "¡Casi lo tienes! Escucha el modelo otra vez y cuida la palabra del plural.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.not_heard",
      beat: "DIALOG",
      language: "es",
      text: "No alcancé a escucharte bien. Acércate un poco al micrófono y repite la oración con calma.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.victory",
      beat: "DIALOG",
      language: "es",
      text: "¡Excelente pronunciación! Señalaste en plural y marcaste la distancia con claridad. Base conquistada con éxito.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "mic.error",
      beat: "DIALOG",
      language: "es",
      text: "Tu micrófono quedó bloqueado. Autoriza el permiso del navegador y vuelve a intentarlo, o sigue en modo silencioso.",
      pauseAfterMs: PAUSE.standard,
    },
  ],
};
