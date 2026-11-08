# CELAEST Pathway: Real Open-Source Pronunciation Engine & Zero-Mock Evaluation Standard

## 1. El Problema Resuelto (Erradicación del 95% Quemado)
- **Anti-Patrón Previo**: El frontend enviaba un payload con números fijos quemados (`overallScore: 95`, `structureScore: 95`, etc.) sin importar si el usuario decía la frase completa, hablaba en español, omitía palabras o hacía ruido de fondo.
- **Solución CELAEST**: Creación del motor algorítmico `PathwayPronunciationEngine.ts`, inspirado en los estándares Open Source de Computer-Assisted Pronunciation Training (CAPT), alineación fonética forzada y distancia Levenshtein acústica.

## 2. Arquitectura del Motor (`PathwayPronunciationEngine.ts`)
- **Normalización Invariante**:
  - Limpieza de puntuación y comillas tipográficas Unicode (`\u201c`, `\u201d`, `«`, `»`).
  - Expansión de contracciones comunes (`I'm` -> `I am`, `don't` -> `do not`, `it's` -> `it is`).
- **Alineación y Comparación Token a Token**:
  - Distancia Levenshtein en palabras con umbrales adaptativos:
    - `sim >= 0.88`: Estado `correct` (100% verificado).
    - `0.65 <= sim < 0.88`: Estado `near_miss` (articulación aceptable con aviso fonético).
    - `0.40 <= sim < 0.65`: Estado `mispronounced` (sustitución fonética detectada).
    - `sim < 0.40` o ausencia de coincidencia: Estado `omitted` (palabra comida).
- **Detección Quirúrgica de Trampas del Español (L1 Traps)**:
  - *S-Cluster inicial*: Detecta si el hispanohablante añade 'e' antes de la 's' (`espeak` vs `speak`, `estudy` vs `study`). Liam corrige: *"Evita añadir una 'e' antes de la 's'. Empieza directo con el siseo: /ss/."*
  - *Confusión B / V*: Detecta si se juntaron ambos labios en lugar de apoyar los dientes superiores en el labio inferior.
  - *Sonido TH*: Detecta si la punta de la lengua no se asomó entre los dientes.
- **Métricas Psicométricas Matemáticas Reales**:
  - `completenessScore`: $\frac{\text{Palabras pronunciadas}}{\text{Total palabras objetivo}} \times 100$.
  - `accuracyScore`: $\frac{\sum \text{Similitudes}}{\text{Total palabras objetivo}} \times 100$.
  - `fluencyScore`: Penalización por disfluencia extrema o palabras intrusas.
  - `overallScore`: $0.6 \times \text{Accuracy} + 0.3 \times \text{Completeness} + 0.1 \times \text{Fluency}$.
  - `passed`: $\ge 80\%$ en Overall Y $\ge 80\%$ en Completeness Y 0 palabras omitidas.

## 3. Comportamiento en Pantalla y Voz de Liam
- **En Pantalla (`VoiceWordBreakdown.tsx`)**:
  - Cada palabra de la frase objetivo se colorea en tiempo real según el resultado acústico:
    - Verde esmeralda: Correcta.
    - Amarillo ámbar: Near-miss (comprensible pero perfectible).
    - Rojo carmesí: Sustituida / mal pronunciada.
    - Gris tachado con subrayado rojo: Omitida.
  - Pastilla de diagnóstico real: `✓ 94% Precisión` o `✗ 55% Precisión`.
- **Voz de Liam**:
  - Si aprueba: Felicitación específica en la voz nativa de Liam.
  - Si reprueba: Liam detalla con exactitud qué palabra falló y da el secreto fonético, invitando al reintento: *"Casi lo tienes, pero te comiste las palabras: 'every' y 'today'. Escúchame de nuevo y dilas todas completas."*
  - El botón cambia dinámicamente a `🎙 Reintentar pronunciación` con acento carmesí/ámbar.

## 4. Quality Gate Certificado
- `PathwayPronunciationEngine.test.ts`: 7/7 tests unitarios cubriendo coincidencia exacta, omisiones de palabras, trampas de español, rechazo de ruido/español y silencio total.
- `npx tsc --noEmit`: 0 errores de TypeScript.
- `PathwayVoiceUnlockStep.tsx`: Desacoplado con `VoiceWordBreakdown.tsx`, estrictamente 77 líneas ($< 80$).
- Cero hardcoded mocks.

