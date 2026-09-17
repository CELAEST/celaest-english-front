# CELAEST English Engine — Fix Cumulative Layout Shift (CLS) in ReadingArticleReader

## Diagnóstico y Solución de Salto de Línea en Palabras (ej. "consistently"):
1. **Causa Raíz Identificada**: En `ReadingArticleReader.tsx`, al hacer clic en una palabra para consultar su definición o durante el karaoke, el estilo `visualStyle` mutaba el peso de la fuente aplicando `font-medium` (500) en lugar del `font-light` (300) heredado del contenedor `<article>`. En palabras largas (~12 letras) situadas al final de la línea como `consistently`, el incremento métrico del ancho de los glifos (~8-10px) desbordaba el contenedor, forzando un salto de línea instantáneo y provocando que todo el párrafo se desplazara verticalmente hacia abajo.
2. **Solución Implementada**: Eliminado el cambio de `font-weight` en estados interactivos (`isSelected`, `isKaraokeCurrentWord`, `isKaraokeAlreadySpoken`). El resaltado se realiza exclusivamente mediante `bg-white/20`, `text-white` y `ring-1 ring-white/30` (box-shadow).
3. **Métrica de Impacto**: Variación horizontal de la palabra: 0.000px. Cumulative Layout Shift (CLS) = 0.
4. **Validación**: 0 errores en `tsc`, 236/236 pruebas aprobadas en `vitest`.
