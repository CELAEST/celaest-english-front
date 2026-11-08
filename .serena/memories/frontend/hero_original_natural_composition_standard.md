# Hero Original Natural Composition and Proportionate Height Adaptation

## Core Design Principle (Zero Displacement)
- The user mandated preserving 100% of the robot's natural, original hero position and editorial hierarchy:
  - Upright, towering android on the upper-right looking down-left towards the headline.
  - Side progress bar `01 02 03 04` preserved in its original place.
  - Purple center `01` indicator preserved in its original place.
  - The monolith curve with `CELAEST SYSTEMS` framing the robot.
  - The interactive click hitbox (`.intent-robot-hitbox`) locked exactly to the robot's helmet and torso.

## The Scaling Calibration (Zero-Overlap & Zero-Cutoffs)
1. **Vertical Headroom (`top`)**:
   - Calibrated `top: clamp(24px, 3.8vh, 46px)` so the robot's helmet never collides with header items (`ES`, `Iniciar Sesión`, `Registrarse`).
2. **Rock Occlusion (`height` vs `bottom`)**:
   - Rather than tying the robot strictly to `vw` (which caused it to collapse vertically on narrow/tall windows and detach from the mountain), the robot uses responsive height `clamp(540px, 80vh, 920px)` with `aspect-ratio: 16 / 9`.
   - `.intent-ridge` uses `width: max(136%, 1400px); bottom: -4%`.
   - The robot's white coat and torso reach cleanly behind the rocky mountain peaks across all display aspect ratios.
   - Feathered mask `-webkit-mask-image: linear-gradient(180deg, #000 0%, #000 68%, rgba(0, 0, 0, 0.85) 80%, rgba(0, 0, 0, 0.25) 92%, transparent 99%)` ensures zero hard lines or visible cut layers.
3. **Fluid Typography Adaptation**:
   - On screens `<= 1280px`: Title scales via `clamp(50px, 6vw, 88px)` and copy width `min(52vw, 620px)`.
   - On screens `<= 1024px` (user's exact resolution): Title scales via `clamp(40px, 5vw, 64px)` and copy width `min(48vw, 480px)`, providing clean 80px+ clearance before the robot's shoulder.
   - Hitbox `.intent-robot-hitbox` mirrors the natural position at `left: clamp(50vw, 53vw, 58vw)` ensuring the tooltip `Haz clic para saludar` and click actions stay right on the robot.

## Verification
- Validated via Playwright at exact user viewport (1024x742), 1280x768, 850x800 (DevTools), 1440x820, and 390px.
- Vitest: 11/11 tests pass.
- TypeScript & ESLint: 0 errors, 0 warnings.
- Build: 11/11 Next.js static pages generated.
