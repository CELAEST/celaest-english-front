# Lección y Contrato Definitivo: Faldón Hermético del Visor 3D (Full Up/Down Anti-Gap Fix)

## Causa Raíz Geométrica Descubierta
1. El visor importado (`visor.glb`) terminaba verticalmente a una cota de corte fija de `Y = 1.055 m`, mientras que el mentón y la boca del modelo base (`Meshy`) se ubican a `Y = 1.069 - 1.15 m` (solo 1.4 cm de margen de cobertura), y el cuello de la sudadera inicia en `Y = 1.006 m`.
2. Debido a este margen mínimo, cualquier movimiento rápido del cursor —tanto hacia arriba (`pitch < 0`, donde la cabeza se eleva y el visor subía a `Y = 1.091 m`) como hacia abajo (`pitch > 0`, donde la cabeza pivota)— provocaba que el mentón/boca blanca del chibi saliera desfasado por debajo del visor, abriendo la rendija horizontal visible.
3. Además, el nodo raíz del visor en el GLB tenía su punto pivote en el piso (`Y = 0`), por lo que cualquier ajuste en `rotation.x` actuaba como un péndulo con un brazo de palanca de 1.4 metros, provocando un desplazamiento espacial no deseado durante los movimientos rápidos.

## Solución Definitiva de Grado Producción
1. **Faldón Hermético Suavizado (`Smoothstep Taper`)**:
   - En `tryLoadCustomVisorGlb`, se extiende la geometría del borde inferior del visor (`y < 1.25 m`) progresivamente mediante una curva cúbica (`ease = t * t * (3 - 2 * t)`).
   - Se prolonga 4.5 cm hacia abajo (`dy = ease * 0.045`) y 0.8 cm hacia adelante (`+Z`), insertando el faldón inferior del visor profundamente dentro del cuello de la sudadera (cota final `Y = 1.009 m` en reposo, `Y = 1.047 m` en pitch máximo arriba, `Y = 0.969 m` en pitch abajo).
   - `mesh.geometry.computeVertexNormals()` recalcula las normales PBR para una iluminación suave y uniforme sin pliegues visibles.
2. **Sincronización Rígida Pura 100% (Zero Pendulum / Zero Delay)**:
   - Se eliminó por completo la rotación artificial sobre el visor en el loop de `update()`. Al ser un hijo estricto de `headBone`, el visor rota en perfecta sincronía física y matemática con la cabeza, eliminando cualquier desfase, tirón o rendija al subir o bajar la vista a cualquier velocidad.