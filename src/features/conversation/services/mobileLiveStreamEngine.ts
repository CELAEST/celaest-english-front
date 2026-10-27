/**
 * Mobile Hybrid Continuous + Micro-Pause Live Stream Engine
 * Isolated exclusively for Mobile (Android / iOS) when Edge AI Audio keys are configured:
 * - Operates on a SINGLE MediaRecorder stream (zero dual-MediaRecorder WebKit/Blink conflict)
 * - Fast 1.1s initial live partial + 1.2s continuous streaming while speaking (never blocked by passive AnalyserNode)
 * - Instant 420ms micro-pause flush + dynamic silence gate (0 calls during long pauses)
 */

import { logger } from "../../../shared/utils/logger";
import { measureAnalyserVoiceEnergy } from "./audioHardwareSelector";
import { detectLiveSpanishOrFiller } from "./speechIntelligibilityGuard";

const TICK_MS = 80;
const INITIAL_PARTIAL_MS = 1100;
const CONTINUOUS_STEP_MS = 1200;
const MICRO_PAUSE_FLUSH_MS = 420;
const MIN_VOICED_FOR_PAUSE_MS = 240;

export interface MobileStreamStopResult {
  confirmedTranscript: string;
  latestCombinedTranscript: string;
  pendingTailBlob: Blob | null;
}

export interface MobileLiveStreamOptions {
  micStream: MediaStream;
  mimeType: string;
  initialTranscript?: string | undefined;
  roleName?: string | undefined;
  question?: string | undefined;
  /** Optional external single-MediaRecorder blob provider to avoid dual MediaRecorder instances on mobile */
  getRecordedBlob?: (() => Blob | null) | undefined;
  getAnalyser: () => AnalyserNode | null;
  mergePhrases: (history: string, nextPhrase: string) => string;
  transcribeFn: (
    blob: Blob,
    ctx?: { roleName?: string | undefined; question?: string | undefined },
  ) => Promise<{ text: string } | null>;
  didAllProvidersFail?: (() => boolean) | undefined;
  onAllProvidersUnavailable?: (() => void) | undefined;
  onTranscript: (text: string, isFinal: boolean) => void;
  onSpanishDetected?: ((message: string) => void) | undefined;
}

export class MobileLiveStreamEngine {
  private isActive = false;
  private internalRecorder: MediaRecorder | null = null;
  private internalChunks: Blob[] = [];
  private startedAt = 0;
  private lastDispatchAt = 0;
  private lastDispatchedByteSize = 0;
  private lastCompletedByteSize = 0;

  private noiseFloor = 0.008;
  private peakEnergy = 0;
  private dynamicSpeechPeaks = 0;
  private voicedStreakMs = 0;
  private silenceAfterSpeechMs = 0;
  private flushedAfterPause = false;
  private unchangedCount = 0;

  private isInFlight = false;
  private inFlightPromise: Promise<void> | null = null;
  private providerUnavailableTriggered = false;

  private initialPrefix = "";
  private latestMergedText = "";

