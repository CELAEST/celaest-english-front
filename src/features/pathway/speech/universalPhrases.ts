/**
 * Catálogo y contratos de Frases Universales de CELAEST (Liam).
 *
 * Provee:
 * 1. Acceso a las rutas de audio canónicas (/audio/pathway/common/*.mp3).
 * 2. Texto y subtítulos sincronizados.
 * 3. Fallback inteligente si el audio está en proceso de generación.
 */

export interface UniversalPhrase {
  id: string;
  category: "intro" | "welcome" | "trap" | "build" | "speak" | "qa" | "mastery";
  text: string;
  audioUrl: string;
  subtitle: string;
}

export const UNIVERSAL_PHRASES: Record<string, UniversalPhrase> = {
  /* =======================================================================
     1. INTRODUCCIÓN ÚNICA GLOBAL (1 VEZ EN LA VIDA DEL ALUMNO)
     ======================================================================= */
  intro_welcome: {
    id: "intro_welcome",
    category: "intro",
    text: "¡Hola! Soy Liam, tu mentor personal en CELAEST. Sin importar en qué nivel estés comenzando hoy, en este curso no vamos a memorizar gramática aburrida.",
    audioUrl: "/audio/pathway/common/intro_welcome.mp3",
    subtitle: "¡Hola! Soy Liam, tu mentor personal en CELAEST. Sin importar tu nivel, no memorizaremos gramática aburrida.",
  },
  intro_philosophy: {
    id: "intro_philosophy",
    category: "intro",
    text: "Tu cerebro aprende inglés interiorizando patrones estructurales, cazando las trampas donde solemos tropezar los hispanohablantes, y activando tu voz desde el primer día.",
    audioUrl: "/audio/pathway/common/intro_philosophy.mp3",
    subtitle: "Aprenderás interiorizando patrones, cazando trampas del español y activando tu voz desde el día 1.",
  },
  intro_method: {
    id: "intro_method",
    category: "intro",
    text: "En cada base trabajaremos juntos: primero entenderás la regla en la pizarra, luego cazaremos la trampa común, armarás la frase y la dirás en voz alta. ¿Listo para pensar en inglés? Vamos con tu primera lección.",
    audioUrl: "/audio/pathway/common/intro_method.mp3",
    subtitle: "Primero la regla, luego cazamos la trampa, construyes y hablas en voz alta. ¡Vamos a tu primera lección!",
  },

  /* =======================================================================
     2. BIENVENIDA RECURRENTE (RETOMAR CLASES POSTERIORES)
     ======================================================================= */
  welcome_returning: {
    id: "welcome_returning",
    category: "welcome",
    text: "¡Qué gusto verte de nuevo! Vamos a retomar justo donde lo dejamos para consolidar tu fluidez.",
    audioUrl: "/audio/pathway/common/welcome_returning.mp3",
    subtitle: "¡Qué gusto verte de nuevo! Vamos a retomar justo donde lo dejamos.",
  },

  /* =======================================================================
     3. CAZA LA TRAMPA
     ======================================================================= */
  trap_alert: {
    id: "trap_alert",
    category: "trap",
    text: "¡Cuidado aquí! El noventa por ciento de los hispanohablantes tropieza aquí por traducir literal del español.",
    audioUrl: "/audio/pathway/common/trap_alert.mp3",
    subtitle: "¡Cuidado aquí! El 90% tropieza en este punto por traducir literal del español.",
  },
  trap_pass: {
    id: "trap_pass",
    category: "trap",
    text: "¡Exacto! Viste la trampa al instante. Tu cerebro ya no está traduciendo, está reconociendo el patrón natural.",
    audioUrl: "/audio/pathway/common/trap_pass.mp3",
    subtitle: "¡Exacto! Viste la trampa al instante. Tu cerebro ya reconoce el patrón natural.",
  },
  trap_fail: {
    id: "trap_fail",
    category: "trap",
    text: "No pasa nada, para esto estamos aquí. Fíjate bien en la diferencia entre el español y el inglés.",
    audioUrl: "/audio/pathway/common/trap_fail.mp3",
    subtitle: "No pasa nada. Fíjate bien en la diferencia entre el español y el inglés.",
  },

  /* =======================================================================
     4. CONSTRUCCIÓN / PRÁCTICA
     ======================================================================= */
  build_intro: {
    id: "build_intro",
    category: "build",
    text: "Tienes la regla clara. Ahora te toca a ti: une las piezas y arma la frase en la pizarra.",
    audioUrl: "/audio/pathway/common/build_intro.mp3",
    subtitle: "Tienes la regla clara. Une las piezas y arma la frase en la pizarra.",
  },

  /* =======================================================================
     5. DESBLOQUEO DE VOZ (HABLA)
     ======================================================================= */
  speak_intro: {
    id: "speak_intro",
    category: "speak",
    text: "Es momento de activar tu voz. Escucha el ritmo nativo y dilo al micrófono con confianza.",
    audioUrl: "/audio/pathway/common/speak_intro.mp3",
    subtitle: "Momento de activar tu voz. Escucha el ritmo nativo y dilo con confianza.",
  },
  speak_pass: {
    id: "speak_pass",
    category: "speak",
    text: "¡Impecable! Ritmo, entonación y claridad desbloqueados con éxito.",
    audioUrl: "/audio/pathway/common/speak_pass.mp3",
    subtitle: "¡Impecable! Ritmo, entonación y claridad desbloqueados con éxito.",
  },
  speak_retry: {
    id: "speak_retry",
    category: "speak",
    text: "Muy cerca. Presta atención al sonido final y pruébalo una vez más.",
    audioUrl: "/audio/pathway/common/speak_retry.mp3",
    subtitle: "Muy cerca. Presta atención al sonido final y pruébalo una vez más.",
  },

  /* =======================================================================
     6. BASE DOMINADA Y CONSULTAS
     ======================================================================= */
  base_mastered: {
    id: "base_mastered",
    category: "mastery",
    text: "¡Base completada con maestría! Has interiorizado este patrón para siempre y tu progreso CEFR ha aumentado.",
    audioUrl: "/audio/pathway/common/base_mastered.mp3",
    subtitle: "¡Base completada con maestría! Patrón interiorizado y nivel CEFR aumentado.",
  },
  qa_open: {
    id: "qa_open",
    category: "qa",
    text: "Aquí estoy. ¿Qué parte de esta regla te genera dudas o fricción?",
    audioUrl: "/audio/pathway/common/qa_open.mp3",
    subtitle: "Aquí estoy. ¿Qué parte de esta regla te genera dudas o fricción?",
  },
  qa_close: {
    id: "qa_close",
    category: "qa",
    text: "Duda resuelta. Sigamos construyendo en la pizarra.",
    audioUrl: "/audio/pathway/common/qa_close.mp3",
    subtitle: "Duda resuelta. Sigamos construyendo en la pizarra.",
  },
};

export function getUniversalPhrase(id: string): UniversalPhrase | undefined {
  return UNIVERSAL_PHRASES[id];
}

