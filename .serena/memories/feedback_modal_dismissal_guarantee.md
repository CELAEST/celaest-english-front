# Feedback Modal Dismissal Guarantee Standard

## 1. Problem Identification
- **Symptom:** When clicking the "X" button to close the feedback/analysis modal (in Speaking or Writing), the modal closed momentarily and then immediately reopened ("como que lo cierra y lo vuelve a abrir").
- **Root Causes:**
  1. **Background Cloud Sync Re-opening Stale Server State:**
     - When the modal was open, `showAnalysisModal: true` had been debounced/saved to the backend.
     - When the learner clicked "X", `closeAnalysisModal()` set local state to `false`.
     - When the modal unmounted, focus shifted back to `window`.
     - An aggressive `window.addEventListener("focus")` listener fired immediately and invoked `syncFromBackend(..., true)`.
     - Since the backend still held the previous snapshot (`showAnalysisModal: true`), `applyProgress` accepted `showAnalysisModal: true` and resurrected the modal.
  2. **Ghost Clicks & Touch Event Leaks:**
     - In mobile/touch and mouse environments, closing the modal unmounted the dialog overlay. Underlying trigger buttons located at the same coordinates (e.g. "Ver análisis y retroalimentación" in `ResponsiveInterviewHUD` or `WritingSubmitBar`) could receive a synthetic 300ms click event.
     - The "X" button in `AppModal` lacked `e.preventDefault()`, `e.stopPropagation()`, and `onTouchEnd` cancellation.
  3. **Synchronous Focus Restoration Race:**
     - `useFocusTrap` restored focus synchronously on unmount to `previouslyFocusedRef.current` (the trigger button), which in some browsers allowed the trailing click release to fire on the newly focused trigger.

## 2. Architectural Solution
1. **Zero-Resurrection Guard in Cloud Sync (`useInterviewCloudSync.ts`):**
   - Added `userDismissedModalRef = useRef(false)`. Once the user closes the modal, any background response with `showAnalysisModal: true` is strictly rejected and discarded.
   - Differentiated initial cold-start hydration (`isInitialSyncRef.current = true`) from background updates (`isBackgroundSync`). Background syncs pass `skipModalSync: true`, guaranteeing that background refetches never alter modal visibility while the user is actively practicing.
   - Removed the aggressive `window.addEventListener("focus")` listener in favor of genuine `visibilitychange` (tab switching).
   - In `saveProgressNow`, immediately synchronized `lastSavedSnapshotRef.current` to prevent debounced race conditions.
2. **Ghost Click Cooldown Guard (`InterviewPracticeView.tsx` & `WritingPracticeView.tsx`):**
   - Added `lastClosedModalTimeRef = useRef(0)`.
   - `handleOpenAnalysisModal` and `handleOpenModal` enforce a 400ms cooldown window (`if (Date.now() - lastClosedModalTimeRef.current < 400) return;`). Any synthetic ghost clicks or double-taps are dropped.
3. **AppModal Pointer Isolation (`AppModal.tsx`):**
   - The close button and mobile drag handle call `e.preventDefault()`, `e.stopPropagation()`, and `onTouchEnd={(e) => e.stopPropagation()}` to isolate dismissal events completely.
4. **Deferred Focus Restoration (`useFocusTrap.ts`):**
   - Focus restoration to `previouslyFocusedRef.current` is deferred by 50ms using `setTimeout` to let the current event loop cycle finish without retargeting.

## 3. Quality Gate
- 26/26 tests passed across `InterviewAnalysisModal.test.tsx` and `useInterviewSession.test.ts`.
- TypeScript: `npx tsc --noEmit` exited cleanly with code 0.
- Hardcode audit: `npm run audit:hardcode` 100% passed.
- Production build: `npm run build` completed in 19.64s.