# Hero Intención — Robot Silk Gaze (60 Frames) + Vestibule-Ocular Saludo (72 Frames)

## Contexto y Causa Raíz de los Cortes Anteriores
1. **Grilla 2D de 9×5 (45 frames) eliminada**:
   - En la grilla 9×5 anterior había saltos de `6.5°` por columna y `6.0°` por fila. Al mover el cursor en diagonal o rápido, el índice saltaba entre filas o se brincaba frames enteros, generando cortes visuales.
   - Al acercar el cursor al robot para hacer clic (`u ≈ 0.65`), la cabeza miraba hacia la derecha (al usuario), pero el saludo iniciaba con la cabeza mirando hacia la izquierda (`cx = 0.0`), provocando un latigazo brusco antes de saludar.

## Solución Implementada (Ultra-Fluida, Cero Cortes)
1. **Secuencia Continua 1D "Silk Gaze" (`60` frames WebP RGBA 1920×1080)**:
   - Ruta: `c:\Users\user\Music\lab\public\robot_hero_gaze\gaze_001.webp` .. `gaze_060.webp`.
   - Recorrido continuo de alta densidad (`0.68°` por frame, 10× más denso que la grilla anterior) desde `cx = -0.45, cy = +0.08` (mirando al texto izquierdo en `gaze_001.webp`), pasando por la pose neutra exacta `cx = 0.0, cy = 0.0` en `gaze_018.webp`, hasta `cx = +1.15, cy = -0.10` (mirando directamente al usuario/cursor sobre el robot en `gaze_060.webp`).
2. **Secuencia de Saludo con Reflejo Vestíbulo-Ocular (`72` frames WebP RGBA 1920×1080)**:
   - Ruta: `c:\Users\user\Music\lab\public\robot_hero_saludo\frame_001.webp` .. `frame_072.webp`.
   - En el frame 1 y frame 72 del saludo, `Head_Look` está en `cx = +1.15, cy = -0.10`, por lo que `gaze_060.webp`, `saludo/frame_001.webp` y `saludo/frame_072.webp` son **idénticos bit a bit**.
   - Mientras el torso gira hacia el frente (frames `1..24`), `Head_Look` contra-rota suavemente con factor `(1 - w)` hasta `0°`, manteniendo la mirada fija en el usuario sin regresarse a la izquierda.
3. **Motor Canvas Sub-Frame Blending + Velocity-Clamped Playhead (`Example2_CelaestMarketplaceHero.tsx`)**:
   - Todos los frames se pre-decodifican en GPU mediante `createImageBitmap`.
   - `drawBlendedSequenceFrame` interpola por opacidad (`globalAlpha`) entre `floor(frameIdx)` y `ceil(frameIdx)` a 60+ Hz en el `<canvas>`.
   - El playhead tiene velocidad máxima acotada (`maxStep = dt * 48.0` en gaze, `dt * 78.0` en `align_to_saludo`), garantizando que nunca se salte frames aunque el mouse se mueva bruscamente.
   - Al hacer clic sobre `.intent-robot-hitbox`, el estado pasa por `align_to_saludo` hasta `gaze_060.webp` (`index 59`) y empalma con corte cero hacia `saludo` (`frame_001.webp` -> `frame_072.webp` a `30 fps` con interpolación sub-frame).
4. **Limpieza Geométrica en Blender (`CELAES_robot_hero_front_visera_detallada_barbilla_2026-10-29.blend`)**:
   - Se eliminaron 84 islas sueltas internas del cuello (`1,229` vértices debajo del pivote `z = 0.550`) en `REFINED_REFERENCE_HEAD_MOVED_TO_RIGHT` (con copia de respaldo en `BACKUP_REFINED_HEAD_MESH_DATA`) y se ocultó `SHOULDER_INSERT_R` en render.
