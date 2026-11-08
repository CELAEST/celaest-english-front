# CELAEST Landing - Phase 2 Production Readiness & Decoupling Standard

## Key Architecture & Codebase Contracts

1. **Centralized Domain & URL Configuration**:
   - Módulo: `src/lib/constants.ts`
   - Exports:
     - `SITE_URL`: `(process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://celaest.com").replace(/\/$/, "")`
     - `DASHBOARD_URL`: `(process.env.NEXT_PUBLIC_SAAS_DASHBOARD_URL || "https://celaest-dashboard.vercel.app").replace(/\/$/, "")`
     - `SUPPORT_EMAIL`, `CAREERS_EMAIL`, `PRESS_EMAIL`, `PARTNERS_EMAIL`, `STATUS_URL`
   - All components (`header`, `pricing-section`, `products-view`, `platform-card`, `closing-cta`, `layout`, `robots`, `sitemap`, `structured-data`) import from `@/lib/constants`.
   - Zero hardcoded domains anywhere in the source code. Changing environment variables in host provider immediately configures the entire site.

2. **Lead Funnel & Enterprise CTA**:
   - `pricing-section.tsx`: Enterprise plan button points to `mailto:support@celaest.com?subject=Consulta%20Plan%20Enterprise`.
   - Guaranteed working lead funnel with no dead `#contact` hash.

3. **Zero Dead Links Standard in Footer**:
   - Social links point to active profiles (`https://twitter.com/celaest`, `https://linkedin.com/company/celaest`, `https://github.com/celaest`, `mailto:support@celaest.com`).
   - Links in columns map to semantic section hashes (`#products`, `#pricing`, `#platform`, `#intent-hero`), corporate emails (`support@`, `careers@`, `press@`, `partners@`), or legal paths (`/legal/privacy`, `/legal/terms`).
   - All external URLs carry `target="_blank"` and `rel="noopener noreferrer"`.

4. **Multi-Resolution Physical Favicon**:
   - `public/favicon.ico` generated via Sharp script (`scripts/generate-favicon.js`) containing 16x16, 32x32, and 48x48 PNG frames from `src/app/icon.svg`.
   - Served natively with `image/x-icon` and HTTP 200, preventing 404 hazards from web crawlers, search engines, and legacy browsers.

5. **International SEO & Legal Sitemap**:
   - `src/app/sitemap.ts` generates entries for home, `/legal/privacy`, and `/legal/terms` with full hreflang alternates (`en`, `es`, `x-default`).
   - Validated against Next.js production build: 11/11 static pages generated.
