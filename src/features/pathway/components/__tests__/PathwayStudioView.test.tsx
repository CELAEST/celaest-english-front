import React from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import {fireEvent, render, screen,} from "@testing-library/react";
import { SpeechSynthesisService } from "../../../conversation/services/speechSynthesisService";
import { PathwayStudioView } from "../PathwayStudioView";

describe("PathwayStudioView — 1-on-1 Professor Live Class (Desktop & Unified Mobile)", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
  });

  it("mounts Professor stage in 0ms on Desktop under React.StrictMode and enforces voice policy before Bridge", async () => {
    const onNavigateModule = vi.fn();

    render(
      <React.StrictMode>
        <PathwayStudioView
          roleName="Cardiology Nurse"
          userLevel="A1"
          learningGoal="Learn English from the ground up"
          onNavigateModule={onNavigateModule}
        />
      </React.StrictMode>,
    );

    expect(screen.queryByTestId("pathway-skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("professor-3d-stage")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /1\. La Regla/i })).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("button", { name: /Practicar con el Profesor/i }));
    expect(screen.getByTestId("pathway-assembly-zone")).toBeInTheDocument();

    for (const token of ["I", "learn", "English", "today"]) {
      fireEvent.click(screen.getByRole("button", { name: token }));
    }

    const continueToVoiceBtn = await screen.findByRole("button", { name: /Decírsela al Profesor/i });
    fireEvent.click(continueToVoiceBtn);

    // Sentence continuity: Step 3 matches Step 2 ("I learn English today.")
    expect(screen.getAllByText(/“I learn English today\.”/i).length).toBeGreaterThanOrEqual(1);

    // Silent skip is hidden initially before mic attempt
    expect(screen.queryByRole("button", { name: /Modo silencioso/i })).not.toBeInTheDocument();

    // Attempting mic in headless environment without hardware unlocks silent fallback
    fireEvent.click(screen.getByRole("button", { name: /Hablarle al Profesor/i }));

    const silentBtn = await screen.findByRole("button", { name: /Modo silencioso/i }, { timeout: 12000 });
    fireEvent.click(silentBtn);

    // El cartel de "base conquistada" ya no se muestra: esperamos la senal real del flujo.
    const bridgeBtn = await screen.findByRole("button", { name: /Ir a practicarlo en Reading/i });
    expect(screen.queryByText(/Base conquistada y guardada en tu progreso/i)).not.toBeInTheDocument();
    fireEvent.click(bridgeBtn);
    expect(onNavigateModule).toHaveBeenCalledWith("reading");
  });

  it("renders dynamic Live Board on Desktop on the left side of Liam with synchronized scenes", async () => {
    localStorage.setItem("celaest:tutor:software_explained:v2", "1");

    render(
      <PathwayStudioView
        roleName="Product Designer"
        userLevel="A1"
        learningGoal="Speak fluently in tech demos"
      />,
    );

    expect(screen.getByTestId("desktop-live-rule-stage")).toBeInTheDocument();
    expect(screen.getByTestId("professor-3d-stage")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Clase/i })).toBeInTheDocument();
    expect(screen.getByTestId("live-formula-scene")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /2 Trampa/i }));
    expect(screen.getByTestId("live-trap-scene")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Reto/i }));
    expect(screen.getByTestId("live-trap-check-scene")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /I work every day\./i }));
    expect(screen.getByText(/¡Exacto!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /4 Ejemplos/i }));
    expect(screen.getByTestId("live-examples-scene")).toBeInTheDocument();
  });

  it("keeps Liam visible 100% of the time on Mobile across Live Formula -> Trap -> Trap Check -> Examples -> BUILD -> SPEAK", async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 390 });
    window.dispatchEvent(new Event("resize"));
    localStorage.setItem("celaest:tutor:software_explained:v2", "1");

    render(
      <PathwayStudioView
        roleName="Civil Architect"
        userLevel="A1"
        learningGoal="Speak confidently at work"
      />,
    );

    expect(screen.getByTestId("professor-3d-stage")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /1\. Regla/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("live-formula-scene")).toBeInTheDocument();

    // Switch to live Trap surgery scene
    fireEvent.click(screen.getByRole("tab", { name: /2 Trampa/i }));
    expect(screen.getByTestId("live-trap-scene")).toBeInTheDocument();

    // Switch to interleaved Retention Trap Check ("Caza la Trampa") and solve it
    fireEvent.click(screen.getByRole("tab", { name: /Reto/i }));
    expect(screen.getByTestId("live-trap-check-scene")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /I work every day\./i }));
    expect(screen.getByText(/¡Exacto!/i)).toBeInTheDocument();

    // Switch to live Examples karaoke scene
    fireEvent.click(screen.getByRole("tab", { name: /4 Ejemplos/i }));
    expect(screen.getByTestId("live-examples-scene")).toBeInTheDocument();

    // Advance to BUILD inside the same mobile card while Liam stays mounted
    fireEvent.click(screen.getByRole("button", { name: /Construir la Regla/i }));
    expect(screen.getByTestId("professor-3d-stage")).toBeInTheDocument();
    expect(screen.getByTestId("pathway-assembly-zone")).toBeInTheDocument();

    for (const token of ["I", "learn", "English", "today"]) {
      fireEvent.click(screen.getByRole("button", { name: token }));
    }

    fireEvent.click(await screen.findByRole("button", { name: /Decírsela al Profesor/i }));
    expect(screen.getByTestId("professor-3d-stage")).toBeInTheDocument();
    expect(screen.getByText(/“I learn English today\.”/i)).toBeInTheDocument();
  });

  it("renders obsidian mute toggle in Liam corner on Desktop & Mobile and mutes in-place without pausing flow", async () => {
    localStorage.setItem("celaest:tutor:software_explained:v2", "1");
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
    window.dispatchEvent(new Event("resize"));

    const stopSpy = vi.spyOn(SpeechSynthesisService, "stop");
    const createdAudios: Array<{ muted: boolean; volume: number; onended: (() => void) | null; play: ReturnType<typeof vi.fn> }> = [];
    const OriginalAudio = globalThis.Audio;
    globalThis.Audio = vi.fn().mockImplementation(() => {
      const mockAudio: any = {
        muted: false,
        volume: 1,
        playbackRate: 1,
        preload: "auto",
        readyState: 4,
        paused: false,
        ended: false,
        onplay: null,
        onended: null,
        onerror: null,
        setAttribute: vi.fn(),
        pause: vi.fn(),
        play: vi.fn().mockResolvedValue(undefined),
      };
      createdAudios.push(mockAudio);
      return mockAudio;
    }) as unknown as typeof Audio;

    try {
      const { unmount } = render(
        <PathwayStudioView roleName="Physician" userLevel="A1" learningGoal="Clinical English" />,
      );

      stopSpy.mockClear();
      const desktopMuteBtn = screen.getByRole("button", { name: /Silenciar voz de Liam/i });
      fireEvent.click(desktopMuteBtn);
      expect(SpeechSynthesisService.isMuted()).toBe(true);
      expect(stopSpy).not.toHaveBeenCalled();
      expect(screen.getByRole("button", { name: /Activar voz de Liam/i })).toHaveAttribute("aria-pressed", "true");

      // While muted, speak() STILL executes audio silently (muted=true, volume=0) so lecture flow & timing never pause
      const onEnd = vi.fn();
      await SpeechSynthesisService.speak("I work every day.", { voice: "liam", onEnd });
      const lastAudio = createdAudios[createdAudios.length - 1];
      expect(lastAudio).toBeDefined();
      expect(lastAudio!.muted).toBe(true);
      expect(lastAudio!.volume).toBe(0);
      expect(lastAudio!.play).toHaveBeenCalledTimes(1);

      // Unmuting mid-segment restores live volume immediately without stopping playback
      fireEvent.click(screen.getByRole("button", { name: /Activar voz de Liam/i }));
      expect(SpeechSynthesisService.isMuted()).toBe(false);
      expect(lastAudio!.muted).toBe(false);
      expect(lastAudio!.volume).toBe(1);
      lastAudio!.onended?.();
      expect(onEnd).toHaveBeenCalledTimes(1);
      unmount();

      // Verify Mobile corner button also renders synced mute state cleanly
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 390 });
      window.dispatchEvent(new Event("resize"));
      SpeechSynthesisService.setMuted(true);
      render(<PathwayStudioView roleName="Physician" userLevel="A1" learningGoal="Clinical English" />);
      const mobileMuteBtn = screen.getByRole("button", { name: /Activar voz de Liam/i });
      expect(mobileMuteBtn).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(mobileMuteBtn);
      expect(SpeechSynthesisService.isMuted()).toBe(false);
    } finally {
      globalThis.Audio = OriginalAudio;
      stopSpy.mockRestore();
      SpeechSynthesisService.setMuted(false);
    }
  });
});
