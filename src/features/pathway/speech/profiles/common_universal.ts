import { BaseSpeechProfile, PAUSE } from "../types";

/**
 * Perfil de Voces Universales y Onboarding Global de CELAEST.
 *
 * Contiene:
 * 1. La Introducción Única al Método (se da 1 sola vez en la vida del usuario, sin importar su nivel CEFR).
 * 2. Bienvenida recurrente al retomar clases posteriores.
 * 3. Alertas y feedback de Caza la Trampa.
 * 4. Transición a Práctica (Construcción) y Habla (Voz).
 * 5. Celebración de Base Dominada.
 * 6. Apertura y cierre de dudas con Liam.
 */
export const commonUniversalSpeechProfile: BaseSpeechProfile = {
  baseId: "common_universal",
  orderIndex: 0,
  title: "Voces Universales y Onboarding Global",
  targetSentence: "Welcome to CELAEST English",
  voiceProfile: "v2_expresivo",
  moments: [
    /* =======================================================================
       1. INTRODUCCIÓN ÚNICA GLOBAL (1 VEZ EN LA VIDA DEL ALUMNO)
       ======================================================================= */
    {
      id: "intro_welcome",
      beat: "DIALOG",
      language: "es",
      text: "¡Hola! Soy Liam, tu mentor personal en CELAEST. Sin importar en qué nivel estés comenzando hoy, en este curso no vamos a memorizar gramática aburrida.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "intro_philosophy",
      beat: "DIALOG",
      language: "es",
      text: "Tu cerebro aprende inglés interiorizando patrones estructurales, cazando las trampas donde solemos tropezar los hispanohablantes, y activando tu voz desde el primer día.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "intro_method",
      beat: "DIALOG",
      language: "es",
      text: "En cada base trabajaremos juntos: primero entenderás la regla en la pizarra, luego cazaremos la trampa común, armarás la frase y la dirás en voz alta. ¿Listo para pensar en inglés? Vamos con tu primera lección.",
      pauseAfterMs: PAUSE.standard,
    },

    /* =======================================================================
       2. BIENVENIDA RECURRENTE (RETORNO A CLASE EN SESIONES POSTERIORES)
       ======================================================================= */
    {
      id: "welcome_returning",
      beat: "DIALOG",
      language: "es",
      text: "¡Qué gusto verte de nuevo! Vamos a retomar justo donde lo dejamos para consolidar tu fluidez.",
      pauseAfterMs: PAUSE.standard,
    },

    /* =======================================================================
       3. CAZA LA TRAMPA (ALERTA, ACIERTO Y ERROR)
       ======================================================================= */
    {
      id: "trap_alert",
      beat: "TRAP",
      language: "es",
      text: "¡Cuidado aquí! El noventa por ciento de los hispanohablantes tropieza aquí por traducir literal del español.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trap_pass",
      beat: "TRAP_CHECK",
      language: "es",
      text: "¡Exacto! Viste la trampa al instante. Tu cerebro ya no está traduciendo, está reconociendo el patrón natural.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "trap_fail",
      beat: "TRAP_CHECK",
      language: "es",
      text: "No pasa nada, para esto estamos aquí. Fíjate bien en la diferencia entre el español y el inglés.",
      pauseAfterMs: PAUSE.standard,
    },

    /* =======================================================================
       4. CONSTRUCCIÓN / PRÁCTICA ACTIVA
       ======================================================================= */
    {
      id: "build_intro",
      beat: "BUILD",
      language: "es",
      text: "Tienes la regla clara. Ahora te toca a ti: une las piezas y arma la frase en la pizarra.",
      pauseAfterMs: PAUSE.standard,
    },

    /* =======================================================================
       5. DESBLOQUEO DE VOZ (HABLA)
       ======================================================================= */
    {
      id: "speak_intro",
      beat: "SPEAK",
      language: "es",
      text: "Es momento de activar tu voz. Escucha el ritmo nativo y dilo al micrófono con confianza.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak_pass",
      beat: "SPEAK",
      language: "es",
      text: "¡Impecable! Ritmo, entonación y claridad desbloqueados con éxito.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "speak_retry",
      beat: "SPEAK",
      language: "es",
      text: "Muy cerca. Presta atención al sonido final y pruébalo una vez más.",
      pauseAfterMs: PAUSE.standard,
    },

    /* =======================================================================
       6. BASE DOMINADA Y CONSULTAS
       ======================================================================= */
    {
      id: "base_mastered",
      beat: "DIALOG",
      language: "es",
      text: "¡Base completada con maestría! Has interiorizado este patrón para siempre y tu progreso CEFR ha aumentado.",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "qa_open",
      beat: "DIALOG",
      language: "es",
      text: "Aquí estoy. ¿Qué parte de esta regla te genera dudas o fricción?",
      pauseAfterMs: PAUSE.standard,
    },
    {
      id: "qa_close",
      beat: "DIALOG",
      language: "es",
      text: "Duda resuelta. Sigamos construyendo en la pizarra.",
      pauseAfterMs: PAUSE.standard,
    },
  ],
};
