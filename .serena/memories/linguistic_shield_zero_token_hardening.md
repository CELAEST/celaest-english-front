# Linguistic Shield & 0-Token Defense Architecture
- **Problem**: When candidate spoke silence, ambient noise, or tiny sentence fragments (e.g. Whisper hallucination "a lot of people." with avg_logprob -1.53), it bypassed the < 3 words check, reached LLM completions endpoint, spent tokens, scored 98%, and opened the evaluation modal.
- **Solution implemented**:
  1. `speechIntelligibilityGuard.ts`:
     - Added `avgLogprob` & `noSpeechProb` acoustic screening (< -0.95 flags `WHISPER_HALLUCINATION`).
     - Added common Whisper silence hallucinations including "a lot of people", "lots of people", "you know", "so yeah".
     - Minimum word count raised to 4 words. For utterances under 6 words, checked against `ENGLISH_VERB_MARKERS` (~100 verbs) or inflection endings (-ed, -ing); rejects dangling noun phrases as `INSUFFICIENT_WORDS`.
     - Executed gibberish/keyboard mash check before word count to preserve error categorization.
  2. `audioCaptureService.ts`: Extracted and returned `avgLogprob` and `noSpeechProb` from Whisper responses.
  3. `useInterviewSession.ts`:
     - Passed Whisper acoustic metadata to `validateSpeechIntelligibility`.
     - Pre-flight blocks turn submission and triggers `appToast.ambientNoise` / `appToast.warning` / `appToast.gibberishDetected` with **0 tokens spent** (LLM never called).
     - Second layer defense in `processTurn`: if overallScore is 0, words < 5, or explanation says "demasiado corta/breve/incompleta", suppresses evaluation modal.
  4. `coreAiEvaluatorService.ts`: Added Rule 10 to prompt explicitly forbidding high scores on fragments/incomplete answers.
  5. `ToastProvider.tsx` & `toast.ts`: Added inline padding and box-sizing fallbacks, removed redundant toast in Reading practice.