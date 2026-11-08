# Master Contract: CELAEST SaaS Asset Lifecycle & SSO Handoff Standard (Hub & Spoke)

## 1. Domain & Environment Parity Contract
- **Local Dev**:
  - Lingua Frontend: `http://localhost:5173`
  - Dashboard Shell: `http://localhost:3000/?tab=marketplace` and `http://localhost:3000/?tab=assets`
  - Auth & Marketplace Backend (`celaest-back`): `http://127.0.0.1:3101` or `http://localhost:8080`
  - English AI Backend (`celaest-english-back`): `http://localhost:8080`
- **Production**:
  - Environment variable `VITE_MARKETPLACE_URL` or fallback to configured dashboard production domain.
  - No hardcoded `app.celaest.com/dashboard/marketplace` (which produces DNS NXDOMAIN).

## 2. Asset Creation Contract (Admin Portal)
- Asset Type: `saas` ("SaaS / Web App").
- Binary File Uploader: Not required for `saas`. Shows informational banner explaining SSO connection.
- Canonical Slug: `lingua` (with 1-click preset).
- External URL: Configurable with quick buttons for Local (`http://localhost:5173`) and Production (`https://lingua.celaest.com`).
- Backend (`celaest-back`): `ProductType = "saas"` and `DisplayType = "saas"` mapped cleanly in `CreateProduct` and `UpdateProduct`.

## 3. Marketplace & "Mis Activos" SSO Handoff Contract
- `isSaasProduct`: Checks `product_type === "saas" || product.slug === "lingua" || /^https?:\/\//.test(external_url)`.
- `launchSaasProduct`: Appends `/auth/callback#access_token=<token>&refresh_token=<refresh_token>` and opens in a new tab.
- Both `ProductCardCompact` and `ProductActionsSection` use `launchSaasProduct` for authenticated one-click launch from Marketplace and "Mis Activos".

## 4. Entitlement Verification Contract
- `celaest-back`: `GET /api/v1/user/my/entitlements/:slug`
- Returns: `{ has_access: boolean, access_type: string, expires_at?: string, product: { slug, name, base_price, is_purchased } }`.
- `celaest-english-front`: Base 01 is free trial; Base 02+ requires active entitlement or triggers `LinguaMarketplacePaywallModal`.
