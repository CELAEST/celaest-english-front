import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const API_KEY = 'sk_5rrw5z74y782g2gd29v8r1qckt1t3x45j7m38353f7s';
const OUT_DIR = path.resolve('public', 'audio', 'pathway', 'a1');
const MANIFEST_PATH = path.resolve('src', 'features', 'pathway', 'data', 'a1AudioManifest.json');

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

const ITEMS = [
  {
    fileName: 'orientation_mobile.mp3',
    publicUrl: '/audio/pathway/a1/orientation_mobile.mp3',
    text: '¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar cara a cara en cada paso para que hables inglés con total seguridad. Aquí debajo de mí tienes tu tarjeta interactiva con la regla visual, el armado de fichas y el reto de voz, todo sin salir de esta pantalla. Arriba tienes la Guía de Estudio: ábrela cuando quieras para consultar los 14 Bloques de inglés y el Alfabeto Fonético con audios reales. Y aquí mismo tienes Preguntar para resolver cualquier duda. ¡Entremos directo a la clase!'
  },
  {
    fileName: 'orientation_desktop.mp3',
    publicUrl: '/audio/pathway/a1/orientation_desktop.mp3',
    text: '¡Hola! Qué gusto saludarte. Soy Liam, tu mentor personal en CELAEST. Te voy a acompañar en cada paso para que hables inglés con total seguridad. Mira tu pantalla: a la izquierda tienes tu pizarra de clase con la regla visual, el ensamblaje de bloques y la certificación de tu voz. Arriba en tu cabecera tienes una ayuda clave: la Guía de Estudio. Ábrela en cualquier momento para consultar la Estructura de los 14 Bloques de inglés y el Alfabeto Fonético completo con audios reales. Y aquí a tu derecha estaré siempre a tu lado para resolver tus dudas con el botón Preguntar. Esta orientación te la comparto solo esta vez para que conozcas tus herramientas. ¡Entremos directo a la clase!'
  }
];

async function main() {
  console.log('Generating Walter Speechify audio for Orientation texts...');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

  for (const item of ITEMS) {
    const filePath = path.join(OUT_DIR, item.fileName);
    console.log(`Generating: ${item.fileName}...`);
    const buf = await generateSpeechify(item.text);
    fs.writeFileSync(filePath, buf);
    console.log(`  -> SUCCESS: ${item.fileName} (${buf.length} bytes)`);

    // Map in manifest
    manifest[item.text] = item.publicUrl;
    manifest[item.text.trim()] = item.publicUrl;
    manifest[sanitizeSpeechForVoice(item.text)] = item.publicUrl;
  }

  // Also replace any legacy pointers to base_06/seg_01.mp3
  for (const [k, v] of Object.entries(manifest)) {
    if (v.includes('base_06/seg_01.mp3')) {
      manifest[k] = '/audio/pathway/a1/orientation_desktop.mp3';
      console.log('  -> Remapped legacy key away from base_06:', k.slice(0, 50));
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('Manifest updated with 100% Walter orientation audio!');
}

main().catch(console.error);
