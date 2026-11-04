import { PracticeCtaVariant } from "../../../pathway/components/professor-board/LessonBoardPracticeCta";

export interface CtaModelDescriptor {
  id: PracticeCtaVariant;
  label: string;
  badge: string;
  philosophy: string;
}

export const CTA_MODELS: CtaModelDescriptor[] = [
  {
    id: "shelf",
    label: "1. Repisa Integrada",
    badge: "Monolito Continuo",
    philosophy: "Fluye como base orgánica de la tarjeta. Cero caja sobre caja, con gatillo circular de contraste.",
  },
  {
    id: "strip",
    label: "2. Tira Tipográfica",
    badge: "Zero Box Swiss",
    philosophy: "Elimina todo fondo y borde. Tipografía pura con micro-indicador y flecha cinética al hover.",
  },
  {
    id: "capsule",
    label: "3. Cápsula Flotante",
    badge: "Micro-Pill Aire",
    philosophy: "Cápsula física compacta centrada con aire perimetral. Rompe el encierro del ancho completo.",
  },
  {
    id: "slide",
    label: "4. Carril Deslizante",
    badge: "Dynamic Slider",
    philosophy: "Pista táctil delgada con thumb físico. Gesto táctil dinámico sin clichés de IA.",
  },
  {
    id: "split",
    label: "5. Split Editorial",
    badge: "Info + Circular Trigger",
    philosophy: "División asimétrica balanceada: contexto de fase a la izquierda y gatillo circular a la derecha.",
  },
  {
    id: "notch",
    label: "6. Pestaña de Acople",
    badge: "Docked Tab",
    philosophy: "Pestaña geométrica acoplada al fondo con coordenadas de momento de clase.",
  },
];

