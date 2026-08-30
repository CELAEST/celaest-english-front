# SPECIFICATION: Memory Bank & Spaced Repetition

> **Feature**: 3D Flip-Card Deck ("Turn Mistakes into Mastery")

---

## 1. Entrance & Exit

- **Entrance**: Clicking "Memory" in sidebar.
- **Exit**: Card review completed -> Summary screen -> Workspace.

---

## 2. User Actions & Flow

1. View queue of memory cards marked `To Review`.
2. View Front of card ("You said: _He don't like coffee_").
3. Click "Tap to reveal answer" or press `Space` -> Card flips in 3D (`rotateY(180deg)`).
4. View Back of card ("Better way: _He doesn't like coffee_") + Translation + Mentor tip.
5. Rate difficulty: "Still not clear", "Almost", or "Got it!".

---

## 3. UI States & Edge Cases

- **States**: Card Front, Card Back, Rating Active, Queue Completed ("All caught up!").
- **Animations**: 3D perspective flip with spring physics (`var(--ease-spring)`).
