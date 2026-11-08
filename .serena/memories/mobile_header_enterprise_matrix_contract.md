# Contrato: Mobile Header Enterprise Matrix & Live 3D Adaptive Standard

## Contexto & Resolución
Se implementó en `/lab` la matriz de audición de cabeceras mobile enterprise para resolver la discusión sobre ergonomía, sobrecarga visual y eliminación de cajas falsas de CSS.

## Modelos Implementados en Lab (`src/features/lab/components/pathway-header-showcase/`):
1. **Model 1: Fila Única Obsidian (Evolución Img 2)** (`ModelCyberVisorClean.tsx`):
   - Altura fija de 36px (ahorro del 50% de espacio vertical).
   - Izquierda: `[BASE 06 ▾]` con micro-chevron interactivo violeta `#A27FF3`.
   - Centro: Segmented Control unificado en cristal ahumado (`bg-white/[0.04]`). La pastilla activa usa Obsidian Luminous Glass (`bg-white/15 text-white font-medium border border-white/20 shadow-sm`), erradicando el parche blanco plano genérico.
   - Derecha: Botón de asistencia con aura de Liam (`[ 💬 ]` con indicador de presencia viva `#38BDF8`).
   - Cero cajas, 85% de espacio vertical libre para la construcción de oraciones.

2. **Model 2: Stage Adaptativo con 3D Real (Regla 3D / Práctica Focus)** (`ModelCyberVisorIntegrated.tsx`):
   - Resuelve la presencia de Liam de forma Context-Aware:
     - En `1. Regla`: Liam se presenta en su stage WebGL Three.js real (`ProfessorStageCanvas`), fundido suavemente a negro puro (`#000001`), gesticulando y explicando.
     - En `2. Práctica`: El escenario 3D colapsa de forma fluida a la fila única de 36px, dejando el 90% de la pantalla para los bloques táctiles de palabras.
     - En `3. Habla`: Se despliega la interfaz de voz y micrófono interactivo.

3. **Model 3: Breadcrumb con Título Puro (Evolución Img 5)** (`ModelCyberVisorAmbientHalo.tsx`):
   - Fila 1: `[BASE 06 ▾]` + Título temático limpio `Acciones Cotidianas` (sin cajas) + `[ 💬 Tutor ]`.
   - Fila 2: Pestañas tipográficas puras con subrayado activo violeta.

4. **Model 4: Visor Original** (`ModelDynamicSplitScreen.tsx`):
   - Preservado intacto a petición expresa del usuario para comparativa visual directa.

## Quality Gate (100% Green):
- TypeScript: `tsc --noEmit` completado con 0 errores.
- Vitest: 10/10 tests pasados en `src/features/pathway`.
- Build Vite: Empaquetado de producción exitoso en 34.87s.
- Todos los componentes estrictamente < 80 líneas (Regla Suprema CELAEST).
