# SPECIFICATION: Dashboard Workspace

> **Feature**: Main Workspace Hub & Journey Timeline Stream

---

## 1. Entrance & Exit

- **Entrance**: Main landing post-auth or clicking "Workspace" in sidebar.
- **Exit**: Navigation to active session (Conversation, Reading, Writing, Memory).

---

## 2. User Actions & Flow

1. View personalized greeting ("Good afternoon, Esteban").
2. Check "Today's Focus" card (e.g., "Business Meeting - 25 minutes").
3. View AI Mentor active memory note ("Yesterday you hesitated using Present Perfect").
4. Click "Start Conversation ->" or select a topic pill from the suggestion bar.

---

## 3. Scenarios & Edge Cases

- **First-Time User**: Journey timeline shows "Day 1 - Onboarding Completed". Focus card defaults to "First Conversation".
- **Zero Streak**: Streak counter displays ambient flame icon without shaming or aggressive alerts.

---

## 4. UI States Matrix

| State              | UI Representation                                                      |
| :----------------- | :--------------------------------------------------------------------- |
| **Loading**        | Dark glass card skeleton loaders (`var(--surface-1)` pulsing shimmer). |
| **Active / Ready** | Central glowing Orb, active focus card, live timeline step stream.     |
| **Offline Mode**   | Mint badge "100% Local Execution", cloud AI indicators dimmed.         |

---

## 5. Animations & Transitions

- Orb Ambient Breathing: Smooth radial scale (`1.0` -> `1.03` over 3000ms).
- Card Hover: `translateY(-2px)` with subtle border highlight (`rgba(255, 255, 255, 0.15)`).

---

## 6. Data Inputs & Outputs

- **Input**: User Learning DNA, past session history.
- **Output**: Navigation command to selected workspace feature module.
