# Live Choreographed Blackboard ("La Pizarra Viva") — Mobile Master Mould Contract

## 1. 6-Act Interleaved Classroom Flow (Zero Long Monologues)
Every base in `PathwayLectureEngine.buildLectureScript` executes an audio-visual choreographed sequence:
1. **`FORMULA` (`LiveBoardFormulaScene.tsx`)**: Liam names each structural block while `formulaSegments` illuminate sequentially (`0ms` -> `950ms` -> `1900ms`) with sweeping luminous accent bars (`violet` / `emerald` / `sky`) + 1-line mentor subtitle.
2. **`TRAP` (`LiveBoardTrapScene.tsx`)**: 3-phase surgical contrast (`0ms` Spanish-interference sentence -> `800ms` animated crimson strike-through `✗` -> `1300ms` emerald native upgrade `✓` highlighting `correctToken` + mental anchor).
3. **`TRAP_CHECK` (`LiveBoardTrapCheckScene.tsx`, `pauseAfterForCheck: true`)**: **Reto 1 Intercalado ("Caza la Trampa")**. `PathwayLectureEngine.playLecture` pauses cleanly at `onPauseForCheck` and waits for the student's tap on a procedural 2-option duel (`commonMistake.wrong` vs `commonMistake.correct`, deterministically alternated via `nodeOrderIndex % 2`).
   - Wrong tap: reveals surgical `Ojo:` hint + warm Liam spoken coaching.
   - Correct tap: `isTrapCelebrating = true` -> Liam's visor lights up with `celebrating` (`^ ^` happy eyes + pink cyber blush), congratulates the student, marks `✓ Reto` in emerald on `LiveClassBeatBar`, and **automatically resumes the lecture into `EXAMPLES`**.
4. **`EXAMPLES` (`LiveBoardExamplesScene.tsx`)**: **La clase continúa**. Liam pronounces native Example 1 and role-applied Example 2 (`language: "en"`) with live word-by-word cyan karaoke illumination + full phonetic guide `[pronunciationHint]` + connected-speech secret.
5. **`BUILD` (`MobileBoardBuildStep.tsx`, `targetStep: "BUILD"`)**: **Reto 2** — Magnetic word block construction (`I learn English today`).
6. **`SPEAK` (`MobileBoardSpeakStep.tsx`)**: **Reto 3** — Real Whisper V3 Turbo voice certification (`pathwayVoiceEvaluator.ts`) + 2-attempt silent policy + PostgreSQL mastery save.

## 2. Modular Architecture (`<= 79` lines per file)
- Hook: `src/features/pathway/hooks/useLiveClassChoreography.ts`
- Live scenes: `src/features/pathway/components/professor-board/live-scenes/` (`LiveClassBeatBar.tsx`, `LiveBoardFormulaScene.tsx`, `LiveBoardTrapScene.tsx`, `LiveBoardTrapCheckScene.tsx`, `LiveBoardExamplesScene.tsx`, `MobileLiveRuleStage.tsx`).
