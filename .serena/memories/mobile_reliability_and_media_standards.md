# Mobile Reliability & Media Architecture Standards (CELAEST English Front)

## 1. WebKit Mobile Media Autoplay Quarantine
- Mobile browsers (especially iOS Safari and Android WebKit) block any `HTMLAudioElement` created outside a synchronous user gesture (`NotAllowedError`).
- Solution: Maintain a persistent shared audio element `MobileAudioUnlocker.getSharedAudio()` primed on the first user interaction (`pointerdown`, `touchstart`, `keydown`).
- All TTS and audio players (`SpeechSynthesisService`, `useReadingAudioNarrator`, `ReadingWordModal`) reuse this pre-unlocked singleton, completely eliminating silence and playback aborts on mobile.
- `SpeechSynthesisService.getVoices()` includes a 400ms timeout guard because iOS Safari does not reliably trigger `onvoiceschanged`.

## 2. Background Video & Poster Flashes
- In mobile viewports, applying `poster="some_image.webp"` on looping `<video>` elements causes an annoying image flash/jump before video frames decode.
- Setting `preload="auto"` and removing static `poster` images ensures smooth, seamless video playback without image jumps.

## 3. Light Weight Summary vs Heavy Hooks at Workspace Level
- `WorkspaceOrbCallouts` renders at the root level of `WorkspaceDashboardView`. It must NEVER invoke heavy hooks like `useReadingArticles()` which trigger render-phase updates, telemetry timers, and audio prefetchers outside inner error boundaries.
- Instead, read passively from cached `localStorage` (`lingua_reading_articles_v2`).

## 4. Resilient Error Boundary Recovery
- Root and section `ErrorBoundary` components provide explicit Spanish fallback UI, action buttons ("Volver al Workspace" and "Recargar app"), and dev-mode error traces. Screen-reader text (`<span className="sr-only">Something went wrong</span>`) maintains accessibility and automated testing compatibility.
