# CELAEST Mobile Real-Time Live Transcript Architecture

## Problem Solved
On mobile devices (iOS Safari, Android Chrome, mobile webviews, Firefox Mobile):
1. `SpeechRecognition.continuous = true` caused WebKit on iOS Safari to immediately abort or emit 0 results silently.
2. Concurrent access to the microphone between `MediaRecorder` and `SpeechRecognition` on Android Chrome frequently triggered `audio-capture` or `not-allowed` errors.
3. In `useInterviewSession.ts`, catching `not-allowed` from Web Speech was triggering `setIsMicRecoveryModalOpen(true)` and killing the user's turn even though `navigator.mediaDevices.getUserMedia` and `MediaRecorder` had active mic hardware access.
4. On browsers without Web Speech API, live speech preview was completely blank.

## The Dual-Stream Mobile Solution
1. **Mobile Platform Detection & Parameter Tuning**:
   - `isMobile`: `recognizer.continuous = !isMobile`.
   - On mobile, `onend` restarts after 150ms debounce, ensuring seamless continuous speech without triggering WebKit aborts.
2. **Error Shielding**:
   - Suppressed non-fatal collisions (`audio-capture`, `not-allowed`) in `SpeechRecognition.onerror` whenever `isMobile` or `AudioCaptureService.hasActiveMic()` is true.
3. **Dual-Stream Rolling Whisper Transcriber**:
   - In `AudioCaptureService.startRecognition(...)`, a background rolling ticker (2.2s) takes snapshots of `mediaRecorder` buffered chunks if Web Speech API hasn't emitted new text for >= 2.2s.
   - Calls `AudioCaptureService.transcribeAudio(sliceBlob, { roleName, question })`.
   - Directly feeds live transcript to `options.onTranscript` and checks for live Spanish alerts.
   - Cleared cleanly in `stop()` and `stopAndGetAudio()`.
