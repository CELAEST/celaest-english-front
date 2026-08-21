# RFC-003: TanStack Query (React Query) for Server & AI State Hydration

> **Status**: Approved  
> **Author**: Staff Software Engineer & Frontend Architect  
> **Date**: 2026-07-29  

---

## 1. Context & Problem Statement

Lingua handles complex asynchronous data fetching (AI stream tokens, spaced-repetition card sets, analytics graphs) and local cached state. Mixing async server state with client UI state in global Redux/Zustand stores creates memory bloat and stale cache issues.

---

## 2. Decision

We use **TanStack Query (React Query v5)** for all asynchronous state, API fetching, and caching, while reserving **Zustand** strictly for synchronous UI state (sidebar collapsed, active theme, active modal).

---

## 3. Justification & Rationale

1. **Automatic Caching & Stale-While-Revalidate**: Instant loading when returning to Memory Bank or Knowledge Graph views.
2. **Optimistic Updates**: Immediate UI feedback when marking memory cards as "Mastered" or updating user preferences.
3. **Decoupled Fetching Logic**: Custom query hooks (`useMemoryCardsQuery`, `useDnaProfileQuery`) encapsulate caching keys and garbage collection rules.
