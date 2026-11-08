import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const file = 'public/audio/walter_base01_studio_official.mp3';

// Let's get all silences with duration >= 0.4s
const res = spawnSync('ffmpeg', ['-i', file, '-af', 'silencedetect=noise=-25dB:d=0.38', '-f', 'null', '-'], {
  encoding: 'utf-8',
});

const out = (res.stderr || '') + '\n' + (res.stdout || '');
const lines = out.split('\n');
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

console.log('Detected silences (noise -25dB, dur >= 0.38s):', silences.length);
silences.forEach((s, idx) => {
  console.log(`${idx + 1}: [${s.start.toFixed(2)} - ${s.end.toFixed(2)}] (dur ${s.dur.toFixed(2)})`);
});

