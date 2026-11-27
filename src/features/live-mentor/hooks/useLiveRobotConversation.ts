import { useCallback, useEffect, useRef, useState } from "react";
import { ProfessorAnimState } from "../../../design-system/components/Professor3D/professorTypes";
import { useAiUseCaseModals } from "../../../shared/hooks/useAiUseCaseModals";
import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import { MobileAudioUnlocker } from "../../conversation/services/speechSynthesisService";
import { providerKeyVault } from "../../settings/services/providerKeyVault";
import { BilingualVoicePipeline } from "../services/bilingualVoicePipeline";
import {
  CoachProfileContext,
  generateCoachReply,
  generateOpeningTurn,
  generateSessionTakeaways,
} from "../services/liveCoachAiService";
import { ConversationTurn, LiveCallPhase, LiveSessionSummary } from "../types";

const SILENCE_COMMIT_MS = 1350;

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

export function useLiveRobotConversation(profile: CoachProfileContext) {
  const modalController = useAiUseCaseModals("speaking");
  const { handleAiFailure, isByokMode, openByokModal } = modalController;

  const [phase, setPhase] = useState<LiveCallPhase>("idle");
  const [liveCaption, setLiveCaption] = useState<string>("");
  const [userDraft, setUserDraft] = useState<string>("");
  const [micLevel, setMicLevel] = useState<number>(0);
  const [summary, setSummary] = useState<LiveSessionSummary | null>(null);
  const [micModalOpen, setMicModalOpen] = useState<boolean>(false);

  const callActiveRef = useRef<boolean>(false);
  const committingRef = useRef<boolean>(false);
  const turnsRef = useRef<ConversationTurn[]>([]);
  const draftRef = useRef<string>("");
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meterIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicedFramesRef = useRef<number>(0);
  const silentSinceRef = useRef<number>(0);
  const profileRef = useRef<CoachProfileContext>(profile);
  profileRef.current = profile;

  const clearTimers = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (meterIntervalRef.current) {
      clearInterval(meterIntervalRef.current);
      meterIntervalRef.current = null;
    }
  }, []);

  const beginListeningRef = useRef<() => void>(() => {});

  const commitUserTurn = useCallback(async () => {
    if (!callActiveRef.current || committingRef.current) return;
    committingRef.current = true;
    clearTimers();
    setMicLevel(0);

    let finalSpoken = draftRef.current.trim();
    const captured = await AudioCaptureService.stopAndGetAudio().catch(() => null);
    if (!finalSpoken && captured?.audioBlob && captured.hadVoicedSpeech) {
      setPhase("thinking");
      const stt = await AudioCaptureService.transcribeAudio(captured.audioBlob).catch(() => null);
      finalSpoken = stt?.text?.trim() || "";
    }
    if (captured?.audioUrl) {
      try {
        URL.revokeObjectURL(captured.audioUrl);
      } catch {}
    }

    if (!callActiveRef.current) {
      committingRef.current = false;
      return;
    }

    if (!finalSpoken) {
      committingRef.current = false;
      beginListeningRef.current();
      return;
    }

    const userTurn: ConversationTurn = {
      id: `u_${Date.now()}`,
      role: "user",
      text: finalSpoken,
      timestamp: Date.now(),
    };
    turnsRef.current = [...turnsRef.current, userTurn];
    setUserDraft("");
    draftRef.current = "";
    setPhase("thinking");

    try {
      const reply = await generateCoachReply(
        profileRef.current,
        turnsRef.current.slice(0, -1),
        finalSpoken,
      );
      if (!callActiveRef.current) return;
      turnsRef.current = [
        ...turnsRef.current,
        { id: `c_${Date.now()}`, role: "coach", text: reply, timestamp: Date.now() },
      ];
      setPhase("robot_speaking");
      await BilingualVoicePipeline.speakFluid(reply, (s) => setLiveCaption(s));
      committingRef.current = false;
      if (callActiveRef.current) beginListeningRef.current();
    } catch (err) {
      committingRef.current = false;
      callActiveRef.current = false;
      setPhase("idle");
      void handleAiFailure(err, () => {}, { featureName: "Conversación en Vivo con Liam" });
    }
  }, [clearTimers, handleAiFailure]);

  const beginListening = useCallback(() => {
    if (!callActiveRef.current) return;
    committingRef.current = false;
    draftRef.current = "";
    setUserDraft("");
    voicedFramesRef.current = 0;
    silentSinceRef.current = 0;
    setPhase("user_listening");

    AudioCaptureService.startRecognition({
      lang: "en-US",
      roleName: profileRef.current.profession,
      onTranscript: (text) => {
        if (!callActiveRef.current || committingRef.current) return;
        const clean = text.trim();
        draftRef.current = clean;
        setUserDraft(clean);
        if (clean.length > 0) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            void commitUserTurn();
          }, SILENCE_COMMIT_MS);
        }
      },
      onEnd: () => {
        if (!callActiveRef.current || committingRef.current) return;
        if (draftRef.current.trim().length > 0) {
          void commitUserTurn();
        } else {
          setTimeout(() => {
            if (callActiveRef.current && !committingRef.current) beginListeningRef.current();
          }, 180);
        }
      },
    });

    if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    meterIntervalRef.current = setInterval(() => {
      if (!callActiveRef.current || committingRef.current) return;
      const vol = AudioCaptureService.getMicVolume();
      setMicLevel(vol);
      if (vol > 0.06) {
        voicedFramesRef.current += 1;
        silentSinceRef.current = 0;
      } else if (voicedFramesRef.current >= 5 && !draftRef.current.trim()) {
        if (silentSinceRef.current === 0) silentSinceRef.current = Date.now();
        else if (Date.now() - silentSinceRef.current >= 1450) {
          void commitUserTurn();
        }
      }
    }, 120);
  }, [commitUserTurn]);

  beginListeningRef.current = beginListening;

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

    const micOk = await AudioCaptureService.initMicrophone();
    if (!micOk) {
      setMicModalOpen(true);
      return;
    }

    callActiveRef.current = true;
    turnsRef.current = [];
    setPhase("connecting");
    setLiveCaption("");

    try {
      const opening = await generateOpeningTurn(profileRef.current);
      if (!callActiveRef.current) return;
      turnsRef.current = [
        { id: `c_${Date.now()}`, role: "coach", text: opening, timestamp: Date.now() },
      ];
      setPhase("robot_speaking");
      await BilingualVoicePipeline.speakFluid(opening, (s) => setLiveCaption(s));
      if (callActiveRef.current) beginListening();
    } catch (err) {
      callActiveRef.current = false;
      setPhase("idle");
      AudioCaptureService.releaseMicStream();
      void handleAiFailure(err, () => void startCall(), {
        featureName: "Conversación en Vivo con Liam",
      });
    }
  }, [beginListening, handleAiFailure, isByokMode, openByokModal]);

  const stopCall = useCallback(async () => {
    callActiveRef.current = false;
    committingRef.current = false;
    clearTimers();
    setMicLevel(0);
    setUserDraft("");
    BilingualVoicePipeline.stop();
    AudioCaptureService.stop();
    AudioCaptureService.releaseMicStream();

    const snapshot = [...turnsRef.current];
    const hasUserTurns = snapshot.some((t) => t.role === "user" && t.text.trim().length > 0);
    if (!hasUserTurns) {
      setPhase("idle");
      setLiveCaption("");
      return;
    }

    setPhase("summarizing");
    const recap = await generateSessionTakeaways(profileRef.current, snapshot).catch(() => null);
    setSummary(recap);
    setPhase("idle");
    setLiveCaption("");
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      callActiveRef.current = false;
      clearTimers();
      BilingualVoicePipeline.stop();
      AudioCaptureService.cleanup();
    };
  }, [clearTimers]);

  return {
    phase,
    isCallActive: phase !== "idle" && phase !== "summarizing",
    professorState: mapPhaseToProfessorState(phase),
    liveCaption,
    userDraft,
    micLevel,
    summary,
    dismissSummary: () => setSummary(null),
    startCall,
    stopCall,
    micModalOpen,
    closeMicModal: () => setMicModalOpen(false),
    modalController,
  };
}
