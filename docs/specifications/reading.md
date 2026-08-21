# SPECIFICATION: Active Reading Studio

> **Feature**: Deep Work Reader with Inline Dictionary & Focus Mode  

---

## 1. Entrance & Exit
- **Entrance**: Clicking "Reading" in sidebar.
- **Exit**: Clicking "End reading session" or pressing `ESC` in focus mode.

---

## 2. User Actions & Flow
1. Select article (e.g. *"The Art of Clear Communication - 8 min read"*).
2. Read article in clean typography container.
3. Click any word (e.g. `matters`) -> Ambient popover opens showing IPA (`/'materz/`), contextual definition, and "+ Add to Memory" button.
4. Toggle "Focus Mode" -> Sidebar and navigation disappear, entering distraction-free reading canvas.

---

## 3. UI States & Edge Cases
- **States**: Article Grid, Standard Reader, Focus Reader (Fullscreen), Word Popover open.
- **Animations**: Popover fade-scale, Focus Mode backdrop blackout (`var(--bg-app)`).
