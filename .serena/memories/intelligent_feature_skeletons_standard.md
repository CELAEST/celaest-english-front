# Intelligent Feature-Specific Skeletons Standard (Zero Generic Loaders)

## 1. Architectural Philosophy
- Eradicate generic circular spinners (`TabLoadingFallback`) across feature views.
- Every lazy-loaded feature view (`React.lazy`) must provide an intelligent, bespoke Skeleton matching its exact visual geometry 1:1.
- Prevents layout shifts (CLS), visual jumping, and gives an instant, native app feel during network or chunk download.

## 2. Component Directory & Mappings
1. **Interview (`InterviewSkeleton.tsx`)**:
   - Matches `InterviewPracticeView`: Header HUD pills, central glowing orb silhouette (140px-160px), question prompt card with 2-line placeholder, waveform bar with equalizer lines, pill-shaped mic control, and 3 desktop right-panel metric cards.
2. **Writing (`WritingSkeleton.tsx`)**:
   - Matches `WritingPracticeView`: Task header with CEFR badge, obsidian glass editor with paragraph lines, starter phrases chip row, bottom evaluation bar, and 4 desktop right-panel cards.
3. **Reading (`ReadingSkeleton.tsx`)**:
   - Matches `ReadingPracticeView`: Top header with orb, editorial article header, 4 continuous reading paragraph blocks, bottom page progress bar, and desktop reading sidebar cards.
4. **Memory (`MemorySkeleton.tsx`)**:
   - Matches `MemoryView`: Category filter tabs ("Speaking · Reading · Writing"), central 3D active flashcard with "YOU SAID" and "BETTER WAY" label silhouettes, left & right 3D peeks (desktop), and bottom pagination indicator `< • ━ • >`.
5. **Settings (`SettingsSkeleton.tsx`)**:
   - Matches `SettingsView`: Header with orb, 4 left-column settings cards (Profile, Preferences, Notifications, Privacy), and right-column AI Key Vault and Diagnostics cards.

## 3. Implementation in Orchestrator
- In `WorkspaceDashboardView.tsx`, each tab is wrapped in:
  - `<Suspense fallback={<InterviewSkeleton />}>`
  - `<Suspense fallback={<WritingSkeleton />}>`
  - `<Suspense fallback={<ReadingSkeleton />}>`
  - `<Suspense fallback={<MemorySkeleton />}>`
  - `<Suspense fallback={<SettingsSkeleton />}>`

## 4. Quality Gate Certification
- 47/47 Vitest test suites passing (293/293 tests).
- TypeScript (`tsc --noEmit`): 0 errors.
- Anti-hardcode audit: 100% passed.
- Production build: Cleanly bundled with Vite in 19.7s.
