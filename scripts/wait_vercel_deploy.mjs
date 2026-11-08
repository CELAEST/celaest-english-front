import https from 'node:https';

function check(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve({
        status: res.statusCode,
        length: res.headers['content-length'],
        type: res.headers['content-type'],
      });
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

async function loop() {
  const targetUrl = 'https://celaest-english-front.vercel.app/audio/pathway/a1/base_01/lesson_intro.mp3';
  for (let i = 0; i < 20; i++) {
    const res = await check(targetUrl);
    console.log(`[Attempt ${i + 1}]`, res);
    // New slice of lesson_intro.mp3 is 314766 bytes
    if (res.status === 200 && res.length === '314766') {
      console.log('NEW SPEECHIFY STUDIO WALTER AUDIOS DEPLOYED TO VERCEL PRODUCTION!');
      process.exit(0);
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  console.log('Timeout waiting for deployment');
}

loop();
