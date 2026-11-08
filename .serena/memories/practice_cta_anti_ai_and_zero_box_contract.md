# Contrato: Practice CTA Pure Typography & Physical Trigger

## Ajuste Solicitado
El usuario aprobó la dirección de la Repisa Integrada pero ordenó remover la etiqueta `[PASO 2]`, ya que generaba una mini-caja innecesaria que ensuciaba la armonía del diseño.

## Implementación
- Se removió la píldora `[PASO 2]` de `CtaVariantShelf.tsx` y `CtaVariantStrip.tsx`.
- Queda una línea tipográfica suiza pura:
  - Izquierda: `Práctica en Pizarra` (`text-xs sm:text-[13px] font-mono tracking-wider text-white/80 group-hover:text-white transition-colors`).
  - Derecha: Gatillo circular blanco `[ → ]` con micro-sombra física y feedback táctil `active:scale-95`.
- Cero ruido, cero cajas anidadas, máxima sofisticación minimalista.

## Quality Gate:
- `tsc --noEmit`: 0 errores.
- `vitest`: 17/17 tests aprobados en `src/features/pathway`.
- `npm run build`: Exitoso en 21.36s.
