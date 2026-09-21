# CELAEST Standards: Interview Mobile Speech Evaluation & Touch Interaction Architecture

## Context & Mandate
- In mobile viewports (iOS/Android mobile browsers), users reported that speaking answers to interview questions resulted in immediate rejection toasts ("Respuesta muy breve o incompleta") or that the AI did not evaluate their answers even after speaking genuinely.
- Root causes:
  1. Synthetic touch double-firing (`onTouchEnd` followed 20ms later by synthetic `onClick`) immediately stopping microphone recording before user speech could begin.
  2. False rejection in `speechIntelligibilityGuard` due to missing everyday and professional verb markers (e.g. `care`, `treat`, `study`, `support`, `examine`, `diagnose`, etc.).
  3. Whisper short hallucinations/fragments overwriting the full, live Web Speech API transcript on mobile submit.
  4. Modal suppression gate: `isSpanishOrZero` toast prevented the `InterviewAnalysisModal` from displaying genuine evaluation results, score breakdowns, and C2 model answers for English responses.
  5. AI Evaluator Prompt Rule 10 overly strict on concise beginner responses.

## Key Architectural Solutions

### 1. Touch & Click Event De-duplication on Mobile (`ConversationMicControl.tsx`)
- Standard HTML `<button>` elements with `onClick` and `touch-manipulation` CSS handle touch events natively across modern mobile browsers.
- Attaching both `onTouchEnd` and `onClick` causes double toggles in React 18 because passive touch event listeners do not block simulated clicks.
- Implemented a 400ms timestamp debounce ref (`lastMicToggleRef`) on `handleMicClick` to completely prevent re-entrant or bounce triggers.

### 2. Universal Verb & Structural Validation (`speechIntelligibilityGuard.ts`)
- Expanded `ENGLISH_VERB_MARKERS` with 30+ everyday, medical, business, and clinical verbs (`care`, `treat`, `study`, `assist`, `support`, `examine`, `diagnose`, `prepare`, `evaluate`, `manage`, `provide`, etc.).
- Beginners (A1 and A2) are permitted 3+ structured English words with predicates (e.g. *"I care for patients"*, *"I treat people"*, *"I work here"*).

### 3. Whisper Transcript Sovereignty Guard (`useInterviewSession.ts`)
- On audio submission, if Whisper returns a short fragment or hallucination, it only overrides the active transcript if its word count is greater than or equal to the existing transcript, or if the existing transcript had fewer than 3 words.
- This prevents Whisper from downgrading a full multi-word live speech recognition transcript.

### 4. Zero English Modal Suppression (`useInterviewSession.ts`)
- The evaluation modal (`InterviewAnalysisModal`) is ONLY suppressed if the response was genuinely detected as Spanish (`isSpanish === true`).
- Genuine English responses (whether short, elementary, or complete) are NEVER blocked with toast warnings. The analysis modal always opens to present detailed pronunciation, grammar, CEFR rating, and C2 executive model answers.

### 5. AI Prompt Pedagogical Calibration (`coreAiEvaluatorService.ts`)
- Rule 10 updated to award fair scores (75-95% for A1/A2, 50-70% for B1+ single-sentence answers with STAR expansion guidance) instead of assigning 0 scores with "Respuesta muy breve o incompleta".
