import { FoundationUnitSpec } from "../a1Foundations";

export function buildModule1Identity(
  _roleExampleNoun: string,
  _roleExampleEsp: string,
): FoundationUnitSpec[] {
  return [
    // BASE 1: EL ORDEN MÁGICO (Sujeto Obligatorio + Verbo)
    {
      title: "El Orden Mágico: Quién + Acción",
      focus: "Sujeto obligatorio + Verbo",
      payload: {
        ruleTaglineSpanish:
          "En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.",
        formulaSegments: [
          { label: "1. QUIÉN", token: "I / You / We", tone: "violet" },
          { label: "2. ACCIÓN", token: "work / learn", tone: "emerald" },
          { label: "3. CUÁNDO", token: "every day", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "Orden Base",
            segments: [
              { label: "1. QUIÉN", token: "I / You / We", tone: "violet" },
              { label: "2. ACCIÓN", token: "work / learn", tone: "emerald" },
              { label: "3. CUÁNDO", token: "every day", tone: "sky" },
            ],
            explanationSpanish:
              "En español decimos 'Trabajo hoy', pero en inglés siempre abrimos con quién hace la acción.",
            exampleEnglish: "I learn English today.",
          },
        ],
        commonMistake: {
          wrong: "Work every day.",
          wrongToken: "Work",
          correct: "I work every day.",
          correctToken: "I work",
          whySpanish: "Siempre abre tu frase nombrando a la persona: I, You, We o They.",
        },
        examples: [
          {
            english: "I learn English step by step.",
            spanish: "Yo aprendo inglés paso a paso.",
            pronunciationHint: "ai lérn ínglish step bai step",
          },
          {
            english: "I work with my team every morning.",
            spanish: "Yo trabajo con mi equipo cada mañana.",
            pronunciationHint: "ai uórk uiz mai tím évri mórning",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo aprendo inglés hoy",
          targetTokens: ["I", "learn", "English", "today"],
          distractorTokens: ["learns"],
          successTipSpanish: "¡Perfecto! Pusiste primero 'I' (Quién) y luego 'learn' (Acción).",
          mistakeHintSpanish: "Empieza siempre con quién ('I'), luego la acción ('learn') y al final 'English today'.",
        },
        voicePractice: {
          sentenceEnglish: "I learn English today.",
          spanishMeaning: "Yo aprendo inglés hoy.",
          pronunciationHint: "ai lérn ínglish tudéi",
        },
        bridgeModule: {
          target: "reading",
          moduleLabel: "Reading",
          reasonSpanish: "Ya reconoces el orden Sujeto + Verbo. Ve a Reading y observa cómo empieza cada oración.",
        },
      },
    },

    // BASE 2: EL 'IT' FANTASMA (Frases sin persona humana)
    {
      title: "El 'It' Fantasma: Frases sin Persona Humana",
      focus: "Sujeto impersonal 'It' obligatorio",
      payload: {
        ruleTaglineSpanish:
          "Cuando no hay persona física ('Hace frío' o 'Es importante'), el inglés exige abrir con 'It'.",
        formulaSegments: [
          { label: "SUJETO NEUTRO", token: "It", tone: "violet" },
          { label: "VERBO TO BE", token: "is", tone: "emerald" },
          { label: "CLIMA / HORA", token: "cold / 8:00 AM", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Clima y Hora",
            segments: [
              { label: "SUJETO NEUTRO", token: "It", tone: "violet" },
              { label: "ES / ESTÁ", token: "is (It's)", tone: "emerald" },
              { label: "CLIMA / HORA", token: "cold / sunny / 8:00 AM", tone: "sky" },
            ],
            explanationSpanish:
              "Para el clima o la hora nunca empieces con 'Is': abre siempre con el sujeto neutro 'It'.",
            exampleEnglish: "It is sunny outside.",
          },
          {
            label: "02 · Opiniones Neutras",
            segments: [
              { label: "SUJETO NEUTRO", token: "It", tone: "violet" },
              { label: "ES", token: "is (It's)", tone: "emerald" },
              { label: "VALORACIÓN", token: "important / easy / clear", tone: "sky" },
            ],
            explanationSpanish:
              "Para decir 'Es importante' o 'Es fácil', coloca 'It is' al inicio para sostener la frase.",
            exampleEnglish: "It is important today.",
          },
        ],
        commonMistake: {
          wrong: "Is cold today.",
          wrongToken: "Is",
          correct: "It is cold today.",
          correctToken: "It is",
          whySpanish: "En inglés nunca abras una oración con 'Is' sin su sujeto 'It'.",
        },
        examples: [
          {
            english: "It is sunny and warm today.",
            spanish: "Está soleado y cálido hoy.",
            pronunciationHint: "it is sáni and uórm tudéi",
          },
          {
            english: "It is very important to practice every day.",
            spanish: "Es muy importante practicar cada día.",
            pronunciationHint: "it is véri impórtant tu práktis évri déi",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Hace frío hoy",
          targetTokens: ["It", "is", "cold", "today"],
          distractorTokens: ["Is"],
          successTipSpanish: "¡Genial! No dejaste el verbo huérfano: usaste el sujeto 'It'.",
          mistakeHintSpanish: "Coloca siempre 'It' al inicio antes de 'is cold today'.",
        },
        voicePractice: {
          sentenceEnglish: "It is cold today.",
          spanishMeaning: "Hace frío hoy.",
          pronunciationHint: "it is kóuld tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Escribe oraciones neutras usando 'It is' para empezar a redactar notas claras.",
        },
      },
    },

    // BASE 3: SER O ESTAR SIN ENREDOS (Am · Is · Are & Contracciones)
    {
      title: "Ser o Estar sin Enredos (Am · Is · Are)",
      focus: "Verbo To Be en presente y contracciones",
      payload: {
        ruleTaglineSpanish:
          "Un solo verbo cubre ser y estar, dividido en 3 parejas fijas según de quién hables.",
        formulaSegments: [
          { label: "YO", token: "I", tone: "violet" },
          { label: "SER / ESTAR", token: "am (I'm)", tone: "emerald" },
          { label: "IDENTIDAD / ESTADO", token: "ready / here", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Yo (Am)",
            segments: [
              { label: "SUJETO", token: "I", tone: "violet" },
              { label: "TO BE", token: "am (I'm)", tone: "emerald" },
              { label: "ESTADO / ROL", token: "ready / a student", tone: "sky" },
            ],
            explanationSpanish:
              "Contigo mismo ('I') la pareja exclusiva es 'am'. En habla fluida se une como 'I'm'.",
            exampleEnglish: "I am ready today.",
          },
          {
            label: "02 · Él · Ella · Eso (Is)",
            segments: [
              { label: "1 PERSONA / COSA", token: "He / She / It", tone: "violet" },
              { label: "TO BE", token: "is (He's / She's)", tone: "emerald" },
              { label: "ESTADO / ROL", token: "focused / ready", tone: "sky" },
            ],
            explanationSpanish:
              "Cuando hablas de una sola persona o cosa ('He, She, It'), usa únicamente 'is'.",
            exampleEnglish: "She is very focused right now.",
          },
          {
            label: "03 · Tú y Plurales (Are)",
            segments: [
              { label: "TÚ / GRUPO", token: "You / We / They", tone: "violet" },
              { label: "TO BE", token: "are (You're / We're)", tone: "emerald" },
              { label: "ESTADO / LUGAR", token: "here / on time", tone: "sky" },
            ],
            explanationSpanish:
              "Con 'You' y con cualquier grupo ('We, They'), la pareja obligatoria es siempre 'are'.",
            exampleEnglish: "We are ready to start.",
          },
        ],
        commonMistake: {
          wrong: "She are ready.",
          wrongToken: "are",
          correct: "She is ready.",
          correctToken: "is",
          whySpanish: "Cuando hablas de una sola persona ajena (He o She), su pareja fija es 'is'.",
        },
        examples: [
          {
            english: "I am ready to start my lesson.",
            spanish: "Estoy listo para empezar mi lección.",
            pronunciationHint: "ai am rédi tu start mai léson",
          },
          {
            english: "She is very focused right now.",
            spanish: "Ella está muy concentrada ahora mismo.",
            pronunciationHint: "shi is véri fókast ráit náu",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo estoy listo hoy",
          targetTokens: ["I", "am", "ready", "today"],
          distractorTokens: ["is", "are"],
          successTipSpanish: "¡Brillante! 'I' siempre camina de la mano con 'am'.",
          mistakeHintSpanish: "Recuerda la pareja fija: 'I' siempre va con 'am'.",
        },
        voicePractice: {
          sentenceEnglish: "I am ready today.",
          spanishMeaning: "Yo estoy listo hoy.",
          pronunciationHint: "ai am rédi tudéi",
        },
        bridgeModule: {
          target: "writing",
          moduleLabel: "Writing Studio",
          reasonSpanish: "Con 'I am' y 'She is' redacta una presentación breve y segura.",
        },
      },
    },

    // BASE 4: LA TRAMPA DE 'TENER' ESTADOS Y EDAD
    {
      title: "La Trampa de 'Tener' Estados y Edad",
      focus: "To Be para sensaciones físicas y edad",
      payload: {
        ruleTaglineSpanish:
          "En inglés no 'tienes' hambre, frío ni años: usas To Be (am, is, are), nunca Have.",
        formulaSegments: [
          { label: "PERSONA", token: "I", tone: "violet" },
          { label: "ESTAR", token: "am (I'm)", tone: "emerald" },
          { label: "SENSACIÓN", token: "hungry / cold / thirsty", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Sensaciones Físicas",
            segments: [
              { label: "PERSONA", token: "I", tone: "violet" },
              { label: "ESTAR", token: "am (I'm)", tone: "emerald" },
              { label: "SENSACIÓN", token: "hungry / cold / sleepy", tone: "sky" },
            ],
            explanationSpanish:
              "Para hambre, sed, frío o sueño dices que 'estás' así ('I am hungry'), jamás con 'have'.",
            exampleEnglish: "I am hungry now.",
          },
          {
            label: "02 · Decir la Edad",
            segments: [
              { label: "PERSONA", token: "He / She", tone: "violet" },
              { label: "SER", token: "is", tone: "emerald" },
              { label: "EDAD", token: "30 years old", tone: "sky" },
            ],
            explanationSpanish:
              "La edad en inglés es parte de quién eres: usa 'am / is / are' + el número, nunca 'have'.",
            exampleEnglish: "He is 30 years old.",
          },
        ],
        commonMistake: {
          wrong: "I have 25 years.",
          wrongToken: "have",
          correct: "I am 25 years old.",
          correctToken: "am",
          whySpanish: "La edad y las sensaciones en inglés se describen con 'am/is/are', nunca con 'have'.",
        },
        examples: [
          {
            english: "I am hungry and thirsty.",
            spanish: "Tengo hambre y sed.",
            pronunciationHint: "ai am jángri and zérsti",
          },
          {
            english: "He is 30 years old.",
            spanish: "Él tiene 30 años.",
            pronunciationHint: "ji is zérti yíars óuld",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma en inglés: Yo tengo hambre ahora",
          targetTokens: ["I", "am", "hungry", "now"],
          distractorTokens: ["have"],
          successTipSpanish: "¡Excelente! No caíste en la trampa de 'have'. Usaste 'am hungry'.",
          mistakeHintSpanish: "En inglés dices 'I am hungry', no uses el verbo 'have'.",
        },
        voicePractice: {
          sentenceEnglish: "I am hungry now.",
          spanishMeaning: "Yo tengo hambre ahora.",
          pronunciationHint: "ai am jángri náu",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Di tu edad con 'I am' con total naturalidad cuando te presentes en Interview.",
        },
      },
    },

    // BASE 5: SER O ESTAR EN NEGATIVO & PREGUNTA
    {
      title: "Ser o Estar en Negativo & Pregunta",
      focus: "Isn't, Aren't e inversión para preguntas",
      payload: {
        ruleTaglineSpanish:
          "Con To Be niegas agregando 'not' al verbo y preguntas moviendo el verbo al inicio.",
        formulaSegments: [
          { label: "TO BE AL INICIO", token: "Are", tone: "violet" },
          { label: "PERSONA", token: "you / they", tone: "emerald" },
          { label: "ESTADO", token: "ready today?", tone: "sky" },
        ],
        formulaCases: [
          {
            label: "01 · Negar (+ not)",
            segments: [
              { label: "PERSONA", token: "He / She", tone: "violet" },
              { label: "TO BE + NOT", token: "isn't (is not)", tone: "emerald" },
              { label: "ESTADO", token: "busy / late", tone: "sky" },
            ],
            explanationSpanish:
              "Para negar pon 'not' tras el verbo: 'I am not', 'He isn't' o 'We aren't'.",
            exampleEnglish: "He isn't busy right now.",
          },
          {
            label: "02 · Preguntar (Invertir)",
            segments: [
              { label: "TO BE PRIMERO", token: "Are", tone: "violet" },
              { label: "PERSONA", token: "you / they", tone: "emerald" },
              { label: "COMPLEMENTO", token: "ready today?", tone: "sky" },
            ],
            explanationSpanish:
              "Para preguntar invierte el orden: abre con 'Are' (o 'Is' para he/she) antes de la persona.",
            exampleEnglish: "Are you ready today?",
          },
        ],
        commonMistake: {
          wrong: "You are ready?",
          wrongToken: "You are",
          correct: "Are you ready?",
          correctToken: "Are you",
          whySpanish: "En preguntas directas con To Be, coloca 'Are' o 'Is' antes de la persona.",
        },
        examples: [
          {
            english: "Are you ready for the meeting?",
            spanish: "¿Estás listo para la reunión?",
            pronunciationHint: "ar yu rédi for de míting?",
          },
          {
            english: "He isn't busy right now.",
            spanish: "Él no está ocupado en este momento.",
            pronunciationHint: "ji ísent bísi ráit náu",
          },
        ],
        blockChallenge: {
          promptSpanish: "Arma la pregunta: ¿Estás listo hoy?",
          targetTokens: ["Are", "you", "ready", "today?"],
          distractorTokens: ["You", "is"],
          successTipSpanish: "¡Impecable! Invertiste la posición y abriste con 'Are you'.",
          mistakeHintSpanish: "Coloca 'Are' primero, luego 'you' y después 'ready today?'.",
        },
        voicePractice: {
          sentenceEnglish: "Are you ready today?",
          spanishMeaning: "¿Estás listo hoy?",
          pronunciationHint: "ar yu rédi tudéi?",
        },
        bridgeModule: {
          target: "interview",
          moduleLabel: "Interview",
          reasonSpanish: "Responde a 'Are you ready?' con 'Yes, I am!' con total seguridad.",
        },
      },
    },
  ];
}
