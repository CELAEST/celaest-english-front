# Writing Batch Pre-Generation Architecture (CELAEST English)

## 1. Problem & Token Economics
Previously, clicking "New Task" in `WritingPracticeView` triggered an individual LLM call for a single writing prompt. This caused:
- Significant token consumption due to repeated system prompt overhead (~390 tokens prompt per call x 6 calls = 2340 tokens).
- 2-3 second latency spinners on every "New Task" click.
- Poor scenario diversity control across different categories.

## 2. Solution: Single-Call Batch Pre-Generation
- `AiWritingTaskGenerator.generateBatchTasks`: Issues a single LLM request requesting a batch of 6 diverse career-specific tasks distributed across categories: `EMAIL`, `REPORT`, `PROPOSAL`, `MESSAGE`, `REVIEW`, `LETTER`.
- **Token Savings**: ~83% reduction in prompt input tokens.
- **Latency**: User clicks on "New Task" or "Continuar practicando" rotate instantly in **0 ms** from local batch state.
- **Background Replenishment**: When `taskIndex >= taskBatch.length - 2`, a background replenishment call triggers silently so the user never runs out of fresh AI tasks.
- **Resilient Fallback**: `createProceduralSeedBatch` provides 6 career-aware, anti-hardcode, multi-domain invariant seeds whenever offline or awaiting AI response.
- **Exact CEFR Limits**: Word limits, tone hints, and authentic starter phrases strictly calibrated by CEFR level.

## 3. Verified Standards
- `tsc --noEmit`: 0 errors.
- `audit:hardcode`: 0 violations.
- `vitest`: 26 files passed, 178/178 tests passed.
- `vite build`: Clean production bundle in 13.56s.
