import { useCallback, useEffect, useRef, useState } from "react";
import { ProfessorAnimState } from "../../../design-system/components/Professor3D/professorTypes";
import { ApiError } from "../../../infrastructure/http/ApiError";
import { useAiUseCaseModals } from "../../../shared/hooks/useAiUseCaseModals";
import { logger } from "../../../shared/utils/logger";
import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { BilingualVoicePipeline } from "../services/bilingualVoicePipeline";
import { FastMicVadRecorder } from "../services/fastMicVadRecorder";
import {
  CoachProfileContext,
  generateCoachReply,
  generateOpeningTurn,
  generateSessionTakeaways,
} from "../services/liveCoachAiService";
import { LiveCoachWsClient, LiveWsServerEvent } from "../services/liveCoachWsClient";
import { PcmAudioEngine } from "../services/pcmAudioEngine";
import { RealtimeAudioPlayer } from "../services/realtimeAudioPlayer";
import { ConversationTurn, LiveCallPhase, LiveSessionSummary } from "../types";

const MAX_LIVE_SESSION_MS = 15 * 60 * 1000;
const IDLE_SILENCE_TIMEOUT_MS = 45 * 1000;

export function mapPhaseToProfessorState(phase: LiveCallPhase): ProfessorAnimState {
  switch (phase) {
    case "connecting":
      return "greeting";
    case "robot_speaking":
      return "explaining";
    case "user_listening":
      return "listening";
    case "thinking":
    case "summarizing":
      return "thinking";
    default:
      return "idle";
  }
}

