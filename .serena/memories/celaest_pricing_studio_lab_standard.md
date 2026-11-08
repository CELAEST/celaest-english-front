# Celaest Pricing Section: Production Implementation Standard

## Architecture Contract
- **Archetype**: Tríptico Editorial (Option A), matching `PlatformSection` and `SecuritySection`.
- **Layout & Width**: `max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8` (1360px container).
- **Header Standard (Centered Title & Unified Centered Controls)**:
  - `.pricing-header-center`: Title + Subtitle centered (`text-align: center; margin: 0 auto 36px; max-width: 760px;`). Aligns with the clean centered archetype of `SecuritySection`.
  - `.pricing-controls-bar`: Joined in the center (`display: flex; justify-content: center; align-items: center; width: 100%; gap: 20px;`) sitting below the centered header and directly above the 1px divider.
  - Geo country badge (`sw-editorial-geo-badge`: `🌐 Precios en COP · Colombia`), Period switcher (`PERIODO: Mensual | Anual -17%`), and Currency switcher (`MONEDA: COP | USD`) are grouped together side-by-side with 1px hairlines (`sw-editorial-divider`) in the center.
  - Spacing rhythm: `.pricing-header-layout` has `padding-bottom: 48px;` providing generous, standardized breathing space between the controls underline and the top hairline / cards neon bar.
- **Hairlines**:
  - `border-bottom: 1px solid #24242b` under header controls bar (48px below controls).
  - `border-bottom: 1px solid #24242b` under columns.
  - `border-left: 1px solid #24242b` between column 01/02 and 02/03.
- **Dynamic Neon Top Bar on Cards (Hover-Driven)**:
  - Default: Lights up on Plan 02 ("Profesional" - MÁS POPULAR).
  - Hover: Switches dynamically to the hovered card (`.card-top-neon.active`) with smooth cubic-bezier opacity and scaleX transitions + subtle 4% radial top backlight.
  - Mouse leave: Seamlessly reverts to Plan 02.
  - Dual support: CSS (`:has()` / `:hover`) + React state (`hoveredIdx`) for zero-latency, 100% resilient cross-browser performance.
- **Plan 02 ("Profesional")**:
  - `popular-label-neon`: Unboxed monospace uppercase badge `MÁS POPULAR` (`text-[#c084fc] font-mono font-bold tracking-[0.22em] text-[10.5px]`).
- **CTAs**:
  - Editorial action links `pricing-feature-link` (`Comenzar →` / `Contactar Ventas →`) with animated arrow hover, directly matching `PlatformSection`'s `feature-link`.
- **i18n & Zero Hardcode**:
  - All labels mapped to `es.json` and `en.json` under `pricing.*` and `geo.*`.
