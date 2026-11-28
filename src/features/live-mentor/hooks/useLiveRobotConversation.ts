import { useCallback, useEffect, useRef, useState } from "react";
import { ProfessorAnimState } from "../../../design-system/components/Professor3D/professorTypes";
import { ApiError } from "../../../infrastructure/http/ApiError";
import { useAiUseCaseModals } from "../../../shared/hooks/useAiUseCaseModals";
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
  const turnsRef = useRef<ConversationTurn[]>([]);
  const profileRef = useRef<CoachProfileContext>(profile);
  profileRef.current = profile;

  const wsClientRef = useRef<LiveCoachWsClient | null>(null);
  const audioPlayerRef = useRef<RealtimeAudioPlayer | null>(null);
  const vadRecorderRef = useRef<FastMicVadRecorder | null>(null);
  const pcmEngineRef = useRef<PcmAudioEngine | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const enterListeningState = useCallback(() => {
    if (!callActiveRef.current) return;
    setPhase("user_listening");
    if (modeRef.current === "pipeline") {
      vadRecorderRef.current?.setMode("listening");
    }
  }, []);

  const teardownHardware = useCallback(() => {
    callActiveRef.current = false;
    modeRef.current = null;
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
  }, []);

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

      // Tier-2 Go Pipeline mode
      pcmEngineRef.current?.stopAll();
      const micStarted = await vadRecorderRef.current!.start({
        onVolume: (lvl) => setMicLevel(lvl),
        onUtteranceReady: (blob) => {
          if (!callActiveRef.current || modeRef.current !== "pipeline") return;
          setPhase("thinking");
          vadRecorderRef.current?.setMode("thinking");
          wsClientRef.current?.sendAudioBlob(blob);
        },
        onBargeIn: () => {
          if (!callActiveRef.current || modeRef.current !== "pipeline") return;
          audioPlayerRef.current?.stop();
          wsClientRef.current?.sendInterrupt();
          setPhase("user_listening");
        },
      });
      if (!micStarted) {
        wsClientRef.current?.sendInterrupt();
        teardownHardware();
        setPhase("idle");
        setMicModalOpen(true);
        return;
      }
      vadRecorderRef.current!.setMode("thinking");
    },
    [teardownHardware],
  );

  useEffect(() => {
    const player = audioPlayerRef.current!;
    const pcm = pcmEngineRef.current!;
    const ws = wsClientRef.current!;

    player.setOnTurnDrained(() => {
      if (callActiveRef.current && modeRef.current === "pipeline") {
        enterListeningState();
      }
    });

    ws.setHandlers({
      onBinaryAudio: (buf) => {
        if (!callActiveRef.current || buf.byteLength < 2) return;
        const headerByte = new DataView(buf).getUint8(0);
        if (headerByte === 0x03) {
          // Mutually exclusive Gemini Live 24kHz PCM frame
          setPhase("robot_speaking");
          pcm.enqueuePcm24k(new Uint8Array(buf, 1));
          return;
        }
        if (headerByte === 0x01) {
          // Mutually exclusive Tier-2 Go MP3 frame
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
              void beginNegotiatedCapture(ev.mode);
            }
            break;

          case "phase":
            if (ev.phase === "thinking") {
              setPhase("thinking");
              if (modeRef.current === "pipeline") vadRecorderRef.current?.setMode("thinking");
            } else if (ev.phase === "speaking") {
              setPhase("robot_speaking");
              if (modeRef.current === "pipeline") vadRecorderRef.current?.setMode("robot_speaking");
            } else if (ev.phase === "listening") {
              if (modeRef.current === "native_audio") {
                if (!pcm.isPlaying) enterListeningState();
              } else if (!player.isPlaying) {
                enterListeningState();
              }
            }
            break;

          case "user_transcript":
            if (ev.text && ev.text.trim()) {
              turnsRef.current = [
                ...turnsRef.current,
                { id: `u_${Date.now()}`, role: "user", text: ev.text.trim(), timestamp: Date.now() },
              ];
            }
            break;

          case "clause_start":
            if (ev.turnId && ev.clauseId && modeRef.current === "pipeline") {
              setPhase("robot_speaking");
              vadRecorderRef.current?.setMode("robot_speaking");
              player.onClauseStart(ev.turnId, ev.clauseId);
            }
            break;

          case "clause_end":
            if (ev.turnId && ev.clauseId && modeRef.current === "pipeline") {
              player.onClauseEnd(ev.turnId, ev.clauseId);
            }
            break;

          case "turn_done":
            if (ev.fullText && ev.fullText.trim()) {
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
            } else if (ev.turnId) {
              player.onTurnDone(ev.turnId);
            } else if (!player.isPlaying) {
              enterListeningState();
            }
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
            void handleAiFailure(apiErr, () => {}, { featureName: "Conversación en Vivo con Liam" });
            break;
          }
        }
      },
    });

    return () => {
      player.setOnTurnDrained(null);
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
          lang: "en-US",
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
          onEnd: () => {},
        });
      };

      listenOnce();
    } catch (err) {
      teardownHardware();
      setPhase("idle");
      void handleAiFailure(err, () => {}, { featureName: "Conversación en Vivo con Liam" });
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
    setSummary(null);

    const wsConnected = await wsClientRef.current!.ensureConnected(2400);
    if (wsConnected) {
      callActiveRef.current = true;
      modeRef.current = null;
      turnsRef.current = [];
      setPhase("connecting");

      const sent = await wsClientRef.current!.sendStart(profileRef.current);
      if (sent) return;
    }

    callActiveRef.current = true;
    modeRef.current = null;
    turnsRef.current = [];
    setPhase("connecting");
    await runHttpFallbackLoop();
  }, [isByokMode, openByokModal, runHttpFallbackLoop]);

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
