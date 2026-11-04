/**
 * One featured example per structure block: the typical Spanish-speaker
 * mistake vs the natural English sentence, with the exact part that
 * demonstrates the topic marked in `highlight`.
 */
export interface AnatomyShowcase {
  wrong: string;
  correct: string;
  highlight: string;
  spanish: string;
}

export const ANATOMY_SHOWCASE: Record<string, AnatomyShowcase> = {
  subjects: { wrong: "Is raining today.", correct: "It is raining today.", highlight: "It", spanish: "Está lloviendo hoy." },
  action_and_to_be: { wrong: "I am agree with you.", correct: "I agree with you.", highlight: "agree", spanish: "Estoy de acuerdo contigo." },
  nouns_articles: { wrong: "The coffee is my favorite drink.", correct: "Coffee is my favorite drink.", highlight: "Coffee", spanish: "El café es mi bebida favorita." },
  adjectives: { wrong: "We have a meeting important.", correct: "We have an important meeting.", highlight: "important meeting", spanish: "Tenemos una reunión importante." },
  object_possessive: { wrong: "She called I yesterday.", correct: "She called me yesterday.", highlight: "me", spanish: "Ella me llamó ayer." },
  prepositions: { wrong: "The meeting is in Monday at the morning.", correct: "The meeting is on Monday in the morning.", highlight: "on Monday in the morning", spanish: "La reunión es el lunes en la mañana." },
  adverbs: { wrong: "Always I check my email.", correct: "I always check my email.", highlight: "always", spanish: "Siempre reviso mi correo." },
  auxiliaries_negation: { wrong: "She no understand the plan.", correct: "She doesn't understand the plan.", highlight: "doesn't understand", spanish: "Ella no entiende el plan." },
  modal_verbs: { wrong: "I can to help you.", correct: "I can help you.", highlight: "can help", spanish: "Puedo ayudarte." },
  gerund_infinitive: { wrong: "Thanks for to come.", correct: "Thanks for coming.", highlight: "for coming", spanish: "Gracias por venir." },
  basic_tenses: { wrong: "I work on the report now.", correct: "I am working on the report now.", highlight: "am working", spanish: "Estoy trabajando en el informe ahora." },
  connectors: { wrong: "Although it was hard, but we finished.", correct: "Although it was hard, we finished.", highlight: "Although", spanish: "Aunque fue difícil, terminamos." },
  questions_qasm: { wrong: "You work here?", correct: "Do you work here?", highlight: "Do you work", spanish: "¿Trabajas aquí?" },
  universal_sentence: { wrong: "Today I in the office present the plan.", correct: "I present the plan at the office today.", highlight: "I present the plan", spanish: "Hoy presento el plan en la oficina." },
};

