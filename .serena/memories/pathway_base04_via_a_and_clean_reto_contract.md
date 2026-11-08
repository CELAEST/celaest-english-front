# Pathway Base 04 (VÍA A SOTA & Clean Trap Check) Contract

## 1. Contexto y Objetivos
Base 04 (*"La Trampa de 'Tener' Estados y Edad"*) requería dos hitos esenciales:
1. **Limpieza Visual en Reto Superado**: Al acertar el reto de oído (`passed === true`), se eliminó el banner de texto inferior (`✓ Radar activado. Seguimos con los ejemplos reales...`) en `LiveBoardTrapCheckScene.tsx`, dejando el feedback visual concentrado limpiamente en la barra de pestañas superior con `✓ Reto` y la opción en verde con `✓ ¡Exacto!`.
2. **VÍA A SOTA Desacoplada**: La explicación del mentor en español se desacopló de los modelos nativos en inglés americano puro:
   - Caso 1: `seg_01_case1_intro.mp3` (Español) -> `seg_01_case1_model.mp3` ("I am hungry now.")
   - Caso 2: `seg_01_case2_intro.mp3` (Español) -> `seg_01_case2_model.mp3` ("He is 30 years old.")
   - Alerta trampa: `seg_03.mp3`
   - Opciones reto: `trap_wrong.mp3` ("I have 25 years.") vs `trap_sample.mp3` ("I am 25 years old.")
   - Ejemplos fonéticos: `seg_04.mp3`, `seg_05.mp3`, `seg_06.mp3`, `seg_07.mp3`
   - Ensamblaje y voz: `build_intro.mp3`, `challenge_success.mp3`, `voice_instruction.mp3`, `voice_victory.mp3`.
3. **Animación a la Mitad (Mid-Point Dynamism)**:
   - En `LiveBoardFormulaScene.tsx`, `t=0s` muestra `PERSONA (I)`, `t=2.4s` revela suavemente `ESTAR (am / is / are)` cuando el mentor nombra la pareja en español, y `t=modelo nativo` revela `SENSACIÓN (hungry) / EDAD (30 years old)` con aura luminosa.

## 2. Quality Gate
- 26 pistas de audio generadas con `en-US-AndrewMultilingualNeural` a `-4%` en `public/audio/pathway/a1/base_04/`. Todas verificadas con HTTP 200 OK y tamaños válidos (>0 bytes).
- `a1AudioManifest.json` mapeado con 73 nuevas entradas (originales y sanitizadas).
- `npx tsc --noEmit` certificado con 0 errores.
- Vitest suite de `src/features/pathway/`: 8 archivos, 29/29 tests aprobados (100%).
- Verificación e2e visual en Playwright completada con capturas de pantalla de alta fidelidad.
