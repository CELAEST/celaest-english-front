# PROJECT AGENT RULES: Lingua (CELAEST English)

> **Mandate**: This document defines the permanent, non-negotiable engineering and architectural rules for all AI agents (ChatGPT, Claude, Gemini, Cursor, Antigravity) working on this codebase.

---

## 1. Non-Negotiable Architecture & Design Principles

### 1. Screaming Architecture (Top-Level Feature Layering)

Every file and feature must strictly adhere to the top-level architecture defined in `docs/07_FOLDER_STRUCTURE.md`:

- `src/features/`: Screaming Feature views (`src/features/onboarding/`, `src/features/conversation/`, `src/features/memory/`).
- `src/design-system/`: Atomic UI System components (`src/design-system/components/`).
- `src/domain/`: Pure business entities, value objects, domain events, and repository interfaces.
- `src/application/`: Workflow use cases and abstract port contracts (`src/application/ports/`).
- `src/infrastructure/`: Technical drivers, Web Audio worklets, WebRTC gateways, and encrypted storage adapters (`src/infrastructure/adapters/`).
- `src/shared/`: Cross-cutting utilities, types, and constants.

### 2. Strict Modularization & Anti-Monolith Policy (SRP & DRY)

- **Zero Monolithic Component Files**: NEVER create or expand single component files beyond ~50-80 lines by inlining multiple steps, sub-views, or complex layouts.
- **Component Decomposition from Day 1**: Every step, sub-panel, or distinct UI block MUST be created in its own dedicated component file (`OnboardingWelcomeStep.tsx`, `OnboardingQuestionsStep.tsx`, etc.).
- **Orchestrator Pattern**: Main feature views (e.g. `OnboardingView.tsx`) MUST remain ultra-lightweight orchestrators (~30 lines) that delegate rendering to focused sub-components.
- **Single Responsibility Principle (SRP)**: Each component, hook, or utility file has ONE and ONLY ONE reason to change.
- **Dependency Inversion Principle (DIP)**: Depend on abstract interfaces (`@application/ports/` or `@domain/repositories/`), never direct low-level implementations.
- **DRY**: Zero duplicate logic, zero un-tokenized CSS rules, zero duplicated inline buttons/inputs when design system components exist.

### 3. Security First & Zero Trust Client

- **XSS Mitigation**: Never render AI output or user text via `dangerouslySetInnerHTML` without passing through `SanitizerService` (`DOMPurify`).
- **Data Encryption**: User DNA and local memory state must be stored using `ISecureVault` (AES-GCM 256-bit encryption).
- **Audio Lifecycle**: Revoke all Web Audio Object URLs (`URL.revokeObjectURL`) upon unmount.

### 4. Design System & Visual Asset Supremacy

- **Colors**: Strictly consume CSS variable tokens (`var(--bg-app)`, `var(--surface-1)`, `var(--accent-violet-500)`) from `docs/04_DESIGN_SYSTEM.md`. Zero hardcoded hex colors or unapproved inline styles.
### 5. Zero Hardcoded Content Banks & Closed Whitelists (Universal Pedagogy)

- **Zero Content Banks**: NEVER embed static arrays of questions, writing prompts, or vocabulary lists (`TECH_POOL`, `WRITING_TASKS_POOL`, etc.). All content MUST be generated procedurally from parameterized templates or via real-time AI generation (`AiInterviewQuestionGenerator`, `AiWritingTaskGenerator`).
- **Universal Linguistic Verification**: NEVER build closed-vocabulary whitelists or static allowed-word sets. English language validity MUST be evaluated using closed-class functional tokens (~80 structural words), universal phonotactics (vowels, consonant clusters), spatial entropy, and Spanish screening.
- **Zero Role-Biased Defaults**: NEVER default user roles to "Product Manager" or "Software & Technology". Always use neutral ("Professional") or dynamically inferred values.

---

## 2. Mandatory Pre-Commit Checklist for AI Agents

