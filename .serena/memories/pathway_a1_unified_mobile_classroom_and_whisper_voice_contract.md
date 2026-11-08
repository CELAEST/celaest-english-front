# Pathway A1 Unified Mobile Classroom, Real Whisper Voice Gate & 32-Base Continuity Contract

## 1. Unified Mobile Face-to-Face Classroom (`< 1024px`) vs Desktop (`>= 1024px`)
- **Viewport Orchestration (`useIsDesktopViewport.ts`)**: Reactive `matchMedia("(min-width: 1024px)")` separates Desktop (`PathwayDesktopClassroom.tsx` — 2-column Zero-Scroll classroom) from Mobile (`PathwayMobileTopBar.tsx` + `PathwayProfessorStage.tsx` with `isMobileUnified={true}`).
- **Zero-Switch Mobile Flow**: On mobile, the student NEVER leaves Liam's face to go to a separate full-screen blackboard. All 3 classroom moments (`1. Regla` -> `2. Construir` -> `3. Habla`) plus `Preguntar` (Q&A) and `Fórmula` execute directly inside the adaptive crystal card (`ProfessorLessonBoard.tsx` -> `LessonBoardBody.tsx` -> `MobileBoardBuildStep.tsx` / `MobileBoardSpeakStep.tsx`).
- **Adaptive Half-Body Framing**: `PathwayProfessorStage` uses `aspect-square max-h-full w-auto mx-auto` inside a `flex-1 min-h-[120px]` stage container, keeping Liam visible down to the bottom hem of his patchwork hoodie with 0px top clipping across `375x667` (iPhone SE) and `390x844` (iPhone 14).
- **Single-Line Mobile Top Bar (`PathwayMobileTopBar.tsx`)**: Displays `BASE 01 ▾` (curriculum sheet), `LevelSelectorPill` (`A1 ▾`), `1. Regla · 2. Construir · 3. Habla` step tabs, and `Guía` (`PathwayAnatomyModal` with 14 Blocks & 44 Phonemes).

## 2. Real Whisper V3 Turbo Voice Evaluation & 2-Attempt Silent Policy
- **Real Audio Evaluation (`pathwayVoiceEvaluator.ts`)**: `stopAndEvaluatePathwayVoice` stops `AudioCaptureService`, evaluates the recorded `audioBlob` (`>= 400` bytes or `pendingTailBlob`) via `AudioCaptureService.transcribeAudio()` (Groq Whisper V3 Turbo -> OpenAI -> Gemini -> Backend `/ai/audio/transcribe` cascade), rejects silence hallucinations (`noSpeechProb > 0.82 && !hadVoicedSpeech`), falls back to live Web Speech transcript only if Whisper returns `null`, runs `PathwayPronunciationEngine.evaluate` (phonetic pairs + Levenshtein `>= 80%`), and revokes `capture.audioUrl` via `URL.revokeObjectURL` in `finally`.
- **2-Attempt Silent Policy (`usePathwayStageSession.ts`)**: `canSkipWithoutMic = micUnavailable || failedVoiceAttempts >= 2`. Initially hidden on both Mobile and Desktop; `"Modo silencioso (no puedo hablar ahora) →"` only unlocks if microphone hardware/permission is unavailable or after 2 unsuccessful voice attempts.

## 3. Chibi Robot OLED Visor Priority (`useProfessorStageState.ts`)
- Priority chain guarantees expressive fidelity across all 10 classroom use cases:
  1. `isRecordingMic` -> `"listening"` (`ear_radar` sound waves)
  2. `isAskingQA || isEvaluatingVoice` -> `"thinking"` (`processing_dots`)
  3. `isConquered || (step === "BUILD" && isBuildCorrect)` -> `"celebrating"` (`happy_eyes` `^ ^` + cyber blush + smile, even while congratulatory TTS is playing)
  4. `isSpeakingAudio || isTyping` -> `"explaining"` (`vocal_wave`)
  5. Otherwise -> `"idle"` (organic blinking + cursor gaze)

## 4. 32/32 A1 Sentence Continuity & PostgreSQL Sync Guard
- **100% Sentence Continuity**: Across all 6 A1 modules (`module1Identity.ts` .. `module6FluencyAndBridge.ts`, 32 foundations), `blockChallenge.targetTokens.join(" ")` matches `voicePractice.sentenceEnglish` word-for-word (enforced by automated Vitest gate in `pathwayVoiceEvaluator.test.ts`).
- **PostgreSQL 32-Foundation Sync Guard (`ApiPathwayRepository.ts`)**: `getCurrentPathway` returns `null` whenever `GET /pathway/current` returns `null` or `< minExpectedNodes` (`32`), triggering `generateOrSyncPathway` (`POST /pathway/generate` with `clientNodes`, plus `forceRegenerate: true` upgrade if legacy 5-node rows exist) so new and legacy users sync 32 UUID foundations in PostgreSQL in ~15ms without local-seed race conditions.
