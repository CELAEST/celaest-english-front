# Mobile Sequential Master Class & Reactive Mentor Pill Standard (CELAEST Pathway)

## Context & Problem
On mobile screens (~390 × 844 px), rendering the 3D WebGL character stage and the full classroom (rules, interactive chips, microphone) simultaneously caused severe cognitive overload and layout cramping ("es mucho para solo 1 pantalla").

## Solution & Architecture
1. **Desktop / Mobile Divergence**:
   - **Desktop (`lg:`)**: Maintains permanent side-by-side split view with full 3D robot stage on the right and interactive classroom on the left.
   - **Mobile (`< lg`)**: Sequenced via `mobileMode: 'lecture' | 'practice'`.
2. **Momento 1: Conferencia Móvil (`mobileMode === 'lecture'`)**:
   - Robot 3D ocupa la pantalla completa (`flex h-full`) como protagonista principal.
   - La pizarra Obsidian muestra el dictado en tiempo real, modo de preguntas y el botón de acción: `[ Ir a la Pizarra y Practicar → ]`.
3. **Momento 2: Práctica Kinestésica (`mobileMode === 'practice'`)**:
   - La pizarra de clase toma el 100% de la pantalla para comodidad táctil de los dedos (zero scroll).
   - En la parte superior se renderiza `ProfessorMobileMentorPill`:
     - Ojos cian OLED reactivos con animaciones de rebote/pulso según habla el profesor o graba el micrófono.
     - Cambios de color en estados de acierto (`#34d399`) y fallo (`#fbbf24`).
     - Botón de 1 solo toque `[ 🤖 Ver Profesor ]` para volver a la conferencia en cualquier momento.
4. **Anti-Monolito & Zero Mocks**:
   - `PathwayStudioView.tsx`: 73 líneas (< 80).
   - `ProfessorMobileMentorPill.tsx`: 53 líneas (< 80).
   - `ProfessorLessonBoard.tsx`: 62 líneas (< 80).
   - Tests de integración y build de producción al 100% (9/9 tests passed, Vite build 33.59s).
