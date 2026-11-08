# Chibi Robot DMA Binary Sequence Canvas Standard & Contract

## 1. Arquitectura de Carga Cero-Latencia (DMA Binary + 2D Canvas)
- **Eliminación del Cuello de Botella GLB**:
  - El GLB original sin procesar pesaba **73.5 MB**, provocando demoras críticas de 8 a 15 segundos en cold start.
  - Se implementó la arquitectura de secuencias binarias pre-renderizadas (`.bin`), idéntica al estándar de alta velocidad de la landing, pero horneada 1:1 con el muñeco chibi original de Lingua (buzo patchwork, casco crema y visor OLED cyan).
- **Contenedores Binarios DMA**:
  - `public/data/chibi-gaze.bin` (2.31 MB, 60 frames): Contiene la rotación y seguimiento de mirada del muñeco.
  - `public/data/chibi-saludo.bin` (2.79 MB, 72 frames): Animación de bienvenida y asentimiento amistoso.
  - `public/images/chibi_rest.webp` (39 KB): Fotograma estático neutral para pintado instantáneo Tier 0 (0 ms de pantalla en blanco).
- **Capa de Decodificación y Caché**:
  - `robotBinaryLoader.ts`: Carga con streaming DMA y persiste en la CacheStorage del navegador (`celaest-chibi-assets-v1`).
  - `professorModelCacheService.ts`: Decodifica los blobs en `ImageBitmap` en memoria RAM principal.
- **Reproductor Canvas 2D (`ProfessorStageCanvas.tsx`)**:
  - Dibuja en un canvas 2D nativo a 60/120 FPS con mezcla alfa interpolada (`drawFrame`).
  - Responde de forma instantánea al mouse en `idle`.
  - Simula y ejecuta cadencias orgánicas en `explaining`, `listening` y `celebrating`.
  - Reproduce la secuencia completa en `greeting`.

