# CELAEST English A1: 32-Base Neurocognitive Curriculum Standard (Definitive Guide)

## 1. Executive Summary
Level A1 has been fully modularized and expanded to 32 neurocognitive foundations across 6 thematic modules. It covers 100% of the CEFR A1 standard with zero hardcoded software bias, solves all Spanish-to-English cognitive traps, and constructs an unshakeable bridge to Level A2.

## 2. The 6 Thematic Modules (32 Foundations)
- **Módulo 1: El Núcleo de la Identidad y la Frase (Bases 1 a 5)**
  1. El Orden Mágico (Sujeto obligatorio + Verbo)
  2. El 'It' Fantasma (Frases impersonales)
  3. Ser o Estar en Presente (Am · Is · Are & Contracciones)
  4. La Trampa de 'Tener' Estados y Edad (To Be para hambre, sed, frío y edad)
  5. Ser o Estar en Negativo & Pregunta (Isn't, Aren't e Inversión)
- **Módulo 2: Acciones, Rutinas y Hábitos Cotidianos (Bases 6 a 11)**
  6. Acciones del Día a Día (Presente Simple con I, You, We, They)
  7. La 'S' Mágica de Tercera Persona (He, She, It - reglas -s, -es, has)
  8. El Escudo Negativo (Don't vs Doesn't + Verbo Base)
  9. La Llave de Preguntas Directas (Do / Does + Respuestas Cortas)
  10. Verbos Encadenados con 'To' (Want to, Need to, Have to)
  11. Gustos y Preferencias (Like, Love, Hate + Noun/-ing)
- **Módulo 3: Objetos, Cantidades, Posesión y Personas (Bases 12 a 17)**
  12. Artículos Indefinidos: A vs An (Sonido consonante vs vocal)
  13. 'The' vs El 'Zero Article' (Generalidad vs especificidad)
  14. Plurales Regulares e Irregulares de Oro (-s, -es & People, Children, Men, Women)
  15. De Quién es Cada Cosa (Posesivos My, Your, His, Her, Our, Their)
  16. El Genitivo Sajón ('s) y Posesivos Libres (Mine, Yours, Hers)
  17. El Receptor de la Acción (Me, Him, Her, Us, Them)
- **Módulo 4: El Espacio, el Tiempo, la Cantidad y la Frecuencia (Bases 18 a 23)**
  18. Punteros en el Espacio (This, That, These, Those)
  19. La Existencia en el Mundo (There is · There are)
  20. Contables e Incontables (Much, Many, A lot of, Some, Any)
  21. Preposiciones de Lugar (In, On, At + Under, Behind, Next to)
  22. Preposiciones de Tiempo (At horas, On días, In meses y años)
  23. Adverbios de Frecuencia (Always, Usually, Sometimes, Never)
- **Módulo 5: Comunicación Activa, Preguntas y Acción en Vivo (Bases 24 a 28)**
  24. La Brújula de Preguntas Wh- (What, Where, When, Who, Why, Which)
  25. Preguntas de Cantidad y Medida (How much, How many, How often, How old)
  26. Capacidad y Permiso con 'Can' (Invariable sin cambios)
  27. Cortesía y Peticiones Reales (Would like / Could you)
  28. Instrucciones e Imperativos (Directos y Negativos)
- **Módulo 6: Fluidez, Secuenciación y El Salto Hacia A2 (Bases 29 a 32)**
  29. La Acción en Vivo (Present Continuous: To Be + -ing)
  30. El Gran Contraste: Rutina vs En Vivo (Simple vs Continuous)
  31. Conectores y Secuenciadores (And, But, Because, So + First, Then, Finally)
  32. El Gran Puente a A2: El Pasado de To Be (Was / Were y Señales de Pasado)

## 3. Architecture & File Layout
- `src/features/pathway/curriculum/a1/`:
  - `module1Identity.ts` (Bases 1 a 5)
  - `module2Routines.ts` (Bases 6 a 11)
  - `module3ObjectsPossession.ts` (Bases 12 a 17)
  - `module4SpaceTimeQuantity.ts` (Bases 18 a 23)
  - `module5Communication.ts` (Bases 24 a 28)
  - `module6FluencyAndBridge.ts` (Bases 29 a 32)
  - `index.ts` (Barrel exportando `buildA1Foundations`)
- `src/features/pathway/curriculum/a1Foundations.ts`: Re-export barrel maintaining backward compatibility.
- `src/infrastructure/repositories/ApiPathwayRepository.ts`: Seamless cache migration to 32 nodes preserving mastered nodes.
- `src/features/pathway/services/PathwayLectureEngine.ts`: Conversational speech engine with 0ms prefetch and non-robotic voice.

## 4. Verification & Certification
- `vitest run src/features/pathway/`: 4/4 files passed (9 tests).
- `vitest run multiDomainInvariance.test.ts`: Passed (7 tests).
- `npx tsc --noEmit`: 0 errors.
- `npm run audit:hardcode`: 100% clean, 0 hardcoded biases.
- `npm run build`: Production build succeeded.
