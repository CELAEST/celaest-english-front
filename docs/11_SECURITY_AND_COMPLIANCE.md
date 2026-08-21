# 11. SECURITY AND COMPLIANCE: Enterprise Security & Data Vault Architecture

> **Security Mandate**: Zero Trust Client Architecture  
> **Target Standards**: OWASP Client Security, WebRTC/WSS Encryption, Local Vault AES-GCM  

---

## 1. Threat Model & Defense Matrix

| Threat Vector | Potential Vulnerability | Mitigation Strategy in Lingua |
| :--- | :--- | :--- |
| **XSS via AI Output** | Malicious script payload injected in AI streaming response. | Strict HTML/Markdown AST sanitization using `DOMPurify` before rendering any markdown/HTML in reading or conversation views. |
| **Audio Stream Eavesdropping** | Interception of real-time microphone stream. | Encrypted WebRTC (DTLS-SRTP) / Secure WebSockets (`wss://`) with ephemeral JWT tokens. |
| **Local Data Tampering** | Theft or tampering of user Learning DNA & memory cards stored locally. | Client-side AES-GCM 256-bit encryption for sensitive local storage (`EncryptedLocalStorageVault`). |
| **CSRF & Token Theft** | Unauthorized session hijacking. | Storage of authentication tokens in memory/ephemeral vault with HTTP-only SameSite=Strict cookies for backend communication. |
| **Prompt Injection in Writing** | User text input attempting to hijack AI mentor instructions. | Strict separation of System Prompt instructions from User Input buffers using structured JSON schemas. |

---

## 2. Secure Local Storage Vault (AES-GCM 256-bit)

User Learning DNA and session audio transcripts are classified as **Private User Data**. 

When stored client-side (IndexedDB / LocalStorage):
```typescript
// Infrastructure Security Interface
export interface ISecureVault {
  encryptAndStore<T>(key: string, data: T): Promise<void>;
  decryptAndRetrieve<T>(key: string): Promise<T | null>;
  clearVault(): Promise<void>;
}
```
- Uses Web Crypto API (`window.crypto.subtle.encrypt`).
- Derives key via PBKDF2 with unique salt per browser session.

---

## 3. Content Security Policy (CSP) Guidelines

The application must run under strict CSP headers:

```http
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'wasm-unsafe-eval'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  connect-src 'self' wss://api.lingua.celaest.com https://api.lingua.celaest.com; 
  media-src 'self' blob:; 
  img-src 'self' data: blob:; 
  object-src 'none'; 
  frame-ancestors 'none';
```

---

## 4. Input & Output Sanitization Pipeline

```
[Raw AI Stream / User Input]
             |
             v
 [SanitizerService (DOMPurify / AST Filter)]
             |
             v
 [Clean Safe React Virtual DOM Node]
```

- **Rule**: NEVER use `dangerouslySetInnerHTML` without explicit `SanitizerService.sanitize()` execution.
- **Rule**: All Web Audio API Blob URLs created via `URL.createObjectURL()` MUST be revoked immediately after playback using `URL.revokeObjectURL()` to prevent memory leaks and unauthorized media persistence.
