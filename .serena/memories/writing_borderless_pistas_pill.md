# Writing Pistas & Level Selector Borderless Styling

## Requirement
Remove the purple border and outer glow shadow from the "Pistas | Level" pill in Writing to make it look clean and match the rest of CELAEST's borderless design system.

## Changes Made
In `src/features/writing/components/WritingPracticeView.tsx`:
- Replaced:
  `bg-gradient-to-r from-[#8B5CF6]/15 via-white/[0.04] to-white/[0.02] border border-[#8B5CF6]/35 shadow-[0_2px_12px_rgba(139,92,246,0.12)]`
- With:
  `bg-white/[0.04] hover:bg-white/[0.06] transition-colors`
- Zero borders, zero harsh glow. Perfectly harmonized with adjacent borderless starter phrase chips (`bg-white/[0.04] hover:bg-white/[0.08]`).
