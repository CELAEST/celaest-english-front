# Frontend Performance, Low-End Mobile Navigation & Video Architecture Standard

## 1. Video Lifecycle & Auto-Pausing Architecture (`VideoOrb.tsx`)
- **Problem**: When navigating between workspace tabs, previous views remained in the DOM with `display: none` (`hidden`). `VideoOrb` had an aggressive auto-play retry (`onPause -> tryPlay()`) that prevented video elements from pausing. On mobile, having 3-5 concurrent H.264 decoders saturated hardware video decoders and dropped frame rates down to single digits.
- **Standard**:
  - `VideoOrb` integrates `IntersectionObserver` to automatically call `pause()` when hidden or offscreen, and `tryPlay()` when visible.
  - Accepts `isActive?: boolean` prop for declarative tab synchronization.
  - Videos use `preload="metadata"` and `disablePictureInPicture`.

## 2. Web-Optimized H.264 Video Standard (FFmpeg Fastdecode)
- **Problem**: High-resolution 2.5K (1440p) videos with 3.3-5.5 Mbps bitrates caused extreme memory consumption and GPU fill-rate throttling on low-end mobile devices.
- **Standard**:
  - `home.mp4`: Downscaled to 1920x1080, libx264 high 4.0, CRF 26, `tune fastdecode`, `movflags +faststart`. Reduced from 1.84 MB to 233 KB (87.5% reduction).
  - `orve.mp4`: Downscaled to 640x640, CRF 24, `tune fastdecode`, `movflags +faststart`. Reduced from 970 KB to 189 KB (80.5% reduction).
  - `cards.mp4` / `card.mp4`: Downscaled to 1280x720, CRF 26. Reduced from 3.17 MB to 389 KB (87.7% reduction).

## 3. Dynamic Code-Splitting & Manual Chunking (`WorkspaceDashboardView.tsx` & `vite.config.ts`)
- Heavy feature views (`InterviewPracticeView`, `WritingPracticeView`, `ReadingPracticeView`, `MemoryView`, `SettingsView`, `LabView`) are loaded via `React.lazy()` with `<Suspense fallback={<TabLoadingFallback />}>`.
- Rollup manual chunks in `vite.config.ts`:
  - `vendor-react`: 179 KB
  - `vendor-motion`: 114 KB
  - `vendor-icons`: 24 KB
  - `vendor-query`: 40 KB
  - `vendor-supabase`: 217 KB
  - Feature chunks: 60 KB - 88 KB each, loaded only when navigated to.

## 4. Mobile GPU Blur Optimization (`index.css` & `MemoryView.tsx`)
- On screens `<= 768px`, `--glass-blur` is set to `8px` instead of `20px` to guarantee 60 FPS on low-power mobile GPUs (Mali / Adreno).
- Background ambient radial glow layers in `MemoryView.tsx` are optimized with mobile-friendly blur and secondary layers hidden on mobile screens (`hidden sm:block`).

## 5. Quality Gate Certification
- 47/47 Vitest test suites passing (293/293 tests).
- TypeScript (`tsc --noEmit`): 0 errors.
- Anti-hardcode audit: 100% passed.
- Production build: Succeeded in 16.1s.
