# Contrato: Pathway Header Zero-Box Pure Typography & Multi-Model Lab Studio

## Contexto & Resolución
Se corrigió la cabecera en `ModelDynamicSplitScreen.tsx` eliminando las cajas, bordes negros y fondos de píldora de `BASE 06` y `Preguntar` (tal como solicitó el usuario en las capturas de zoom). Además, se ampliaron los ejemplos en `/lab` a una suite completa de 6 paradigmas ultra-limpios.

## Modelos Desplegados en Lab (`src/features/lab/components/pathway-header-showcase/`):
1. **1. Split Screen (Tu Vista Limpia)** (`ModelDynamicSplitScreen.tsx`):
   - Limpieza radical de los dos botones superiores: `BASE 06 ▾` y `Preguntar` ahora son 100% tipografía pura sin cajas ni bordes.
   - Contenedor superior despojado de marcos toscos, con degradado etéreo y presencia sutil.
2. **2. Fila Única (Zero Boxes)** (`ModelSingleRowPure.tsx`):
   - Barra única horizontal fija de 34px. Cero cajas, cero píldoras.
   - Izquierda: `BASE 06 ▾` (texto puro violeta).
   - Centro: `1. Regla · 2. Práctica · 3. Habla` (texto puro con punto luminoso activo).
   - Derecha: `Preguntar` (texto puro con icono).
3. **3. Liam 3D Real (Three.js Vivo)** (`ModelSpatial3DCompanion.tsx`):
   - Renderiza el canvas WebGL Three.js real de Liam sin marcos artificiales, con los controles de tipografía pura flotando suavemente sobre el escenario.
4. **4. Breadcrumb & Título (Img 5)** (`ModelBreadcrumbTopic.tsx`):
   - `BASE 06 ▾` + `Acciones Cotidianas` a la izquierda en tipografía limpia, `Preguntar` a la derecha. Pestañas inferiores ligeras.
5. **5. Cápsula Vision Pro** (`ModelFloatingCapsule.tsx`):
   - Micro-cápsula central flotante de vidrio ahumado (estilo Dynamic Island / Apple Vision Pro).
6. **6. Stage Adaptativo** (`ModelAdaptiveContext.tsx`):
   - Liam 3D hero durante Regla, repliegue fluido a fila única minimalista durante Práctica.

## Quality Gate (100% Green):
- TypeScript: `tsc --noEmit` completado con 0 errores.
- Vitest: 10/10 tests pasados en `src/features/pathway`.
- Vite Build: Empaquetado de producción exitoso en 30.69s.
- Todos los componentes React estrictamente < 80 líneas (Regla Suprema CELAEST).
