import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLiveRobotConversation } from "../hooks/useLiveRobotConversation";
import { LiveCoachWsClient, LiveWsClientHandlers } from "../services/liveCoachWsClient";
import { FastMicVadRecorder } from "../services/fastMicVadRecorder";
import { PcmAudioEngine } from "../services/pcmAudioEngine";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { DEFAULT_FREE_ENTITLEMENT } from "../../../domain/entities/ProductEntitlement";

describe("useLiveRobotConversation — Charon PCM 0x03 turn lifecycle", () => {
  let wsHandlers: LiveWsClientHandlers | null = null;
  let vadModes: string[] = [];
  let pcmDrainCb: (() => void) | null = null;

  beforeEach(() => {
    vi.restoreAllMocks();
    wsHandlers = null;
    vadModes = [];
    pcmDrainCb = null;

    vi.spyOn(SupabaseAuthAdapter.getInstance(), "isAuthenticated").mockReturnValue(true);
    vi.spyOn(ApiEntitlementRepository, "getEntitlement").mockResolvedValue({
      ...DEFAULT_FREE_ENTITLEMENT,
      hasAccess: true,
      accessType: "trial",
      status: "trial",
      aiCloudIncluded: true,
      aiRequestsUsed: 5,
      aiRequestsLimit: 200,
    });

    vi.spyOn(LiveCoachWsClient.prototype, "prewarm").mockImplementation(() => {});
    vi.spyOn(LiveCoachWsClient.prototype, "ensureConnected").mockResolvedValue(true);
    vi.spyOn(LiveCoachWsClient.prototype, "sendStart").mockResolvedValue(true);
    vi.spyOn(LiveCoachWsClient.prototype, "sendInterrupt").mockImplementation(() => {});
    vi.spyOn(LiveCoachWsClient.prototype, "close").mockImplementation(() => {});
    vi.spyOn(LiveCoachWsClient.prototype, "setHandlers").mockImplementation((h) => {
      wsHandlers = h;
    });

    vi.spyOn(FastMicVadRecorder.prototype, "start").mockResolvedValue(true);
    vi.spyOn(FastMicVadRecorder.prototype, "stop").mockImplementation(() => {});
    vi.spyOn(FastMicVadRecorder.prototype, "setMode").mockImplementation((m) => {
      vadModes.push(m);
    });

    vi.spyOn(PcmAudioEngine.prototype, "unlockPlayback").mockImplementation(() => {});
    vi.spyOn(PcmAudioEngine.prototype, "stopMicCaptureOnly").mockImplementation(() => {});
    vi.spyOn(PcmAudioEngine.prototype, "stopAll").mockImplementation(() => {});
    vi.spyOn(PcmAudioEngine.prototype, "enqueuePcm24k").mockImplementation(() => {});
    vi.spyOn(PcmAudioEngine.prototype, "setOnDrained").mockImplementation((cb) => {
      pcmDrainCb = cb;
    });
    vi.spyOn(PcmAudioEngine.prototype, "markTurnComplete").mockImplementation(() => {
      pcmDrainCb?.();
    });
  });

  it("transitions to user_listening after clause_start + 0x03 Charon PCM + turn_done (never stuck on empty MP3 bucket)", async () => {
    const { result } = renderHook(() =>
      useLiveRobotConversation(
        {
          userName: "Esteban",
          cefrLevel: "B1",
          profession: "Developer",
          learningGoal: "Fluency",
        },
        true,
      ),
    );

    await act(async () => {
      await result.current.startCall();
    });

    expect(wsHandlers).toBeTruthy();

    await act(async () => {
      wsHandlers!.onJsonEvent({ type: "ready", mode: "pipeline" });
    });

    act(() => {
      wsHandlers!.onJsonEvent({ type: "clause_start", turnId: 1, clauseId: 1, text: "¡Hola Esteban!" });
      const pcmFrame = new Uint8Array([0x03, 0x00, 0x01, 0x02, 0x03]);
      wsHandlers!.onBinaryAudio(pcmFrame.buffer);
      wsHandlers!.onJsonEvent({ type: "clause_end", turnId: 1, clauseId: 1 });
      wsHandlers!.onJsonEvent({ type: "turn_done", turnId: 1, fullText: "¡Hola Esteban!" });
      wsHandlers!.onJsonEvent({ type: "phase", phase: "listening", turnId: 1 });
    });

    expect(result.current.phase).toBe("user_listening");
    expect(vadModes[vadModes.length - 1]).toBe("listening");
  });

  it("native_audio waits for queued PCM drain before listening and opens micModalOpen if hardware mic is muted", async () => {
    let mutedCb: (() => void) | undefined;
    let isPcmPending = true;
    vi.spyOn(PcmAudioEngine.prototype, "hasPendingOrPlaying", "get").mockImplementation(() => isPcmPending);
    vi.spyOn(PcmAudioEngine.prototype, "startMicCapture").mockImplementation(async (_onChunk, _onLvl, onMuted) => {
      mutedCb = onMuted;
      return true;
    });
    const markCompleteSpy = vi
      .spyOn(PcmAudioEngine.prototype, "markTurnComplete")
      .mockImplementation(() => {
        // Wait until explicit drain signal below
      });

    const { result } = renderHook(() =>
      useLiveRobotConversation(
        {
          userName: "Esteban",
          cefrLevel: "A1",
          profession: "Developer",
          learningGoal: "Daily Conversation",
        },
        true,
      ),
    );

    await act(async () => {
      await result.current.startCall();
    });
    await act(async () => {
      wsHandlers!.onJsonEvent({ type: "ready", mode: "native_audio" });
    });

    // Server sends turn_done while PCM chunks are still queued -> must wait for drain
    act(() => {
      const pcmFrame = new Uint8Array([0x03, 0x10, 0x20, 0x30, 0x40]);
      wsHandlers!.onBinaryAudio(pcmFrame.buffer);
      wsHandlers!.onJsonEvent({ type: "turn_done", fullText: "Hola Esteban!" });
    });

    expect(markCompleteSpy).toHaveBeenCalledTimes(1);
    expect(result.current.phase).toBe("robot_speaking");

    // Once PcmAudioEngine finishes playing queued audio, it fires onDrained -> user_listening
    act(() => {
      isPcmPending = false;
      pcmDrainCb?.();
    });
    expect(result.current.phase).toBe("user_listening");

    // OS/hardware mute detected -> cleanly stops call and opens recovery modal
    act(() => {
      mutedCb?.();
    });
    expect(result.current.micModalOpen).toBe(true);
    expect(result.current.phase).toBe("idle");
  });
});
