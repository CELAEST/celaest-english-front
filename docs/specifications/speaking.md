# SPECIFICATION: Speaking Drills & Phonetics

> **Feature**: Real-Time Speaking Pace & Pronunciation Analysis

---

## 1. Entrance & Exit

- **Entrance**: Clicking "Speaking" drill or selected from Memory Bank error card.
- **Exit**: Drill completion -> Summary card -> Workspace.

---

## 2. User Actions & Flow

1. Screen displays target sentence (e.g. _"I'd be happy to schedule a call to walk you through the next steps"_).
2. Phonetic breakdown displayed above text (`/aɪd biː ˈhæpi tuː ˈʃɛdjuːl a kɔːl/`).
3. User clicks "Record" and speaks.
4. AI compares audio pitch and speed against native speaker benchmark.

---

## 3. Scenarios & Edge Cases

- **Hesitation Detected**: System flags specific word in amber (`#F59E0B`) and suggests syllable slow-motion playback.

---

## 4. UI States Matrix

| State         | UI Representation                                                                     |
| :------------ | :------------------------------------------------------------------------------------ |
| **Ready**     | Target sentence displayed in high-contrast white, record button pulsing.              |
| **Recording** | Live pitch curve overlay on phonetic text.                                            |
| **Analysis**  | Color-coded word highlights (Mint: Perfect, Amber: Hesitation, Coral: Mispronounced). |

---

## 5. Animations & Transitions

- Pitch Overlay Curve: Smooth SVG path interpolation.

---

## 6. Data Inputs & Outputs

- **Input**: User spoken audio frame.
- **Output**: Pronunciation accuracy %, words-per-minute (WPM) score.
