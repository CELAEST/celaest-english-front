import fs from 'node:fs';
import https from 'node:https';

const API_KEY = 'sk_5rrw5z74y782g2gd29v8r1qckt1t3x45j7m38353f7s';

function generateSpeechify(text, voiceId = 'walter', model = 'simba-3.2') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      input: text,
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

async function test() {
  console.log('Testing Speechify API with Walter...');
  try {
    const buf = await generateSpeechify('¡Exacto! Cazaste la trampa. Escucha ahora cómo suena en ejemplos reales.');
    fs.writeFileSync('public/audio/test_speechify_api.mp3', buf);
    console.log('SUCCESS! Generated file size:', buf.length, 'bytes');
  } catch (e) {
    console.error('FAILED:', e.message);
  }
}

test();

