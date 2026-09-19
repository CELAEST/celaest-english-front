# CELAEST Settings Standard: AI Providers Quiet Rows & Anti-Badge Philosophy

## 1. AI Providers Closed Row Architecture (Unified Quiet Row Standard)
- **Container**: Providers are contained within a single `<div className="divide-y divide-white/[0.06]">`, identical to `SettingsLearningSection` and `SettingsPersonalSection`.
- **Zero Pill Badges Policy (Anti-Hardcode & Clutter Prohibition)**:
  - NEVER place noisy colored pill badges, outline tags, or capsule badges (`[● ACTIVO]`, `[GRATIS]`, `[RECOMENDADO]`) next to provider titles.
  - Doing so creates visual noise, breaks the editorial luxury standard of CELAEST, and looks like AI-generated clutter.
- **Unified Typography & Quiet Row Layout**:
  - **Left**: `ProviderMark` icon (`size="md"`), clean provider title (`text-[13px] sm:text-sm font-medium text-zinc-100`), clean subtitle (`text-[11px] sm:text-xs text-zinc-500 font-light truncate max-w-full`).
  - **Secondary Attribute Placement**: "Recomendado" belongs naturally in the subtitle (`Recomendado · Ultra-rápido (~85 ms)`), not in a loud tag next to the title.
  - **Right Value Indicator**: Integrated status inside the right-hand value summary:
    - Active: `<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)] shrink-0" /><span className="text-emerald-400 font-normal">Activo</span><span className="text-white/20">·</span><span className="text-zinc-300">{keys}</span>`
    - Inactive: `<span className="text-zinc-400">{keys}</span>`
    - Chevron `>` (`w-4 h-4 text-zinc-500 strokeWidth={1.8}`) that rotates 90° smoothly on expand (`isExpanded ? "rotate-90 text-zinc-200" : ""`).
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
