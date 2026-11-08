import { spawnSync } from 'node:child_process';

const master = 'public/audio/walter_base01_studio_official.mp3';

function slice(start, end, outFile) {
  spawnSync('ffmpeg', ['-y', '-ss', String(start), '-to', String(end), '-i', master, outFile], { stdio: 'ignore' });
}

slice(210.3, 217.5, 'public/audio/test_final_retry.mp3');
slice(217.6, 226.2, 'public/audio/test_final_not_heard.mp3');
slice(226.3, 234.5, 'public/audio/test_final_mic_err.mp3');
slice(234.6, 243.4, 'public/audio/test_final_victory.mp3');
