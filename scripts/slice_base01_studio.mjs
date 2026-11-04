import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const MASTER_FILE = 'public/audio/walter_base01_studio_official.mp3';
const BASE01_DIR = 'public/audio/pathway/a1/base_01';
const A1_DIR = 'public/audio/pathway/a1';

fs.mkdirSync(BASE01_DIR, { recursive: true });
fs.mkdirSync(A1_DIR, { recursive: true });

const SLICES = [
  { name: 'orientation_mobile.mp3', dest: [path.join(A1_DIR, 'orientation_mobile.mp3'), path.join(A1_DIR, 'orientation_desktop.mp3')], start: 0.0, end: 36.8 },
  { name: 'lesson_intro.mp3', dest: [path.join(BASE01_DIR, 'lesson_intro.mp3')], start: 37.0, end: 56.6 },
  { name: 'seg_01.mp3', dest: [path.join(BASE01_DIR, 'seg_01.mp3'), path.join(BASE01_DIR, 'seg_01_desktop.mp3')], start: 56.8, end: 77.2 },
  { name: 'voice_sample.mp3', dest: [path.join(BASE01_DIR, 'voice_sample.mp3')], start: 77.8, end: 80.8 },
  { name: 'seg_02.mp3', dest: [path.join(BASE01_DIR, 'seg_02.mp3'), path.join(BASE01_DIR, 'seg_02_desktop.mp3')], start: 81.2, end: 102.4 },
  { name: 'seg_03.mp3', dest: [path.join(BASE01_DIR, 'seg_03.mp3')], start: 102.7, end: 110.8 },
  { name: 'trap_wrong.mp3', dest: [path.join(BASE01_DIR, 'trap_wrong.mp3')], start: 110.9, end: 113.2 },
  { name: 'trap_sample.mp3', dest: [path.join(BASE01_DIR, 'trap_sample.mp3')], start: 113.3, end: 115.3 },
  { name: 'trap_error.mp3', dest: [path.join(BASE01_DIR, 'trap_error.mp3')], start: 115.3, end: 125.8 },
  { name: 'trap_success.mp3', dest: [path.join(BASE01_DIR, 'trap_success.mp3')], start: 126.1, end: 132.3 },
  { name: 'seg_04.mp3', dest: [path.join(BASE01_DIR, 'seg_04.mp3')], start: 132.5, end: 135.8 },
  { name: 'seg_05.mp3', dest: [path.join(BASE01_DIR, 'seg_05.mp3')], start: 136.0, end: 151.1 },
  { name: 'seg_06.mp3', dest: [path.join(BASE01_DIR, 'seg_06.mp3')], start: 151.2, end: 154.4 },
  { name: 'seg_06_alt.mp3', dest: [path.join(BASE01_DIR, 'seg_06_alt.mp3')], start: 154.5, end: 156.4 },
  { name: 'seg_07.mp3', dest: [path.join(BASE01_DIR, 'seg_07.mp3'), path.join(BASE01_DIR, 'seg_07_desktop.mp3')], start: 156.5, end: 169.5 },
  { name: 'build_intro.mp3', dest: [path.join(BASE01_DIR, 'build_intro.mp3')], start: 169.7, end: 184.8 },
  { name: 'challenge_error.mp3', dest: [path.join(BASE01_DIR, 'challenge_error.mp3')], start: 185.0, end: 191.0 },
  { name: 'challenge_success.mp3', dest: [path.join(BASE01_DIR, 'challenge_success.mp3')], start: 191.2, end: 202.0 },
  { name: 'voice_instruction.mp3', dest: [path.join(BASE01_DIR, 'voice_instruction.mp3')], start: 202.4, end: 210.2 },
  { name: 'voice_retry.mp3', dest: [path.join(BASE01_DIR, 'voice_retry.mp3')], start: 210.4, end: 217.9 },
  { name: 'voice_not_heard.mp3', dest: [path.join(BASE01_DIR, 'voice_not_heard.mp3')], start: 218.0, end: 226.7 },
  { name: 'mic_error.mp3', dest: [path.join(BASE01_DIR, 'mic_error.mp3')], start: 226.8, end: 234.5 },
  { name: 'voice_victory.mp3', dest: [path.join(BASE01_DIR, 'voice_victory.mp3'), path.join(BASE01_DIR, 'voice_victory_alt.mp3')], start: 234.6, end: 243.4 }
];

console.log('=== SLICING 23 BASE 01 AUDIO SEGMENTS FROM SPEECHIFY STUDIO MASTER ===');

for (const s of SLICES) {
  const primaryDest = s.dest[0];
  const dur = (s.end - s.start).toFixed(2);
  console.log(`Slicing ${s.name} [${s.start}s -> ${s.end}s] (${dur}s)...`);
  
  const res = spawnSync('ffmpeg', ['-y', '-ss', String(s.start), '-to', String(s.end), '-i', MASTER_FILE, '-c:a', 'libmp3lame', '-b:a', '128k', primaryDest], {
    encoding: 'utf-8'
  });
  
  if (res.status !== 0) {
    console.error(`ERROR slicing ${s.name}:`, res.stderr);
    process.exit(1);
  }
  
  const stat = fs.statSync(primaryDest);
  console.log(`  -> OK: ${primaryDest} (${stat.size} bytes)`);

  for (let i = 1; i < s.dest.length; i++) {
    fs.copyFileSync(primaryDest, s.dest[i]);
    console.log(`  -> Copied to alias: ${s.dest[i]}`);
  }
}

console.log('\n>>> ALL 23 BASE 01 STUDIO SLICES COMPLETED 100% CLEANLY! <<<');
