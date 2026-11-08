# Pathway Multi-Case Formula Pedagogy & Zero-Emoji Swiss Typography Standard

## 1. Multi-Case Sequential Pedagogy (FormulaCase)
- **Problem**: In rules with multiple grammatical branches (e.g. Base 09: Do vs Does, Base 08: Don't vs Doesn't), packing all variations with slashes (Do / Does + you / they / she + have / live / want?) creates confusion and invalid cross-permutations.
- **Standard**: Rules with branches MUST define formulaCases in PathwayLessonPayload.
  - label: Concise tab title (Con Do (You · We · They) vs Con Does (He · She · It)).
  - segments: Exact syntactic blocks for that specific branch.
  - explanationSpanish: Focused rule explanation with zero mid-sentence truncation (line-clamp-2 strictly prohibited).
  - exampleEnglish: Auditory reference example with one-click native pronunciation.
- **Lecture Engine Choreography**: PathwayLectureEngine emits discrete FORMULA scenes for each case index (activeFormulaCaseIndex: 0, then 1), allowing the 3D mentor (Liam) to explain and draw each case sequentially before advancing to the Spanish trap surgery and live interactive challenges.
- **Static Board Parity**: StaticFormulaCaseBoard provides identical tabbed switching on Desktop (PathwayVisualRuleStep.tsx) and in the Visual Examples modal (LessonVisualExamples.tsx).

## 2. Zero-Bolita Standard (Erradicación de Puntos Residuales)
- All circular indicator dots before action labels (e.g., Construir la Regla in CtaVariantStrip.tsx) are completely removed.
- CTAs must use pure Swiss typographic balance: left-aligned descriptive label in font-mono text-white/90 and right-aligned action directive in text-violet-400 font-bold tracking-widest (PRÁCTICA ->).

## 3. Zero-Emoji Standard (Pure Swiss Typography & Lucide Vectors)
- All decorative, ornamental, and symbolic emojis are purged across all pathway views and tests.
- Replaced strictly by:
  - Swiss typographic hierarchy: 1 Fórmula · 2 Trampa · 3 Reto · 4 Ejemplos.
  - Direct micro-copy: Probarme ->, Elegir ->.
  - Fine 1px vector icons from lucide-react: Mic, Volume2, Lock, Pause, Play, Square, ArrowRight.

## 4. Mobile Ergonomics & Framing
- Chibi/Liam 3D viewport on mobile (< 1024px) guarantees 0px top cropping, full visible patchwork hoodie pouch and arms, with the glass interactive stage anchored smoothly at the bottom, maintaining permanent eye contact with the tutor.
