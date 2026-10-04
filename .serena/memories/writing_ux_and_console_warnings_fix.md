### Writing Module UX & Stability Polish (2026-10-04)

1. **Eliminated Browser Console Warnings**:
   - `rel="preload" as="video"` is invalid per HTML specs and triggered `<link rel=preload> uses an unsupported as value`. Migrated to `<link rel="prefetch" href="/assets/orve.webm" />` in `index.html`.
   - `Cannot update a component ('WorkspaceDashboardViewComponent') while rendering a different component ('WorkspaceWrapper')`: Caused by calling `setUserCefrLevel(user.id, effectiveLevel)` inside `useCurrentUser.ts:useMemo`, which dispatched `celaest:level-changed` during render phase. Fixed by decoupling into a safe post-render `useEffect`.

2. **Luxury Frosted Glassmorphism Pistas Redesign**:
   - Cleaned the "Pistas" badge: removed tacky internal "Toca" text badge. The badge is an elegant, minimal capsule `[ (eye) Pistas | B2 v ]`.
   - Removed the floating badge `✨ Toca para ver sugerencias`.
   - Applied chip-level luxury frosted glassmorphic redaction to each starter phrase:
     - Hidden state: Frosted glass capsule with subtle gradient (`bg-gradient-to-r from-white/30 via-[#C4B5FD]/45 to-white/20 backdrop-blur-md border border-white/20`) and varied natural width (`w-16`, `w-20`, `w-24`). Words are 100% masked/tapadas with zero readable text leaking through.
     - Reveal interaction: Clicking the Pistas button or tapping ANY veiled chip smoothly reveals all starter phrases.
     - Revealed state: Renders `"{phrase}"` and clicking inserts the phrase into the editor. Clicking the Pistas eye button toggles concealment back if desired.

3. **Quality Gate Certified**:
   - `WritingPracticeView.test.tsx`: 14/14 tests passing.
   - `npx tsc --noEmit`: 0 errors.
   - `npm run build`: Production bundle built cleanly in 30.16s.