# Error Monitoring Feature - Executive Stream Adaptation (CELAEST Obsidian Luxury Standard)

## Contexto & Decisión de Diseño
El feature de Monitoreo de Errores (`src/features/errors/`) ha sido adaptado e implementado formalmente adoptando el **Arquetipo 1: Executive Stream** validado en Labs, en consonancia estética y arquitectónica estricta con las tablas de Órdenes (`OrdersTable`), Licencias (`LicensingList`) y Facturación.

## Especificaciones Implementadas:
1. **Paleta Obsidian Luxury (Zero AI Slop)**:
   - Fondos: `#080c14`, `#09090b`, `border-white/6`, `border-white/8`, `border-white/10`.
   - Luminancia pura de contraste: `text-white`, `text-white/80`, `text-white/60`, `text-white/40`.
   - Acentos de severidad: rojo sobrio `bg-red-500/80` / `bg-red-500/10 text-red-300 border-red-500/20` exclusivo para incidentes críticos y fallidos. Cero halos o degradados cian/esmeralda.
   - Badges de estado: `resolved` (`bg-white/[0.08] text-white border-white/10` con `<Check size={10} strokeWidth={3} />`), `failed` (`bg-red-500/10 text-red-300 border-red-500/20`), `reviewing` (`bg-white/[0.04] text-white/70`), `ignored` (`bg-white/[0.03] text-white/50`).

2. **Componentes Adaptados**:
   - `ErrorMonitoring.tsx`: Header compacto de lujo (`header py-3.5`) con título, subtítulo e interruptor de pestañas (`live_logs` vs `overview`), seguido de barra de búsqueda monoespacio y controles segmentados de severidad y estado.
   - `ErrorListItem.tsx`: Fila ejecutiva con acento vertical de severidad, badge de código (`AI-IMAGE`, `SYS-WAF`, `AI-TEXT`, etc.), badge de estado, timestamp monoespacio, mensaje principal y metadatos de plantilla, sistema operativo, correo de usuario y cuentas afectadas.
   - `ErrorDetails.tsx`: Panel forense desplegable con grid de 3 columnas de entorno (SO, Excel 365, Plataforma), bloque de Stack Trace en consola oscura con botón "Copiar Traza" + Sonner toast, tarjeta de sugerencia IA y botones de transición de estado (`En Revisión`, `Marcar Resuelto`, `Ignorar`).
   - `ErrorList.tsx`: Stream de incidentes y estado de "Cero Errores" con el SVG holográfico `SecureSystemVisual`, cinta de telemetría HUD y botón de acción.
   - `ErrorBadge.tsx`: Badges normalizados bajo el estándar Obsidian Luxury.
   - `useErrorMonitoring.ts`: Filtrado omnidireccional por mensaje, código, plantilla y correo electrónico.

3. **Garantía de Calidad**:
   - `npx tsc --noEmit` certificado con 0 errores (código de salida 0).
