# Interview Voices & Reading Mobile Experience Standard

## 1. Interview Voices (Chris & Aria) Direct Audio Playback Architecture
- **Web Audio Analyser Bug & Silence Elimination**: Previously, `SpeechSynthesisService` was attempting to hook every `Audio` instance into an `AudioContext.createMediaElementSource(audio)`. In mobile browsers (iOS Safari, Android Chrome) and cross-origin dev setups, this muted the audio to total silence due to suspended AudioContext state and CORS restrictions on media element sources.
- **Direct HTML5 Audio Engine**: Switched to direct `new Audio(audioSource).play()` matching `useReadingAudioNarrator`. If offline or direct fetch fails, automatic fallback to device native speech synthesis (`speakFallback`).
- **Instant Vocal Feedback on Selection**: In `useInterviewSession`, selecting "Chris" or "Aria" now triggers immediate playback of the active question with the selected voice, accompanied by `celaest:interview:hasInteracted` storage persistence.

## 2. Dynamic LAN Host Resolution for Real Mobile Testing
- **Local Network Support**: In `src/shared/constants/env.ts`, `getDefaultHost(port)` resolves `window.location.hostname` when accessing from a real mobile phone (e.g. `http://192.168.1.x:3000`). It dynamically directs API/TTS requests to `http://192.168.1.x:8080/api/v1` instead of failing against the phone's non-existent `localhost:8080`.
- **Development CSP**: `vite.config.ts` allows `http:` in `media-src` and `connectSrc` in dev mode so mobile testing is never blocked by Content Security Policy.

## 3. Reading Mobile Typography & Affordance Standard
- **Base Font Size Elevation**: Increased base reading text size from `14.5px` to a generous and comfortable `17px` (`text-[17px] sm:text-[18px] lg:text-[18.5px] leading-[1.75] sm:leading-[1.85]`).
- **Tri-Level Font Cycler (`aA`)**: Added luxury typography control in `ReadingArticleHeader` allowing users to cycle between `Estándar` (17px), `Grande` (19px), and `Extra` (21px), persisted to `localStorage` (`celaest:reading:font_size`).
- **Tactile Affordance Pill**: Added clean bilingual micro-banner pill (`Toca cualquier palabra para ver traducción y fonética`) using `VocabloTranslateIcon`, accompanied by tactile touch reactions (`active:scale-[0.97] active:bg-white/20 active:text-white transition-transform`) on all interactive words.
