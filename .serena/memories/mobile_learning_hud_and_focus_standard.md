# Mobile Learning HUD & Cognitive Focus Standard

## 1. El Problema de Sobrecarga Cognitiva Resuelto
- **Diagnóstico previo**: En móvil, la cabecera acumulaba `CLASE 06`, `A1 ˅`, `Ruta (5/32) ▾`, `[ 💬 Preguntar ]`, `[ 🤖 Nova ]`, y debajo los tabs `1. La Regla  2. Practica  3. Habla`. En pantallas de 360px todo colapsaba en 3 renglones desordenados que ahogaban el contenido pedagógico.
- **Principio de Foco Cognitivo**: Un alumno en móvil necesita saber exactamente en qué base está, en qué momento de la lección se encuentra, y tener un punto único para resolver dudas con su mentor.

## 2. HUD Minimalista de 2 Filas en Mobile (PathwayLessonHeader.tsx)
- **Fila 1 (Navegación Limpia y Despejada)**:
  - **Izquierda**: Breadcrumb conciso `BASE 06 · 5/32 ▾` en monospace elegante. Al tocarlo abre el `PathwayCurriculumSheet` para ver la ruta o cambiar de nivel.
  - **Derecha**: Un único touchpoint para el mentor: `[ 💬 Preguntar ]` en píldora translúcida sutil. Al tocarlo, el alumno accede inmediatamente a Nova con el panel de dudas listo.
  - Cero selectores de nivel duplicados (`A1 ˅` removido del HUD móvil; reside limpiamente en la hoja de ruta y en escritorio).
  - Cero duplicidad de botones de robot (`Nova` y `Preguntar` unificados en una sola acción).
  - Ocupa únicamente 24px de altura con más de 180px de aire libre.

- **Fila 2 (Tracker Simétrico de 3 Fases - Estilo Story/Progreso)**:
  - Sistema de 3 columnas iguales (`grid grid-cols-3 gap-2 w-full`):
    - Columna 1: `1. REGLA`
    - Columna 2: `2. PRÁCTICA`
    - Columna 3: `3. HABLA`
  - Cada fase cuenta con su barra indicadora cinemática superior de 2px:
    - Pasada: `bg-white/40`.
    - Actual: `bg-[#A27FF3]` con resplandor neón `shadow-[0_0_8px_#a27ff3]` y texto activo en blanco.
    - Futura: `bg-white/10`.
  - Cero desbordes, cero saltos de línea y una simetría del 100%.

## 3. Invarianza Total en Escritorio (Desktop `lg:`)
- Mantiene la distribución horizontal de una sola línea:
  `Clase 06 / 032 · AIR TRAFFIC CONTROLLER · A1 ▾ · Ver Ruta (5/32) ▾  |  1. La Regla  2. Practica  3. Habla`.

## 4. Quality Gate
- `PathwayLessonHeader.tsx`: 64 líneas (< 80 líneas).
- Vitest: 10/10 pruebas pasadas.
- TypeScript: 0 errores (`tsc --noEmit`).
- Build Vite de producción: 100% exitoso en 22.8s.
