import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApiKeySetup } from "../useApiKeySetup";
import { providerKeyVault } from "../../../settings/services/providerKeyVault";
import * as providerConnectivity from "../../../settings/services/providerConnectivity";

describe("useApiKeySetup - Resilient Non-Blocking Verification", () => {
  beforeEach(async () => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("proceeds seamlessly when continuing with active key even if probe encounters network timeout", async () => {
    // Setup existing active key in vault
    await providerKeyVault.saveKey("groq", "gsk_existing_active_key");
    await providerKeyVault.saveActiveProviderId("groq");

    // Mock probe to return server connection error (the exact error user experienced)
    vi.spyOn(providerConnectivity, "probeProviderConnection").mockResolvedValue({
      ok: false,
      latencyMs: 120,
      message: "No se pudo conectar con el servidor. Revisa tu conexión a internet o usa Groq (100% gratis).",
    });

    const { result } = renderHook(() => useApiKeySetup());

    // Allow mount effect to detect existing key
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.hasExistingKey).toBe(true);
    expect(result.current.keyInput).toBe("");

    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.verifyAndSave(onSuccess);
    });

    // Wait for short delay before callback
    await act(async () => {
      await new Promise((r) => setTimeout(r, 250));
    });

    // User must NOT be blocked!
    expect(result.current.verificationError).toBeNull();
    expect(result.current.verifiedSuccessInfo).toContain("Motor activo confirmado");
    expect(onSuccess).toHaveBeenCalled();
  });

  it("handles network/server connection failure on new key by saving in direct mode rather than blocking", async () => {
    vi.spyOn(providerConnectivity, "probeProviderConnection").mockResolvedValue({
      ok: false,
      latencyMs: 150,
      message: "No se pudo conectar con el servidor. Revisa tu conexión a internet o usa Groq (100% gratis).",
    });

    const { result } = renderHook(() => useApiKeySetup());

    act(() => {
      result.current.setKeyInput("gsk_fresh_user_key_123");
    });

    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.verifyAndSave(onSuccess);
    });

    await act(async () => {
      await new Promise((r) => setTimeout(r, 650));
    });

    expect(result.current.verificationError).toBeNull();
    expect(result.current.verifiedSuccessInfo).toContain("Modo directo activo");
    expect(onSuccess).toHaveBeenCalled();
  });

  it("displays explicit validation error when key is genuinely rejected by provider (e.g. invalid key)", async () => {
    vi.spyOn(providerConnectivity, "probeProviderConnection").mockResolvedValue({
      ok: false,
      latencyMs: 100,
      message: "Clave de API inválida o expirada. Genera una nueva.",
    });

    const { result } = renderHook(() => useApiKeySetup());

    act(() => {
      result.current.setKeyInput("invalid_key_value");
    });

    const onSuccess = vi.fn();

    await act(async () => {
      await result.current.verifyAndSave(onSuccess);
    });

    expect(result.current.verificationError).toBe("Clave de API inválida o expirada. Genera una nueva.");
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
