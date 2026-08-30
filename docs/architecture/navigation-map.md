# NAVIGATION MAP: Route Definitions & Flow Transitions

```
[Splash Screen]
       │
       ▼
[Auth Check] ──(Unauthenticated)──► [Login / BYOK Key Screen]
       │                                       │
  (Authenticated)                        (Key Validated)
       │                                       │
       ├───────(Onboarding Incomplete)─────────► [Onboarding Sequence]
       │                                                │
       ▼                                                ▼
[Dashboard / Workspace] ◄───────────────────────[DNA Summary Blueprint]
       │
       ├──► [Conversation View] ──(Session Ended)──► [AI Session Reflection] ──► [Dashboard]
       │
       ├──► [Reading Studio] ─────(Focus Mode)─────► [Fullscreen Reader] ──────► [Dashboard]
       │
       ├──► [Writing Lab] ───────(Submitted)──────► [AI Tone Feedback] ────────► [Dashboard]
       │
       ├──► [Memory Bank] ───────(Completed)──────► [Mastery Summary] ─────────► [Dashboard]
       │
       ├──► [Knowledge Graph]
       │
       └──► [Settings Panel]
```

## Route Matrix

| Path             | Screen View            | Auth Required | Key State Preserved            |
| :--------------- | :--------------------- | :------------ | :----------------------------- |
| `/`              | Splash / Redirect      | No            | None                           |
| `/auth`          | Authentication & BYOK  | No            | API Provider keys              |
| `/onboarding`    | 4-Step DNA Discovery   | Yes           | Onboarding answers             |
| `/workspace`     | Main Dashboard         | Yes           | Daily focus, journey state     |
| `/conversation`  | AI Mentor Live Session | Yes           | Audio stream, Orb state        |
| `/learn/reading` | Reading Studio         | Yes           | Article scroll, active lookup  |
| `/learn/writing` | Writing Lab            | Yes           | Editor buffer, AI proofreading |
| `/memory`        | Memory Bank            | Yes           | Spaced repetition card queue   |
| `/progress`      | Analytics & Graph      | Yes           | Fluency stats, skill nodes     |
| `/settings`      | Settings & Security    | Yes           | Provider config, local vault   |
