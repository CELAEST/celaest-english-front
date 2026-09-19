# CELAEST Memory Standard: Mobile Flashcard Ergonomics & Dock Clearance

## 1. Flashcard Visual Cleanliness (Anti-Clutter Standards)
- **Top Bar Header**:
  - ZERO bullets, dots, or decorative shapes next to the category name.
  - Category typography MUST strictly match the exact monospace styling of the `Card 08/09` counter:
    `<span className="tracking-widest uppercase">{normalizedCategory}</span>` inside `<div className="flex items-center justify-between z-10 shrink-0 text-[11px] font-mono text-white/40 pb-1">`.
  - Both sides of the top bar share the identical font, tracking, weight, and `text-white/40` opacity.
  - Eliminated wordy suffixes (`VOCABULARY & RETENTION`, `SYNTAX & RETENTION`).
- **Bottom Footer & Anti-Jargon Rule**:
  - "SM-2 Interval" was an internal algorithmic detail that leaked into the learner UI and caused footer text truncation.
  - Completely eliminated "SM-2 Interval" from the flashcard footer.
  - Streamlined flip instruction to a single concise line:
    `⟳ Tap to flip for definition` (with `Space to flip` hidden on mobile and visible on `sm+`).

## 2. Card Dimensions & Mobile Dock Clearance
- **Card Sizing**:
  - Container height calibrated to `h-[395px] xs:h-[415px] sm:h-[450px] lg:h-[480px] max-h-[calc(100dvh-230px)] min-h-[360px]`.
  - Avoids oversized cards that vertically overflow into the mobile floating dock (`fixed bottom-3 h-14`).
- **MemoryView Bottom Clearance**:
  - Set root padding to `pb-24 sm:pb-26 lg:pb-5` (96px on mobile) ensuring 28px of absolute clear space above the 68px floating dock.
- **Internal Typography & Padding**:
  - Card internal padding: `p-4 xs:p-5 sm:p-7 lg:p-8`.
  - `VOCABULARY TERM`: Prominent `text-2xl sm:text-3xl lg:text-4xl font-light text-white` with `border-l-2`.
  - `CONTEXT IN READING`: Readable `text-sm sm:text-base lg:text-lg font-normal text-white/90 leading-relaxed` with `line-clamp-4 sm:line-clamp-none`.
- **Empty State Responsive Proportions**:
  - In `MemoryEmptyState`, video scaled to `scale-[1.26] xs:scale-[1.32] sm:scale-100` and `max-h-[46vh] xs:max-h-[50vh] sm:max-h-[66vh]`, keeping the bottom action buttons fully elevated above the mobile floating dock.
