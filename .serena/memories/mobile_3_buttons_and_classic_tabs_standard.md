# Mobile 3-Button Navigation & Classic Balanced Tabs Standard

## 1. La Solución de 3 Botoncitos en la Fila Superior (PathwayLessonHeader.tsx)
- En móvil, la fila superior se estructura exactamente en **3 botoncitos equilibrados** de cristal de obsidiana (`rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono h-7`):
  1. `[ BASE 06 ]`: Píldora de identidad en texto violeta `#A27FF3`, que identifica la base actual.
  2. `[ Ruta (5/32) ▾ ]`: Píldora de avance curricular y navegación que abre el modal de progreso.
  3. `[ 💬 Preguntar ]`: Píldora interactiva para consultar dudas a Nova con icono `#A27FF3`.
- Distribución óptica simétrica: `justify-between gap-1.5 w-full`, sin vacíos centrales y sin quiebres de línea.

## 2. Pestañas Clásicas de la Clase (Sin Inventos Raros)
- La fila inferior preserva el diseño clásico y limpio de las 3 fases pedagógicas:
  `1. La Regla` · `2. Practica` · `3. Habla`
- Pestañas con distribución equitativa (`flex-1` en móvil, `gap-6` en escritorio).
- Indicador clásico de subrayado activo: `text-white border-b-2 border-[#A27FF3]` para la activa, y `text-white/35 border-transparent` para las inactivas.
- Cero líneas de 2px estilo "stories" ni widgets experimentales ("no se innova").

## 3. Arquitectura y Quality Gate
- Componente unificado para escritorio (`lg:`) y móvil (`lg:hidden`) compartiendo un solo `role="tablist"` para máxima accesibilidad y cero duplicidad en DOM.
- `PathwayLessonHeader.tsx`: 69 líneas (estrictamente `< 80 líneas`).
- Vitest: 10/10 pruebas pasadas.
- TypeScript: 0 errores (`tsc --noEmit`).
- Build Vite de producción: 100% exitoso.
