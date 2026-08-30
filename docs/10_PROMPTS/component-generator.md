# PROMPT: Component Generator (Design System Engineer Persona)

> **Instructions**: Copy and send this prompt to an AI agent when generating a new component for the project.

```markdown
Act as a Design System Engineer building a reusable atomic component for Lingua (`celaest-english-front`).

Component Requirements:

- Component Name: [Insert Name]
- Purpose & Description: [Insert Description]
- Variants Needed: [Insert Variants]

Rules & Standards:

1. Refer strictly to `docs/04_DESIGN_SYSTEM.md` for design tokens and `docs/05_COMPONENT_GUIDELINES.md` for component rules.
2. Use clean TypeScript with explicit prop interfaces extending standard HTML elements where applicable.
3. Incorporate dark glassmorphism styling (`var(--glass-bg)`, `var(--glass-border)`, `var(--glass-blur)`).
4. Include keyboard accessibility handling (`FocusRing`, `aria-label`, `TabIndex`).
5. Include smooth spring micro-animations using CSS transitions or Framer Motion.
6. Provide zero hardcoded styling values.

Generate the full TypeScript component code file (`.tsx`) and corresponding CSS module or token-based styling.
```
