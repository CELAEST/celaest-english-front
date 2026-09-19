# Groq AI JSON Validation and Token Exhaustion Shield

## Root Cause
When requesting structured JSON with `{ response_format: { type: "json_object" } }`, Groq validates the completion. If the generation hits the token budget (`max_tokens`) before closing the JSON document, Groq returns HTTP 400 Bad Request with:
`code: "json_validate_failed"` and `failed_generation: "max completion tokens reached before generating a valid document"`.
Previously, Groq tokens were artificially clamped to 1000/1500 tokens in `directClientAiService.ts`, and Groq was excluded from token retry (`activeProvider !== "groq"`).

## Architectural Shield Standard
1. **Token Allocation**:
   - Only `qwen` free-tier preview models require OTPM clamping to ~850 tokens.
   - `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, and standard models have 8,000 TPM limit and must receive at least 4,096 tokens (up to 8,192).
2. **Relaxed JSON Mode Auto-Recovery**:
   - If Groq returns `json_validate_failed` or `max completion tokens reached`, `directClientAiService` catches the error and auto-recovers by retrying with `_relaxedJsonMode: true` (omitting `{ response_format: { type: "json_object" } }`) and expanding `maxTokens` to 8,192.
3. **Truncated JSON Self-Healing (`repairTruncatedJson`)**:
   - `repairTruncatedJson` scans open string quotes, trims trailing dangling keys or colons, and balances unclosed brackets `]` and braces `}` in reverse LIFO order.
   - `extractFirstJsonObject` falls back to `repairTruncatedJson`, making all JSON consumers in the app resilient to truncated responses.
4. **Candidate Cascading**:
   - Groq model cascade passes `_relaxedJsonMode: true` and expanded tokens to ensure fallback models (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`) succeed.
5. **Clean Error Mapping**:
   - `parseProviderError` maps `json_validate_failed` to `GATEWAY_TIMEOUT` with user-friendly Spanish copy, never dumping raw technical developer JSON to the user.