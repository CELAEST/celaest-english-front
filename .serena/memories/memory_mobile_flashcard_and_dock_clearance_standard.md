# CELAEST Memory Standard: Mobile Flashcard Ergonomics & Dock Clearance

## 1. Flashcard Visual Cleanliness (Anti-Clutter Standards)
- **Top Bar Header**:
  - Replaced crowded and repetitive text (`READING • VOCABULARY & RETENTION`, `WRITING • SYNTAX & RETENTION`) with a clean glowing category dot and minimalist uppercase label:
    `<span className="w-1.5 h-1.5 rounded-full ... bg-[#A27FF3] ... />` + `<span className="tracking-widest uppercase text-white/60 font-medium">{normalizedCategory}</span>`.
  - Avoids wrapping and collisions with the card counter and bookmark icon on 360-390px screens.
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
