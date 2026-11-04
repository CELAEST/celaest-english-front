/**
 * CELAEST Cyber Visor Face Procedural Engine
 * 60 FPS Procedural 2D Canvas Generator for Cyber Visor Screen
 *
 * Generates 5 Ultra-Luxury, Zero-AI-Slop Emissive Digital Faces:
 * 1. ASTRO_CHIBI: Expressive curved capsule OLED eyes + audio mouth
 * 2. OLED_MATRIX: High-density phosphor LED dot matrix array
 * 3. JARVIS_HUD: Cybernetic tactical reticles + audio spectrum + telemetry
 * 4. QUANTUM_NODES: Organic floating neural nodes & filament constellation
 * 5. LINEAR_HORIZON: Porsche/Monolith razor-sharp light blade & dual apertures
 */

export type VisorFaceArchetype =
  | "astro_chibi"
  | "oled_matrix"
  | "jarvis_hud"
  | "quantum_nodes"
  | "linear_horizon";

export type VisorFaceEmotion =
  | "idle"
  | "speaking"
  | "happy"
  | "thinking"
  | "listening";

export interface VisorFaceTheme {
  id: string;
  name: string;
  primary: string; // e.g. #38bdf8
  secondary: string; // e.g. #0284c7
  glow: string; // e.g. rgba(56, 189, 248, 0.4)
  background: string; // #040711
}

export const VISOR_THEMES: Record<string, VisorFaceTheme> = {
  cyan: {
    id: "cyan",
    name: "Cyber Cyan",
    primary: "#38bdf8",
    secondary: "#0ea5e9",
    glow: "rgba(56, 189, 248, 0.45)",
    background: "#000000",
  },
  violet: {
    id: "violet",
    name: "Quantum Violet",
    primary: "#a855f7",
    secondary: "#8b5cf6",
    glow: "rgba(168, 85, 247, 0.45)",
    background: "#05030d",
  },
  mint: {
    id: "mint",
    name: "Emerald Synth",
    primary: "#10b981",
    secondary: "#059669",
    glow: "rgba(16, 185, 129, 0.45)",
    background: "#020a07",
  },
  amber: {
    id: "amber",
    name: "Solar Amber",
    primary: "#f59e0b",
    secondary: "#d97706",
    glow: "rgba(245, 158, 11, 0.45)",
    background: "#0a0702",
  },
  moonlight: {
    id: "moonlight",
    name: "Moonlight OLED",
    primary: "#f8fafc",
    secondary: "#cbd5e1",
    glow: "rgba(248, 250, 252, 0.40)",
    background: "#050608",
  },
  ruby: {
    id: "ruby",
    name: "Neon Rose",
    primary: "#f43f5e",
    secondary: "#e11d48",
    glow: "rgba(244, 63, 94, 0.45)",
    background: "#0c0205",
  },
};

export type AstroSpeakingVariant =
  | "vocal_capsule"
  | "neon_waveform"
  | "segmented_aperture"
  | "phoneme_hologram";

export type AstroListeningVariant =
  | "ear_radar"
  | "spherical_sonar"
  | "vu_spectrum"
  | "acoustic_lock";

export interface VisorFaceConfig {
  archetype: VisorFaceArchetype;
  themeId: string;
  emotion: VisorFaceEmotion;
  speakingVariant?: AstroSpeakingVariant;
  listeningVariant?: AstroListeningVariant;
  emissiveIntensity: number;
  scanlines: boolean;
}

