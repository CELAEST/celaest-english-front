# Mobile Neural Audio Architecture & Universal IPA Phonetics (CELAEST English)

## 1. Production Network Routing & Reverse-Proxy Standard
- **The Core Problem in Production**:
  - In production builds (Vercel), `VITE_API_URL` is omitted by default unless provided as an environment variable.
  - When `resolvedApiUrl` defaulted to `${window.location.origin}/api/v1`, requests to `/api/v1/tts/stream`, `/api/v1/reading/articles`, and `/api/v1/interview/transcribe` hit Vercel's SPA routing.
  - Because `vercel.json` only had `{ "source": "/(.*)", "destination": "/index.html" }`, every API request returned `index.html` (HTTP 200 `text/html`).
  - `MobileAudioUnlocker.playNeuralBuffer` attempted to decode HTML bytes with `AudioContext.decodeAudioData()`, throwing an `EncodingError` and degrading to `window.speechSynthesis.speak()` (robotic browser voice).
  - Reading word lookup and article fetching failed with JSON syntax errors, triggering the ErrorBoundary "Something went wrong".
- **The Permanent Fix**:
  - `src/shared/constants/env.ts`: In production (`isProd`), default `apiUrl`, `coreAiUrl`, and `celaestBackUrl` to verified live Render backends (`https://celaest-english-back.onrender.com/api/v1`, etc.).
  - `vercel.json`: Add explicit rewrites for `/api/v1/:path*`, `/core-ai/:path*`, and `/celaest-back/:path*` to forward to their Render instances before falling back to `index.html`.
  - `vite.config.ts`: Add `https://*.onrender.com` to `connect-src` and `media-src` in the CSP generation.

## 2. Mobile Neural Audio Engine & Autoplay Quarantine Bypass
- **Problem**: In mobile iOS Safari and Android Chrome, `HTMLAudioElement.play()` is quarantined (`NotAllowedError`) if triggered asynchronously (e.g. after Whisper ASR + LLM round-trips taking >1s).
- **Solution**:
  - `MobileAudioUnlocker.unlock()` primes Web Audio API `AudioContext` with a 1-sample silent buffer on initial user gesture (`touchstart`, `pointerdown`, `click`).
  - In `WorkspaceSidebar.tsx` (`MobileBottomDock`), `WorkspaceDashboardView.tsx` (`handleSelectNav`), `ConversationPromptArea.tsx` (voice switcher "Aria" / "Chris", "Repeat"), and `ConversationMicControl.tsx` (mic tap), `MobileAudioUnlocker.unlock()` is executed synchronously on touch events.
  - `MobileAudioUnlocker.playNeuralBuffer` validates that `Content-Type` is audio/mpeg and not `text/html` or `application/json`.
  - Decoded audio buffers are cached in `bufferCache` (LRU 50 entries) for instant 0ms latency replay.

## 3. Universal IPA Phonetic Service & Display Guard
- `phoneticLookupService.ts` combines a curated dictionary of authentic IPA transcriptions for essential professional and common English words with an algorithmic English phonotactic rule engine.
- Invariant: NEVER returns `/${word}/`.
- `ReadingWordModal.tsx` and `useReadingArticles.ts` preserve authentic IPA phonetics starting with stress marks (`/'` or `ˈ`), and only replace phonetics if they are missing or identical to the bare word.
