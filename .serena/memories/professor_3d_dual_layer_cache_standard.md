# 3D Robot Dual-Layer Cache & Zero-Latency Mounting Standard

## 1. Arquitectura de Caché de Doble Capa (professorModelCacheService.ts + professorSceneSetup.ts)
- **Capa 1: CacheStorage API (`celaest-professor-3d-v4`)**:
  - Almacena el binario GLB (~2.5 MB) en el motor de almacenamiento offline del navegador.
  - Las recargas o cambios de ruta nunca vuelven a tocar la red (`0ms network latency`).
- **Capa 2: RAM Buffer (`memoryBuffer: ArrayBuffer`)**:
  - Mantiene el ArrayBuffer crudo en la memoria del hilo principal.
  - `loader.parse(buffer, "", ...)` parsea directamente desde la memoria RAM.
- **Precalentamiento (`warmProfessorModelCache`)**:
  - Se dispara automáticamente al montar `PathwayStudioView.tsx`, descargando y cacheando el modelo en segundo plano antes de que el usuario interactúe con el profesor.
- **Plantilla de Escena en Memoria (`parsedTemplatePromise`)**:
  - Mantiene el árbol de objetos Three.js pre-parseado con la retracción de malla facial bajo el visor (`tuckChibiFaceUnderVisor`).
  - Cada montaje subsecuente clona el esqueleto mediante `SkeletonUtils.clone()` en <15ms sin volver a procesar el GLTF.
