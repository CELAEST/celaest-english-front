# Progressive Smooth Scroll Reveal Standard

## Architecture & Visual Behavior
- Standardized progressive scroll reveal system across all landing page sections (Products, Platform, Security, Pricing, Architecture, Closing CTA).
- Avoids offscreen pre-triggers (previously rootMargin: 250px) by using natural viewport intersection: `rootMargin: "0px 0px -60px 0px"`, `threshold: 0.05`.
- Elements smoothly emerge into view as the user scrolls downwards, creating a luxurious editorial feel (Linear/Stripe style).

## Motion Standards
- Transition timing: `0.75s` quintic ease-out `cubic-bezier(0.16, 1, 0.3, 1)`.
- GPU Compositing: `transform: translate3d(0, 26px, 0)` -> `translate3d(0, 0, 0)`, `opacity: 0` -> `1`.
- Clean memory lifecycle: `willChange: "auto"` applied once revealed, and `IntersectionObserver` disconnects after first trigger per element to eliminate CPU overhead.
- Staggered delays:
  - Header: 0ms - 60ms
  - Content / Cards: 100ms - 240ms progressive stagger.
