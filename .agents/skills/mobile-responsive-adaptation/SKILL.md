---
name: mobile-responsive-adaptation
description: Master architectural standard for responsive mobile adaptation of the CELAEST enterprise software with zero desktop regression and zero feature addition/removal.
---

# CELAEST Mobile-First Enterprise Responsive Standard

> **Mandate**: This standard defines the non-negotiable architectural laws, CSS layout patterns, and quality gates for adapting CELAEST web applications to mobile screens (360px – 768px) with **Zero Desktop Regression** and **Zero Feature Modification**.

---

## 🏛️ The Three Iron Invariants

### 1. Invariant 1: Absolute Desktop Invariance (Zero Regression)
- The desktop layout (`lg:` $\ge 1024$px, `xl:` $\ge 1280$px, `2xl:` $\ge 1536$px) is **100% frozen and approved**.
- **RULE**: NEVER modify a CSS class, width, margin, padding, or flex behavior that affects desktop without explicitly scoping it via mobile prefixes and safeguarding the desktop version using `lg:*` / `xl:*`.
  - *Bad*: changing `h-full overflow-hidden` to `h-auto overflow-y-auto` (breaks desktop viewport lock).
  - *Good*: `h-full overflow-y-auto lg:overflow-hidden` (mobile gets natural vertical scroll; desktop remains strictly viewport-locked).
  - *Bad*: removing `w-[72px] ml-12` from the sidebar.
  - *Good*: `hidden lg:flex` for the desktop sidebar + `lg:hidden` for the mobile floating dock.

### 2. Invariant 2: Zero Element Addition / Zero Element Deletion
- "Sin poner ni quitar cosas, solo con lo que ya hay."
- **RULE**:
  - Do NOT remove any metric, card, button, prompt, title, image, or badge.
  - Do NOT invent new widgets, toy chips, or bottom sheets that do not exist on desktop.
  - The mobile view contains **100% of the exact same data and components**, reflowed into an ergonomic vertical or swipeable mobile stack.

### 3. Invariant 3: High-End Native Mobile Ergonomics (Apple / Linear Standard)
- Minimum tap target: **44px $\times$ 44px** for all primary interactive controls.
- Safe Area Insets: Must respect `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` for modern iOS Safari / Android gesture bars.
- Clear Floating Dock Clearance: Any scrollable page container on mobile must include bottom padding (`pb-24` / `pb-28`) so content is never hidden behind the floating mobile navigation dock.

---

## 📐 Mobile Architecture Patterns

### Pattern A: Dual-Shell Navigation Architecture
On desktop, CELAEST uses a 72px $\to$ 256px vertical spring sidebar on the left. On mobile screens ($< 1024$px), this left column is hidden, and replaced by a floating glass bottom dock.

```
┌──────────────────────────────────────────────────────────┐
│ DESKTOP (lg:flex)                                        │
│  [72px Sidebar]  │  [Clearance Corridor]  │ [Main Canvas]│
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ MOBILE (lg:hidden)                                       │
│  [Full Bleed Top Header / Brand]                         │
│  [Main Canvas (flex-1 min-h-0 overflow-y-auto pb-24)]    │
│  ═══════════════════════════════════════════════════════ │
│  [Floating Glass Bottom Dock (7 Geometric Primitives)]   │
└──────────────────────────────────────────────────────────┘
```

#### Mobile Bottom Dock Specifications:
1. **Container**:
   - Fixed at viewport bottom: `fixed bottom-3 left-3 right-3 z-50 h-14 sm:h-16 max-w-lg mx-auto`
   - Ultra-Luxury Glassmorphism: `bg-[#06060e]/92 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(112,72,232,0.12)]`
   - Content distribution: `flex items-center justify-around px-2`
2. **Icons**:
   - The exact same 7 Euclidean Constructivist Geometric Primitives:
     1. Workspace: Circle (`BauhausCircleIcon`)
     2. Memory Vault: Square (`BauhausSquareIcon`)
     3. Interview: Triangle (`BauhausTriangleIcon`)
     4. Reading: Diamond (`BauhausDiamondIcon`)
     5. Writing Studio: Hexagon (`BauhausHexagonIcon`)
     6. Design Lab (if dev): Orthogonal Cross (`BauhausCrossIcon`)
     7. Settings: Regular Octagon (`BauhausSettingsIcon`)
   - Active state: CELAEST Electric Violet gradient pill with solid white fill (`fill="currentColor"`).
   - Inactive state: `text-zinc-400 hover:text-white` with 1.5px stroke.
   - Touch Target: `w-10 h-10` or `w-11 h-11` centered tap button.

---

### Pattern B: Flex-Chain Mobile Scroll Hierarchy
On desktop, CELAEST enforces the **Zero Global Scroll Principle** via `h-[100dvh] overflow-hidden`.
On mobile, the global viewport must also be `h-[100dvh] overflow-hidden`, but the **inner active feature canvas** becomes an internal flex-height scroll container:

```tsx
// Outer Shell: Viewport locked to prevent rubber-banding on iOS
<div className="relative w-full h-[100dvh] max-h-screen bg-[#030208] flex flex-col lg:flex-row overflow-hidden select-none">
  {/* Desktop Sidebar */}
  <div className="hidden lg:flex ...">...</div>

  {/* Main Dynamic Canvas */}
  <main className="flex-1 flex flex-col justify-between h-full relative z-10 overflow-hidden bg-transparent">
    {/* Feature View (e.g. Workspace Tab) */}
    <div className="flex-1 flex flex-col justify-between h-full overflow-y-auto lg:overflow-hidden p-4 sm:p-6 lg:p-8 pb-24 lg:pb-2">
      {/* Content flows naturally on mobile without squashing */}
    </div>
  </main>

  {/* Mobile Bottom Dock */}
  <nav className="lg:hidden fixed bottom-3 left-3 right-3 ...">...</nav>
</div>
```

---

### Pattern C: Horizontal Card Stacks & Touch Carousels
When multiple cards or telemetry widgets sit side-by-side on desktop (e.g. `WorkspaceHeroSection` and `WorkspaceOrbCallouts`):
- Desktop: `flex flex-row items-start justify-between`
- Mobile: `flex flex-col items-stretch w-full gap-5`
- Card widths: `w-full max-w-none lg:max-w-[315px]`
- No horizontal clipping: all cards occupy 100% of available mobile width with fluid text truncation (`truncate`) where necessary.

---

## 🧪 Quality Gate Checklist for Mobile

Before certifying any responsive mobile adaptation:

1. **Desktop Verification**:
   - [ ] Viewport 1440px $\times$ 900px: Exactly 0px deviation from pre-adaptation desktop render.
   - [ ] Sidebar springs from 72px to 256px on hover.
   - [ ] Glowing Orb clearance corridor preserved.
2. **Mobile Phone Verification (390px $\times$ 844px - iPhone 12/13/14/15)**:
   - [ ] Left sidebar is completely hidden (`hidden lg:flex`).
   - [ ] Floating bottom dock is crisp, centered, and active tab indicator aligns.
   - [ ] All 7 tabs navigate smoothly without screen flicker.
   - [ ] Scrolling inner content has at least `pb-24` clearance above the dock.
   - [ ] Every button has at least 44px touch height.
   - [ ] Zero horizontal page overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
3. **Automated Audit**:
   - [ ] `npx tsc --noEmit` passes with 0 errors.
   - [ ] `npm run audit:hardcode` passes with 0 errors.
   - [ ] Vitest unit test suite passes 100%.
