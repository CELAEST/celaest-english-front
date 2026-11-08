# Mobile Dynamic Master Class & Kinesthetic Sequence Standard

## 1. Experiencia Cinemática y Pedagógica en Mobile
1. **Momento 1: Master Class Dinámica (`mobileMode: 'lecture'`)**:
   - **Explicación Inicial**: El Mentor 3D habla con voz neural gesticulando en pantalla completa. La pizarra muestra el dictado en tiempo real.
   - **Transición a Ejemplos Visuales**: Cuando el mentor llega a los ejemplos (o si el alumno toca la pestaña `Ejemplos`), el canvas 3D se encuadra suavemente arriba (`h-[32vh] scale-[0.88] -translate-y-2` en 500ms) y la pizarra revela la **Fórmula Tipográfica Viva** y las **Tarjetas de Ejemplos Auditivos** (`LessonVisualExamples`).
   - Cada ejemplo se puede tocar para que el robot lo pronuncie y gesticule con voz nativa en tiempo real.
   - Botón CTA al pie de la pizarra: `[ Ir a la Práctica de Fichas | Paso 2 → ]`.

2. **Momento 2: Práctica Kinestésica (`mobileMode: 'practice' - BUILD`)**:
   - Al tocar el botón de práctica, el estudiante pasa directo al **Block Builder** para ensamblar fichas táctiles con las manos. Cero muros de texto redundantes.
   - Si el estudiante tiene dudas, la cabecera ofrece un botón fino `[ Mentor 3D → ]` en la esquina superior derecha que nunca se quiebra a una segunda línea.
   - Al terminar el ensamblaje, toca `[ Decírsela al Profesor → ]`.

3. **Momento 3: Certificación de Voz (`mobileMode: 'practice' - SPEAK`)**:
   - El estudiante practica con el micrófono y valida su pronunciación.

## 2. Invarianza Total en PC / Desktop (`lg:`)
- Split view permanente 55% / 45%.
- La columna izquierda conserva su tipografía aireada, ligera y limpia, sin contenedores o cajas anidadas.
- El canvas 3D se mantiene en altura completa (`lg:h-full lg:scale-100 lg:translate-y-0`).

## 3. Calidad y Cero Monolitos
- Todos los componentes React estrictamente `< 80 líneas`:
  - `LessonBoardHeader.tsx`: 43 líneas.
  - `LessonVisualExamples.tsx`: 71 líneas.
  - `ProfessorLessonBoard.tsx`: 64 líneas.
  - `PathwayLessonHeader.tsx`: 76 líneas.
  - `PathwayStudioView.tsx`: 70 líneas.
- Vitest 10/10 tests pasados.
- Build de producción Vite 100% limpio.
