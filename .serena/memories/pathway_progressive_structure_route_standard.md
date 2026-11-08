# Guía de Estructura del Inglés — UX final (supersedes tab-based design)

## Decisión del usuario
- Rechazó las DOS filas de tabs (niveles + bloques): numeración duplicada ('01 1. Quién y Qué'), scroll horizontal, mala accesibilidad. PROHIBIDO volver a tabs apilados.
- Pidió botón 'Ok' para descartar la intro.

## Patrón aprobado: lector lineal + índice
- `AnatomyMissionBanner.tsx`: intro corta en lenguaje simple + botón 'Ok, entendido'. Persistido en localStorage `celaest:pathway:anatomy-intro-dismissed` (try/catch, fallback sesión).
- `AnatomyProgressHeader.tsx`: una línea 'Nivel X de 5 · título' + botón 'Índice' (aria-expanded) + barra segmentada de 14 segmentos (gap extra entre niveles, decorativa aria-hidden; role=progressbar en el contenedor).
- `AnatomyIndexList.tsx`: índice vertical agrupado por nivel, filas de 44px, aria-current='step', marcador 'Aquí estás'. Reemplaza el contenido mientras está abierto.
- `AnatomyPillarSection.tsx`: contenido del bloque.
- `AnatomyRoadmapFooter.tsx`: 'Anterior'/'Siguiente' (nombre del bloque solo en sm+), 44px touch, 'Ruta completada ✓' al final.
- `AnatomyUniversalFormula.tsx`: solo en bloque `universal_sentence`.
- Eliminados: AnatomyRoadmapStepper.tsx, AnatomyPillarNav.tsx, AnatomyFamilyFilter.tsx.
- Data: `englishAnatomyData.ts` = 5 niveles (ANATOMY_LEVELS) y 14 bloques ordenados de menor a mayor complejidad.
