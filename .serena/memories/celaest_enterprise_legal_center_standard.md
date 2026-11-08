# CELAEST Enterprise Legal Center & AI Data Sovereignty Architecture Standard

## 1. Architectural Overview & Routes
- Master Layout: `src/app/[locale]/legal/layout.tsx` (embeds `<Header />`, dark mesh background, `<LegalTabs />`, and `<Footer />`).
- Routes Implemented:
  - `/legal/terms`: Master B2B Terms of Service (8 complete sections).
  - `/legal/privacy`: Data Privacy & AI Mesh Sovereignty Policy (6 complete sections).
  - `/legal/license`: Digital Asset License Agreement (EULA) for Macros & Python scripts (4 complete sections).
  - `/legal/cookies`: Cookie Policy & Technology Transparency (3 complete sections).
  - `/legal`: Auto-redirects to `/legal/terms`.

## 2. Key Legal & Technical Principles (Zero-Filler)
- **AI-Mesh Three-Tier Processing Model**:
  - Cloud Mesh Mode (Starter & Pro): Inferences routed via commercial B2B APIs with binding Zero-Training agreements.
  - BYOK Mode: Client connects direct API credentials.
  - On-Premise / Sovereign Mode (Enterprise): Models executed 100% inside client private perimeter without internet egress.
- **Output Ownership**: Client is 100% exclusive owner of intellectual property on prompts (inputs) and generated code/workflows (outputs).
- **Marketplace EULA**: Commercial perpetual non-exclusive license for internal use. Strict anti-piracy prohibitions against public reposting or reselling.
- **Liability Caps**: Direct exclusion of consequential/indirect damages and aggregate liability strictly capped to last 12 months fees paid.
- **Money-Back Guarantee**: 30-day unconditional refund policy codified in billing terms.
- **GDPR / CCPA / ARCO**: Direct compliance channel via `privacy@celaest.com` with 15-day response timeline.

## 3. UI/UX Standard
- Executive Callouts (`LegalCallout`): Human-readable summaries ("En resumen / In short") preceding dense sections.
- Sticky Table of Contents (`LegalSidebarToc`): Scrollable anchor navigation with compliance contact box.
- Interactive Tabs (`LegalTabs`): Fast glassmorphic switching between documents with active purple aura.
- Print/PDF export: Triggered via `window.print()` in `LegalHeader`.
- 100% Bilingual in `messages/es.json` and `messages/en.json`.
- SEO Sitemap: 4 legal routes indexed with bidirectional hreflang tags in `src/app/sitemap.ts`.
