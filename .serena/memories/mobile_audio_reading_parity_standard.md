# CELAEST Mobile Parity & Neural Audio Standard

## 1. Local Network / Mobile Architecture
- On physical mobile devices connecting to Vite dev server on Wi-Fi (e.g., `http://192.168.1.X:3000`), direct cross-origin calls to `http://localhost:8080` fail because localhost resolves to the mobile device itself, and Windows Firewall blocks external LAN access to port 8080.
- Solution: Vite proxy configured in `vite.config.ts` (`server.host = true`) with reverse proxy for `/api/v1` -> `http://localhost:8080`, `/core-ai` -> `http://127.0.0.1:8085`, and `/celaest-back` -> `http://localhost:3101`.
- `ENV.apiUrl` routes through `${window.location.origin}/api/v1` in browser mode, while maintaining `http://localhost:8080/api/v1` in Vitest test mode (`MODE === 'test'`).

## 2. Dynamic Viewport & Font-Size Calibrated Pagination
- In Reading, text scaling (`fontSizeIndex`: Estándar 17px, Grande 19px, Extra 21px) dynamically adjusts word count per page in `getTargetWordsForHeight(viewportHeight, fontSizeIndex)` (~26% reduction for Grande, ~46% for Extra).
- `<article>` container incorporates `overflow-y-auto no-scrollbar` as an absolute guarantee against text truncation or component overlap on mobile screens.

## 3. Immediate One-Click Word Translation & Phonetics
- Tapping words in Reading now immediately displays the Spanish translation and genuine IPA phonetics on first touch without requiring a second click or configuration prompt.
- `ReadingArticleReader.performLookup` proactively initiates fallback translation through `onDirectTranslate` if backend lookup lacks Spanish translation or encounters network errors.

## 4. Mobile Audio & Speech Synthesis Resilience
- `SpeechSynthesisService` operates without `AudioContext.createMediaElementSource` and `crossOrigin="anonymous"` on plain audio streams to prevent iOS/Android media element capture silence.
- In `useReadingAudioNarrator` and `ReadingWordModal`, `audioRef.current = null` is guaranteed in error/catch handlers to avoid blocking state.
- Pausing speech synthesis fallback invokes `window.speechSynthesis.cancel()` on mobile to prevent stuck background audio.