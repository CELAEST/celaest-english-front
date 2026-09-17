# Zero-Token Mount & Reload Protocol (CELAEST English Engine)

## Context & Rule
Under NO circumstances should mounting a view or reloading the page (F5) trigger background calls to external LLM providers (Groq, Gemini, OpenAI, Claude, xAI). 

## Architecture Standard
1. **Initial Mount / Page Refresh**:
   - MUST ALWAYS load instantly using persisted state (`localStorage`) or procedural seed templates (`getCachedOrSeedQuestions`, `getCachedOrSeedBatch`, `/reading/articles` catalog).
   - Zero AI tokens consumed, zero latency, 100% resilient to network/offline conditions.
2. **Explicit User Triggers**:
   - AI generation is strictly bound to deliberate user actions:
     - Reading: User clicking "Siguiente lectura" (`handleNextReading`).
     - Writing: User clicking "Nueva tarea" (`handleNewTask`) or completing an entire batch.
     - Interview: User clicking refresh/regenerate, or dynamic replenishment when answering question 9+ of 12 (`currentQuestionIndex > 0 && remaining <= 3`).
3. **Groq Free Tier OTPM Constraints**:
   - `qwen/qwen3.8-27b` has a 1,000 output tokens per minute (OTPM) limit on Groq free tier. Requesting >1000 tokens immediately throws 429 rate limit errors.
   - Groq requests must cap `max_tokens` to `<= 750` for Qwen, or prioritize `openai/gpt-oss-20b` (which operates with higher limits and ~85ms latency).