/**
 * Universal Web Audio 16 kHz Mono PCM -> RIFF WAV Recorder & WebKit Alive Sink
 *
 * Solves two Apple WebKit (macOS Safari & iOS Safari) hardware capture limitations:
 * 1. WebKit's pull-based Web Audio graph culls `MediaStreamAudioSourceNode -> AnalyserNode` branches
 *    unless connected to `audioContext.destination` (causing AnalyserNode to report 0.000 energy).
 *    `connectAnalyserAliveSink` attaches a silent 0-gain sink to `destination` so samples flow at 60fps.
 * 2. Safari's `MediaRecorder` records `audio/mp4`, whose mid-recording `ondataavailable` chunks lack a
 *    finalized `moov` atom until `.stop()` is called, causing Whisper HTTP 400 on live interim slices.
 *    `PcmWavRecorder` captures real-time 16 kHz 16-bit mono PCM and exports self-contained `RIFF` WAV
 *    blobs (`audio/wav`) that Groq Whisper decodes live and on stop across every OS.
 */

const TARGET_SAMPLE_RATE = 16000;
const PCM_VOICE_RMS_THRESHOLD = 0.0075;

/**
 * Connects an AnalyserNode to `ctx.destination` through a 0-gain silent node.
 * Forces WebKit (macOS & iOS Safari) to pull live microphone audio frames through the analyser
 * without producing any audible speaker feedback.
 */
export function connectAnalyserAliveSink(
  ctx: AudioContext | null | undefined,
  analyser: AnalyserNode | null | undefined,
): GainNode | null {
  if (!ctx || !analyser) return null;
  if (typeof ctx.createGain !== "function" || !ctx.destination) return null;
  try {
    const silentGain = ctx.createGain();
    silentGain.gain.value = 0;
    analyser.connect(silentGain);
    silentGain.connect(ctx.destination);
    return silentGain;
  } catch {
    return null;
  }
}

/**
 * Encodes an array of 16-bit mono PCM chunks into a standard 44-byte header RIFF WAVE Blob.
 */
export function encodeMonoPcm16ToWavBlob(
  chunks: Int16Array[],
  totalSamples: number,
  sampleRate: number = TARGET_SAMPLE_RATE,
): Blob {
  const dataByteLength = totalSamples * 2;
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  const writeAscii = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // RIFF chunk descriptor
  writeAscii(0, "RIFF");
  view.setUint32(4, 36 + dataByteLength, true);
  writeAscii(8, "WAVE");

  // fmt sub-chunk (16-bit mono PCM)
  writeAscii(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample (16)

  // data sub-chunk
  writeAscii(36, "data");
  view.setUint32(40, dataByteLength, true);

  const int16Out = new Int16Array(buffer, 44, totalSamples);
  let offset = 0;
  for (const chunk of chunks) {
    int16Out.set(chunk, offset);
    offset += chunk.length;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export class PcmWavRecorder {
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private silentGainNode: GainNode | null = null;
  private pcmChunks: Int16Array[] = [];
  private totalSamples = 0;
  private latestRms = 0;
  private pendingVoicedFrames = 0;
  private hadVoicedSpeech = false;
  private active = false;

  public start(ctx: AudioContext | null, stream: MediaStream | null): boolean {
    this.stop();
    if (!ctx || !stream) return false;
    if (
      typeof ctx.createScriptProcessor !== "function" ||
      typeof ctx.createMediaStreamSource !== "function" ||
      typeof ctx.createGain !== "function" ||
      !ctx.destination
    ) {
      return false;
    }

    try {
      const inputSampleRate = ctx.sampleRate || 48000;
      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;

      this.pcmChunks = [];
      this.totalSamples = 0;
      this.latestRms = 0;
      this.pendingVoicedFrames = 0;
      this.hadVoicedSpeech = false;
      this.active = true;

      processor.onaudioprocess = (event: AudioProcessingEvent) => {
        if (!this.active) return;
        const input = event.inputBuffer.getChannelData(0);
        if (!input || input.length === 0) return;

        let sumSq = 0;
        for (let i = 0; i < input.length; i++) {
          const s = input[i] ?? 0;
          sumSq += s * s;
        }
        const rms = Math.sqrt(sumSq / input.length);
        this.latestRms = rms;
        if (rms >= PCM_VOICE_RMS_THRESHOLD) {
          this.pendingVoicedFrames += 1;
          this.hadVoicedSpeech = true;
        }

        // Downsample to 16 kHz mono 16-bit PCM
        const ratio = inputSampleRate / TARGET_SAMPLE_RATE;
        const outLength = Math.max(1, Math.floor(input.length / ratio));
        const pcm16 = new Int16Array(outLength);

        for (let i = 0; i < outLength; i++) {
          const srcIdx = Math.min(input.length - 1, Math.floor(i * ratio));
          const sample = Math.max(-1, Math.min(1, input[srcIdx] ?? 0));
          pcm16[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }

        this.pcmChunks.push(pcm16);
        this.totalSamples += pcm16.length;
      };

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(ctx.destination);

      this.sourceNode = source;
      this.processorNode = processor;
      this.silentGainNode = silentGain;
      return true;
    } catch {
      this.stop();
      return false;
    }
  }

  public isActive(): boolean {
    return this.active;
  }

  public getByteLength(): number {
    return this.totalSamples > 0 ? 44 + this.totalSamples * 2 : 0;
  }

  public getLatestRms(): number {
    return this.latestRms;
  }

  public hasDetectedVoice(): boolean {
    return this.hadVoicedSpeech;
  }

  public consumeVoicedActivity(): boolean {
    if (this.pendingVoicedFrames > 0) {
      this.pendingVoicedFrames = 0;
      return true;
    }
    return false;
  }

  public exportWavBlob(): Blob | null {
    if (this.totalSamples < 1600) return null; // < 0.1s at 16kHz
    return encodeMonoPcm16ToWavBlob(this.pcmChunks, this.totalSamples, TARGET_SAMPLE_RATE);
  }

  public stop(): Blob | null {
    this.active = false;
    const finalBlob = this.exportWavBlob();
    if (this.processorNode) {
      this.processorNode.onaudioprocess = null;
      try {
        this.processorNode.disconnect();
      } catch {
        // ignore
      }
      this.processorNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }
    if (this.silentGainNode) {
      try {
        this.silentGainNode.disconnect();
      } catch {
        // ignore
      }
      this.silentGainNode = null;
    }
    this.pcmChunks = [];
    this.totalSamples = 0;
    this.latestRms = 0;
    this.pendingVoicedFrames = 0;
    return finalBlob;
  }
}