Before declaring any task or file modification complete:

- [ ] Is the codebase 100% free of TypeScript errors (`npx tsc --noEmit` passes with 0 errors)?
- [ ] Does the project build cleanly (`npm run build` succeeds)?
- [ ] Did the anti-hardcode audit pass with zero violations (`npm run audit:hardcode`)?
- [ ] Did the multi-domain invariance tests pass (`npx vitest run src/features/conversation/services/__tests__/multiDomainInvariance.test.ts`)?
- [ ] Is the feature modularized into single-responsibility sub-components instead of a monolithic file?
- [ ] Does the new/modified file sit in its exact location per `docs/07_FOLDER_STRUCTURE.md`?
- [ ] Are all exports cleanly exposed via feature barrel `index.ts` files?
- [ ] Are all abstract interfaces decoupled from low-level implementations?

---

## 3. Intelligent MCP Dynamic Workflow & Token Conservation Protocol

### 1. Dynamic On-Demand MCP Orchestration
AI agents must activate specialized MCP tools exclusively when the task demands it, preventing context clutter and saving tokens:

| Scenario / Intent | Primary Tool / MCP | Objective |
|---|---|---|
| **Semantic AST & Symbol Refactoring** | `Serena MCP` / `gopls` | Query symbols, references, and definitions without bulk file dumping. |
| **System & Architecture Design** | `MCP Architect` | Decompose multi-step architectural features into hierarchical sub-specs. |
| **Live API & Contract Regression** | `Postman MCP` | Validate live endpoints (`celaest-back`, `celaest-english-back`). |
| **End-to-End UI & Authentication** | `Playwright MCP` / `browser_subagent` | Test live OAuth flows, screen transitions, and DOM rendering. |
| **Telemetry & Live Error Triage** | `Sentry MCP` | Capture and diagnose unhandled exceptions and performance traces. |
| **Remote Database & State** | `Supabase MCP` / `Context7 (Upstash)` | Check schema migrations, auth configs, and Redis cache keys. |
| **Security & Vulnerability Audit** | `Semgrep MCP` | Run static analysis (XSS, SQLi, token leaks) inside the Quality Gate. |

### 2. Refined 5-Stage Engineering Pipeline & Self-Healing Loop

```mermaid
graph TD
    A[Requerimiento / Tarea] --> B[Análisis Inicial & AST]
    B -->|Serena / gopls| C[Lectura Quirúrgica por Rangos (StartLine/EndLine)]
    C --> D[Memoria de Contexto & Arquitectura]
    D --> E[Implementación Modular & Desacoplada]
    E --> F[Quality Gate Automatizado]
    F -->|tsc / vitest / go test / Semgrep| G{¿Pasa 100%?}
    G -->|Fallo Detectado (Loop Auto-Reparación)| E
    G -->|100% Aprobado| H[Registro en Memoria Serena & Entrega]
```

### 3. Execution & Token Efficiency Directives
1. **Targeted Reading (Token Saving)**: Always use `StartLine` and `EndLine` slices when reading code files; never read entire 500+ line files when inspecting single functions.
2. **Surgical Diffs**: Make focused contiguous replacements with `replace_file_content` instead of rewriting entire files.
3. **Decoupled Architecture (SRP & DIP)**: Depend on abstract interfaces, never create monolithic components.
4. **Semgrep in Quality Gate**: Run Semgrep security scans during the post-implementation Quality Gate stage ($F$), avoiding latency in the initial analysis phase ($B$).
5. **Self-Healing Quality Gate ($F \xrightarrow{\text{Fallo}} E$)**:
   - Run `npx tsc --noEmit` + `vitest` + `go test`.
   - If any compiler/linter error occurs, analyze the error output and apply targeted auto-repair diffs before concluding the turn.
6. **Persistent Memory Gate**: Update Serena project memories and knowledge items upon completing major architectural changes so all future sessions retain context.
