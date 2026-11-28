import { isMobileDevice } from "../../conversation/services/audioCaptureService";
import { acquireOptimalMicStream } from "../../conversation/services/audioHardwareSelector";
import { encodeMonoPcm16ToWavBlob } from "../../conversation/services/pcmWavRecorder";

export interface FastVadCallbacks {
  onVolume: (level: number) => void;
  onUtteranceReady: (audioBlob: Blob) => void;
  onBargeIn: () => void;
  onMicMuted?: () => void;
}

const TARGET_SAMPLE_RATE = 16000;
const PCM_SPEECH_RMS_THRESHOLD = 0.008;
const BARGE_IN_RMS_THRESHOLD = 0.045;
const MIN_BARGE_IN_FRAMES = 4;
const PRE_SPEECH_RING_FRAMES = 6;
const POST_SPEECH_SILENCE_MS = 500;
const MAX_UTTERANCE_MS = 12000;
const MIN_UTTERANCE_SAMPLES = 2400; // >= 150ms at 16 kHz

function downsampleToInt16(input: Float32Array, inputRate: number): Int16Array {
  const ratio = inputRate > 0 ? inputRate / TARGET_SAMPLE_RATE : 3;
  const outLength = Math.max(1, Math.floor(input.length / ratio));
  const out = new Int16Array(outLength);
  for (let i = 0; i < outLength; i++) {
    const srcIdx = Math.min(input.length - 1, Math.floor(i * ratio));
    const sample = Math.max(-1, Math.min(1, input[srcIdx] ?? 0));
    out[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return out;
}

/**
 * Full-duplex 16kHz Mono PCM WAV VAD & Barge-In engine:
 * - Unlocks AudioContext synchronously inside the user's click gesture
 * - Captures continuous 16kHz Int16 PCM with a 6-frame (~500ms) pre-speech ring buffer so opening syllables are never clipped
 * - Encodes self-contained 44-byte RIFF audio/wav blobs free of MediaRecorder Chrome/Safari framing bugs
 */
export class FastMicVadRecorder {
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private silentGainNode: GainNode | null = null;

  private mode: "idle" | "listening" | "robot_speaking" | "thinking" = "idle";
  private callbacks: FastVadCallbacks | null = null;
  private muteCheckTimer: ReturnType<typeof setTimeout> | null = null;

  private preSpeechRing: Int16Array[] = [];
  private utteranceChunks: Int16Array[] = [];
  private utteranceSamples = 0;
  private capturingUtterance = false;
  private voicedFrames = 0;
  private bargeInFrames = 0;
  private speechStartedAt = 0;
  private silentSince = 0;

  public unlockAudioContextSync(): void {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      AudioContext?: typeof AudioContext;
      webkitAudioContext?: typeof AudioContext;
    };
    const Ctx = w.AudioContext || w.webkitAudioContext;
    if (typeof Ctx !== "function") return;

    if (!this.audioCtx || this.audioCtx.state === "closed") {
      this.audioCtx = new Ctx();
    }
    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume().catch(() => {});
    }
  }

  public async start(callbacks: FastVadCallbacks): Promise<boolean> {
    const requestedMode = this.mode;
    this.stopCaptureNodesOnly();
    this.mode = requestedMode;
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

    const track = acquired.getAudioTracks()[0];
    const scheduleMuteCheck = () => {
      if (!track || !track.muted || this.muteCheckTimer) return;
      this.muteCheckTimer = setTimeout(() => {
        this.muteCheckTimer = null;
        if (this.stream === acquired && track.muted) {
          this.callbacks?.onMicMuted?.();
        }
      }, 1500);
    };
    if (track) {
      scheduleMuteCheck();
      track.onmute = () => scheduleMuteCheck();
    }

    try {
      this.unlockAudioContextSync();
      const ctx = this.audioCtx;
      if (!ctx || typeof ctx.createScriptProcessor !== "function") {
        return false;
      }
      if (ctx.state === "suspended") {
        await ctx.resume().catch(() => {});
      }

      const inputSampleRate = ctx.sampleRate || 48000;
      const source = ctx.createMediaStreamSource(acquired);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;

      processor.onaudioprocess = (ev: AudioProcessingEvent) => {
        this.handleAudioFrame(ev.inputBuffer.getChannelData(0), inputSampleRate);
      };

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(ctx.destination);

      this.sourceNode = source;
      this.processorNode = processor;
      this.silentGainNode = silentGain;
      return true;
    } catch {
      this.stopCaptureNodesOnly();
      return false;
    }
  }

  public setMode(nextMode: "idle" | "listening" | "robot_speaking" | "thinking"): void {
    if (this.mode === nextMode) return;
    const prev = this.mode;
    this.mode = nextMode;
    this.bargeInFrames = 0;

    if (nextMode === "listening") {
      if (prev !== "robot_speaking" || !this.capturingUtterance) {
        this.resetUtteranceBuffer();
      }
    } else if (nextMode === "thinking" || nextMode === "idle") {
      this.resetUtteranceBuffer();
      this.preSpeechRing = [];
      this.callbacks?.onVolume(0);
    } else if (nextMode === "robot_speaking") {
      this.resetUtteranceBuffer();
    }
  }

  public stop(): void {
    this.mode = "idle";
    this.stopCaptureNodesOnly();
    if (this.audioCtx) {
      void this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.callbacks = null;
  }

  private stopCaptureNodesOnly(): void {
    if (this.muteCheckTimer) {
      clearTimeout(this.muteCheckTimer);
      this.muteCheckTimer = null;
    }
    this.resetUtteranceBuffer();
    this.preSpeechRing = [];
    this.bargeInFrames = 0;

    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      try {
        this.processorNode.disconnect();
      } catch {
        // ignore
      }
      this.processorNode = null;
    }
    if (this.silentGainNode) {
      try {
        this.silentGainNode.disconnect();
      } catch {
        // ignore
      }
      this.silentGainNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
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
  }

  private resetUtteranceBuffer(): void {
    this.capturingUtterance = false;
    this.utteranceChunks = [];
    this.utteranceSamples = 0;
    this.voicedFrames = 0;
    this.speechStartedAt = 0;
    this.silentSince = 0;
  }

  private handleAudioFrame(samples: Float32Array, inputSampleRate: number): void {
    if (!this.callbacks || !samples || samples.length === 0) return;

    let sumSq = 0;
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i] ?? 0;
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / samples.length);
    const pcm16 = downsampleToInt16(samples, inputSampleRate);

    if (this.mode === "robot_speaking") {
      this.callbacks.onVolume(0);
      this.pushRingFrame(pcm16);
      if (rms >= BARGE_IN_RMS_THRESHOLD) {
        this.bargeInFrames += 1;
        if (this.bargeInFrames >= MIN_BARGE_IN_FRAMES) {
          this.bargeInFrames = 0;
          this.seedUtteranceFromRing(pcm16);
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

    const uiLevel = Math.min(1, rms * 10);
    this.callbacks.onVolume(uiLevel);

    if (!this.capturingUtterance) {
      this.pushRingFrame(pcm16);
      if (rms >= PCM_SPEECH_RMS_THRESHOLD) {
        this.seedUtteranceFromRing(pcm16);
      }
      return;
    }

    this.utteranceChunks.push(pcm16);
    this.utteranceSamples += pcm16.length;

    if (rms >= PCM_SPEECH_RMS_THRESHOLD) {
      this.voicedFrames += 1;
      this.silentSince = 0;
      if (this.speechStartedAt > 0 && Date.now() - this.speechStartedAt >= MAX_UTTERANCE_MS) {
        this.flushPcmUtterance();
      }
      return;
    }

    if (this.voicedFrames >= 2) {
      const now = Date.now();
      if (this.silentSince === 0) {
        this.silentSince = now;
      } else if (now - this.silentSince >= POST_SPEECH_SILENCE_MS) {
        this.flushPcmUtterance();
      }
    } else if (this.speechStartedAt > 0 && Date.now() - this.speechStartedAt >= 600) {
      // Transient click or tap noise without sustained speech
      this.resetUtteranceBuffer();
    }
  }

  private pushRingFrame(pcm16: Int16Array): void {
    this.preSpeechRing.push(pcm16);
    if (this.preSpeechRing.length > PRE_SPEECH_RING_FRAMES) {
      this.preSpeechRing.shift();
    }
  }

  private seedUtteranceFromRing(currentFrame: Int16Array): void {
    this.capturingUtterance = true;
    this.utteranceChunks = [...this.preSpeechRing, currentFrame];
    this.utteranceSamples = this.utteranceChunks.reduce((acc, c) => acc + c.length, 0);
    this.preSpeechRing = [];
    this.voicedFrames = 1;
    this.speechStartedAt = Date.now();
    this.silentSince = 0;
  }

  private flushPcmUtterance(): void {
    const chunks = this.utteranceChunks;
    const totalSamples = this.utteranceSamples;
    this.resetUtteranceBuffer();

    if (totalSamples < MIN_UTTERANCE_SAMPLES || chunks.length === 0) {
      return;
    }
    const wavBlob = encodeMonoPcm16ToWavBlob(chunks, totalSamples, TARGET_SAMPLE_RATE);
    this.callbacks?.onUtteranceReady(wavBlob);
  }
}
