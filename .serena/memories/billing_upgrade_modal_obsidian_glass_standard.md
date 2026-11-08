# CELAEST Billing Upgrade Modal: Obsidian Glass Standard (Modelo 04)

## Architecture & Visual Implementation
1. **Model Selection**: Integrated Modelo 04 (Raycast Obsidian Glassmorphism / Cristal Ahumado Refractivo) directly into `src/features/billing/components/modals/UpgradePlanModal.tsx` and `src/features/billing/components/ui/PlanCard.tsx`.
2. **Glassmorphic Physical Lighting**:
   - Highlight (Pro Card): `bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-black/80 border border-white/25 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.35),inset_0_-1px_1px_0_rgba(0,0,0,0.8),0_24px_64px_-16px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-3xl`.
   - Standard Cards: `bg-gradient-to-b from-white/[0.03] to-black/60 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.7)] hover:border-white/18 backdrop-blur-3xl`.
3. **Engraved Metric Bays**:
   - 3-column infrastructure metrics (Sol. IA, Asientos, Storage) embedded in a recessed etched capsule: `p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]`.
4. **Zero-Slop Enforcement**:
   - Eradicated old neon orbs (`bg-cyan-500/20`, `bg-purple-500/15`) and colored borders (`border-purple-500`, `border-[#8B5CF6]`).
   - Pure obsidian `#09090C` chassis with Tokyo corner accents.
   - Guaranteed full business logic preservation: Stripe checkout redirect, `useBilling`, geo-currency localization, and RBAC restrictions.