# Architectural Standard: Interview Per-Level Question Persistence & Cross-Device Sync

## Summary
Resolved the issue where interview questions were reset, lost, or desynchronized across devices (PC <-> Mobile) and across CEFR levels.

## Key Root Causes & Architectural Resolutions
1. **Multi-Level Isolation in PostgreSQL (`interview_progress`)**:
   - Upgraded table primary key from single `user_id` to composite `PRIMARY KEY (user_id, cefr_level)`.
   - Idempotent PL/pgSQL migration in `cmd/api/main.go` and `internal/interview/repository.go` drops the old single-column PK constraint and establishes the composite PK without data loss.
   - `SaveProgress`: Upsert target is `ON CONFLICT (user_id, cefr_level) DO UPDATE SET ...`, allowing questions and progression for A1, A2, B1, B2, C1, and C2 to coexist independently for the same user.
   - `GetProgress`: Supports `cefrLevel` filtering (`WHERE user_id = $1 AND UPPER(cefr_level) = UPPER($2)`), with an automatic fallback to the user's latest active level (`ORDER BY updated_at DESC LIMIT 1`) if omitted.
2. **Deterministic Pending Question & No Premature Regeneration**:
   - The pending question displayed to the user is loaded directly from PostgreSQL/localStorage.
   - The question is NEVER replaced or randomly regenerated until the candidate explicitly answers it or clicks "Siguiente / Skip".
   - Opening on mobile or refreshing on desktop restores the exact pending question and question index.
3. **Round Sliding Queue & Immediate Synchronization**:
   - Questions are generated in batches of 5 per round.
   - When advancing (`skipQuestion` or answer evaluation), `currentQuestionIndex` increments, the question is tracked in `askedQuestions`, and state is immediately persisted via `saveProgressNow` (bypassing debounce) to prevent race conditions during rapid device switches or page closes.
   - Background replenishment triggers dynamically when remaining questions <= 2, appending the next round batch.
4. **Seamless Level Switching**:
   - When switching between CEFR levels (e.g. A1 -> B1 -> A1), the frontend hydrates the saved questions and progress of the target level.
   - `useInterviewQuestionManager` and `useInterviewCloudSync` ensure that changing levels preserves each level's independent question pool without overwriting or generating duplicate questions.
