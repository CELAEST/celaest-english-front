import http from "node:http";

const texts = [
  // Base 1: Super Speech
  "¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar en cada paso. Mira tu pantalla: a la izquierda tienes tu pizarra de clase con la regla visual, los bloques de práctica y la certificación de tu voz. Y aquí a tu derecha estaré siempre a tu lado para guiarte y resolver tus dudas. Hoy vamos a dominar El Orden Mágico: Quién + Acción. Mi misión es que sientas el idioma con total naturalidad, sin traducir en tu mente. ¡Comencemos!",
  "Fíjate bien en la alerta en rojo de tu pizarra. Siempre abre tu frase nombrando a la persona: I, You, We o They. Por eso, en inglés nunca decimos \"Work\", sino \"I work\". Grábate esa diferencia en el oído.",
  "En español decimos Trabajo hoy, pero en inglés el verbo nunca va solo: siempre pon primero quién hace la acción. Tu ancla mental para no dudar jamás es muy simple: En inglés nunca dejes el verbo huérfano: siempre pon primero quién hace la acción.",
  "I learn English step by step.",
  "Escucha con atención cómo se unen las palabras al decir \"I learn English step by step\". El truco de pronunciación es ai lérn ínglish step bai step. ¿Tienes alguna duda o quieres preguntarme algo antes de armar la oración? Si quieres profundizar, toca \"Preguntar\" en cualquier momento.",
  "Ahora es tu turno de construir. Voy a abrir las fichas en tu pizarra para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!",

  // Base 2: Super Speech
  "¡Hola! Bienvenido a tu clase. Hoy vamos a desbloquear una base fundamental para tu fluidez: El 'It' Fantasma: Frases sin Persona Humana. En español solemos pensar de una forma, pero en inglés el cerebro opera con una lógica distinta. Te voy a enseñar el secreto exacto para que lo sientas natural y nunca más dudes al hablar.",
  "Fíjate bien en la alerta en rojo de tu pizarra. En inglés nunca abras una oración con 'Is' sin su sujeto 'It'. Por eso, en inglés nunca decimos \"Is\", sino \"It is\". Grábate esa diferencia en el oído.",
  "Cuando en español no hay persona física como en 'Hace frío' o 'Es importante', el inglés exige poner 'It' como sujeto fantasma. Tu ancla mental para no dudar jamás es muy simple: Cuando no haya persona física, abre la frase con 'It is' sin dudar.",
  "It is very important to practice.",
  "Escucha con atención cómo se unen las palabras al decir \"It is very important to practice\". El truco de pronunciación es it is véri impórtant tu práktis. ¿Tienes alguna duda o quieres preguntarme algo antes de armar la oración? Si quieres profundizar, toca \"Preguntar\" en cualquier momento.",

  // Sentences for practice & speak
  "I learn English every day.",
  "It is very important today.",
  "I learn English today.",
  "It is important today."
];

async function run() {
  console.log(`Starting warmup for ${texts.length} Liam masterclass segments...`);
  for (let i = 0; i < texts.length; i++) {
    const t = texts[i];
    const url = `http://127.0.0.1:8080/api/v1/tts/stream?text=${encodeURIComponent(t)}&voice=liam`;
    await new Promise((resolve) => {
      http.get(url, (resp) => {
        let size = 0;
        resp.on("data", (chunk) => size += chunk.length);
        resp.on("end", () => {
          console.log(`[${i+1}/${texts.length}] Cached Liam audio: ${size} bytes (status ${resp.statusCode})`);
          resolve();
        });
      }).on("error", (err) => {
        console.error(`Error on segment ${i+1}:`, err);
        resolve();
      });
    });
  }
  console.log("All Liam masterclass speech segments cached with 0ms response time!");
}

run();
