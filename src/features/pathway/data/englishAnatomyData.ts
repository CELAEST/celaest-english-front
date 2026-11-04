export interface AnatomyExample {
  english: string;
  spanish: string;
  highlightToken: string;
  comparisonNote?: string;
}

export interface AnatomyLevel {
  id: number;
  number: string;
  title: string;
  shortLabel: string;
  description: string;
}

export const ANATOMY_LEVELS: AnatomyLevel[] = [
  { id: 1, number: "01", title: "El Arranque: Quién & Qué Hace", shortLabel: "1. Quién y Qué", description: "Los dos cimientos indispensables: sin sujeto y sin verbo no existe oración en inglés." },
  { id: 2, number: "02", title: "Nombrar & Calificar Objetos", shortLabel: "2. Objetos", description: "Cómo nombrar cosas del mundo, describirlas sin cometer errores de género o plural, y recibir acciones." },
  { id: 3, number: "03", title: "El GPS: Espacio, Tiempo & Modo", shortLabel: "3. Dónde y Cuándo", description: "Ubica tu mensaje en el mundo real: preposiciones exactas y adverbios de modo y frecuencia." },
  { id: 4, number: "04", title: "Control del Verbo: Reglas Clave", shortLabel: "4. Control del Verbo", description: "Cómo negar con auxiliares, usar modales sin trampas, distinguir gerundios (-ing) y manejar tiempos." },
  { id: 5, number: "05", title: "Dominio Total: Preguntar & Construir", shortLabel: "5. Preguntas & Frases", description: "La fórmula para unir ideas con conectores, armar preguntas con QASM y dominar la oración universal." },
];

export interface AnatomyPillar {
  id: string;
  levelId: number;
  number: string;
  name: string;
  tagline: string;
  humanConcept: string;
  spanishTrapRule: string;
  items: Array<{
    token: string;
    spanish: string;
    roleNote: string;
    example: AnatomyExample;
  }>;
}

