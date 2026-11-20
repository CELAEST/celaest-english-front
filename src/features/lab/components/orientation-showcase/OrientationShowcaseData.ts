import { OrientationIntroStage } from "../../../pathway/services/PathwayLectureEngine";

export const INTRO_STAGE_PRESETS: Array<{
  id: OrientationIntroStage;
  label: string;
  subtitle: string;
}> = [
  {
    id: "welcome",
    label: "01 · Bienvenida",
    subtitle: "¡Hola! Soy Liam, tu mentor personal en CELAEST. Sin importar tu nivel, no memorizaremos gramática aburrida.",
  },
  {
    id: "philosophy",
    label: "02 · Método",
    subtitle: "Aprenderás interiorizando patrones, cazando trampas del español y activando tu voz desde el día 1.",
  },
  {
    id: "guide",
    label: "03 · Guía Dinámica",
    subtitle: "Guía de Estudio: 14 bloques estructurales y Alfabeto Fonético completo con audios reales.",
  },
  {
    id: "method",
    label: "04 · Paso a Clase",
    subtitle: "Primero la regla, luego cazamos la trampa, construyes y hablas en voz alta. ¡Vamos a tu primera lección!",
  },
];
