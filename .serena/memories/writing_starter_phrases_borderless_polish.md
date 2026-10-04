### Writing Starter Phrases Borderless Polish (2026-10-04)

- Removed border styling (`border border-white/[0.08] hover:border-[#8B5CF6]/40 shadow-sm`) from starter phrases chips per user preference.
- Kept the smooth text blur difuminado (`filter blur-[7px] select-none opacity-40`) ensuring zero layout shift and a clean, borderless glass background (`bg-white/[0.04] hover:bg-white/[0.08]`).
- All 14/14 tests in WritingPracticeView.test.tsx and `npx tsc --noEmit` pass with 0 errors.