# CELAEST Design System: Tokens Oficiales & Card #2 Aprobada

## 1. Card #2 (Tokyo Luminescence) - Especificación Aprobada
- **Estado**: Aprobada y catalogada en `DesignSystemView`. PENDIENTE DE INTEGRACIÓN EN EL SISTEMA hasta confirmación del usuario.
- **Tipografía**:
  - Título / Asset Name: `Plus Jakarta Sans` extra bold (`font-jakarta text-[1.05rem] font-extrabold`).
  - Esquinas de imagen, métricas y precios: `JetBrains Mono` (`font-jetbrains`).
  - Conteo de Reseñas: `(64)` súper centrado verticalmente con la estrella y la calificación (sin `translate-y`).
- **Imagen y Degradado (Eased Scrim de 8 Puntos)**:
  - Imagen con luz natural abierta en más del 70% de su superficie.
  - Sombra sutil superior: `h-14` (56px) para lectura de Categoría y Tier.
  - Eased Scrim Inferior: `h-[76px]` (exactamente 1/3 de la altura de la imagen) con anclaje `-bottom-[1px]` hacia `#09090b`.
    Curva cúbica suave de 8 paradas:
    `0%` (#09090b 100%) -> `15%` (98%) -> `30%` (90%) -> `48%` (74%) -> `65%` (50%) -> `80%` (25%) -> `92%` (8%) -> `100%` (0%).
    Disuelve al 100% cualquier línea de corte horizontal entre la imagen y el cuerpo sin crear cortes bruscos en la fotografía.
  - Cero cápsulas o cajas alrededor de los textos sobre la imagen.
- **Precios**:
  - Tipo de moneda explícito: `$149 USD / mes`.
- **Chulitos (Checkmarks)**:
  - `✓` en `font-bold` que reacciona al hover con el color de acento del tier.
- **Botones**:
  - Botón secundario `[Detalles]` + botón primario `[Adquirir]`.
- **Zero Bolitas**:
  - Cero indicadores de selección o radios de color ("bolitas"). Tipografía pura con luminancia.

## 2. Paleta de Colores & Tokens
- **Tier Sky (Starter+)**: `#38BDF8` (`rgba(56, 189, 248, 0.15)`)
- **Tier Violet (Pro)**: `#A78BFA` (`rgba(167, 139, 250, 0.18)`)
- **Tier Amber (Enterprise)**: `#FBBF24` (`rgba(251, 191, 36, 0.18)`)
- **Obsidian Dark Foundation**:
  - Void: `#000000`
  - Deep Canvas: `#060608`
  - Obsidian Card: `#09090B`
  - Elevated Border: `#141418`
  - High Contrast Text: `#FAFAFA`
- **Accentos Semánticos**:
  - Rating Star: `#F59E0B`
  - System Critical: `#FF3B30`
  - Secondary Text: `#A1A1AA`

## 3. Acceso en Dashboard
- Ruta interna: `/?tab=design-system`
- Ubicación en Sidebar: Sección Plataforma (`Design System`).