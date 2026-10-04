# Cross-Device Persistence & Architectural Contracts (CEFR Level & Interview Session)

## Root Causes Identified and Fixed:
1. **CEFR Desync between Mobile & Desktop:**
   - In `useCurrentUser.ts`, `cachedLevel` in localStorage had higher precedence than `normBackend`. When opening on mobile with an empty cache, it showed B1, while PC had B2. Even when user changed level on one device, the other device kept its stale local cache.
   - Fixed by making PostgreSQL `users.cefr_level` the single source of truth (`normBackend || cachedLevel || 'B1'`).
   - Unified all level access behind `levelStore.ts` (`celaest:user:<userId>:cefrLevel`) with `normalizeCefrLevel` returning canonical short codes (A1..C2).
   - In `useSettingsProfile.ts`, lowered `staleTime` to 30s, enabled `refetchOnMount: 'always'` and `refetchOnWindowFocus: true` so returning to tab / mobile immediately updates the level.

2. **Interview Questions Divergence across Devices:**
   - When user switched to a level or logged in on another device, both devices generated separate questions because `SaveProgress` in backend overwrote questions without concurrency checks.
   - Added First-Writer-Wins SQL atomic preservation in `celaest-english-back` (`CASE WHEN $8 = TRUE OR interview_progress.session_questions IS NULL ...`).
   - `saveProgress` in backend returns the canonical `*InterviewProgress` DTO, which the frontend immediately adopts upon saving or syncing.
   - Added `visibilitychange` & window focus listeners to re-sync interview progress from backend immediately when user switches tabs or unlocks mobile.

3. **Logout CORS Preflight / 25s Timeout:**
   - In `celaest-back`, `auth/middleware.go` attempted remote `fetchJWKS` calls over the network on `/auth/logout`, causing timeout/hang and missing CORS headers.
   - Fast-pathed `isLogoutRoute` to extract unverified claims (best-effort) without network blocking. Added Vite `5173` to devDefaults.
   - Wrapped frontend logout fetch with `AbortController` (3.5s timeout) in `SupabaseAuthAdapter.ts`.
