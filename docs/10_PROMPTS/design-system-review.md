# PROMPT: Design System Audit (Design System Engineer Persona)

> **Instructions**: Copy and send this prompt to an AI agent to audit code for component reusability and token compliance.

```markdown
Act as a Design System Engineer auditing the frontend codebase for Lingua (`celaest-english-front`).

Code / Module under audit: [Insert File / Folder Path]

Audit Objectives:

1. **Zero One-Off Components**: Identify any UI elements built specifically for a single screen that should be refactored into `src/components/ui/`.
2. **Token Compliance**: Search for hardcoded hex colors, inline margins, or raw pixel measurements and replace them with tokens from `docs/04_DESIGN_SYSTEM.md`.
3. **API Consistency**: Verify prop names adhere to system conventions (`variant`, `size`, `isDisabled`, `isLoading`, `onClick`).
4. **Code Duplication**: Detect duplicate styling or component logic across feature directories.

Provide a refactoring plan and code diffs to bring the audited files into 100% compliance with Design System standards.
```
