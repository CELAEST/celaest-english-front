# Mobile Bottom Sheet & Strict Bilingual Scaffolding Isolation (2026-10-04)

### 1. Mobile CEFR Level Selector Bottom Sheet:
- **Design & Layout**:
  - Replaced the floating card at `bottom-20` with a true native-grade mobile Bottom Sheet pinned all the way down: `fixed inset-x-0 bottom-0 z-[100] w-full max-w-lg mx-auto`.
  - Applied `rounded-t-[28px] rounded-b-none`, `bg-[#09090E]/95`, `border-t border-white/15`, `backdrop-blur-3xl`, and deep elevation `shadow-[0_-16px_48px_rgba(0,0,0,0.95)]`.
  - Added safe area bottom padding `pb-[max(2rem,env(safe-area-inset-bottom,2rem))]` ensuring `C2 — Maestría` has generous clearance above the bottom edge / home indicator.
  - Added native drag indicator bar (`w-10 h-1.5 rounded-full bg-white/25 mx-auto mt-0.5 mb-2.5`).
  - Overlay renders at `z-[100]` over the mobile navigation dock (`z-50`), providing a distraction-free, fluid native drawer experience.
  - Desktop floating popover remains 100% unchanged.

### 2. Strict Bilingual Scaffolding Isolation (Anti-Spanish in B1/B2/C1/C2):
- **Pedagogical Mandate**:
  - Spanish translation/scaffolding is **strictly reserved for A1 and A2** beginners.
  - In B1, B2, C1, and C2, learners must practice with authentic English immersion (zero Spanish).
- **Implementation**:
  - In `WritingTaskHeader.tsx`:
    ```ts
    const isA1orA2 = currentLevel ? /^A[12]$/i.test(currentLevel.trim()) : false;
    const resolvedSpanish = isA1orA2 ? (spanishDescription || getFallbackSpanishPrompt(questionPrompt)) : null;
    ```
    Even if task metadata or cache contains `spanishDescription`, intermediate and advanced levels evaluate to `resolvedSpanish = null`, preventing any Spanish text from rendering.
  - In `aiWritingTaskGenerator.ts`:
    - Updated prompt instructions: `For CEFR A1 and A2, provide 'spanishDescription' as a helpful Spanish translation. For B1, B2, C1, and C2, 'spanishDescription' must be null or omitted.`
    - Task parser guards: `spanishDescription: (level === "A1" || level === "A2") && item.spanishDescription ? String(item.spanishDescription).trim() : undefined`.
  - New test suite in `WritingTaskHeader.test.tsx` certifying that B1, B2, C1, and C2 never render Spanish translation.