export function useLiveRobotConversation(profile: CoachProfileContext, isViewActive = true) {
  const modalController = useAiUseCaseModals("speaking");
  const { handleAiFailure, isByokMode, openByokModal } = modalController;

  const [phase, setPhase] = useState<LiveCallPhase>("idle");
  const [micLevel, setMicLevel] = useState<number>(0);
  const [speakerLevel, setSpeakerLevel] = useState<number>(0);
  const [summary, setSummary] = useState<LiveSessionSummary | null>(null);
  const [micModalOpen, setMicModalOpen] = useState<boolean>(false);

  const callActiveRef = useRef<boolean>(false);
  const modeRef = useRef<"native_audio" | "pipeline" | null>(null);
  const desiredPipelineModeRef = useRef<"thinking" | "robot_speaking" | "listening">("thinking");
  const usingPcmTurnRef = useRef<boolean>(false);
  const turnsRef = useRef<ConversationTurn[]>([]);
  const profileRef = useRef<CoachProfileContext>(profile);
  profileRef.current = profile;
  const startCallRef = useRef<() => Promise<void>>(async () => {});

  const wsClientRef = useRef<LiveCoachWsClient | null>(null);
  const audioPlayerRef = useRef<RealtimeAudioPlayer | null>(null);
  const vadRecorderRef = useRef<FastMicVadRecorder | null>(null);
  const pcmEngineRef = useRef<PcmAudioEngine | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxSessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopCallRef = useRef<() => Promise<void>>(async () => {});
  const speakerPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  if (!wsClientRef.current) wsClientRef.current = new LiveCoachWsClient();
  if (!audioPlayerRef.current) audioPlayerRef.current = new RealtimeAudioPlayer();
  if (!vadRecorderRef.current) vadRecorderRef.current = new FastMicVadRecorder();
  if (!pcmEngineRef.current) pcmEngineRef.current = new PcmAudioEngine();

  useEffect(() => {
    if (isViewActive) {
      wsClientRef.current?.prewarm();
    }
  }, [isViewActive]);

  useEffect(() => {
    if (speakerPollRef.current) {
      clearInterval(speakerPollRef.current);
      speakerPollRef.current = null;
    }
    if (phase === "robot_speaking") {
      speakerPollRef.current = setInterval(() => {
        const lvl = pcmEngineRef.current?.getSpeakerLevel() || 0.35;
        setSpeakerLevel(lvl);
      }, 80);
    } else {
      setSpeakerLevel(0);
    }
    return () => {
      if (speakerPollRef.current) {
        clearInterval(speakerPollRef.current);
        speakerPollRef.current = null;
      }
    };
  }, [phase]);

  const clearSessionGuardTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (maxSessionTimerRef.current) {
      clearTimeout(maxSessionTimerRef.current);
      maxSessionTimerRef.current = null;
    }
  }, []);

  const armSilenceWatchdog = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (!callActiveRef.current) return;
    silenceTimerRef.current = setTimeout(() => {
      if (callActiveRef.current) {
        void stopCallRef.current();
      }
    }, IDLE_SILENCE_TIMEOUT_MS);
  }, []);

  const enterListeningState = useCallback(() => {
    if (!callActiveRef.current) return;
    desiredPipelineModeRef.current = "listening";
    setPhase("user_listening");
    armSilenceWatchdog();
    if (modeRef.current === "pipeline") {
      vadRecorderRef.current?.setMode("listening");
    }
  }, [armSilenceWatchdog]);

  const teardownHardware = useCallback(() => {
    callActiveRef.current = false;
    modeRef.current = null;
    usingPcmTurnRef.current = false;
    clearSessionGuardTimers();
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setMicLevel(0);
    setSpeakerLevel(0);
    audioPlayerRef.current?.stop();
    vadRecorderRef.current?.stop();
    pcmEngineRef.current?.stopAll();
    BilingualVoicePipeline.stop();
    AudioCaptureService.stop();
    AudioCaptureService.releaseMicStream();
  }, [clearSessionGuardTimers]);

  const beginNegotiatedCapture = useCallback(
    async (mode: "native_audio" | "pipeline") => {
      if (!callActiveRef.current || modeRef.current === mode) return;
      modeRef.current = mode;

      if (mode === "native_audio") {
        vadRecorderRef.current?.stop();
        audioPlayerRef.current?.stop();
        const ok = await pcmEngineRef.current!.startMicCapture(
          (pcmBytes) => {
            if (!callActiveRef.current || modeRef.current !== "native_audio") return;
            wsClientRef.current?.sendPcm16Chunk(pcmBytes);
          },
          (lvl) => setMicLevel(lvl),
        );
        if (!ok) {
          wsClientRef.current?.sendInterrupt();
          teardownHardware();
          setPhase("idle");
          setMicModalOpen(true);
        }
        return;
      }

      // Tier-2 Go Pipeline mode (streams 0x03 Charon PCM24k or 0x01 MP3 frames)
      pcmEngineRef.current?.stopMicCaptureOnly();
      const micStarted = await vadRecorderRef.current!.start({
        onVolume: (lvl) => {
          setMicLevel(lvl);
          if (lvl > 0.08) armSilenceWatchdog();
        },
        onUtteranceReady: (blob) => {
          if (!callActiveRef.current || modeRef.current !== "pipeline") return;
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          logger.info("[LiveCoach] Sending spoken WAV utterance", blob.size, "bytes");
          setPhase("thinking");
          desiredPipelineModeRef.current = "thinking";
          vadRecorderRef.current?.setMode("thinking");
          wsClientRef.current?.sendAudioBlob(blob);
        },
        onBargeIn: () => {
          if (!callActiveRef.current || modeRef.current !== "pipeline") return;
          pcmEngineRef.current?.flushPlayback();
          audioPlayerRef.current?.stop();
          wsClientRef.current?.sendInterrupt();
          enterListeningState();
        },
      });
      if (!micStarted) {
        wsClientRef.current?.sendInterrupt();
        teardownHardware();
        setPhase("idle");
        setMicModalOpen(true);
        return;
      }
      if (!callActiveRef.current) return;
      vadRecorderRef.current!.setMode(desiredPipelineModeRef.current);
    },
    [armSilenceWatchdog, enterListeningState, teardownHardware],
  );

  useEffect(() => {
    const player = audioPlayerRef.current!;
    const pcm = pcmEngineRef.current!;
    const ws = wsClientRef.current!;

    player.setOnTurnDrained(() => {
      if (callActiveRef.current && modeRef.current === "pipeline" && !pcm.hasPendingOrPlaying) {
        enterListeningState();
      }
    });
    pcm.setOnDrained(() => {
      if (callActiveRef.current && modeRef.current === "pipeline" && !player.isPlaying) {
        enterListeningState();
      }
    });

    ws.setHandlers({
      onBinaryAudio: (buf) => {
        if (!callActiveRef.current || buf.byteLength < 2) return;
        const headerByte = new DataView(buf).getUint8(0);
        if (headerByte === 0x03) {
          // Mutually exclusive 24kHz PCM frame (Gemini Live OR Tier-2 Charon Lookahead)
          // Clear any empty MP3 clause bucket created by clause_start so player.isPlaying never blocks listening
          if (!usingPcmTurnRef.current) {
            usingPcmTurnRef.current = true;
            player.stop();
          }
          desiredPipelineModeRef.current = "robot_speaking";
          setPhase("robot_speaking");
          if (modeRef.current === "pipeline") {
            vadRecorderRef.current?.setMode("robot_speaking");
          }
          pcm.enqueuePcm24k(new Uint8Array(buf, 1));
          return;
        }
        if (headerByte === 0x01) {
          // Mutually exclusive Tier-2 Go MP3 frame
          desiredPipelineModeRef.current = "robot_speaking";
          setPhase("robot_speaking");
          vadRecorderRef.current?.setMode("robot_speaking");
          player.onBinaryFrame(buf);
        }
      },
      onJsonEvent: (ev: LiveWsServerEvent) => {
        if (!callActiveRef.current) return;

        switch (ev.type) {
          case "ready":
            if (ev.mode === "native_audio" || ev.mode === "pipeline") {
              logger.info("[LiveCoach] Session ready in mode:", ev.mode);
              void beginNegotiatedCapture(ev.mode);
            }
            break;

          case "phase":
            if (ev.phase === "thinking") {
              usingPcmTurnRef.current = false;
              desiredPipelineModeRef.current = "thinking";
              setPhase("thinking");
              if (modeRef.current === "pipeline") vadRecorderRef.current?.setMode("thinking");
            } else if (ev.phase === "speaking") {
              desiredPipelineModeRef.current = "robot_speaking";
              setPhase("robot_speaking");
              if (modeRef.current === "pipeline") vadRecorderRef.current?.setMode("robot_speaking");
            } else if (ev.phase === "listening") {
              if (modeRef.current === "native_audio") {
                if (!pcm.hasPendingOrPlaying) enterListeningState();
              } else if (usingPcmTurnRef.current) {
                if (!pcm.hasPendingOrPlaying) enterListeningState();
              } else if (!player.isPlaying && !pcm.hasPendingOrPlaying) {
                enterListeningState();
              }
            }
            break;

          case "user_transcript":
            if (ev.text && ev.text.trim()) {
              logger.info("[LiveCoach] Transcript:", ev.text.trim());
              turnsRef.current = [
                ...turnsRef.current,
                { id: `u_${Date.now()}`, role: "user", text: ev.text.trim(), timestamp: Date.now() },
              ];
            }
            break;

          case "clause_start":
            if (ev.turnId && ev.clauseId && modeRef.current === "pipeline") {
              desiredPipelineModeRef.current = "robot_speaking";
              setPhase("robot_speaking");
              vadRecorderRef.current?.setMode("robot_speaking");
              if (!usingPcmTurnRef.current) {
                player.onClauseStart(ev.turnId, ev.clauseId);
              }
            }
            break;

          case "clause_end":
            if (ev.turnId && ev.clauseId && modeRef.current === "pipeline" && !usingPcmTurnRef.current) {
              player.onClauseEnd(ev.turnId, ev.clauseId);
            }
            break;

          case "turn_done":
            if (ev.fullText && ev.fullText.trim()) {
              logger.info("[LiveCoach] Coach turn done:", ev.fullText.trim());
              turnsRef.current = [
                ...turnsRef.current,
                {
                  id: `c_${Date.now()}`,
                  role: "coach",
                  text: ev.fullText.trim(),
                  timestamp: Date.now(),
                },
              ];
            }
            if (modeRef.current === "native_audio") {
              enterListeningState();
            } else if (usingPcmTurnRef.current || pcm.hasPendingOrPlaying) {
              player.stop();
              pcm.markTurnComplete();
            } else if (ev.turnId && player.isPlaying) {
              player.onTurnDone(ev.turnId);
            } else {
              enterListeningState();
            }
            break;

          case "session_limit":
            void stopCallRef.current();
            break;

          case "interrupted":
            pcm.flushPlayback();
            player.stop();
            enterListeningState();
            break;

          case "error": {
            ws.sendInterrupt();
            teardownHardware();
            setPhase("idle");
            const status =
              ev.code === "AI_QUOTA_EXCEEDED"
                ? 429
                : ev.code === "AI_BYOK_REQUIRED" || ev.code === "AI_TRIAL_ACCESS_REQUIRED"
                  ? 402
                  : 503;
            const apiErr = new ApiError(
              ev.message || "Error en conversación en vivo",
              status,
              ev.code,
              { code: ev.code },
            );
            void handleAiFailure(apiErr, () => void startCallRef.current(), {
              featureName: "Conversación en Vivo con Liam",
            });
            break;
          }
        }
      },
    });

    return () => {
      player.setOnTurnDrained(null);
      pcm.setOnDrained(null);
      ws.setHandlers(null);
    };
  }, [beginNegotiatedCapture, enterListeningState, handleAiFailure, teardownHardware]);

  const runHttpFallbackLoop = useCallback(async () => {
    try {
      const micOk = await AudioCaptureService.initMicrophone();
      if (!micOk) {
        teardownHardware();
        setPhase("idle");
        setMicModalOpen(true);
        return;
      }

      const opening = await generateOpeningTurn(profileRef.current);
      if (!callActiveRef.current) return;
      turnsRef.current = [
        { id: `c_${Date.now()}`, role: "coach", text: opening, timestamp: Date.now() },
      ];
      setPhase("robot_speaking");
      await BilingualVoicePipeline.speakFluid(opening);
      if (!callActiveRef.current) return;

      const listenOnce = () => {
        if (!callActiveRef.current) return;
        setPhase("user_listening");
        let draft = "";
        AudioCaptureService.startRecognition({
          lang: /^(A1|A2|B1)$/i.test(profileRef.current.cefrLevel) ? "es-ES" : "en-US",
          roleName: profileRef.current.profession,
          onTranscript: (txt) => {
            draft = txt.trim();
            if (!draft) return;
            if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = setTimeout(async () => {
              if (!callActiveRef.current || !draft) return;
              const spoken = draft;
              draft = "";
              AudioCaptureService.stop();
              turnsRef.current = [
                ...turnsRef.current,
                { id: `u_${Date.now()}`, role: "user", text: spoken, timestamp: Date.now() },
              ];
              setPhase("thinking");
              const reply = await generateCoachReply(
                profileRef.current,
                turnsRef.current.slice(0, -1),
                spoken,
              );
              if (!callActiveRef.current) return;
              turnsRef.current = [
                ...turnsRef.current,
                { id: `c_${Date.now()}`, role: "coach", text: reply, timestamp: Date.now() },
              ];
              setPhase("robot_speaking");
              await BilingualVoicePipeline.speakFluid(reply);
              if (callActiveRef.current) listenOnce();
            }, 650);
          },
          onEnd: () => {
            if (callActiveRef.current && !draft) {
              if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
              fallbackTimerRef.current = setTimeout(() => {
                if (callActiveRef.current) listenOnce();
              }, 250);
            }
          },
        });
      };

      listenOnce();
    } catch (err) {
      teardownHardware();
      setPhase("idle");
      void handleAiFailure(err, () => void startCallRef.current(), {
        featureName: "Conversación en Vivo con Liam",
      });
    }
  }, [handleAiFailure, teardownHardware]);

  const startCall = useCallback(async () => {
    if (callActiveRef.current) return;
    if (isByokMode) {
      const hasKey = await providerKeyVault.hasAnyConfiguredKey().catch(() => false);
      if (!hasKey) {
        openByokModal("promo_byok");
        return;
      }
    }

    MobileAudioUnlocker.unlock();
    AudioCaptureService.unlockAudioInputContextSync();
    pcmEngineRef.current?.unlockPlayback();
    vadRecorderRef.current?.unlockAudioContextSync();
    desiredPipelineModeRef.current = "thinking";
    setSummary(null);

    const armMaxSessionLimit = () => {
      if (maxSessionTimerRef.current) clearTimeout(maxSessionTimerRef.current);
      maxSessionTimerRef.current = setTimeout(() => {
        if (callActiveRef.current) {
          void stopCallRef.current();
        }
      }, MAX_LIVE_SESSION_MS);
    };

    const wsConnected = await wsClientRef.current!.ensureConnected(6500);
    if (wsConnected) {
      callActiveRef.current = true;
      modeRef.current = null;
      turnsRef.current = [];
      setPhase("connecting");
      armMaxSessionLimit();

      const sent = await wsClientRef.current!.sendStart(profileRef.current);
      if (sent) return;
    }

    callActiveRef.current = true;
    modeRef.current = null;
    turnsRef.current = [];
    setPhase("connecting");
    armMaxSessionLimit();
    await runHttpFallbackLoop();
  }, [isByokMode, openByokModal, runHttpFallbackLoop]);

  startCallRef.current = startCall;

  const stopCall = useCallback(async () => {
    wsClientRef.current?.sendInterrupt();
    teardownHardware();

    const snapshot = [...turnsRef.current];
    const hasUserTurns = snapshot.some((t) => t.role === "user" && t.text.trim().length > 0);
    setPhase("idle");
    if (!hasUserTurns) return;

    const recap = await generateSessionTakeaways(profileRef.current, snapshot).catch(() => null);
    if (recap && !callActiveRef.current) {
      setSummary(recap);
    }
  }, [teardownHardware]);

  stopCallRef.current = stopCall;

  useEffect(() => {
    return () => {
      teardownHardware();
      wsClientRef.current?.close();
    };
  }, [teardownHardware]);

  return {
    phase,
    isCallActive: phase !== "idle" && phase !== "summarizing",
    professorState: mapPhaseToProfessorState(phase),
    micLevel,
    speakerLevel,
    summary,
    dismissSummary: () => setSummary(null),
    startCall,
    stopCall,
    micModalOpen,
    closeMicModal: () => setMicModalOpen(false),
    modalController,
  };
}
