# 08. CODING STANDARDS: SOLID, DRY, Security & Clean Code Governance

> **Enforcement Level**: Absolute & Permanent  

---

## 1. SOLID & Clean Code Rules

1. **Screaming Separation**: Never mix UI logic, state orchestration, domain entities, or API drivers in a single file. Respect the 4-layer structure in `07_FOLDER_STRUCTURE.md`.
2. **SOLID Principles**:
   - **SRP**: Single Responsibility per module/file/component.
   - **OCP**: Extend behavior via variants, slots, and strategy patterns, not by editing core logic.
   - **LSP**: All repository and gateway implementations must be 100% interchangeable with their interfaces.
   - **ISP**: Small, focused TypeScript interfaces (`IUserDNA`, `IAudioSettings`).
   - **DIP**: High-level feature modules depend on abstract interfaces (`/domain/repositories/`), not concrete HTTP/storage clients.
3. **DRY (Don't Repeat Yourself)**: Zero duplicate logic or raw CSS rules. If a utility function, color token, or component structure is used twice, extract it immediately to its canonical home in `shared/` or `components/ui/`.

---

## 2. Security Coding Standards

1. **Zero Unsanitized HTML**: Never render AI output or user input directly using `dangerouslySetInnerHTML`. Always pass content through `SanitizerService` (`DOMPurify`).
2. **Audio Blob Lifecycle**: Always revoke audio object URLs (`URL.revokeObjectURL(url)`) upon component unmount to prevent memory leaks and unencrypted media retention.
3. **Local Encryption Vault**: All local persistence of Learning DNA, session transcripts, or voice scores MUST use `ISecureVault` (AES-GCM 256-bit encryption).
4. **Token Security**: Authentication tokens are kept exclusively in memory or ephemeral vaults; never stored unencrypted in plain `localStorage`.

---

## 3. Design Pattern Enforcement

- **Use Repositories** for all data access (`MemoryRepository`, `DnaRepository`).
- **Use Strategies** for dynamic teaching algorithms (`AiTeachingStrategy`).
- **Use Observers** for 60fps Web Audio frequency streaming without triggering React re-renders.
- **Use Adapters** for speech recognition and WebRTC connections (`SpeechToTextAdapter`).
