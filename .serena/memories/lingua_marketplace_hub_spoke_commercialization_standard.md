# CELAEST Lingua Marketplace Commercialization & Hub-and-Spoke Architecture Standard

## 1. Unified Identity & Entitlement Resolution (`celaest-back`)
- **Catalog Exposure**: `MarketplaceProduct` (`internal/marketplace/model.go` & `repository.go`) exposes `product_type` and `external_url`.
- **Idempotent Seed**: `PostgresRepository.EnsureLinguaProduct` (`internal/products/repository_schema.go`) ensures the `lingua` SaaS product (`product_type = 'saas'`, `min_plan_tier = 1`, `base_price = 29.99`) exists in `products`.
- **Entitlement Endpoint**: `GET /api/v1/user/my/entitlements/:slug` (`internal/products/service_assets.go` -> `GetProductEntitlement`) resolves access without requiring a binary release row in `product_releases`:
  1. Direct purchase in `customer_assets` (`access_type = "purchase"`).
  2. Active plan subscription (`GetPlanGrantedAsset` where `sp.tier >= p.min_plan_tier`, `access_type = "subscription"`).
  3. Organization owner/member bypass (`access_type = "owner"`).
  4. Unentitled users receive `200 OK` with `has_access: false, access_type: "none"` plus full catalog pricing metadata (`product_id`, `base_price`, `currency`) so the client paywall can initiate Stripe Checkout directly via `POST /api/v1/user/marketplace/checkout`.

## 2. SaaS Launcher & SSO Handoff (`celaest-dashboard`)
- `src/features/marketplace/utils/saasLauncher.ts` identifies SaaS products (`isSaasProduct`) and builds SSO handoff URLs (`${externalUrl}/auth/callback#access_token=...&refresh_token=...`).
- `ProductModalSidebar.tsx` and `ProductCardCompact.tsx` render **"Abrir Aplicación ↗"** / **"Abrir App"** instead of binary download buttons for SaaS products.

## 3. Freemium Base 01 Trial Hook, Smart AI Bypass & Paywall (`celaest-english-front`)
- `useLinguaEntitlement.ts` queries `GET /user/my/entitlements/lingua`, verifies `?session_id=` upon Stripe Checkout return, and gates Pathway nodes (`canAccessNode(idx)` allows `idx === 0` Base 01 free trial and requires `hasAccess` for `idx > 0`).
- When `hasAccess && aiCloudIncluded` is true, `useOnboardingFlow.ts` and `useLinguaEntitlement.ts` automatically enable `providerKeyVault.setCentralCoreEnabled(true)` and bypass the manual API-Key step in onboarding.
- `LinguaMarketplacePaywallModal.tsx` renders an Obsidian Glass paywall modal with direct Stripe Checkout (`startDirectCheckout`) and Marketplace link.

## 4. Zero-Trust Backend Verification (`celaest-english-back`)
- `internal/middleware/entitlement.go` (`EntitlementVerifier`) validates user entitlements against `celaest-back` with an in-memory TTL cache (`5m` default) and sets `c.Locals("product_entitlement")` and `c.Locals("ai_cloud_included")`.