  private tickInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly opts: MobileLiveStreamOptions) {
    this.initialPrefix = (opts.initialTranscript || "").trim();
    this.latestMergedText = this.initialPrefix;
  }

  public start(): boolean {
    this.startedAt = Date.now();
    this.lastDispatchAt = this.startedAt;
    this.isActive = true;

    if (!this.opts.getRecordedBlob) {
      if (typeof MediaRecorder === "undefined") {
        this.isActive = false;
        return false;
      }
      try {
        let recorder: MediaRecorder;
        try {
          recorder = this.opts.mimeType
            ? new MediaRecorder(this.opts.micStream, { mimeType: this.opts.mimeType })
            : new MediaRecorder(this.opts.micStream);
        } catch {
          recorder = new MediaRecorder(this.opts.micStream);
        }
        this.internalChunks = [];
        recorder.ondataavailable = (ev) => {
          if (ev.data && ev.data.size > 0) {
            this.internalChunks.push(ev.data);
          }
        };
        recorder.start(100);
        this.internalRecorder = recorder;
      } catch (err) {
        logger.warn("[MobileLiveStreamEngine] Internal MediaRecorder start notice:", err);
        this.isActive = false;
        return false;
      }
    }

    this.tickInterval = setInterval(() => {
      this.onTick();
    }, TICK_MS);
    return true;
  }

  private currentBlob(): Blob | null {
    if (this.opts.getRecordedBlob) {
      return this.opts.getRecordedBlob();
    }
    if (this.internalChunks.length === 0) return null;
    const mime = this.internalRecorder?.mimeType || this.opts.mimeType || "audio/webm";
    return new Blob(this.internalChunks, { type: mime });
  }

  private getSpeechThreshold(): number {
    return Math.max(0.022, Math.min(0.045, this.noiseFloor * 2.1));
  }

  private onTick(): void {
    if (!this.isActive) return;

    const now = Date.now();
    const energy = measureAnalyserVoiceEnergy(this.opts.getAnalyser());
    const threshold = this.getSpeechThreshold();

    if (energy >= threshold) {
      this.peakEnergy = Math.max(this.peakEnergy, energy);
      this.voicedStreakMs += TICK_MS;
      this.silenceAfterSpeechMs = 0;
      this.flushedAfterPause = false;
      this.unchangedCount = 0;
      if (this.voicedStreakMs >= MIN_VOICED_FOR_PAUSE_MS) {
        this.dynamicSpeechPeaks += 1;
      }
    } else {
      if (energy > 0) {
        this.noiseFloor = this.noiseFloor * 0.92 + energy * 0.08;
      }
      if (this.voicedStreakMs > 0) {
        this.silenceAfterSpeechMs += TICK_MS;
      }
    }

    if (this.isInFlight) return;

    const blob = this.currentBlob();
    if (!blob || blob.size <= 600) return;

    // 1. Instant 420ms Micro-Pause Flush: when speaker pauses after real voiced speech, flush immediately
    if (
      !this.flushedAfterPause &&
      this.voicedStreakMs >= MIN_VOICED_FOR_PAUSE_MS &&
      this.silenceAfterSpeechMs >= MICRO_PAUSE_FLUSH_MS &&
      blob.size > this.lastDispatchedByteSize
    ) {
      this.flushedAfterPause = true;
      this.voicedStreakMs = 0;
      this.silenceAfterSpeechMs = 0;
      this.dispatchTranscription(blob, now);
      return;
    }

    // 2. Dynamic Silence Suppression: if AnalyserNode has confirmed dynamic contrast (real peaks vs quiet floor)
    //    and we already flushed the pause, make 0 API calls while the room stays silent
    const hasReliableDynamicVad =
      this.dynamicSpeechPeaks >= 3 && this.peakEnergy > Math.max(0.026, this.noiseFloor * 2.0);
    if (hasReliableDynamicVad && this.flushedAfterPause && energy < threshold) {
      return;
    }

    // 3. Continuous Live Streaming while speaking (never blocked if AnalyserNode is passive/low-gain!)
    if (blob.size <= this.lastDispatchedByteSize) return;
    if (this.lastDispatchedByteSize > 0 && blob.size < this.lastDispatchedByteSize + 240) return;

    const baseInterval = this.lastDispatchedByteSize === 0 ? INITIAL_PARTIAL_MS : CONTINUOUS_STEP_MS;
    const adaptiveInterval =
      this.unchangedCount >= 2
        ? Math.min(3600, baseInterval + this.unchangedCount * 900)
        : baseInterval;

    if (now - this.lastDispatchAt < adaptiveInterval) return;

    this.dispatchTranscription(blob, now);
  }

  private dispatchTranscription(blob: Blob, now: number): void {
    const snapshotSize = blob.size;
    this.lastDispatchAt = now;
    this.lastDispatchedByteSize = snapshotSize;
    this.isInFlight = true;

    const p = this.opts
      .transcribeFn(blob, {
        roleName: this.opts.roleName,
        question: this.opts.question,
      })
      .then((res) => {
        if (!this.isActive) return;

        if (
          res === null &&
          !this.providerUnavailableTriggered &&
          this.opts.didAllProvidersFail?.() &&
          this.opts.onAllProvidersUnavailable
        ) {
          this.providerUnavailableTriggered = true;
          this.opts.onAllProvidersUnavailable();
          return;
        }

        const spoken = res?.text?.trim() || "";
        if (!spoken) {
          this.unchangedCount += 1;
          return;
        }

        this.lastCompletedByteSize = Math.max(this.lastCompletedByteSize, snapshotSize);
        const combined = this.initialPrefix
          ? this.opts.mergePhrases(this.initialPrefix, spoken)
          : spoken;

        if (combined === this.latestMergedText) {
          this.unchangedCount += 1;
          return;
        }

        this.unchangedCount = 0;
        this.latestMergedText = combined;

        const liveCheck = detectLiveSpanishOrFiller(combined);
        if (liveCheck.isSpanishOrFiller) {
          this.stopImmediate();
          if (this.opts.onSpanishDetected) {
            this.opts.onSpanishDetected(
              liveCheck.message ||
                "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista.",
            );
          }
          return;
        }

        this.opts.onTranscript(combined, false);
      })
      .catch(() => {
        // transient cellular hiccup; next tick recovers cleanly
      })
      .finally(() => {
        this.isInFlight = false;
        if (this.inFlightPromise === p) {
          this.inFlightPromise = null;
        }
      });

    this.inFlightPromise = p;
  }

  public stopImmediate(): void {
    this.isActive = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    if (this.internalRecorder && this.internalRecorder.state !== "inactive") {
      try {
        this.internalRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.internalRecorder = null;
  }

  public async stopAndExtractTail(): Promise<MobileStreamStopResult> {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    let finalInternalBlob: Blob | null = null;
    if (this.internalRecorder && this.internalRecorder.state !== "inactive") {
      const rec = this.internalRecorder;
      this.internalRecorder = null;
      const mime = rec.mimeType || this.opts.mimeType || "audio/webm";
      finalInternalBlob = await new Promise<Blob | null>((resolve) => {
        rec.onstop = () => {
          const b = new Blob(this.internalChunks, { type: mime });
          resolve(b.size > 600 ? b : null);
        };
        try {
          rec.stop();
        } catch {
          const b = new Blob(this.internalChunks, { type: mime });
          resolve(b.size > 600 ? b : null);
        }
      });
    }

    // Allow an already-running partial/pause commit up to 1.2s to settle before deciding whether a tail call is needed
    if (this.inFlightPromise) {
      await Promise.race([
        this.inFlightPromise.catch(() => {}),
        new Promise<void>((r) => setTimeout(r, 1200)),
      ]);
    }
    this.isActive = false;

    const latestBlob = finalInternalBlob || this.currentBlob();
    const hasReliableDynamicVad =
      this.dynamicSpeechPeaks >= 3 && this.peakEnergy > Math.max(0.026, this.noiseFloor * 2.0);
    const hasUnflushedAudio = Boolean(
      latestBlob &&
        latestBlob.size > 600 &&
        !(hasReliableDynamicVad && this.flushedAfterPause && this.voicedStreakMs === 0) &&
        (latestBlob.size > this.lastCompletedByteSize + 350 || !this.latestMergedText),
    );

    return {
      confirmedTranscript: this.latestMergedText,
      latestCombinedTranscript: this.latestMergedText,
      pendingTailBlob: hasUnflushedAudio ? latestBlob : null,
    };
  }
}
