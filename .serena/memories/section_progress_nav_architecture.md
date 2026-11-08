# Section Progress Navigation Architecture Contract

## Overview
Functional, high-performance lateral progress rail (`01 02 03 04`) with fluid GPU-accelerated gliding dot animation and zero-jank scroll spy.

## Components & Files
- `src/components/landing/section-progress-nav.tsx`: Client component managing section activation, passive RAF scroll spy, and smooth scroll transitions.
- `src/components/landing/section-progress-nav.css`: Dedicated styling, GPU-accelerated dot glider (`translate3d`), micro-interactions, responsive media queries, and footer fade-out.
- Mounted in `src/app/[locale]/page.tsx` right above `HeroSection` with `position: fixed`.

## Section Landmarks
1. `01` -> `#intent-hero` (Home / Hero)
2. `02` -> `#products` (Products)
3. `03` -> `#platform` (Platform & Security)
4. `04` -> `#pricing` (Pricing & Architecture)

## Performance Standards
- Zero layout thrashing: uses passive RAF-throttled scroll spy.
- GPU Compositor animation for glider dot: `transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1)`.
- Automatic fade-out in footer (`.is-hidden`) to avoid visual overlap.
- Click-scroll locks spy for 750ms to ensure smooth deceleration without indicator stutter.
- Completely hidden on mobile (`<= 760px`) via responsive CSS.
