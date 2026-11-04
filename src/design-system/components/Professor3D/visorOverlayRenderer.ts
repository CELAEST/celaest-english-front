import { CyberVisorFaceEngine } from "./CyberVisorFaceEngine";

export const HEAD_FRAME_COUNT = 61;
export const HEAD_REST_INDEX = 30; // Exact 0-degree neutral center in 0..60

export function findBestHeadBitmap(
  bitmaps: Array<ImageBitmap | null>,
  targetIdx: number,
): { bmp: ImageBitmap; idx: number } | null {
  const maxIdx = bitmaps.length - 1;
  if (maxIdx < 0) return null;
  const clamped = Math.max(0, Math.min(maxIdx, Math.round(targetIdx)));
  if (bitmaps[clamped]) return { bmp: bitmaps[clamped]!, idx: clamped };

  for (let offset = 1; offset <= maxIdx; offset++) {
    const left = clamped - offset;
    if (left >= 0 && bitmaps[left]) return { bmp: bitmaps[left]!, idx: left };
    const right = clamped + offset;
    if (right <= maxIdx && bitmaps[right]) return { bmp: bitmaps[right]!, idx: right };
  }
  return null;
}

/**
 * Composites:
 * 1) Clean blank-visor 3D Chibi frame (720x720)
 * 2) Live 60 FPS CyberVisorFaceEngine OLED face locked to the 3D visor cavity
 */
export function renderProfessorCompositeFrame(
  ctx: CanvasRenderingContext2D,
  headBmp: ImageBitmap,
  faceEngine: CyberVisorFaceEngine,
  headFrameIdx: number,
  canvasWidth: number,
  canvasHeight: number,
): void {
  const scale = canvasWidth / 720;
  const u = (headFrameIdx - HEAD_REST_INDEX) / HEAD_REST_INDEX; // -1.0 .. +1.0

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.drawImage(headBmp, 0, 0, canvasWidth, canvasHeight);

  // Ground-truth calibrated visor cavity bounds across u = -1..+1 (with 8px safety inset)
  const clipLeft = (217 + 20 * u + 11 * u * u + 8) * scale;
  const clipRight = (519 + 15.5 * u - 8.5 * u * u - 8) * scale;
  const clipTop = 70 * scale;
  const clipBottom = 294 * scale;

  const faceCenterX = (373.5 + u * 31) * scale;
  const eyeAnchorY = (166.0 + Math.abs(u) * 2.2) * scale;
  const destW = 320 * (1 - 0.05 * u * u) * scale;
  const destH = 304 * scale;
  const drawX = -destW * 0.5;
  const drawY = -destH * (460 / 1024);

  const faceCanvas = faceEngine.getCanvas();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(clipLeft, clipTop, Math.max(10, clipRight - clipLeft), clipBottom - clipTop, 80 * scale);
  ctx.clip();

  ctx.translate(faceCenterX, eyeAnchorY);
  ctx.rotate(-u * 0.014);

  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = 1;
  ctx.drawImage(faceCanvas, drawX, drawY, destW, destH);

  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.28;
  ctx.drawImage(faceCanvas, drawX, drawY, destW, destH);

  ctx.restore();
}

