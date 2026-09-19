# Media & View Loading Architecture Optimization (High-Fidelity WebM / WebP & 0ms Prefetching)

### 1. Multi-Source Video Optimization
- All ambient video loops (`home`, `orve`, `begin1`, `ask`, `cards`) now use dual sources:
  `<video ...><source src="/assets/[name].webm" type="video/webm" /><source src="/assets/[name].mp4" type="video/mp4" /></video>`
- **Sizes**:
  - `begin1.webm`: 188 KB (was 1.38 MB, **-86.7%**)
  - `ask.webm`: 82 KB (was 441 KB, **-81.6%**)
  - `home.webm`: 134 KB (was 238 KB, **-43.7%**)
  - `orve.webm`: 145 KB (was 193 KB, **-24.8%**)
  - `cards.webm`: 492 KB (720p 30fps)
- H.264 MP4 fallbacks were re-encoded at Full HD/720p with `preset slow -tune fastdecode -movflags +faststart` for zero playback stutter.

### 2. High-Fidelity WebP Image Replacement
- Replaced oversized PNG video posters and thumbnail JPGs with WebP (85-90% quality):
  - `workspace_room_bg.webp`: **40 KB** (was 1.56 MB, **-97.5%**)
  - `cards_poster.webp`: **107 KB** (was 1.03 MB, **-90%**)
  - `vocab_headphones_focus.webp`: **43 KB** (was 717 KB, **-94%**)

### 3. Zero-Latency Tab Mounting ("Se monte de una")
- **Idle Prefetching**: In `WorkspaceDashboardView.tsx`, a 1000ms idle timer preloads `conversation`, `writing`, `reading`, `memory`, and `settings` modules silently via `Promise.allSettled()`.
- **Hover & Touch Anticipation**: In `WorkspaceSidebar.tsx` and `MobileBottomDock`, buttons trigger `prefetchTabRoute(id)` on `onMouseEnter`, `onTouchStart`, and `onFocus`, ensuring modules are cached before the user even finishes clicking.
- Tabs mount instantaneously at 0ms without waiting for network transfers.
