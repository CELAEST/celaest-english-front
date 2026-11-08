# Contrato: Pathway Header Symmetrical Matrix & Enterprise Pills Synthesis

## Contexto & Decisión de Diseño
El usuario presentó 7 capturas clave comparando la evolución del header:
1. **Imagen 1 (Producción actual)**: Píldora `[ BASE 06 ▾ ]`, título `Acciones Cotidianas` y botón `[ 💬 Tutor ]`.
2. **Imágenes 2, 3, 5 (Prototipo inicial Chibi)**: Micro-cápsula con ojos celestes neón pero con espacio muerto vertical y texto `LIAM · TUTOR IA` que rompía la simetría entre filas.
3. **Imagen 4 (Zoom de botones)**: Detalle del acabado en píldora con micro-borde `border-white/10`.
4. **Imagen 6 (Lab Modelo Notch)**: Micro-cápsula insertada como muesca superior.
5. **Imagen 7 (Lab Modelo 3 Columnas Alineadas)**: Alineación vertical estricta 3x2 (Fila 1: Base / Cápsula / Tutor; Fila 2: Regla / Práctica / Habla).

## Solución Definitiva (ModelAxisPillsAligned & ModelAxisColumnsAligned)
- **Síntesis Perfecta (Modelo 2 - Píldoras Enterprise)**:
  - Fusiona las píldoras táctiles con micro-borde de Imagen 1 y 4 con la matriz simétrica de 3 columnas de Imagen 7.
  - Ojos celestes neón (`#38bdf8`) vivos con parpadeo orgánico cada 3.8s hacia amatista `#A27FF3`.
  - Botón conciso `[ 💬 Tutor ]` (5 letras, peso balanceado con `BASE 06`).
  - Matriz vertical exacta:
    - Columna Izquierda: `BASE 06` alineado con `1. Regla`.
    - Columna Central: `( • • )` alineado con `2. Práctica`.
    - Columna Derecha: `Tutor` alineado con `3. Habla`.
  - Cero espacio muerto vertical (gap compacto de 6-8px).

## Quality Gate:
- TypeScript: `tsc --noEmit` completado 0 errores.
- Vitest: 10/10 tests pasados en `src/features/pathway`.
- Todos los componentes React estrictamente < 80 líneas.