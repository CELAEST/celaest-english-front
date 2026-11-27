import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LinguaLiveRobotView } from "../components/LinguaLiveRobotView";
import { splitConversationalSentences, BilingualVoicePipeline } from "../services/bilingualVoicePipeline";
import * as liveCoachAi from "../services/liveCoachAiService";
import { AudioCaptureService } from "../../conversation/services/audioCaptureService";
import { SupabaseAuthAdapter } from "../../../infrastructure/adapters/auth/SupabaseAuthAdapter";
import { ApiEntitlementRepository } from "../../../infrastructure/repositories/ApiEntitlementRepository";
import { DEFAULT_FREE_ENTITLEMENT } from "../../../domain/entities/ProductEntitlement";

describe("LinguaLiveRobotView — Solo Robot + 1 Button V1", () => {
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

  it("renders only the 3D Robot stage and single Iniciar button, transitions to Parar on start", async () => {
    vi.spyOn(AudioCaptureService, "initMicrophone").mockResolvedValue(true);
    vi.spyOn(AudioCaptureService, "startRecognition").mockReturnValue(null);
    vi.spyOn(BilingualVoicePipeline, "speakFluid").mockImplementation(async (text, onSentence) => {
      onSentence?.(text);
    });
    vi.spyOn(liveCoachAi, "generateOpeningTurn").mockResolvedValue(
      "Hey there! Si te trabas dime en español. What are you working on today?",
    );

    render(<LinguaLiveRobotView userName="Esteban" userLevel="B1" />);

    expect(screen.getByTestId("professor-3d-stage")).toBeTruthy();
    const startBtn = screen.getByRole("button", { name: /Iniciar/i });
    expect(startBtn).toBeTruthy();

    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Parar/i })).toBeTruthy();
    });
    expect(screen.getByText(/What are you working on today/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Parar/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Iniciar/i })).toBeTruthy();
    });
  });
});
