import * as THREE from "three";
import { ProfessorAnimState } from "./professorTypes";

export class ProfessorVisorCanvas {
  public readonly canvas: HTMLCanvasElement;
  public readonly context: CanvasRenderingContext2D;
  public readonly texture: THREE.CanvasTexture;

  private elapsed = 0;
  private blinkTimer = 0;
  private isBlinking = false;
  private lastUpdate = 0;

  constructor(width = 512, height = 384) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      // Fallback stub for headless / vitest test environments without native canvas
      this.context = {
        clearRect: () => {},
        fillRect: () => {},
        save: () => {},
        restore: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        quadraticCurveTo: () => {},
        closePath: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
      } as unknown as CanvasRenderingContext2D;
    } else {
      this.context = ctx;
    }

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.flipY = false;
    this.texture.generateMipmaps = false;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;

    this.render("idle");
  }

  public update(dt: number, state: ProfessorAnimState): void {
    this.elapsed += dt;
    this.blinkTimer += dt;

    // Throttle canvas drawing to ~35 fps for zero CPU impact
    if (this.elapsed - this.lastUpdate < 0.028) return;
    this.lastUpdate = this.elapsed;

    // Organic blink cycle every 3.8 seconds
    if (this.blinkTimer > 3.8) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.0) {
        this.isBlinking = false;
        this.blinkTimer = Math.random() * 0.6; // slight natural jitter
      }
    }

    this.render(state);
    this.texture.needsUpdate = true;
  }


  private render(state: ProfessorAnimState): void {
    const ctx = this.context;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.elapsed;

    ctx.clearRect(0, 0, w, h);

    // Deep obsidian cyber screen base with smooth, seamless luminescence (zero colored borders)
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.48, 40, w * 0.5, h * 0.48, w * 0.65);
    bgGrad.addColorStop(0, "#080c18");
    bgGrad.addColorStop(0.55, "#040710");
    bgGrad.addColorStop(1, "#020306");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle luxury cyber HUD telemetry (high-tech details, signal bars, brackets)
    this.drawCyberHudDetails(ctx, w, h, t);

    if (state === "celebrating") {
      this.drawHappyEyes(ctx, w, h, t);
      this.drawHappySmile(ctx, w, h, t);
    } else if (state === "listening") {
      this.drawListeningEyes(ctx, w, h, t);
      this.drawListeningRadar(ctx, w, h, t);
    } else if (state === "explaining") {
      this.drawIdleEyes(ctx, w, h, t);
      this.drawSpeakingWave(ctx, w, h, t);
    } else {
      this.drawIdleEyes(ctx, w, h, t);
      this.drawIdleMouth(ctx, w, h, t);
    }
  }

  private drawCyberHudDetails(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    ctx.save();
    // Top HUD micro-text
    ctx.font = "600 11px monospace";
    ctx.fillStyle = "rgba(56, 189, 248, 0.70)"; // Sky cyan cyber accent
    ctx.fillText("SYS:AI // ONLINE", 48, 38);

    ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
    ctx.fillText("CELAEST.98", w - 128, 38);

    // Top Right Battery / Signal bars
    const barX = w - 165;
    const barY = 30;
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i < 3 ? "rgba(56, 189, 248, 0.85)" : "rgba(255, 255, 255, 0.25)";
      ctx.fillRect(barX + i * 7, barY + (3 - i) * 2, 4, 8 - (3 - i) * 2);
    }

    // Micro corner brackets
    ctx.strokeStyle = "rgba(56, 189, 248, 0.30)";
    ctx.lineWidth = 1.2;
    const padX = 40;
    const padY = 26;
    const arm = 10;

    const drawBracket = (x: number, y: number, sx: number, sy: number) => {
      ctx.beginPath();
      ctx.moveTo(x + sx * arm, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + sy * arm);
      ctx.stroke();
    };

    drawBracket(padX, padY, 1, 1);
    drawBracket(w - padX, padY, -1, 1);
    drawBracket(padX, h - padY, 1, -1);
    drawBracket(w - padX, h - padY, -1, -1);

    // Subtle animated bottom pulse frequency line
    const pulseAlpha = 0.25 + 0.15 * Math.sin(t * 3.0);
    ctx.strokeStyle = `rgba(162, 127, 243, ${pulseAlpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h - 34);
    ctx.lineTo(w * 0.44, h - 34);
    ctx.lineTo(w * 0.46, h - 38);
    ctx.lineTo(w * 0.48, h - 30);
    ctx.lineTo(w * 0.50, h - 35);
    ctx.lineTo(w * 0.52, h - 34);
    ctx.lineTo(w * 0.54, h - 34);
    ctx.lineTo(w * 0.56, h - 39);
    ctx.lineTo(w * 0.58, h - 34);
    ctx.lineTo(w * 0.65, h - 34);
    ctx.stroke();

    ctx.restore();
  }


  private drawIdleEyes(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const eyeWidth = 62;
    const eyeHeight = this.isBlinking ? 4 : 48 + Math.sin(t * 1.3) * 2;
    const spacing = 74; // Calibrated 148px center-to-center matching 3D eye sockets
    const centerY = h * 0.42; // Calibrated eye-level in full-cavity visor

    ctx.save();
    ctx.shadowColor = "#A27FF3";
    ctx.shadowBlur = 32;

    const renderSingleEye = (centerX: number) => {
      const left = centerX - eyeWidth * 0.5;
      const top = centerY - eyeHeight * 0.5;

      // Outer luminous gradient
      const grad = ctx.createLinearGradient(0, top, 0, top + eyeHeight);
      grad.addColorStop(0, "#F5F3FF");
      grad.addColorStop(0.4, "#DDD6FE");
      grad.addColorStop(1, "#A27FF3");

      ctx.fillStyle = grad;
      this.drawRoundedRect(ctx, left, top, eyeWidth, eyeHeight, 20);

      // Cyber micro-reflection / glint when open
      if (!this.isBlinking && eyeHeight > 20) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(centerX + 12, centerY - 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Subtle electric cyan iris flare
        ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
        ctx.beginPath();
        ctx.arc(centerX - 8, centerY + 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    // Left eye & Right eye
    renderSingleEye(w * 0.5 - spacing);
    renderSingleEye(w * 0.5 + spacing);

    ctx.restore();
  }

  private drawListeningEyes(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const eyeWidth = 62;
    const eyeHeight = this.isBlinking ? 4 : 46 + Math.sin(t * 1.8) * 1.5;
    const spacing = 74;
    const centerY = h * 0.42;

    ctx.save();
    ctx.shadowColor = "#38BDF8";
    ctx.shadowBlur = 30;

    const renderSingleEye = (centerX: number) => {
      const left = centerX - eyeWidth * 0.5;
      const top = centerY - eyeHeight * 0.5;

      const grad = ctx.createLinearGradient(0, top, 0, top + eyeHeight);
      grad.addColorStop(0, "#E0F2FE");
      grad.addColorStop(0.5, "#7DD3FC");
      grad.addColorStop(1, "#0284C7");

      ctx.fillStyle = grad;
      this.drawRoundedRect(ctx, left, top, eyeWidth, eyeHeight, 18);
    };

    renderSingleEye(w * 0.5 - spacing);
    renderSingleEye(w * 0.5 + spacing);
    ctx.restore();
  }

  private drawIdleMouth(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const cy = h * 0.71;
    const cx = w * 0.5;
    const pulse = Math.sin(t * 2.0) * 0.15 + 0.85;

    ctx.save();
    ctx.strokeStyle = `rgba(162, 127, 243, ${0.45 * pulse})`;
    ctx.shadowColor = "#A27FF3";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(cx, cy - 8, 22, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
    ctx.restore();
  }

  private drawSpeakingWave(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const centerY = h * 0.71; // Calibrated mouth-level in full-cavity visor
    const bars = 22;
    const barWidth = 10;
    const gap = 10;
    const totalW = bars * (barWidth + gap);
    const startX = (w - totalW) * 0.5;

    ctx.save();
    ctx.shadowColor = "#A27FF3";
    ctx.shadowBlur = 24;

    for (let i = 0; i < bars; i++) {
      const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
      const amp = Math.max(0.18, Math.sin(t * 7.5 + i * 0.55) * Math.cos(t * 3.8 + i * 0.35));
      const barH = (24 + amp * 64) * (1 - distFromCenter * 0.45);

      const grad = ctx.createLinearGradient(0, centerY - barH * 0.5, 0, centerY + barH * 0.5);
      grad.addColorStop(0, "#C4B5FD");
      grad.addColorStop(0.5, "#A27FF3");
      grad.addColorStop(1, "#7C3AED");

      ctx.fillStyle = grad;
      this.drawRoundedRect(ctx, startX + i * (barWidth + gap), centerY - barH * 0.5, barWidth, barH, 5);
    }
    ctx.restore();
  }

  private drawListeningRadar(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const cx = w * 0.5;
    const cy = h * 0.71; // Calibrated acoustic center in full-cavity visor

    ctx.save();
    ctx.shadowColor = "#38BDF8";
    ctx.shadowBlur = 24;

    // Concentric acoustic rings reacting to user audio
    for (let i = 0; i < 3; i++) {
      const radius = ((t * 35 + i * 24) % 60) + 10;
      const alpha = Math.max(0, 1 - radius / 70);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Central pulsing microphone aura
    const corePulse = 14 + Math.sin(t * 6.0) * 3;
    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawHappyEyes(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const spacing = 74;
    const cy = h * 0.42 + Math.sin(t * 5.0) * 3;

    ctx.save();
    ctx.strokeStyle = "#4ADE80";
    ctx.shadowColor = "#4ADE80";
    ctx.shadowBlur = 30;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";

    // Left curved happy arc (^ shape)
    ctx.beginPath();
    ctx.arc(w * 0.5 - spacing, cy, 30, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Right curved happy arc
    ctx.beginPath();
    ctx.arc(w * 0.5 + spacing, cy, 30, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    ctx.restore();
  }

  private drawHappySmile(ctx: CanvasRenderingContext2D, w: number, h: number, t: number): void {
    const cx = w * 0.5;
    const cy = h * 0.70 + Math.sin(t * 4.0) * 2;

    ctx.save();
    ctx.strokeStyle = "#4ADE80";
    ctx.shadowColor = "#4ADE80";
    ctx.shadowBlur = 24;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(cx, cy, 32, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    ctx.restore();
  }

  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    const radius = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  public dispose(): void {
    this.texture.dispose();
  }
}
