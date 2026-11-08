# CELAEST Lingua: Visor Smooth Surface, Rim Parabolic Matching & Clean Chin Standard

## Principios Definitivos de Textura, Geometría y Acople Visor-Mentón

1. **Visor Satin Obsidian (Sin Reflejos de Cejas / Ojos)**:
   - Las normales del visor se recalculan radialmente como un domo aerodinámico liso continuo (`dx = x`, `dy = (y - 1.31) * 0.65`, `dz = max(0.12, z - 0.12)`). Esto elimina cualquier hendidura o cresta geométrica residual de cuencas o cejas.
   - Material: `MeshStandardMaterial` satinado con `roughness: 0.55`, `metalness: 0.10`, `color: #05070e` y **cero clearcoat**. La luz se distribuye como un degradado suave y sedoso, eliminando los focos blancos cegadores.

2. **Geometría Natural del Visor (Cero Pestañas / Fangs Artificiales)**:
   - `visor.glb` conserva su geometría natural de Blender sin clamps artificiales por coordenadas fijas (`y = 1.052`). Modificar los vértices con límites rectangulares (`|x| <= 0.22`) creaba dos esquinas/pestañas negras que sobresalían hacia abajo en los laterales.
   - El contorno inferior de `visor.glb` sigue naturalmente la parábola suave `Y = 1.054 + 0.62 * x^2`, adaptándose orgánicamente a la apertura del casco.

3. **Retracción Precisa de Rasgos Ocultos (Cero Lengüetas de Mentón Salientes)**:
   - Para que ninguna porción de piel/mentón sobresalga por delante del visor ("eso que sale"), los vértices del rostro original se retraen a `z = 0.20` siguiendo la curva del visor: `const rimY = 1.048 + 0.60 * x * x`.
   - Esto oculta limpiamente cualquier vestigio de piel/mentón por debajo del visor, garantizando una unión impecable y sellada entre el visor y el marco del casco.

4. **Preservación 100% de Normales de Artista en Mentón y Cuello ("Cero Picos en lo Blanco")**:
   - **PROHIBIDO** llamar a `geom.computeVertexNormals()` sobre la malla base del personaje (`output_unwrapped`).
   - Al preservar las normales horneadas por el artista, el mentón, el casco y la sudadera conservan un degradado suave, uniforme y libre de facetas o picos poligonales.