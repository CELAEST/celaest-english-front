# Architecture Contract: Cloud DB & Local Question Persistence on Reload (Zero AI Waste)

## 1. Problem
On every page reload, an unnecessary call was made to Groq AI to generate questions again, even if the user already had questions in their session.

## 2. Root Cause Analysis
1. **Backend Discarding Questions (`internal/interview/repository.go`)**:
   PostgreSQL `ON CONFLICT (user_id, cefr_level) DO UPDATE SET session_questions` had a conditional branch requiring `$12 = true` (`replaceQuestions`) to update `session_questions` if questions were already present. Since `$12` was false, PostgreSQL executed `ELSE interview_progress.session_questions`, ignoring the new questions sent by the frontend and keeping old/stale questions.
2. **Premature Local Storage Wipeout (`interviewPersistence.ts`)**:
   `loadPersistedInterview` contained `isFinished = currentQuestionIndex >= sessionQuestions.length`. When advancing rounds or when index reached the end of the batch, it ran `clearPersistedInterview` on reload, erasing the entire local cache.
3. **Level Mismatch Discard on Mount (`useInterviewQuestionManager.ts`)**:
   On mount, `activeCefrLevel` initialized to a fallback ("B1") if `initialLevel` was missing, while restored questions had `"A1"`. `hasLevelMismatch` discarded the restored questions (`[]`), triggering effect 1 to call Groq AI.

## 3. Surgical Solutions
1. **PostgreSQL Always Persists Questions (`internal/interview/repository.go`)**:
   When `EXCLUDED.session_questions` is non-empty, PostgreSQL unconditionally writes `session_questions = EXCLUDED.session_questions`.
2. **Accurate Index Persistence**:
   `current_question_index = EXCLUDED.current_question_index`, preserving the exact question index without forced resets to 0.
3. **Preserved Local Storage Cache (`interviewPersistence.ts`)**:
   Removed `isFinished` purge. Cache is only cleared on legitimate 24h TTL expiration.
4. **Seamless Level Matching (`useInterviewQuestionManager.ts`)**:
   Adopts `persistedQuestions[0].targetLevel` on mount so that restored questions immediately match `activeCefrLevel`.
5. **Explicit Replace Flag (`useInterviewCloudSync.ts`)**:
   Sends `replaceQuestions: true` whenever `questions.length > 0`.

## 4. Verification
- `celaest-english-back`: All unit and DB integration tests passed 100%. Fresh binary built and pushed in commit `a44722d`.
- `celaest-english-front`: `npx tsc --noEmit` passed with 0 errors. All 17 Vitest test suites (154 tests) passed 100%. `npm run audit:hardcode` passed. Pushed in commit `21c1ac0`.
