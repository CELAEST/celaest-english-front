# Architectural Resilience: Mobile Mentor Audio Playback & Live Transcription

## Root Causes Resolved
1. **Aria/Chris Touch Target Failure on Mobile**:
   - Small button height (`p-0 text-[11px]`) caused touch taps on mobile screens to miss or hit adjacent text.
   - Fixed with expanded tap padding (`py-2 px-2 -my-2 sm:my-0 sm:p-0 min-h-[36px] sm:min-h-0 touch-manipulation active:scale-95`).
2. **Audio Abort & Playback Lock**:
   - `SpeechSynthesisService.stop()` setting `audio.src = ""` caused subsequent `audio.play()` calls to abort with `AbortError`.
   - Removing `audio.src = ""` and falling back gracefully to Web Audio (`MobileAudioUnlocker.playNeuralBuffer`) / SpeechSynthesis ensures uninterrupted playback and triggers `options.onEnd()` reliably.
3. **Live Transcript Streaming on Mobile**:
   - `AudioCaptureService` debouncing speech restart was clearing non-final text when mobile speech engines paused after 1-2s of silence.
   - Added `latestTranscript` tracking to retain speech across engine pause cycles.
   - Removed `isAiSpeakingRef.current` gating in `onTranscript` so user speech is captured even during mentor state transitions.
   - Removed artificial 180ms throttling for instant real-time streaming.
   - Excluded momentary `audio-capture` errors from tripping the permission recovery modal.
