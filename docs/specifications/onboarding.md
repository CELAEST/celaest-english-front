# SPECIFICATION: Onboarding Module

> **Feature**: 4-Step Learning DNA Discovery  
> **Target Experience**: Apple-inspired onboarding sequence with interactive AI Orb

---

## 1. Entrance & Exit

- **Entrance**: User launches application for the first time or clicks "Reset Profile" from Settings.
- **Exit**: System completes DNA profile generation and transitions smoothly to `/workspace` via `DNA Summary Blueprint`.

---

## 2. User Actions & Flow

1. **Step 1 (Goal Discovery)**: User selects or types career objectives (e.g. Programming, AI, Executive Meetings).
2. **Step 2 (Proficiency & Confidence)**: User rates current speaking confidence (Low, Medium, High).
3. **Step 3 (Practice Cadence)**: User selects daily target (10 min, 20 min, 30 min).
4. **Step 4 (DNA Construction)**: AI Orb pulses while synthesizing answers into a personalized learning blueprint.

---

## 3. Scenarios & Edge Cases

- **Skipping Onboarding**: User presses `ESC` or clicks "Skip onboarding" -> System applies balanced default profile (B1 Intermediate, 20 min/day).
- **Network Disconnection during DNA Synthesis**: System caches inputs in local IndexedDB vault and resumes automatically upon reconnect.

---

## 4. UI States Matrix

| State                    | UI Representation                                                                                  |
| :----------------------- | :------------------------------------------------------------------------------------------------- |
| **Initial / Empty**      | Centered AI Orb breathing (`Idle` state), step counter `01 / 04`.                                  |
| **Active / Input**       | Glowing option chips, focused text input field.                                                    |
| **Processing / Loading** | Orb state shifts to `Analyzing`, particle speed increases, checkmarks animate sequentially.        |
| **Success**              | "Your AI Mentor is ready" card, "Start Learning ->" primary violet button.                         |
| **Error**                | Soft amber banner "Unable to generate DNA blueprint offline. Retrying...", input fields preserved. |

---

## 5. Animations & Transitions

- **Orb State Transition**: `Idle` -> `Analyzing` (Radial pulse expansion, `var(--ease-spring)` 450ms).
- **Step Slide**: Horizontal fade-slide transition (`translateX(-20px)` -> `translateX(0)`).

---

## 6. Data Inputs & Outputs

- **Input**: User selections (`careerGoal: string`, `confidence: string`, `dailyCadenceMinutes: number`).
- **Output**: `UserLearningDna` JSON payload stored in local encrypted vault.
