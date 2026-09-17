# Google OAuth Handshake & Cosmic Canvas Floating Design Standard

### 1. Zero-Card & Zero-Border Mandate on Ambient Artwork (`pure_hero_orb_bg.png`)
- **Cardless/Borderless Architecture**: For screens overlaid on the cosmic hero orb (`AuthCallbackView`, `OnboardingWelcomeStep`, `OnboardingAuthStep`), heavy rectangular cards, borders (`border border-white/10`), background panels (`bg-[#0c0c1e]`), and telemetry bars are strictly prohibited.
- **Pure Floating Typography & Kinetic Aperture**:
  - Floating micro-branding (`L I N G U A` with `text-[11px] uppercase tracking-[0.25em] text-[#7750a7]`).
  - Equidistant glowing violet pulse beacon (`bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] animate-pulse`).
  - Delicate animated SVG orbital kinetic loader (`AuthOrbitalLoader.tsx`).
  - Crisp, thin floating typography for status labels and dynamic messaging.

### 2. Precise Spatial Positioning & Screen Invariance
- The cosmic orb artwork occupies ~18% to ~45% of the viewport height, with its central aperture ring at ~47%-48%.
- **Optimal Calibration**: The floating status stack is anchored at `absolute top-[51%] sm:top-[50%] lg:top-[49%] left-1/2 -translate-x-1/2`.
- This ensures 100% clearance above the center aperture without invading the sphere, and leaves a balanced lower half without pushing content against the bottom edge of the screen across desktop, tablet, and mobile.

### 3. Interactive Testing Studio in Labs (`00.AUTH`)
- `AuthCallbackLuxuryShowcase.tsx` in `src/features/lab/components/` provides live simulation, real-time vertical offset tuning, and phase toggles.
