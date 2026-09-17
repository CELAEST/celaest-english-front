# AI Provider Real-World Behavior & Empirical Diagnostic Guide (CELAEST)

## 1. Ground Truth Empirical Results for Tested Keys

### 1. Groq (Free Tier)
- **Status**: 100% ALIVE & WORKING.
- **Latency**: ~400-600ms.
- **Model Note**: `llama-3.3-70b-versatile` is not in this free tier. `openai/gpt-oss-20b` and `120b` fail when `response_format: { type: "json_object" }` is requested (HTTP 400 `json_validate_failed`).
- **Optimal Working Model**: `qwen/qwen3.8-27b` returns structured JSON flawlessly in ~400-600ms.
- **Configured Defaults**: Primary candidate in `directClientAiService.ts`, `providerConnectivity.ts`, and `useApiKeySetup.ts`.

### 2. Google Gemini (Google AI Studio)
- **Status**: ALIVE with `gemini-3.6-flash`.
- **Model Note**: `gemini-1.5-flash` is not found on `v1beta`. `gemini-2.5-flash` is decommissioned for new users (HTTP 404). `gemini-flash-latest` experiences global demand capacity spikes (HTTP 503 UNAVAILABLE).
- **Optimal Working Model**: `gemini-3.6-flash` returns valid structured evaluations in ~3-4s.

### 3. OpenAI (GPT-4o-mini)
- **Status**: Valid Key, Exhausted Balance ($0.00 credits).
- **Exact Live Error**: HTTP 429 `credit_balance_exhausted` / `insufficient_quota`:
  `"You have no credits remaining. Add credits to continue using the API at https://platform.openai.com/settings/organization/billing/."`
- **Handled As**: `AI_KEYS_EXHAUSTED` with 1-click button to switch to Groq gratis.

### 4. xAI Grok
- **Status**: Valid Key, Exhausted Credits / Spending Limit.
- **Exact Live Error**: `code: "permission-denied"`, `"Your team ... has either used all available credits or reached its monthly spending limit."`
- **Handled As**: `AI_KEYS_EXHAUSTED` with 1-click button to switch to Groq gratis.

### 5. DeepSeek
- **Status**: Valid Key, Exhausted Prepaid Balance ($0.00).
- **Exact Live Error**: HTTP 402 `Insufficient Balance`.
- **Handled As**: `AI_KEYS_EXHAUSTED` with 1-click button to switch to Groq gratis.

## 2. Universal "Anti-Bobos" UX Rule
Never show HTTP codes (402, 429, 503), jargon ("BYOK", "Inferencia", "Clúster", "Tokens"), or technical dumps to learners.
Every alert must state:
1. Provider Name.
2. Plain-language reason: "Tu cuenta de X no tiene saldo disponible ($0.00)" or "Los servidores de X están saturados por alta demanda mundial".
3. 1-Click Action: "Cambiar a Groq (100% Gratis)".
