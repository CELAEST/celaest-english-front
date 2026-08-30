---
name: bespoke-icon-crafting
description: >-
  Master guide for engineering bespoke, ultra-clean, high-level vector SVG icons
  for enterprise UI systems (Apple SF Symbols & Linear standard). Use whenever creating,
  refactoring, or auditing UI iconography, progress gauges, and glyphs.
---

# Bespoke Icon Crafting Standards (CELAEST / Apple / Linear Standard)

This skill defines the rigorous geometric, optical, and semantic standards required for crafting bespoke vector icons in modern dark-mode, high-end interfaces.

---

## 1. Core Geometric Principles

### 1.1 Fixed Coordinate Grid & ViewBox

- Always design on a standardized, integer-based coordinate grid:
  - **Micro / Inline Nodes:** `viewBox="0 0 16 16"` or `viewBox="0 0 20 20"` (e.g. timeline pills, badges).
  - **Standard UI Icons:** `viewBox="0 0 24 24"` or `viewBox="0 0 28 28"` (e.g. sidebar navigation, toolbar buttons).
  - **Hero Nexus Centerpieces:** `viewBox="0 0 48 48"` or `viewBox="0 0 64 64"` (e.g. state loaders, modal headers, orb centers).
- Maintain a consistent **Safe Area Padding** (1.5px – 3px) from the viewBox boundary to prevent clipping when transformed or scaled.

### 1.2 Unified Stroke Weight & Consistency

- **Rule of Single Weight:** All strokes within an icon suite must share a uniform primary thickness:
  - `48x48` Hero: `1.5px` to `1.8px` primary stroke, `1.2px` secondary.
  - `24x24` Standard: `1.75px` stroke.
  - `16x16` Micro: `1.3px` to `1.5px` stroke.
- **Terminals & Joins:** Strictly enforce `strokeLinecap="round"` and `strokeLinejoin="round"` to guarantee smooth, continuous contour geometry.

### 1.3 Keyline Proportions & Visual Volume

- Different geometric shapes require optical sizing compensation:
  - **Circles:** Sized slightly larger than squares (e.g., 20px circle vs 18px square) to match visual weight.
  - **Triangles / Asymmetric Glyphs:** Center of gravity must be optically shifted, not just mathematically centered in the viewBox.

---

## 2. Eliminating Visual Noise & Clutter ("The Cleanliness Rule")

- **Zero Arbitrary Ray/Sunburst Flares:** Never add disconnected ray dashes (`M24 4V10`) above books or objects unless explicitly part of an active laser reticle.
- **Zero Heavy Box Fills or Drop Shadows on Vectors:** Avoid blurry CSS filter shadows directly on SVG elements. Let vector paths stay razor-sharp and use high-contrast color tokens.
- **Simplified Skeletons:** A symbol must be instantly recognizable at 16px when blurred. If an icon has more than 5 distinct micro-elements, simplify it.

---

## 3. Dark Theme & Violet Cosmic Color Palette

- **Primary Stroke (High Luminance):** `#FFFFFF` (100% white for focal points) and `#DDD6FE` / `#C4B5FD` (soft lavender violet).
- **Secondary Accent:** `#A27FF3` (medium energy violet).
- **Tertiary / Base Structure:** `#7048E8` / `#38267D` (deep luminous violet) with subtle opacities (`0.4`–`0.7`).
- **Core Fills:** Deep cosmic container fills (`#0c0a24` or `#080816`) with high-contrast borders.

---

## 4. Crafting Specific Semantic Metaphors

### 🧬 Linguistic DNA / Synaptic Personalization

- **Avoid:** Clunky hourglasses with heavy corner rings and boxy crosses.
- **Use:** Continuous, organic double-helix sine waves with evenly distributed horizontal hydrogen bond lines and luminous terminal nodes.

### 📖 Reading Codex / Lexicon Knowledge

- **Avoid:** Thick cartoon books with wavy lines and exclamation rays.
- **Use:** Precision open architectural codex with clean 3D perspective spine, crisp horizontal paragraph etchings, and subtle page bevel curves.

### 🎯 Topic Radar / Calibration Target

- **Use:** Concentric circular rings with precision 4-point crosshair ticks and a solid focal nucleus.
