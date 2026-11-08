# Contrato: Pathway Header Micro-Chibi Centered Precision Suite

## Contexto & Resolución
El usuario eligió el diseño de la micro-cápsula japonesa (44px con micro-ojos que parpadean) y solicitó:
1. Centrar todo con precisión matemática (alineación óptica perfecta entre la micro-cápsula y la pestaña central `2. Práctica`).
2. Evitar que se corte ningún elemento (distribución equilibrada, padding perimetral seguro de 20-24px, cero colisión con bordes redondeados).
3. Desarrollar más variaciones explorando este concepto sin clichés de IA.

## Modelos Desarrollados en Lab (`src/features/lab/components/pathway-header-showcase/`):
1. **1. Eje Central (Tu Favorito Centrado)** (`ModelChibiPureAxis.tsx`):
   - Micro-cápsula en el centro matemático absoluto (`absolute left-1/2 -translate-x-1/2`), compartiendo el mismo eje vertical que `2. Práctica`.
   - `BASE 06 ▾` a la izquierda y `Preguntar` a la derecha en tipografía pura sin cajas ni colisiones.
2. **2. Fila Única 36px (Docked)** (`ModelChibiSingleRow.tsx`):
   - Todo en una sola fila compacta, con la micro-cápsula acoplada junto a las pestañas.
3. **3. Muesca en Línea Divisoria** (`ModelChibiDividerNotch.tsx`):
   - La micro-cápsula anclada en el centro de la línea divisoria (efecto notch de precisión).
4. **4. Con Título (Acciones Cotidianas)** (`ModelChibiWithTopic.tsx`):
   - `BASE 06 ▾ · Acciones Cotidianas` a la izquierda, micro-cápsula en el centro y `Preguntar` a la derecha.
5. **5. Con Halo Amethyst** (`ModelChibiInteractiveHalo.tsx`):
   - Micro-cápsula con un sutil aura respiratoria en amatista `#A27FF3`.
6. **6. Floating Dynamic Island** (`ModelChibiFloatingIsland.tsx`):
   - Píldora de vidrio obsidiana flotante con la micro-cápsula integrada y texto sutil `Liam`.

## Quality Gate (100% Green):
- TypeScript: `tsc --noEmit` completado con 0 errores.
- Vitest: 10/10 tests pasados en `src/features/pathway`.
- Vite Build: Empaquetado de producción exitoso en 24.68s.
- Todos los componentes React estrictamente < 80 líneas (Regla Suprema CELAEST).
