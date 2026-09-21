# CELAEST Standards: Interview Video Orb & Zero-Jump Mount Performance

## Context & User Mandate
- Eradicate the dark, pulsating circular skeleton orb ("esa bola tan horrible") that was rendered behind/in front of the video in Interview.
- Eradicate layout jumps ("saltos tan horribles") and fade-in flickers when opening or switching to the Interview view.
- Enable the HTML5 `<video>` element to render its decoded first frame immediately with transparent background and `preload="auto"`.
- Eliminate loading latency in the Interview tab, which was the slowest view to mount.

## Root Causes Identified & Fixed
1. **Pulsating Dark Skeleton Ball**:
   - `VideoOrb.tsx` had a dark circle (`bg-[#080814] ... animate-pulse`) rendered whenever `!isLoaded` and set the video to `opacity-0` until `onCanPlay`.
   - Solution: Removed the skeleton div completely. Kept the video element visible (`opacity-100`) from frame 0 with `preload="auto"` and transparent background, allowing the browser hardware decoder to paint frame 1 immediately.
2. **Container Animations Causing Layout Jumps & Flickers**:
   - `ConversationOrbHero.tsx` had `animate-[fadeIn_0.35s_ease-out_both]`.
   - `ConversationPromptArea.tsx` had `animate-[fadeIn_0.35s_ease-out_both]`.
   - `ConversationMicControl.tsx` had `animate-[fadeSlideUp_0.35s_ease-out_both]`.
   - Solution: Removed disparate entrance animations on individual children so all elements mount in unison with zero CLS (Cumulative Layout Shift = 0).
3. **Suspense Skeleton Orb Placeholder Elimination**:
   - Removed any circular or ball placeholder (`w-[clamp(...)] rounded-full`) from `InterviewSkeleton.tsx`.
   - The skeleton provides clean, minimal structural boundaries without any fake or jumpy orb placeholders.
4. **Instant Synchronous Pre-Mount Architecture (0ms Latency)**:
   - `InterviewPracticeView` is statically imported in `WorkspaceDashboardView.tsx` instead of wrapped in dynamic `lazy(() => import(...))`.
   - `mountedTabs` initializes with `new Set([defaultTab, "interview"])`.
   - When the user clicks "INTERVIEW", the tab switches from `hidden` to `block` in 0ms without waiting for chunks to download, without Suspense fallbacks, and without layout jumps.
   - Dual-format video pre-warming in `index.html` for both `/assets/orve.webm` (Android/Chrome) and `/assets/orve.mp4` (iOS/Safari).
