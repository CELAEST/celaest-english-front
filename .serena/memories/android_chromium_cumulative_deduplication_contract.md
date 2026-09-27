# Android Chromium Cumulative Result Deduplication & Mobile Live Transcript Contract

## The ~7-Fold Duplication Root Cause
In Chrome for Android and mobile WebKit:
- When Web Speech API fires `onresult`, `event.results` does NOT return isolated phrase chunks as desktop Chrome does.
- Instead, Chromium on Android populates `event.results` cumulatively:
  - `results[0]` = "Hello"
  - `results[1]` = "Hello how"
  - `results[2]` = "Hello how are"
  - ... up to ~7 items containing the entire cumulative sentence from the start.
- When `onresult` looped through `for (let i = 0; i < event.results.length; ++i)` and performed string concatenation (`sessionFinal += " " + text`), it was concatenating all 7 cumulative items together, causing the entire sentence to repeat ~7 times in the textarea!
- Furthermore, `continuous: true` on mobile Android aggravated this by preventing the engine from finalizing clean utterances.

## The Solution
1. **Deduplicated Result Accumulation in `onresult` (`audioCaptureService.ts`)**:
   - Replaced raw string concatenation `sessionFinal += " " + text` with `sessionFinal = sessionFinal ? mergePhrasesCleanly(sessionFinal, text) : text`.
   - Replaced `${withFinal} ${interimTrim}` with `mergePhrasesCleanly(withFinal, interimTrim)`.
   - Now, even if Chromium Android emits 7 or 20 cumulative items in a single event, `mergePhrasesCleanly` recognizes that each subsequent item is an extension or prefix match, reducing the entire array to the single, clean sentence without a single duplicate word.
2. **Mobile Utterance Mode (`continuous: !isMobile`)**:
   - On mobile, `recognizer.continuous = false` ensures Google Speech Services processes clean individual utterances and prevents internal Chromium array accumulation.
   - On utterance end, `onend` auto-restarts within 80ms, merging newly spoken words with prior history via `mergePhrasesCleanly`.
3. **Punctuation-Agnostic Prefix Matching (`mergePhrasesCleanly`)**:
   - Normalizes whitespace and strips punctuation during `startsWith` and `includes` checks so that differences in trailing periods/commas do not cause phrase repeats.
4. **Verified via Tests & Production Build**:
   - Added unit test simulating Android Chrome's 7-item cumulative array; verified output is cleanly merged with 0 duplicates.
   - 15/15 vitest tests pass.
   - 0 TypeScript errors (`tsc --noEmit`).
   - `npm run build` completed cleanly.
