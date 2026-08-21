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

### 4. Design System Supremacy
- **Colors**: Strictly consume CSS variable tokens (`var(--bg-app)`, `var(--surface-1)`, `var(--accent-violet-500)`) from `docs/04_DESIGN_SYSTEM.md`. Zero hardcoded hex colors or unapproved inline styles.
- **Theme**: Deep Cosmic Dark (`#04040A`), Glassmorphism (`rgba(12, 12, 28, 0.65)` with `blur(20px)`), and glowing violet energy accents (`#7048E8`).

---

## 2. Mandatory Pre-Commit Checklist for AI Agents

Before declaring any task or file modification complete:
- [ ] Is the codebase 100% free of TypeScript errors (`npx tsc --noEmit` passes with 0 errors)?
- [ ] Does the project build cleanly (`npm run build` succeeds)?
- [ ] Is the feature modularized into single-responsibility sub-components instead of a monolithic file?
- [ ] Does the new/modified file sit in its exact location per `docs/07_FOLDER_STRUCTURE.md`?
- [ ] Are all exports cleanly exposed via feature barrel `index.ts` files?
- [ ] Are all abstract interfaces decoupled from low-level implementations?
