# Pathway Error Resolution & Liam Conversational Onboarding Standard

## 1. Resolved Console Errors
1. **Procedural Node Evaluation 404 (`guide-a1-node-X/evaluate`)**:
   - In `celaest-english-back/internal/pathway/service.go`, `EvaluateNodeStage` and `HydrateNodeContent` now intercept procedural node IDs starting with `guide-`.
   - The backend parses the target level and order index, ensures the pathway exists in PostgreSQL, and resolves or auto-seeds the node.
   - Saves attempts, calculates mastery, and unlocks subsequent bases cleanly with status 200 OK.
2. **Audio Transcription 500 Cascade & CORS / Connection Refused Elimination**:
   - In `celaest-english-back/internal/interview/service.go`, filters out `"mock_key"` and returns `fiber.StatusServiceUnavailable` (503) instead of a 500 panic when no STT providers are configured locally.
   - In `src/features/conversation/services/audioCaptureService.ts`, when running on `localhost` / `127.0.0.1`, removed the automatic probing of public Render endpoints (`celaest-english-back.onrender.com` CORS block) and dead port 8085.
   - Fails fast cleanly to native browser `webkitSpeechRecognition` with zero console network errors.
3. **`Blocked aria-hidden` on Focused Button Resolution**:
   - In `WorkspaceDashboardView.tsx`, added blur on navigation (`document.activeElement.blur()`) and spread `{...(activeTab !== tabId ? { inert: "" } : {})}` on inactive tab containers.
   - Completely clears the Chrome W3C warning while preserving focus isolation.
4. **`[Mesh Bounds]` Log Cleanup**:
   - Removed debug console log in `professorRigController.ts`.

## 2. Liam Conversational First-Visit vs Returning Guide Standard
- **First Visit Detection**:
  - `PathwayLectureEngine.isSoftwareIntroSeen()` / `isFirstModuleVisit()` tracks module first visits.
  - On the learner's first time entering, Liam speaks the warm companion welcome and interface orientation (`seg_01.mp3` from pre-baked audio).
  - On subsequent visits / subsequent bases, Liam bypasses repetitive software orientation and delivers connected, conversational introductions that bridge from the previous base into the current one like an encouraging friend.
- **Voice Purity Contract**:
  - 100% Liam identity (`TX3LPaxmHKxFdv7VOQHJ` / Edge male `es-MX-JorgeNeural`). Zero female voices or synthetic OS fallback.
