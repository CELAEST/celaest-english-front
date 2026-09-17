# CELAEST Standard: E2E User Journeys, Vault Migration & Anti-Begin Loop

## 1. Zero-Begin-Loop & Onboarding Continuity
- **Rule**: Creating an account or registering MUST NEVER send the user to the "Welcome" / "Begin" screen.
- **Pre-Test Retention**: If a guest user performs diagnostic steps before registering, `OnboardingView` must preserve the in-memory state (`learnerProfile.cefrLevel`, `placementQuiz`, `answers`), persist it to PostgreSQL with `onboardingCompleted: true`, and immediately grant access to `/workspace`.
- **Direct Advance**: For brand new registrations without prior test, the flow advances directly to `api-key` or `beginner-check`, completely skipping the introductory "Begin" video screen.
- **Returning User Fast-Track**: When logging in (`mode === "login"`), the user is immediately routed to the Workspace without re-taking any placement test.

## 2. Dynamic Vault Migration (Session to User)
- **Problem Solved**: Keys saved during unauthenticated guest sessions were stored under `celaest:session:provider-key:*`. Upon login/registration, the vault looked at `celaest:user:${userId}:provider-key:*`, causing keys to disappear.
- **Protocol**: `providerKeyVault.migrateSessionToUser(userId)` must run automatically whenever authentication succeeds (`onSuccess` in auth steps, or lazily in `getKeys`/`getConfig`/`getActiveProviderId`).
- **Data Transferred**:
  1. API keys for all providers (`celaest:session:provider-key:*` -> `celaest:user:${userId}:provider-key:*`)
  2. Provider configurations (`celaest:session:provider-config:*` -> `celaest:user:${userId}:provider-config:*`)
  3. Active selected provider (`celaest:session:active-provider` -> `celaest:user:${userId}:active-provider`)
  4. Session entries are purged after migration to prevent cross-account leaks.

## 3. Production Groq Catalog & Resilient Probing
- **Models**: Always use official Groq models: `llama-3.3-70b-versatile` (flagship recommended), `llama-3.1-8b-instant`, `mixtral-8x7b-32768`, `deepseek-r1-distill-llama-70b`.
- **Probe Fallback**: In `probeProviderConnection`, if a completion attempt receives 400/404 indicating model not found, it automatically falls back to `GET ${base}/models` with the user's API key. This guarantees that valid keys are never falsely rejected due to model name changes or catalog mismatches.
