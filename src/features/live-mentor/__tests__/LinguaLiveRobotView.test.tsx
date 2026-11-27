import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LinguaLiveRobotView } from "../components/LinguaLiveRobotView";
import { splitConversationalSentences, BilingualVoicePipeline } from "../services/bilingualVoicePipeline";
import * as liveCoachAi from "../services/liveCoachAiService";
import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { DEFAULT_FREE_ENTITLEMENT } from "../../../domain/entities/ProductEntitlement";

describe("LinguaLiveRobotView — Golden-Ratio Stage & Cinema Mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
  });

  it("splits bilingual sentences cleanly for zero-gap streaming", () => {
    const parts = splitConversationalSentences(
      "Hola Esteban! Today let's talk about your project. What are you building right now?",
    );
    expect(parts).toEqual([
      "Hola Esteban!",
      "Today let s talk about your project.",
      "What are you building right now?",
    ]);
  });

  it("renders centered Robot with Iniciar/Parar and triggers Cinema Mode active state", async () => {
    const onCallActiveChange = vi.fn();
    vi.spyOn(AudioCaptureService, "initMicrophone").mockResolvedValue(true);
    vi.spyOn(AudioCaptureService, "startRecognition").mockReturnValue(null);
    vi.spyOn(BilingualVoicePipeline, "speakFluid").mockResolvedValue();
    vi.spyOn(liveCoachAi, "generateOpeningTurn").mockResolvedValue(
      "Hey there! What are you working on today?",
    );

    const { rerender } = render(
      <LinguaLiveRobotView
        userName="Esteban"
        userLevel="B1"
        isActive={true}
        onCallActiveChange={onCallActiveChange}
      />,
    );

    expect(screen.getByTestId("professor-3d-stage")).toBeTruthy();
    const startBtn = screen.getByRole("button", { name: /Iniciar/i });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Parar/i })).toBeTruthy();
    });
    expect(onCallActiveChange).toHaveBeenCalledWith(true);

    // Navigating to another module via sidebar (isActive=false) cleanly stops the call
    rerender(
      <LinguaLiveRobotView
        userName="Esteban"
        userLevel="B1"
        isActive={false}
        onCallActiveChange={onCallActiveChange}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Iniciar/i })).toBeTruthy();
    });
    expect(onCallActiveChange).toHaveBeenLastCalledWith(false);
  });
});
