# Zero Blue Flash & Smooth Tab Keep-Alive Architecture

## Problem Solved
1. **Native Video Blue Box Flash on Android / iOS WebKit**:
   - Before a video's first frame decodes (`readyState < 2`), Chromium hardware planes show an uninitialized blue/cyan rectangular surface.
   - On touches, default mobile `-webkit-tap-highlight-color` renders a translucent blue box.
   - Calling `v.load()` on `onError` forced full texture teardown, flashing the uninitialized decoder box repeatedly.
2. **Tab Navigation "Bugueo" & Remount Glitches**:
   - `useEffect([defaultTab, activeTab])` caused ping-pong double state changes when switching tabs rapidly.
   - Inactive tabs did not receive `isActive=false`, causing multiple concurrent `<VideoOrb>` instances to exceed hardware decoder capacity and glitch.
   - Background video used `display: none` (`block`/`hidden`), destroying compositor layers.

## Implemented Architecture & Rules
1. **VideoOrb Zero-Blue Guarantee**:
   - Wrapped in a `relative w-full h-full flex items-center justify-center rounded-full overflow-hidden select-none` mask.
   - Renders a tonal dark circular skeleton (`bg-[#080814] animate-pulse`) until `isLoaded` (`onLoadedData`/`onCanPlay`/`readyState >= 2`).
   - Video has `rounded-full transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`.
   - Destructive `v.load()` removed from `onError`; aggressive `pause` event listener removed.
2. **Universal Active Decoupling**:
   - `isActive` is propagated down: `WorkspaceDashboardView` -> `InterviewPracticeView` / `WritingPracticeView` / `ReadingPracticeView` / `MemoryView` -> `VideoOrb`. Inactive tabs immediately pause decoding, freeing mobile GPU hardware decoders.
3. **Keep-Alive Viewport & Background Video**:
   - Background video container toggles `visible` vs `invisible` with `transition-opacity duration-300`, keeping compositor layers alive while `pause()` prevents GPU/CPU drain.
   - One-way `defaultTab` sync prevents ping-pong double mounts.
4. **Universal CSS Tap Reset**:
   - `* { -webkit-tap-highlight-color: transparent; }` and `video { outline: none; border: none; background-color: transparent; }`.
