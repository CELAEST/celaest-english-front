# Luxury Sidenav & Kinetic Profile Architecture (CELAEST Standard)

## Architectural Principles
1. **Zero-Box & Zero-Pill Profile Standard**:
   - Never wrap secondary profile avatars, names, or status pills in chunky colored rectangular boxes or heavy borders.
   - Profile elements sit directly on the dark frosted glass canvas (`bg-transparent`, zero borders).
2. **Kinetic Typography Unscrambler**:
   - Names and status reveals use `KineticLuxuryText` with Title-Case casing (`Esteban Pérez`), cycling through sleek alphanumeric characters and resolving smoothly left-to-right on hover.
   - Avoid raw monospace / hacker / neon cyan matrix text.
3. **Linear / Raycast Precision Glassmorphism**:
   - Sidebar backdrop: `bg-[#06070d]/90 backdrop-blur-3xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)]`.
   - Active navigation state: cohesive inner capsule with integrated luminous accent hairline (`left-1.5 w-[2.5px] h-4 bg-gradient-to-b from-[#C4B5FD] to-white shadow-[0_0_8px_#A27FF3]`). Never use disconnected detached white tabs.
4. **Responsive Monolith Height**:
   - Constrain with `h-auto min-h-[520px] max-h-[calc(100vh-48px)]` to prevent cutting off the profile footer on laptop screens.
