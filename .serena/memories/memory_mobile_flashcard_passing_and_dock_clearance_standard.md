# Memory Flashcard Mobile Ergonomics, Passing Interaction & Dock Clearance Standard

## Context & Identified Issues
1. **Card Passing Blocked ("Cuando le doy a pasar no pasa")**:
   - `onClickCapture` in `MemoryCardCarousel.tsx` was unconditionally suppressing click events whenever Framer Motion's `drag` initiated even a 1px pointer jitter. This blocked `onFlip()` on the card and its footer.
   - The front face had an unnecessary `overflow-y-auto` which captured mobile touch and pan gestures, preventing horizontal swipe detection.
   - The carousel had no accessible navigation arrows on mobile (`hidden sm:flex`), forcing mobile users to rely exclusively on swipe gestures that were being swallowed.
2. **Bottom Cutting Off ("se está cortando abajo")**:
   - Card height was inflated to `h-[415px]` with `min-h-[380px]`, which in conjunction with `pb-24` and `MemoryMobileSwipeHint` collided directly with the fixed mobile navigation dock (`fixed bottom-3 left-3 right-3 h-14`).
   - The bottom border of the card and the swipe pagination dots were clipped below the screen edge.

## Surgical Resolution
1. **Passing & Flip Precision**:
   - In [MemoryCardCarousel.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/MemoryCardCarousel.tsx), replaced boolean `isDraggingRef` with distance tracker `dragDistanceRef.current = Math.abs(info.offset.x)`.
   - `onClickCapture` only blocks click events if `dragDistanceRef.current > 8px`. Taps and clicks on the card or footer now execute `onFlip()` instantly and 100% reliably.
   - Adjusted swipe sensitivity (`swipeThreshold = 30; velocityThreshold = 160;`) for effortless card passing.
2. **Mobile Nav Chevrons in Pagination**:
   - In [MemoryMobileSwipeHint.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/subcomponents/MemoryMobileSwipeHint.tsx), integrated tactile `ChevronLeft` and `ChevronRight` buttons directly flanking the dots on mobile, providing immediate one-tap card passing.
3. **Card Dimension & Dock Clearance Calibration**:
   - In [MemoryFlashcard.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/MemoryFlashcard.tsx):
     - Height calibrated to `h-[365px] xs:h-[385px] sm:h-[440px] lg:h-[475px] max-h-[calc(100dvh-220px)] min-h-[320px]`.
     - Front face uses clean, unintercepted container: `<div className="flex-1 min-h-0 flex flex-col justify-center py-1">` (no `overflow-y-auto`).
     - Footer bar has explicit click handler: `onClick={(e) => { e.stopPropagation(); onFlip(); }}`.
   - In [MemoryView.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/MemoryView.tsx):
     - Mobile padding tuned to `pb-20 sm:pb-26 lg:pb-5`, leaving 12px of clean space above the mobile floating dock.
     - Tabs vertical padding adjusted to `pt-0.5 pb-2`.

## Verification & Quality Gate
- 18/18 Vitest unit tests passing.
- `npx tsc --noEmit` passing with 0 errors.
- `npm run audit:hardcode` 100% clean.
- `npm run build` production bundle succeeded.
- Committed and pushed to `main`.
