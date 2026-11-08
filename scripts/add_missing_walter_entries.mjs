import fs from 'node:fs';
import path from 'node:path';

function sanitizeSpeechForVoice(text) {
  if (!text) return '';
  return text
    .replace(/[\u00ab\u00bb\u201c\u201d\u2018\u2019"'\`]/g, ' ')
    .replace(/[\[\]\(\)\{\}\*\#\_\~\<\>]/g, ' ')
    .replace(/[\u2014\u2013;]/g, ', ')
    .replace(/\s*[\/\\]\s*/g, ' o ')
    .replace(/&/g, ' y ')
    .replace(/:\s*/g, ', ')
    .replace(/^\s*\d+\.\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const MANIFEST_PATH = path.resolve('src', 'features', 'pathway', 'data', 'a1AudioManifest.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

const entries = [
  { text: 'I work every day.', url: '/audio/pathway/a1/base_01/trap_sample.mp3' },
  { text: 'I work every day', url: '/audio/pathway/a1/base_01/trap_sample.mp3' },
  { text: 'Work every day.', url: '/audio/pathway/a1/base_01/trap_wrong.mp3' },
  { text: 'Work every day', url: '/audio/pathway/a1/base_01/trap_wrong.mp3' },
  { text: 'No pude activar tu micrófono. Verifica el permiso del navegador o usa el modo silencioso.', url: '/audio/pathway/a1/base_01/mic_error.mp3' }
];

for (const e of entries) {
  manifest[e.text] = e.url;
  manifest[e.text.trim()] = e.url;
  manifest[sanitizeSpeechForVoice(e.text)] = e.url;
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
console.log('Manifest updated successfully with new Walter entries!');

