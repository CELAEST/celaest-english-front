# Memory Flashcard Dynamic Typography & Overflow Containment Standard

## Context & Problem
In CELAEST English Memory flashcards (Speaking & Writing):
1. **Back-Face Overflow**: Lengthy grammatical explanations (up to 350+ characters) combined with Spanish translation and syntax diffs pushed the SM-2 review rating footer (`AGAIN`, `HARD`, `GOOD`, `EASY`) completely off-screen or cut them off at the bottom edge on mobile screens.
2. **Front-Face Typography Imbalance**: Short sentences (<= 35 characters) rendered at small font sizes (`text-[15px]`), leaving excessive empty void, while long sentences lacked graceful proportional scaling.

## Architectural Resolution
1. **Flashcard Container Architecture**:
   - In [MemoryFlashcard.tsx](file:///c:/Users/user/Music/celaest-english-front/src/features/memory/components/MemoryFlashcard.tsx), polymorphic front/back contents are wrapped in:
     `flex-1 min-h-0 flex flex-col justify-center overflow-y-auto overscroll-contain py-1 scrollbar-none`
   - The SM-2 rating bar footer is permanently anchored at the bottom with:
     `shrink-0 mt-auto z-20`
     Ensuring rating chips and keyboard shortcuts are never pushed off-screen or clipped.
   - Mobile card height tuned to `h-[415px] xs:h-[435px] sm:h-[455px] lg:h-[485px] min-h-[380px]` with padding `p-3.5 xs:p-4.5 sm:p-6 lg:p-7`.
2. **Proportional Typography Scaling (`typographyHelpers.ts`)**:
   - `getDynamicSpeakingSentenceClass(text)`:
     - `<= 35` chars: `text-xl xs:text-2xl sm:text-2xl lg:text-3xl font-normal leading-snug tracking-tight` (short sentences look bold and fill space elegantly).
     - `<= 65` chars: `text-lg xs:text-xl sm:text-xl lg:text-2xl font-normal leading-snug`.
     - `<= 110` chars: `text-base xs:text-[17px] sm:text-lg lg:text-xl font-normal`.
     - `> 110` chars: `text-[13.5px] xs:text-[14.5px] sm:text-base font-normal leading-relaxed`.
   - `getDynamicBackTranslationClass(text, hasLongExplanation)`:
     - When paired with a long grammar explanation (`> 120` chars), scales translation down to `text-sm xs:text-base sm:text-lg` to preserve vertical headroom for the explanation.
   - `getDynamicExplanationClass(text)`:
     - Scales long explanations (`> 180` chars) to `text-[11.5px] xs:text-[12px] sm:text-xs text-white/75 leading-relaxed`.
   - Adaptive vertical spacing (`isLongContent ? "space-y-2 sm:space-y-2.5" : isShortContent ? "space-y-5 sm:space-y-6" : "space-y-3 sm:space-y-4"`).

## Verification & Quality Gate
- 18/18 Vitest tests passed.
- `npx tsc --noEmit` passed with 0 errors.
- `npm run audit:hardcode` passed 100%.
- `npm run build` succeeded cleanly.
