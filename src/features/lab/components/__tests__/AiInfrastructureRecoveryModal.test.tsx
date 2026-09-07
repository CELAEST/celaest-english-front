import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiInfrastructureRecoveryModal } from "../AiInfrastructureRecoveryModal";
import { ERROR_DATA } from "../AiEngineErrorsLuxuryStudio";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";

vi.mock("../../../settings/services/providerConnectivity", () => ({
  probeProviderConnection: vi.fn(async (_providerId: string, key: string) => {
    if (key.includes("invalid")) {
      return { ok: false, latencyMs: null, message: "Invalid API key" };
    }
    return { ok: true, latencyMs: 85, message: "Connected" };
  }),
}));

describe("AiInfrastructureRecoveryModal - Responsive & Real Use Cases", () => {
  const defaultScenario = ERROR_DATA["rate-limit-429"];
  const onResumeMock = vi.fn();
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders correctly with responsive structure, dials and headline", () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={14}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
        contextType="writing"
        bufferDetail={{ wordCount: 45 }}
      />,
    );

    // Verify header and eyebrow
    expect(screen.getByText(/RECUPERACIÓN INTELIGENTE · CELAEST LINGUA/i)).toBeInTheDocument();
    expect(screen.getByText(defaultScenario.humanHeadline)).toBeInTheDocument();

    // Verify dials for writing context
    expect(screen.getByText(/TU TEXTO/i)).toBeInTheDocument();
    expect(screen.getByText(/45 PALABRAS/i)).toBeInTheDocument();
    expect(screen.getByText(/14 seg/i)).toBeInTheDocument();

    // Verify reassurance
    expect(
      screen.getByText(/Tu redacción permanece 100% intacta en el editor/i),
    ).toBeInTheDocument();

    // Verify all 6 providers are available via their buttons
    expect(screen.getByRole("button", { name: /Groq/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Grok/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /OpenAI/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Claude/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Gemini/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /DeepSeek/i })).toBeInTheDocument();

    // Verify bottom action
    expect(screen.getByRole("button", { name: /Reanudar Ahora/i })).toBeInTheDocument();
  });

  it("switches provider when clicking a provider button and updates input placeholder", () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={0}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
      />,
    );

    // Click Claude
    const claudeBtn = screen.getByRole("button", { name: /Claude/i });
    fireEvent.click(claudeBtn);

    // Input placeholder should reflect Claude
    const input = screen.getByPlaceholderText(/Pega tu clave sk-ant-/i);
    expect(input).toBeInTheDocument();

    // Click Gemini
    const geminiBtn = screen.getByRole("button", { name: /Gemini/i });
    fireEvent.click(geminiBtn);
    expect(screen.getByPlaceholderText(/Pega tu clave AIza/i)).toBeInTheDocument();
  });

  it("toggles the inline help guide without clipping when clicking the info button", () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={0}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
      />,
    );

    const infoBtn = screen.getByTitle(/Ver cómo obtener tu clave/i);
    expect(screen.queryByText(/¿Cómo obtener tu clave de Groq\?/i)).not.toBeInTheDocument();

    // Open guide
    fireEvent.click(infoBtn);
    expect(screen.getByText(/¿Cómo obtener tu clave de Groq\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/100% Gratis/i).length).toBeGreaterThanOrEqual(1);

    // Close guide
    fireEvent.click(infoBtn);
    expect(screen.queryByText(/¿Cómo obtener tu clave de Groq\?/i)).not.toBeInTheDocument();
  });

  it("verifies and activates a valid key, persisting to vault and triggering resume", async () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={0}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
      />,
    );

    const input = screen.getByPlaceholderText(/Pega tu clave gsk_/i);
    fireEvent.change(input, { target: { value: "gsk_test_valid_key_12345" } });

    const activateBtn = screen.getByRole("button", { name: /Activar y Reanudar/i });
    await act(async () => {
      fireEvent.click(activateBtn);
    });

    // Wait for key to be persisted into vault
    await waitFor(async () => {
      const savedKey = await providerKeyVault.getKey("groq");
      expect(savedKey).toBe("gsk_test_valid_key_12345");
    });

    // Wait for the automatic resume timeout
    await waitFor(() => {
      expect(onResumeMock).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it("shows error feedback when an invalid key is provided", async () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={0}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
      />,
    );

    const input = screen.getByPlaceholderText(/Pega tu clave gsk_/i);
    fireEvent.change(input, { target: { value: "invalid_key" } });

    const activateBtn = screen.getByRole("button", { name: /Activar y Reanudar/i });
    await act(async () => {
      fireEvent.click(activateBtn);
    });

    expect(screen.getByText(/Clave no válida/i)).toBeInTheDocument();
    expect(onResumeMock).not.toHaveBeenCalled();
  });

  it("calls onImmediateResume when clicking Reanudar Ahora directly", () => {
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={defaultScenario}
        cooldown={14}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
      />,
    );

    const resumeBtn = screen.getByRole("button", { name: /Reanudar Ahora/i });
    fireEvent.click(resumeBtn);
    expect(onResumeMock).toHaveBeenCalled();
  });
});
