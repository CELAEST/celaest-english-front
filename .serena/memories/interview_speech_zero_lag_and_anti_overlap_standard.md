# Interview Speech Zero-Lag & Anti-Overlap Standard (CELAEST Quality Gate)

## 1. Zero-Blocking Submit Direct Pass-Through
- When the candidate finishes speaking and triggers submission (`submitCurrentTurn`), if the transcript already has >= 3 words captured via Web Speech API or manual editing, the system immediately dispatches evaluation to the AI Mesh without awaiting Whisper (`transcribeAudio`).
- Whisper is strictly reserved as an automatic fallback when fewer than 3 words were detected (e.g. browsers lacking native Web Speech API or mic stream gaps).
- Eliminates 5-10s of blocking cloud roundtrips and avoids overwriting candidate speech.

## 2. Anti-Overlap & Clean Boundary Merge Protocol
- `stopRecording` must never naively concatenate previous session prefixes (`${prefix} ${segmentText}`).
- All segment joins must pass through `mergePhrasesCleanly` to perform boundary deduplication.
- If live transcript already holds sufficient words (>= 3 words), `stopRecording` transitions to IDLE immediately without kicking off background Whisper overwrite.

## 3. Component Memoization
- Modal and carousel components (`InterviewAnalysisErrorCarousel`, `ResponsiveInterviewHUD`, `VideoOrb`) must remain wrapped in `React.memo` to eliminate Main Thread frame drops during recording and audio playback.
