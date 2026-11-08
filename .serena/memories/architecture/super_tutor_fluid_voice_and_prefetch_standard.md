# CELAEST Super Tutor & Fluid Voice Architecture Standard

## 1. Zero-Pause & Zero-Stutter In-Memory Audio Prefetching
- **Root Cause of Previous Latency & Cuts**: 
  - `readingAudioPrefetcher` had language types restricted to English (`FlagshipVoiceId`), forcing `isSpanish ? null` in `speechSynthesisService.ts`. Every single Spanish slide triggered an on-demand network round-trip.
  - Sequential awaiting blocked slide progression until the next network audio finished downloading (3-6s).
  - Network timeouts/interruptions triggered browser SAPI fallback (`window.speechSynthesis`), producing robotic Windows system voices (Sabina/David).
- **The Zero-Latency Solution**:
  - `readingAudioPrefetcher` now caches and prefetches both English and Spanish voices universally.
  - When `PathwayLectureEngine.playLecture` begins, it immediately launches background prefetching for all lecture segments simultaneously into Blob URLs in browser memory.
  - Transition between slides takes 0ms because audio is already pre-decoded in RAM.

## 2. Voice Selection Contract
- **Spanish Super Tutor**: `es-CO-GonzaloNeural` (Colombian Spanish male) - Ranked #1 for warmth, natural breathing, human cadence, and conversational intonation. Deprecated and banned: `es-MX-JorgeNeural` (robotic monotone).
- **Open-Source Local Engine**: `piper:claude` (`es_MX-claude-high`) and `es_ES-davefx-medium` in `celaest-english-back/data/piper/`, delivering 400ms local offline synthesis with zero network dependencies.
- **English Native Model**: `en-US-AriaNeural` (warm, natural female) and `en-US-ChristopherNeural` (executive male).

## 3. Super Tutor Screen-Oriented Pedagogy
- **1-Time Software Tour**: Stored in `localStorage` under `celaest_software_intro_seen`. Spoken strictly once in the student's journey, explaining the 3 learning stages (Rule, Kinetic Blocks, Voice Unlock) and 3D mentor interaction. Never repeated in subsequent bases.
- **Visual Screen Guidance**: Every slide actively references visual UI elements:
  1. *Regla Visual*: "Mira la tarjeta de la regla a tu izquierda..."
  2. *Trampa L1*: "Fíjate en el error común marcado en rojo... jamás digas [X], la forma natural es [Y]"
  3. *Ancla Mental*: "Tu ancla mental definitiva es [Rule]"
  4. *Modelo Nativo*: Real English audio sample with Aria Neural
  5. *Secreto Fonético*: Concrete connected speech tip (linking, elision)
  6. *Activación Cinética*: "Ahora te toca a ti: abajo a la izquierda tienes las fichas léxicas para el paso de Ensamblaje..."
