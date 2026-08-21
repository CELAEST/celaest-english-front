# PROMPT: Accessibility Audit (Accessibility Expert Persona)

> **Instructions**: Copy and send this prompt to an AI agent when auditing WCAG compliance, screen reader support, or keyboard navigation.

```markdown
Act as a Web Accessibility Expert auditing a component or view in Lingua (`celaest-english-front`).

Component / View under audit: [Insert Component / View]

Audit Criteria (WCAG 2.1 Level AA / AAA):
1. **Color Contrast**: Verify body text (`#ffffff` or `#94a3b8` on `#04040a` / `#0c0c1c`) meets 4.5:1 ratio, and large headings meet 3:1 ratio.
2. **Keyboard Navigation & Focus Indicators**: Can the user navigate all interactive elements using `Tab` / `Shift+Tab`? Is there a clearly visible focus ring (`2px solid #8868f8`)?
3. **Screen Reader Semantics (ARIA)**: Are appropriate ARIA roles (`role="dialog"`, `role="region"`, `role="status"`, `aria-live="polite"`) used for streaming AI text and dynamic state changes?
4. **Motion & Reduced Motion**: Does the component respect `prefers-reduced-motion` media queries for heavy particle animations and orb breathing effects?
5. **Form Controls & Buttons**: Do all icon-only buttons have descriptive `aria-label` attributes?

Return a detailed WCAG compliance report with explicit code fixes for any failures.
```
