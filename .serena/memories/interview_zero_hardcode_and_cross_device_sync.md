# Architectural Standard: Interview Zero Hardcode & Cross-Device Sync

## Summary
Completed the comprehensive eradication of hardcoded interview questions, infinite question repetition bugs, and cross-device state desynchronization between mobile and desktop.

## Root Causes Resolved
1. **Hardcoded Question Banks Eradicated (Option A)**:
   - Deleted all static question template pools in `dynamicQuestionService.ts` (~860 lines deleted).
   - `dynamicQuestionService.ts` now exclusively provides `normalizeCefr` and `classifyProfession` with Spanish accent normalization (`.normalize("NFD").replace(/[\u0300-\u036f]/g, "")`).
   - If AI question generation ever fails, the UI opens the AI infrastructure recovery modal with retry capability, rather than silently injecting hardcoded questions.
2. **Anti-Repetition & Anti-Modulo Architecture**:
   - Eliminated the `% length` modulo that wrapped back to question 1 after 5 questions.
   - `AiInterviewQuestionGenerator` now receives `avoidQuestions` (the list of all previously asked questions in the session) and instructs the LLM via prompt mandate never to repeat or rephrase past questions.
   - Proactive background replenishment is triggered whenever remaining questions <= 2.
3. **Cross-Device State Synchronization (PC <-> Mobile)**:
   - Backend `interview_progress` schema expanded in `cmd/api/main.go` and `internal/interview/repository.go` with idempotent migrations to store:
     - `cefr_level VARCHAR(10) NOT NULL DEFAULT 'B1'`
     - `session_questions TEXT NOT NULL DEFAULT '[]'`
     - `asked_questions TEXT NOT NULL DEFAULT '[]'`
   - Frontend `useInterviewCloudSync.ts`:
     - Implements Server-Wins hydration: when opening on PC or mobile, the authenticated user's exact CEFR level, role, question index, active question pool, and previous questions are restored from the server.
     - Adds `document.addEventListener("visibilitychange")`: when a tab becomes active, it syncs with the server in case questions were advanced on another device.
     - Eliminates wasteful debounced saves on every spoken character of `userTranscript` (which flooded the backend with 40+ requests). Saves are now strictly event-driven (turn completion, skip/advance, level change, modal toggle).
