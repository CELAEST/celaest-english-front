# Video Media Lifecycle & Component Optimization Standard (CELAEST Lingua)

## 1. Zero Duplicate Video Mount Rule
- **Problem**: In `OnboardingView.tsx`, two separate `<video>` tags were mounted simultaneously for responsive breakpoints (`hidden sm:block` and `sm:hidden`). Both instances requested the video stream and allocated hardware video decoders in Chromium/WebKit on mobile and desktop devices.
- **Contract**: Never use CSS display tricks (`hidden` / `block`) to swap media elements. Always use a SINGLE media element styled with responsive Tailwind classes (`top-[4%] left-1/2 sm:top-1/2 sm:left-auto sm:right-0 ...`).

## 2. Enterprise Unified Primitive (`OptimizedVideo.tsx`)
- Located at `src/design-system/components/Media/OptimizedVideo.tsx`.
- **Features**:
  - Automatically renders dual sources: `<source src="...webm" type="video/webm" />` (VP9) followed by `<source src="...mp4" type="video/mp4" />` (H.264 fastdecode).
  - Integrates `IntersectionObserver`: Pauses video decoding when element is offscreen or hidden (< 5% visible); auto-resumes when visible.
  - Integrates `visibilitychange`: Pauses when user switches browser tabs, minimizes window, or backgrounds the app on mobile.
  - Media power flags: `playsInline`, `muted`, `loop`, `preload="metadata"`, `disablePictureInPicture`, `disableRemotePlayback`.
  - Promise catchers: Prevents `AbortError` unhandled rejections during fast navigation or unmounting.
  - GPU hardware layering: Enforces `transform: translateZ(0)`, `willChange: transform`, and `backfaceVisibility: hidden`.

## 3. Dedicated `VideoOrb.tsx` Consumer Harmonization
- Components displaying the live orb (`orve.webm` / `orve.mp4`) MUST consume `<VideoOrb />` from `src/design-system/components/Orb/VideoOrb`:
  - `ConversationOrbHero.tsx`
  - `WritingHeader.tsx`
  - `WritingTaskHeader.tsx`
  - `ReadingHeader.tsx`
  - `ReadingPreparingView.tsx`
  - `SettingsView.tsx`
  - `MemoryView.tsx`
- Prohibited: Inlining raw `<video>` tags for the orb animation.

## 4. Component-Level Memoization Standard
- All views rendering continuous video loops or ambient background graphics MUST be wrapped in `React.memo` to eliminate unnecessary re-renders of the video canvas when parent component states update.

## 5. Certification Checklist
- `tsc --noEmit`: 0 errors.
- `audit:hardcode`: 100% clean.
- `vite build`: Production build verified with code-splitting chunks.
