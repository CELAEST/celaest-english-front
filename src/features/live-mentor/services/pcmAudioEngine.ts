import { isMobileDevice } from "../../conversation/services/audioCaptureService";
import { acquireOptimalMicStream } from "../../conversation/services/audioHardwareSelector";
import { connectAnalyserAliveSink } from "../../conversation/services/pcmWavRecorder";

const INPUT_TARGET_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

function downsampleFloat32ToInt16Pcm(
  input: Float32Array,
  inputRate: number,
  targetRate: number,
): Uint8Array {
  if (inputRate === targetRate) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]!));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return new Uint8Array(out.buffer);
  }
  const ratio = inputRate / targetRate;
  const outLength = Math.max(1, Math.floor(input.length / ratio));
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const idx = Math.min(input.length - 1, Math.floor(i * ratio));
    const s = Math.max(-1, Math.min(1, input[idx]!));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return new Uint8Array(out.buffer);
}

/**
 * Full-duplex Web Audio PCM engine for Gemini Live native audio-to-audio calls:
 * - Captures continuous 16 kHz Int16 LE PCM mic frames with hardware echoCancellation
 * - Schedules 24 kHz Int16 LE PCM model audio chunks gaplessly on AudioContext timeline
 * - Exposes instant <5ms flushPlayback() on barge-in + real-time speaker energy metering
 */
export class PcmAudioEngine {
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private micProcessor: ScriptProcessorNode | null = null;
  private aliveSink: GainNode | null = null;

  private playbackAnalyser: AnalyserNode | null = null;
  private freqBins: Uint8Array<ArrayBuffer> | null = null;
  private activeSources = new Set<AudioBufferSourceNode>();
  private pendingEnqueues = 0;
  private turnEnded = false;
  private onDrained: (() => void) | null = null;
  private nextPlayTime = 0;

  public setOnDrained(cb: (() => void) | null): void {
    this.onDrained = cb;
  }

  public stopMicCaptureOnly(): void {
    this.stopMicOnly();
  }

  public get hasPendingOrPlaying(): boolean {
    return this.activeSources.size > 0 || this.pendingEnqueues > 0;
  }

  public markTurnComplete(): void {
    if (this.activeSources.size === 0 && this.pendingEnqueues === 0) {
      this.turnEnded = false;
      this.onDrained?.();
      return;
    }
    this.turnEnded = true;
  }

