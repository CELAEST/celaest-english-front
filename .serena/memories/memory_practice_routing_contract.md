# CELAEST Memory Practice Routing & Workspace Callouts Standard

## Routing Contract
1. **Memory Empty State Practice Action**:
   - In `MemoryView`, clicking **"Start Practice Session"** (`MemoryEmptyState`) no longer redirects to Workspace.
   - It routes contextually based on `currentCategory`:
     - `SPEAKING` $\rightarrow$ `onNavigate("interview")` (Oral Simulation / Interview Practice)
     - `READING` $\rightarrow$ `onNavigate("reading")` (Executive Reading Studio)
     - `WRITING` $\rightarrow$ `onNavigate("writing")` (Writing Studio)
2. **Workspace Callout Category Hinting**:
   - `WorkspaceOrbCallouts` passes an `onSelectNode("memory", topCardCategory)` hint when the user clicks Card 1 (Vocabulary Deck).
   - `WorkspaceDashboardView` sets `memoryInitialCategory`, ensuring `MemoryView` opens directly to the category tab matching the card shown on the workspace callout.
3. **Verification**:
   - Validated via `MemoryPracticeRouting.test.tsx` (100% pass).
   - `npx tsc --noEmit` clean with 0 errors.
