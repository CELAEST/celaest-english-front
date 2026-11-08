# Hero Intención (`lab`) — Calibración de Pose y Texturas desde Blender (2026-10-31)

## Contexto y Solución
- **Archivo Blender**: `c:\Users\user\Music\lab\public\models\CELAES_robot_hero_front_visera_detallada_barbilla_2026-10-29.blend`
- **Problema previo**:
  1. Diez mallas de prueba/respaldo (`OPT_part_20_BARBIJA_PREVIEW_V1_MATERIAL`, `OPT_part_20_BARBIJA_PREVIEW_V2_FULL_MATERIAL`, `OPT_NECK_FLEX_RIGGED`, `DRAFT_NECK_*`, etc.) estaban ocultas en el viewport (`hide_get() == True`) pero activas en render (`hide_render == False`), provocando artefactos en la barbilla al renderizar con F12.
  2. La cámara `CAM_HERO_CELEAES` apuntaba de frente (`20.19°`) en lugar del perfil 3/4 mirando hacia el titular izquierdo.
  3. En `Example2_CelaestMarketplaceHero.css`, `.intent-structure` tenía `z-index: 1` y `.intent-robot` `z-index: 2`, haciendo que el robot tapara el monolito diagonal en lugar de emerger detrás de él.
- **Calibración aplicada (Cero cambios a materiales/texturas)**:
  - Sincronizado `hide_render` con `visible_get()` en Blender para que el render F12 coincida 100% con el estado limpio del viewport.
  - Posicionada `CAM_HERO_CELEAES` en `loc=(2.216, -1.735, 0.66)`, `rot_deg=(88.2, 7.5, 53.0)` (`lens=60mm`), encuadrando al robot en perfil 3/4 mirando hacia la izquierda con las texturas originales de Blender intactas.
  - Exportado render transparente 1920x1080 en `public/hero_intencion_robot_v22.png` (y sincronizado en `v21.png`).
  - Ajustado orden de capas en `Example2_CelaestMarketplaceHero.css` (`.intent-robot` en `z-index: 1`, `left: 5.2vw`, `top: 1.4%`, `width: 87vw`; `.intent-structure` en `z-index: 2` con `opacity="1"`) para que el monolito diagonal pase justo detrás del aro violeta del auricular y oculte la parte posterior del casco y el brazo derecho.
