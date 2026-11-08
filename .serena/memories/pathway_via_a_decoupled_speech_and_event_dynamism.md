# Pathway VÍA A: Decoupled Bilingual Speech & Event-Driven Live Board Standard

## 1. The Core Architectural Breakthrough (VÍA A)
- **Problem**: Monolithic mixed-language audio files (Spanish narrative + English sample in the same MP3) force Azure Neural TTS into Spanish acoustic resonance, distorting English phrases (e.g., 'I am ready' -> /i an redi/). Furthermore, relying on blind JavaScript `setTimeout` timers to reveal blackboard pieces causes chronic drift and desynchronization.
- **VÍA A Contract**:
  1. **Separation of Concerns**:
     - **Mentor Intro (Spanish)**: Short, warm explanation in Spanish ('El reto de esta base es el verbo tu bi sin enredos. Contigo mismo usamos la pareja fija am:').
     - **Native Model (English)**: Dedicated isolated audio track with `language: "en"` ('I am ready.'). Because it has 0 Spanish tokens, Andrew Multilingual produces 100% textbook American English phonology (/aɪ æm ˈrɛdi/).
  2. **Event-Driven Visual Dynamism (Zero `setTimeout`)**:
     - `LectureSegment.formulaRevealCount` controls exactly how many chips are revealed during each active audio track:
       - Intro track (`formulaRevealCount: 1`): Reveals Sujeto.
       - Native Model track (`formulaRevealCount: 3`): Instantly illuminates Verb + Complement with cyan/emerald glow synchronous to the voice starting.
     - `LiveBoardFormulaScene.tsx` is completely reactive and timer-free:
       `const revealedCount = !isDictating ? count : revealedCountOverride !== undefined ? Math.min(count, Math.max(1, revealedCountOverride)) : count;`

## 2. Multi-Case Sequential Flow (Base 03 Benchmark)
- Case 1: Intro (es) -> Native Model 'I am ready.' (en)
- Case 2: Intro (es) -> Native Model 'She is ready.' (en)
- Case 3: Intro (es) -> Native Model 'We are ready.' (en)
- Total time: ~16.5s of snappy, kinetic, 100% synchronized classroom delivery.