  private async ensureContext(): Promise<AudioContext> {
    if (!this.audioCtx || this.audioCtx.state === "closed") {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new Ctx();
      this.playbackAnalyser = this.audioCtx.createAnalyser();
      this.playbackAnalyser.fftSize = 128;
      this.playbackAnalyser.smoothingTimeConstant = 0.45;
      this.playbackAnalyser.connect(this.audioCtx.destination);
      this.freqBins = new Uint8Array(new ArrayBuffer(this.playbackAnalyser.frequencyBinCount));
    }
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public async startMicCapture(
    onPcm16Chunk: (bytes: Uint8Array) => void,
    onMicLevel: (level: number) => void,
  ): Promise<boolean> {
    this.stopMicOnly();

    let stream: MediaStream | null = null;
    try {
      stream = await acquireOptimalMicStream(isMobileDevice(), null);
    } catch {
      return false;
    }
    if (!stream) return false;

    const ctx = await this.ensureContext();
    this.micStream = stream;
    this.micSource = ctx.createMediaStreamSource(stream);
    const proc = ctx.createScriptProcessor(2048, 1, 1);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    this.micSource.connect(analyser);
    this.aliveSink = connectAnalyserAliveSink(ctx, analyser);

    proc.onaudioprocess = (ev) => {
      if (!this.micStream) return;
      const samples = ev.inputBuffer.getChannelData(0);
      let sumSq = 0;
      for (let i = 0; i < samples.length; i++) {
        const v = samples[i]!;
        sumSq += v * v;
      }
      const rms = Math.min(1, Math.sqrt(sumSq / samples.length) * 3.8);
      onMicLevel(rms);
      onPcm16Chunk(downsampleFloat32ToInt16Pcm(samples, ctx.sampleRate, INPUT_TARGET_RATE));
    };

    this.micSource.connect(proc);
    const procMute = ctx.createGain();
    procMute.gain.value = 0;
    proc.connect(procMute);
    procMute.connect(ctx.destination);
    this.micProcessor = proc;
    return true;
  }

  public enqueuePcm24k(pcmBytes: Uint8Array): void {
    if (pcmBytes.byteLength < 2) return;
    this.turnEnded = false;
    this.pendingEnqueues += 1;
    void this.ensureContext()
      .then((ctx) => {
        const sampleCount = Math.floor(pcmBytes.byteLength / 2);
        if (sampleCount <= 0) return;

        const float32 = new Float32Array(sampleCount);
        const view = new DataView(pcmBytes.buffer, pcmBytes.byteOffset, sampleCount * 2);
        for (let i = 0; i < sampleCount; i++) {
          float32[i] = view.getInt16(i * 2, true) / 32768;
        }

        const buf = ctx.createBuffer(1, sampleCount, OUTPUT_SAMPLE_RATE);
        buf.getChannelData(0).set(float32);

        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(this.playbackAnalyser || ctx.destination);

        const startAt = Math.max(ctx.currentTime + 0.015, this.nextPlayTime);
        this.nextPlayTime = startAt + buf.duration;
        this.activeSources.add(src);
        src.onended = () => {
          this.activeSources.delete(src);
          try {
            src.disconnect();
          } catch {
            // ignore
          }
          if (this.activeSources.size === 0 && this.pendingEnqueues === 0 && this.turnEnded) {
            this.turnEnded = false;
            this.onDrained?.();
          }
        };
        src.start(startAt);
      })
      .finally(() => {
        this.pendingEnqueues = Math.max(0, this.pendingEnqueues - 1);
        if (this.activeSources.size === 0 && this.pendingEnqueues === 0 && this.turnEnded) {
          this.turnEnded = false;
          this.onDrained?.();
        }
      });
  }

  public getSpeakerLevel(): number {
    if (!this.playbackAnalyser || !this.freqBins || this.activeSources.size === 0) {
      return 0;
    }
    this.playbackAnalyser.getByteFrequencyData(this.freqBins);
    let sum = 0;
    for (let i = 0; i < this.freqBins.length; i++) {
      sum += this.freqBins[i]!;
    }
    return Math.min(1, sum / (this.freqBins.length * 140));
  }

  public get isPlaying(): boolean {
    return this.activeSources.size > 0;
  }

  public flushPlayback(): void {
    this.nextPlayTime = 0;
    this.turnEnded = false;
    for (const src of Array.from(this.activeSources)) {
      try {
        src.onended = null;
        src.stop();
        src.disconnect();
      } catch {
        // ignore
      }
    }
    this.activeSources.clear();
  }

  private stopMicOnly(): void {
    if (this.micProcessor) {
      this.micProcessor.onaudioprocess = null;
      try {
        this.micProcessor.disconnect();
      } catch {
        // ignore
      }
      this.micProcessor = null;
    }
    if (this.aliveSink) {
      try {
        this.aliveSink.disconnect();
      } catch {
        // ignore
      }
      this.aliveSink = null;
    }
    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {
        // ignore
      }
      this.micSource = null;
    }
    if (this.micStream) {
      for (const t of this.micStream.getTracks()) {
        try {
          t.stop();
        } catch {
          // ignore
        }
      }
      this.micStream = null;
    }
  }

  public stopAll(): void {
    this.flushPlayback();
    this.stopMicOnly();
    if (this.playbackAnalyser) {
      try {
        this.playbackAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.playbackAnalyser = null;
    }
    this.freqBins = null;
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
