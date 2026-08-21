# RFC-001: Vite & Modern SPA Toolchain

> **Status**: Approved  
> **Author**: Staff Software Engineer & Frontend Architect  
> **Date**: 2026-07-29  

---

## 1. Context & Problem Statement

Lingua requires instant HMR (Hot Module Replacement), sub-millisecond cold start times, native ES Modules execution during development, and minimal production bundle size for Web Audio and Canvas rendering. 

We need a modern build toolchain that does not overhead the browser thread or block Web Audio Worklet compilation.

---

## 2. Decision

We adopt **Vite** with **React (TypeScript)** as the single page application (SPA) build toolchain.

---

## 3. Justification & Rationale

1. **Native ESM in Development**: Vite uses browser-native ES modules, eliminating expensive bundling steps during development.
2. **Lightning HMR**: State preservation across audio visualizer and orb canvas re-renders.
3. **Web Worker & Audio Worklet Support**: First-class support for `new Worker(new URL('./worker.ts', import.meta.url))` needed for off-main-thread Web Audio API processing.
4. **Optimized Rollup Production Bundling**: Automatic code splitting per feature domain (`features/conversation`, `features/reading`, `features/writing`).

---

## 4. Alternatives Considered

- **Next.js (SSG/SSR)**: Rejected due to unnecessary server-side rendering complexity for a client-heavy, real-time voice and canvas application. Lingua runs client-side with local data encryption.
- **Webpack / CRA**: Rejected due to slow build times and heavy configuration overhead.
