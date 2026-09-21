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
3. **Suspense Skeleton Discrepancy**:
   - `InterviewSkeleton.tsx` was rendering a 112px dark circular ball (`w-28 h-28 bg-[#14141d]`) that jumped to 160-240px when `ConversationOrbHero` mounted.
   - Solution: Replaced the dark orb in `InterviewSkeleton` with an invisible, transparent container matching the exact `clamp` dimensions of `ConversationOrbHero`.
4. **Heavy Audio Hardware Blocking on Mount**:
   - `useInterviewSession.ts` eagerly called `AudioCaptureService.initMicrophone()` on mount, running `navigator.mediaDevices.getUserMedia(...)` and spinning up audio contexts synchronously when merely viewing the tab.
   - Solution: Deferred microphone initialization to on-demand user gesture in `toggleListening()`, which already possessed complete fallback and error resilience.
5. **Direct Component Code-Splitting & Early Prefetching**:
   - `WorkspaceDashboardView.tsx` previously lazy-imported `../../conversation` barrel, forcing bundlers to evaluate 15+ subservices and linguistic engines.
   - Solution: Changed lazy import to direct component `../../conversation/components/InterviewPracticeView` and accelerated idle prefetching from 1000ms to 100ms.
   - Added `<link rel="preload" as="video" href="/assets/orve.webm" type="video/webm" />` in `index.html`.
6. **Unconditional Modal DOM Trees**:
   - Modals in `InterviewPracticeView.tsx` (`ConversationAudioSettingsModal`, `MicHardwareRecoveryModal`, `AiInfrastructureRecoveryModal`) were rendered unconditionally with `isOpen={false}`.
   - Solution: Conditionally mounted them only when active (`{isOpen && <Modal />}`).
