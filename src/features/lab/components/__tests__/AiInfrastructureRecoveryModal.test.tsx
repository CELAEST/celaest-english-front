import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AiInfrastructureRecoveryModal } from "../AiInfrastructureRecoveryModal";
import { ERROR_DATA } from "../AiEngineErrorsLuxuryStudio";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";

vi.mock("../../../settings/services/providerConnectivity", () => ({
  probeProviderConnection: vi.fn(async (_providerId: string, key: string) => {
    if (key.includes("invalid")) {
      return { ok: false, latencyMs: null, message: "Clave no válida o incompleta. Revisa que no falten caracteres." };
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
    expect(screen.getByText(/PROVEEDOR IA/i)).toBeInTheDocument();
    expect(screen.getByText(/BYOK Directo/i)).toBeInTheDocument();

    // Verify reassurance
    expect(
      screen.getByText(/Tu redacción permanece 100% intacta en el editor/i),
    ).toBeInTheDocument();

    // Verify ONLY Groq is rendered (no multi-provider picker)
    expect(screen.getAllByText(/Groq/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("button", { name: /Grok/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /OpenAI/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Claude/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Gemini/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /DeepSeek/i })).not.toBeInTheDocument();

    // Verify bottom action
    expect(screen.getByRole("button", { name: /Reanudar Ahora/i })).toBeInTheDocument();
  });

  it("displays Groq placeholder and hides alternative AI providers", () => {
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
    expect(input).toBeInTheDocument();
    expect(screen.queryByText(/Proveedor de inferencia:/i)).not.toBeInTheDocument();
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

  it("verifies and activates a valid key, persisting to vault at index 0, disabling central core, and triggering resume", async () => {
    await providerKeyVault.saveKey("groq", "gsk_stale_key_0");
    await providerKeyVault.setCentralCoreEnabled(true);

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

    // Wait for key to be persisted as primary key (index 0) and central core disabled
    await waitFor(async () => {
      const savedKey = await providerKeyVault.getKey("groq");
      expect(savedKey).toBe("gsk_test_valid_key_12345");
      expect(await providerKeyVault.isCentralCoreEnabled()).toBe(false);
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

  it("renders session renewal view without BYOK selector for jwt-expired-mid-interview and calls onReauth", () => {
    const onReauthMock = vi.fn();
    render(
      <AiInfrastructureRecoveryModal
        isOpen={true}
        scenario={ERROR_DATA["jwt-expired-mid-interview"]}
        cooldown={0}
        onClose={onCloseMock}
        onImmediateResume={onResumeMock}
        onReauth={onReauthMock}
      />,
    );

    expect(screen.queryByText(/Proveedor de inferencia:/i)).not.toBeInTheDocument();
    const reauthBtn = screen.getByRole("button", { name: /Iniciar Sesión \/ Renovar/i });
    fireEvent.click(reauthBtn);
    expect(onReauthMock).toHaveBeenCalledTimes(1);
    expect(onResumeMock).not.toHaveBeenCalled();
  });
});
