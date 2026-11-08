# CELAEST Super Tutor Architecture & Friendly Masculine Voice Standard

## 1. Flagship Friendly Masculine Voice: `es-MX-JorgeNeural`
- Replaced previous female default (`es-MX-DaliaNeural`) with `es-MX-JorgeNeural` across:
  - `SpeechSynthesisService.speak` (default Spanish voice).
  - `PathwayLectureEngine.playLecture` (`spanishVoice = "es-MX-JorgeNeural"`).
  - `PathwayQAService.playAnswer` (`es-MX-JorgeNeural`).
- Delivers a warm, fraternal, professional Latin American male tone designed specifically for 1-on-1 language mentorship.

## 2. Zero-Repetition Software Rule (Spoken Exactly Once)
- Tracked via `localStorage` (`celaest:tutor:software_explained:v1`).
- **First Visit**: Tutor greets warmly and explains the layout once:
  - *"Hola, soy tu mentor en CELAEST. Te voy a guiar paso a paso: a tu izquierda tienes la regla visual, en el centro ensamblarás fichas para forjar reflejos motrices, y al final certificarás tu voz. Esta guía de la interfaz te la explico solo esta vez. Vamos directo a tu lección."*
- **Subsequent Visits**: CERO software filler. The tutor jumps straight to pure linguistic mastery:
  - Propósito real de la base en la comunicación.
  - La trampa típica del español (L1) y por qué los hispanohablantes tropiezan.
  - La regla de oro y el modelo mental intuitivo.
  - Modelo nativo en inglés (`en-US-AriaNeural`).
  - Secreto fonético (linking y ritmo).
  - Activación en pantalla (*"Toca las fichas léxicas en el panel izquierdo..."*).

## 3. Anti-Rushing Pacing Safeguard (Zero Fast-Forward)
- Prevents the lecture from skipping ahead if an audio buffer finishes or encounters network latency.
- Formula: `minDisplayTimeMs = Math.max(3200, Math.ceil((wordsCount / 2.2) * 1000))`.
- Each concept remains on screen for at least 3.2 to 6+ seconds so the learner can comfortably read, absorb, and reflect.
- Respectful 450ms human pauses between pedagogical stages.
