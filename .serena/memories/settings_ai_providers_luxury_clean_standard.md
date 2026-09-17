# CELAEST Settings Standard: AI Providers Quiet Rows & Learning Zero-Empty-Fields

## 1. AI Providers Closed Row Architecture (Unified with Learning & Personal)
- **Container**: Providers are contained within a single `<div className="divide-y divide-white/[0.06]">`, identical to `SettingsLearningSection` and `SettingsPersonalSection`.
- **Closed Row Layout**:
  - Replaces card-like borders and separated rectangular blocks.
  - Matches `SettingsListItem` ergonomics: `w-full flex items-center justify-between py-3.5 sm:py-4 hover:bg-white/[0.02] transition-colors duration-300 cursor-pointer group text-left`.
  - **Left**: `ProviderMark` icon (`md` size), title (`text-[13px] sm:text-sm font-medium text-zinc-100`), subtitle (`text-[11px] sm:text-xs text-zinc-500 font-light`).
  - **Right**: Value summary (`text-xs sm:text-sm text-zinc-400 font-light`) showing configured keys (`1 Clave`, `Sin configurar`) + floating typography badges (`Recomendado · Gratis`, `Activo`) + chevron `>` (`w-4 h-4 text-zinc-500 strokeWidth={1.8}`) that rotates 90° smoothly on expand.
- **Expanded Luxury Interior**:
  - The accordion opens smoothly into `pb-5 pt-1 px-1 flex flex-col gap-5 animate-[fadeSlideUp_0.2s_ease-out]`.
  - Maintains obsidian crystal card styling, real-time live connection validation before adding keys, per-key latency testing, key copying/deleting, model selection pills, and multi-key quota auto-rotation.

## 2. Learning Parameters: Zero-Empty-Fields Guarantee
- **Frontend Fallbacks & Nullish Coalescing Trap**:
  - `"" ?? "—"` evaluates to `""`, resulting in invisible spans and empty gaps next to the chevron.
  - Resolved with `?.trim() || default` across all fields in `SettingsLearningSection.tsx`:
    - `goalValue = learningGoals?.trim() || "Daily Conversation"`
    - `levelValue = currentLevel?.trim() || "B1 — Intermediate"`
    - `prefValue = preferenceStyle?.trim() || "Conversation First"`
    - `focusValue = dailyFocus?.trim() || "Clarity & Vocabulary"`
  - Universal safety in `SettingsListItem.tsx`: `{value || "—"}` ensures no row can ever render an empty string.
- **Backend Auto-Healing & Database Persistence**:
  - In `internal/settings/repository.go`: `GetByUserID` auto-detects empty fields for `cefr_level`, `learning_goal`, `preference_style`, and `daily_focus`. If empty, it populates them with calibrated pedagogical defaults and immediately persists the fix via `UPDATE users` in PostgreSQL.
  - In `UpdateSettings`: Sanitizes inputs to prevent empty strings from overwriting valid learning parameters while strictly respecting the multi-domain rule (`profession = ""` for uncalibrated roles).
