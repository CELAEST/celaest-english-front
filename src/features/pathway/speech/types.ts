/**
 * Contrato de guion hablado del Pathway.
 *
 * Regla número uno: una pista = un idioma. Nunca español e inglés en el mismo archivo.
 * `text` es lo que lee el TTS (puede llevar respelling fonético).
 * `canonical` es lo que debe oírse (base del QA con Whisper, sin respelling).
 */

export type SpeechLanguage = "es" | "en";

export type SpeechBeat = "FORMULA" | "TRAP" | "TRAP_CHECK" | "EXAMPLES" | "BUILD" | "SPEAK";

export interface SpeechCue {
  /** 1 = sujeto, 2 = verbo, 3 = complemento iluminados en la pizarra */
  formulaRevealCount?: 1 | 2 | 3;
  /** caso de fórmula activo, cuando la regla tiene varios */
  activeFormulaCaseIndex?: number;
  /** tarjeta de ejemplo que debe quedar resaltada (0-based) */
  activeExampleIndex?: number;
  /** 0 = alerta, 1 = error tachado, 2 = forma correcta en verde */
  trapPhase?: 0 | 1 | 2;
}

export interface SpeechMoment {
  /** id estable; también nombre del archivo de audio */
  id: string;
  beat: SpeechBeat | "DIALOG";
  language: SpeechLanguage;
  /** lo que se locuta */
  text: string;
  /** lo que debe oírse, para el gate de QA */
  canonical?: string;
  /** estado que la pizarra debe mostrar al empezar esta pista */
  cue?: SpeechCue;
  /** pausa tras la pista, en ms (Ley 5) */
  pauseAfterMs?: number;
  /** subtítulo en pantalla, ortografía académica */
  subtitle?: string;
  /**
   * badge de la pizarra para esta pista. Si no se declara, el motor lo deriva del `beat`.
   * Sirve para reglas con varios casos: "FÓRMULA · CASO 1 DE 2".
   */
  badgeLabel?: string;
}

export interface BaseSpeechProfile {
  baseId: string;
  orderIndex: number;
  title: string;
  /** frase objetivo de la práctica de voz */
  targetSentence: string;
  /** voz bloqueada del curso */
  voiceProfile: string;
  moments: SpeechMoment[];
}

/** Pausas canónicas (Ley 5). Se aplican como silencio real, no como puntuación. */
export const PAUSE = {
  /** tras un modelo nativo en inglés: deja procesar la pronunciación */
  afterNativeModel: 750,
  /** tras una intro antes de que entre el modelo nativo */
  beforeNativeModel: 380,
  /** transición estándar entre conceptos */
  standard: 260,
} as const;
