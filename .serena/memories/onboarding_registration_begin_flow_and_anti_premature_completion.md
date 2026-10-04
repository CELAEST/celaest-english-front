# Registration to Onboarding 'Begin' Flow and Anti-Premature Completion Contract

## 1. Context & Problem Addressed
When registering a new account, users were previously redirected immediately to the main dashboard (`WorkspaceHeroSection`) displaying "ESTEBAN2 / PROFESSIONAL", completely bypassing the Onboarding / Begin assessment (`/begin` or `/onboarding`).

## 2. Root Cause Analysis
1. **Backend `internal/settings/repository.go` (`GetByUserID`)**:
   An auto-heal condition intended for legacy accounts had:
   `if !u.OnboardingCompleted && (u.CEFRLevel != "" || u.Profession != "") { u.OnboardingCompleted = true }`
   Because every user record defaulted `cefr_level` to `"B1"` on initial insertion, `u.CEFRLevel != ""` was true for 100% of newly created users. On any subsequent profile query right after registration, `u.OnboardingCompleted` was mutated to `true` and written to PostgreSQL.
2. **Frontend `OnboardingView.tsx` (`onSuccess`)**:
   `if (profile && (profile.onboardingCompleted || (mode === "login" && isUserCompletedLocal)))`
   Because the backend returned `profile.onboardingCompleted = true`, this check passed even when `mode === "register"`, triggering `onFinish()` which routed to `ROUTES.HOME` (`/`).
3. **Frontend `useOnboardingFlow.ts`**:
   The default step for authenticated users who had not completed onboarding was previously set to `"beginner-check"` instead of `"welcome"` (the "Begin" screen), and `OnboardingView.tsx` had a shortcut skipping the "Begin" screen.

## 3. Surgical Architectural Solution
1. **Backend Isolation (`GetByUserID`)**:
   Auto-heal condition strictly constrained:
   `if !u.OnboardingCompleted && u.Profession != "" && u.Profession != "Professional" { u.OnboardingCompleted = true }`
   Newly registered users have `u.Profession == ""`, ensuring `OnboardingCompleted` remains `false`.
2. **Settings Update Consistency (`UpdateSettings`)**:
   Default `onboardingCompleted := false` on insert, and preserve `users.onboarding_completed` via `COALESCE($10, users.onboarding_completed)` on update unless explicitly set.
3. **Frontend Route & Step Transition (`OnboardingView.tsx` & `useOnboardingFlow.ts`)**:
   - `onSuccess` only evaluates auto-finish when `mode === "login"`.
   - Fresh registrations (`mode === "register"`) cleanly call `goToStep("welcome")`.
   - `useOnboardingFlow` initializes at `"welcome"` for authenticated users who have not finished onboarding.
   - The user lands on `OnboardingWelcomeStep` (video `/assets/begin1`, "Your AI Language Mentor", and button "Begin") and proceeds through the full placement and profession calibration.
