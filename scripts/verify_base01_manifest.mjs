import fs from 'node:fs';
import path from 'node:path';

function sanitizeSpeechForVoice(text) {
  if (!text) return "";
  return text
    .replace(/[\u00ab\u00bb\u201c\u201d\u2018\u2019"'\`]/g, " ")
    .replace(/[\[\]\(\)\{\}\*\#\_\~\<\>]/g, " ")
    .replace(/[\u2014\u2013;]/g, ", ")
    .replace(/\s*[\/\\]\s*/g, " o ")
    .replace(/&/g, " y ")
    .replace(/:\s*/g, ", ")
    .replace(/^\s*\d+\.\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

const MANIFEST_PATH = path.resolve('src', 'features', 'pathway', 'data', 'a1AudioManifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

const TEST_PHRASES = [
  "¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar cara a cara en cada paso para que hables inglés con total seguridad. Aquí debajo de mí tienes tu tarjeta interactiva con la regla visual, el armado de fichas y el reto de voz, todo sin salir de esta pantalla. Arriba tienes la Guía de Estudio: ábrela cuando quieras para consultar los 14 Bloques de inglés y el Alfabeto Fonético con audios reales. Y aquí mismo tienes Preguntar para resolver cualquier duda. ¡Entremos directo a la clase!",
  "¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar en cada paso para que hables inglés con total seguridad. Mira tu pantalla: a la izquierda tienes tu pizarra de clase con la regla visual, el ensamblaje de bloques y la certificación de tu voz. Arriba en tu cabecera tienes una ayuda clave: la Guía de Estudio. Ábrela en cualquier momento para consultar la Estructura de los 14 Bloques de inglés y el Alfabeto Fonético completo con audios reales. Y aquí a tu derecha estaré siempre a tu lado para resolver tus dudas con el botón Preguntar. Esta orientación te la comparto solo esta vez para que conozcas tus herramientas. ¡Entremos directo a la clase!",
  "El reto de hoy es El Orden Mágico: Quién + Acción. Sujeto obligatorio + Verbo. Fíjate bien en la diferencia clave en tu pantalla.",
  "El reto de esta base es El Orden Mágico: Quién + Acción. En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción. Mira cómo se ilumina la fórmula pieza por pieza aquí debajo en tu tarjeta: primero quién, luego acción, luego cuándo.",
  "El reto de esta base es El Orden Mágico: Quién + Acción. En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción. Mira cómo se ilumina la fórmula pieza por pieza en tu pizarra: primero quién, luego acción, luego cuándo.",
  "Fíjate bien en la alerta en rojo aquí debajo en tu tarjeta. Siempre abre tu frase nombrando a la persona: I, You, We o They. Por eso tachamos \"Work every day\" y decimos \"I work every day\". Tu ancla mental: En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.",
  "Fíjate bien en la alerta en rojo en tu pizarra. Siempre abre tu frase nombrando a la persona: I, You, We o They. Por eso tachamos \"Work every day\" y decimos \"I work every day\". Tu ancla mental: En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción.",
  "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés.",
  "¡Ojo! Esa es la trampa del español: Siempre abre tu frase nombrando a la persona: I, You, We o They. Toca la otra opción.",
  "¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.",
  "I learn English step by step.",
  "Escucha con atención cómo se unen las palabras al decir \"I learn English step by step\". El truco de pronunciación es ai lérn ínglish step bai step.",
  "I work with my team every morning.",
  "I work every morning.",
  "Si te surge cualquier duda, toca \"Preguntar\" abajo. Ahora constrúyela tú: abro las fichas aquí debajo en tu tarjeta para activar tu memoria motriz. ¡Adelante!",
  "Si te surge cualquier duda, toca \"Preguntar\" abajo. Ahora constrúyela tú: abro las fichas en tu pizarra para activar tu memoria motriz. ¡Adelante!",
  "Ahora es tu turno de construir. Voy a abrir las fichas en tu pizarra para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!",
  "Empieza siempre con quién ('I'), luego la acción ('learn') y al final 'English today'.",
  "¡Excelente! Lo armaste en orden natural: I learn English today. Ahora vamos a certificar tu voz.",
  "Escucha con atención cómo lo pronuncio yo: I learn English today. Ahora activa tu micrófono y dilo tú para certificar tu avance.",
  "I learn English today.",
  "Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance.",
  "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito.",
  "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto.",
  "No te escuché con claridad. Di conmigo: I learn English today. Toca el micrófono para intentarlo.",
  "I work every day.",
  "Work every day.",
  "No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso."
];

let allOk = true;
console.log("=== VERIFYING BASE 01 AUDIOS & MANIFEST LOOKUP ===");

for (const p of TEST_PHRASES) {
  const raw = p.trim();
  const sanitized = sanitizeSpeechForVoice(raw);
  const match = manifest[sanitized] || manifest[raw];

  if (!match) {
    console.error(`[MISSING MANIFEST ENTRY]: "${raw}"`);
    allOk = false;
    continue;
  }

  const diskPath = path.resolve('public', match.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    console.error(`[FILE NOT FOUND ON DISK]: ${diskPath} for "${raw}"`);
    allOk = false;
    continue;
  }

  const size = fs.statSync(diskPath).size;
  if (size < 1000) {
    console.error(`[FILE TOO SMALL]: ${diskPath} (${size} bytes)`);
    allOk = false;
    continue;
  }

  console.log(`[OK 200] "${raw.slice(0, 35)}..." -> ${match} (${size} bytes)`);
}

if (allOk) {
  console.log("\n>>> ALL 23 BASE 01 AUDIO PHRASES VERIFIED 100% OK ON DISK & IN MANIFEST! <<<");
} else {
  console.error("\n>>> SOME AUDIO PHRASES FAILED VERIFICATION! <<<");
  process.exit(1);
}

