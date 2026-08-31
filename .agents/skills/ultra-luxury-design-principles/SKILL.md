---
name: ultra-luxury-design-principles
description: >-
  CELAEST Master UI/UX Philosophy and Anti-Pattern Registry. Defines strict aesthetic,
  spatial, and chromatic rules to avoid visual clutter, tacky container boxes, saturated
  colors, neon terminal pills, and broken grid alignment. Always apply when designing or
  refactoring UI components.
---

# CELAEST Ultra-Luxury Design Philosophy & Anti-Pattern Registry

This skill codifies the non-negotiable aesthetic standards, prohibited anti-patterns, and golden rules of the CELAEST / Lingua UI architecture (Apple Vision Pro, Linear, Cosmos & Stripe luxury standards).

---

## 1. 🚫 Prohibited Anti-Patterns (What NOT to Do)

### 1.1 Zero Neon / Hacker Terminal Status Badges
- **FORBIDDEN:** Adding neon green, bright red, or electric yellow pill boxes with colored borders (e.g. `border-emerald-500/20 bg-emerald-500/10 text-emerald-400`).
- **FORBIDDEN:** Putting hacker-terminal style tags (`● NEURAL SYNAPSE ACTIVE`) in consumer luxury interfaces.
- **WHY:** Saturated status pills make enterprise software look like a cheap developer dashboard, router admin panel, or amateur toy UI.
- **CORRECT STANDARD:** Pure typography with delicate gradient hairlines (`bg-gradient-to-r from-[#9375E6] to-transparent`) and muted metadata (`text-[#A99BC9]`, `text-white/40 font-mono tracking-[0.22em] uppercase`).

### 1.2 Zero Saturated / Toy Component Backgrounds
- **FORBIDDEN:** Adding saturated purple, blue, red, or rainbow backgrounds to cards, buttons, or containers.
- **FORBIDDEN:** Saturated gradients as card fills (e.g. `bg-gradient-to-r from-purple-800 to-blue-800`).
- **WHY:** Saturated backgrounds destroy visual sophistication and create severe visual fatigue.
- **CORRECT STANDARD:** True Obsidian and Deep Cosmic Dark fills (`#000001`, `#030208`, `#04040A`, `rgba(12, 12, 28, 0.65)` with `backdrop-blur-xl`).

### 1.3 Zero "Box-in-a-Box" & Heavy Border Syndrome
- **FORBIDDEN:** Heavy borders (`border-2`, `border-[#7048E8]`, `border-white/30`).
- **FORBIDDEN:** Wrapping simple text inside nested bordered boxes, dark gray cards, or unnecessary card containers when clean naked text is superior.
- **WHY:** Visual noise suffocates the content and ruins breathability.
- **CORRECT STANDARD:** Borderless transparent canvases or razor-sharp subtle hairlines (`border-white/[0.06]` to `border-white/[0.08]`) with a top specular hairline highlight (`h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent`).

### 1.4 Zero Artificial Drop Shadows / Blur on Vector Assets & Images
- **FORBIDDEN:** Adding CSS `drop-shadow`, `shadow-`, or blur filters directly to PNG or SVG vector assets.
- **WHY:** Blurring asset edges destroys their native high-resolution vector sharpness and transparency.
- **CORRECT STANDARD:** Ambient glow belongs *behind* the element as a separate background pseudo-glow or atmospheric backdrop light, never as a muddy filter on the graphic itself.

### 1.5 Zero Broken Vertical Alignments (The "Invisible Line" Rule)
- **FORBIDDEN:** Random centering of text inside containers that pushes headlines and paragraphs away from the left edge ("desfasado").
- **FORBIDDEN:** Mismatched horizontal margins between header, editor, text body, and bottom bar.
- **CORRECT STANDARD:** Clean, flush left-alignment along an invisible vertical grid axis ("derechito"), while the overall content column is proportionally centered in the viewport.

### 1.6 Zero Over-Engineering
- **FORBIDDEN:** Wrapping simple UI blocks in 5 layers of redundant `div` wrappers, complex flex nests, or excessive animation cascades that delay rendering.
- **CORRECT STANDARD:** Direct, elegant, SRP-focused components with high readability and instant performance.

---

## 2. 💎 Golden Design Rules (CELAEST Luxury Standard)

### 2.1 Color Palette & Energy Hierarchy
| Layer | Color Token / Class | Usage |
|---|---|---|
| **App Canvas Background** | `#000001` / `#030208` | Deep infinite dark background |
| **Glass / Card Surface** | `#04040A` / `bg-white/[0.02]` – `[0.04]` | Translucent obsidian glass |
| **Borders & Speculars** | `border-white/[0.07]`, `via-white/15` | Micro hairlines & top specular lights |
| **Primary Typography** | `#FFFFFF` / `#F8F8F8` | Headers, primary data, active labels |
| **Secondary Typography** | `#C5C6D0` / `#9E9EBD` / `#8A8A9E` | Reading body, subtitles, descriptions |
| **Monospace / Meta** | `text-white/40 font-mono tracking-widest` | Category pills, timestamps, metrics |
| **Active Energy Accent** | `#A27FF3` / `#C4B5FD` / `#7048E8` | Glowing badges, active rings, focus pills |

### 2.2 Typography Hierarchy
- **Editorial / Hero Statements:** Serif display font (`font-display`, `font-serif`) for evocative emotional resonance (e.g. *"I've been thinking about our last conversation."*).
- **Task & Article Headings:** Ultra-clean light sans-serif (`font-sans font-light tracking-wide text-2xl sm:text-3xl`).
- **Metadata & Technical Labels:** Monospace uppercase (`text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase`).
- **Body & Longform:** High-contrast, breathable sans-serif (`text-[#C5C6D0] leading-[1.75] font-light`).

---

## 3. 📐 Layout Standardization Across Features

All core feature screens (`Writing`, `Reading`, `Conversation / Interview`) MUST adhere to identical dimensions:

1. **Root Outer Container:**
   `className="relative w-full h-full min-h-screen bg-[#000001] text-white flex flex-col justify-between select-none z-10 overflow-hidden"`
2. **Main Workspace Canvas:**
   `className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row items-stretch justify-between px-6 sm:px-10 lg:px-14 py-3 sm:py-5 pt-3 sm:pt-4 gap-6 sm:gap-8 z-10 overflow-hidden"`
3. **Right Sidebar Stack:**
   `className="hidden xl:flex w-80 xl:w-96 flex-col space-y-4 shrink-0 h-full max-h-full overflow-y-auto no-scrollbar py-1"`
4. **All Cards within Sidebar:**
   `className="relative bg-[#04040A] border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 rounded-3xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col space-y-3.5 shrink-0 overflow-hidden"`
