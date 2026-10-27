/**
 * Mobile Utterance-Window Live Stream Engine
 * Isolated exclusively for Mobile (Android / iOS) to deliver ultra-fluid live transcription:
 * - Fast 1.15s initial partial + 1.25s continuous streaming while speaking
 * - Instant 420ms micro-pause utterance commit + segment recorder rotation (O(1) ~15-40KB payloads)
 * - Zero API calls during silence when AnalyserNode is active, with automatic time-based fallback if passive
 */

import { logger } from "../../../shared/utils/logger";
import { measureAnalyserVoiceEnergy } from "./audioHardwareSelector";
import { detectLiveSpanishOrFiller } from "./speechIntelligibilityGuard";

const MOBILE_VOICE_ONSET_THRESHOLD = 0.032;
const TICK_MS = 80;
const INITIAL_PARTIAL_VAD_MS = 1150;
const PARTIAL_STEP_VAD_MS = 1250;
const PASSIVE_FALLBACK_STEP_MS = 1350;
const MICRO_PAUSE_COMMIT_MS = 420;
const MIN_SPEECH_BEFORE_COMMIT_MS = 320;
const MAX_UTTERANCE_DURATION_MS = 6500;

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
  private segmentRecorder: MediaRecorder | null = null;
  private utteranceChunks: Blob[] = [];
  private utteranceByteSize = 0;
  private lastPartialByteSize = 0;
  private lastPartialAt = 0;
  private segmentStartedAt = 0;
  private utteranceId = 0;

  private analyserConfirmedAlive = false;
  private utteranceVoicedMs = 0;
  private silenceAfterSpeechMs = 0;
  private isPartialInFlight = false;
  private providerUnavailableTriggered = false;
  private pendingCommitPromises: Set<Promise<void>> = new Set();

  private confirmedHistory = "";
  private activeUtteranceText = "";
  private tickInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly opts: MobileLiveStreamOptions) {
    this.confirmedHistory = (opts.initialTranscript || "").trim();
  }

  public start(): boolean {
    if (typeof MediaRecorder === "undefined") return false;
    this.isActive = true;
    const started = this.startFreshSegmentRecorder();
    if (!started) {
      this.isActive = false;
      return false;
    }

    this.tickInterval = setInterval(() => {
      this.onTick();
    }, TICK_MS);
    return true;
  }

  private startFreshSegmentRecorder(): boolean {
    try {
      let recorder: MediaRecorder;
      try {
        recorder = this.opts.mimeType
          ? new MediaRecorder(this.opts.micStream, { mimeType: this.opts.mimeType })
          : new MediaRecorder(this.opts.micStream);
      } catch {
        recorder = new MediaRecorder(this.opts.micStream);
      }

      this.utteranceId += 1;
      const capturedId = this.utteranceId;
      this.utteranceChunks = [];
      this.utteranceByteSize = 0;
      this.lastPartialByteSize = 0;
      this.utteranceVoicedMs = 0;
      this.silenceAfterSpeechMs = 0;
      this.activeUtteranceText = "";
      this.segmentStartedAt = Date.now();
      this.lastPartialAt = this.segmentStartedAt;

      recorder.ondataavailable = (ev) => {
        if (capturedId !== this.utteranceId) return;
        if (ev.data && ev.data.size > 0) {
          this.utteranceChunks.push(ev.data);
          this.utteranceByteSize += ev.data.size;
        }
      };

      recorder.start(100);
      this.segmentRecorder = recorder;
      return true;
    } catch (err) {
      logger.warn("[MobileLiveStreamEngine] Segment MediaRecorder start notice:", err);
      return false;
    }
  }

  private onTick(): void {
    if (!this.isActive) return;

    const now = Date.now();
    const energy = measureAnalyserVoiceEnergy(this.opts.getAnalyser());

    if (energy >= MOBILE_VOICE_ONSET_THRESHOLD) {
      this.analyserConfirmedAlive = true;
      this.utteranceVoicedMs += TICK_MS;
      this.silenceAfterSpeechMs = 0;
    } else if (this.utteranceVoicedMs > 0) {
      this.silenceAfterSpeechMs += TICK_MS;
    }

    const segmentAge = now - this.segmentStartedAt;

    // 1. Instant Micro-Pause Commit (420ms breath/pause after real voiced phrase)
    if (
      this.analyserConfirmedAlive &&
      this.utteranceVoicedMs >= MIN_SPEECH_BEFORE_COMMIT_MS &&
      this.silenceAfterSpeechMs >= MICRO_PAUSE_COMMIT_MS &&
      this.utteranceByteSize > 600
    ) {
      this.rotateAndCommitSegment();
      return;
    }

    // 2. Long Continuous Monologue Cap (6.5s) -> keeps uploads O(1) lightweight on mobile networks
    if (segmentAge >= MAX_UTTERANCE_DURATION_MS && this.utteranceByteSize > 800) {
      if (!this.analyserConfirmedAlive || this.utteranceVoicedMs >= MIN_SPEECH_BEFORE_COMMIT_MS) {
        this.rotateAndCommitSegment();
      } else {
        // Pure silence for 6.5s -> reset empty buffer cleanly without API call
        this.rotateSilentSegment();
      }
      return;
    }

    // 3. Continuous Live Partial Update while user is actively speaking
    if (this.isPartialInFlight || this.utteranceByteSize <= 800) return;

    if (this.analyserConfirmedAlive) {
      if (this.utteranceVoicedMs < 240) return;
      const hasFirstPartial = this.lastPartialByteSize > 0;
      const requiredElapsed = hasFirstPartial ? PARTIAL_STEP_VAD_MS : INITIAL_PARTIAL_VAD_MS;
      if (now - this.lastPartialAt < requiredElapsed) return;
      if (this.utteranceByteSize <= this.lastPartialByteSize + 300) return;
    } else {
      if (now - this.lastPartialAt < PASSIVE_FALLBACK_STEP_MS) return;
      if (this.utteranceByteSize <= this.lastPartialByteSize) return;
    }

    this.dispatchPartialTranscription(now);
  }

  private dispatchPartialTranscription(now: number): void {
    const targetUtteranceId = this.utteranceId;
    const mime = this.segmentRecorder?.mimeType || this.opts.mimeType || "audio/webm";
    const partialBlob = new Blob(this.utteranceChunks, { type: mime });
    const snapshotBytes = this.utteranceByteSize;

    this.lastPartialAt = now;
    this.lastPartialByteSize = snapshotBytes;
    this.isPartialInFlight = true;

    void this.opts
      .transcribeFn(partialBlob, {
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
        if (targetUtteranceId !== this.utteranceId) return;
        const clean = res?.text?.trim() || "";
        if (!clean) return;
        this.activeUtteranceText = clean;
        const combined = this.confirmedHistory
          ? this.opts.mergePhrases(this.confirmedHistory, clean)
          : clean;
        if (this.checkSpanishGuard(combined)) return;
        this.opts.onTranscript(combined, false);
      })
      .catch(() => {
        // ignore transient mobile network hiccup; next step or commit will recover
      })
      .finally(() => {
        this.isPartialInFlight = false;
      });
  }

  private rotateSilentSegment(): void {
    const oldRecorder = this.segmentRecorder;
    this.startFreshSegmentRecorder();
    if (oldRecorder && oldRecorder.state !== "inactive") {
      try {
        oldRecorder.stop();
      } catch {
        // ignore
      }
    }
  }

  private rotateAndCommitSegment(): void {
    const oldRecorder = this.segmentRecorder;
    const chunksSnapshot = [...this.utteranceChunks];
    const fallbackActiveText = this.activeUtteranceText;
    const mime = oldRecorder?.mimeType || this.opts.mimeType || "audio/webm";

    // Start next utterance recorder immediately (0ms gap during pause)
    this.startFreshSegmentRecorder();

    const commitPromise = new Promise<void>((resolve) => {
      const finalizeBlob = (blob: Blob) => {
        if (blob.size <= 600) {
          if (fallbackActiveText) {
            this.confirmedHistory = this.confirmedHistory
              ? this.opts.mergePhrases(this.confirmedHistory, fallbackActiveText)
              : fallbackActiveText;
          }
          resolve();
          return;
        }
        void this.opts
          .transcribeFn(blob, {
            roleName: this.opts.roleName,
            question: this.opts.question,
          })
          .then((res) => {
            if (
              this.isActive &&
              res === null &&
              !fallbackActiveText &&
              !this.providerUnavailableTriggered &&
              this.opts.didAllProvidersFail?.() &&
              this.opts.onAllProvidersUnavailable
            ) {
              this.providerUnavailableTriggered = true;
              this.opts.onAllProvidersUnavailable();
              return;
            }
            const phrase = res?.text?.trim() || fallbackActiveText;
            if (phrase) {
              this.confirmedHistory = this.confirmedHistory
                ? this.opts.mergePhrases(this.confirmedHistory, phrase)
                : phrase;
              if (this.isActive && !this.checkSpanishGuard(this.confirmedHistory)) {
                const display = this.activeUtteranceText
                  ? this.opts.mergePhrases(this.confirmedHistory, this.activeUtteranceText)
                  : this.confirmedHistory;
                this.opts.onTranscript(display, false);
              }
            }
          })
          .catch(() => {
            if (fallbackActiveText) {
              this.confirmedHistory = this.confirmedHistory
                ? this.opts.mergePhrases(this.confirmedHistory, fallbackActiveText)
                : fallbackActiveText;
            }
          })
          .finally(() => resolve());
      };

      if (!oldRecorder || oldRecorder.state === "inactive") {
        finalizeBlob(new Blob(chunksSnapshot, { type: mime }));
        return;
      }

      const finalChunks = chunksSnapshot;
      oldRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) finalChunks.push(ev.data);
      };
      oldRecorder.onstop = () => {
        finalizeBlob(new Blob(finalChunks, { type: mime }));
      };
      try {
        oldRecorder.stop();
      } catch {
        finalizeBlob(new Blob(finalChunks, { type: mime }));
      }
    });

    this.pendingCommitPromises.add(commitPromise);
    void commitPromise.finally(() => {
      this.pendingCommitPromises.delete(commitPromise);
    });
  }

  private checkSpanishGuard(text: string): boolean {
    const liveCheck = detectLiveSpanishOrFiller(text);
    if (!liveCheck.isSpanishOrFiller) return false;
    this.stopImmediate();
    if (this.opts.onSpanishDetected) {
      this.opts.onSpanishDetected(
        liveCheck.message ||
          "Detectamos que estás hablando en español. El micrófono se ha pausado. Por favor habla en inglés para practicar tu entrevista.",
      );
    }
    return true;
  }

  public stopImmediate(): void {
    this.isActive = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    if (this.segmentRecorder && this.segmentRecorder.state !== "inactive") {
      try {
        this.segmentRecorder.stop();
      } catch {
        // ignore
      }
    }
    this.segmentRecorder = null;
  }

  public async stopAndExtractTail(): Promise<MobileStreamStopResult> {
    this.isActive = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    const activeRec = this.segmentRecorder;
    this.segmentRecorder = null;
    const mime = activeRec?.mimeType || this.opts.mimeType || "audio/webm";
    const hadUnflushedSpeech = this.analyserConfirmedAlive
      ? this.utteranceVoicedMs >= 160 && this.utteranceByteSize > this.lastPartialByteSize
      : this.utteranceByteSize > this.lastPartialByteSize || !this.activeUtteranceText;

    let tailBlob: Blob | null = null;
    if (activeRec && activeRec.state !== "inactive") {
      tailBlob = await new Promise<Blob | null>((resolve) => {
        activeRec.onstop = () => {
          const b = new Blob(this.utteranceChunks, { type: mime });
          resolve(b.size > 600 ? b : null);
        };
        try {
          activeRec.stop();
        } catch {
          const b = new Blob(this.utteranceChunks, { type: mime });
          resolve(b.size > 600 ? b : null);
        }
      });
    } else if (this.utteranceChunks.length > 0) {
      const b = new Blob(this.utteranceChunks, { type: mime });
      tailBlob = b.size > 600 ? b : null;
    }

    // Wait briefly (max 1.2s) if a recent pause-commit request is finishing in flight
    if (this.pendingCommitPromises.size > 0) {
      await Promise.race([
        Promise.allSettled(Array.from(this.pendingCommitPromises)),
        new Promise<void>((r) => setTimeout(r, 1200)),
      ]);
    }

    const latestCombined = this.activeUtteranceText
      ? this.confirmedHistory
        ? this.opts.mergePhrases(this.confirmedHistory, this.activeUtteranceText)
        : this.activeUtteranceText
      : this.confirmedHistory;

    const needsTailTranscription = Boolean(
      tailBlob && (hadUnflushedSpeech || (!latestCombined && (!this.analyserConfirmedAlive || this.utteranceVoicedMs >= 160))),
    );

    return {
      confirmedTranscript: this.confirmedHistory,
      latestCombinedTranscript: latestCombined,
      pendingTailBlob: needsTailTranscription ? tailBlob : null,
    };
  }
}
