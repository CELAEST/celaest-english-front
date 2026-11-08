# Comprehensive English Anatomy Standard: 14 Structural Pillars (Zero-Boxes & Pure Typography)

## 1. Pedagogical Scope & Rigorous Linguistic Separation
The user explicitly corrected the initial narrow grouping (action verbs mixed with modals, missing gerunds, etc.). The English sentence structure is comprehensively decomposed into 14 distinct, non-overlapping pillars grouped across 4 Master Families:

### Familia 1: Protagonistas (Who & What)
- `01. Sujetos & Pronombres`: I, You, He, She, It, We, They. (Obligatorio en inglés, nunca tácito).
- `02. Pronombres Objeto & Posesivos`: me/him/them, my/your/their, mine/yours. (Recibir la acción vs describir posesión vs sustitución).
- `03. Sustantivos & Artículos`: a, an, the y Cero Artículo Ø. (Regla sagrada: generalidades nunca llevan 'the': 'Experience creates confidence').

### Familia 2: El Motor Verbal (Action, Auxiliary, Modals, Gerunds & Time)
- `04. Verbos de Acción & To Be`: Acciones directas (work, start) vs ser/estar (am, is, are). Nunca se mezclan en presente simple ('I agree', nunca 'I am agree').
- `05. Auxiliares & Negación (Do/Does/Did)`: El soporte sintáctico que absorbe la negación ('I don't work', 'She doesn't work').
- `06. Verbos Modales (Can, Should, Must, Would, Might)`: Modales puros sin 's', sin 'to', sin 'do'.
- `07. Gerundios vs Infinitivos (-ing vs To)`: Verbo-ing como sustantivo/actividad ('Speaking builds confidence') y tras preposiciones ('for joining'); 'to + verb' para propósito y deseo.
- `08. Tiempos Verbales Esenciales`: Presente simple (rutina), continuo (ahora), pasado terminado y futuro (will / going to).

### Familia 3: Modificadores & Relaciones (Qualities, Manner & Prepositions)
- `09. Adjetivos & Comparativos`: Posición fija SIEMPRE antes del sustantivo, invariables en plural sin 's'.
- `10. Adverbios de Modo & Frecuencia`: Terminación modal `-ly` (-mente); adverbios de frecuencia entre sujeto y verbo ('I always verify').
- `11. Preposiciones de Lugar & Tiempo`: at (precisión exacta), on (días y superficies), in (espacios cerrados, meses, años), for vs to.

### Familia 4: Sintaxis & Preguntas (Connecting & Asking)
- `12. Conectores Lógicos`: because, so, but, although, however, therefore.
- `13. Fórmula de Preguntas (QASM)`: Question word + Auxiliary + Subject + Main verb ('Why did you choose this?').
- `14. La Fórmula Universal (SVO / SVOC)`: Sujeto + Verbo + Objeto + Modo + Lugar + Tiempo.

## 2. Zero-Boxes Architecture & Anti-Monolith Sizing
- `AnatomyFamilyFilter.tsx`: 51 líneas. Selector minimalista de familias con pills tipográficas.
- `AnatomyPillarNav.tsx`: 45 líneas. Selector horizontal minimalista con numeración monospace.
- `AnatomyPillarSection.tsx`: 78 líneas. Renderiza el pilar activo, concepto humano, alerta de trampa L1 y pronunciación Liam nativa.
- `AnatomyUniversalFormula.tsx`: 74 líneas. Fórmula SVO y QASM en tipografía pura.
- `PathwayAnatomyModal.tsx`: 64 líneas. Modal orquestador con `AppModal size="lg"`.
- `englishAnatomyData.ts`: Bóveda canónica de los 14 pilares con ejemplos bilingües.
