### Mobile Clearance & Recursion Elimination (2026-10-04)

1. **Eliminated `RangeError: Maximum call stack size exceeded` in level transitions**:
   - Root Cause: `WritingPracticeView.tsx` was executing `setUserCefrLevel` on both internal and external events. When `setUserCefrLevel` dispatched `celaest:level-changed`, the listener called `handleSelectLevel` synchronously while React state `activeCefrLevel` was not yet updated, triggering an infinite ping-pong loop.
   - Solution:
     - In `src/shared/services/levelStore.ts`: added strict idempotency guard before writing to localStorage and dispatching events (`current === norm && localStorage.getItem("celaest:cefrLevel") === norm => return norm`).
     - In `WritingPracticeView.tsx`: added `activeCefrLevelRef` for instantaneous synchronous comparison; restricted `setUserCefrLevel` strictly to `source === "internal"`; ensured `celaest:writing:cefrLevel` is always updated in localStorage.

2. **Mobile Modal Clearance Above Navigation Dock**:
   - Root Cause: In mobile view, the navigation dock in `WorkspaceSidebar.tsx` sits at `bottom-3` (ends at ~68px from bottom). The Level Selector modal was rendering inside a lower stacking context at `bottom-6`, causing `C2 — Maestría` to be physically overlapped and obscured by the navigation dock.
   - Solution:
     - Rendered mobile level selector modal via React `createPortal(..., document.body)` at `z-[100]` with backdrop at `z-[90]`.
     - Positioned at `fixed inset-x-3.5 bottom-20 z-[100] max-w-sm mx-auto` (80px from bottom, placing it with 12px clear margin above the navigation dock).
     - Added `max-h-[calc(100dvh-130px)] overflow-y-auto no-scrollbar` ensuring 100% visibility of all 6 CEFR levels (A1 through C2) on any screen size.
     - Kept desktop popover in-place (`hidden sm:flex absolute ...`) with zero desktop regression.

3. **Quality Gate Certified**:
   - `levelStore.test.ts`, `cefrLevelSwitchAntiLoop.test.tsx`, `WritingPracticeView.test.tsx` (23/23 tests pass).
   - `npx tsc --noEmit`: 0 errors.
   - `npm run build`: built cleanly in 27.70s.