# Approved Skeleton Standard: Radix Modern (Neutro Pizarra)

## 1. Approved Architecture
- The user selected and approved the **Radix Modern (Neutro Pizarra)** skeleton standard.
- Key principles:
  - **Zero Hard Borders**: Completely eradicate wireframe outlines (`border-white/[0.08]`).
  - **Dark Slate Palette**:
    - Primary cards/containers: `bg-[#14141d]`
    - Focus elements/pills/labels: `bg-[#1e1e2d]`
    - Secondary/subtle canvases: `bg-[#0e0e15]`
  - **Smooth Pulse**: Subtle `animate-pulse` with no jarring shifts.

## 2. Updated Components
- `InterviewSkeleton.tsx`
- `WritingSkeleton.tsx`
- `ReadingSkeleton.tsx`
- `MemorySkeleton.tsx`
- `SettingsSkeleton.tsx`

All 5 are wrapped in `WorkspaceDashboardView.tsx` Suspense fallbacks.
Tested with TypeScript (0 errors), anti-hardcode audit (passed), and deployed to `origin main`.
