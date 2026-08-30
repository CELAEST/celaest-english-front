# 05. COMPONENT GUIDELINES: Design System Component Architecture

> **Rule**: NO ONE-OFF COMPONENTS. Every component must be atomic, reusable, accessible, and theme-compliant.

---

## 1. Core Component Catalog

```
src/components/ui/
├── Button/                --> Primary Violet Glow, Secondary Glass, Icon Ghost
├── Card/                  --> Glassmorphic Card, Inset Dark Card, Interactive Card
├── Orb/                   --> 3D/Canvas AI Mentor glowing sphere (State-driven)
├── Waveform/              --> Live Audio Frequency Visualizer (Web Audio API)
├── Badge/                 --> Status Pill (Mint, Lavender, Amber, Coral)
├── Modal/                 --> Centered dark glass dialog with focus lock
├── Drawer/                --> Side inspector panel (AI Reflection, Grammar explainers)
├── ProgressRing/          --> Circular mastery indicator (82% Grammar, etc.)
├── Timeline/              --> "Your Journey" horizontal step track
└── Input/                 --> Ambient dark text input & search bar
```

---

## 2. Component Specifications

### 2.1 `Button` Component Specification

- **Primary Variant**: Background `var(--gradient-primary)`, box-shadow `var(--shadow-button-glow)`, radius `var(--radius-full)`, text `#ffffff`. On hover: `scale(1.02)`, glow intensity increases.
- **Secondary Glass Variant**: Background `var(--glass-bg)`, border `1px solid var(--glass-border)`, radius `var(--radius-full)`. On hover: border `1px solid var(--glass-border-hover)`.
- **Accessibility**: Must include `aria-label`, visible keyboard focus ring (`2px solid var(--accent-violet-400)`), keyboard press handling (`Enter` / `Space`).

### 2.2 `AI Orb` Component Specification (`<AiMentorOrb />`)

The central visual anchor of the application.

- **States**:
  - `Idle`: Soft breathing animation (`var(--duration-orb-pulse)`), purple halo `#7048E8`.
  - `Listening`: Orbit lines expand slightly, internal wave pattern pulses in sync with user audio input.
  - `Analyzing` / `Thinking`: Core color shifts to electric lavender `#8868F8`, particle speed doubles.
  - `Speaking`: Wave contours inside orb morph smoothly with AI speech output stream.
- **Implementation**: HTML5 Canvas / WebGL (Three.js or lightweight shader) with CSS fallback.

### 2.3 `FlipCard` Correction Component Specification

Used in the Memory Bank module.

- **Front Side**: Shows user mistake highlighted in soft coral (`"He don't like coffee"`). Includes "SPEAKING" badge and "Tap to reveal answer" hint.
- **Back Side**: Reveals correct phrasing (`"He doesn't like coffee"`), phonetic breakdown, audio playback icon, and AI Mentor tip drawer trigger.
- **Animation**: 3D perspective flip (`rotateY(180deg)` with `var(--ease-spring)`).

---

## 3. Strict Component Reusability Checklist

Before writing any new component, verify:

- [ ] Is there an existing DS component in `src/components/ui/` that fulfills this?
- [ ] Does this component rely strictly on `var(--token)` variables?
- [ ] Is the props API generic rather than hardcoded to a single screen? (e.g. `title`, `description`, `children`, `action` vs `onboardingStep3Data`).
- [ ] Does it pass WCAG 2.1 AA contrast ratios (minimum 4.5:1 for body text, 3:1 for large display)?
