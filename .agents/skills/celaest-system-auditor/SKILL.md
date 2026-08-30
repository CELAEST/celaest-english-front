---
name: celaest-system-auditor
description: >-
  Master diagnostic and auditing skill for CELAEST microservices ecosystem (Auth, IA-Mesh,
  English Learning Engine, and Frontend). Use whenever auditing JWT tokens, cross-service contracts,
  database schema mismatches, hardcoded mocks, or AI feedback pipelines.
---

# CELAEST Multi-Service System Auditor Skill (Claude / Gemini / Antigravity Standard)

This skill provides an exhaustive, automated blueprint for auditing and maintaining the multi-service architecture across the CELAEST platform:
- **`celaest-back`** (Port 3101): Centralized Auth (Supabase GoTrue), UserSync, Subscriptions, Licensing, and Organization Multi-tenancy.
- **`celaest-english-back`** (Port 8080): English Pedagogical Engine, Settings, Reading Lexicon, Flashcards Vault, and Practice Sessions.
- **`celaest-core`** (Port 8085): IA-Mesh Gateway, Whisper Speech Transcription, and LLM Inference Router (Groq, DeepSeek, Gemini, OpenAI).
- **`celaest-english-front`** (Port 5173): Vite React TypeScript SPA with Deep Cosmic Design System.

---

## 1. Authentication & Token Lifecycle Verification

### 1.1 The Cross-Service JWT Protocol
- Tokens are issued **exclusively** by Supabase GoTrue via `celaest-back` (`/api/v1/auth/login` or `/api/v1/auth/register`).
- **Critical Requirement**: All microservices (`celaest-english-back`, `celaest-core`) that accept the `Authorization: Bearer <token>` header **MUST** decode and validate the token against the Supabase JWT public key / JWKS / GoTrue user endpoint, **NOT** against isolated, local static secrets.
- **Audit Checklist**:
  1. Inspect `internal/middleware/auth.go` in each Go microservice.
  2. Verify that JWT validation extracts claims (`sub` as `user_id`, `email`, `role`) consistently.
  3. Ensure that if `APP_ENV=development`, the middleware gracefully handles unverified claims without crashing or failing valid Supabase sessions.

---

## 2. Hardcoded & Mock Data ("Quemado") Detection Protocol

When auditing any feature or endpoint, verify if the service is relying on fallback/mock data:

| Component | Target Location | Red Flags to Audit |
|---|---|---|
| **User Profile / Settings** | `internal/settings/repository.go` | Hardcoded names (`"Esteban"`), static streak days (`12`), or mock email fallbacks when DB is nil or row not found. |
| **AI LLM Inference** | `internal/aimentor/`, `src/features/conversation/` | Static mock strings, `OPENAI_API_KEY=mock_key`, fallback heuristic engines triggering due to offline `coreAiUrl`. |
| **Lexicon & Dictionary** | `internal/reading/` | Seed files vs PostgreSQL query execution. |
| **Secure Vault / Memory** | `internal/memory/` | In-memory arrays vs encrypted PostgreSQL rows. |

---

## 3. Database & Profile Synchronization Protocol

1. **User Provisioning Flow**:
   - `celaest-back` registers user in Supabase Auth.
   - `UserSyncService` in `celaest-back` creates/updates `users_profile` table.
   - `celaest-english-back` receives request with JWT `sub` $\to$ ensures a matching row exists in `celaest_english_db.users` with `cefr_level`, `learning_goal`, and `preference_style`.
2. **State Consistency**:
   - When the user finishes Onboarding or updates settings, `PUT /api/v1/user/settings` updates `celaest-english-back` AND triggers profile persistence.

---

## 4. UI / Design System Integrity Standards

- **Deep Cosmic Theme**: Background `#03030E`, Glowing Violet accents `#7048E8` / `#8B5CF6`.
- **Zero-Box / Anti-Card Standard**: Never wrap content in opaque card containers or borders over borders. Use transparent glass panels, pure typography, and subtle SVG micro-indicators.
- **Universal Input Transparency**: Always enforce `-webkit-background-clip: text !important` and `box-shadow: none !important` to prevent browser autofill dark rectangles.
