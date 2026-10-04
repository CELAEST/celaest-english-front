# Architecture Contract & Fix: Round 2 Infinite Request Loop & Event-Driven Transition

## 1. Context & Problem
When completing Round 1 (`currentQuestionIndex = 4 -> 5`), the interview practice entered an infinite network loop:
- Endless calls to `completions` (Groq), `/interview/progress` (Supabase), and Edge TTS `stream?text=...`.
- UI showed "ROUND 02 01/05" stuck on the placeholder "Generating your next personalized interview question...".

## 2. Root Cause Analysis
1. A runaway reactive `useEffect` watched `remaining = sessionQuestions.length - currentQuestionIndex <= 0`.
2. When Round 1 ended, `currentQuestionIndex` was 5.
3. The replenishment effect generated 5 fresh questions and replaced `sessionQuestions` (so length remained 5, indices 0..4).
4. `onQuestionsGenerated` captured `currentQuestionIndex` from a stale closure with value `5` instead of `0`.
5. Index 5 was persisted to `/interview/progress`.
6. Server-wins cloud sync re-hydrated index 5.
7. `sessionQuestions[5]` was undefined (length was 5), triggering the placeholder and `5 - 5 = 0 <= 0`, re-firing the `useEffect` indefinitely.

## 3. Surgical Solution (Zero Overengineering)
1. **Event-Driven Transition:** Removed the reactive `useEffect([remaining <= 0])`. Round completion is now triggered explicitly when user advances past the last question via `questions.generateNextRound()`.
2. **Linear Pool Append:** When `generateNextRound()` fetches 5 fresh questions, it appends them to `sessionQuestions` (`[...prev, ...fresh]`, length grows 5 -> 10 -> 15).
3. **Accurate Indexing:** `currentQuestionIndex` is set to `nextIdx = prev.length` (5), making `sessionQuestions[5]` immediately available as Question 1 of Round 2.
4. **Single-Shot Exhausted Pool Recovery:** Added a ref-guarded hydration effect (`didReplenishExhaustedRef`) so if an existing database record was saved with index 5, it fetches Round 2 exactly once and halts.
5. **No Redundant Echo Saves:** `saveProgressNow` ignores backend echo if local questions are already loaded.

## 4. Verification
- `npx tsc --noEmit`: 0 errors.
- `vitest run src/features/conversation`: 17/17 test files passed, 154/154 tests passed.
- `npm run audit:hardcode`: 100% clean, zero violations.
- Committed and pushed to `main` as `54035ed`.
