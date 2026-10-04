### LevelSelectorPill Mobile-First Optimization (2026-10-04)

- Diagnosed horizontal clipping and overflow in mobile viewports (< 640px) when LevelSelectorPill popover was positioned with `left-0` and `w-72`, which pushed out of the right screen edge.
- Adapted `LevelSelectorPill.tsx`:
  - On mobile: renders as an ergonomic, centered floating glass modal card (`fixed inset-x-3.5 bottom-6 z-50 max-w-sm mx-auto`) with a smooth frosted backdrop (`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden`) for tap-to-dismiss.
  - Added native iOS-style grab indicator bar (`w-8 h-1 rounded-full bg-white/20 mx-auto mt-1 mb-1.5 sm:hidden`).
  - Guaranteed 44px minimum tap targets on all CEFR option rows with pure typography and zero text truncation.
  - Preserved 100% desktop invariance (`sm:absolute sm:inset-auto sm:w-72 sm:rounded-2xl`).
- 17/17 tests passing across `cefrLevelSwitchAntiLoop.test.tsx` and `WritingPracticeView.test.tsx`.
- `npx tsc --noEmit` certified with 0 errors.