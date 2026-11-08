# CELAEST English B1: 32-Base Neurocognitive Curriculum Standard (Path to B2)

## 1. Executive Summary
Level B1 has been modularized and expanded to 32 neurocognitive foundations across 6 thematic modules. It covers 100% of the CEFR B1 standard, transforming learners from basic operational communicators to independent, reasoned professionals capable of hypothesizing, reporting, arguing, and negotiating in international environments.

## 2. The 6 Thematic Modules (32 Foundations)
- **Módulo 1: Causa, Efecto e Hipótesis (Conditionals) (Bases 1 a 6)**
  1. Hechos y Verdades Universales (Zero Conditional: If + Present, Present)
  2. Causa y Efecto Futuro (First Conditional: If + Present, Will + Verbo)
  3. Salvedades y Advertencias (Unless, As soon as, In case)
  4. El Mundo Imaginario (Second Conditional: If + Past, Would + Verbo)
  5. El Subjuntivo Irreal ("If I were you..." con were formal para todas las personas)
  6. Gran Contraste: Realidad vs Hipótesis (First vs Second Conditional)
- **Módulo 2: Profundidad Temporal (Aspectos Perfectos) (Bases 7 a 11)**
  7. La Acción Ininterrumpida (Present Perfect Continuous: Have been doing)
  8. Duración vs Resultado (Present Perfect Simple vs Continuous)
  9. El Pasado del Pasado (Past Perfect Simple: Had + Participio)
  10. Señales de Secuencia Pasada (By the time, Before, Already)
  11. Hábitos y Adaptación (Used to vs Be used to vs Get used to)
- **Módulo 3: El Foco en el Hecho: La Voz Pasiva (Bases 12 a 16)**
  12. Voz Pasiva en Presente (Am / Is / Are + Participio: English is spoken here)
  13. Voz Pasiva en Pasado (Was / Were + Participio: The project was completed)
  14. El Agente con 'By' (Cuándo mencionarlo y cuándo omitirlo)
  15. Voz Pasiva con Verbos Modales (Can be done, Must be sent, Should be reviewed)
  16. Estilo Corporativo Impecable (Transformación activa a pasiva)
- **Módulo 4: Deducción y Patrones de Verbos (Bases 17 a 21)**
  17. Deducción Lógica (Must be, Can't be, Might be)
  18. Gerundio Obligatorio (Enjoy, Avoid, Mind, Consider + -ing)
  19. Infinitivo con 'To' (Decide, Plan, Hope, Manage + to)
  20. Verbos de Doble Sentido (Stop / Remember con To vs -ing)
  21. Adjetivos con -ed vs -ing (Bored vs Boring, Interested vs Interesting)
- **Módulo 5: Transmitir Ideas y Definir (Bases 22 a 26)**
  22. Reported Speech: Say vs Tell (Transmitir mensajes sin citar textualmente)
  23. El Retroceso Temporal (Backshift: Present -> Past, Will -> Would, Can -> Could)
  24. Preguntas y Órdenes Reportadas (Asked if... sin inversión, Told me to...)
  25. Cláusulas de Relativo (Who, Which, That, Where, Whose)
  26. La Omisión del Pronombre Relativo ("The project [that] we started")
- **Módulo 6: Argumentación, Matices y Salto Cuántico a B2 (Bases 27 a 32)**
  27. Arrepentimiento Tardío (Should have + Participio)
  28. Oportunidades No Aprovechadas (Could have + Participio)
  29. Preguntas Coletilla de Confirmación (Question Tags: don't you?, isn't it?)
  30. Conectores Formales de Contraste (Despite / In spite of vs Although)
  31. Deseos y Realidades Alternativas (I wish + Past Simple: I wish I knew)
  32. El Salto Cuántico a B2: El Tercer Condicional y la Autonomía Fluida (If I had known, I would have told you)

## 3. Architecture & File Layout
- `src/features/pathway/curriculum/b1/`:
  - `module1Conditionals.ts` (Bases 1 a 6)
  - `module2TemporalDepth.ts` (Bases 7 a 11)
  - `module3PassiveVoice.ts` (Bases 12 a 16)
  - `module4ModalsPatterns.ts` (Bases 17 a 21)
  - `module5ReportedRelative.ts` (Bases 22 a 26)
  - `module6AdvancedBridge.ts` (Bases 27 a 32)
  - `index.ts` (Barrel orquestador que exporta `buildB1Foundations`)
- `src/features/pathway/curriculum/b1Foundations.ts`: Re-export barrel.
- `src/features/pathway/services/aiPathwayCurriculumService.ts`: Delegación limpia para `level === "B1"`.
- `src/infrastructure/repositories/ApiPathwayRepository.ts`: Migración automática de caché preservando lecciones completadas.

## 4. Verification & Certification
- `vitest run src/features/pathway/`: 4/4 archivos pasados (9/9 tests).
- `vitest run multiDomainInvariance.test.ts`: Pasado (7/7 tests).
- `npx tsc --noEmit`: 0 errores.
- `npm run audit:hardcode`: 100% limpio.
- `npm run build`: Exitoso en 17.99s.
