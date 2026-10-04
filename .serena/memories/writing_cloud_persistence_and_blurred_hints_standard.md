# Architectural Standard: Writing Module Cloud Persistence, Blurred Hints & Anti-Repetition

## Summary
Achieved complete production readiness for the CELAEST Writing Module:
1. **Interactive Blurred Hints (Pistas Difuminadas)**:
   - Starter phrases under the editor start blurred with `filter blur-[5px] opacity-40 select-none`.
   - Elegant "✨ Toca para ver sugerencias" pill indicates the interaction.
   - User clicks anywhere on the blurred container or the "Pistas" toggle button to reveal suggestions.
   - Clean eye icon indicator toggling between "Toca" (blurred) and "Ocultar" (revealed).
   - Automatically resets to blurred on task change so each new prompt starts as an active writing challenge.

2. **Cloud Database Persistence (Cross-Device PC <-> Mobile Sync)**:
   - Backend table `writing_progress` keyed by `(user_id, cefr_level)`.
   - Stores `task_batch`, `active_task`, `editor_draft`, `task_index`, `role_name`, and `seen_prompts`.
   - Endpoints:
     - `GET /api/v1/writing/progress?cefrLevel=A1`
     - `POST /api/v1/writing/progress`
   - SQL Upsert with `ON CONFLICT (user_id, cefr_level) DO UPDATE SET ...` preserving draft content and merging seen prompts.
   - Frontend `ApiWritingRepository` and `WritingPracticeView`:
     - Server-Wins hydration on mount.
     - Event-driven saves when advancing task, rotating batch, changing CEFR level, or debounced typing (1.2s).
     - `visibilitychange` listener ensures background tab updates sync when user switches devices.

3. **Cumulative Anti-Repetition Protocol**:
   - `seen_prompts` accumulates all prompts/descriptions seen by the user across reloads and devices.
   - In `AiWritingTaskGenerator.generateBatchTasks`, `avoidTasks` passes these descriptions to the LLM prompt mandate.
   - Eliminates hardcoded questions and prevents the same questions from repeating across sessions.

4. **Quality Gate Certification**:
   - Backend: `go test -v -count=1 ./internal/writing/...` -> 100% PASS.
   - Backend binary: `go build -o bin/server.exe cmd/api/main.go` -> PASS.
   - Frontend types: `npx tsc --noEmit` -> PASS (0 errors).
   - Frontend tests: `npx vitest run src/features/writing/` -> 25/25 PASS.
   - Production bundle: `npm run build` -> PASS.
