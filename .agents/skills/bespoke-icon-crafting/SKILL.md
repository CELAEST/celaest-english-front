# Brand-Grade Bespoke Vector Crafting Standards (Claude, OpenAI, DeepSeek, Apple Standard)

> **Mandate**: This document defines the mathematical, optical, and geometric standards for crafting Tier-1 brand-grade SVG icons. Generic "AI Clipart" is strictly forbidden. Every icon must look like an iconic mark designed by Apple, Anthropic, OpenAI, or Teenage Engineering.

---

## 1. 🚫 Prohibited "AI Clipart" Tropes (What NEVER to Create)

Generative AI models have a notorious habit of producing juvenile, 2012-era clipart SVGs. These are completely banned:

### 1.1 The "Cartoon Microphone" Trope
- **FORBIDDEN:** Drawing a pill rectangle with two horizontal lines, sitting in a U-shaped arc on a stick with a flat line base (`M14 22C14... M24 32V38 M20 38H28`).
- **FORBIDDEN:** Surrounding icons with generic dashed circles (`strokeDasharray="3 3"`).
- **WHY:** It looks like a cheap free clipart icon from 2010. Real luxury audio software (Logic Pro, Ableton, Teenage Engineering, Universal Audio) uses precision industrial broadcast silhouettes (Shure SM7B, Neumann U87) or architectural acoustic diaphragms.

### 1.2 The "Dumb Object on a Stick" Trope
- **FORBIDDEN:** Generic lightbulbs, generic padlocks with rounded wire shackles, generic shields with crosses, or gear wheels with 6 blocky teeth.
- **WHY:** They instantly scream "AI-generated placeholder".

### 1.3 Disconnected Line Segments & Broken Topology
- **FORBIDDEN:** Scattering floating unconnected strokes around a shape to fake detail. Every line must represent an intentional mechanical or architectural feature.

---

## 2. 🏛️ The Tier-1 Brand-Grade Vector Hall of Fame

Study what makes the world's best brandmarks and system glyphs iconic:

| Brand / Glyph | Geometric Principle | Optical Technique |
|---|---|---|
| **Claude (Anthropic)** | Radiant 16-point organic solar asterisk | Curved tapered terminals, central circular negative aperture, uniform radial flow. |
| **OpenAI** | Continuous recursive cycloid knot | Single continuous ribbon with isometric bevel depth, zero breaks, mathematical symmetry. |
| **DeepSeek** | Fluid dual-fin aerodynamic manta ray | Golden-ratio Bezier curves, organic negative space notch, zero internal clutter. |
| **Groq** | Bold geometric monospace forward-chevron | Monolithic typographic stroke weight with integrated dynamic directional cut. |
| **Apple Studio Audio** | Precision Neumann / Shure broadcast silhouette | Chamfered capsule body, industrial suspension yoke, precision cardioid polar grid lines. |

---

## 3. 📐 Mathematical Rules for Engineering Brand-Grade SVGs

### 3.1 ViewBox & Integer Coordinate Snapping
- **ViewBox Standard:** Always design inside an integer coordinate space: `viewBox="0 0 24 24"`, `viewBox="0 0 32 32"`, or `viewBox="0 0 48 48"`.
- **Zero Subpixel Blur:** Stroke centers must snap to integer or `.5` coordinates (`cx="12" cy="12"`) to guarantee razor-sharp rendering on Retina/HiDPI displays.

### 3.2 Continuous Path Geometry & Fill-Rule
- Prefer unified, continuous closed paths (`<path d="..." />`) over stacking 5 primitive shapes (`<circle/><rect/><line/><line/>`).
- Use `fillRule="evenodd"` when creating intricate cutouts or negative space windows.

### 3.3 Stroke Weights & Terminal Precision
- **Primary Hero Stroke:** `1.5px` to `1.75px` in a `24x24` or `32x32` canvas.
- **Micro Detail Lines:** `1.0px` to `1.2px` with `strokeOpacity="0.4"` to `0.6` for secondary mechanical etchings.
- **Terminals & Joins:** Always declare `strokeLinecap="round"` and `strokeLinejoin="round"` to prevent jarring spiky miter corners.

---

## 4. 🎙️ Specific Blueprint: The Broadcast Studio Audio Capsule (Anti-Clipart Standard)

When rendering studio microphones, speech sensors, or acoustic hardware, follow this industrial design blueprint:

```
          ╭─────────╮   <-- Precision Chamfered Windscreen / Capsule Dome
          │ ░░░░░░░ │   <-- Micro-Etched Cardioid Polar Mesh
          ├─────────┤   <-- Titanium Center Band Ring (0.8px hairline)
          │         │   <-- Machined Solid Metal Body
          ╰────┬────╯   <-- Tapered Acoustic Porting Base
           ╭───┴───╮
          ╭╯       ╰╮   <-- Industrial Cantilever / Swivel Yoke Mount
          │    ●    │   <-- Precision Swivel Pivot Dial
```

- **Avoid:** The generic U-pipe cradle with a stick.
- **Use:** A modern, cantilevered broadcast capsule silhouette (inspired by the legendary Shure SM7B and Neumann TLM 103), rendered with clean, continuous vector paths and subtle titanium hairlines.
- **Acoustic Wave:** Pair with smooth, continuous Gaussian or harmonic frequency bars with dynamic CSS scale transforms, never rigid blocky meters.
