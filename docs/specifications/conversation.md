# SPECIFICATION: Live Conversation & AI Mentor Chat

> **Feature**: Real-Time AI Voice & Text Conversation

---

## 1. Entrance & Exit

- **Entrance**: Clicking "Start Conversation" or "Conversation" in sidebar.
- **Exit**: Clicking "End Session" -> Triggers AI Reflection summary modal -> Workspace.

---

## 2. User Actions & Flow

1. User clicks microphone icon or holds `Space` to speak.
2. Web Audio API captures audio; Waveform visualizer renders 60fps frequency bars.
3. User stops speaking; AI Mentor processes stream.
4. AI response streams text in real-time while AI voice plays back.
5. Suggested responses appear as soft pills at the bottom.

---

## 3. Scenarios & Edge Cases

- **Microphone Permission Denied**: Shows amber banner with step-by-step unblock guide. Text fallback input automatically focuses.
- **AI Latency Spikes**: Waveform displays pulsing "Thinking" aura without dropping audio context.

---

## 4. UI States Matrix

| State         | UI Representation                                                       |
| :------------ | :---------------------------------------------------------------------- |
| **Idle**      | Orb breathing softly, input placeholder "Speak or type your answer...". |
| **Listening** | Waveform active, Orb contours expanding in sync with mic amplitude.     |
| **Thinking**  | Lavender particle aura, text streaming dots.                            |
| **Speaking**  | AI transcript streaming line-by-line, audio playback active.            |

---

## 5. Animations & Transitions

- Waveform Frequency Bars: Smooth height scale (`scaleY`) via `requestAnimationFrame`.
- Transcript Streaming: Smooth opacity fade-in per word.

---

## 6. Data Inputs & Outputs

- **Input**: PCM Audio Stream / Text string.
- **Output**: Transcripts, identified grammar mistakes, phonetic scores sent to Memory Bank.
