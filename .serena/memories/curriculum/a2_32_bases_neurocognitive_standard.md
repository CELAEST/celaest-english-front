# CELAEST English A2: 32-Base Neurocognitive Curriculum Standard (Path to B1)

## 1. Executive Summary
Level A2 has been modularized and expanded to 32 neurocognitive foundations across 6 thematic modules. It covers 100% of the CEFR A2 standard, eliminates Spanish-to-English cognitive traps in past narrative, future forms, comparatives, modals, and present perfect, and establishes an unshakeable bridge to Level B1.

## 2. The 6 Thematic Modules (32 Foundations)
- **Módulo 1: La Narrativa en Pasado (Bases 1 a 6)**
  1. Pasado Regular (-ed y los 3 sonidos fonéticos: /t/, /d/, /ɪd/)
  2. Verbos Irregulares de Oro (went, saw, had, did, made, got, took, came)
  3. Escudo Negativo en Pasado (Didn't + Verbo Base sin doble pasado)
  4. Preguntas en Pasado (Did you...? + Verbo Base y Respuestas Cortas)
  5. Pasado Continuo (Was / Were + -ing para acciones en progreso)
  6. La Interrupción en el Tiempo (Past Continuous + When + Past Simple)
- **Módulo 2: El Futuro y las Decisiones (Bases 7 a 11)**
  7. Planes Confirmados (Be going to + Verbo Base)
  8. Decisiones al Instante y Promesas (Will / Won't)
  9. Citas Fijas en Agenda (Present Continuous con sentido futuro)
  10. La Tríada del Futuro (Will vs Going to vs Continuous)
  11. Señales Temporales de Futuro (Tomorrow, next week, in two days, soon)
- **Módulo 3: Comparaciones, Superlativos e Igualdad (Bases 12 a 16)**
  12. Comparativos Cortos (-er than: faster, easier, bigger)
  13. Comparativos Largos (More ... than: more important, more practical)
  14. Superlativos de Excelencia (The -est y The most)
  15. Irregulares de Oro (Better, Best, Worse, Worst)
  16. Comparación de Igualdad (As ... as / Not as ... as)
- **Módulo 4: Modales, Obligación, Consejo y Propósito (Bases 17 a 21)**
  17. Obligación Real (Have to vs Must)
  18. Consejo Amable (Should / Shouldn't)
  19. Posibilidad Incierta (May / Might)
  20. Propósito Limpio (To + Verbo sin la trampa de 'For to')
  21. Phrasal Verbs Cotidianos (Turn on/off, look for, pick up, set up)
- **Módulo 5: Indefinidos y Preguntas Naturales (Bases 22 a 26)**
  22. Pronombres Indefinidos (Someone, Something, Somewhere)
  23. Regla Negativa de Any y No (Nothing, Nobody, Nowhere sin doble negación)
  24. 'Everyone' & 'Everything' (Sujeto en singular: is / works)
  25. Preposiciones al Final (Who to? / What for? / Where from?)
  26. Preguntas Indirectas de Cortesía (Could you tell me where the station is?)
- **Módulo 6: Presente Perfecto y el Salto Cuántico a B1 (Bases 27 a 32)**
  27. Experiencias de Vida (Present Perfect: Have/Has + Participio)
  28. Huellas en el Tiempo (Ever vs Never)
  29. Señales Recientes (Already, Yet, Just)
  30. El Gran Contraste (Present Perfect vs Past Simple)
  31. Conectores de Argumentación (Although, However, So that)
  32. El Salto Cuántico a B1 (For, Since y 'Used to')

## 3. Architecture & File Layout
- `src/features/pathway/curriculum/a2/`:
  - `module1PastNarrative.ts` (Bases 1 a 6)
  - `module2FutureDecisions.ts` (Bases 7 a 11)
  - `module3Comparatives.ts` (Bases 12 a 16)
  - `module4ModalsPurpose.ts` (Bases 17 a 21)
  - `module5IndefinitesQuestions.ts` (Bases 22 a 26)
  - `module6PresentPerfectBridge.ts` (Bases 27 a 32)
  - `index.ts` (Barrel orquestador que exporta `buildA2Foundations`)
- `src/features/pathway/curriculum/a2Foundations.ts`: Re-export barrel.
- `src/features/pathway/services/aiPathwayCurriculumService.ts`: Delegación limpia para `level === "A2"`.
- `src/infrastructure/repositories/ApiPathwayRepository.ts`: Migración automática de caché preservando lecciones completadas.

## 4. Verification & Certification
- `vitest run src/features/pathway/`: 4/4 archivos pasados (9/9 tests).
- `vitest run multiDomainInvariance.test.ts`: Pasado (7/7 tests).
- `npx tsc --noEmit`: 0 errores.
- `npm run audit:hardcode`: 100% limpio.
- `npm run build`: Exitoso en 26.72s.
