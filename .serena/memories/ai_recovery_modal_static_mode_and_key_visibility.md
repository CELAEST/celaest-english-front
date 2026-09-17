# Memory: AI Recovery Modal Static Mode, Key Visibility & Anti-Double-Speech Protocol

## 1. AI Recovery Modal (AiInfrastructureRecoveryModal) Static Mode Standard
- **Zero Auto-Resume / Zero Countdown Loop**: In `AiInfrastructureRecoveryModal`, countdown timers (`setInterval`) that automatically invoke `onImmediateResume` at 0s have been eliminated. In production, if an upstream API is experiencing a burst rate-limit or downtime, automatically retrying after 12-14 seconds causes an infinite modal flicker/reset loop.
- **Persistent User Control**: The recovery modal remains open until the user explicitly takes action:
  1. Closes via backdrop or X button.
  2. Pastes and activates a valid BYOK API key (tested in real time).
  3. Manually clicks "Reanudar Ahora".
- **Key Visibility Toggle**: The modal API key input includes an Eye/EyeOff toggle to unmask input so users can verify their pasted keys without missing characters.
- **Dial 2 Display**: Displays "PROVEEDOR IA / BYOK Directo / Pega tu clave para continuar sin esperas".

## 2. Settings Provider Catalog & Direct Key Inspection
- **Backend Catalog Sync**: Added `groq` to `providerCatalog` in Go backend (`celaest-english-back/internal/settings/handler.go`) with modern models (`qwen/qwen3.8-27b`, `openai/gpt-oss-20b`, `openai/gpt-oss-120b`).
- **Resilient Merge Strategy (`useAiProviders.ts`)**: `LOCAL_PROVIDER_CATALOG` is the base catalog for merging remote backend responses. Even if the remote backend catalog is lagging or missing Groq, Groq is guaranteed to be present as the recommended top option in Settings.
- **Key Inspection in Vault (`SettingsAiProvidersSection.tsx`)**:
  - Expanding a provider automatically loads the decrypted key from `providerKeyVault.getKey(providerId)`.
  - The Eye button (`handleToggleShowKey`) toggles `type="text"` and `type="password"`, allowing users to inspect their stored keys.
  - Added a clean deletion button (`handleRemoveKey`) allowing users to remove any stored key.

## 3. Double-Speech & Voice Swap Eradication (`SpeechSynthesisService.ts`)
- **Root Cause**: Calling `this.currentAudio.src = ""` and `load()` in `stop()` without first detaching event listeners fired `audio.onerror`, which in turn invoked `speakFallback()` using the robotic OS voice (`window.speechSynthesis`). Interrupted `audio.play()` calls also threw `AbortError`, triggering `speakFallback()` while a new neural audio was simultaneously playing.
- **Solution**:
  1. `stop()` detaches all event handlers (`onplay = null`, `onended = null`, `onerror = null`, `onpause = null`) before clearing `src`.
  2. Atomic generation token (`activePlaybackId`): Every `speak()` call increments the counter; callbacks check `if (this.activePlaybackId !== playbackId) return;`.
  3. `catch (err)` specifically checks `if (err?.name === "AbortError") return;` so standard playback cancellations never trigger OS robotic fallbacks.
