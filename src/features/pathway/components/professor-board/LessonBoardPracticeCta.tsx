import React from "react";
import { CtaVariantShelf } from "./cta/CtaVariantShelf";
import { CtaVariantStrip } from "./cta/CtaVariantStrip";
import { CtaVariantCapsule } from "./cta/CtaVariantCapsule";
import { CtaVariantSlide } from "./cta/CtaVariantSlide";
import { CtaVariantSplit } from "./cta/CtaVariantSplit";
import { CtaVariantNotch } from "./cta/CtaVariantNotch";

export type PracticeCtaVariant =
  | "shelf"      // 1. Repisa Integrada (Monolito continuo, cero caja sobre caja)
  | "strip"      // 2. Tira Tipográfica Pura (Zero Box, alta sofisticación suiza)
  | "capsule"    // 3. Cápsula Táctil Flotante (Compacta, centrada, mucho aire)
  | "slide"      // 4. Carril Deslizante Táctil (Slide to practice dinámico)
  | "notch"      // 5. Pestaña de Acople Biselado (Docked Tab arquitectónico)
  | "split";     // 6. Split Editorial Asimétrico (Info + Trigger circular)

interface Props {
  onClick: () => void;
  variant?: PracticeCtaVariant;
}

export const LessonBoardPracticeCta: React.FC<Props> = ({
  onClick, variant = "strip",
}) => {
  if (variant === "strip") return <CtaVariantStrip onClick={onClick} />;
  if (variant === "capsule") return <CtaVariantCapsule onClick={onClick} />;
  if (variant === "slide") return <CtaVariantSlide onClick={onClick} />;
  if (variant === "split") return <CtaVariantSplit onClick={onClick} />;
  if (variant === "notch") return <CtaVariantNotch onClick={onClick} />;
  return <CtaVariantShelf onClick={onClick} />;
};