export const ENGLISH_ANATOMY_PILLARS: AnatomyPillar[] = [
  // ==================== NIVEL 1: EL ARRANQUE (QUIÉN & QUÉ HACE) ====================
  {
    id: "subjects",
    levelId: 1,
    number: "01",
    name: "Sujetos & Pronombres Personales",
    tagline: "¿Quién hace la acción? (Obligatorio)",
    humanConcept: "El protagonista de la frase. En inglés el sujeto NUNCA se sobreentiende ni se puede omitir, ni siquiera hablando del clima.",
    spanishTrapRule: "En español dices 'trabajo aquí' (sujeto tácito). En inglés es obligatorio decir 'I work here'. Si dices solo 'Work here', parece una orden.",
    items: [
      { token: "I / You", spanish: "Yo / Tú o Ustedes", roleNote: "'I' siempre con mayúscula; 'You' sirve para singular y plural.", example: { english: "I work here every day.", spanish: "Yo trabajo aquí todos los días.", highlightToken: "I", comparisonNote: "Nunca omitas 'I'." } },
      { token: "He / She", spanish: "Él / Ella (3ª persona singular)", roleNote: "En presente básico obligan a añadir 's' al verbo.", example: { english: "She coordinates the team.", spanish: "Ella coordina el equipo.", highlightToken: "She", comparisonNote: "Agrega 's' al verbo." } },
      { token: "It", spanish: "Eso / Ello (Cosas, ideas, clima)", roleNote: "El clima y las cosas TIENEN sujeto: nunca digas 'Is cold'.", example: { english: "It rains a lot in winter.", spanish: "Llueve mucho en invierno.", highlightToken: "It", comparisonNote: "Obligatorio para clima y objetos." } },
      { token: "We / They", spanish: "Nosotros / Ellos o Cosas en plural", roleNote: "Para grupos de personas o múltiples elementos.", example: { english: "We solve complex problems.", spanish: "Nosotros resolvemos problemas complejos.", highlightToken: "We" } },
    ],
  },
  {
    id: "action_and_to_be",
    levelId: 1,
    number: "02",
    name: "Verbos de Acción vs Verbo To Be",
    tagline: "El motor de la frase: acción directa vs estado",
    humanConcept: "Acciones directas (work, live, agree) vs Estado de ser/estar (am, is, are). Son dos vías separadas que jamás se mezclan en presente simple.",
    spanishTrapRule: "Nunca digas 'I am agree' ni 'I am live in Madrid'. Di 'I agree' (verbo de acción) o 'I live'. To Be solo se usa para estados ('I am ready') o profesiones.",
    items: [
      { token: "Acción pura: work / learn / start", spanish: "trabajar / aprender / iniciar", roleNote: "Forma pura sin 'be': 'I work', 'we start'.", example: { english: "I agree with your proposal.", spanish: "Estoy de acuerdo con tu propuesta.", highlightToken: "agree", comparisonNote: "Directo: sin 'am'." } },
      { token: "3ª Persona: works / starts / manages", spanish: "él / ella / eso (+s)", roleNote: "Solo cuando el sujeto es he, she o it.", example: { english: "He manages the timeline.", spanish: "Él gestiona el cronograma.", highlightToken: "manages" } },
      { token: "To Be: am / is / are", spanish: "ser o estar", roleNote: "Conecta al sujeto con su estado, profesión o rol.", example: { english: "I am ready for the meeting.", spanish: "Estoy listo para la reunión.", highlightToken: "am ready" } },
    ],
  },

  // ==================== NIVEL 2: NOMBRAR & CALIFICAR OBJETOS ====================
  {
    id: "nouns_articles",
    levelId: 2,
    number: "03",
    name: "Sustantivos & Artículos (A / An / The)",
    tagline: "Nombrar cosas y la regla de no usar 'The'",
    humanConcept: "Los sustantivos en inglés no tienen género masculino/femenino. Y el artículo define si hablas de algo único o de una generalidad.",
    spanishTrapRule: "En español dices 'Me gusta el café'. En inglés, para generalidades NUNCA usas 'the': dices 'Coffee is good'. Usa 'the' solo cuando es algo específico.",
    items: [
      { token: "a + sonido consonante", spanish: "un / una (cualquiera)", roleNote: "Antes de sonido consonante: 'a project', 'a user'.", example: { english: "We started a new project.", spanish: "Iniciamos un nuevo proyecto.", highlightToken: "a" } },
      { token: "an + sonido vocal", spanish: "un / una (para no chocar)", roleNote: "Antes de sonido vocal: 'an email', 'an issue'.", example: { english: "I received an urgent email.", spanish: "Recibí un correo urgente.", highlightToken: "an" } },
      { token: "the (específico)", spanish: "el / la / los / las", roleNote: "Para un objeto o persona ya conocida en el contexto.", example: { english: "The meeting starts at two.", spanish: "La reunión (específica) empieza a las dos.", highlightToken: "The" } },
      { token: "Ø Cero Artículo (generalidades)", spanish: "sin artículo", roleNote: "Generalidades y conceptos abstractos van sin 'the'.", example: { english: "Experience creates confidence.", spanish: "La experiencia crea confianza.", highlightToken: "Experience", comparisonNote: "Sin 'the'." } },
    ],
  },
  {
    id: "adjectives",
    levelId: 2,
    number: "04",
    name: "Adjetivos (Cualidades)",
    tagline: "Siempre ANTES del sustantivo y sin plural 's'",
    humanConcept: "Describen al sustantivo dándole color, cualidad o dimensión. Tienen una posición fija sagrada y jamás cambian en plural.",
    spanishTrapRule: "En español dices 'un problema urgente' y 'decisiones importantes'. En inglés el adjetivo va ANTES ('an urgent problem') y NUNCA lleva 's' ('important decisions').",
    items: [
      { token: "Posición fija (Antes del nombre)", spanish: "Cualidad + Sustantivo", roleNote: "Primero el adjetivo, luego la cosa descrita.", example: { english: "We made an urgent decision.", spanish: "Tomamos una decisión urgente.", highlightToken: "urgent decision" } },
      { token: "Invariables (Sin plural)", spanish: "Nunca llevan 's'", roleNote: "Dices 'different solutions', jamás 'differents solutions'.", example: { english: "We evaluated different options.", spanish: "Evaluamos opciones diferentes.", highlightToken: "different" } },
      { token: "Comparativo (-er / more)", spanish: "más ... que", roleNote: "Cortos: 'faster than'; Largos: 'more efficient than'.", example: { english: "This workflow is faster than before.", spanish: "Este flujo de trabajo es más rápido que antes.", highlightToken: "faster" } },
    ],
  },
  {
    id: "object_possessive",
    levelId: 2,
    number: "05",
    name: "Pronombres Objeto & Posesivos",
    tagline: "¿Quién recibe la acción y de quién es?",
    humanConcept: "Diferencia entre hacer la acción (I), recibirla (me), describir posesión (my) o reemplazarla (mine).",
    spanishTrapRule: "No digas 'He called I'. Quien recibe la acción usa pronombre objeto ('He called me'). Y para posesión usa 'my plan', nunca 'the plan of me'.",
    items: [
      { token: "me / him / her / us / them", spanish: "a mí / a él / a ella / a nosotros / a ellos", roleNote: "Reciben la acción (van tras el verbo o preposición).", example: { english: "Please call me after the session.", spanish: "Por favor llámame a mí tras la sesión.", highlightToken: "me" } },
      { token: "my / your / his / her / our / their", spanish: "mi / tu / su (de él) / su (de ella) / nuestro", roleNote: "Adjetivo posesivo: SIEMPRE acompaña a un sustantivo.", example: { english: "This is our top priority.", spanish: "Esta es nuestra máxima prioridad.", highlightToken: "our" } },
      { token: "mine / yours / hers / theirs", spanish: "el mío / el tuyo / el de ellos", roleNote: "Pronombre posesivo: reemplaza al sustantivo completo.", example: { english: "The final choice is yours.", spanish: "La elección final es tuya.", highlightToken: "yours" } },
    ],
  },

  // ==================== NIVEL 3: ESPACIO, TIEMPO & MODO ====================
  {
    id: "prepositions",
    levelId: 3,
    number: "06",
    name: "Preposiciones de Lugar & Tiempo",
    tagline: "El GPS del inglés: At, On, In, For, To",
    humanConcept: "En español usamos 'en' para todo. En inglés la precisión espacial y temporal es exacta y lógica.",
    spanishTrapRule: "'At' para horas o puntos precisos (at 9am, at the office). 'On' para días y superficies (on Monday, on the screen). 'In' para espacios cerrados, meses y años.",
    items: [
      { token: "at (precisión exacta)", spanish: "en (hora o punto concreto)", roleNote: "at 8:30 · at the station · at work.", example: { english: "We meet at eight in the morning.", spanish: "Nos reunimos a las ocho de la mañana.", highlightToken: "at eight" } },
      { token: "on (días y superficies)", spanish: "el (día) / sobre", roleNote: "on Monday · on the table · on track.", example: { english: "The workshop is on Friday.", spanish: "El taller es el viernes.", highlightToken: "on Friday" } },
      { token: "in (espacios, meses, años)", spanish: "en (dentro de / lapso amplio)", roleNote: "in July · in 2026 · in the building · in English.", example: { english: "I present the summary in English.", spanish: "Presento el resumen en inglés.", highlightToken: "in English" } },
      { token: "for vs to", spanish: "para / hacia", roleNote: "for = destinatario o duración; to = destino o dirección.", example: { english: "I prepared this guide for you.", spanish: "Preparé esta guía para ti.", highlightToken: "for you" } },
    ],
  },
  {
    id: "adverbs",
    levelId: 3,
    number: "07",
    name: "Adverbios de Modo & Frecuencia",
    tagline: "Cómo ocurre y la posición de 'always / never'",
    humanConcept: "Modifican al verbo explicando el modo (-ly = -mente), la frecuencia (always/never) o el momento (today/now).",
    spanishTrapRule: "Los adverbios de frecuencia (always, usually, never) van ENTRE el sujeto y el verbo: 'I always check', nunca 'Always I check'.",
    items: [
      { token: "Modo con terminación -ly", spanish: "terminación '-mente'", roleNote: "clear -> clearly, quick -> quickly, precise -> precisely.", example: { english: "She explained the steps clearly.", spanish: "Ella explicó los pasos claramente.", highlightToken: "clearly" } },
      { token: "Frecuencia (Sujeto + Adv + Verbo)", spanish: "always / usually / never", roleNote: "Van justo antes del verbo principal.", example: { english: "We always test before deployment.", spanish: "Siempre probamos antes del despliegue.", highlightToken: "always test" } },
      { token: "Tiempo y Lugar (Al final)", spanish: "today / now / here / there", roleNote: "Habitualmente al final de la oración.", example: { english: "We will finish the review today.", spanish: "Terminaremos la revisión hoy.", highlightToken: "today" } },
    ],
  },

  // ==================== NIVEL 4: CONTROL DEL VERBO (REGLAS CLAVE) ====================
  {
    id: "auxiliaries_negation",
    levelId: 4,
    number: "08",
    name: "Auxiliares & Negación (Do / Does / Did)",
    tagline: "Cómo decir 'no' en inglés sin romper el verbo",
    humanConcept: "En español niegas poniendo 'no' antes del verbo. En inglés el verbo principal es sagrado y necesita un auxiliar (don't, doesn't, didn't).",
    spanishTrapRule: "Nunca digas 'I no understand' ni 'She no work'. Di 'I don't understand' y 'She doesn't work' (el auxiliar absorbe la 's').",
    items: [
      { token: "don't + verbo base", spanish: "no (I, You, We, They)", roleNote: "Contracción de 'do not' + verbo en forma pura.", example: { english: "I don't agree with that idea.", spanish: "No estoy de acuerdo con esa idea.", highlightToken: "don't agree" } },
      { token: "doesn't + verbo base", spanish: "no (He, She, It)", roleNote: "El auxiliar absorbe la 's'; el verbo vuelve a su base.", example: { english: "She doesn't hesitate under pressure.", spanish: "Ella no duda bajo presión.", highlightToken: "doesn't hesitate" } },
      { token: "didn't + verbo base", spanish: "no (en pasado)", roleNote: "Sirve para todo pasado; el verbo vuelve al presente base.", example: { english: "We didn't miss the deadline.", spanish: "No perdimos la fecha límite.", highlightToken: "didn't miss" } },
    ],
  },
  {
    id: "modal_verbs",
    levelId: 4,
    number: "09",
    name: "Verbos Modales (Can, Should, Must, Would)",
    tagline: "Superpoderes: sin 's', sin 'to', sin 'do'",
    humanConcept: "Palabras maestras que expresan habilidad, consejo, obligación o posibilidad. Tienen sus propias reglas gramaticales únicas.",
    spanishTrapRule: "Regla estricta: NUNCA pongas 'to' después de un modal (di 'I can speak', nunca 'I can to speak') y NUNCA agregues 's' (di 'He can', nunca 'He cans').",
    items: [
      { token: "can / could", spanish: "poder (habilidad / posibilidad)", roleNote: "can = presente; could = pasado o condicional cortés.", example: { english: "I can explain the process clearly.", spanish: "Puedo explicar el proceso con claridad.", highlightToken: "can explain" } },
      { token: "should", spanish: "debería (consejo profesional)", roleNote: "Para recomendaciones suaves y diplomáticas.", example: { english: "We should consider another option.", spanish: "Deberíamos considerar otra opción.", highlightToken: "should consider" } },
      { token: "must / have to", spanish: "debe / tiene que (obligación)", roleNote: "must = necesidad crucial; have to = obligación externa.", example: { english: "We must ensure high quality.", spanish: "Debemos garantizar alta calidad.", highlightToken: "must ensure" } },
      { token: "would", spanish: "terminación -ría (cortesía / propuesta)", roleNote: "Para propuestas elegantes: 'I would recommend...'.", example: { english: "I would recommend this strategy.", spanish: "Recomendaría esta estrategia.", highlightToken: "would recommend" } },
    ],
  },
  {
    id: "gerund_infinitive",
    levelId: 4,
    number: "10",
    name: "Gerundios vs Infinitivos (-ing vs To)",
    tagline: "Cuándo usar -ing y cuándo to + verbo",
    humanConcept: "En inglés, el verbo con '-ing' NO solo es 'haciendo'. También actúa como sustantivo o actividad y va obligatoriamente tras preposiciones.",
    spanishTrapRule: "Para decir 'para trabajar', nunca digas 'for to work'. Usa 'to work' (propósito) o 'for working' (función/herramienta). Tras preposición SIEMPRE va -ing.",
    items: [
      { token: "Verbo-ing como Sujeto (Actividad)", spanish: "aprender / hablar / trabajar", roleNote: "Al inicio de frase como sustantivo: 'Learning is key'.", example: { english: "Speaking every day builds confidence.", spanish: "Hablar todos los días construye confianza.", highlightToken: "Speaking" } },
      { token: "Preposición + Verbo-ing", spanish: "después de for, at, about, in", roleNote: "Regla sagrada: tras preposición, el verbo lleva -ing.", example: { english: "Thank you for joining our team.", spanish: "Gracias por unirte a nuestro equipo.", highlightToken: "for joining" } },
      { token: "to + verbo base (Propósito / Deseo)", spanish: "para + acción / tras want o need", roleNote: "Expresa intención o sigue a want/need/plan: 'I want to improve'.", example: { english: "I practice to improve my fluency.", spanish: "Practico para mejorar mi fluidez.", highlightToken: "to improve" } },
    ],
  },
  {
    id: "basic_tenses",
    levelId: 4,
    number: "11",
    name: "Tiempos Verbales Esenciales",
    tagline: "Rutina vs Ahora vs Pasado vs Futuro",
    humanConcept: "Los 4 tiempos fundamentales que cubren el 90% de la comunicación diaria.",
    spanishTrapRule: "No confundas rutina con momento actual: 'I work' (mi trabajo general) vs 'I am working' (ahora mismo frente a la pantalla).",
    items: [
      { token: "Presente Simple (Rutina)", spanish: "I work / She works", roleNote: "Hechos permanentes y hábitos.", example: { english: "I start work at eight every day.", spanish: "Empiezo a trabajar a las ocho todos los días.", highlightToken: "start" } },
      { token: "Presente Continuo (Ahora)", spanish: "am / is / are + -ing", roleNote: "Acciones ocurriendo en este instante.", example: { english: "We are developing a new feature.", spanish: "Estamos desarrollando una nueva función.", highlightToken: "are developing" } },
      { token: "Pasado Simple (Terminado)", spanish: "worked / saw / made", roleNote: "Acciones completadas en un tiempo específico.", example: { english: "We resolved the issue yesterday.", spanish: "Resolvimos el problema ayer.", highlightToken: "resolved" } },
      { token: "Futuro (will / going to)", spanish: "will = decisión / going to = plan", roleNote: "will + verbo base o Be going to + verbo base.", example: { english: "We will launch next Monday.", spanish: "Lanzaremos el próximo lunes.", highlightToken: "will launch" } },
    ],
  },

  // ==================== NIVEL 5: DOMINIO TOTAL (PREGUNTAS & CONSTRUCCIÓN) ====================
  {
    id: "connectors",
    levelId: 5,
    number: "12",
    name: "Conectores Lógicos",
    tagline: "El pegamento para hablar fluido",
    humanConcept: "Unen dos oraciones completas para que tu discurso fluya naturalmente y no suenes como un telegrama cortado.",
    spanishTrapRule: "No encadenes 'although' y 'but' en la misma oración (interferencia de 'aunque... pero'). Elige uno solo.",
    items: [
      { token: "because / so", spanish: "porque (causa) / así que (efecto)", roleNote: "because = motivo; so = consecuencia lógica.", example: { english: "We tested carefully, so everything worked.", spanish: "Probamos con cuidado, así que todo funcionó.", highlightToken: "so" } },
      { token: "but / although", spanish: "pero / aunque (contraste)", roleNote: "Para matizar dos ideas que contrastan.", example: { english: "Although it was hard, we succeeded.", spanish: "Aunque fue difícil, tuvimos éxito.", highlightToken: "Although" } },
      { token: "however / therefore", spanish: "sin embargo / por lo tanto", roleNote: "Conectores formales de nivel profesional.", example: { english: "The goal is clear; however, we need time.", spanish: "La meta es clara; sin embargo, necesitamos tiempo.", highlightToken: "however" } },
    ],
  },
  {
    id: "questions_qasm",
    levelId: 5,
    number: "13",
    name: "Fórmula de Preguntas (QASM)",
    tagline: "Por qué en inglés no basta con subir el tono",
    humanConcept: "En español haces una pregunta cambiando la entonación. En inglés la pregunta tiene una fórmula matemática fija: QASM.",
    spanishTrapRule: "Nunca preguntes 'You work here?'. En inglés formal DEBES invertir con el auxiliar: 'Do you work here?'.",
    items: [
      { token: "Q = Question Word", spanish: "What / Where / When / Why / How", roleNote: "Palabra interrogativa opcional al inicio.", example: { english: "Where do you work?", spanish: "¿Dónde trabajas?", highlightToken: "Where" } },
      { token: "A = Auxiliary Verb", spanish: "Do / Does / Did / Can / Is / Are", roleNote: "El auxiliar SIEMPRE precede al sujeto.", example: { english: "Do you agree with this decision?", spanish: "¿Estás de acuerdo con esta decisión?", highlightToken: "Do" } },
      { token: "S = Subject", spanish: "you / he / she / they / the team", roleNote: "El protagonista va en medio del auxiliar y verbo.", example: { english: "Does she know the current status?", spanish: "¿Sabe ella el estado actual?", highlightToken: "she" } },
      { token: "M = Main Verb", spanish: "work / know / come / start", roleNote: "El verbo principal va SIEMPRE en forma base.", example: { english: "Why did you choose this solution?", spanish: "¿Por qué elegiste esta solución?", highlightToken: "choose" } },
    ],
  },
  {
    id: "universal_sentence",
    levelId: 5,
    number: "14",
    name: "La Fórmula Universal (SVO / SVOC)",
    tagline: "La plantilla definitiva de cualquier oración",
    humanConcept: "El esqueleto maestro del inglés: Quién + Acción + Objeto + Modo + Lugar + Tiempo.",
    spanishTrapRule: "En español el orden de palabras es flexible. En inglés es rígido: el tiempo y lugar van SIEMPRE al final de la oración.",
    items: [
      { token: "S = Subject (Quién)", spanish: "I / You / The team", roleNote: "El protagonista abre la oración.", example: { english: "Our team delivers results.", spanish: "Nuestro equipo entrega resultados.", highlightToken: "Our team" } },
      { token: "V = Verb (Acción)", spanish: "coordinates / reviews / solves", roleNote: "El motor inmediatamente después del sujeto.", example: { english: "She coordinates the project.", spanish: "Ella coordina el proyecto.", highlightToken: "coordinates" } },
      { token: "O = Object (Destino)", spanish: "the report / the client / the issue", roleNote: "Qué o quién recibe la acción.", example: { english: "We solved the issue efficiently.", spanish: "Resolvimos el problema eficientemente.", highlightToken: "the issue" } },
      { token: "C = Complement (Modo + Lugar + Tiempo)", spanish: "clearly at the office today", roleNote: "Orden final: Modo -> Lugar -> Tiempo.", example: { english: "I present clearly at the office today.", spanish: "Presento con claridad en la oficina hoy.", highlightToken: "clearly at the office today" } },
    ],
  },
];
