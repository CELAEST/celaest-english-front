# 06. ARCHITECTURE: Screaming Architecture, SOLID & Design Patterns

> **Architecture Standard**: Clean Screaming Architecture (Domain-Driven Design)  
> **Core Pillars**: SOLID Principles, Design Patterns, Zero Coupling, Maximum Scalability

---

## 1. Screaming Architecture (Domain-Driven Layering)

The folder and code structure must **scream** the domain purpose: _AI-Driven Adaptive Language Learning & Mastery_.

We enforce a strict 4-layer unidirectional dependency rule:
`Presentation Layer -> Application Use Cases -> Domain Layer <- Infrastructure Adapters`

```
+-----------------------------------------------------------------------------------+
|                                 PRESENTATION LAYER                                |
|  UI Components, Layouts, Views, Feature Hooks, Design System Tokens & Specs      |
+-----------------------------------------------------------------------------------+
                                         | (depends on)
                                         v
+-----------------------------------------------------------------------------------+
|                               APPLICATION USE CASES                               |
|  Orchestrates application workflows (e.g., ProcessVoiceSessionUseCase,            |
|  EvaluateWritingSubmissionUseCase, SyncMemoryBankUseCase)                         |
+-----------------------------------------------------------------------------------+
                                         | (depends on)
                                         v
+-----------------------------------------------------------------------------------+
|                                   DOMAIN LAYER                                    |
|  Core entities, Value Objects, Domain Events, Repository Interfaces               |
|  (e.g., UserLearningDna, MemoryCard, ConversationSession, AudioWaveformFrame)     |
+-----------------------------------------------------------------------------------+
                                         ^ (implements interfaces)
                                         |
+-----------------------------------------------------------------------------------+
|                               INFRASTRUCTURE ADAPTERS                             |
|  Web API Clients, WebRTC/WebSocket Voice Gateway, LocalStorage Encrypted Vault,   |
|  Web Audio Worklet Audio Hardware Driver                                          |
+-----------------------------------------------------------------------------------+
```

---

## 2. SOLID Principles Matrix

### 2.1 Single Responsibility Principle (SRP)

- Each module, file, class, and component has **ONE and ONLY ONE** reason to change.
- _Example_: A component `<AiMentorOrb />` handles rendering its glowing 3D/canvas state. It does NOT handle audio stream chunking or API network retries; those belong to `useAudioRecorder` and `AiVoiceGateway`.

### 2.2 Open/Closed Principle (OCP)

- Software entities are **open for extension, but closed for modification**.
- _Example_: Design system components take variant tokens and slots. Adding a new memory card type (e.g. `GrammarCard`, `VocabularyCard`, `PhoneticCard`) extends the `BaseMemoryCard` polymorphism without altering core flip-card rendering logic.

### 2.3 Liskov Substitution Principle (LSP)

- Derived types or adapters must be completely replaceable for their base interfaces without breaking functionality.
- _Example_: `MockAiVoiceGateway` and `WebRtcAiVoiceGateway` both implement `IAiVoiceGateway`. Switching between local mock and live backend requires zero UI code changes.

### 2.4 Interface Segregation Principle (ISP)

- Clients must not be forced to depend on interfaces they do not use.
- _Example_: Instead of a massive `IUserSession` object, components receive fine-grained slice interfaces: `IUserDNA`, `IAudioSettings`, `IProgressStats`.

### 2.5 Dependency Inversion Principle (DIP)

- High-level modules do not depend on low-level implementation details. Both depend on abstract contracts (`interfaces/`).
- _Example_: Features depend on `IMemoryRepository` abstract interface, not direct `window.localStorage` calls or `axios` instances.

---

## 3. Design Patterns Blueprint

| Design Pattern         | Application in Lingua                                                              | Purpose / Rationale                                                                                                                           |
| :--------------------- | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Repository Pattern** | `MemoryRepository`, `DnaProfileRepository`                                         | Decouples data storage (IndexedDB / Local Storage / Cloud API) from business logic.                                                           |
| **Strategy Pattern**   | `AiTeachingStrategy` (`ConversationFirst`, `GrammarFocused`, `PronunciationDrill`) | Dynamically swaps AI feedback processing algorithm based on user's Learning DNA.                                                              |
| **Observer / PubSub**  | `AudioFrequencyObserver`                                                           | Broadcasts real-time Web Audio API frequency arrays to Orb canvas and waveform components at 60fps without triggering React state re-renders. |
| **Adapter Pattern**    | `SpeechToTextAdapter`                                                              | Normalizes browser Web Speech API / OpenAI Whisper API into a unified `VoiceFrame` domain entity.                                             |
| **Factory Pattern**    | `MemoryCardFactory`                                                                | Generates specialized card domain entities (`GrammarCard`, `ToneCard`, `VocabularyCard`) based on raw AI streaming JSON responses.            |
| **Command Pattern**    | `CommandPaletteManager`                                                            | Encapsulates user actions (`Cmd+K` commands) into invokable command objects with full undo/redo state support.                                |
| **Mediator Pattern**   | `AiSessionMediator`                                                                | Coordinates state transitions between Audio Input -> AI WebSocket -> Waveform Visualizer -> Mentor Orb.                                       |

---

## 4. Performance & Audio Thread Isolation

To guarantee zero UI thread lag:

1. **Audio Drivers**: Run inside dedicated `AudioWorkletGlobalScope` threads.
2. **Heavy Calculations**: Web Audio FFT (Fast Fourier Transform) runs off-main-thread.
3. **DOM Render Locks**: Waveform and Orb canvas use `requestAnimationFrame` with direct WebGL/Canvas context updates, bypassing React Virtual DOM diffing.
