# Hero Responsive Fluid Adaptation and Zero-Seam Layering Standard

## Root Cause Diagnosed
- When Chrome DevTools or split-screen reduced viewport width to intermediate widths (768px-1100px):
  1. The legacy `@media (max-width: 1120px)` rule forced `.intent-robot` to `left: 0vw; width: 102vw;`, shifting the character 18vw towards the left edge and causing direct text collision over "INTENCIÓN AL RESULTADO".
  2. Because the robot canvas height was tied solely to horizontal `vw`, narrowing the width while maintaining a tall viewport height (e.g. 850x800px) collapsed the robot's vertical reach to only ~480px.
  3. Meanwhile, `.intent-ridge` was anchored at `bottom: -8%`, leaving a 160px gap of empty air where the robot's lower torso ended abruptly in mid-air above the mountains with a hard 7% cutoff mask.
  4. The side indicator `.intent-progress` and index `.intent-art-index` (`left: 38%`) crowded the middle and pushed copy into the robot.

## Calibrated Solution
1. **Vertical Seamlessness & Zero-Seam Layering**:
   - Feathered mask gradient: `-webkit-mask-image: linear-gradient(180deg, #000 0%, #000 68%, rgba(0,0,0,0.85) 80%, rgba(0,0,0,0.25) 92%, transparent 99%)`.
   - Anchored `.intent-robot` to `bottom: -2%` with responsive height `clamp(460px, 70vh, 640px)`.
   - Sized `.intent-ridge` to `width: max(142%, 1300px); bottom: -3%`, ensuring the lunar mountain peaks consistently occlude the character's base on all aspect ratios.
2. **Intermediate Fluid Composition (761px - 1100px)**:
   - Hidden `.intent-progress` and `.intent-art-index` to reclaim 60px of lateral clearance.
   - Constrained `.intent-copy` to `left: clamp(24px, 3.5vw, 40px)` with `max-width: min(56vw, 480px)` and balanced fluid typography (`clamp(40px, 5.2vw, 68px)`).
   - Positioned `.intent-robot` cleanly to the right (`right: clamp(-160px, -11vw, -40px); left: auto`).
   - Aligned `.intent-robot-hitbox` to match the character's gaze and click interaction area (`right: clamp(10px, 4vw, 80px)`).
3. **Mobile Screen Precision (< 760px)**:
   - Preserved atmospheric background character placement (`opacity: 0.55`, `right: -30vw`, `bottom: 0%`) behind high-contrast copy with `z-index: 10`.

## Quality Gate Verification
- Tested with Playwright across 9 viewports: 1440px, 1200px, 1024px, 900px, 850px (exact DevTools split), 800px, 768px, 480px, and 390px.
- Vitest: 11/11 tests passing.
- ESLint: 0 errors, 0 warnings.
- TypeScript: `tsc --noEmit` 0 errors.
- Build: Next.js Turbopack 11/11 static pages generated in 13.4s.
