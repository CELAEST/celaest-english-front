# Interview Audio Synchronization & Level Change Memory

## Issue
When changing CEFR level in Interview or switching tabs, questions were regenerating while the skeleton UI was displayed, but the TTS speech audio would start immediately during the skeleton state.

## Root Cause
1. `useInterviewQuestionManager`: `setActiveCefrLevel` immediately cleared questions without issuing an audio abort signal.
2. `useInterviewSession`: Auto-speak `useEffect` fired synchronously without checking if `isGeneratingQuestions` was true or if `sessionQuestions.length === 0`. Furthermore, it did not wait for the actual DOM paint (skeleton -> live UI transition).

## Fix Implemented
1. Added `onLevelWillChange` callback to `useInterviewQuestionManager` and invoked it inside `setActiveCefrLevel` before questions are reset, stopping TTS immediately (`SpeechSynthesisService.stop()`), clearing speech state and cancelling timers.
2. Guarded auto-speak in `useInterviewSession`:
   - Checks `if (questions.isGeneratingQuestions || questions.sessionQuestions.length === 0) return;`
   - Defers TTS playback via `requestAnimationFrame` + 120ms timeout so the skeleton is guaranteed to unmount and the full UI is rendered and visible before the AI speaks.
   - Cleans up `rAF` and timer on unmount, view deactivation, level switch, skip, and repeat actions.
