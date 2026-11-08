# PC & Mobile Live Transcript Platform Isolation & Mobile Incognito / Single-Recorder Contract

## Core Architectural Mandate
Desktop PC (`!isMobileDevice()`) and Mobile (`isMobileDevice() === true`) MUST remain 100% isolated in `AudioCaptureService` and `useInterviewRecording.ts`.

## 1. Why Mobile Failed Previously (3 Forensic Root Causes)
1. **Incognito / Zero Local Audio Key + `await getUserMedia()` Gesture Loss & OS HAL Lock**:
   - In Incognito or when a phone has no local audio key (`groq`/`openai`/`gemini`) in `localStorage` and Render's `/ai/audio/transcribe` returns `500`, AI audio `/transcribe` cannot succeed.
   - Calling `await AudioCaptureService.initMicrophone()` (`getUserMedia`) on Mobile BOTH locks `AudioSource.MIC` in Android AudioFlinger / iOS AVAudioSession (blocking `SpeechRecognition` with `audio-capture`) AND destroys synchronous transient user-tap activation (`recognizer.start()` rejected when called asynchronously!).
2. **Dual `MediaRecorder` Conflict on Mobile**:
   - Creating TWO concurrent `MediaRecorder` instances on the same `MediaStream` breaks iOS Safari WebKit (`MediaRecorderPrivateAVFImpl`) and mobile Blink capture.
3. **Screen-Tap Spike Deadlock (`analyserConfirmedAlive`)**:
   - Tapping the phone glass produces an 80ms acoustic spike (`energy >= 0.032`) while normal mobile speech without AGC sits around `0.012-0.025`. Never block `MobileLiveStreamEngine` partial updates on `utteranceVoicedMs < 240`.

## 2. Permanent Mobile Dual-Path Protocol
- **Path A — Mobile WITHOUT Local Edge Audio Key (`!hasLocalAudioTranscriptionKeySync()`, e.g. Incognito or DeepSeek-only or Central Core)**:
  - `useInterviewRecording.startRecording()` synchronously calls `AudioCaptureService.releaseMicStream()` and skips `await initMicrophone()`.
  - `AudioCaptureService.startRecognition()` runs synchronously (`0ms`, inside the exact user tap gesture!) and launches **Exclusive Native `SpeechRecognition`** (`continuous = false`, `interimResults = true`, `120ms` `onend` auto-restart) for instant 60fps live dictation with zero API keys needed.
- **Path B — Mobile WITH Local Edge Audio Key (`groq` / `openai` / `gemini` sealed in `localStorage`)**:
  - Uses `autoGainControl: true` in `acquireOptimalMicStream(true)` and **ONLY ONE `MediaRecorder`** (`this.mediaRecorder`).
  - `MobileLiveStreamEngine` reads snapshots via `getRecordedBlob()` (`1.1s` initial live update, `1.2s` continuous streaming, `420ms` micro-pause instant flush, `28ms`/word `useKineticTranscriptStream`), never deadlocking on passive `AnalyserNode`, and remembering failed key fingerprints (`lastFailedMobileKeyFingerprint`) to switch immediately to Path A if keys expire.

## 3. Desktop PC (`!isMobileDevice()`)
- 100% isolated: physical mic auto-selection (`audioHardwareSelector.ts`), native `SpeechRecognition` (`continuous = true`), and 100ms acoustic VAD self-healing (`0` `/transcribe` calls in normal speech or silence).
