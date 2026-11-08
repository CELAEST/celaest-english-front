# Contrato: Pathway Header Model 5 - Espaciado Vertical & Respiración Limpia Certificada

## Ajuste Solicitado por el Usuario
El usuario solicitó ampliar la distancia vertical entre las dos filas (`BASE 05 ▾ / Cápsula / Preguntar` y `1. La Regla / 2. Practica / 3. Habla`) tras revisar la captura `media_1793319986756_ee83fd76.png`, donde la cápsula estaba demasiado pegada a `2. Practica`.

## Solución Quirúrgica
- **Ampliación de Gap**:
  - Se incrementó la separación de `gap-1.5` (6px) a `gap-3.5 sm:gap-4 lg:gap-6` (14-16px).
- **Alineación Vertical de la Cápsula**:
  - Se cambió de `top-3` (que la empujaba hacia abajo contra la pestaña) a `top-1/2 -translate-y-1/2`, centrando la micro-cápsula en el mismo eje horizontal de `BASE 05` y `Preguntar`.
- **Padding del Contenedor**:
  - `pt-1 pb-3` para que el header respire con ritmo espacial equilibrado antes de la línea divisoria inferior.

## Quality Gate (100% Passed):
- `npm run build` (`tsc && vite build`): Exitoso en 25.90s.
- `vitest`: 17/17 tests pasando en `src/features/pathway`.
- Líneas de código: Todos los archivos < 80 líneas (`PathwayLessonHeader.tsx`: 72 líneas, `ChibiMicroCapsule.tsx`: 43 líneas).
