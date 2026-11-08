# Contrato: Pathway Header Model 5 (Cápsula Puente / Notch Bridge) Promovido a Producción

## Contexto & Decisión
El usuario seleccionó la opción **5 ("Cápsula Puente")** para el encabezado de clase en producción tras evaluar las 7 variantes en `/lab`.
Corresponde a la arquitectura visual de la Imagen 6 con alineación simétrica:

## Arquitectura Implementada en Producción
- **Archivo principal**: `src/features/pathway/components/PathwayLessonHeader.tsx` (72 líneas, estricto < 80 líneas).
- **Componente de cápsula**: `src/features/pathway/components/ChibiMicroCapsule.tsx` (43 líneas, modular).
- **Mobile (`< lg`)**:
  - Fila 1:
    - Izquierda: `BASE 0{nodeIndex + 1}` con chevron.
    - Centro Absoluto (Notch Bridge): `ChibiMicroCapsule` (`absolute left-1/2 -translate-x-1/2 top-3 -translate-y-1/2 z-20`) con ojos celestes neón (`#38bdf8`) y parpadeo orgánico a amatista `#A27FF3`. Al hacer clic abre el modo tutor de Liam.
    - Derecha: Botón `💬 Preguntar` con icono `MessageSquareQuote` en violeta amatista. Al hacer clic abre tutor en modo pregunta activa.
  - Fila 2 (Tabs en matriz 3x2 bloqueada):
    - Izquierda: `1. La Regla` (`text-left`, alineado con Base).
    - Centro: `2. Practica` (`absolute left-1/2 -translate-x-1/2 text-center`, alineado con la cápsula).
    - Derecha: `3. Habla` (`text-right`, alineado con Preguntar).
  - Cero espacio muerto vertical. Un único `role="tablist"` en el DOM para evitar colisiones en pruebas y lectores de pantalla.
- **Desktop (`lg:`)**:
  - Izquierda: `BASE 0{nodeIndex + 1} · {nodeTitle}`, `LevelSelectorPill`, `Ruta ({masteredCount}/{totalNodes})`.
  - Centro: `ChibiMicroCapsule` con ojos vivos.
  - Derecha: Tabs `1. La Regla`, `2. Practica`, `3. Habla` + botón `💬 Preguntar`.

## Quality Gate (100% Passed):
- `tsc --noEmit`: 0 errores.
- Vitest: 10/10 tests pasados (`PathwayStudioView`, `PathwayLectureEngine`, `PathwayQAService`, `pathwayInvariance`).
- Vite Build: Empaquetado de producción exitoso en 34.57s.
- Todos los componentes React estrictamente < 80 líneas (Regla Suprema CELAEST).
