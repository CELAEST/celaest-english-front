# Hero Natural Composition & Fluid Sizing Contract

## Root Cause of the Floating Layer Defect
When the browser viewport narrows (e.g., when opening Chrome DevTools or on tablet screens at 768px-1120px):
- With pure `width: 87vw; height: auto;`, a 16:9 canvas collapses vertically (at 850px width, height collapsed to 416px while stage height remained 800px).
- This caused the robot's base to float 300px above the mountain ridge, creating an abrupt horizontal cutoff line.
- The solution is NOT artificial gradient blurring or masks; it is **adapting the size (height) so the character remains grounded and tall in its natural position**.

## Final Implementation Rules
1. **Base Desktop Styles (`hero-intent.css`)**:
   - Clean, crisp mask (no aggressive feathering):
     `-webkit-mask-image: linear-gradient(180deg, #000 0%, #000 93%, transparent 100%);`
   - Natural desktop position:
     `left: 18vw; top: -6.4%; width: 87vw; height: auto;`
   - Hitbox locked to character:
     `left: 49vw; top: 4%; width: 34vw; height: 76%;`

2. **Adaptive Narrow Viewport Rules (`@media (max-width: 1120px)`)**:
   - Rather than letting height collapse with width, height is pinned to viewport scale:
     `height: clamp(660px, 94vh, 960px);`
     `aspect-ratio: 16 / 9;`
     `width: auto;`
     `right: clamp(-300px, -24vw, -140px);`
     `left: auto;`
   - Hitbox stays aligned:
     `right: clamp(30px, 5vw, 120px); width: clamp(260px, 32vw, 360px); left: auto; top: 4%; height: 76%;`
   - Copy breathing room:
     `left: 5vw; width: 44vw;`
     `title > strong: clamp(34px, 5vw, 64px);`
   - Ridge foundation:
     `width: max(148%, 1360px); bottom: -3%;`
