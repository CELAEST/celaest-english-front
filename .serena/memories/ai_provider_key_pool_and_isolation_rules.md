# AI Provider Key Pool & Multi-Account Isolation Standards

1. Multi-Account Isolation:
- Storage keys in `providerKeyVault` are dynamically scoped by the current user's ID:
  - Authenticated: `celaest:user:${userId}:provider-key:${providerId}`
  - Unauthenticated/Onboarding: `celaest:session:provider-key:${providerId}`
- On logout (`StorageLifecycleService.clearAuthStorage()`), all `celaest:session:*` keys and legacy keys are purged. Account A's keys can never bleed into Account B or onboarding.

2. Minimalist UI Standards for Providers:
- No neon borders (`#8B5CF6`), box glows, or saturated gradient badges.
- Provider cards use uniform glassmorphic styling (`border-white/[0.07] bg-white/[0.012]`).
- Groq recommendation is an understated tag: `<span className="px-2 py-0.5 rounded text-[10px] text-zinc-300 bg-white/[0.05] border border-white/10">Recomendado · Gratis</span>`.
- Key lists use flat tables (`divide-y divide-white/[0.04] bg-black/30`), completely eliminating "cards within cards".
- Console link is a clean text link `Obtener clave en consola ↗` in the section header, eliminating giant purple boxes.

3. Key Pre-Validation & Per-Key Live Testing:
- Adding a key via "+ Agregar al pool" tests the key live with `probeProviderConnection` before saving. If invalid, the key is rejected and not added, showing a user-friendly inline error.
- Each key in the pool has its own status badge (`Activa · 55 ms` or `Inactiva`) and individual `Probar` button so users know exactly which key is verified.

4. Onboarding Normalization Resiliency:
- `ProfessionNormalizerService` never re-throws errors or blocks the onboarding step when an AI call fails, times out, or returns empty; it falls back immediately to heuristic normalization without amber error banners.