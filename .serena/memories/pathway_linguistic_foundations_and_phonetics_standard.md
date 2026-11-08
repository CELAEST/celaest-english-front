# CELAEST Pathway: Linguistic Foundations & Interactive Phonetic Alphabet Standard (A1/A2)

## 1. Contexto y Justificación Pedagógica
- **Problema Detectado**: Los alumnos en niveles básicos (A1/A2) tropiezan cuando las instrucciones mencionan conceptos como *"sujeto"*, *"verbo base"* o *"pronombre"* sin tener claro qué significan en la práctica. Además, la fonética del inglés (con más de 12 sonidos vocálicos frente a los 5 del español) es la mayor fuente de fosilización de errores.
- **Solución CELAEST**: Módulo de consulta rápida en 1-clic con dos pestañas de alto valor:
  1. **Fundamentos Gramaticales**:
     - *Sujeto / Pronombre (El Protagonista)*: `I, You, He, She, It, We, They` con la regla de oro: en inglés el sujeto nunca se omite.
     - *Verbo (El Motor)*: Qué es (acción o estado) con ejemplos inmediatos con audio nativo de Liam (`learn, work, review, be, have, can`).
     - *Complemento (Los Accesorios)*: Los detalles que responden a qué, dónde o cuándo.
  2. **Abecedario Fonético Internacional (IPA para Hispanohablantes)**:
     - Vocales cortas vs largas (/iː/ vs /ɪ/, /æ/ vs /ʌ/, /uː/ vs /ʊ/).
     - El sonido comodín Schwa (/ə/).
     - Consonantes trampa (/θ/, /ð/, /v/, /b/, /s/ inicial sin "e", /ʃ/).
     - Botón de audio inmediato por cada fonema y palabra de ejemplo con la voz nativa de Liam.

## 2. Arquitectura de Desacoplamiento (Regla < 80 Líneas)
- `src/features/pathway/data/pathwayKnowledgeData.ts`: Colecciones de datos puras y desacopladas (pronombres, verbos, fonemas IPA y pistas anatómicas).
- `src/features/pathway/components/knowledge/PathwayKnowledgeModal.tsx`: Orquestador dialogal que consume `AppModal` (66 líneas).
- `src/features/pathway/components/knowledge/KnowledgeTabSelector.tsx`: Selector de pestañas obsidian glass (39 líneas).
- `src/features/pathway/components/knowledge/GrammarPillarsIntro.tsx`: Banner explicativo del mapa estructural (13 líneas).
- `src/features/pathway/components/knowledge/GrammarFoundationsPanel.tsx`: Tarjetas interactivas de pronombres y verbos (72 líneas).
- `src/features/pathway/components/knowledge/PhoneticSoundTile.tsx`: Celda individual de fonema con reproducción y contraste (50 líneas).
- `src/features/pathway/components/knowledge/PhoneticAlphabetPanel.tsx`: Matriz fonética organizada por categorías (69 líneas).
- `src/features/pathway/components/PathwayLessonHeader.tsx`: Píldora de acceso rápido en 1-clic en barra superior (79 líneas).
- `src/features/pathway/components/stages/PathwayVisualRuleStep.tsx`: Enlace contextual debajo de la fórmula de clase (78 líneas).
- `src/features/pathway/components/PathwayStudioView.tsx`: Orquestador de estado de la clase (78 líneas).

## 3. Certificación de Calidad
- TypeScript: `npx tsc --noEmit` -> 0 errores.
- Vitest: 17/17 tests de la suite pathway pasados al 100%.
- Invarianza Multidominio: 7/7 tests pasados al 100%.
- Auditoría Anti-Hardcode: 100% libre de sesgos o listas cerradas.

