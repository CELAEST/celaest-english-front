export interface TourStep {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  iconName: "board" | "mic" | "book" | "pen" | "sparkles" | "compass";
  route?: string;
  highlightPill: string;
}

export const ECOSYSTEM_TOUR_STEPS: TourStep[] = [
  {
    id: "pathway",
    number: "01 / 06",
    title: "Pathway · Pizarra Interactiva con Liam",
    tagline: "El motor neurocognitivo base por base",
    description:
      "Tu ruta de 192 bases desde A1 hasta C2. Liam te enseña con pizarra dinámica, detectando las trampas del español y desbloqueando tu voz antes de avanzar.",
    iconName: "board",
    route: "/pathway",
    highlightPill: "192 Bases Neurocognitivas",
  },
  {
    id: "conversation",
    number: "02 / 06",
    title: "Mentor Conversacional 1 a 1",
    tagline: "Práctica hablada libre en tiempo real",
    description:
      "Conversa por voz directamente con Liam sobre situaciones de trabajo, viajes o negocios. Recibe feedback fonético instantáneo y pierde el miedo a hablar.",
    iconName: "mic",
    route: "/conversation",
    highlightPill: "Reconocimiento de Voz en Vivo",
  },
  {
    id: "reading",
    number: "03 / 06",
    title: "Reading & Lexicón Inteligente",
    tagline: "Lectura inmersiva contextual con audio nativo",
    description:
      "Lee artículos auténticos del mundo real. Toca cualquier palabra para ver su fonética IPA, traducción contextual y guardarla con 1 clic en tu memoria.",
    iconName: "book",
    route: "/reading",
    highlightPill: "Desglose IPA + Guardado Rápido",
  },
  {
    id: "writing",
    number: "04 / 06",
    title: "Writing Studio con IA Mesh",
    tagline: "Redacción ejecutiva con corrección multi-modelo",
    description:
      "Escribe emails, propuestas y resúmenes profesionales. Nuestra red de IA evalúa estructura, riqueza léxica y modelos mentales sin juicios.",
    iconName: "pen",
    route: "/writing",
    highlightPill: "Evaluación Multi-Dimensional",
  },
  {
    id: "memory",
    number: "05 / 06",
    title: "Memory Vault (Repetición Espaciada SRS)",
    tagline: "Tu banco de retención a largo plazo",
    description:
      "El algoritmo neurocognitivo programa repasos automáticos justo en el instante óptimo antes de que tu cerebro olvide un concepto o palabra aprendida.",
    iconName: "sparkles",
    route: "/memory",
    highlightPill: "Algoritmo Neurocognitivo SRS",
  },
  {
    id: "progress",
    number: "06 / 06",
    title: "Radar CEFR y Dominio Real",
    tagline: "Certificación continua de tu evolución",
    description:
      "Monitorea con precisión científica tu nivel internacional (A1 a C2), tus fortalezas fonéticas y las estructuras dominadas para alcanzar tu meta fluida.",
    iconName: "compass",
    route: "/pathway",
    highlightPill: "Métricas Reales A1 → C2",
  },
];