export class CyberVisorFaceEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private config: VisorFaceConfig;
  private frameVersion = 0;

  // Animation timing & state
  private time = 0;
  private blinkProgress = 0; // 0 = open, 1 = closed
  private isBlinking = false;
  private blinkTimer = 2.5;
  private gazeX = 0; // -1 to 1
  private gazeY = 0; // -1 to 1
  private targetGazeX = 0;
  private targetGazeY = 0;
  private speakingPhases = [0, 0, 0, 0, 0, 0, 0];

  constructor(initialConfig?: Partial<VisorFaceConfig>) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    const isJsdom = typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent);
    this.ctx = isJsdom ? null : this.canvas.getContext("2d", { alpha: false });

    this.config = {
      archetype: initialConfig?.archetype || "astro_chibi",
      themeId: initialConfig?.themeId || "cyan",
      emotion: initialConfig?.emotion || "idle",
      speakingVariant: initialConfig?.speakingVariant || "vocal_capsule",
      listeningVariant: initialConfig?.listeningVariant || "ear_radar",
      emissiveIntensity: initialConfig?.emissiveIntensity ?? 1.8,
      scanlines: initialConfig?.scanlines ?? true,
    };

    this.render();
  }

  public getFrameVersion(): number {
    return this.frameVersion;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public setConfig(next: Partial<VisorFaceConfig>): void {
    let changed = false;
    if (next.archetype && next.archetype !== this.config.archetype) {
      this.config.archetype = next.archetype;
      changed = true;
    }
    if (next.themeId && next.themeId !== this.config.themeId) {
      this.config.themeId = next.themeId;
      changed = true;
    }
    if (next.emotion && next.emotion !== this.config.emotion) {
      this.config.emotion = next.emotion;
      changed = true;
    }
    if (next.speakingVariant && next.speakingVariant !== this.config.speakingVariant) {
      this.config.speakingVariant = next.speakingVariant;
      changed = true;
    }
    if (next.listeningVariant && next.listeningVariant !== this.config.listeningVariant) {
      this.config.listeningVariant = next.listeningVariant;
      changed = true;
    }
    if (next.emissiveIntensity !== undefined && next.emissiveIntensity !== this.config.emissiveIntensity) {
      this.config.emissiveIntensity = next.emissiveIntensity;
      changed = true;
    }
    if (next.scanlines !== undefined && next.scanlines !== this.config.scanlines) {
      this.config.scanlines = next.scanlines;
      changed = true;
    }
    if (changed) {
      this.render();
    }
  }

  public getConfig(): VisorFaceConfig {
    return { ...this.config };
  }

  public setPointerGaze(nx: number, ny: number): void {
    this.targetGazeX = Math.max(-1, Math.min(1, nx));
    this.targetGazeY = Math.max(-1, Math.min(1, ny));
  }

  public triggerBlink(): void {
    if (!this.isBlinking) {
      this.isBlinking = true;
      this.blinkProgress = 0;
    }
  }

  public resetTimeline(nextBlinkInSec = 999): void {
    this.time = 0;
    this.isBlinking = false;
    this.blinkProgress = 0;
    this.blinkTimer = nextBlinkInSec;
    this.gazeX = this.targetGazeX;
    this.gazeY = this.targetGazeY;
    this.render();
  }

  private computeAstroSpeechOpen(t: number): number {
    // Natural syllabic articulation: crisp consonant closures (0.0) + expressive vowel peaks (1.0)
    const syllable = Math.sin(t * 10.5) * 0.58 + Math.sin(t * 17.2 + 0.9) * 0.42;
    if (syllable <= -0.12) return 0;
    const breathGate = Math.sin(t * 2.3) > -0.82 ? 1.0 : 0.12;
    const vowel = Math.pow(Math.min(1, (syllable + 0.12) / 0.98), 0.72);
    return Math.min(1, vowel * breathGate);
  }

  public update(dt: number): void {
    this.time += dt;

    // Smooth gaze interpolation
    this.gazeX += (this.targetGazeX - this.gazeX) * Math.min(1, dt * 6);
    this.gazeY += (this.targetGazeY - this.gazeY) * Math.min(1, dt * 6);

    // Natural random blink cycle
    this.blinkTimer -= dt;
    if (this.blinkTimer <= 0) {
      this.triggerBlink();
      this.blinkTimer = 2.8 + Math.random() * 3.2;
    }

    if (this.isBlinking) {
      this.blinkProgress += dt * 9; // ~220ms blink duration
      if (this.blinkProgress >= Math.PI) {
        this.isBlinking = false;
        this.blinkProgress = 0;
      }
    }

    // Speaking waveform harmonics
    if (this.config.emotion === "speaking") {
      for (let i = 0; i < this.speakingPhases.length; i++) {
        this.speakingPhases[i] = Math.sin(this.time * 12 + i * 1.1) * 0.5 + 0.5;
      }
    }

    this.render();
  }

  public render(): void {
    const { ctx, canvas } = this;
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const theme = VISOR_THEMES[this.config.themeId] || VISOR_THEMES.cyan;

    // 1. Deep Obsidian Base (100% OLED pitch black, zero white haze/milkiness)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // Eye Centers (mapped to visor screen sweet spot)
    const centerX = 512;
    const eyeY = 460 + this.gazeY * 22;
    const eyeSpacing = 160;
    const leftEyeX = centerX - eyeSpacing + this.gazeX * 32;
    const rightEyeX = centerX + eyeSpacing + this.gazeX * 32;

    // Blink height multiplier (1 = wide open, 0.06 = closed, smooth close + smooth open)
    const blinkScale = this.isBlinking ? Math.max(0.06, Math.abs(Math.cos(this.blinkProgress))) : 1.0;

    ctx.save();

    switch (this.config.archetype) {
      case "astro_chibi":
        this.renderAstroChibi(ctx, leftEyeX, rightEyeX, eyeY, blinkScale, theme);
        break;
      case "oled_matrix":
        this.renderOledMatrix(ctx, leftEyeX, rightEyeX, eyeY, blinkScale, theme);
        break;
      case "jarvis_hud":
        this.renderJarvisHud(ctx, leftEyeX, rightEyeX, eyeY, blinkScale, theme);
        break;
      case "quantum_nodes":
        this.renderQuantumNodes(ctx, leftEyeX, rightEyeX, eyeY, blinkScale, theme);
        break;
      case "linear_horizon":
        this.renderLinearHorizon(ctx, leftEyeX, rightEyeX, eyeY, blinkScale, theme);
        break;
    }

    // Render Audio/Mouth Waveform if speaking for non-astro archetypes
    if (this.config.emotion === "speaking" && this.config.archetype !== "astro_chibi") {
      this.renderAudioWaveform(ctx, centerX, 640, theme);
    }

    // Optional CRT / OLED Micro-Scanlines
    if (this.config.scanlines) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 1);
      }
    }

    ctx.restore();
    this.frameVersion++;
  }

  // =========================================================================
  // ARCHETYPE 1: Astro Cyber Pill (Astro Bot / Cyberpunk Manga)
  // =========================================================================
  private renderAstroChibi(
    ctx: CanvasRenderingContext2D,
    lx: number,
    rx: number,
    ey: number,
    blinkScale: number,
    theme: VisorFaceTheme,
  ): void {
    const isHappy = this.config.emotion === "happy";
    const isSpeaking = this.config.emotion === "speaking";
    const isListening = this.config.emotion === "listening";
    const isThinking = this.config.emotion === "thinking";

    // Dynamic animation cadences
    const w0 = (Math.PI * 2) / 2.4;
    const happyBob = isHappy
      ? Math.sin(this.time * 6) * 3
      : isSpeaking
      ? Math.sin(this.time * w0 * 2) * 3
      : 0;
    const currentEy = ey + happyBob;

    // Speech cadence calculation for eye micro-expressions
    const speechOpen = isSpeaking ? this.computeAstroSpeechOpen(this.time) : 0;
    const activeBlinkScale = isSpeaking ? blinkScale * (1 - speechOpen * 0.10) : blinkScale;

    const baseEyeW = isListening ? 102 : 96;
    const baseEyeH = isListening ? 152 : 145;
    const eyeW = baseEyeW;
    const eyeH = Math.max(8, baseEyeH * activeBlinkScale);

    // Render Eyes & Brow ticks
    [lx, rx].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, currentEy);

      // Inquisitive tilt when listening (+2.5 degrees)
      if (isListening) {
        const tiltAngle = (idx === 0 ? 0.045 : 0.045);
        ctx.rotate(tiltAngle);
      }

      if (isHappy && activeBlinkScale > 0.35) {
        // =====================================================================
        // HAPPY EXPRESSION: Rich Luminous Arched Crescents (^ ^)
        // =====================================================================
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 32;

        // Outer glow crescent
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(0, 16, 52, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();

        // Intense pure cyan core stroke
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 16, 52, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Dual Diamond Sparkle Stars (✦) on outer eye edge in pure cyan
        const sparkleX = idx === 0 ? -32 : 32;
        const sparkleY = -12;
        this.drawSparkle(ctx, sparkleX, sparkleY, 9, theme.primary);
        this.drawSparkle(ctx, sparkleX + (idx === 0 ? 16 : -16), sparkleY - 14, 5, theme.primary);

        // Subtle circular shine dot
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        ctx.arc(idx === 0 ? 18 : -18, -8, 5, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // =====================================================================
        // STANDARD / SPEAKING / LISTENING / THINKING OLED PILL EYE
        // =====================================================================
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 32;

        // Outer glow capsule
        ctx.fillStyle = theme.secondary;
        ctx.beginPath();
        ctx.roundRect(-eyeW / 2, -eyeH / 2, eyeW, eyeH, eyeW / 2);
        ctx.fill();

        // Inner intense core (pure solid glowing OLED cyan, zero white dots/halos)
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        ctx.roundRect(-eyeW / 2 + 8, -eyeH / 2 + 8, eyeW - 16, Math.max(4, eyeH - 16), (eyeW - 16) / 2);
        ctx.fill();

        // Thinking scanning sweep line in pure cyan
        if (isThinking && activeBlinkScale > 0.5) {
          const scanY = Math.sin(this.time * 5) * (eyeH / 2 - 12);
          ctx.strokeStyle = theme.primary;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-eyeW / 2 + 10, scanY);
          ctx.lineTo(eyeW / 2 - 10, scanY);
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    // =========================================================================
    // STATE-SPECIFIC ENHANCEMENTS: MOUTH, CHEEKS & INNOVATIVE TELEMETRY
    // =========================================================================

    // 1. HAPPY: Glowing Cyber Blush & Adorable Smile
    if (isHappy) {
      this.renderAstroBlush(ctx, lx - 24, currentEy + 82, theme);
      this.renderAstroBlush(ctx, rx + 24, currentEy + 82, theme);
      this.renderAstroHappyMouth(ctx, 512, 685 + happyBob, theme);
    }

    // 2. SPEAKING VARIANTS
    if (isSpeaking) {
      const mouthY = 685; // Positioned lower as requested
      const variant = this.config.speakingVariant || "vocal_capsule";
      switch (variant) {
        case "vocal_capsule":
          this.renderAstroTalkingMouth(ctx, 512, mouthY, theme);
          break;
        case "neon_waveform":
          this.renderAstroNeonWaveformMouth(ctx, 512, mouthY, theme);
          break;
        case "segmented_aperture":
          this.renderAstroSegmentedMouth(ctx, 512, mouthY, theme);
          break;
        case "phoneme_hologram":
          this.renderAstroPhonemeHologramMouth(ctx, 512, mouthY, theme);
          break;
      }
    }

    // 3. LISTENING VARIANTS
    if (isListening) {
      const variant = this.config.listeningVariant || "ear_radar";
      switch (variant) {
        case "ear_radar":
          this.renderAstroListeningSystem(ctx, lx, rx, currentEy, theme);
          break;
        case "spherical_sonar":
          this.renderAstroSphericalSonar(ctx, currentEy, theme);
          break;
        case "vu_spectrum":
          this.renderAstroVuSpectrum(ctx, currentEy, theme);
          break;
        case "acoustic_lock":
          this.renderAstroAcousticLock(ctx, currentEy, theme);
          break;
      }
    }
  }

  // =========================================================================
  // ASTRO ENHANCEMENT: 4-Point Diamond Sparkle Star (✦)
  // =========================================================================
  private drawSparkle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: string,
  ): void {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(0, 0, size, 0);
    ctx.quadraticCurveTo(0, 0, 0, size);
    ctx.quadraticCurveTo(0, 0, -size, 0);
    ctx.quadraticCurveTo(0, 0, 0, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // =========================================================================
  // ASTRO ENHANCEMENT: Cyber Blush Cheeks
  // =========================================================================
  private renderAstroBlush(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    _theme: VisorFaceTheme,
  ): void {
    ctx.save();
    ctx.translate(x, y);

    // 1. Diffused radial blush glow (warm rose cyber glow)
    const blushGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 42);
    blushGrad.addColorStop(0, "rgba(244, 63, 94, 0.42)");
    blushGrad.addColorStop(0.6, "rgba(244, 63, 94, 0.14)");
    blushGrad.addColorStop(1, "rgba(244, 63, 94, 0)");
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 42, 0, Math.PI * 2);
    ctx.fill();

    // 2. Three angled cyber blush dashes (///)
    ctx.strokeStyle = "#fb7185";
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 14;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const dashSpacing = 10;
    for (let i = -1; i <= 1; i++) {
      const dx = i * dashSpacing;
      ctx.beginPath();
      ctx.moveTo(dx - 6, -9);
      ctx.lineTo(dx + 6, 9);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // ASTRO ENHANCEMENT: Dynamic Talking Cyber Mouth
  // =========================================================================
  private renderAstroTalkingMouth(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const speechOpen = this.computeAstroSpeechOpen(this.time);

    const mouthW = 46 + speechOpen * 68; // 46 (closed lip) to 114 px (open vowel)
    const mouthH = 8 + speechOpen * 84; // 8 (crisp closure) to 92 px (wide expressive vowel)
    const radius = Math.min(mouthW / 2, Math.max(4, mouthH / 2));

    ctx.save();
    ctx.translate(cx, cy);

    // 1. Mouth Outer Halo
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 28;

    // 2. Dark Cavity Background
    ctx.fillStyle = "rgba(4, 7, 17, 0.94)";
    ctx.beginPath();
    ctx.roundRect(-mouthW / 2, -mouthH / 2, mouthW, mouthH, radius);
    ctx.fill();

    // 3. Inner Vocal Tone / Resonance Glow
    if (speechOpen > 0.14) {
      const vocalGrad = ctx.createRadialGradient(0, mouthH / 4, 2, 0, mouthH / 4, mouthW / 2);
      vocalGrad.addColorStop(0, theme.primary);
      vocalGrad.addColorStop(0.68, theme.secondary);
      vocalGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = vocalGrad;
      ctx.beginPath();
      ctx.roundRect(-mouthW / 2 + 4, 0, mouthW - 8, mouthH / 2, radius);
      ctx.fill();

      // Top White Teeth / Lip Accent
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-mouthW * 0.28, -mouthH / 2 + 5.5);
      ctx.lineTo(mouthW * 0.28, -mouthH / 2 + 5.5);
      ctx.stroke();
    }

    // 4. Luminous Clean Outline
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 5;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(-mouthW / 2, -mouthH / 2, mouthW, mouthH, radius);
    ctx.stroke();

    ctx.restore();
  }

  // =========================================================================
  // ASTRO ENHANCEMENT: Radiant Happy Cyber Smile
  // =========================================================================
  private renderAstroHappyMouth(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const mouthW = 74;
    const mouthH = 30;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 26;

    // Curved Open Smile Path
    ctx.beginPath();
    ctx.moveTo(-mouthW / 2, -mouthH / 4);
    ctx.quadraticCurveTo(0, -mouthH / 6, mouthW / 2, -mouthH / 4);
    ctx.quadraticCurveTo(mouthW / 2 + 4, mouthH * 0.72, 0, mouthH * 0.88);
    ctx.quadraticCurveTo(-mouthW / 2 - 4, mouthH * 0.72, -mouthW / 2, -mouthH / 4);
    ctx.closePath();

    // 1. Dark interior with luminous gradient
    const fillGrad = ctx.createLinearGradient(0, -mouthH / 4, 0, mouthH * 0.88);
    fillGrad.addColorStop(0, "rgba(5, 10, 25, 0.95)");
    fillGrad.addColorStop(0.55, theme.secondary);
    fillGrad.addColorStop(1, theme.primary);
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // 2. Top cyan teeth bar
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-mouthW * 0.34, -mouthH / 4 + 4);
    ctx.lineTo(mouthW * 0.34, -mouthH / 4 + 4);
    ctx.stroke();

    // 3. Neon Outline
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.stroke();

    // 4. Adorable smile corner sparkle (✦)
    this.drawSparkle(ctx, mouthW / 2 + 8, -mouthH / 4, 6.5, theme.primary);

    ctx.restore();
  }

  // =========================================================================
  // ASTRO ENHANCEMENT: Innovative Acoustic Radar & Live Voice Capture
  // =========================================================================
  // =========================================================================
  // ASTRO LISTENING VARIANTE 1: Ondas Acústicas de Casco (Ear Waves)
  // =========================================================================
  private renderAstroListeningSystem(
    ctx: CanvasRenderingContext2D,
    _lx: number,
    _rx: number,
    ey: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const earY = ey - 8;
    const leftEarX = 200;
    const rightEarX = 824;

    // 1. Subtle, elegant sound-wave arcs pulsing gently near headphone cups
    [
      { x: leftEarX, angleStart: -Math.PI * 0.35, angleEnd: Math.PI * 0.35 },
      { x: rightEarX, angleStart: Math.PI * 0.65, angleEnd: Math.PI * 1.35 },
    ].forEach((ear) => {
      ctx.save();
      ctx.translate(ear.x, earY);

      for (let i = 0; i < 2; i++) {
        const phase = (t * 1.8 + i * 0.5) % 1;
        const radius = 22 + phase * 46;
        const alpha = Math.sin(phase * Math.PI) * 0.45;

        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(0, 0, radius, ear.angleStart, ear.angleEnd);
        ctx.stroke();
      }

      ctx.restore();
    });

    // 2. Clean, minimal live listening waveform at mouth position (Y = 685)
    const waveY = 685;
    const waveW = 240;
    const startX = 512 - waveW / 2;

    ctx.save();
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();

    const points = 36;
    for (let p = 0; p <= points; p++) {
      const px = startX + (p / points) * waveW;
      const norm = p / points;
      const window = Math.sin(norm * Math.PI);
      const amp = (Math.sin(t * 10 + norm * Math.PI * 5) * 0.6 + Math.sin(t * 18 + norm * Math.PI * 10) * 0.4) * 12 * window;
      const py = waveY + amp;

      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // ASTRO SPEAKING VARIANTE 2: Onda Vocal Espectral (Neon Waveform)
  // =========================================================================
  private renderAstroNeonWaveformMouth(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const syllable = Math.sin(t * 14) * 0.45 + Math.sin(t * 22) * 0.25 + Math.sin(t * 8.5) * 0.3;
    const speechOpen = Math.max(0.06, Math.max(0, syllable));

    const waveW = 120;
    const startX = cx - waveW / 2;

    ctx.save();
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 20;

    // Dynamic clean waveform line
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.beginPath();

    const samplePts = 32;
    for (let i = 0; i <= samplePts; i++) {
      const norm = i / samplePts;
      const px = startX + norm * waveW;
      const window = Math.sin(norm * Math.PI);
      const smileBase = Math.pow(norm - 0.5, 2) * 12 * (1 - speechOpen * 0.5);
      const waveHarmonics = (Math.sin(t * 16 + norm * Math.PI * 5) * 0.7 + Math.sin(t * 26 + norm * Math.PI * 10) * 0.3) * 16 * speechOpen * window;
      const py = cy + smileBase + waveHarmonics;

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Central cyan sparkle accent
    this.drawSparkle(ctx, cx, cy + 2, 5, theme.primary);

    ctx.restore();
  }

  // =========================================================================
  // ASTRO SPEAKING VARIANTE 3: Apertura Segmentada de Precisión
  // =========================================================================
  private renderAstroSegmentedMouth(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const syllable = Math.sin(t * 14) * 0.45 + Math.sin(t * 22) * 0.25 + Math.sin(t * 8.5) * 0.3;
    const speechOpen = Math.max(0, syllable);

    ctx.save();
    ctx.translate(cx, cy);

    // Subtle dark cavity glow when opening
    if (speechOpen > 0.12) {
      const cavH = 10 + speechOpen * 26;
      const cavW = 68;
      ctx.fillStyle = "rgba(4, 7, 17, 0.94)";
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(-cavW / 2, -cavH / 2, cavW, cavH, 8);
      ctx.fill();

      // Soft vocal resonance
      const glowGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, cavW / 2);
      glowGrad.addColorStop(0, theme.primary);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.roundRect(-cavW / 2 + 4, -cavH / 2 + 4, cavW - 8, cavH - 8, 4);
      ctx.fill();
    }

    // Two sleek horizontal OLED blades separating vertically
    const bladeW = 64;
    const bladeH = 4.5;
    const gap = 3 + speechOpen * 16;

    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 16;

    // Upper blade
    ctx.beginPath();
    ctx.roundRect(-bladeW / 2, -gap - bladeH, bladeW, bladeH, bladeH / 2);
    ctx.fill();

    // Lower blade
    ctx.beginPath();
    ctx.roundRect(-bladeW / 2, gap, bladeW, bladeH, bladeH / 2);
    ctx.fill();

    // Specular center accent on upper blade
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-12, -gap - bladeH, 24, bladeH, bladeH / 2);
    ctx.fill();

    ctx.restore();
  }

  // =========================================================================
  // ASTRO SPEAKING VARIANTE 4: Apertura Fonética Expresiva (O-A-E)
  // =========================================================================
  private renderAstroPhonemeHologramMouth(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const syllable = Math.sin(t * 14) * 0.45 + Math.sin(t * 22) * 0.25 + Math.sin(t * 8.5) * 0.3;
    const speechOpen = Math.max(0.06, Math.max(0, syllable));
    const phonemeStage = Math.floor(t * 2.2) % 3;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 20;

    if (phonemeStage === 0 && speechOpen > 0.18) {
      // "O" - Clean circular aperture
      const r = 14 + speechOpen * 10;
      ctx.fillStyle = "rgba(4, 7, 17, 0.94)";
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      this.drawSparkle(ctx, 0, 0, 4.5, "#ffffff");
    } else if (phonemeStage === 1 && speechOpen > 0.18) {
      // "Ah" - Clean rounded capsule
      const w = 58;
      const h = 18 + speechOpen * 22;
      ctx.fillStyle = "rgba(4, 7, 17, 0.94)";
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 12);
      ctx.fill();

      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Clean cyan top tooth/lip accent
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-w * 0.25, -h / 2 + 4);
      ctx.lineTo(w * 0.25, -h / 2 + 4);
      ctx.stroke();
    } else {
      // "Ee" / Resting smile slit
      const w = 66 + speechOpen * 12;
      const h = 10 + speechOpen * 8;
      ctx.fillStyle = "rgba(4, 7, 17, 0.94)";
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, h / 2);
      ctx.fill();

      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3.5;
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // ASTRO LISTENING VARIANTE 2: Pulso Sonar Suave (Soft Sonar)
  // =========================================================================
  private renderAstroSphericalSonar(
    ctx: CanvasRenderingContext2D,
    _ey: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const sonarX = 512;
    const sonarY = 685;

    ctx.save();

    // 2 Soft, clean expanding circular ripples from mouth center
    for (let i = 0; i < 2; i++) {
      const phase = (t * 1.2 + i * 0.5) % 1;
      const radius = 20 + phase * 140;
      const alpha = Math.sin(phase * Math.PI) * 0.35;

      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2;
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 14;
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.arc(sonarX, sonarY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Subtle central node at mouth level
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = theme.primary;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(sonarX, sonarY, 5, 0, Math.PI * 2);
    ctx.fill();

    this.drawSparkle(ctx, sonarX, sonarY, 5, "#ffffff");

    ctx.restore();
  }

  // =========================================================================
  // ASTRO LISTENING VARIANTE 3: Ecualizador Minimalista (Clean Spectrum)
  // =========================================================================
  private renderAstroVuSpectrum(
    ctx: CanvasRenderingContext2D,
    _ey: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    const cy = 685;
    const barCount = 5;
    const barW = 5;
    const spacing = 12;
    const totalW = (barCount - 1) * spacing;
    const startX = 512 - totalW / 2;

    ctx.save();
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 14;

    for (let i = 0; i < barCount; i++) {
      const bx = startX + i * spacing;
      const norm = i / (barCount - 1);
      const window = Math.sin(norm * Math.PI);
      const amp = (Math.sin(t * 12 + i * 1.2) * 0.5 + 0.5) * window;
      const barH = 6 + amp * 22;

      ctx.fillStyle = i === 2 ? "#ffffff" : theme.primary;
      ctx.beginPath();
      ctx.roundRect(bx - barW / 2, cy - barH / 2, barW, barH, barW / 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // =========================================================================
  // ASTRO LISTENING VARIANTE 4: Foco Curioso (Attentive Tilt)
  // =========================================================================
  private renderAstroAcousticLock(
    ctx: CanvasRenderingContext2D,
    ey: number,
    theme: VisorFaceTheme,
  ): void {
    const t = this.time;
    ctx.save();

    // 4 Minimalist corner ticks around face perimeter (super clean framing)
    const frameW = 400;
    const frameH = 170;
    const frameX = 512 - frameW / 2;
    const frameY = ey - frameH / 2;
    const bracketLen = 16;

    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 12;
    ctx.globalAlpha = 0.35 + Math.sin(t * 3) * 0.15;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + bracketLen);
    ctx.lineTo(frameX, frameY);
    ctx.lineTo(frameX + bracketLen, frameY);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(frameX + frameW - bracketLen, frameY);
    ctx.lineTo(frameX + frameW, frameY);
    ctx.lineTo(frameX + frameW, frameY + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(frameX, frameY + frameH - bracketLen);
    ctx.lineTo(frameX, frameY + frameH);
    ctx.lineTo(frameX + bracketLen, frameY + frameH);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(frameX + frameW - bracketLen, frameY + frameH);
    ctx.lineTo(frameX + frameW, frameY + frameH);
    ctx.lineTo(frameX + frameW, frameY + frameH - bracketLen);
    ctx.stroke();

    // Clean subtle focal node at mouth position (Y = 685)
    const targetY = 685;
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(512 - 40, targetY);
    ctx.lineTo(512 - 10, targetY);
    ctx.moveTo(512 + 10, targetY);
    ctx.lineTo(512 + 40, targetY);
    ctx.stroke();

    this.drawSparkle(ctx, 512, targetY, 5, "#ffffff");

    ctx.restore();
  }

  // =========================================================================
  // ARCHETYPE 2: OLED Matrix Neural Core (Apple Vision / Tesla Bot)
  // =========================================================================
  private renderOledMatrix(
    ctx: CanvasRenderingContext2D,
    lx: number,
    rx: number,
    ey: number,
    blinkScale: number,
    theme: VisorFaceTheme,
  ): void {
    const cols = 9;
    const rows = 13;
    const spacing = 13;

    [lx, rx].forEach((ex) => {
      ctx.save();
      ctx.translate(ex, ey);

      for (let r = 0; r < rows; r++) {
        const rowNorm = (r - rows / 2) / (rows / 2);
        if (Math.abs(rowNorm) > blinkScale) continue;

        for (let c = 0; c < cols; c++) {
          const colNorm = (c - cols / 2) / (cols / 2);
          const distSq = colNorm * colNorm + rowNorm * rowNorm;
          if (distSq > 1.05) continue; // Ellipse mask

          const px = (c - cols / 2) * spacing;
          const py = (r - rows / 2) * spacing;

          // Pulse glow based on proximity to center and gaze
          const intensity = Math.max(0.2, 1.0 - Math.sqrt(distSq) * 0.75);
          ctx.fillStyle = intensity > 0.7 ? "#ffffff" : theme.primary;
          ctx.shadowColor = theme.primary;
          ctx.shadowBlur = intensity > 0.7 ? 16 : 8;

          ctx.beginPath();
          ctx.arc(px, py, 4.2 * intensity, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    });
  }

  // =========================================================================
  // ARCHETYPE 3: JARVIS Tactical Cyber HUD (Iron Man / Defense Core)
  // =========================================================================
  private renderJarvisHud(
    ctx: CanvasRenderingContext2D,
    lx: number,
    rx: number,
    ey: number,
    blinkScale: number,
    theme: VisorFaceTheme,
  ): void {
    const radius = 68;

    [lx, rx].forEach((ex, idx) => {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.scale(1, blinkScale);

      // Rotating Outer Segmented Ring
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 18;

      const rotSpeed = idx === 0 ? this.time * 0.8 : -this.time * 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, radius, rotSpeed, rotSpeed + Math.PI * 0.65);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius, rotSpeed + Math.PI, rotSpeed + Math.PI * 1.65);
      ctx.stroke();

      // Inner Reticle Circle
      ctx.strokeStyle = theme.secondary;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.62, 0, Math.PI * 2);
      ctx.stroke();

      // Cardinal Target Ticks
      ctx.strokeStyle = theme.primary;
      ctx.lineWidth = 2.5;
      const ticks = [-radius - 8, radius + 8];
      ticks.forEach((t) => {
        ctx.beginPath();
        ctx.moveTo(t, 0);
        ctx.lineTo(t > 0 ? t - 8 : t + 8, 0);
        ctx.stroke();
      });

      // Luminous Core Pupil (Gaze Reactivity)
      ctx.fillStyle = "#ffffff";
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // Central Telemetry HUD Readout
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = theme.primary;
    ctx.textAlign = "center";
    ctx.letterSpacing = "3px";
    ctx.fillText("CELAEST CORE v2.4 // SYNAPSE 99.8%", 512, ey - 120);

    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.fillText(`GAZE [${this.gazeX.toFixed(2)}, ${this.gazeY.toFixed(2)}] · STATE: ${this.config.emotion.toUpperCase()}`, 512, ey + 105);
  }

  // =========================================================================
  // ARCHETYPE 4: Quantum Constellation (Floating Neural Nodes)
  // =========================================================================
  private renderQuantumNodes(
    ctx: CanvasRenderingContext2D,
    lx: number,
    rx: number,
    ey: number,
    blinkScale: number,
    theme: VisorFaceTheme,
  ): void {
    const nodeCount = 10;

    [lx, rx].forEach((ex, eyeIdx) => {
      ctx.save();
      ctx.translate(ex, ey);
      ctx.scale(1, blinkScale);

      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const rad = 46 + Math.sin(this.time * 2.5 + i + eyeIdx) * 12;
        const px = Math.cos(angle) * rad * 0.9;
        const py = Math.sin(angle) * rad * 1.2;
        points.push({ x: px, y: py });
      }

      // Connecting Filaments
      ctx.strokeStyle = theme.glow;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < points.length; i++) {
        const next = points[(i + 1) % points.length];
        const cross = points[(i + 4) % points.length];
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(next.x, next.y);
        ctx.lineTo(cross.x, cross.y);
        ctx.stroke();
      }

      // Luminous Nodes
      points.forEach((p) => {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();
    });
  }

  // =========================================================================
  // ARCHETYPE 5: Linear Horizon Monolith (Porsche / Bang & Olufsen Blade)
  // =========================================================================
  private renderLinearHorizon(
    ctx: CanvasRenderingContext2D,
    lx: number,
    rx: number,
    ey: number,
    blinkScale: number,
    theme: VisorFaceTheme,
  ): void {
    const beamY = ey;
    const beamW = 600;
    const startX = 512 - beamW / 2;

    ctx.save();

    // 1. Diffused Background Horizon Glow
    const glowGrad = ctx.createLinearGradient(0, beamY - 40, 0, beamY + 40);
    glowGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
    glowGrad.addColorStop(0.5, theme.glow);
    glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(startX, beamY - 40, beamW, 80);

    // 2. Central Ultra-Fine Razor Blade
    ctx.strokeStyle = theme.primary;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(startX, beamY);
    ctx.lineTo(startX + beamW, beamY);
    ctx.stroke();

    // 3. Dual Optical Apertures (Slits) at eye positions
    const slitH = Math.max(3, 24 * blinkScale);
    [lx, rx].forEach((ex) => {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = theme.primary;
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.roundRect(ex - 48, beamY - slitH / 2, 96, slitH, slitH / 2);
      ctx.fill();
    });

    ctx.restore();
  }

  // =========================================================================
  // SHARED: Dynamic Audio Frequency Waveform (Mouth Spectrum)
  // =========================================================================
  private renderAudioWaveform(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    theme: VisorFaceTheme,
  ): void {
    const barCount = 11;
    const barW = 8;
    const spacing = 16;
    const totalW = barCount * spacing;

    ctx.save();
    ctx.translate(cx - totalW / 2 + barW / 2, cy);

    ctx.fillStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 18;

    for (let i = 0; i < barCount; i++) {
      const distFromCenter = Math.abs(i - Math.floor(barCount / 2)) / (barCount / 2);
      const envelope = Math.cos(distFromCenter * Math.PI * 0.45);
      const rawHeight = (Math.sin(this.time * 14 + i * 0.9) * 0.5 + 0.5) * 44 + 6;
      const barH = Math.max(6, rawHeight * envelope);

      ctx.beginPath();
      ctx.roundRect(i * spacing, -barH / 2, barW, barH, barW / 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public dispose(): void {
    // Pure 2D canvas requires no WebGL disposal
  }
}
