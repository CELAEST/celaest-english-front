# Memory Deck and Audio Blob Fix Standard

## 1. Problem Identification
- **Stale Audio Blob URLs (`ERR_FILE_NOT_FOUND`):**
  - Audio recordings produced in the interview are represented by browser in-memory `blob:` URLs (e.g. `blob:https://domain/uuid`).
  - When persisted into `localStorage` (`interview_history_v2`) or PostgreSQL (`interview_sessions`), these blob URLs lose their heap references upon reload or across sessions, emitting `GET blob:... net::ERR_FILE_NOT_FOUND` in the browser console.
  - When the audio component rendered an error or unmounted, it caused layout thrashing and modal re-render flickering.
- **Memory Bank Tab Switch Freeze / Black Screen:**
  - In `MemoryView.tsx`, `<AnimatePresence mode="wait">` had a parent container `key={'deck-' + activeTab}` while child components (`MemoryCardCarousel`) had their own nested `AnimatePresence`. Framer Motion deadlocked waiting for unmount transitions when rapidly toggling tabs (Speaking $\leftrightarrow$ Reading $\leftrightarrow$ Writing), leaving the viewport area completely empty.
  - Card carousel indices were not guarded against bounds mismatches between different category deck lengths (e.g. Speaking 13 $\rightarrow$ Reading 9 $\rightarrow$ Writing 6).
  - Unsanitized inputs (quotes, words, sentences) passed to subcomponents caused subtle runtime render exceptions without error boundaries.

## 2. Architectural Solution
1. **Blob Sanitization at Persistence Boundaries:**
   - In `interviewPersistence.ts`, `savePersistedInterview` strips any `audioUrl` starting with `blob:` before storing in `localStorage`. `loadPersistedInterview` drops stale blob references.
   - In `useInterviewCloudSync.ts`, `saveProgressNow` cleans `latestTurn.feedback` of any `blob:` audio references before dispatching to the PostgreSQL backend; `applyProgress` drops stale blob references on hydration.
2. **Stable Player Layout (Zero Layout Thrashing):**
   - In `InterviewAnalysisTranscriptCard.tsx`, the audio player preserves container height and dimensions even on audio error, gracefully displaying a disabled "Audio no disponible" state with zero DOM unmounts or parent re-renders.
3. **Deadlock Elimination & Defensive Clamping in Memory View:**
   - In `MemoryView.tsx`, removed the tab-keyed container inside `<AnimatePresence mode="wait">` in favor of a stable `key="deck-container"`, delegating transitions cleanly to `MemoryCardCarousel`.
   - Clamped card index via `safeActiveIndex = Math.min(selectedIdx, Math.max(0, totalCards - 1))` and reset `selectedIdx` to 0 on tab changes.
   - Wrapped the carousel in `ErrorBoundary` fallback.
4. **Defensive String Coercion:**
   - Sanitized all card strings (`String(...)`) and guarded regex construction in `HighlightWord.tsx`, `MemoryReadingFront.tsx`, `typographyHelpers.ts`, and `MemoryCardCarousel.tsx`.

## 3. Verification & Quality Gate
- `InterviewAnalysisModal.test.tsx`: Verified graceful handling of missing/errored audio and text-only transcript preservation.
- `MemoryTabSwitching.test.tsx`: Verified active tab switching across Speaking (13) $\rightarrow$ Reading (9) $\rightarrow$ Writing (6) with zero crashes or empty states.
- 100% clean typecheck (`tsc --noEmit`), clean audit (`audit:hardcode`), and clean production build (`npm run build`).