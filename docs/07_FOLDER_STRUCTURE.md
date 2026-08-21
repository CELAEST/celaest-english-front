# 07. FOLDER STRUCTURE: Screaming Layered Folder Specification

> **Rule**: Strict separation of concerns. Nothing is mixed. Everything in its explicit, single-responsibility location.

---

```
src/
├── domain/                               # 1. CORE DOMAIN LAYER (Zero external framework dependencies)
│   ├── entities/                         # Pure business objects (UserDna, MemoryCard, AudioSession)
│   ├── value-objects/                    # Immutable values (ProficiencyLevel, PhoneticString, ToneScore)
│   ├── events/                           # Domain Events (OnboardingCompleted, MistakeIdentified)
│   └── repositories/                     # Abstract Repository Interfaces (IMemoryRepository, IDnaRepository)
│
├── application/                          # 2. APPLICATION USE CASES LAYER (Workflow orchestration)
│   ├── use-cases/
│   │   ├── conversation/                 # ProcessVoiceStreamUseCase.ts, StartSessionUseCase.ts
│   │   ├── memory/                       # ReviewMemoryCardUseCase.ts, SyncMistakesUseCase.ts
│   │   ├── reading/                      # ProcessInlineWordLookupUseCase.ts
│   │   └── writing/                      # EvaluateTextToneUseCase.ts
│   └── ports/                            # Primary & Secondary Ports / Service Interfaces
│       ├── IAiVoiceGateway.ts
│       └── ISecureVault.ts
│
├── infrastructure/                       # 3. INFRASTRUCTURE LAYER (Technical implementations & drivers)
│   ├── adapters/                         # Adapters implementing application ports
│   │   ├── web-audio/                    # WebAudioDriver.ts, AudioWorkletProcessor.ts
│   │   ├── gateways/                     # WebSocketAiGateway.ts, WebRtcVoiceGateway.ts
│   │   └── storage/                      # EncryptedLocalStorageVault.ts, IndexedDbRepository.ts
│   ├── security/                         # Encryption, Token Refresh, Sanitization Services
│   │   ├── SanitizerService.ts           # DOMPurify XSS Sanitizer for AI output
│   │   └── TokenVault.ts                 # Secure ephemeral token storage
│   └── http/                             # HttpClient.ts, Interceptors.ts
│
├── features/                             # 4. SCREAMING DOMAIN FEATURES (Visible immediately at src/)
│   ├── onboarding/                       # OnboardingView, DnaSummaryStep
│   ├── workspace/                        # WorkspaceDashboardView, JourneyTimeline
│   ├── conversation/                     # ConversationView, AudioControlBar
│   ├── memory/                           # MemoryBankView, FlipCardDeck
│   ├── knowledge-graph/                  # SkillGraphView, NodeInspector
│   ├── reading/                          # ReadingStudioView, WordDefinitionPopover
│   ├── writing/                          # WritingLabView, RealtimeProofreaderPanel
│   └── settings/                         # SettingsView, SecurityPrivacyPanel
│
├── design-system/                        # 5. ATOMIC DESIGN SYSTEM (Reusable UI)
│   ├── tokens/                           # CSS Variables, Color Tokens, Spacing Scale
│   ├── components/                       # Button, Card, Orb, Waveform, Badge, Modal, Input
│   └── layout/                           # Sidebar, Header, InspectorPanel
│
├── shared/                               # 6. SHARED UTILITIES & CONTRACTS
│   ├── constants/                        # Global immutable constants
│   ├── types/                            # Cross-layer utility types
│   └── utils/                            # Pure helper functions (formatters, cn merger)
│
└── main.tsx                              # Application Root Bootstrapper & DI Wiring
```
