# Reading AI Recovery Modal & BYOK Word Translation Standard

## 1. Resilient Three-Tier Translation Architecture
When a word or phrasal verb is clicked in Reading:
1. **Tier 1 (CELAEST Backend Mesh)**: Queries local seed, PostgreSQL cache, and celaest-core micro-LLM.
2. **Tier 2 (Client-Side BYOK Fallback)**: If celaest-core is offline/inactive and backend returns `untranslated` (e.g. `looked forward to`), `useReadingArticles` / `ReadingWordModal` checks if the client has an active provider key (Groq, Gemini, OpenRouter, OpenAI) in `providerKeyVault`. If present, it executes `translateWordDirect` client-side via `directClientAiService` seamlessly.
3. **Tier 3 (AI Infrastructure Recovery Modal)**: If no key is configured and core is down, `ReadingWordModal` renders an interactive high-luxury trigger `[✨ Traducir con IA (Configurar API)]`. Clicking it triggers `onOpenRecoveryModal`, opening `AiInfrastructureRecoveryModal` with context `reading`. When the key is verified and saved, `onImmediateResume` automatically invokes `translateWordDirect`, updates `activeWordData` in real time, and persists it to `currentArticle.vocabularyMap`.

## 2. Test Suite Hygiene
- Never use fixed epoch dates like `123456789` (1973) in persistence tests; always use `Date.now()` to avoid tripping 24h TTL invalidations.
- Re-render assertions in React Testing Library must re-query the active element inside `waitFor(() => ...)` to avoid reading from detached DOM nodes when parent components re-mount.
