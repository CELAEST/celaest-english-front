import { isMobileDevice } from "../../conversation/services/audioCaptureService";
import {
  acquireOptimalMicStream,
  measureAnalyserVoiceEnergy,
} from "../../conversation/services/audioHardwareSelector";
import { connectAnalyserAliveSink } from "../../conversation/services/pcmWavRecorder";

export interface FastVadCallbacks {
  onVolume: (level: number) => void;
  onUtteranceReady: (audioBlob: Blob) => void;
  onBargeIn: () => void;
}

const VAD_POLL_MS = 60;
const POST_SPEECH_SILENCE_MS = 520;
const SPEECH_ENERGY_THRESHOLD = 0.045;
const BARGE_IN_ENERGY_THRESHOLD = 0.095;
const MIN_VOICED_FRAMES = 3;
const MIN_BARGE_IN_FRAMES = 4;

function pickLowLatencyMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const mime of candidates) {
    try {
      if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    } catch {
      // ignore
    }
  }
  return "";
}

/**
 * Low-latency full-duplex microphone VAD & Opus utterance segmenter:
 * - Commits spoken turns after just 520ms of post-speech silence (vs 1350ms legacy)
 * - Continuously monitors echo-cancelled input while the robot speaks for <240ms Barge-In
 * - Keeps the hardware mic stream warm across turns with zero click/re-prompt delay
 */
export class FastMicVadRecorder {
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private aliveSinkNode: GainNode | null = null;

  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private mimeType = "";

  private timer: ReturnType<typeof setInterval> | null = null;
  private mode: "idle" | "listening" | "robot_speaking" | "thinking" = "idle";
  private voicedFrames = 0;
  private bargeInFrames = 0;
  private silentSince = 0;
  private callbacks: FastVadCallbacks | null = null;

  public async start(callbacks: FastVadCallbacks): Promise<boolean> {
    this.stop();
    this.callbacks = callbacks;

    let acquired: MediaStream | null = null;
    try {
      acquired = await acquireOptimalMicStream(isMobileDevice(), null);
    } catch {
      return false;
    }
    if (!acquired) {
      return false;
    }

    this.stream = acquired;
    this.mimeType = pickLowLatencyMimeType();

    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new Ctx();
      if (this.audioCtx.state === "suspended") {
        await this.audioCtx.resume().catch(() => {});
      }
      this.sourceNode = this.audioCtx.createMediaStreamSource(acquired);
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.45;
      this.sourceNode.connect(this.analyser);
      this.aliveSinkNode = connectAnalyserAliveSink(this.audioCtx, this.analyser);
    } catch {
      // Analyser fallback safe
    }

    this.timer = setInterval(() => this.tickVad(), VAD_POLL_MS);
    return true;
  }

  public setMode(nextMode: "idle" | "listening" | "robot_speaking" | "thinking"): void {
    if (this.mode === nextMode) return;
    const prev = this.mode;
    this.mode = nextMode;
    this.bargeInFrames = 0;

    if (nextMode === "listening") {
      // If transitioning from barge-in where recorder was already capturing user's interruption, keep it!
      if (prev !== "robot_speaking" || !this.recorder || this.recorder.state !== "recording") {
        this.voicedFrames = 0;
        this.silentSince = 0;
        this.beginSegmentRecorder();
      }
    } else if (nextMode === "thinking" || nextMode === "idle") {
      this.callbacks?.onVolume(0);
    }
  }

  public stop(): void {
    this.mode = "idle";
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.discardRecorder();
    if (this.aliveSinkNode) {
      try {
        this.aliveSinkNode.disconnect();
      } catch {
        // ignore
      }
      this.aliveSinkNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }
    this.analyser = null;
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    if (this.stream) {
      for (const t of this.stream.getTracks()) {
        try {
          t.stop();
        } catch {
          // ignore
        }
      }
      this.stream = null;
    }
    this.callbacks = null;
  }

  private beginSegmentRecorder(): void {
    this.discardRecorder();
    if (!this.stream || typeof MediaRecorder === "undefined") return;

    try {
      this.chunks = [];
      const rec = this.mimeType
        ? new MediaRecorder(this.stream, { mimeType: this.mimeType, audioBitsPerSecond: 32000 })
        : new MediaRecorder(this.stream);
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          this.chunks.push(ev.data);
        }
      };
      rec.start(100);
      this.recorder = rec;
    } catch {
      this.recorder = null;
    }
  }

  private discardRecorder(): void {
    if (!this.recorder) return;
    try {
      this.recorder.ondataavailable = null;
      this.recorder.onstop = null;
      if (this.recorder.state !== "inactive") {
        this.recorder.stop();
      }
    } catch {
      // ignore
    }
    this.recorder = null;
    this.chunks = [];
  }

  private flushUtterance(): void {
    const rec = this.recorder;
    if (!rec) return;
    this.recorder = null;
    this.voicedFrames = 0;
    this.silentSince = 0;
    const capturedChunks = this.chunks;
    this.chunks = [];
    const type = this.mimeType || rec.mimeType || "audio/webm";

    const finalize = () => {
      if (capturedChunks.length === 0) return;
      const blob = new Blob(capturedChunks, { type });
      if (blob.size >= 600) {
        this.callbacks?.onUtteranceReady(blob);
      }
    };

    if (rec.state === "inactive") {
      finalize();
      return;
    }

    rec.onstop = () => {
      rec.ondataavailable = null;
      rec.onstop = null;
      finalize();
    };
    try {
      rec.stop();
    } catch {
      finalize();
    }
  }

  private tickVad(): void {
    if (!this.analyser || !this.callbacks) return;
    const energy = measureAnalyserVoiceEnergy(this.analyser);

    if (this.mode === "robot_speaking") {
      this.callbacks.onVolume(0);
      if (energy >= BARGE_IN_ENERGY_THRESHOLD) {
        this.bargeInFrames += 1;
        // Pre-start segment recorder on frame 2 so the very beginning of the user's interruption is captured!
        if (this.bargeInFrames === 2 && (!this.recorder || this.recorder.state !== "recording")) {
          this.voicedFrames = 2;
          this.silentSince = 0;
          this.beginSegmentRecorder();
        }
        if (this.bargeInFrames >= MIN_BARGE_IN_FRAMES) {
          this.bargeInFrames = 0;
          this.mode = "listening";
          this.callbacks.onBargeIn();
        }
      } else {
        this.bargeInFrames = 0;
      }
      return;
    }

    if (this.mode !== "listening") {
      return;
    }

    this.callbacks.onVolume(energy);

    if (energy >= SPEECH_ENERGY_THRESHOLD) {
      this.voicedFrames += 1;
      this.silentSince = 0;
      return;
    }

    if (this.voicedFrames >= MIN_VOICED_FRAMES) {
      const now = Date.now();
      if (this.silentSince === 0) {
        this.silentSince = now;
      } else if (now - this.silentSince >= POST_SPEECH_SILENCE_MS) {
        this.flushUtterance();
      }
    }
  }
}
