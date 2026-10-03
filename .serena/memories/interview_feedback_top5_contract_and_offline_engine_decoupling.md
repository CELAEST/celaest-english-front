# Architectural Standard: Interview Feedback Top-5 Sovereign AI & Offline Engine Decoupling

## Summary
Decoupled the interview evaluation pipeline in `celaest-english-front` and `celaest-english-back` following the root cause resolution plan. Eliminated AI card pollution and overengineering.

## Core Rules & Architecture
1. **Prompt Contract (Rule 1B - Top 5 Prioritized Errors)**:
   - Evaluator prompt instructs the model to detect all errors but return AT MOST the 5 most critical errors in `unclearOrErrorWords`.
   - Priority is determined strictly by communicative gravity (how much it blocks clarity) and foundational grammar for the CEFR level.
   - For each error, `correctWord` MUST be the full standard English correction (e.g. `must to fixing` -> `must fix`).
2. **JSON Schema Ordering**:
   - `unclearOrErrorWords` is positioned immediately after scores (`overallScore`, `grammarScore`, `clarityScore`, `vocabularyScore`, `estimatedCefrLevel`).
   - Prevents length/token truncation from chopping error cards. Total payload is compact (~350 tokens).
3. **Decoupled Local Engine (Offline-Only Fallback)**:
   - When the AI returns valid errors, `MasterAiFeedbackEngine` is NEVER merged or used to overwrite/re-sort cards with `relevanceScore`.
   - `MasterAiFeedbackEngine` and `UniversalLinguisticParser` only act as emergency offline fallback when network/AI fails completely.
   - Overfitted regex patches (3d-3g) removed; modal-to rules in both engines corrected to produce base verb without suffixes or comments.
4. **Model Selection**:
   - Recommended and default on Groq: `openai/gpt-oss-120b` (or `openai/gpt-oss-20b`). Combined with compact top-5 JSON prompt contract, it yields fast (<400ms), zero-truncation, high-quality, and cost-effective interview evaluation.
5. **Groq JSON Grammar Constraint & Quote Escaping**:
   - Groq's constrained grammar engine (`response_format: { type: "json_object" }`) aborts with HTTP 400 `json_validate_failed` when models (especially `qwen/qwen3.8-27b`) output unescaped double quotes inside Spanish text or STAR labels.
   - Fix applied: In `directClientAiService.ts`, when `activeProvider === "groq"` and using Qwen, constrained decoding is skipped in favor of strict prompt schema and client JSON parsing.
   - In prompts (both front and backend `service.go`), Rule 1B enforces a strict 5-card maximum and Rule 5 strictly forbids unescaped double quotes, mandating single quotes (`'`) for all quotes, dialogue, and examples.
   - Enhanced fallback regex repairs any unescaped interior quotes in `failed_generation`.
