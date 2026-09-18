# Writing Practice Mobile Adaptation Standard (CELAEST)

## Architectural Principles & Mobile Ergonomics
1. **Viewport Lock & Zero Global Scroll**:
   - `WritingPracticeView` root strictly uses `h-[100dvh] max-h-[100dvh] overflow-hidden` instead of `min-h-screen`, preventing mobile browser dynamic URL/toolbar bars from inducing rubber-banding or page scrollbars.
2. **Strict Desktop Invariance (Zero Regression)**:
   - On desktop screens (`lg:`, `xl:`, `2xl:`), the 4 right sidebar cards (`WritingAIMentorCard`, `WritingProgressCard`, `WritingFocusCard`, `WritingToolsCard`) remain `hidden xl:flex` with identical padding and spacing.
   - Header title, description, and Cosmic Video Orb retain their full desktop proportions (`md:w-28 md:h-28`, `lg:text-[28px]`).
   - No extraneous absolute buttons overlap the header in desktop.
3. **Harmonic Cosmic Orb Progression**:
   - Set to `w-14 h-14` (56px) on mobile, `sm:w-20 sm:h-20` (80px) on tablet, and `md:w-28 md:h-28` (112px) on desktop. This prevents the orb from crowding the title or level pill on narrow 360px-390px screens.
4. **Fluid Editor Height & Mobile Toolbar Fitting**:
   - Editor card uses `p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl`.
   - Textarea uses `flex-1 min-h-[140px] sm:min-h-[280px] lg:min-h-[340px]`, dynamically expanding into available vertical height on any phone size.
   - Toolbar adapts labels on mobile without breaking:
     - New task: `<span className="hidden sm:inline">New task</span><span className="sm:hidden">New</span>`
     - Word goal: `<span className="hidden sm:inline"> / {minWords}–{maxWords} words</span><span className="sm:hidden"> /{minWords}w</span>`
     - Compact undo/redo buttons (`p-1 sm:p-1.5`).
5. **Starter Phrases Touch Chips**:
   - Starter phrases under the editor render as horizontal scrolling chips (`overflow-x-auto no-scrollbar`) with `px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] active:scale-95`, making single-tap insertion immediate and comfortable.
6. **Mobile Dock Clearance & Submit Bar Collision Avoidance**:
   - `WritingSubmitBar` applies `pb-20 sm:pb-2`, providing exact clearance above the 68px floating mobile dock (`fixed bottom-3 ... h-14 sm:h-16`).
   - Submit and View Analysis buttons use responsive labels (`"Submit"` / `"Analysis"` on `<sm:`), avoiding multi-line breaks and leaving ample space for the status text (`truncate min-w-0 flex-1`).
