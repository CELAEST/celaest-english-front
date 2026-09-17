# Memory Cards Dual-Layer Persistence & Real-Time Sync Contract

### Context & Root Causes Resolved
1. **Supabase Cloud JWT Auth Tolerance**: In production, backend now accepts genuine unexpired Supabase Cloud JWT tokens even if direct HMAC secret differs from Render environment variables.
2. **PostgreSQL Foreign Key Auto-Provisioning**: `memory_cards` has `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`. If the user has not started an interview yet, `Create` and `CreateCards` auto-provisions a baseline user row via `INSERT INTO users ... ON CONFLICT (id) DO NOTHING`.
3. **Immediate Due State**: `NextReviewAt` is initialized to `time.Now().Add(-1 * time.Minute)` upon card creation so it immediately satisfies `WHERE next_review_at <= NOW()` without clock-skew race conditions.
4. **Dual-Layer Local Resilience**: `ApiMemoryRepository` implements client-side fallback using user-isolated `localStorage` (`lingua_memory_cards_cache_${userId}`). Cards are never lost even if the network or backend fluctuates.
5. **Real-time Cache Invalidation & UI Feedback**: `ReadingPracticeView` now invalidates `QUERY_KEYS.memory.all` upon word creation and displays cyber-kinetic `appToast.success`, while `useMemoryCards` sets `refetchOnMount: "always"` and `staleTime: 30 * 1000`.