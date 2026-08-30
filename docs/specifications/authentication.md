# SPECIFICATION: Authentication & BYOK Setup

> **Feature**: Bring Your Own Key (BYOK) & Session Security

---

## 1. Entrance & Exit

- **Entrance**: App launch when unauthenticated or when changing API providers.
- **Exit**: Validation of API Key / Passcode -> Redirect to `/workspace`.

---

## 2. User Actions & Flow

1. User selects AI Provider (OpenAI, Anthropic, DeepSeek, or Local Ollama).
2. User enters API Key or specifies Ollama Endpoint (`http://localhost:11434`).
3. User clicks "Test & Save Key".
4. System validates key via lightweight ping request and encrypts credential into `ISecureVault` (AES-GCM 256-bit).

---

## 3. Scenarios & Edge Cases

- **Invalid API Key**: Red hairline border on input, explicit message: _"Invalid OpenAI API key. Check permissions."_
- **Offline / Local Execution**: If user selects Ollama, system verifies local CORS headers and skips cloud auth.

---

## 4. UI States Matrix

| State          | UI Representation                                                                |
| :------------- | :------------------------------------------------------------------------------- |
| **Empty**      | Dark glass card, provider selector dropdown, hidden key input.                   |
| **Validating** | Violet spinner inside "Test & Save Key" button, inputs disabled.                 |
| **Success**    | Green checkmark badge "Key Encrypted & Verified", instant redirect to Workspace. |
| **Error**      | Soft coral red input border (`#EF4444`), detailed actionable error message.      |

---

## 5. Animations & Transitions

- Key Visibility Toggle: Smooth eye icon state shift.
- Validation Success: Green pulse wave on provider badge.

---

## 6. Data Inputs & Outputs

- **Input**: `{ provider: 'openai' | 'anthropic' | 'deepseek' | 'ollama', apiKey: string }`
- **Output**: AES-GCM encrypted payload saved in browser `ISecureVault`.
