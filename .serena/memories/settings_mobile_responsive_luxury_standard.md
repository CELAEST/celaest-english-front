# Settings View: Mobile Responsive Adaptation & Desktop Invariance Standard

## 1. Architectural Directives
- **Zero Global Scroll (Flex-Chain Standard)**:
  - SettingsView acts as an internal viewport-locked orchestrator (`h-full min-h-0 select-none overflow-hidden`).
  - Container padding on mobile: `p-3.5 sm:p-6 lg:px-10 pt-3 sm:pt-6 pb-0 lg:pb-4`.
  - Inner scroll column: `pb-28 lg:pb-8 pr-1 py-1 flex-1 h-full max-h-full overflow-y-auto no-scrollbar`.
  - The `pb-28` provides 112px of safe clearance above the floating mobile dock (`fixed bottom-3 left-3 right-3 h-14`).

## 2. Header & Visual Asset Invariance
- **Orb Video**:
  - Desktop (sm+): 3D orb video (`orve.mp4`) remains fluidly positioned and auto-playing with mix-blend-screen.
  - Mobile (<sm): Orb video is hidden (`hidden sm:flex`) to allow editorial typography ("Make Lingua yours.") full prominence without spatial crowding.
- **Rhythm**:
  - Header margins set to `mb-3 sm:mb-6 pt-1 sm:pt-4` for tight vertical rhythm.

## 3. Quiet Rows & Form Safeguards
- **SettingsListItem**:
  - Left content: `min-w-0 flex-1 pr-2`.
  - Right value: `max-w-[130px] sm:max-w-none truncate text-right` ensures long goals, styles, or usernames never collide with labels on narrow viewports (360px–390px).
- **AI Providers Key Input Bar**:
  - Placeholder dynamically adapts (`keys.length === 0 ? "Pega tu clave (gsk_…)" : "Agregar clave (gsk_…)"`) to prevent text truncation on small mobile screens.
  - Add button: `px-3 sm:px-4 py-2 text-xs shrink-0`.
  - Action bar: `flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 border-t border-white/[0.06] pt-3.5 mt-1`.

## 4. Modal Ergonomics & Viewport Boundary
- **Modal Containers**:
  - Sizing: `w-full max-w-md rounded-2xl sm:rounded-[28px] p-5 sm:p-7 max-h-[88dvh] sm:max-h-[80vh] flex flex-col`.
  - Internal lists: `max-h-[70dvh] sm:max-h-[60vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`.
  - Virtual keyboard resilience: `SettingsProfileModal` configured with `max-h-[90dvh] overflow-y-auto no-scrollbar`.
  - All native browser scrollbars eliminated for a seamless native app experience.

## 5. Desktop Invariance ($\ge 1024$px / $\ge 1280$px)
- Multi-column layout with right sidebar (`SettingsAIMentorCard`, `SettingsQuickActionsCard`, `SettingsFooterMessage`) preserved with 100% frozen styling and functionality.
