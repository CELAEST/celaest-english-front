# Memory Flashcard Dynamic Typography, Overflow Containment & Cross-Module CEFR Level Synchronization Standard

## Context & Objectives
1. **Vertical Overflow Elimination**: On the back of Speaking and Writing flashcards, long grammar explanations (e.g., >200-350 chars) or translations combined with syntax diff previously pushed the SM-2 review rating bar (`AGAIN`, `HARD`, `GOOD`, `EASY`) completely off-screen or caused bottom clipping on small viewport heights.
2. **Dynamic Sentence Typography Scaling**: Front-of-card sentences (`YOU SAID` / `BETTER WAY`) adapt dynamically based on character count:
   - <= 35 chars: Large (`text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-normal leading-snug`) to avoid sparse visual emptiness.
   - 36-65 chars: Medium (`text-lg xs:text-xl sm:xl lg:text-2xl font-normal leading-snug`).
   - 66-110 chars: Standard (`text-[15px] xs:text-base sm:text-lg lg:text-xl font-normal leading-normal`).
   - > 110 chars: Compact (`text-[13.5px] xs:text-[14px] sm:text-base lg:text-lg font-normal leading-normal`).
3. **Card Body Architecture**:
   - `MemoryFlashcard.tsx` anchors the SM-2 rating bar firmly at the bottom with `shrink-0 z-20 mt-auto`.
   - Card body contents are enclosed in `flex-1 min-h-0 flex flex-col justify-center overflow-y-auto overscroll-contain py-1 scrollbar-none`.
   - Card height adapts dynamically: `h-[415px] xs:h-[435px] sm:h-[460px] lg:h-[490px] max-h-[calc(100dvh-180px)] min-h-[380px]`.
4. **CEFR Level Cross-Module Synchronization**:
   - When users update their CEFR level in Settings (`SettingsView.tsx`), it immediately broadcasts to `localStorage` keys (`celaest:cefrLevel`, `celaest:writing:cefrLevel`, `celaest:interview:cefrLevel`), invokes `onSelectLevel`, and dispatches the window event `celaest:level-changed`.
   - `WorkspaceDashboardView.tsx`, `useInterviewSession.ts`, and `WritingPracticeView.tsx` listen to `celaest:level-changed`, keeping Speaking, Writing, and Settings fully unified in real time with zero desynchronization.
5. **Frictionless Omni-Surface Carousel Gesture Standard**:
   - `dragDirectionLock` must NEVER be set on horizontal card carousels (`drag="x"`): Framer Motion would interpret natural diagonal finger sweeps as vertical scrolls and lock out horizontal dragging.
   - Front face of cards must NOT use `overflow-y-auto`: nested scroll containers capture pointer events and block horizontal drag initialization across the entire central card surface. Front faces use `touch-pan-y select-none`.
   - Back face containers combine `overflow-y-auto` with `touch-pan-y select-none` and pointer-events-none hairline accents.
   - The entire `MemoryCardCarousel` container attaches unified touch event listeners (`onTouchStart`, `onTouchMove`, `onTouchEnd`) debounced with a 320ms guard (`lastSwipeTimeRef`) to ensure effortless swiping from any point on screen (margins, header, card interior) with zero gesture deadzones and zero double-firing.
   - Tuned kinetic parameters: `swipeThreshold = 25`, `velocityThreshold = 120`, `dragElastic = 0.25`.
