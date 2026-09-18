# CELAEST Standard: Subtle Shading & Symmetrical Pagination Standard

## Calibración de Sombreados en Flashcards (`MemoryFlashcard.tsx`)
1. **Regla de Sutileza Absoluta**:
   - Evitar auras pesadas o halos de neón coloreados (`rgba(..., 0.4+)` o sombras de colores intensos).
   - El resplandor atmosférico trasero (`backlight aura`) debe ser un suspiro tenue (`opacity-35`, `filter: blur(50px)`, `rgba(124, 58, 237, 0.18)`), suficiente para separar la tarjeta del lienzo oscuro sin llamar la atención ni parecer una luz encendida.
2. **Sombras de Elevación Naturales**:
   - Sombras puras y profundas (`shadow-[0_24px_50px_rgba(0,0,0,0.85),0_4px_16px_rgba(0,0,0,0.5)]`).
   - Cero líneas o halos extras en la base que puedan verse como cortes bruscos.

## Centrado Óptico del Indicador Móvil (`MemoryMobileSwipeHint.tsx`)
- Espaciado vertical balanceado (`pt-5 pb-2`):
- Los puntos de paginación flotan exactamente en el punto medio geométrico entre la base de la tarjeta y la barra de navegación inferior.
