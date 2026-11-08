# Visor Cyber OLED Texture & Astro Bot Expressions Engine

- **Visor UV Orientation**: In `CyberVisorFaceEngine.ts`, `this.texture.flipY` MUST be set to `false` (`this.texture.flipY = false;`). By default, Three.js `CanvasTexture` flips Y, which inverts the visor UVs (placing eyebrows at the bottom and mouth at the top). With `flipY = false`, standard canvas coordinates (Y=0 top, Y=1024 bottom) correctly map to Forehead -> Eyes -> Cheeks -> Mouth -> Chin.
- **Astro Bot Archetype Expressions**:
  - `speaking`: Animated cyber capsule mouth at `(512, 630)` with organic speech phoneme morphing (opening/closing 12-50px height, 50-86px width), inner vocal resonance glow, white dental/lip blade, and lateral acoustic emission sound waves.
  - `happy`: Glowing upward-arched crescents (^ ^) with pure white inner core, dual diamond sparkle stars (✦), warm neon rose cyber blush dashes (///) at `(lx-24, rx+24, ey+82)`, joyful raised brows, and a wide open cyber smile with corner sparkle.
  - `listening`: Innovative acoustic telemetry system:
    1. Triple concentric incoming acoustic radar waves pulsing from helmet ear cups into the visor edges (`X = 180` and `X = 844`).
    2. Segmented ocular frequency reticles orbiting both eyes with pulsing audio tick marks.
    3. Live voice-capture oscilloscope waveform ribbon at `(512, 620)` with "LISTENING · VOICE IN" status.
    4. Attentive curious eye tilt (+2.5°) and inquisitive raised brows.
- **Location**: `src/design-system/components/Professor3D/CyberVisorFaceEngine.ts` rendered at 60 FPS directly into `visorMesh.material.emissiveMap`.