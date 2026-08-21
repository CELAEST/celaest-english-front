# RFC-002: Feature-First Screaming Clean Architecture

> **Status**: Approved  
> **Author**: Staff Software Engineer & Design System Engineer  
> **Date**: 2026-07-29  

---

## 1. Context & Problem Statement

Traditional frontend projects group code by technical types (`/components`, `/hooks`, `/pages`, `/services`), leading to scattered domain logic ("spaghetti organization"). As the application grows to hundreds of components, finding all logic related to `Memory Bank` or `AI Voice Conversation` becomes difficult.

---

## 2. Decision

We enforce **Feature-First Screaming Architecture** combined with **Domain-Driven Layering**:
- `src/domain/`: Entities, Value Objects, Domain Events, Repositories Interfaces.
- `src/application/`: Workflow Use Cases.
- `src/infrastructure/`: Web Audio Drivers, Storage Vaults, API Gateways.
- `src/presentation/features/`: Feature views (`onboarding`, `workspace`, `conversation`, `memory`, `reading`, `writing`, `settings`).
- `src/presentation/design-system/`: Pure reusable atomic components.

---

## 3. Justification & Rationale

1. **High Cohesion & Low Coupling**: All UI, hooks, and sub-components related to a specific feature live together inside `presentation/features/<feature_name>/`.
2. **Explicit Domain Boundaries**: Domain rules in `src/domain/` have zero dependencies on React or Web APIs, allowing 100% pure unit testing.
3. **Scalability**: New developers or AI agents instantly understand what the app *does* simply by scanning `src/presentation/features/`.
