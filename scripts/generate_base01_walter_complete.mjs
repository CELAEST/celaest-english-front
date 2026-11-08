import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const API_KEY = 'sk_5rrw5z74y782g2gd29v8r1qckt1t3x45j7m38353f7s';
const OUT_DIR = path.resolve('public', 'audio', 'pathway', 'a1', 'base_01');
const MANIFEST_PATH = path.resolve('src', 'features', 'pathway', 'data', 'a1AudioManifest.json');

fs.mkdirSync(OUT_DIR, { recursive: true });

function generateSpeechify(text, voiceId = 'walter', model = 'simba-3.2') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      input: text.trim(),
      voice_id: voiceId,
      model: model,
    });

    const req = https.request(
      {
        hostname: 'api.speechify.ai',
        path: '/v1/audio/stream',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks);
          if (res.statusCode === 200) {
            resolve(body);
          } else {
            reject(new Error(`Speechify error ${res.statusCode}: ${body.toString()}`));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function sanitizeSpeechForVoice(text) {
  if (!text) return "";
  let clean = text;
  // Strip markdown, quotes, emojis, double punctuation
  clean = clean.replace(/[*_#`~[\]]/g, "");
  clean = clean.replace(/[“”"«»]/g, "");
  clean = clean.replace(/([.!?]){2,}/g, "$1");
  return clean.trim();
}

const ITEMS = [
  {
    id: "lesson_intro",
    text: "El reto de hoy es El Orden Mágico: Quién + Acción. Sujeto obligatorio + Verbo. Fíjate bien en la diferencia clave en tu pantalla."
  },
  {
    id: "seg_01",
    text: "El reto de esta base es El Orden Mágico: Quién + Acción. En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción. Mira cómo se ilumina la fórmula pieza por pieza aquí debajo en tu tarjeta: primero quién, luego acción, luego cuándo."
  },
  {
    id: "seg_01_desktop",
    text: "El reto de esta base es El Orden Mágico: Quién + Acción. En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción. Mira cómo se ilumina la fórmula pieza por pieza en tu pizarra: primero quién, luego acción, luego cuándo."
  },
  {
    id: "seg_02",
    text: "Fíjate bien en la alerta en rojo aquí debajo en tu tarjeta. Siempre abre tu frase nombrando a la persona: I, You, We o They. Por eso tachamos \"Work every day\" y decimos \"I work every day\". Tu ancla mental: En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción."
  },
  {
    id: "seg_02_desktop",
    text: "Fíjate bien en la alerta en rojo en tu pizarra. Siempre abre tu frase nombrando a la persona: I, You, We o They. Por eso tachamos \"Work every day\" y decimos \"I work every day\". Tu ancla mental: En inglés el verbo nunca va solo: siempre nombra primero quién realiza la acción."
  },
  {
    id: "seg_03",
    text: "¡Probemos tu oído ahora mismo! Antes de ver los ejemplos, toca cuál de estas dos frases suena natural en inglés."
  },
  {
    id: "trap_error",
    text: "¡Ojo! Esa es la trampa del español: Siempre abre tu frase nombrando a la persona: I, You, We o They. Toca la otra opción."
  },
  {
    id: "trap_success",
    text: "¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales."
  },
  {
    id: "seg_04",
    text: "I learn English step by step."
  },
  {
    id: "seg_05",
    text: "Escucha con atención cómo se unen las palabras al decir \"I learn English step by step\". El truco de pronunciación es ai lérn ínglish step bai step."
  },
  {
    id: "seg_06",
    text: "I work with my team every morning."
  },
  {
    id: "seg_06_alt",
    text: "I work every morning."
  },
  {
    id: "seg_07",
    text: "Si te surge cualquier duda, toca \"Preguntar\" abajo. Ahora constrúyela tú: abro las fichas aquí debajo en tu tarjeta para activar tu memoria motriz. ¡Adelante!"
  },
  {
    id: "seg_07_desktop",
    text: "Si te surge cualquier duda, toca \"Preguntar\" abajo. Ahora constrúyela tú: abro las fichas en tu pizarra para activar tu memoria motriz. ¡Adelante!"
  },
  {
    id: "build_intro",
    text: "Ahora es tu turno de construir. Voy a abrir las fichas en tu pizarra para que las toques en orden y forjes tu memoria motriz. ¡Adelante, tú puedes!"
  },
  {
    id: "challenge_error",
    text: "Empieza siempre con quién ('I'), luego la acción ('learn') y al final 'English today'."
  },
  {
    id: "challenge_success",
    text: "¡Excelente! Lo armaste en orden natural: I learn English today. Ahora vamos a certificar tu voz."
  },
  {
    id: "voice_instruction",
    text: "Escucha con atención cómo lo pronuncio yo: I learn English today. Ahora activa tu micrófono y dilo tú para certificar tu avance."
  },
  {
    id: "voice_sample",
    text: "I learn English today."
  },
  {
    id: "voice_retry",
    text: "Casi lo tienes. Escucha el modelo de nuevo con atención y dilo con calma para certificar tu avance."
  },
  {
    id: "voice_victory",
    text: "¡Excelente pronunciación! Dijiste cada palabra en orden natural y con cadencia limpia. Base conquistada con éxito."
  },
  {
    id: "voice_victory_alt",
    text: "¡Impecable! Base conquistada con éxito. Ya estás listo para el siguiente reto."
  },
  {
    id: "voice_not_heard",
    text: "No te escuché con claridad. Di conmigo: I learn English today. Toca el micrófono para intentarlo."
  }
];

async function main() {
  console.log("=== BAKE BASE 01: 100% PURE WALTER (SPEECHIFY) ===");
  console.log(`Total items to ensure: ${ITEMS.length}`);

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf-8"));
    } catch {}
  }

  for (const item of ITEMS) {
    const fileName = `${item.id}.mp3`;
    const filePath = path.join(OUT_DIR, fileName);
    const publicUrl = `/audio/pathway/a1/base_01/${fileName}`;

    console.log(`\nGenerating item [${item.id}]: "${item.text.slice(0, 45)}..."`);
    try {
      const audioBuf = await generateSpeechify(item.text);
      fs.writeFileSync(filePath, audioBuf);
      console.log(`  -> SUCCESS: ${fileName} (${audioBuf.length} bytes)`);

      // Map raw and sanitized in manifest
      manifest[item.text] = publicUrl;
      manifest[item.text.trim()] = publicUrl;
      const s = sanitizeSpeechForVoice(item.text);
      if (s) {
        manifest[s] = publicUrl;
      }
    } catch (err) {
      console.error(`  -> ERROR on ${item.id}:`, err.message);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
  console.log("\n>>> Base 01 audio manifest written successfully! Total keys in manifest:", Object.keys(manifest).length);
}

main().catch(console.error);

