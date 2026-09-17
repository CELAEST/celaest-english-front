# JWT Expiration, Auto-Purge & Onboarding Login Redirection Standard

1. Root Cause of "Stuck in Begin on Expired JWT":
- Previously, `SupabaseAuthAdapter.isAuthenticated()` only checked `Boolean(localStorage.getItem("lingua_access_token"))`. If an expired token was in storage, it returned `true`.
- `useOnboardingFlow` initialized at `step: "welcome"` ("Begin" screen) instead of `"auth"`.
- Requests to backend failed with 401 `{"success":false,"error":"Invalid or expired JWT token"}`.
- Neither `HttpClient` purged the token, nor did `useOnboardingFlow` or the top router listen to `celaest:unauthorized` while outside `WorkspaceWrapper`.
- As a result, the user was trapped on the "Begin" screen with dead credentials.

2. Permanent Resolution:
- `isJwtExpired(token)` in `SupabaseAuthAdapter.ts`: decodes JWT payload `exp`. If `Date.now() >= exp * 1000 - 5000`, the token is recognized as expired, `getStoredToken()` immediately calls `clearDeadToken()` and returns `null`. `isAuthenticated()` returns `false`.
- `HttpClient.ts`: On HTTP 401 or any response with `{ success: false, error: "Invalid or expired JWT token" }`, immediately purges `lingua_access_token`, `lingua_refresh_token`, `lingua_auth_user`, and `lingua_onboarding_completed`, clears `HttpClient.token`, and dispatches `celaest:unauthorized` and `celaest:auth-changed`.
- `useOnboardingFlow.ts`: Listens to `celaest:unauthorized` and `celaest:auth-changed`. If the session is invalid or revoked, it immediately forces `setStep("auth")` (the login form).
- `AppRoutes.tsx`: Top-level listener on `celaest:unauthorized` ensures any 401 navigates to `/onboarding` (displaying the login form) regardless of current route.