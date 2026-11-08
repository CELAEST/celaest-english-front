# Lingua — Celaest English Front

AI-powered English mentor for interview practice, reading, writing and memory training.
Built with **React 18**, **TypeScript (strict)**, **Vite 5** and **TailwindCSS 3**.

## Getting Started

```bash
npm install
cp .env.example .env.local   # adjust backend URLs if needed
npm run dev                  # http://localhost:3001
```

## Scripts

| Script                 | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the Vite dev server (port 3001)          |
| `npm run build`        | Type-check + production build to `dist/`       |
| `npm run preview`      | Preview the production build                   |
| `npm test`             | Run unit tests once (Vitest + Testing Library) |
| `npm run test:watch`   | Run tests in watch mode                        |
| `npm run lint`         | ESLint with zero-tolerance warnings policy     |
| `npm run lint:fix`     | Auto-fix lint issues                           |
| `npm run format`       | Format the repo with Prettier                  |
| `npm run format:check` | Verify formatting without writing              |
| `npm run typecheck`    | `tsc --noEmit`                                 |

## Architecture

Screaming-architecture / hexagonal layout. Dependencies point inward only:

```
src/
├── domain/          # Pure entities & repository interfaces (zero framework imports)
├── application/     # Ports (ISecureVault) — use-cases land here
├── infrastructure/  # HTTP client, repositories, vault, realtime socket, sanitizer
├── features/        # Vertical slices: components/, hooks/, services/, index.ts barrel
│   ├── conversation/  onboarding/  reading/  writing/  memory/  settings/  workspace/  lab/
├── design-system/   # Reusable primitives (Button, Card, AppModal, Orb, Waveform...)
├── routes/          # Route table + lazy-loaded route elements
└── shared/          # env config, logger, queryKeys, cn(), ErrorBoundary
```

Rules of thumb:

- **Domain never imports React or infrastructure.**
- Features consume infrastructure through hooks/services; UI components never
  instantiate repositories directly.
- Cross-feature imports go through the feature's public barrel (`index.ts`).

## Environment Variables

All external service URLs are centralized in `src/shared/constants/env.ts` and fed by:

```ini
VITE_API_URL=http://localhost:8080/api/v1        # backend REST API
VITE_CORE_AI_URL=http://127.0.0.1:8085/api/v1    # IA-Mesh (chat eval + transcription)
```

Never hardcode URLs in feature code — import `{ ENV }` instead.

## Conventions

- **Logging:** use `logger` from `@shared/utils/logger`. Raw `console.*` is banned by
  lint; `debug/info` are silenced in production automatically.
- **Server state:** TanStack Query via the hierarchical factory in
  `shared/constants/queryKeys.ts`. No fetch-in-useEffect.
- **Class merging:** `cn()` (clsx + tailwind-merge) for all conditional classes.
- **Styling:** Tailwind utility classes; design tokens live in `tailwind.config.js`.

## Testing

Vitest with jsdom and Testing Library. Tests live next to their subject in a
`__tests__/` folder:

```bash
npm test
```

Coverage priorities: domain logic, services (crypto, HTTP, sanitization,
evaluation engines) and design-system behavior.

## Security Model

- **CSP** is injected at build time by a Vite plugin (`vite.config.ts`);
  production builds ship `script-src 'self'`. `connect-src` derives from the
  configured API origins so it can never drift.
- **Provider API keys (BYOK)** are stored encrypted in localStorage via
  AES-GCM-256 (WebCrypto) with a per-install random key material — see
  `infrastructure/adapters/storage/EncryptedLocalStorageVault.ts`. The vault
  never degrades to plaintext: encryption failures throw, tampered payloads are
  rejected.
- **All AI/user HTML** passes through DOMPurify (`SanitizerService`) before render;
  React escaping plus CSP provide defense in depth.
- Note: client-side storage encryption is defense in depth, not XSS immunity —
  keep the CSP strict and avoid introducing `dangerouslySetInnerHTML`.
