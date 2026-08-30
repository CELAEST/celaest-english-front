# 03. UX PRINCIPLES: Interaction Rules & Experience Laws

> **Philosophy**: Cognitive Calm, Professional Empowerment, Frictionless Flow  
> **Reference Inspiration**: Apple, Linear, Raycast, Arc Browser, Warp, Cursor

---

## 1. Core UX Laws

### 1.1 Law of Cognitive Calm

Users should feel focused, relaxed, and confident—never stressed or overwhelmed.

- **Visual Silence**: 80% dark background space (`#04040A`). Only active context elements are illuminated.
- **No Intrusive Distractions**: No toasts jumping over primary content. Notifications sit ambiently in sidebar indicators or subtle inspector panels.

### 1.2 Law of Adaptive Friction

The interface adapts friction based on the user's confidence and current cognitive load:

- **Low Friction Mode (Conversation)**: One-click voice start, auto-detected speaking pauses, instant floating suggestions.
- **Reflective Friction Mode (Memory & Writing)**: Deliberate "Tap to reveal answer" or "Submit for feedback" triggers that force active recall.

### 1.3 Law of Ambient AI Presence

The AI Mentor is not a standard chat message list. It is an ambient digital entity:

- Represented by a glowing 3D/Canvas Orb (`#7048E8` center glow) that sits centrally during onboarding, conversation, and reading focus.
- Micro-state transitions (`Idle`, `Listening`, `Thinking`, `Speaking`, `Evaluating`) reflect immediate responsiveness without needing text spinners.

---

## 2. Navigation & Keyboard Architecture

### Command Palette & Global Shortcuts

Inspired by Raycast and Linear, the entire platform must be keyboard navigable.

| Shortcut                | Scope              | Action                              |
| :---------------------- | :----------------- | :---------------------------------- |
| `Cmd + K` / `Ctrl + K`  | Global             | Open Universal Command Palette      |
| `Space` (Hold / Toggle) | Live Conversation  | Start / Pause Audio Recording       |
| `Esc`                   | Modal / Focus Mode | Close Overlay / Exit Focus Reader   |
| `Tab` / `Shift + Tab`   | Forms & Cards      | Next / Previous Interactive Element |
| `Cmd + Enter`           | Writing Challenge  | Submit Text for AI Feedback         |
| `1` - `9`               | Navigation Sidebar | Switch Feature Workspaces           |

---

## 3. Feedback Loops & Error State Experience

### 3.1 Non-Punitive Learning Feedback

When the user makes a grammar or pronunciation error:

- **Never mark in harsh red (`#FF0000`)**.
- Use soft coral red (`#EF4444`) with a soft underline to draw attention gently.
- Pair every highlighted mistake with an instant alternative suggestion in mint green (`#10B981`) or lavender (`#B89CFF`).

### 3.2 Streaming Latency Experience

During real-time AI processing:

- Display audio waveform pulses and pulsing aura rings on the Orb.
- Text feedback streams in line-by-line using smooth character opacity fade-in, avoiding jerky layout shifts.
