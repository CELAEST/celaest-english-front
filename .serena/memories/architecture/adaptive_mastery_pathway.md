# Foundational Guide & Personalized Pathway Architecture (`/pathway`)

## Core Product Philosophy ("Menos es Más, Muy Volado")
- Teaches English foundations step-by-step from absolute zero (`A1`..`C2`, 6 sequential bases per level) so learners understand **how English works** and get directed smoothly into `Reading`, `Writing`, `Memory`, and `Interview`.
- Zero bureaucratic forms or stacked textareas: **1 single clear idea on screen at a time** on `#000001` obsidian void canvas, matching the exact layout DNA of `Reading` and `Writing`.

## 3 Micro-Moments (`PathwayStepId = "RULE" | "BUILD" | "SPEAK"`)
1. `RULE` (`PathwayVisualRuleStep.tsx`): Visual LEGO formula segments (`violet` / `emerald` / `sky`), `#de5252` vs `#4ade80` mistake-to-mastery contrast, and clickable neural-audio (`en-US-AriaNeural`) examples with easy Spanish-style pronunciation hints (`Suena: "..."`).
2. `BUILD` (`PathwayBlockBuilderStep.tsx`): Interactive magnetic word-block chips (`targetTokens` + `distractorTokens`) with instant `#4ade80` emerald validation and automatic neural voice playback on match.
3. `SPEAK` (`PathwayVoiceUnlockStep.tsx`): 1-tap microphone practice (`AudioCaptureService`) + accessible 1-tap `Completar paso sin micrófono` option -> marks node `MASTERED`, unlocks next foundation, emits `celaest:pathway-updated`, and offers a 1-click **Bridge CTA** (`onNavigateModule`) to test the rule in `Reading`, `Writing`, `Memory`, or `Interview`.

## Strict Anti-Monolith & Zero-Deadlock Engineering Contracts
- All 12 component files in `src/features/pathway/components/` are strictly `<80` lines (`30–78` lines).
- **React.StrictMode Zero-Skeleton Guarantee**: `useLearningPathway` initializes synchronously in `0ms` via `apiPathwayRepository.getOrSeedInitialPathway(...)` and sets `syncedContextRef.current` ONLY inside `!cancelled` resolution blocks so `<React.StrictMode>` double-mounts never freeze on skeleton.
- Dual persistence: `localStorage` (`celaest:pathway:guide:v2:<uid>:<level>`) + Go PostgreSQL (`/api/v1/pathway/*` in `celaest-english-back/internal/pathway/`).
