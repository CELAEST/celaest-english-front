# AI Provider Probing & 2-Layer Voice Architecture

## 1. Zero-Amnesia Key Learning: DeepSeek Balance Check & 1-Token Probe
- DeepSeek API (and OpenAI-compatible endpoints) returns `200 OK` on `GET /models` even when account balance is $0.00.
- Solution: `providerConnectivity.ts` probe was upgraded to perform an active 1-token POST to `/chat/completions` (`max_tokens: 1`, `messages: [{ role: "user", content: "ping" }]`).
- If an account has zero credit (`HTTP 402 Insufficient Balance` / `insufficient_quota`), it is captured immediately at API Key configuration time with an actionable Spanish message advising Groq (free) or Gemini Flash.

## 2. 2-Layer Voice & Speaking Architecture
- **Layer 1 (Real-Time Audio Capture & STT)**: Browser-native Web Speech API / local Whisper streaming. Operates in real time without charging remote LLM tokens. Mic failures trigger `MicHardwareRecoveryModal`.
- **Layer 2 (Pedagogical Evaluation & Non-Native Tone Analysis)**: On user submission, LLM evaluates False Cognates, non-native tone, CEFR estimation, and STAR model answers. If any balance, quota, or network failure occurs, `AiInfrastructureRecoveryModal` opens with 1-click fallback to Groq/Gemini.

## 3. Bilingual Profession Dictionary & Onboarding Layout
- `BASELINE_PROFESSIONS` expanded with agricultural and industrial titles (`agricultor` -> `Farmer / Agriculturalist`, `ganadero` -> `Rancher / Livestock Farmer`, etc.) for 0ms, 0-token instant normalization.
- `OnboardingReadyStep.tsx` layout constrained to `max-w-md lg:max-w-lg` with `w-[54%]` background protective gradient, preventing visual overlap between text and background 3D orb.