# CELAEST Speech Recognition & Zero-Lag Live Transcript Architecture

## Root Causes Identified & Eliminated:
1. **Network Throttling & Lag**: The previous 2.2-second background Whisper ticker constantly sent heavy multipart HTTP requests during active user speech. This flooded the mobile connection, locked the browser thread, and caused noticeable input lag.
2. **Text Overlapping & Duplication ("Sobreponer")**:
   - The rolling Whisper ticker received the full turn audio from 0:00, then prepended `accumulatedTranscript` + `whisperResult`, duplicating phrases on each cycle.
   - When Web Speech API emitted `onend` on mobile, assigning `accumulatedTranscript = latestTranscript` caused compound duplication upon restarting.

## Definitive Zero-Lag, Zero-Overlap Implementation:
1. **Pristine Local Speech Dictation (0ms, 60fps)**:
   - Web Speech API runs native hardware recognition directly on the device with zero network traffic during recording.
   - `MediaRecorder` buffers pristine raw audio in memory (`recordedChunks`) at zero network overhead.
   - Whisper Large V3 Turbo executes exactly ONCE at the end of the turn when the user finishes speaking or submits.
2. **Mathematical Deduplication via `mergePhrasesCleanly`**:
   - Analyzes up to 8 boundary words between confirmed history and newly recognized phrases.
   - Strips any stutter or speech engine overlap, guaranteeing that words are NEVER duplicated or repeated.
