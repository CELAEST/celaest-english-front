# CELAEST Liam (ElevenLabs) Voice & Dynamic Masterclass Standard (Definitive)

## 1. Official Mentor Voice Contract: Liam (ElevenLabs)
- **Voice ID**: `TX3LPaxmHKxFdv7VOQHJ` (Liam - Young adult male, modern, natural, crisp articulation in bilingual Spanish & English).
- **Backend Model**: `eleven_flash_v2_5` (ultra-low latency ~100ms, multi-lingual conversational prosody).
- **Embedded API Key Shield**: In `internal/tts/service.go`, if `os.Getenv("ELEVENLABS_API_KEY")` is unset, it automatically falls back to the authorized key `sk_77cc857dd6acc38174aedd37ea239e3ec438ba22ac831d9f`.
- **Strict Male Shield (Zero Female Leaks)**:
  - If an ElevenLabs request ever fails or times out, the backend MUST NEVER fall back to TikTok `en_us_001` (female).
  - Liam requests strictly fall back to local Piper `es_MX-claude-high` (Spanish male) or Edge `en-US-ChristopherNeural` (English male).
- **Two-Layer Persistent Cache (RAM + Disk)**:
  - Every audio synthesized with Liam is immediately stored in RAM (`audioCache`) AND persisted to disk (`data/tts_cache/<sha256>.mp3`).
  - Survives server reboots and application restarts with guaranteed 0ms response time and zero re-consumption of ElevenLabs quota.

## 2. Dynamic Masterclass Pacing & Visual Ergonomics
- **Fast-Track Pacing**: Eliminated the artificial 3200ms lock in `PathwayLectureEngine.ts`. The slide transitions immediately upon audio `onEnd` with a crisp 180ms breath pause.
- **Example Synchronization**: In `useProfessorStageState.ts`, `isShowingExamples` stays active throughout both the `MODELO NATIVO` and `SECRETO FONÉTICO` segments so the user can inspect the English phrase, translation, and phonetics in real-time while Liam explains them.

## 3. Interactive Spoken Coaching in BUILD & SPEAK (`usePathwayStageSession.ts`)
- **Block Builder (BUILD)**:
  - *Error*: If the student places an incorrect token combination, Liam speaks a supportive guidance tip (`mistakeHintSpanish`).
  - *Success*: When correct (`isBuildCorrect`), Liam speaks: *"¡Excelente! Lo armaste en orden natural: [sentence]. Ahora vamos a certificar tu voz."* and auto-advances to `SPEAK`.
- **Voice Certification (SPEAK)**:
  - *Entry*: Liam guides: *"Escucha con atención cómo lo pronuncio yo: [sentence]. Ahora activa tu micrófono y dilo tú para certificar tu avance."*
  - *Victory*: When certified (`isConquered`), Liam celebrates: *"¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto."*
