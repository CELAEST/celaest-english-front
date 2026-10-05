# Reading Adaptive Layout & Zero-Scroll Standard

## 1. Context & Architectural Root Cause
In CELAEST English Front (`/reading`), the reading layout experienced two critical regressions:
1. **Button Clipping / Overflow**: The bottom navigation controls (`Previous`, `Page Indicator`, `Next`) were pushed off-screen and clipped by `overflow-hidden`.
   - *Root Cause*: `ReadingBottomBar` had hardcoded `mb-16` (64px) on mobile/tablet to avoid the floating dock (`lg:hidden fixed bottom-3 ... h-14`). Because `ReadingBottomBar` was inside an `overflow-hidden` flex column, adding margin-bottom pushed the elements downward, clipping the navigation buttons.
2. **Artificial Purple Empty Void**: The text occupied only 3-4 lines instead of naturally filling the 6-8 lines available in the container.
   - *Root Cause*: `getTargetWordsForDimensions` used an over-cautious `0.85` safety factor on capacity, and then `paginateText` multiplied by `0.85` a second time (0.72x total), breaking on the first period after ~28 words.

## 2. The Surgical Root Solution
1. **Dock Clearance via Canvas Padding**:
   - Transferred mobile dock clearance to `ReadingPracticeView.tsx` canvas padding: `pb-20 lg:pb-3`.
   - Removed `mb-16` from `ReadingBottomBar.tsx`, setting `mb-1 lg:mb-1`.
   - On mobile/tablet, the canvas stops 80px above the bottom, leaving the floating dock in free space outside the canvas. Navigation buttons are 100% visible and protected.
2. **Cosmic Orb Proportional Scaling**:
   - Scaled the orb in `ReadingHeader.tsx`: `w-20 h-20` on mobile up to `w-36 h-36` on xl desktop.
   - Recovers 32px of critical vertical headroom on mobile/tablet without losing aesthetic impact.
3. **Capacity & Pagination Engine Calibration**:
   - In `getTargetWordsForDimensions`:
     - Uses true container height measured by `ResizeObserver`.
     - Reserved 48px (mobile) / 54px (desktop) for Hint Pill (24px) + symmetric top clearance (10px) + bottom clearance cushion (20-24px).
     - Calibrated realistic word width: ~38px mobile / ~44px desktop.
     - Single 90% boundary search in `paginateText`: pages fill 90-100% of line capacity before sentence breaks, completely eliminating empty purple voids.
4. **Zero-Scroll & Symmetry Guarantee**:
   - Top clearance below hint pill = 10-12px (green strip).
   - Bottom clearance above progress bar = 20-24px (green strip).
   - Text occupies the central reading arena with balanced symmetry across all screen sizes.
