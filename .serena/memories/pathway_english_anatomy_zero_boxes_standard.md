# Standard de Anatomía y Estructura del Inglés (Zero-Boxes & Pure Typography)

## 1. Filosofía Pedagógica y Cero Cajas
- **Alcance Completo**: Para dominar la estructura del inglés sin bloqueos, el estudiante principiante entiende los 7 bloques fundamentales del idioma:
  1. `Sujetos & Pronombres` (Quién hace la acción; nunca se omite en inglés)
  2. `Verbos` (El motor: acción pura, estado To Be, verbos modales)
  3. `Sustantivos (Nouns)` (Las cosas y conceptos; sin género arbitrario)
  4. `Adjetivos` (Cualidades: SIEMPRE ANTES del sustantivo, invariables en plural sin 's')
  5. `Adverbios` (Modo con terminación `-ly`, tiempo y lugar)
  6. `Preposiciones` (Puentes espaciales y temporales: `at, in, on, with, for`)
  7. `Conectores` (El pegamento entre dos oraciones: `because, so, but, and`)
  8. `La Fórmula Universal (SVO)`: `Sujeto + Verbo + Objeto + Complemento`.

- **Prohibición de Cajas (Zero-Boxes)**: Erradicación total del anti-patrón de cajas con bordes y fondos de colores anidados. Se aplica **Pure Floating Typography** con líneas divisorias sutiles (`border-b border-white/[0.06]`), acentos monospaciados y contraste de color limpio.

## 2. Componentes Modulares (< 80 líneas)
- `src/features/pathway/data/englishAnatomyData.ts`: Bóveda de los 7 pilares con modelos mentales en español, trampas L1 y ejemplos bilingües.
- `src/features/pathway/components/knowledge/AnatomyPillarNav.tsx` (38 líneas): Selector horizontal sin cajas ni bordes.
- `src/features/pathway/components/knowledge/AnatomyPillarSection.tsx` (75 líneas): Filas tipográficas flotantes con audio nativo de Liam al hacer click.
- `src/features/pathway/components/knowledge/AnatomyUniversalFormula.tsx` (67 líneas): Desglose tipográfico de la oración universal en inglés.
- `src/features/pathway/components/knowledge/PathwayAnatomyModal.tsx` (67 líneas): Modal orquestador con `AppModal` tamaño `lg`.

## 3. Resiliencia de Audio y Accesibilidad
- Corrección de `Blocked aria-hidden` mediante blur sincrónico en `useFocusTrap.ts`.
- Supresión de reintentos continuos STT en `audioCaptureService.ts` ante 503 / conexiones locales no disponibles (`backendSTTUnavailable`).
- Pronunciación auditiva nativa con la voz de Liam (`SpeechSynthesisService.speak`).
