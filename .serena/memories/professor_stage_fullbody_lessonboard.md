# CELAEST 3D Professor Mentor: Hero Stage Framing Standard

## 1. Hero Scale & Full-Bleed 3D Stage
- **Stage Layout (`PathwayProfessorStage.tsx`)**:
  - The 3D Canvas occupies the entire container height (`absolute inset-0 z-0`), allowing the robot to render at maximum resolution.
  - The lesson board (`ProfessorLessonBoard`) is anchored at the bottom (`flex flex-col justify-end` with `relative z-10 w-full`), overlaying the lower body (legs/feet) of the robot with a semi-translucent obsidian glass finish (`bg-[#080c14]/85 backdrop-blur-2xl`).

## 2. Absolute Maximum Scale Standard (`professorSceneSetup.ts`)
- **Spatial Positioning & Edge-to-Edge Fitting**:
  - `preset = "tutor-stage"`
  - `camera.fov = 32`
  - Formula: `distH = (size.x * marginH) / 2 / Math.tan(hFov / 2)`.
  - Calibration: `marginH = 1.02` (character occupies ~98% of available column width, achieving maximum possible size while keeping ~1% breathing room so zero clipping occurs on sleeves/elbows/hands).
  - Position: `camera.position.set(center.x, 1.02, center.z + distH + size.z / 2)`, looking at `(center.x, 0.92, center.z)`.

## 3. Pure OLED Cyber Visor Contract (Zero White / Zero Specular Glare)
- **Eliminación Total del Blanco en el Visor**:
  - **Ojos OLED**: Eliminados los puntos y círculos blancos especulares de pupila (`#ffffff`). Los ojos ahora son cápsulas digitales de cian puro luminoso (`#38bdf8` / `#0ea5e9` con resplandor neón profundo).
  - **Fondo de Pantalla**: Eliminado el gradiente/viñeta con blanco radial `rgba(255,255,255,0.02)`. Fondo 100% negro azabache OLED (`#000000`).
  - **Material Físico**: `color: 0x000000` en el material Three.js del visor para eliminar cualquier lavado blanquecino difuso provocado por las luces de estudio.
  - **Boca y Acentos**: Reemplazadas las barras de dientes y destellos blancos por cian eléctrico `theme.primary`.
