# CELAEST English A1: 18-Base Neurocognitive Curriculum Standard

## 1. Executive Summary
Level A1 was refactored and expanded from a 6-lesson surface intro to an 18-base neurocognitive curriculum. Each unit resolves a distinct Spanish-to-English cognitive trap, guarantees universal multi-domain invariance (zero software buzzword bias), and is narrated by the flagship voice `es-CO-GonzaloNeural` with zero literal punctuation read-aloud and parallel in-memory prefetching (0ms slide transitions).

## 2. The 18 Neurocognitive Foundations
1. **El Orden Mágico: Quién + Acción** (Sujeto obligatorio + Verbo)
2. **El 'It' Fantasma: Frases sin Persona Humana** (Sujeto impersonal 'It' obligatorio)
3. **Ser o Estar sin Enredos (Am · Is · Are)** (Verbo To Be en presente)
4. **La Trampa de 'Tener' Estados y Edad** (To Be para hambre, sed, frío y edad)
5. **La 'S' Mágica de Tercera Persona** (He / She / It + Verbo con -s)
6. **El Escudo Negativo (Don't vs Doesn't)** (Negación limpia en presente simple)
7. **La Llave de Preguntas Directas (Do / Does)** (Inversión auxiliar para preguntar)
8. **El Radar Espacial: Lugares con In, On y At** (Preposiciones espaciales intuitivas)
9. **De Quién es Cada Cosa: Posesivos sin Confusión** (My, Your, His, Her, Our, Their)
10. **Apuntar en el Espacio: This, That, These, Those** (Punteros demostrativos cerca vs lejos)
11. **La Existencia en el Mundo (There is · There are)** (Hay en singular vs plural)
12. **El Receptor de la Acción: Me, Him, Her, Them** (Pronombres objeto después del verbo)
13. **Poder Hacer con 'Can': La Palabra Invencible** (Habilidad y permiso sin auxiliares)
14. **La Acción en Vivo (Present Continuous: -ing)** (Estar haciendo en el momento)
15. **La Brújula de Preguntas: What, Where, When, Why, Who, How** (Palabras interrogativas Wh-)
16. **El Radar del Tiempo: Horas, Días y Meses** (At la hora, On el día, In el mes/año)
17. **La Visión Inversa: El Adjetivo Primero** (Cualidad antes del objeto)
18. **Conectores de Fluidez: And, But, Because y So** (Enlazar ideas para hablar corrido)

## 3. Architecture & File Layout
- `src/features/pathway/curriculum/a1Foundations.ts`: Modular isolated curriculum builder returning `FoundationUnitSpec[]`.
- `src/features/pathway/services/aiPathwayCurriculumService.ts`: Lightweight consumer delegating A1 generation to `buildA1Foundations`.
- `src/infrastructure/repositories/ApiPathwayRepository.ts`: Automatic cache migration that upgrades legacy cached pathways (< 18 nodes) while preserving mastered/active status.
- `src/features/conversation/services/speechSynthesisService.ts`: `sanitizeSpeechForVoice()` ensuring edge-tts and piper never verbalize quotes, dashes, colons, or step numbers.
- `src/features/pathway/services/PathwayLectureEngine.ts`: Conversational super-tutor script with 1-time software intro suppression and parallel prefetching.

## 4. Verification & Certification
- `vitest run src/features/pathway/`: 4 test files passed (9 tests).
- `npx tsc --noEmit`: 0 TypeScript errors.
- `npm run audit:hardcode`: 100% clean, 0 hardcoded biases.
- `npm run build`: Production build succeeded in 17.19s.
