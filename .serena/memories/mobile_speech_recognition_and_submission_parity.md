# Mobile Speech Recognition & Zero False-Positive AI Evaluation Standard

## 1. Zero False-Positive AI Evaluation & Spanish Rejection Guard
- **Bug Root Cause**: In `useInterviewSession.ts`, checking `feedbackTitleLower.includes("español") || feedbackTitleLower.includes("spanish")` without requiring `feedback.overallScore === 0` caused legitimate English evaluations to be discarded whenever pedagogical feedback mentioned Spanish interference (e.g. "Interferencia del español: omisión de auxiliar"). The app wiped the transcript and showed a false Spanish detection toast instead of opening the feedback modal.
- **Strict Rule**: Rejection as Spanish requires BOTH:
  1. `feedback.overallScore === 0`
  2. `feedbackTitleLower.includes("respuesta en español") || feedbackTitleLower === "respuesta en español" || feedbackTitleLower.includes("non-english")`
- Evaluations with `overallScore > 0` must ALWAYS open the analysis modal (`setShowAnalysisModal(true)`).

## 2. Transcript Preservation (Zero User Data Loss)
- Never call `setUserTranscript("")` or wipe user text upon receiving a Spanish notice (`onSpanishDetected`) or non-intelligible warning.
- Preserving user text keeps what was spoken or typed intact, allowing user corrections or edits without starting from scratch.

## 3. Uninterrupted Continuous Speech Recognition on Mobile
- Setting `recognizer.continuous = true` across both mobile and desktop prevents native SpeechRecognition from shutting down after short pauses or breaths.
- Cumulative result deduplication via `mergePhrasesCleanly` prevents duplicated phrase arrays without needing `continuous: false`.
- Never gate active mic checks behind `!isMobile`; if `AudioCaptureService.hasActiveMic()` is true, spurious `not-allowed` SpeechRecognition events are safely ignored on both platforms.

## 4. Green Button (OK) Instant Submission
- When the user presses the green checkmark button while recording, `stopAndGetAudio()` is awaited, and if the user transcript has updated in the final milliseconds, `textToSubmit` adopts the latest transcript.
- If `liveWords >= 3`, submission passes directly to `processTurn` without 5–15s Whisper blocking. Whisper remains available as a fallback when `liveWords < 3` and an audio blob exists.