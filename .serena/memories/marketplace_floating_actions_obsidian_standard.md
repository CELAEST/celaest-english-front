# CELAEST Marketplace Floating Actions: Obsidian Standard

## Summary
The legacy floating action buttons (`CouponFAB.tsx`) in the marketplace consisted of two disjointed, neon-saturated circular orbs (purple for plans, cyan for coupons) that caused visual clutter, occluded catalog cards, and lacked geometric symmetry.

## Architectural Decision & Solution
1. **Layout & Hierarchy**: Preserved the original vertical stack in the bottom-right corner (`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5`), with **Plans (⚡)** on top and **Coupons (🏷️)** on the bottom.
2. **Collapsed-by-Default (Zero-AI-Slop)**: In idle state, each button collapses into an obsidian circular button (`44px × 44px`, `#0B0B0F/95`, `backdrop-blur-2xl`, `border-white/[0.12]`, diffuse `shadow-[0_12px_36px_rgba(0,0,0,0.8)]`).
3. **100% Mathematical Centering**: Eradicated the conflicting `justify-end` class. Each icon resides inside an exact `w-11 h-11 flex items-center justify-center shrink-0` slot with calibrated `size={18}`, guaranteeing dead-center alignment on both axes with zero edge hugging.
4. **Independent Smooth Expansion (Hover)**: When hovered, each button smoothly expands horizontally towards the left revealing clean typography (`t("view_plans")`, `t("have_coupon")`, or active code details) without layout jumping or jitter.
5. **Obsidian Coupon Popover**: When the coupon button is clicked, an obsidian popover capsule (`#0C0C10/98`, `backdrop-blur-2xl`, `border-white/[0.14]`) opens directly anchored above the vertical stack with full i18n support, real-time code validation, and currency-aware discount badges.
