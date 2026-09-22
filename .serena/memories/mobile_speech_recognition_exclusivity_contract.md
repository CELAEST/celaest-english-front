# Mobile Speech Recognition Exclusivity & Real-Time Fluidity Contract

## Root Cause Solved
On mobile platforms (Chrome on Android & Safari on iOS), the hardware microphone (`AudioSource.MIC`) is subject to strict OS-level exclusive device locking:
- If `getUserMedia` is called or `MediaRecorder` runs concurrently, Android/iOS locks the audio input.
- Any subsequent `webkitSpeechRecognition.start()` call fails immediately with an `audio-capture` error or silently dies, meaning `onresult` never fires and the screen remains blank on mobile phones ("no está ni siquiera haciendo la transcripción").
- Conversely, on desktop operating systems (Windows WASAPI, macOS CoreAudio), the OS audio mixer supports shared mic access, which masked this bug in desktop testing.

## Implemented Architecture
1. **Adaptive Exclusive Mic Protocol (`audioCaptureService.ts`)**:
   - On mobile devices where `SpeechRecognitionAPI` is present (`isMobileDevice() && isSpeechRecognitionSupported()`), `AudioCaptureService` releases any active `micStream` tracks (`track.stop()`) and does NOT launch `MediaRecorder` concurrently.
   - Native `SpeechRecognition` is granted 100% exclusive, uncontested access to the microphone hardware.
   - `useInterviewSession.ts` skips `getUserMedia` / `initMicrophone` on mobile when `SpeechRecognition` is supported, eliminating HAL driver lock contention.
2. **Continuous Fluidity with Auto-Restart**:
   - Recognizer is configured with `continuous: true` and `interimResults: true`.
   - On pauses or long silences where mobile OS speech engines fire `onend`, `createAndStartRecognizer()` restarts debounced and commits text cleanly.
3. **Prefix-Aware Deduplication (`mergePhrasesCleanly`)**:
   - Added `startsWith` and `includes` guards to handle full utterance expansions across restarts without repeating phrases or words.
4. **Organic Waveform on Mobile (`getMicVolume`)**:
   - Generates an organic sinusoidal pulse (0.18 - 0.28) while `isListening` on mobile so UI spectrum animations remain active without requiring `AnalyserNode`.
5. **Quality Gate Certified**:
   - `vitest` suite: 14/14 tests pass in `audioCaptureService.test.ts`.
   - `tsc --noEmit`: 0 errors.
   - `npm run audit:hardcode`: 100% clean.
   - `npm run build`: Production bundle built in 59.32s.
