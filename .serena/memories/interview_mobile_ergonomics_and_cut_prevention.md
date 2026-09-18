# Interview Mobile Ergonomics & Premium Presentation Standard

### Key Fixes & Design Contracts:
1. **Top Bar HUD (`ResponsiveInterviewHUD.tsx`)**:
   - `ROUND 01` hidden on mobile (`hidden sm:inline`), showing `01/05 · Level` cleanly without redundancy or wrapping.
   - Repeat `↺` hidden on mobile (`hidden sm:inline-flex`) as it is already present in the question area.
   - Text "Feedback" is explicitly visible on mobile (`text-xs font-bold ... Feedback`) with the gold sparkle `✦` icon.
   - Cards drawer trigger button `📖` is hidden on mobile (`hidden sm:inline-flex`) to conserve horizontal space.
   - Leaves ample negative space on mobile viewports (~170px of free width).

2. **Hero Video Orb (`ConversationOrbHero.tsx`)**:
   - Sized to `w-[clamp(160px,26vh,240px)] sm:w-[clamp(140px,28vh,340px)] h-[clamp(160px,26vh,240px)] sm:h-[clamp(140px,28vh,340px)]` on mobile so all video details and textures are bold, prominent, and detailed.
   - Desktop size remains `sm:w-[clamp(140px,28vh,340px)] sm:h-[clamp(140px,28vh,340px)]` (100% unaltered).

3. **Compact Delicate Waveform on Mobile (`ConversationWaveformSpectrum.tsx`)**:
   - Container size on mobile: `max-w-[240px] h-4` (height is only 16px, delicate and uncrowded).
   - Bar height max capped to `max-h-[14px]` on mobile (`sm:max-h-none` on desktop).
   - Width of bars: `w-[1.5px] sm:w-[2px]`.
   - Result: Elegantly bridges the transcript and mic control without crowding ("apeluñuscar") the buttons below it.

4. **Arena Vertical Clearance (`ConversationPromptArea.tsx` & `InterviewPracticeView.tsx`)**:
   - Textarea height on mobile is `h-[clamp(72px,12vh,125px)]` with internal scroll.
   - Mic control helper text uses concise single-line strings on mobile (`whitespace-nowrap truncate max-w-[92vw]`).
   - Bottom padding `pb-16 sm:pb-20 lg:pb-1` provides exact clearance above the floating mobile dock (`WorkspaceSidebar`).
