# COMPONENT INVENTORY: Atomic Design System Breakdown

> **Architecture Standard**: Atomic Design Methodology (Figma & React Parity)  

---

## 1. Atoms (Basic UI Elements)

| Component | Props API | Visual Specs |
| :--- | :--- | :--- |
| **`Button`** | `variant`, `size`, `isDisabled`, `isLoading` | Primary Violet Glow (`#7048E8`), Secondary Glass (`rgba(12,12,28,0.65)`), Ghost. |
| **`Input`** | `type`, `value`, `placeholder`, `isError` | Ambient dark fill (`#080814`), border `rgba(255,255,255,0.07)`, focus glow. |
| **`Typography`**| `variant`, `color`, `as` | `display-xl`, `display-lg`, `heading-md`, `body-md`, `caption`, `serif-accent`. |
| **`Badge`** | `variant` (`mint`, `lavender`, `amber`, `coral`) | Pill radius, background opacity 15%, text 100%. |
| **`Chip`** | `label`, `isSelected`, `onClick` | Interactive soft dark pill for onboarding options. |
| **`Icon`** | `name`, `size`, `color` | Crisp Lucide vector icon wrapper. |
| **`ProgressRing`**| `value`, `size`, `strokeWidth`, `color` | Circular SVG progress ring with smooth stroke-dashoffset transition. |
| **`Spinner`** | `size`, `color` | Subtle glowing violet spinner. |
| **`Divider`** | `orientation`, `opacity` | 1px hairline border (`rgba(255,255,255,0.07)`). |
| **`Tooltip`** | `content`, `position` | Glassmorphic floating popover with arrow. |

---

## 2. Molecules (Compound Controls)

| Component | Included Atoms | Function |
| :--- | :--- | :--- |
| **`SearchBar`** | `Input`, `Icon`, `Button` | Global command palette search field. |
| **`VoiceInputBar`**| `Button`, `Icon`, `Badge`, `Spinner` | Integrated text + microphone input control bar. |
| **`ConversationBubble`**| `Typography`, `Badge`, `Icon` | AI vs User speech bubble with timestamps and phonetics. |
| **`LessonCard`** | `Typography`, `ProgressRing`, `Badge`, `Icon` | Card displaying lesson title, estimated time, and mastery %. |
| **`NavigationItem`**| `Icon`, `Typography`, `Badge` | Sidebar navigation link with active indicator dot. |
| **`ChartCard`** | `Typography`, `Badge`, `Divider` | Stat card wrapping mini line chart or progress ring. |
| **`InlineWordLookup`**| `Typography`, `Button`, `Icon` | Definition card triggered by clicking words in Reading Studio. |

---

## 3. Organisms (Complex Independent Modules)

| Component | Description |
| :--- | :--- |
| **`AiMentorOrb`** | 3D/Canvas interactive glowing sphere with state-driven ambient particle physics. |
| **`WaveformVisualizer`** | Off-main-thread HTML5 Web Audio API frequency bar visualizer. |
| **`Sidebar`** | Left navigation bar with user profile badge, workspace links, and settings. |
| **`ConversationPanel`**| Central live voice/text chat stream with real-time AI transcript rendering. |
| **`FlipCardDeck`** | Memory bank card carousel with 3D flip animation and rating triggers. |
| **`RealtimeProofreaderPanel`**| Writing lab side inspector highlighting tone, grammar, and vocabulary suggestions. |
| **`JourneyTimeline`** | Horizontal step stream displaying past sessions, today's focus, and upcoming goals. |

---

## 4. Templates (Page Layout Structures)

- **`DashboardLayout`**: Left Sidebar + Main Workspace Canvas + Optional Right Inspector Panel + Bottom Audio Control Bar.
- **`ConversationLayout`**: Central AI Orb view + Floating Voice Input Bar + Side Drawer History.
- **`FocusReadingLayout`**: Fullscreen distraction-free reader + Bottom progress bar + Ambient audio player.
- **`AuthenticationLayout`**: Centered dark glass card + Glowing violet backdrop aura.
