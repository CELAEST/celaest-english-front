# CELAEST Marketplace Product Detail Modal — Tokyo Carbon (#2) Architecture Standard

## Contexto y Decisiones de Diseño Aprobadas
Se implementó con éxito el rediseño del modal de "Ver detalles" del producto en el Marketplace de CELAEST, adoptando la paleta oficial **Tokyo Carbon (#2)**.

### Reglas Clave Cumplidas:
1. **Zero Badge Boxes & Borders**:
   - `v2.4.1`, `Destacado` y `Cupón aplicado` son micro-tipografía flotante pura (`text-[10px] font-mono tracking-wider`), sin cajas con fondo de color ni bordes que saturen la jerarquía visual.
2. **Mención Única de Plan Pro (Cero Redundancia)**:
   - "Plan Pro" (o el tier mínimo correspondiente) se menciona **estrictamente 1 sola vez** en todo el modal, ubicado en la cabecera de la tarjeta de precio (`Licencia Comercial` • `Plan Pro`).
   - Se eliminó del Header principal del modal.
   - En la tarjeta de Información de Producto se reemplazó por `Licenciamiento: Comercial Perpetua`.
3. **Color del Plan Solo en el Texto**:
   - El nombre del plan utiliza color según el nivel (`text-violet-400` para Pro, `text-amber-400` para Enterprise, `text-sky-400` para Starter, `text-[#A1A1AA]` para base) **únicamente en las letras**, sin pastillas de fondo ni bordes.
4. **Pestaña de Reseñas Completa & Interactiva**:
   - Asignación de estrellas (1-5 con `StarRatingInput`).
   - Formulario de comentarios (límite de 2000 caracteres, contador de caracteres restantes).
   - Acciones de publicar, editar la propia reseña con confirmación de borrado, y listado con badge de compra verificada.
5. **Paleta Cromática Tokyo Carbon (#2)**:
   - Marco exterior del modal: `#09090B` con borde `border-white/[0.08]` y 4 acentos angulares decorativos en las esquinas.
   - Header del modal: `#0D0D11` con borde inferior `border-white/[0.06]`.
   - Botón de cierre: Círculo/squircle minimalista de 36px en `bg-white/[0.04]` hover `bg-white/[0.1]`.
   - Distribución Split: 64% canvas multimedia/pestañas a la izquierda (`#09090B`) y 36% command deck a la derecha (`#060608`).
   - Tarjetas del sidebar: `#0D0D11` con borde `border-white/[0.06]`.
   - Botón principal de compra (CTA): `#FAFAFA` con texto `#030303`.
   - Selector de pestañas: Contenedor `#0D0D11` con borde `border-white/[0.06]`, pestaña activa en blanco puro `#FFFFFF` texto negro, e inactivas en texto tenue con conteos numéricos de items.
   - Chips del stack tecnológico: `#141418` con borde `border-white/[0.06]` y texto `#A1A1AA`.
   - Tarjetas de características: Grilla de dos columnas con fondo `#0D0D11` y checks minimalistas.
6. **Eliminación de Elementos Redundantes/Ruidosos (Solicitud del Usuario)**:
   - Se removió por completo la tarjeta de "Garantía de 3 Días" del sidebar.
   - Se removió por completo el bloque de "Etiquetas" (tags redundantes como #magnifyingglass) tanto de la pestaña Resumen como del sidebar.
   - El sidebar ahora queda limpio y balanceado con: Tarjeta de Precio + Tarjeta de Información del Producto + Aviso de entrega digital.

## Componentes Modificados:
- `ProductDetailModal.tsx`
- `ProductModalSidebar.tsx`
- `ProductModalTabs.tsx`
- `product-tabs/TabOverview.tsx`
- `product-tabs/TabFeatures.tsx`
- `reviews/ReviewForm.tsx`
- `reviews/ReviewCard.tsx`
- `reviews/ReviewList.tsx`
- `ProductDetailStudioShowcase.tsx`
