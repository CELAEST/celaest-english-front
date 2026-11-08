# Mobile 3D Mentor Framing & Smart Monospace Luxury Standard

## 1. 3D WebGL Hero Framing in Portrait (professorSceneSetup.ts)
- **Eliminación del Espacio Muerto Superior**:
  - `isPortrait = camera.aspect < 0.75`
  - `marginH = isPortrait ? 0.92 : 1.02` (escala al personaje ~8% más grande en mobile, ocupando el 65% superior del viewport).
  - `lookY = isPortrait ? 0.36 : 0.92` (centra la cámara hacia el abdomen/cintura, elevando la cabeza y pecho hacia el tercio superior).
  - `posY = isPortrait ? 0.44 : 1.02` (ángulo sutil heroico a la altura del pecho).
  - Las antenas quedan a solo ~4% del borde superior, erradicando el vacío negro y garantizando que el visor cibernético, cara, cuello, sudadera con patchwork y brazos queden 100% visibles por encima de la pizarra.
  - Cero transformaciones destructivas de CSS (`scale-[0.76] translate-y-6` erradicado de `PathwayProfessorStage.tsx`).

## 2. Tipografía Monospace Inteligente y Limpia (LessonBoardActions.tsx)
- Erradicación de botones toscos con cajas o bordes verdes de terminal retro.
- Fila de acciones tipográficas puras en monospace sutil (`text-[10.5px] font-mono tracking-[0.16em] uppercase`):
  - **Acción 1**: `▷ CLASE` (al estar dictando: `⏸ PAUSA` en `#22D3EE` pulsante).
  - **Acción 2**: `💬 PREGUNTAR 𝄂𝄂𝄂` (con onda sonora sutil `𝄂𝄂𝄂` y estado activo en `#C4B2F7`).
  - **Acción 3**: `🔊 EJEMPLO` (al reproducir: `🔊 SONANDO` en sky-400).
- Textos concisos que respiran con holgura en pantallas móviles estrechas (360px) sin saltos de línea.

## 3. Botón Obsidian "Ir a la Pizarra y Practicar" (ProfessorLessonBoard.tsx)
- Fiel al estándar de lujo de Image 2:
  - Contenedor obsidian glass: `bg-gradient-to-r from-[#170F2E]/90 via-[#1B1138]/90 to-[#0F142A]/90 border border-[#7C3AED]/40 hover:border-[#8B5CF6]/70 shadow-[0_4px_20px_rgba(124,58,237,0.18)]`.
  - Indicador izquierdo: Punto de pulso cian `bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse` sincronizado con el visor cibernético de Nova.
  - Texto: `Ir a la Pizarra y Practicar` en tipografía blanca limpia.
  - Badge derecho: `PASO 1 →` en monospace sutil.

## 4. Acceso Rápido al Mentor en Modo Práctica (PathwayLessonHeader.tsx)
- En la cabecera móvil, dos píldoras discretas permiten:
  - `[ 💬 Preguntar ]`: abre la cátedra 3D con el panel de dudas y preguntas desplegado directamente.
  - `[ 🤖 Nova ]`: abre la cátedra del mentor 3D instantáneamente.
- Elimina cualquier botón tosco o bloque apelmazado.

## 5. Arquitectura Cero-Monolito
- Todos los componentes desacoplados y estrictamente `< 80 líneas`:
  - `PathwayProfessorStage.tsx`: 64 líneas.
  - `useProfessorStageState.ts`: 77 líneas.
  - `LessonBoardActions.tsx`: 55 líneas.
  - `LessonVisualExamples.tsx`: 66 líneas.
  - `ProfessorLessonBoard.tsx`: 63 líneas.
  - `PathwayLessonHeader.tsx`: 75 líneas.
- Vitest 10/10 tests pasados.
- Build Vite de producción 100% exitoso.
