import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Master script to slice the multi-base Speechify download automatically
const DOWNLOADS_DIR = 'C:/Users/user/Downloads';
const MANIFEST_PATH = 'src/features/pathway/data/a1AudioManifest.json';

// Locate newest MP3 in Downloads
function getNewestDownload() {
  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.endsWith('.mp3'))
    .map(f => {
      const full = path.join(DOWNLOADS_DIR, f);
      return { file: full, stat: fs.statSync(full) };
    })
    .sort((a, b) => b.stat.mtimeMs - a.stat.mtimeMs);
  return files[0]?.file || null;
}

console.log('=== CELAEST A1 MEGA SLICING ENGINE ===');
const targetFile = process.argv[2] || getNewestDownload();

if (!targetFile || !fs.existsSync(targetFile)) {
  console.error('No valid MP3 found to slice. Pass path as argument or ensure an MP3 is in Downloads.');
  process.exit(1);
}

console.log(`Processing master audio: ${targetFile}`);

// Read manifest
let manifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
}

// Function to detect silences using ffmpeg
console.log('Detecting silences with ffmpeg...');
const res = spawnSync('ffmpeg', ['-i', targetFile, '-af', 'silencedetect=noise=-22dB:d=0.35', '-f', 'null', '-'], {
  encoding: 'utf-8',
  maxBuffer: 50 * 1024 * 1024
});

const lines = (res.stderr || '').split('\n');
const silences = [];
let curStart = null;

for (const line of lines) {
  const mStart = line.match(/silence_start: ([\d.]+)/);
  if (mStart) curStart = parseFloat(mStart[1]);
  const mEnd = line.match(/silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/);
  if (mEnd && curStart !== null) {
    silences.push({ start: curStart, end: parseFloat(mEnd[1]), dur: parseFloat(mEnd[2]) });
    curStart = null;
  }
}

console.log(`Detected ${silences.length} clean silence separators in audio file.`);

