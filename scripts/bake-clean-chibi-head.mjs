import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("c:/Users/user/Music/landing-celaest/node_modules/playwright");

const TOTAL_FRAMES = 61;
const REST_INDEX = 30;
const OUT_BIN = path.resolve("public/data/chibi-head.bin");
const OUT_REST = path.resolve("public/images/chibi_rest.webp");

function packBuffers(fileBuffers, outputFile, magic) {
  const frameCount = fileBuffers.length;
  const HEADER_SIZE = 8;
  const INDEX_ENTRY_SIZE = 8;
  const indexTableSize = frameCount * INDEX_ENTRY_SIZE;
  const dataStartOffset = HEADER_SIZE + indexTableSize;

  let totalSize = dataStartOffset;
  for (const buf of fileBuffers) totalSize += buf.length;

  const outBuf = Buffer.alloc(totalSize);
  outBuf.write(magic, 0, 4, "ascii");
  outBuf.writeUInt8(1, 4);
  outBuf.writeUInt8(0, 5);
  outBuf.writeUInt16LE(frameCount, 6);

  let offset = dataStartOffset;
  for (let i = 0; i < frameCount; i++) {
    const buf = fileBuffers[i];
    const entryOffset = HEADER_SIZE + i * INDEX_ENTRY_SIZE;
    outBuf.writeUInt32LE(offset, entryOffset);
    outBuf.writeUInt32LE(buf.length, entryOffset + 4);
    buf.copy(outBuf, offset);
    offset += buf.length;
  }

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, outBuf);
  console.log(`✓ Packed ${frameCount} clean frames -> ${outputFile} (${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
}

async function measureVisorBox(webpBuf) {
  const { data, info } = await sharp(webpBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  // Seed around expected visor center (360, 180)
  const cx = 360;
  const cy = 180;
  let left = cx, right = cx, top = cy, bottom = cy;
  while (left > 40) {
    const p = (cy * w + (left - 1)) * 4;
    if (data[p + 3] > 200 && data[p] < 24 && data[p + 1] < 24 && data[p + 2] < 28) left--;
    else break;
  }
  while (right < w - 40) {
    const p = (cy * w + (right + 1)) * 4;
    if (data[p + 3] > 200 && data[p] < 24 && data[p + 1] < 24 && data[p + 2] < 28) right++;
    else break;
  }
  const midX = Math.round((left + right) / 2);
  while (top > 20) {
    const p = ((top - 1) * w + midX) * 4;
    if (data[p + 3] > 200 && data[p] < 24 && data[p + 1] < 24 && data[p + 2] < 28) top--;
    else break;
  }
  while (bottom < 450) {
    const p = ((bottom + 1) * w + midX) * 4;
    if (data[p + 3] > 200 && data[p] < 24 && data[p + 1] < 24 && data[p + 2] < 28) bottom++;
    else break;
  }
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}

async function measureIdleEyes(webpBuf) {
  const { data, info } = await sharp(webpBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  let minX = w, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 100; y < 220; y++) {
    for (let x = 220; x < 510; x++) {
      const p = (y * w + x) * 4;
      if (data[p + 3] > 200 && data[p + 2] > 140 && data[p + 2] - data[p] > 60) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const midX = (minX + maxX) / 2;
  let lx = 0, ly = 0, lc = 0, rx = 0, ry = 0, rc = 0;
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = (y * w + x) * 4;
      if (data[p + 3] > 200 && data[p + 2] > 140 && data[p + 2] - data[p] > 60) {
        if (x < midX) { lx += x; ly += y; lc++; }
        else { rx += x; ry += y; rc++; }
      }
    }
  }
  return {
    leftEye: [+(lx / lc).toFixed(1), +(ly / lc).toFixed(1)],
    rightEye: [+(rx / rc).toFixed(1), +(ry / rc).toFixed(1)],
    eyeDist: +((rx / rc) - (lx / lc)).toFixed(1),
    eyeH: maxY - minY + 1,
  };
}

async function main() {
  console.log("Launching Playwright to bake 61 clean blank-visor Chibi head frames...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 800, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto("http://localhost:3001/__baker_clean.html");
  await page.waitForFunction(() => window.__bakeReady === true, { timeout: 30000 });
  // Warm up GPU texture upload & WebGL buffers so Frame 00 and chibi_rest are 100% populated
  await page.evaluate(() => {
    window.__stage.renderNow();
  });
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    window.__stage.renderNow();
  });
  await page.waitForTimeout(200);

  // 1. Render Tier-0 rest image (exact frame 30 pose WITH idle eyes open)
  const restPngUrl = await page.evaluate(() => {
    const s = window.__stage;
    s.controller.faceEngine?.resetTimeline(999);
    s.controller.applyFaceEngineToMaterials();
    s.controller.snapHeadAngles(0, 0, 0);
    return s.renderNow();
  });
  const restRaw = Buffer.from(restPngUrl.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const restWebp = await sharp(restRaw).resize(720, 720).webp({ quality: 90, effort: 5 }).toBuffer();
  fs.writeFileSync(OUT_REST, restWebp);
  const eyeMetrics = await measureIdleEyes(restWebp);
  console.log("✓ Wrote calibrated chibi_rest.webp | Ground-truth 3D eyes:", JSON.stringify(eyeMetrics));

  // 2. Turn OFF visor face -> pure matte obsidian #000000 cavity
  await page.evaluate(() => {
    window.__stage.controller.setFaceEngine(null);
  });

  const frameBuffers = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const u = (i - REST_INDEX) / REST_INDEX; // -1.0 .. +1.0
    const yaw = u * 0.22;
    const pitch = -Math.abs(u) * 0.012;
    const roll = -u * 0.014;

    const pngUrl = await page.evaluate(
      ({ yaw, pitch, roll }) => {
        const s = window.__stage;
        s.controller.snapHeadAngles(yaw, pitch, roll);
        return s.renderNow();
      },
      { yaw, pitch, roll },
    );
    const raw = Buffer.from(pngUrl.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const webp = await sharp(raw).resize(720, 720).webp({ quality: 84, effort: 4 }).toBuffer();
    frameBuffers.push(webp);

    if (i % 15 === 0) {
      const box = await measureVisorBox(webp);
      console.log(`  Frame ${String(i).padStart(2, "0")} (u=${u.toFixed(2)}): ${(webp.length / 1024).toFixed(1)} KB | visor=${JSON.stringify(box)}`);
    }
  }

  // Save sample clean frames to scratch so we can visually inspect them
  const scratchDir = "C:/Users/user/.gemini/antigravity/brain/c68f979d-e4ea-49de-91be-227201713d6d/scratch";
  fs.mkdirSync(scratchDir, { recursive: true });
  fs.writeFileSync(path.join(scratchDir, "clean_frame_00.webp"), frameBuffers[0]);
  fs.writeFileSync(path.join(scratchDir, "clean_frame_30.webp"), frameBuffers[30]);
  fs.writeFileSync(path.join(scratchDir, "clean_frame_60.webp"), frameBuffers[60]);

  packBuffers(frameBuffers, OUT_BIN, "CHED");
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
