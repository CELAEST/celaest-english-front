# 04. DESIGN SYSTEM: Tokens, Colors, Elevation & Motion (Exact Visual Analysis)

> **Status**: Verified against 17 visual asset references in `assets/`  
> **Theme**: Deep Cosmic Dark (`#04040A`), Glassmorphism, Electric Violet Glow (`#7048E8`)

---

## 1. Color Palette Tokens

```css
:root {
  /* ==========================================================================
     1. BACKGROUND & SURFACE TOKENS (Deep Space & Dark Glass)
     ========================================================================== */
  --bg-app: #04040a; /* Pure Deep Space Base */
  --bg-sidebar: #06060e; /* Left Navigation Background */
  --surface-0: #080814; /* Base Canvas Container */
  --surface-1: #0c0c1c; /* Standard Card Surface */
  --surface-2: #101024; /* Inset Card / Hovered Surface */
  --surface-3: #16162e; /* Active Selected Card */

  /* Dark Glassmorphism */
  --glass-bg: rgba(12, 12, 28, 0.65);
  --glass-bg-hover: rgba(18, 18, 38, 0.75);
  --glass-border: rgba(255, 255, 255, 0.07);
  --glass-border-hover: rgba(255, 255, 255, 0.15);
  --glass-border-active: rgba(120, 80, 240, 0.4);
  --glass-blur: 20px;

  /* ==========================================================================
     2. PRIMARY BRAND ACCENTS (Glowing Electric Violet & Indigo)
     ========================================================================== */
  --accent-violet-500: #7048e8; /* Primary Action Button & Orb Core */
  --accent-violet-600: #6038e0; /* Button Hover / Active state */
  --accent-violet-400: #8868f8; /* Highlight / Selection Ring */
  --accent-violet-light: #b89cff; /* Soft Lavender Text / Icons */
  --accent-violet-glow: rgba(112, 72, 232, 0.45);
  --accent-violet-subtle: rgba(112, 72, 232, 0.12);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #7850e8 0%, #5830e8 100%);
  --gradient-glow-orb: radial-gradient(
    circle,
    rgba(136, 104, 248, 0.8) 0%,
    rgba(96, 56, 224, 0.3) 50%,
    rgba(4, 4, 10, 0) 75%
  );
  --gradient-glass-card: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );

  /* ==========================================================================
     3. SEMANTIC STATUS & LEARNING STATE TOKENS
     ========================================================================== */
  --status-success: #10b981; /* Mint: Mastered, 100% Local, Correct */
  --status-success-glow: rgba(16, 185, 129, 0.25);
  --status-warning: #f59e0b; /* Amber: Review Later, Hesitation */
  --status-danger: #ef4444; /* Soft Coral Red: Mistake Highlight */
  --status-danger-subtle: rgba(239, 68, 68, 0.15);
  --status-info: #3b82f6; /* Cyan/Blue: Knowledge Graph Node */

  /* ==========================================================================
     4. TYPOGRAPHY COLOR TOKENS
     ========================================================================== */
  --text-primary: #ffffff; /* High Contrast Titles & Headlines */
  --text-secondary: #94a3b8; /* Muted Paragraphs & Labels */
  --text-tertiary: #64748b; /* Footers, Captions, Disabled */
  --text-accent: #c4b5fd; /* Glowing lavender highlight text */
}
```

---

## 2. Typography System

### Font Families

- **Primary Sans-Serif**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `sans-serif`
- **Reflective Accent Serif**: `Playfair Display`, `Newsreader`, `Georgia`, `serif` _(used for inspirational titles & reading quotes, e.g. "I've been thinking about our last conversation.")_
- **Monospace**: `JetBrains Mono`, `Fira Code`, `monospace` _(used for stats, phonetics `/'materz/`, timing)_

### Type Scale Matrix

| Token        | Size            | Line Height | Weight         | Usage                                         |
| :----------- | :-------------- | :---------- | :------------- | :-------------------------------------------- |
| `display-xl` | 44px (2.75rem)  | 1.1         | 500 / Regular  | Hero Landing & Onboarding Titles              |
| `display-lg` | 32px (2.00rem)  | 1.2         | 500 / Medium   | Workspace Header ("Good afternoon, Esteban.") |
| `heading-md` | 24px (1.50rem)  | 1.3         | 500 / Medium   | Card Headers & Section Titles                 |
| `heading-sm` | 18px (1.125rem) | 1.4         | 600 / SemiBold | Sub-card headers & Feature titles             |
| `body-lg`    | 16px (1.00rem)  | 1.6         | 400 / Regular  | Reading Studio Text & Writing Body            |
| `body-md`    | 14px (0.875rem) | 1.5         | 400 / Regular  | Standard Body, Chat Messages, Cards           |
| `caption`    | 12px (0.75rem)  | 1.4         | 500 / Medium   | Badges, Timestamps, Sub-labels                |

---

## 3. Spacing Scale & Radius Tokens

```css
/* Spacing Scale (Base 4px Grid) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* Radius Tokens */
--radius-sm: 8px; /* Small Pill / Input field */
--radius-md: 12px; /* Standard Button / Badge */
--radius-lg: 20px; /* Glass Card Panel */
--radius-xl: 28px; /* Main Modal / Hero Card */
--radius-full: 9999px; /* Pill Badge & Orb Shape */
```

---

## 4. Elevation, Blur & Glow Effects

```css
/* Glass Card Elevation */
--shadow-card: 0 8px 32px 0 rgba(0, 0, 0, 0.45);
--shadow-orb-glow: 0 0 60px 20px rgba(112, 72, 232, 0.35);
--shadow-button-glow: 0 4px 20px 0 rgba(112, 72, 232, 0.5);

/* Backdrops */
--backdrop-blur-glass: blur(20px) saturate(180%);
--backdrop-blur-overlay: blur(12px);
```

---

## 5. Motion & Physics Tokens

```css
/* Transition Timings */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 450ms;
--duration-orb-pulse: 3000ms;

/* Spring Physics Easing */
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* Smooth snappy UI */
--ease-glow: cubic-bezier(0.4, 0, 0.2, 1); /* Breathing ambient glow */
```
