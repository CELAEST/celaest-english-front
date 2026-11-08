import { BaseSpeechProfile, PAUSE } from "../types";

/**
 * Base 10 — Verbos Encadenados: Want to, Need to y Have to.
 *
 * El currículo declara UN solo caso de fórmula: conectar dos acciones con la
 * partícula puente. Por eso se explica con `activeFormulaCaseIndex: 0` y su
 * badge propio, sin inventar casos que el payload no tiene.
 *
 * Mismo contrato que base_01–base_05:
 * - una pista = un idioma;
 * - la partícula puente se nombra con respelling en las pistas españolas ("tu");
 * - el error y la forma natural van siempre en pistas inglesas;
 * - las pausas viven en `pauseAfterMs`.
 */
export const base10SpeechProfile: BaseSpeechProfile = {
  baseId: "base_10",
  orderIndex: 9,
  title: "Verbos Encadenados: Want to, Need to y Have to",
  targetSentence: "I want to learn English today.",
  voiceProfile: "v2_expresivo",
  moments: [
    {
      id: "welcome",
      beat: "DIALOG",
      language: "es",
      text: "¡Bienvenido a tu clase! Hoy vas a descubrir cómo encadenar dos acciones en inglés sin que se te escape la partícula puente. Arranca la clase para recorrer la explicación, fijar la regla y llegar a tu práctica guiada.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why",
      beat: "DIALOG",
      language: "es",
      text: "Hoy vamos a desbloquear una base clave para tu fluidez. En español pegamos dos verbos seguidos sin pensar, pero en inglés necesitamos un puente entre la intención y la acción.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "why.promise",
      beat: "DIALOG",
      language: "es",
      text: "Te voy a mostrar el secreto para que tus deseos y obligaciones salgan en cadena, con un solo puente, y nunca más dudes a mitad de la frase.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.rule",
      beat: "FORMULA",
      language: "es",
      text: "El reto de esta base es encadenar dos acciones. En inglés no se pegan dos verbos seguidos: entre el primero y el segundo va una partícula puente que suena tu. Esta regla tiene un uso principal: unir deseo, necesidad u obligación con la acción.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "formula.case1.intro",
      beat: "FORMULA",
      language: "es",
      text: "Primer uso: la cadena de acciones. Primero la persona con su verbo de deseo, necesidad u obligación, después el puente, y al final la acción en su forma base. Escucha:",
      badgeLabel: "FÓRMULA · CASO 1 DE 1",
      cue: { formulaRevealCount: 1, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "formula.case1.model",
      beat: "FORMULA",
      language: "en",
      text: "I want to learn English today.",
      badgeLabel: "FÓRMULA · CASO 1 DE 1",
      cue: { formulaRevealCount: 3, activeFormulaCaseIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.intro",
      beat: "TRAP",
      language: "es",
      text: "Fíjate en la alerta roja de tu pizarra. En español unimos los dos verbos sin nada en medio, pero en inglés esa unión suena incompleta. Por ejemplo:",
      cue: { trapPhase: 0 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.wrong",
      beat: "TRAP",
      language: "en",
      text: "I want learn English.",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.pivot",
      beat: "TRAP",
      language: "es",
      text: "Sino que en inglés el puente siempre aparece entre los dos verbos, y decimos:",
      cue: { trapPhase: 1 },
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "trap.right",
      beat: "TRAP",
      language: "en",
      text: "I want to learn English.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "trap.anchor",
      beat: "TRAP",
      language: "es",
      text: "Tu ancla mental para no dudar jamás: si hay dos acciones, en medio va el puente.",
      cue: { trapPhase: 2 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.intro",
      beat: "TRAP_CHECK",
      language: "es",
      text: "¡Probemos tu oído! Antes de los ejemplos, elige la frase que un nativo diría sin trabarse.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.error",
      beat: "DIALOG",
      language: "es",
      text: "¡Mucho ojo! Ahí faltó el puente entre los dos verbos. Esa es la trampa del español. Prueba la otra opción.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trapcheck.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Exacto! El puente quedó en su lugar y la cadena fluye. Ahora escucha los ejemplos reales.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.improve",
      beat: "EXAMPLES",
      language: "en",
      text: "I want to improve my English speaking.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "example.phonetic",
      beat: "EXAMPLES",
      language: "es",
      text: "Escucha con atención cómo se enlazan las palabras. El secreto está en deslizar el puente hacia la acción sin cortar el aire: ai uónt tu imprúv mai ínglish spíking.",
      canonical:
        "Escucha con atención cómo se enlazan las palabras. El secreto está en deslizar el puente hacia la acción sin cortar el aire: I want to improve my English speaking.",
      cue: { activeExampleIndex: 0 },
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "example.task",
      beat: "EXAMPLES",
      language: "en",
      text: "I have to finish this task today.",
      cue: { activeExampleIndex: 1 },
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "build.transition",
      beat: "BUILD",
      language: "es",
      text: "Si algo no te cierra, toca Preguntar cuando quieras. Ahora arma la cadena tú: abro las fichas en tu pantalla para activar tu memoria motriz. ¡Adelante!",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.intro",
      beat: "BUILD",
      language: "es",
      text: "Ordena las fichas de izquierda a derecha hasta completar la oración encadenada.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.error",
      beat: "DIALOG",
      language: "es",
      text: "Arranca con la persona y su verbo, coloca el puente en el medio y cierra con la acción. Toca una ficha para moverla.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "build.success",
      beat: "DIALOG",
      language: "es",
      text: "¡Muy bien! La cadena quedó completa y el puente no se perdió. Ahora vamos a certificar tu voz.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak.lead",
      beat: "SPEAK",
      language: "es",
      text: "Escucha cómo lo digo yo, sin prisa:",
      pauseAfterMs: PAUSE.beforeNativeModel,
    },
    {
      id: "speak.model",
      beat: "SPEAK",
      language: "en",
      text: "I want to learn English today.",
      pauseAfterMs: PAUSE.afterNativeModel,
    },
    {
      id: "speak.instruction",
      beat: "SPEAK",
      language: "es",
      text: "Ahora enciende tu micrófono y repite la frase completa para certificar tu avance.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.retry",
      beat: "DIALOG",
      language: "es",
      text: "¡Casi lo logras! Vuelve a escuchar el modelo y repítelo despacio, cuidando el puente entre las dos acciones.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.not_heard",
      beat: "DIALOG",
      language: "es",
      text: "No logré escucharte con claridad. Toca el micrófono y repite la frase junto conmigo.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "voice.victory",
      beat: "DIALOG",
      language: "es",
      text: "¡Gran trabajo con tu voz! Encadenaste las dos acciones y el puente sonó natural. Quedaste con esta base conquistada.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "mic.error",
      beat: "DIALOG",
      language: "es",
      text: "No pude activar tu micrófono. Dale permiso al navegador o elige el modo silencioso.",
      pauseAfterMs: PAUSE.standard,
    },
  ],
};
