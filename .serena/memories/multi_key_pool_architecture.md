# Multi-Key Pool Architecture (CELAEST Client AI Gateway)

## Features & Contract
1. **ProviderKeyVault Multi-Key Storage**:
   - Stores multiple API keys per provider encrypted at rest with AES-GCM 256-bit (`apiKeys: string[]`).
   - Supports `getKeys`, `saveKeys`, `addKey`, `removeKeyAtIndex`.
   - Backward-compatible with single-key consumers (`getKey(providerId)` returns primary key).
2. **Key Pool Auto-Failover (directClientAiService)**:
   - When a provider request encounters rate limits (429, OTPM exceeded, quota error), `directClientAiService` automatically cascades to `keyIndex + 1` in the provider's pool before attempting model or provider failovers.
3. **Clean Settings UI**:
   - No internal backend "Core" toggle cluttering client settings.
   - Groq permanently highlighted as Recommended & 100% Free.
   - Direct links to official vendor consoles (Groq, Gemini, OpenAI, Claude, xAI, etc.).
   - Responsive layout prioritizes AI Providers on all screen sizes.