---
name: svg-design
description: Generates and edits SVG logos, icons, and graphics. Use when creating SVG files, designing logos or icons, writing path data, optimizing SVGs, building icon systems, animating SVG elements, or modifying existing vector graphics. Covers path commands, shape primitives, styling, accessibility, gradients, masks, sprites, optimization, and animation (CSS keyframes, GPU acceleration, staggering, easing, SVG-specific techniques).
---

# SVG Creation and Editing (OpenDesign & CELAEST Standard)

**Core principle:** SVGs are code. Write them by hand like you'd write any markup: clean, minimal, semantically meaningful. Every element and attribute should earn its place.

## Canvas Size Conventions

| Size | Use case | Notes |
|------|----------|-------|
| `0 0 16 16` | Micro icons, telemetry badges, pills | Heroicons micro, Octicons |
| `0 0 20 20` | Small UI icons, action buttons | Heroicons mini |
| `0 0 24 24` | Standard icons (most common) | Lucide, SF Symbols, Linear |
| `0 0 32 32` | Medium icons, navigation items | Phosphor, Feature markers |
| `0 0 48 48` | Large display icons & Hero centers | App icons, Nexus centerpieces |

**Default to 24x24** for UI feature cards and standard action icons.

## Styling Defaults

Set these on the root `<svg>` element:

| Attribute | Default | Why |
|-----------|---------|-----|
| `fill` | `none` | Modern stroked icons |
| `stroke` | `currentColor` | Inherits parent text color automatically |
| `stroke-width` | `1.75` (on 24x24) | High-precision Linear / Apple weight |
| `stroke-linecap` | `round` | Rounded ends look cleaner at high DPI |
| `stroke-linejoin` | `round` | Prevents sharp spikes at corners |

## Shape vs Path Guidelines

1. Use shape primitives (`<circle>`, `<rect rx="..."/>`) when semantic readability or simple scaling is desired.
2. Use `<path>` with explicit cubic bezier (`C`) and quadratic curves (`Q`) or arc commands (`A`) for bespoke organic glyphs (e.g. Brain Synapse, Neural Waveform, Linguistic Matrix, Speech Soundwave).
3. Use `evenodd` fill-rule for compound shapes with geometric cutouts.
